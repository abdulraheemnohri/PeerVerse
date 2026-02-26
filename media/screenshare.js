/**
 * PeerVerse Screen Share Layer
 * Screen share + annotation.
 */

export class ScreenShare {
    constructor() {
        this.stream = null;
    }

    async startCapture() {
        this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        return this.stream;
    }

    addAnnotation(ctx, x, y, type) {
        console.log(`Adding annotation at ${x}, ${y} of type ${type}`);
    }
}
