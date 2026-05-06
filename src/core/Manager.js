/**
 * Holiday Effects - Main Manager
 */
import { debounce } from '../utils.js';
import { mergeConfig } from './Config.js';
import { CanvasManager } from './Canvas.js';
import { PhysicsEngine } from './Engine.js';
import BannerSystem from '../modules/Banner.js';

const HolidayEffects = {
  version: "3.0.0-modular",
  config: {},
  engine: null,
  initialized: false,

  init: function (userConfig) {
    if (this.initialized) return this.update(userConfig);

    // 1. Cấu hình
    this.config = mergeConfig(userConfig);

    // 2. Canvas
    CanvasManager.setup();

    // 3. Engine
    this.engine = new PhysicsEngine(CanvasManager);
    this.engine.setConfig(this.config);
    this.engine.start();

    // 4. Banner
    if (this.config.banner && this.config.banner.enabled) {
      BannerSystem.load(this.config.banner);
    }

    // 5. Events
    this.bindEvents();

    this.initialized = true;
    console.log("🚀 Holiday Effects Master [MODULAR] v" + this.version + " Ready");
    return this;
  },

  update: function(newConfig) {
    if (!this.initialized) return this.init(newConfig);

    if (newConfig.banner) {
      BannerSystem.destroy();
      if (newConfig.banner.enabled) BannerSystem.load(newConfig.banner);
    }

    this.config = Object.assign({}, this.config, newConfig);
    if (this.engine) this.engine.setConfig(this.config);
    
    return this;
  },

  bindEvents: function() {
    const debouncedResize = debounce(() => {
      CanvasManager.resize();
      if (this.engine) this.engine.resetParticles();
      if (this.config.banner && this.config.banner.enabled) {
        BannerSystem.destroy();
        BannerSystem.load(this.config.banner);
      }
    }, 200);

    window.addEventListener("resize", debouncedResize, { passive: true });
    
    document.addEventListener("visibilitychange", () => {
      if (this.engine) {
        this.engine.active = (document.visibilityState === "visible");
      }
    });
  }
};

export default HolidayEffects;
