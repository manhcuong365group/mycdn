/**
 * Holiday Banner System
 * ES Module Version
 */
const BannerSystem = {
  load: function (config) {
    if (!config || !config.enabled) return;
    
    this.injectStyles(config.responsive);
    
    if (config.position === "sides") {
      this.createBanner("left", config.images.left);
      this.createBanner("right", config.images.right);
    }
  },

  injectStyles: function (responsive) {
    if (document.getElementById("holiday-banner-styles")) return;
    
    const style = document.createElement("style");
    style.id = "holiday-banner-styles";
    style.textContent = `
      .holiday-banner {
          position: fixed;
          transition: .3s;
          height: auto;
          z-index: 9998;
          pointer-events: none;
          opacity: 0;
          animation: fadeInBanner 0.5s ease-in forwards;
      }
      .holiday-banner-left {
          left: 0;
          top: 140px;
          width: 191px;
      }
      .holiday-banner-right {
          right: 0;
          top: 140px;
          width: 191px;
      }
      @media (max-width: ${responsive.breakpoint || 1024}px) {
          .holiday-banner {
              display: ${responsive.hideOnMobile ? "none" : "block"} !important;
          }
      }
      @keyframes fadeInBanner {
          to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  },

  createBanner: function (side, src) {
    const banner = document.createElement("img");
    banner.src = src;
    banner.className = `holiday-banner holiday-banner-${side}`;
    banner.alt = `Holiday decoration ${side}`;
    banner.loading = "lazy";
    document.body.appendChild(banner);
  },

  destroy: function () {
    document.querySelectorAll(".holiday-banner").forEach(el => el.remove());
  }
};

export default BannerSystem;
