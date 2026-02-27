/**
 * PeerVerse Constants
 */

export const DEFAULT_ROOM_ID = 'peerverse-main';
export const DEFAULT_STUN_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
];

export const MSG_TYPES = {
    CHAT: 'CHAT_MESSAGE',
    SIGNAL: 'SIGNALING',
    SYNC: 'ROOM_SYNC',
    GOVERNANCE: 'GOVERNANCE_PROPOSAL'
};

export const CHUNK_SIZE = 16384; // 16KB for RTCDataChannel
