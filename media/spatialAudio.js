/**
 * PeerVerse Spatial Audio Layer
 * 3D audio panning.
 */

export class SpatialAudio {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.panners = new Map(); // peerID -> PannerNode
    }

    addPeer(peerID, stream) {
        const source = this.audioCtx.createMediaStreamSource(stream);
        const panner = this.audioCtx.createPanner();
        panner.panningModel = 'HRTF';
        source.connect(panner);
        panner.connect(this.audioCtx.destination);
        this.panners.set(peerID, panner);
    }

    updatePosition(peerID, x, y, z) {
        const panner = this.panners.get(peerID);
        if (panner) {
            panner.setPosition(x, y, z);
        }
    }
}
