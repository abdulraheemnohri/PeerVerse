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
        this.container.innerHTML = `
            <div id="network-overlay" style="background: rgba(0,0,0,0.5); padding: 0.5rem; position: absolute; top: 1rem; right: 1rem; border-radius: 4px; z-index: 100;">
                <div id="latency">Latency: <span id="latency-val">0</span>ms</div>
                <div id="packet-loss">Packet Loss: <span id="packet-loss-val">0</span>%</div>
                <div id="bandwidth">Bandwidth: <span id="bandwidth-val">0</span>Mbps</div>
            </div>
        `;
    }

    updateStats(stats) {
        this.stats = { ...this.stats, ...stats };
        document.getElementById('latency-val').textContent = this.stats.latency;
        document.getElementById('packet-loss-val').textContent = this.stats.packetLoss;
        document.getElementById('bandwidth-val').textContent = this.stats.bandwidth;
    }
}
