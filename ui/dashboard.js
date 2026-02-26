/**
 * PeerVerse Main UI Controller
 */

import { Identity } from '../core/identity.js';
import { Discovery } from '../core/discovery.js';
import { Transport } from '../core/transport.js';
import { VideoHandler } from '../media/video.js';
import { ProfileUI } from './profile/profile.js';
import { SettingsUI } from './settings.js';
import { Chat } from '../data/chat.js';
import { ChatPanel } from './chatPanel.js';
import { ParticipantPanel } from './participantPanel.js';
import { CRDT } from '../data/crdt.js';
import { SpeechToText } from '../ai/speechToText.js';

class PeerVerseApp {
    constructor() {
        this.identity = new Identity();
        this.discovery = null;
        this.transport = null;
        this.videoHandler = new VideoHandler();
        this.profileUI = null;
        this.settingsUI = new SettingsUI();
        this.chat = null;
        this.chatPanel = null;
        this.participantPanel = null;
        this.crdt = null;
        this.stt = new SpeechToText();
        this.isSTTActive = false;
        this.roomID = 'main-room';
    }

    async init() {
        const { id } = await this.identity.initialize();
        document.getElementById('user-id').textContent = id.slice(0, 8);

        this.discovery = new Discovery(this.identity);
        this.transport = new Transport(this.identity, this.discovery);
        this.profileUI = new ProfileUI(this.identity);

        this.chat = new Chat(this.transport);
        this.crdt = new CRDT(this.roomID, this.transport);

        this.chatPanel = new ChatPanel(this.chat, document.getElementById('chat-panel'));
        this.participantPanel = new ParticipantPanel(document.getElementById('participant-panel'));

        this.setupP2PHooks();
        this.setupEventListeners();
        await this.startMedia();
    }

    setupP2PHooks() {
        this.discovery.onPeerFound = (peerID) => {
            this.transport.connectToPeer(peerID, true);
        };

        this.discovery.onSignal = (from, signal) => {
            this.transport.handleSignal(from, signal);
        };

        this.transport.onData = (peerID, data) => {
            if (data.type === 'CHAT_MESSAGE') {
                this.chat.receiveMessage(data.payload);
                this.chatPanel.addMessage(data.payload);
            } else if (data.type === 'CRDT_SYNC') {
                this.crdt.applyRemoteChange(data.payload);
                this.updateUIFromCRDT();
            }
        };

        this.transport.onStream = (peerID, stream) => {
            this.videoHandler.renderToGrid(peerID, stream, document.getElementById('video-grid'));
        };

        this.crdt.onUpdate = () => this.updateUIFromCRDT();
    }

    updateUIFromCRDT() {
        // Update participant list
        Object.entries(this.crdt.state.participants).forEach(([id, profile]) => {
            this.participantPanel.addParticipant(id, profile);
        });
    }

    setupEventListeners() {
        document.getElementById('edit-profile').addEventListener('click', () => {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'profile-modal-container';
            modalContainer.innerHTML = this.profileUI.render();
            document.body.appendChild(modalContainer);

            document.getElementById('profile-close').addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });

            document.getElementById('profile-save').addEventListener('click', () => {
                this.profileUI.save();
                document.body.removeChild(modalContainer);
                // Broadcast profile update
                this.crdt.updateParticipant(this.identity.id, this.profileUI.profile);
            });
        });

        document.getElementById('join-room').addEventListener('click', () => {
            this.discovery.startDiscovery(this.roomID);
            this.discovery.announce(this.roomID);
        });

        document.getElementById('toggle-mic').addEventListener('click', () => {
            console.log('Toggle mic');
        });

        document.getElementById('toggle-video').addEventListener('click', () => {
            console.log('Toggle video');
        });

        document.getElementById('toggle-stt').addEventListener('click', () => {
            if (this.isSTTActive) {
                this.stt.stop();
                document.getElementById('toggle-stt').textContent = 'Start Captions';
            } else {
                this.stt.start((transcript) => {
                    console.log("Caption:", transcript);
                });
                document.getElementById('toggle-stt').textContent = 'Stop Captions';
            }
            this.isSTTActive = !this.isSTTActive;
        });

        document.getElementById('settings').addEventListener('click', () => {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'settings-modal-container';
            modalContainer.innerHTML = this.settingsUI.render();
            document.body.appendChild(modalContainer);

            document.getElementById('settings-close').addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                this.settingsUI.save();
                document.body.removeChild(modalContainer);
            });
        });
    }

    async startMedia() {
        const stream = await this.videoHandler.getVideoStream();
        const container = document.getElementById('video-grid');
        this.videoHandler.renderToGrid('local', stream, container);
    }
}

const app = new PeerVerseApp();
app.init().catch(console.error);
