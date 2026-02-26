/**
 * PeerVerse CRDT Layer
 * Distributed room state (chat, notes, polls).
 */

export class CRDT {
    constructor(roomID, transport) {
        this.roomID = roomID;
        this.transport = transport;
        this.state = {
            participants: {}, // id -> profile
            chat: [],
            whiteboard: []
        };
        this.onUpdate = null;
    }

    initialize() {
        console.log(`Initializing CRDT state for room ${this.roomID}`);
    }

    updateParticipant(id, profile) {
        this.state.participants[id] = profile;
        this.broadcastStateChange({ type: 'PARTICIPANT_UPDATE', id, profile });
        if (this.onUpdate) this.onUpdate(this.state);
    }

    addChatMessage(message) {
        this.state.chat.push(message);
        this.broadcastStateChange({ type: 'CHAT_ADD', message });
        if (this.onUpdate) this.onUpdate(this.state);
    }

    applyRemoteChange(change) {
        console.log("Applying remote CRDT change:", change);
        switch (change.type) {
            case 'PARTICIPANT_UPDATE':
                this.state.participants[change.id] = change.profile;
                break;
            case 'CHAT_ADD':
                this.state.chat.push(change.message);
                break;
        }
        if (this.onUpdate) this.onUpdate(this.state);
    }

    broadcastStateChange(change) {
        this.transport.broadcast({
            type: 'CRDT_SYNC',
            payload: change
        });
    }
}
