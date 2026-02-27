/**
 * PeerVerse Profile Management UI
 */

export class ProfileUI {
    constructor(identity) {
        this.identity = identity;
        this.profile = {
            displayName: "Guest",
            avatar: null,
            bio: ""
        };
    }

    render() {
        console.log("Rendering profile UI...");
        return `
            <div id="profile-modal" style="background: rgba(0,0,0,0.8); position: absolute; top:0; left:0; width:100%; height:100%; display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div id="profile-card" style="background: #1e1e1e; padding: 2rem; border-radius: 8px; border: 1px solid #333; min-width: 300px;">
                    <h2>Edit Profile</h2>
                    <div style="margin-bottom: 1rem;">
                        <label>Display Name</label>
                        <input type="text" id="profile-name" value="${this.profile.displayName}" style="width: 100%; background: #333; border: none; padding: 0.5rem; color: #fff; margin-top: 0.5rem; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label>Status / Bio</label>
                        <textarea id="profile-bio" style="width: 100%; background: #333; border: none; padding: 0.5rem; color: #fff; margin-top: 0.5rem; border-radius: 4px; resize: none;">${this.profile.bio}</textarea>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button id="profile-close" style="background: #444; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Cancel</button>
                        <button id="profile-save" style="background: #2196F3; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Save</button>
                    </div>
                </div>
            </div>
        `;
    }

    async save() {
        this.profile.displayName = document.getElementById('profile-name').value;
        this.profile.bio = document.getElementById('profile-bio').value;
        console.log("Profile saved:", this.profile);
    }
}
