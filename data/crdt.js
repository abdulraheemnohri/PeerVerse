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
            whiteboard: [],
            notes: "",
            polls: [],
            handRaised: new Set()
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
            case 'NOTES_UPDATE':
                this.state.notes = change.notes;
                break;
            case 'POLL_ADD':
                this.state.polls.push(change.poll);
                break;
            case 'HAND_RAISE':
                if (change.raised) this.state.handRaised.add(change.id);
                else this.state.handRaised.delete(change.id);
                break;
        }
        if (this.onUpdate) this.onUpdate(this.state);
    }

    updateNotes(notes) {
        this.state.notes = notes;
        this.broadcastStateChange({ type: 'NOTES_UPDATE', notes });
    }

    createPoll(question, options) {
        const poll = { id: Math.random(), question, options, results: options.map(() => 0) };
        this.state.polls.push(poll);
        this.broadcastStateChange({ type: 'POLL_ADD', poll });
    }

    toggleHand(id, raised) {
        if (raised) this.state.handRaised.add(id);
        else this.state.handRaised.delete(id);
        this.broadcastStateChange({ type: 'HAND_RAISE', id, raised });
    }

    broadcastStateChange(change) {
        this.transport.broadcast({
            type: 'CRDT_SYNC',
            payload: change
        });
    }
}
