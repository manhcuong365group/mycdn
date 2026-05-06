/**
 * Optimized Universal Button Click Tracker
 * ES Module Version
 */
const CONFIG = {
  method: 'google-sheets',
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbyOb__sEeimC5h98-ymABfRJX0iXwpWJ5foa3N_BkJSvEzwj8BuqimxPwlaGoMmzuivQQ/exec',
  selectors: ['a[href^="tel:"]', 'a[href*="zalo.me"]'],
  websiteId: typeof window !== 'undefined' ? window.location.hostname : '',
  customContactDomains: ['titanmoto.vn', 'titanvietnam.vn'],
  defaultPhoneNumber: '19009365',
  defaultDisplayNumber: '1900 9365',
  customPhoneNumber: '0586365365',
  customDisplayNumber: '0586 365 365',
  debounceDelay: 300,
  batchTimeout: 2000,
  maxBatchSize: 10
};

const Tracker = {
  queue: [],
  timer: null,

  init: function() {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (e) => {
      CONFIG.selectors.forEach(selector => {
        const el = e.target.closest(selector);
        if (el) this.track(el);
      });
    }, { passive: true });
    
    window.addEventListener('beforeunload', () => this.flush());
    this.initContactButtons();
  },

  track: function(el) {
    const data = {
      website_id: CONFIG.websiteId,
      button_name: el.title || el.getAttribute('aria-label') || el.textContent.trim() || el.href,
      button_link: el.href,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    };
    this.queue.push(data);
    if (this.queue.length >= CONFIG.maxBatchSize) this.flush();
    else if (!this.timer) this.timer = setTimeout(() => this.flush(), CONFIG.batchTimeout);
  },

  flush: function() {
    if (this.queue.length === 0) return;
    const batch = [...this.queue];
    this.queue = [];
    clearTimeout(this.timer);
    this.timer = null;

    fetch(CONFIG.googleSheetsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch })
    }).catch(() => {});
  },

  initContactButtons: function() {
    const currentHost = window.location.hostname.toLowerCase();
    const isCustom = CONFIG.customContactDomains.includes(currentHost);
    const phone = isCustom ? CONFIG.customPhoneNumber : CONFIG.defaultPhoneNumber;
    const display = isCustom ? CONFIG.customDisplayNumber : CONFIG.defaultDisplayNumber;

    const selector = '#app-main .page-product .box_main .box-button, #app .page-main-mobile .box-button';
    const container = document.querySelector(selector);
    if (container) {
      container.innerHTML = `<a href="tel:${phone}" class="btn-buynow contact-btn-full" style="display:block">Liên hệ: ${display}</a>`;
    }
  }
};

export default Tracker;
