/**
 * Holiday Effects - Master Entry Point [Modular]
 */
import Tracker from './modules/Tracker.js';
import BannerSystem from './modules/Banner.js';
import HolidayEffects from './core/Manager.js';

// Auto-init tracker (Universal Tracking)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Tracker.init());
  } else {
    Tracker.init();
  }
}

// Global Exports
if (typeof window !== 'undefined') {
  window.HolidayTracker = Tracker;
  window.HolidayBanner = BannerSystem;
  window.HolidayEffects = HolidayEffects;
}

export { Tracker, BannerSystem, HolidayEffects };
