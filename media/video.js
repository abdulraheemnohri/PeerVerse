/**
 * PeerVerse Video Layer
 * Video capture & grid management.
 */

export class VideoHandler {
    constructor() {
        this.stream = null;
    }

    async getVideoStream() {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return this.stream;
    }

    toggleVideo(enabled) {
        if (this.stream) {
            this.stream.getVideoTracks().forEach(track => track.enabled = enabled);
        }
    }

    async applyVirtualBackground(image) {
        console.log(`Applying virtual background with: ${image}`);
    }

    renderToGrid(peerID, stream, container) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.id = `peer-video-${peerID}`;
        container.appendChild(video);
    }
}
