# 🌐 PeerVerse – Fully Decentralized Multi-Peer AV Chat

PeerVerse is a serverless, fully decentralized multi-peer communication platform. Built on the principle that **every user is a node**, PeerVerse eliminates the need for central servers while providing a robust, feature-rich experience for collaboration, education, and social interaction.

---

## 🚀 Key Features

### 🎥 Media & Communication
- **HD Video & Audio**: Real-time communication using WebRTC.
- **Adaptive Bitrate**: Automatically adjusts quality based on network conditions.
- **Screen Sharing**: Share windows, tabs, or full-screen with annotation support.
- **Spatial Audio**: 3D audio panning for immersive meetings.
- **Local Recording**: Capture meetings directly to your device (WebM/MP4).

### 💬 Collaboration
- **Text Chat**: Markdown & emoji support with persistent local history.
- **File Transfer**: Secure, chunked P2P file sharing with integrity checks.
- **Whiteboard**: Collaborative real-time drawing with brush controls.
- **Shared Notes**: CRDT-based synchronized notes for real-time document editing.
- **Polls & Reactions**: Quick feedback loops and interactive emoji reactions.

### 🧠 AI Suite
- **AI Noise Suppression**: Local AI-based audio filtering to eliminate background noise.
- **Live Captions**: Real-time Speech-to-Text for enhanced accessibility.
- **Virtual Backgrounds**: ML-based segmentation for blur or background replacement.
- **AI Assistant**: Online GPT integration for meeting summaries and translation.

---

## 📂 Application Modes

PeerVerse adapts its UI and feature set based on the selected mode:

| Mode | Target | Key Features |
| :--- | :--- | :--- |
| **Global** | Social/Public | Focus on media grid, emoji reactions, and discoverability. |
| **Office** | Professional | Shared Notes, Meeting Summaries, and Role-Based Governance. |
| **Education**| Teachers/Students | Focus on Speaker view, Hand Raising, and Polls. |

---

## 🛠 Architecture Overview

PeerVerse is built using a layered modular architecture:

1.  **Identity Layer**: ECDSA P-256 keypair generation for unique cryptographic IDs.
2.  **Discovery Layer**: DHT and signaling relay for peer-to-peer handshaking.
3.  **Transport Layer**: WebRTC DataChannels and MediaStreams management.
4.  **Governance Layer**: Role-based permissions (Admin, Moderator, Peer) and voting.
5.  **Data Layer**: CRDT-based state synchronization for consistent room data.
6.  **UI Layer**: Modern 'Ultra-Glass' aesthetic with responsive components.

---

## ⚙️ Installation & Setup

### 🐧 Linux (Ubuntu/Debian)
1.  **Install Prerequisites:**
    ```bash
    sudo apt update && sudo apt install git nodejs npm -y
    ```
2.  **Clone & Run:**
    ```bash
    git clone https://github.com/abdulraheemnohri/PeerVerse
    cd PeerVerse
    npx http-server .
    ```

### 🪟 Windows
1.  **Install Node.js:** Download and install from [nodejs.org](https://nodejs.org/).
2.  **Clone the Repository:**
    Open PowerShell or CMD:
    ```powershell
    git clone https://github.com/abdulraheemnohri/PeerVerse
    cd PeerVerse
    ```
3.  **Start Server:**
    ```powershell
    npx http-server .
    ```

### 📱 Termux (Android)
1.  **Setup Environment:**
    ```bash
    pkg update && pkg upgrade
    pkg install git nodejs-lts -y
    ```
2.  **Clone & Run:**
    ```bash
    git clone https://github.com/abdulraheemnohri/PeerVerse
    cd PeerVerse
    npm install -g http-server
    http-server .
    ```

### 🌐 Browser Access
Once the server is running, open your browser and navigate to:
`http://localhost:8080` (or the IP address provided by the server).

### Configuration Guide
Settings can be adjusted via the UI Settings panel or by modifying `utils/constants.js`:
-   `DEFAULT_ROOM_ID`: The default room peers will join.
-   `STUN_SERVERS`: Array of STUN/TURN servers for NAT traversal.
-   `CHUNK_SIZE`: Size of data chunks for file transfer (default: 16KB).

### Deployment to GitHub Pages
1.  **Push your code** to your GitHub repository (e.g., `https://github.com/abdulraheemnohri/PeerVerse`).
2.  Navigate to **Settings** > **Pages** in your repository.
3.  Under **Build and deployment** > **Source**, select `Deploy from a branch`.
4.  Choose your branch (e.g., `main`) and folder (usually `/ (root)`).
5.  Click **Save**.
6.  Your site will be live at `https://<your-username>.github.io/PeerVerse/`.

*Note: Ensure your `index.html` uses relative paths for modules to work correctly on GitHub Pages sub-directories.*

### Alternative Static Hosting
Since PeerVerse is serverless, it can also be deployed to:
-   **Vercel / Netlify**: Connect your GitHub repo for auto-deployment.
-   **IPFS**: Use a service like Fleek for fully decentralized hosting.

---

## 🔐 Security & Privacy
- **End-to-End Encryption**: Media streams are encrypted via WebRTC DTLS.
- **Signed Messages**: Every data packet is signed with the user's private key.
- **Local Persistence**: Profile and chat data are stored in your browser's LocalStorage/IndexedDB.
- **Incognito Mode**: Toggle to hide your profile details from the network.

---

## 🤝 Contributing
Contributions are welcome! Please follow the modular structure when adding new features or AI integrations.

## 📄 License
This project is licensed under the MIT License.
