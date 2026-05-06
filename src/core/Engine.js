/**
 * Holiday Effects - Physics Engine
 */
import EFFECT_REGISTRY from '../effects/index.js';

export class PhysicsEngine {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.particles = [];
    this.active = true;
    this.animationId = null;
    this.config = {};
  }

  setConfig(config) {
    this.config = config;
    this.resetParticles();
  }

  resetParticles() {
    this.particles = [];
    const count = this.config.count || (window.innerWidth < 600 ? 12 : 24);
    for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const type = this.config.effect;
    const effectConfig = EFFECT_REGISTRY[type] || EFFECT_REGISTRY.none;
    const canvas = this.canvasManager.canvas;

    const p = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 15 + Math.random() * 20,
      speed: (0.8 + Math.random() * 1.5) * (this.config.speedMult || 1.0),
      wind: (Math.random() - 0.5) * 1.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 3,
      opacity: 0,
      type: type,
      isDraw: effectConfig.isDraw,
      char: typeof effectConfig.char === 'function' ? effectConfig.char() : effectConfig.char
    };

    if (effectConfig.init) effectConfig.init(p);
    return p;
  }

  update() {
    if (!this.active) return;
    this.canvasManager.clear();
    const ctx = this.canvasManager.ctx;
    const canvas = this.canvasManager.canvas;

    this.particles.forEach(p => {
      p.y += p.speed;
      p.x += p.wind;
      p.rotation += p.rotSpeed;
      if (p.opacity < 1) p.opacity += 0.02;

      // Wrap-around / Reset logic
      if (p.y > canvas.height + 50) {
        p.y = -50;
        p.x = Math.random() * canvas.width;
        p.opacity = 0;
      }

      this.drawParticle(ctx, p);
    });
  }

  drawParticle(ctx, p) {
    const effectConfig = EFFECT_REGISTRY[p.type] || EFFECT_REGISTRY.none;
    
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    
    if (p.isDraw && effectConfig.draw) {
      effectConfig.draw(ctx, p.size * 0.6, p); 
    } else {
      ctx.font = `${p.size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(p.char || "", 0, 0);
    }
    ctx.restore();
  }

  start() {
    if (this.animationId) return;
    const loop = () => {
      this.update();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
