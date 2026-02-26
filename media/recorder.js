/**
 * PeerVerse Recorder Layer
 * Local recording.
 */

export class Recorder {
    constructor(stream) {
        this.stream = stream;
        this.mediaRecorder = null;
        this.chunks = [];
    }

    start() {
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
        this.mediaRecorder.start();
    }

    stop() {
        return new Promise((resolve) => {
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: 'video/webm' });
                resolve(blob);
            };
            this.mediaRecorder.stop();
        });
    }
}
