/**
 * Holiday Effects - Master CDN Loader v3.0
 * The only file clients need to include.
 */
(function () {
  const CDN_URL = "https://cdn.auto365.com.vn/effects";
  const VERSION = Date.now();

  function loadScript(src, callback) {
    const s = document.createElement("script");
    s.src = src + "?v=" + VERSION;
    s.async = true;
    s.onload = callback;
    document.head.appendChild(s);
  }

  function loadStyle(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href + "?v=" + VERSION;
    document.head.appendChild(l);
  }

  // Tải cấu hình và quyết định module cần nạp
  fetch(CDN_URL + "/config.json?v=" + VERSION)
    .then((res) => res.json())
    .then((config) => {
      // Trường hợp 2: Nạp tách biệt (Tối ưu hơn nếu chỉ dùng 1 thứ)
      if (config.trackerEnabled !== false) {
        loadScript(CDN_URL + "/tracker.min.js");
      }

      if (config.effectsEnabled !== false) {
        loadScript(CDN_URL + "/core.min.js", () => {
          if (window.HolidayEffects) window.HolidayEffects.init(config);
        });
      }

      // Tự động nạp UI Fixes và Product Handler theo domain
      const uiDomains = [
        "x-light.vn",
        "gtrvietnam.com",
        "365group.com.vn",
        "auto365thuduc.vn",
        "titanvietnam.vn",
        "titanmoto.vn",
        "axfilmvn.com",
      ];
      const productDomains = [
        "x-light.vn",
        "gtrvietnam.com",
        "365group.com.vn",
        "auto365thuduc.vn",
      ];

      const currentHost = window.location.hostname.replace("www.", "");

      // Nạp Base UI (Sticky, Scroll to Top)
      if (uiDomains.includes(currentHost)) {
        loadStyle(CDN_URL + "/base-ui.css");
        loadScript(CDN_URL + "/base-ui.min.js");
      }

      // Nạp Product Handler (Giá, Thông số)
      if (productDomains.includes(currentHost)) {
        loadScript(CDN_URL + "/product-handler.min.js");
      }
    })
    .catch((err) => {
      console.warn("⚠️ CDN Loader: Fallback to full bundle", err);
      loadScript(CDN_URL + "/holiday-effects-full.min.js");
    });
})();
