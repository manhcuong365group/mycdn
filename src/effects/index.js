/**
 * Effect Registry
 */
import { tet } from './tet.js';
import { victory } from './victory.js';

const EFFECT_REGISTRY = {
  tet: tet,
  victory: victory,
  lixi: { char: "🧧" },
  valentine: { char: () => Math.random() > 0.5 ? "🌹" : "❤️" },
  noel: { char: "❄️" },
  autumn: { char: "🍁" },
  mid_autumn: { char: "🏮" },
  none: { char: "" }
};

export default EFFECT_REGISTRY;
