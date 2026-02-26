/**
 * PeerVerse Settings UI
 */

export class SettingsUI {
    constructor() {
        this.settings = {
            videoQuality: 'high',
            audioEnabled: true,
            theme: 'dark',
            privacy: 'public',
            aiCaptions: false
        };
    }

    render() {
        return `
            <div id="settings-modal" style="background: rgba(0,0,0,0.8); position: absolute; top:0; left:0; width:100%; height:100%; display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div id="settings-card" style="background: #1e1e1e; padding: 2rem; border-radius: 8px; border: 1px solid #333; min-width: 400px;">
                    <h2>PeerVerse Settings</h2>

                    <div style="margin-bottom: 1rem;">
                        <label>Video Quality</label>
                        <select id="setting-video-quality" style="width: 100%; background: #333; border: none; padding: 0.5rem; color: #fff; margin-top: 0.5rem;">
                            <option value="low" ${this.settings.videoQuality === 'low' ? 'selected' : ''}>Low (360p)</option>
                            <option value="medium" ${this.settings.videoQuality === 'medium' ? 'selected' : ''}>Medium (720p)</option>
                            <option value="high" ${this.settings.videoQuality === 'high' ? 'selected' : ''}>High (1080p)</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label>Theme</label>
                        <select id="setting-theme" style="width: 100%; background: #333; border: none; padding: 0.5rem; color: #fff; margin-top: 0.5rem;">
                            <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                            <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                            <option value="glass" ${this.settings.theme === 'glass' ? 'selected' : ''}>Glass</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="setting-ai-captions" ${this.settings.aiCaptions ? 'checked' : ''}>
                        <label for="setting-ai-captions">Enable AI Live Captions</label>
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button id="settings-close" style="background: #444; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Cancel</button>
                        <button id="settings-save" style="background: #2196F3; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Save Settings</button>
                    </div>
                </div>
            </div>
        `;
    }

    save() {
        this.settings.videoQuality = document.getElementById('setting-video-quality').value;
        this.settings.theme = document.getElementById('setting-theme').value;
        this.settings.aiCaptions = document.getElementById('setting-ai-captions').checked;
        console.log("Settings saved:", this.settings);
        // Dispatch event or update theme
        if (this.settings.theme === 'light') {
            document.documentElement.style.setProperty('--bg-color', '#f0f0f0');
            document.documentElement.style.setProperty('--text-color', '#121212');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
        } else {
            document.documentElement.style.setProperty('--bg-color', '#121212');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--card-bg', '#1e1e1e');
        }
    }
}
