/**
 * PeerVerse Whiteboard Layer
 * Collaborative whiteboard.
 */

export class Whiteboard {
    constructor(transport) {
        this.transport = transport;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.color = '#ffffff';
        this.brushSize = 2;
    }

    initialize(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupListeners();
    }

    setupListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
    }

    draw(e) {
        if (!this.isDrawing) return;

        const x = e.offsetX;
        const y = e.offsetY;

        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        this.transport.broadcast({
            type: 'WHITEBOARD_DRAW',
            payload: { x, y, color: this.color, size: this.brushSize, type: 'line' }
        });
    }

    stopDrawing() {
        this.isDrawing = false;
        this.transport.broadcast({ type: 'WHITEBOARD_STOP' });
    }

    receiveDraw(payload) {
        if (payload.type === 'line') {
            this.ctx.lineTo(payload.x, payload.y);
            this.ctx.strokeStyle = payload.color;
            this.ctx.lineWidth = payload.size;
            this.ctx.stroke();
        }
    }
}
