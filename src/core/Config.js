/**
 * Holiday Effects - Configuration Handler
 */
export const DEFAULT_CONFIG = {
  effect: 'victory',
  count: 24,
  speedMult: 1.0,
  banner: {
    enabled: false,
    position: "sides",
    images: {
      left: "https://cdn.auto365.com.vn/effects/images/decor-left.png",
      right: "https://cdn.auto365.com.vn/effects/images/decor-right.png"
    },
    responsive: { hideOnMobile: true, breakpoint: 1024 }
  }
};

export function mergeConfig(userConfig = {}) {
  const script = document.currentScript || document.querySelector('script[src*="holiday-effects"]');
  const auto = script ? {
    effect: script.dataset.effect || null,
    count: parseInt(script.dataset.count) || null,
    speedMult: parseFloat(script.dataset.speed) || null,
    bannerEnabled: script.dataset.banner === "true",
    bannerLeft: script.dataset.bannerLeft,
    bannerRight: script.dataset.bannerRight
  } : {};

  const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  
  // Merge Auto (from dataset)
  if (auto.effect) config.effect = auto.effect;
  if (auto.count) config.count = auto.count;
  if (auto.speedMult) config.speedMult = auto.speedMult;
  if (auto.bannerEnabled) config.banner.enabled = true;
  if (auto.bannerLeft) config.banner.images.left = auto.bannerLeft;
  if (auto.bannerRight) config.banner.images.right = auto.bannerRight;

  // Merge User
  return Object.assign(config, userConfig);
}
