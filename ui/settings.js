/**
 * PeerVerse Settings UI
 */

export const MODES = {
    GLOBAL: 'global',
    OFFICE: 'office',
    EDUCATION: 'education'
};

export class SettingsUI {
    constructor() {
        this.settings = {
            videoQuality: 'high',
            audioEnabled: true,
            theme: 'dark',
            privacy: 'public',
            aiCaptions: false,
            mode: MODES.GLOBAL
        };
        this.onModeChange = null;
    }

    render() {
        return `
            <div id="settings-modal" style="background: rgba(0,0,0,0.8); position: absolute; top:0; left:0; width:100%; height:100%; display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);">
                <div id="settings-card" style="background: #1e1e1e; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); min-width: 450px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                    <h2 style="margin-top: 0;">PeerVerse Settings</h2>

                    <div style="margin-bottom: 1rem;">
                        <label>Application Mode</label>
                        <select id="setting-mode" style="width: 100%; background: #333; border: none; padding: 0.5rem; color: #fff; margin-top: 0.5rem;">
                            <option value="${MODES.GLOBAL}" ${this.settings.mode === MODES.GLOBAL ? 'selected' : ''}>Global / Social</option>
                            <option value="${MODES.OFFICE}" ${this.settings.mode === MODES.OFFICE ? 'selected' : ''}>Company / Office</option>
                            <option value="${MODES.EDUCATION}" ${this.settings.mode === MODES.EDUCATION ? 'selected' : ''}>Teacher / Student</option>
                        </select>
                    </div>

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
                            <option value="glass" ${this.settings.theme === 'glass' ? 'selected' : ''}>Glassmorphism</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label>Audio Input Device</label>
                        <select id="setting-audio-device" style="width: 100%; background: #333; border: none; padding: 0.5rem; color: #fff; margin-top: 0.5rem;">
                            <option value="default">System Default</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem; display: flex; gap: 2rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="setting-ai-captions" ${this.settings.aiCaptions ? 'checked' : ''}>
                            <label for="setting-ai-captions">AI Captions</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="setting-incognito">
                            <label for="setting-incognito">Incognito Mode</label>
                        </div>
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
        const oldMode = this.settings.mode;
        this.settings.mode = document.getElementById('setting-mode').value;
        this.settings.videoQuality = document.getElementById('setting-video-quality').value;
        this.settings.theme = document.getElementById('setting-theme').value;
        this.settings.aiCaptions = document.getElementById('setting-ai-captions').checked;

        console.log("Settings saved:", this.settings);

        if (oldMode !== this.settings.mode && this.onModeChange) {
            this.onModeChange(this.settings.mode);
        }

        this.applyTheme();
    }

    applyTheme() {
        if (this.settings.theme === 'light') {
            document.documentElement.style.setProperty('--bg-color', '#f0f0f0');
            document.documentElement.style.setProperty('--text-color', '#121212');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
        } else if (this.settings.theme === 'glass') {
            document.documentElement.style.setProperty('--bg-color', 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.1)');
            document.body.style.backdropFilter = 'blur(10px)';
        } else {
            document.documentElement.style.setProperty('--bg-color', '#121212');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--card-bg', '#1e1e1e');
        }
    }
}
