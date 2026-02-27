/**
 * PeerVerse Network Overlay UI
 * Shows latency, packet loss, and bandwidth.
 */

export class NetworkOverlay {
    constructor(container) {
        this.container = container;
        this.stats = {
            latency: 0,
            packetLoss: 0,
            bandwidth: 0
        };
        this.render();
    }

    render() {
        // Create an overlay div if it doesn't exist
        let overlay = document.getElementById('network-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'network-overlay';
            overlay.style.cssText = 'background: rgba(0,0,0,0.5); padding: 0.5rem; position: absolute; top: 1rem; right: 1rem; border-radius: 4px; z-index: 100; pointer-events: none; font-size: 0.8rem;';
            this.container.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div id="latency">Latency: <span id="latency-val">${this.stats.latency}</span>ms</div>
            <div id="packet-loss">Packet Loss: <span id="packet-loss-val">${this.stats.packetLoss}</span>%</div>
            <div id="bandwidth">Bandwidth: <span id="bandwidth-val">${this.stats.bandwidth}</span>Mbps</div>
        `;
    }

    updateStats(stats) {
        this.stats = { ...this.stats, ...stats };
        const latVal = document.getElementById('latency-val');
        const lossVal = document.getElementById('packet-loss-val');
        const bandVal = document.getElementById('bandwidth-val');

        if (latVal) latVal.textContent = this.stats.latency;
        if (lossVal) lossVal.textContent = this.stats.packetLoss;
        if (bandVal) bandVal.textContent = this.stats.bandwidth;
    }
}
