/**
 * PeerVerse Governance Layer
 * Handles voting, relay election, and role-based permissions.
 */

export const ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    SPEAKER: 'speaker',
    VIEWER: 'viewer'
};

export class Governance {
    constructor(transport) {
        this.transport = transport;
        this.votes = new Map();
        this.roles = new Map(); // peerID -> role
    }

    setRole(peerID, role) {
        if (Object.values(ROLES).includes(role)) {
            this.roles.set(peerID, role);
            console.log(`Role for ${peerID} set to ${role}`);
        }
    }

    getRole(peerID) {
        return this.roles.get(peerID) || ROLES.VIEWER;
    }

    hasPermission(peerID, action) {
        const role = this.getRole(peerID);
        // Basic permission matrix
        const permissions = {
            [ROLES.ADMIN]: ['kick', 'mute_all', 'lock_room', 'share_screen', 'speak', 'manage_breakouts'],
            [ROLES.MODERATOR]: ['mute_peer', 'share_screen', 'speak', 'kick'],
            [ROLES.SPEAKER]: ['share_screen', 'speak'],
            [ROLES.VIEWER]: []
        };
        return (permissions[role] || []).includes(action);
    }

    kickPeer(peerID) {
        if (this.hasPermission(this.transport.identity.id, 'kick')) {
            this.transport.broadcast({
                type: 'GOVERNANCE_ACTION',
                payload: { type: 'KICK', target: peerID },
                issuer: this.transport.identity.id
            });
        }
    }

    mutePeer(peerID) {
        if (this.hasPermission(this.transport.identity.id, 'mute_peer')) {
            this.transport.broadcast({
                type: 'GOVERNANCE_ACTION',
                payload: { type: 'MUTE', target: peerID },
                issuer: this.transport.identity.id
            });
        }
    }

    lockRoom(locked) {
        if (this.hasPermission(this.transport.identity.id, 'lock_room')) {
            this.transport.broadcast({
                type: 'GOVERNANCE_ACTION',
                payload: { type: 'LOCK', locked },
                issuer: this.transport.identity.id
            });
        }
    }

    proposeAction(action) {
        console.log(`Proposing action: ${action.type}`);
        this.transport.broadcast({
            type: 'GOVERNANCE_PROPOSAL',
            payload: {
                id: Math.random().toString(36).substr(2, 9),
                ...action
            },
            proposer: this.transport.identity.id
        });
    }

    vote(proposalId, approve) {
        this.transport.broadcast({
            type: 'GOVERNANCE_VOTE',
            payload: { proposalId, approve },
            voter: this.transport.identity.id
        });
    }

    electSuperNode() {
        console.log("Electing super-node relay based on network stats...");
    }
}
