import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

async function build() {
  console.log("🚀 Đang đóng gói CDN siêu gọn nhẹ...");

  try {
    // 1. Chạy Rollup
    console.log("📦 Đang tạo các module chính...");
    execSync("npx rollup -c", { stdio: "inherit" });

    // 2. Đồng bộ config.json
    if (fs.existsSync("config.json")) {
      fs.copyFileSync("config.json", "dist/config.json");
      console.log("⚙️ Đã đồng bộ config.json vào /dist");
    }

    if (fs.existsSync('src/base-ui.css')) {
        fs.copyFileSync('src/base-ui.css', 'dist/base-ui.css');
        console.log('🏛️ Đã đồng bộ base-ui.css vào /dist');
    }

    // 3. Tính toán SRI cho loader.js
    const loaderPath = "dist/loader.js";
    if (fs.existsSync(loaderPath)) {
      console.log("🔒 Đang tạo mã bảo mật SRI cho loader.js...");
      const buffer = fs.readFileSync(loaderPath);
      const hash = crypto.createHash("sha384").update(buffer).digest("base64");
      const sri = `sha384-${hash}`;

      // Cập nhật vào usage.html
      const usagePath = "dist/usage.html";
      if (fs.existsSync(usagePath)) {
        let usageContent = fs.readFileSync(usagePath, "utf8");
        // Tìm dòng script src...loader.js và thêm integrity
        const scriptTag = `<script src="https://cdn.auto365.com.vn/effects/loader.js" integrity="${sri}" crossorigin="anonymous"></script>`;
        usageContent = usageContent.replace(
          /<pre>[\s\S]*?<\/pre>/,
          `<pre>${scriptTag.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`,
        );
        fs.writeFileSync(usagePath, usageContent);
        console.log("📝 Đã cập nhật mã nhúng mới vào usage.html");
      }
    }

    // 3. Dọn dẹp file thừa
    const filesToRemove = [
      "dist/holiday-effects-full.dev.js",
      "dist/holiday-effects-full.dev.js.map",
      "dist/holiday-effects-full.min.js",
      "dist/holiday-effects-full.min.js.gz",
    ];

    filesToRemove.forEach((file) => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    console.log("✅ Hoàn tất! Hệ thống đã sẵn sàng triển khai.");
  } catch (error) {
    console.error("❌ Thất bại:", error.message);
    process.exit(1);
  }
}

build();
