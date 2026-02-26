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
        this.socket = null; // Placeholder for signaling socket
    }

    async startDiscovery(roomID, signalingUrl = 'wss://signaling.peerverse.io') {
        console.log(`Connecting to signaling server for room: ${roomID}`);
        // In a real implementation:
        // this.socket = new WebSocket(`${signalingUrl}/${roomID}`);
        // this.socket.onmessage = (msg) => this.handleSignaling(JSON.parse(msg.data));

        // Simulating finding a peer for demonstration
        setTimeout(() => {
            this.handlePeerDiscovery('simulated-peer-id');
        }, 2000);
    }

    announce(roomID) {
        console.log(`Announcing presence in room: ${roomID} as ${this.identity.id}`);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'ANNOUNCE', peerID: this.identity.id }));
        }
    }

    handlePeerDiscovery(peerID) {
        if (peerID !== this.identity.id && !this.peers.has(peerID)) {
            this.peers.add(peerID);
            console.log(`New peer discovered: ${peerID}`);
            if (this.onPeerFound) this.onPeerFound(peerID);
        }
    }

    sendSignal(peerID, signal) {
        console.log(`Sending signal to ${peerID}`);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'SIGNAL', to: peerID, from: this.identity.id, signal }));
        }
    }

    handleIncomingSignal(from, signal) {
        if (this.onSignal) this.onSignal(from, signal);
    }
}
