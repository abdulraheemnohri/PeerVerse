/**
 * PeerVerse Files Layer
 * File transfer logic.
 */

export class Files {
    constructor(transport) {
        this.transport = transport;
        this.CHUNK_SIZE = 16384;
    }

    async sendFile(file, peerID) {
        const reader = new FileReader();
        let offset = 0;

        reader.onload = async () => {
            const chunk = reader.result;
            await this.transport.sendChunk(peerID, chunk);
            offset += chunk.byteLength;
            if (offset < file.size) {
                readNextChunk();
            }
        };

        const readNextChunk = () => {
            const slice = file.slice(offset, offset + this.CHUNK_SIZE);
            reader.readAsArrayBuffer(slice);
        };

        readNextChunk();
    }

    receiveChunk(peerID, chunk) {
        // Collect chunks and rebuild file
    }
}
