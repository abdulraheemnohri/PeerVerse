/**
 * PeerVerse Files Layer
 * File transfer logic.
 */

export class Files {
    constructor(transport) {
        this.transport = transport;
        this.CHUNK_SIZE = 16384;
        this.receivingFiles = new Map(); // peerID -> { fileName, chunks, totalSize }
    }

    async sendFile(file, peerID) {
        console.log(`Sending ${file.name} to ${peerID}`);

        // Initial handshake
        this.transport.sendToPeer(peerID, {
            type: 'FILE_START',
            payload: { name: file.name, size: file.size, type: file.type }
        });

        const reader = new FileReader();
        let offset = 0;

        reader.onload = async () => {
            const chunk = reader.result;
            this.transport.sendChunk(peerID, chunk);
            offset += chunk.byteLength;

            if (offset < file.size) {
                readNextChunk();
            } else {
                this.transport.sendToPeer(peerID, { type: 'FILE_END', payload: { name: file.name } });
            }
        };

        const readNextChunk = () => {
            const slice = file.slice(offset, offset + this.CHUNK_SIZE);
            reader.readAsArrayBuffer(slice);
        };

        readNextChunk();
    }

    handleIncomingFile(peerID, data) {
        if (data.type === 'FILE_START') {
            this.receivingFiles.set(peerID, {
                name: data.payload.name,
                chunks: [],
                size: data.payload.size
            });
        } else if (data.type === 'FILE_END') {
            const fileData = this.receivingFiles.get(peerID);
            const blob = new Blob(fileData.chunks);
            const url = URL.createObjectURL(blob);
            console.log(`File received: ${fileData.name}. Download at ${url}`);
            this.receivingFiles.delete(peerID);
        }
    }

    receiveChunk(peerID, chunk) {
        const fileData = this.receivingFiles.get(peerID);
        if (fileData) {
            fileData.chunks.push(chunk);
        }
    }
}
