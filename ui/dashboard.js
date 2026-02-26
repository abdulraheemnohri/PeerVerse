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
import { Governance, ROLES } from '../core/governance.js';

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
        this.governance = null;
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

        this.settingsUI.onModeChange = (mode) => this.applyAppMode(mode);

        this.chat = new Chat(this.transport);
        this.crdt = new CRDT(this.roomID, this.transport);
        this.governance = new Governance(this.transport);

        // Default role
        this.governance.setRole(this.identity.id, ROLES.ADMIN);

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
            } else if (data.type === 'GOVERNANCE_ACTION') {
                this.handleGovernanceAction(data.payload);
            }
        };

        this.transport.onStream = (peerID, stream) => {
            this.videoHandler.renderToGrid(peerID, stream, document.getElementById('video-grid'));
        };

        this.crdt.onUpdate = () => this.updateUIFromCRDT();
    }

    handleGovernanceAction(action) {
        console.log("Governance action received:", action);
        if (action.type === 'KICK' && action.target === this.identity.id) {
            alert("You have been kicked from the room.");
            window.location.reload();
        } else if (action.type === 'MUTE' && action.target === this.identity.id) {
            console.log("You have been muted by a moderator.");
            // Logic to mute local mic
        }
    }

    updateUIFromCRDT() {
        // Update participant list
        Object.entries(this.crdt.state.participants).forEach(([id, profile]) => {
            this.participantPanel.addParticipant(id, profile);
        });

        // Update shared notes if in office mode
        const notesArea = document.getElementById('shared-notes');
        if (notesArea && document.activeElement !== notesArea) {
            notesArea.value = this.crdt.state.notes;
        }
    }

    applyAppMode(mode) {
        console.log(`Applying app mode: ${mode}`);
        const header = document.querySelector('header h1');
        const notesPanel = document.getElementById('notes-panel');

        switch(mode) {
            case 'office':
                header.textContent = 'PeerVerse Office';
                document.body.classList.add('mode-office');
                notesPanel.style.display = 'flex';
                break;
            case 'education':
                header.textContent = 'PeerVerse Classroom';
                document.body.classList.add('mode-education');
                notesPanel.style.display = 'none';
                break;
            default:
                header.textContent = 'PeerVerse';
                document.body.classList.remove('mode-office', 'mode-education');
                notesPanel.style.display = 'none';
        }
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

        const notesArea = document.getElementById('shared-notes');
        if (notesArea) {
            notesArea.addEventListener('input', (e) => {
                this.crdt.updateNotes(e.target.value);
            });
        }
    }

    async startMedia() {
        const stream = await this.videoHandler.getVideoStream();
        const container = document.getElementById('video-grid');
        this.videoHandler.renderToGrid('local', stream, container);
    }
}

const app = new PeerVerseApp();
app.init().catch(console.error);
