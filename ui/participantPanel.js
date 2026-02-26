/**
 * PeerVerse Participant Panel UI
 */

export class ParticipantPanel {
    constructor(container) {
        this.container = container;
        this.participants = new Map();
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <h3>Participants (<span id="participant-count">0</span>)</h3>
            <ul id="participant-list" style="list-style: none; padding: 0;"></ul>
        `;
    }

    addParticipant(peerID, profile) {
        this.participants.set(peerID, profile);
        this.updateList();
    }

    removeParticipant(peerID) {
        this.participants.delete(peerID);
        this.updateList();
    }

    updateList() {
        const list = document.getElementById('participant-list');
        list.innerHTML = '';
        this.participants.forEach((profile, peerID) => {
            const li = document.createElement('li');
            li.style.padding = '0.5rem 0';

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '0.5rem';

            const avatar = document.createElement('div');
            avatar.style.width = '24px';
            avatar.style.height = '24px';
            avatar.style.background = '#444';
            avatar.style.borderRadius = '50%';

            const name = document.createElement('span');
            name.textContent = profile?.displayName || peerID.slice(0, 8);

            container.appendChild(avatar);
            container.appendChild(name);
            li.appendChild(container);
            list.appendChild(li);
        });
        document.getElementById('participant-count').textContent = this.participants.size;
    }
}
