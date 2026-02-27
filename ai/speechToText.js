/**
 * PeerVerse Speech to Text AI Layer
 */

export class SpeechToText {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'en-US';
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }

    start(onResult) {
        if (!this.recognition) return;

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            if (onResult) onResult(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        this.recognition.start();
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
