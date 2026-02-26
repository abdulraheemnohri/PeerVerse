/**
 * PeerVerse Identity Layer
 * Generates cryptographic unique ID and keypair per user.
 */

export class Identity {
    constructor() {
        this.keyPair = null;
        this.id = null;
        this.publicKeyJWK = null;
    }

    async initialize() {
        this.keyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true,
            ["sign", "verify"]
        );

        const publicKey = await window.crypto.subtle.exportKey("jwk", this.keyPair.publicKey);
        const rawPublicKey = await window.crypto.subtle.exportKey("spki", this.keyPair.publicKey);

        this.publicKeyJWK = publicKey;
        this.id = await this.generateID(rawPublicKey);
        return { id: this.id, publicKey: this.publicKeyJWK };
    }

    async generateID(rawPublicKey) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawPublicKey);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    static async verifyID(id, rawPublicKey) {
        const instance = new Identity();
        const generatedID = await instance.generateID(rawPublicKey);
        return generatedID === id;
    }
}
