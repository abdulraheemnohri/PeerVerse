/**
 * PeerVerse Chat Layer
 * Text & markdown chat.
 */
import { Storage } from '../utils/storage.js';

export class Chat {
    constructor(transport) {
        this.transport = transport;
        this.messages = Storage.getChat();
    }

    sendMessage(text, type = 'text') {
        const message = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            text,
            type,
            sender: this.transport.identity.id,
            timestamp: Date.now()
        };
        this.messages.push(message);
        Storage.saveChat(this.messages);
        this.transport.broadcast({ type: 'CHAT_MESSAGE', payload: message });
    }

    receiveMessage(message) {
        this.messages.push(message);
        Storage.saveChat(this.messages);
    }

    async sendFile(file) {
        console.log(`Sending file: ${file.name}`);
    }
}
