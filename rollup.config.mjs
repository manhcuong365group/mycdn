import terser from '@rollup/plugin-terser';

const terserConfig = terser({
  format: { comments: false },
  compress: { drop_console: true, drop_debugger: true },
  mangle: {
    toplevel: true,
    reserved: ['HolidayEffects', 'HolidayTracker', 'HolidayBanner']
  }
});

export default [
  // 1. Module Hiệu ứng (Engine)
  {
    input: 'src/core/Manager.js',
    output: {
      file: 'dist/core.min.js',
      format: 'iife',
      name: 'HolidayEffects',
      plugins: [terserConfig]
    }
  },
  // 2. Module Tracking
  {
    input: 'src/modules/Tracker.js',
    output: {
      file: 'dist/tracker.min.js',
      format: 'iife',
      name: 'HolidayTracker',
      plugins: [terserConfig]
    }
  },
  // 3. Loader Thông minh (Dùng cho khách hàng)
  {
    input: 'src/loader.js',
    output: {
      file: 'dist/loader.js',
      format: 'iife',
      plugins: [terserConfig]
    }
  },
  // 4. Module Điều khiển Sản phẩm (Mới)
  {
    input: 'src/product-handler.js',
    output: {
      file: 'dist/product-handler.min.js',
      format: 'iife',
      plugins: [terserConfig]
    }
  },
  // 5. Module UI Cơ bản
  {
    input: 'src/base-ui.js',
    output: {
      file: 'dist/base-ui.min.js',
      format: 'iife',
      plugins: [terserConfig]
    }
  }
];
