/**
 * Tet (Mai/Đào) Effect Logic
 */
export const tet = {
  isDraw: true,
  draw: function(ctx, size) {
    const petals = 5;
    const angleStep = Math.PI * 2 / petals;
    ctx.save();
    ctx.fillStyle = "#FFD600";
    for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate(i * angleStep);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-size * 1.1, -size * 0.2, -size * 0.8, -size * 1.2, -size * 0.1, -size * 0.9);
        ctx.bezierCurveTo(0, -size * 0.82, 0, -size * 0.82, size * 0.1, -size * 0.9);
        ctx.bezierCurveTo(size * 0.8, -size * 1.2, size * 1.1, -size * 0.2, 0, 0);
        ctx.fill();
        ctx.restore();
    }
    // Nhụy hoa
    ctx.fillStyle = "#ffca28";
    for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        const r1 = size * 0.16;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r1, Math.sin(a) * r1, size * 0.022, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#e65100";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};
