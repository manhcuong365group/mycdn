# Holiday Effects CDN

Build script cho Holiday Effects CDN - Tạo file minified và gzipped cho production.

## 🚀 Cách sử dụng

### Build JavaScript

```bash
bash build.sh
```

Script sẽ tự động:
- ✅ Minify `holiday-effects-full.js` thành `dist/holiday-effects-full.min.js`
- ✅ Tạo file gzipped `dist/holiday-effects-full.min.js.gz`
- ✅ Tạo versioned file `dist/holiday-effects-full-v2.0.0.min.js`
- ✅ Tạo SRI hash cho security
- ✅ Tạo file `dist/usage.html` với hướng dẫn sử dụng

### Thêm CSS (tùy chọn)

Nếu bạn muốn thêm CSS cho effects:

1. **Tạo file CSS** trong thư mục root:
   ```bash
   # Tạo file holiday-effects-full.css
   touch holiday-effects-full.css
   ```

2. **Cài đặt CSS minifier** (chỉ cần 1 lần):
   ```bash
   npm install -g csso-cli
   ```

3. **Build lại**:
   ```bash
   bash build.sh
   ```

Script sẽ tự động:
- ✅ Minify CSS thành `dist/holiday-effects-full.min.css`
- ✅ Tạo file gzipped `dist/holiday-effects-full.min.css.gz`
- ✅ Tạo versioned CSS file
- ✅ Tạo SRI hash cho CSS
- ✅ Cập nhật `usage.html` với CSS link

## 📦 Output Files

### Chỉ có JavaScript:
```
dist/
├── holiday-effects-full.min.js          # Minified JS
├── holiday-effects-full.min.js.gz       # Gzipped JS
├── holiday-effects-full-v2.0.0.min.js   # Versioned JS
└── usage.html                            # Usage example
```

### Có cả JavaScript và CSS:
```
dist/
├── holiday-effects-full.min.js          # Minified JS
├── holiday-effects-full.min.js.gz       # Gzipped JS
├── holiday-effects-full-v2.0.0.min.js   # Versioned JS
├── holiday-effects-full.min.css         # Minified CSS
├── holiday-effects-full.min.css.gz      # Gzipped CSS
├── holiday-effects-full-v2.0.0.min.css  # Versioned CSS
└── usage.html                            # Usage example (with CSS)
```

## 🔧 Requirements

- **Terser** (cho JavaScript minification): Tự động cài đặt nếu chưa có
- **csso-cli** (cho CSS minification): Tùy chọn, chỉ cần khi có CSS
- **OpenSSL**: Để tạo SRI hash (thường có sẵn)
- **Gzip**: Để nén file (thường có sẵn)

## 📝 Usage Example

Sau khi build, xem file `dist/usage.html` để biết cách sử dụng:

```html
<!-- JavaScript -->
<script 
  src="https://cdn.auto365.com.vn/effects/holiday-effects-full.min.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>

<!-- CSS (nếu có) -->
<link 
  rel="stylesheet" 
  href="https://cdn.auto365.com.vn/effects/holiday-effects-full.min.css"
  integrity="sha384-..."
  crossorigin="anonymous">

<!-- Initialize -->
<script>
  HolidayEffects.init({
    effect: 'tet',
    performance: 'auto',
    banner: {
      enabled: true,
      position: 'sides'
    }
  });
</script>
```

## 🎯 Version Management

Để thay đổi version, sửa biến `VERSION` trong `build.sh`:

```bash
VERSION="2.0.0"  # Thay đổi version tại đây
```

## 📤 Deploy to CDN

Upload files lên CDN:

```bash
# AWS S3
aws s3 cp dist/ s3://your-bucket/effects/ --recursive

# hoặc sử dụng FTP, rsync, etc.
```

## 💡 Tips

- File gzipped (`.gz`) giúp giảm bandwidth khi server hỗ trợ gzip compression
- SRI hash đảm bảo file không bị thay đổi (security)
- Versioned files giúp cache control tốt hơn
- CSS là optional - chỉ cần khi bạn muốn style riêng

## 🐛 Troubleshooting

### Lỗi "terser not found"
```bash
npm install -g terser
```

### Lỗi "csso not found" (khi có CSS)
```bash
npm install -g csso-cli
```

### Lỗi "bc not found"
Không ảnh hưởng đến build, chỉ là tính toán % reduction không hiển thị.

## 📄 License

MIT License - 365Group
