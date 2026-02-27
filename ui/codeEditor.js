/**
 * PeerVerse Collaborative Code Editor
 */

export class CodeEditor {
    constructor(crdt) {
        this.crdt = crdt;
        this.container = null;
        this.textarea = null;
    }

    initialize(container) {
        this.container = container;
        this.container.innerHTML = `
            <div id="code-editor-container" style="height: 100%; display: flex; flex-direction: column; background: #1e1e1e;">
                <div id="editor-toolbar" style="padding: 0.5rem; background: #333; display: flex; gap: 0.5rem;">
                    <select id="editor-lang" style="background: #444; color: #fff; border: none; padding: 0.25rem;">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="html">HTML/CSS</option>
                    </select>
                    <button id="editor-run" style="background: #4caf50; border: none; color: #fff; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer;">Run</button>
                </div>
                <textarea id="code-textarea" style="flex: 1; background: transparent; color: #d4d4d4; font-family: 'Fira Code', monospace; padding: 1rem; border: none; resize: none; outline: none;" placeholder="// Start coding here..."></textarea>
            </div>
        `;
        this.textarea = this.container.querySelector('#code-textarea');
        this.setupListeners();
    }

    setupListeners() {
        this.textarea.addEventListener('input', (e) => {
            this.crdt.broadcastStateChange({
                type: 'CODE_UPDATE',
                code: e.target.value
            });
        });

        this.container.querySelector('#editor-run').addEventListener('click', () => {
            console.log("Running code placeholder...");
            alert("Code execution requires a secure sandboxed environment. Running locally...");
        });
    }

    updateCode(code) {
        if (this.textarea && document.activeElement !== this.textarea) {
            this.textarea.value = code;
        }
    }
}
