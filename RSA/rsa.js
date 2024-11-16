// app.js

// Generate RSA keys
async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // Common value
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    const publicKey = await exportKey(keyPair.publicKey, "spki");
    const privateKey = await exportKey(keyPair.privateKey, "pkcs8");

    // Display the keys
    document.getElementById("public-key").textContent = publicKey;
    document.getElementById("private-key").textContent = privateKey;

    return keyPair;
}

// Export keys as base64
async function exportKey(key, format) {
    const exportedKey = await window.crypto.subtle.exportKey(format, key);
    const exportedKeyBuffer = new Uint8Array(exportedKey);
    return btoa(String.fromCharCode.apply(null, exportedKeyBuffer));
}

// Import keys from base64
async function importKey(keyStr, format) {
    const binaryKey = Uint8Array.from(atob(keyStr), char => char.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        format === "spki" ? "spki" : "pkcs8",
        binaryKey,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        format === "spki" ? ["encrypt"] : ["decrypt"]
    );
}

// Encrypt a message
async function encryptMessage(publicKey, message) {
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedMessage
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

// Decrypt a message
async function decryptMessage(privateKey, encryptedMessage) {
    const binaryMessage = Uint8Array.from(atob(encryptedMessage), char => char.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        binaryMessage
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// Main logic
let publicKey, privateKey;

document.getElementById("generate-keys").addEventListener("click", async () => {
    const keys = await generateKeys();
    publicKey = keys.publicKey;
    privateKey = keys.privateKey;
});

document.getElementById("encrypt-btn").addEventListener("click", async () => {
    const message = document.getElementById("message").value;
    if (!publicKey) {
        alert("Generate keys first!");
        return;
    }
    const encryptedMessage = await encryptMessage(publicKey, message);
    document.getElementById("encrypted-message").textContent = encryptedMessage;
});

document.getElementById("decrypt-btn").addEventListener("click", async () => {
    const encryptedMessage = document.getElementById("encrypted-message").textContent;
    if (!privateKey || !encryptedMessage) {
        alert("Encrypt a message first!");
        return;
    }
    const decryptedMessage = await decryptMessage(privateKey, encryptedMessage);
    document.getElementById("decrypted-message").textContent = decryptedMessage;
});
