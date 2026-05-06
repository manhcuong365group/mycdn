/**
 * Holiday Effects - Canvas Manager
 */
export const CanvasManager = {
  canvas: null,
  ctx: null,

  setup: function(id = "holiday-effects-canvas") {
    if (this.canvas) return this.canvas;
    
    this.canvas = document.createElement("canvas");
    this.canvas.id = id;
    this.canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;background:transparent !important;will-change:transform;";
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.resize();
    return this.canvas;
  },

  resize: function() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  clear: function() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};
