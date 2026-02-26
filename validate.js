/**
 * PeerVerse Validation Script
 * Tests core functionality in a Node.js environment where possible.
 */

import { Identity } from './core/identity.js';
import { Security } from './core/security.js';
import { Storage } from './utils/storage.js';

async function validate() {
    console.log("Starting PeerVerse Blueprint Validation...");

    // Test Identity
    try {
        console.log("- Checking Identity class definition...");
        const identity = new Identity();
        if (identity) console.log("  [PASS] Identity can be instantiated.");
    } catch (e) {
        console.error("  [FAIL] Identity instantiation failed.", e.message);
    }

    // Test Security
    try {
        console.log("- Checking Security class definition...");
        const security = new Security();
        if (security) console.log("  [PASS] Security can be instantiated.");
    } catch (e) {
        console.error("  [FAIL] Security instantiation failed.", e.message);
    }

    // Test Storage
    try {
        console.log("- Checking Storage utility...");
        Storage.set('test', 'data');
        // localStorage might not exist in Node, handle gracefully
        console.log("  [PASS] Storage utility is defined.");
    } catch (e) {
        if (e.message.includes('localStorage is not defined')) {
            console.log("  [SKIP] Storage set test skipped (expected in Node).");
        } else {
            console.error("  [FAIL] Storage utility test failed.", e.message);
        }
    }

    console.log("Validation completed.");
}

// Mock browser globals for validation in Node environment
global.window = {
    crypto: {
        subtle: {}
    }
};
global.localStorage = {
    setItem: () => {},
    getItem: () => null,
    removeItem: () => {}
};

validate().catch(console.error);
