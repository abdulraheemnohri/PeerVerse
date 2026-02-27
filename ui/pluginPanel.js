/**
 * PeerVerse Plugin Panel UI
 * Handles whiteboard, code editor, and media player panels.
 */

export class PluginPanel {
    constructor(container) {
        this.container = container;
        this.activePlugin = null;
        this.render();
    }

    render() {
        // Create an overlay panel if it doesn't exist
        let panel = document.getElementById('plugin-overlay-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'plugin-overlay-panel';
            panel.className = 'panel';
            panel.style.cssText = 'position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; z-index: 1000; display: none; flex-direction: column; padding: 1.5rem;';
            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Plugins</h3>
                <button id="plugin-close" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div id="plugin-nav" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button data-plugin="whiteboard" style="background: #333; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Whiteboard</button>
                <button data-plugin="code" style="background: #333; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Code Editor</button>
                <button data-plugin="player" style="background: #333; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Media Player</button>
            </div>
            <div id="plugin-viewport" style="flex: 1; background: #000; border-radius: 8px; position: relative; overflow: hidden;">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
                    Select a plugin to launch
                </div>
            </div>
        `;

        document.getElementById('plugin-close').addEventListener('click', () => this.hide());

        panel.querySelectorAll('#plugin-nav button').forEach(btn => {
            btn.addEventListener('click', () => this.activatePlugin(btn.dataset.plugin));
        });
    }

    show() {
        document.getElementById('plugin-overlay-panel').style.display = 'flex';
    }

    hide() {
        document.getElementById('plugin-overlay-panel').style.display = 'none';
    }

    activatePlugin(pluginName) {
        this.activePlugin = pluginName;
        const viewport = document.getElementById('plugin-viewport');
        viewport.innerHTML = `<div style="padding: 2rem;">Loading ${pluginName}...</div>`;

        // In a real implementation, we would attach the actual plugin component here
        if (pluginName === 'whiteboard') {
            viewport.innerHTML = `<canvas id="plugin-canvas" style="width:100%; height:100%; cursor: crosshair;"></canvas>`;
            // notify dashboard to link whiteboard
            if (this.onPluginLoad) this.onPluginLoad('whiteboard', document.getElementById('plugin-canvas'));
        } else if (pluginName === 'code') {
            viewport.innerHTML = `<textarea id="plugin-code-editor" style="width:100%; height:100%; background:#1a1a1a; color:#0f0; border:none; padding:1rem; font-family:monospace;"></textarea>`;
            if (this.onPluginLoad) this.onPluginLoad('code', document.getElementById('plugin-code-editor'));
        }
    }
}
