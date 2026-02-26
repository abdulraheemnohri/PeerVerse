/**
 * PeerVerse Security Layer
 * Handles signed messages & validation.
 */

export class Security {
    constructor(identity) {
        this.identity = identity;
    }

    async signMessage(data) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(data));
        const signature = await window.crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            this.identity.keyPair.privateKey,
            encoded
        );
        return {
            data,
            signature: Array.from(new Uint8Array(signature)),
            publicKey: this.identity.publicKeyJWK
        };
    }

    async verifyMessage(signedMessage) {
        const { data, signature, publicKey } = signedMessage;
        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(data));

        const importedPublicKey = await window.crypto.subtle.importKey(
            "jwk",
            publicKey,
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true,
            ["verify"]
        );

        return await window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            importedPublicKey,
            new Uint8Array(signature),
            encoded
        );
    }
}
