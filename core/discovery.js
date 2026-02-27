/**
 * PeerVerse Discovery Layer
 * Handles peer discovery using a signaling server or local broadcast.
 */

export class Discovery {
    constructor(identity) {
        this.identity = identity;
        this.peers = new Set();
        this.onPeerFound = null;
        this.onSignal = null;
        this.socket = null;
        this.isSimulated = true;
    }

    async startDiscovery(roomID, signalingUrl = 'wss://signaling.peerverse.io') {
        this.currentRoom = roomID;
        console.log(`[Discovery] Initializing room: ${roomID}`);

        if (this.isSimulated) {
            this.simulateNetwork();
        } else {
            // this.socket = new WebSocket(`${signalingUrl}/${roomID}`);
            // this.socket.onmessage = (msg) => this.handleSignaling(JSON.parse(msg.data));
        }
    }

    simulateNetwork() {
        console.log("[Discovery] Simulation mode active. Waiting for peers...");
        // In simulation mode, we mock the arrival of other users
        const demoPeers = ['Alpha-Peer', 'Beta-Peer'];

        demoPeers.forEach((peer, index) => {
            setTimeout(() => {
                this.handlePeerDiscovery(peer);
            }, 3000 * (index + 1));
        });
    }

    announce(roomID) {
        console.log(`[Discovery] Announcing ${this.identity.id} to ${roomID}`);
        if (this.socket && this.socket.readyState === 1) {
            this.socket.send(JSON.stringify({ type: 'ANNOUNCE', peerID: this.identity.id }));
        }
    }

    handlePeerDiscovery(peerID) {
        if (peerID !== this.identity.id && !this.peers.has(peerID)) {
            this.peers.add(peerID);
            console.log(`[Discovery] Peer found: ${peerID}`);
            if (this.onPeerFound) this.onPeerFound(peerID);
        }
    }

    sendSignal(peerID, signal) {
        console.log(`[Discovery] Signaling relay to ${peerID}`);
        if (this.socket && this.socket.readyState === 1) {
            this.socket.send(JSON.stringify({ type: 'SIGNAL', to: peerID, from: this.identity.id, signal }));
        } else if (this.isSimulated) {
            // Echo back for demo loopback testing if needed
            // this.handleIncomingSignal(peerID, signal);
        }
    }

    handleIncomingSignal(from, signal) {
        if (this.onSignal) this.onSignal(from, signal);
    }

    moveToRoom(newRoomID) {
        console.log(`[Discovery] Transitioning to room: ${newRoomID}`);
        this.peers.clear();
        this.startDiscovery(newRoomID);
    }
}
