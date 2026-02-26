/**
 * PeerVerse Transport Layer
 * Manages WebRTC connections & signaling.
 */

export class Transport {
    constructor(identity, discovery) {
        this.identity = identity;
        this.discovery = discovery;
        this.connections = new Map(); // peerID -> RTCPeerConnection
        this.dataChannels = new Map(); // peerID -> RTCDataChannel
        this.onStream = null;
        this.onData = null;
    }

    async connectToPeer(peerID, isInitiator = false) {
        if (this.connections.has(peerID)) return;

        console.log(`Establishing WebRTC connection to peer: ${peerID}, initiator: ${isInitiator}`);
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        this.connections.set(peerID, pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.discovery.sendSignal(peerID, { candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            console.log(`Received remote stream from ${peerID}`);
            if (this.onStream) this.onStream(peerID, event.streams[0]);
        };

        if (isInitiator) {
            const dataChannel = pc.createDataChannel("peerverse-data");
            this.setupDataChannel(peerID, dataChannel);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            this.discovery.sendSignal(peerID, { sdp: offer });
        } else {
            pc.ondatachannel = (event) => {
                this.setupDataChannel(peerID, event.channel);
            };
        }
    }

    async handleSignal(peerID, signal) {
        const pc = this.connections.get(peerID);
        if (!pc) return;

        if (signal.sdp) {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            if (pc.remoteDescription.type === 'offer') {
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                this.discovery.sendSignal(peerID, { sdp: answer });
            }
        } else if (signal.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
    }

    setupDataChannel(peerID, channel) {
        this.dataChannels.set(peerID, channel);
        channel.onopen = () => console.log(`Data channel open for peer: ${peerID}`);
        channel.onmessage = (event) => {
            if (this.onData) this.onData(peerID, JSON.parse(event.data));
        };
        channel.onclose = () => {
            this.dataChannels.delete(peerID);
            this.connections.delete(peerID);
            console.log(`Data channel closed for peer: ${peerID}`);
        };
    }

    broadcast(data) {
        const message = JSON.stringify(data);
        this.dataChannels.forEach((channel, peerID) => {
            if (channel.readyState === 'open') {
                channel.send(message);
            }
        });
    }

    sendToPeer(peerID, data) {
        const channel = this.dataChannels.get(peerID);
        if (channel && channel.readyState === 'open') {
            channel.send(JSON.stringify(data));
        }
    }
}
