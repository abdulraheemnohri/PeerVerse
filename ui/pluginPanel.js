/**
 * PeerVerse Plugin Panel UI
 * Handles whiteboard, code editor, and media player panels.
 */

export class PluginPanel {
    constructor(container) {
        this.container = container;
        this.activePlugin = null;
        this.plugins = new Map();
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <h3>Plugins</h3>
            <div id="plugin-list" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button id="whiteboard-btn" style="background: #333; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Whiteboard</button>
                <button id="code-btn" style="background: #333; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Code Editor</button>
                <button id="player-btn" style="background: #333; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Media Player</button>
            </div>
            <div id="plugin-content" style="flex: 1; min-height: 400px; background: #000; position: relative;"></div>
        `;
    }

    activatePlugin(pluginName) {
        this.activePlugin = pluginName;
        const content = document.getElementById('plugin-content');
        content.innerHTML = `<div style="padding: 2rem;">Activating ${pluginName}...</div>`;
        console.log(`Activating plugin: ${pluginName}`);
    }
}
