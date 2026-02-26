/**
 * PeerVerse Whiteboard Layer
 * Collaborative whiteboard.
 */

export class Whiteboard {
    constructor(transport) {
        this.transport = transport;
        this.canvas = null;
        this.ctx = null;
    }

    initialize(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    draw(x, y, type = 'point') {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.transport.broadcast({
            type: 'WHITEBOARD_DRAW',
            payload: { x, y, type }
        });
    }

    receiveDraw(payload) {
        const { x, y, type } = payload;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}
