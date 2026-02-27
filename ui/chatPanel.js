/**
 * PeerVerse Chat Panel UI
 */

export class ChatPanel {
    constructor(chat, container) {
        this.chat = chat;
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <h3>Chat</h3>
            <div id="messages-list" style="flex: 1; overflow-y: auto; padding-bottom: 1rem;"></div>
            <div id="message-input-container" style="display: flex; gap: 0.5rem;">
                <input type="text" id="message-input" placeholder="Type a message..." style="flex: 1; background: #333; border: none; padding: 0.5rem; color: #fff; border-radius: 4px;">
                <button id="send-btn" style="background: #2196F3; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Send</button>
            </div>
        `;
    }

    addMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message';
        msgDiv.style.padding = '0.25rem 0';

        const senderSpan = document.createElement('strong');
        senderSpan.textContent = `${message.sender.slice(0, 8)}: `;

        const textSpan = document.createElement('span');
        textSpan.textContent = message.text;

        msgDiv.appendChild(senderSpan);
        msgDiv.appendChild(textSpan);

        const list = document.getElementById('messages-list');
        list.appendChild(msgDiv);
        list.scrollTop = list.scrollHeight;
    }
}
