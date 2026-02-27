/**
 * PeerVerse Storage Layer
 * Persistence using IndexedDB/LocalStorage.
 */

export class Storage {
    static get(key) {
        try {
            return JSON.parse(localStorage.getItem(`peerverse_${key}`));
        } catch (e) {
            return null;
        }
    }

    static set(key, value) {
        localStorage.setItem(`peerverse_${key}`, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(`peerverse_${key}`);
    }

    static async initDB() {
        console.log("Initializing IndexedDB for large file storage...");
    }

    static saveChat(messages) {
        this.set('chat_history', messages.slice(-50)); // Keep last 50
    }

    static getChat() {
        return this.get('chat_history') || [];
    }

    static saveProfile(profile) {
        this.set('user_profile', profile);
    }

    static getProfile() {
        return this.get('user_profile');
    }
}
