/**
 * Global Sync Script - Holiday Effects CDN
 * Chạy lệnh: node scripts/sync-all.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../deploy-config.json');
const SOURCE_FILE = path.join(__dirname, '../dist/holiday-effects-full.min.js');

if (!fs.existsSync(CONFIG_PATH)) {
    console.error("❌ Không tìm thấy deploy-config.json. Vui lòng tạo tệp cấu hình trước.");
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

console.log("🚀 Bắt đầu quá trình đồng bộ lên " + config.destinations.length + " server...");

config.destinations.forEach(server => {
    console.log(`\n-----------------------------------------`);
    console.log(`📦 Đang đẩy lên: ${server.name} (${server.host || 'S3'})`);
    
    try {
        let cmd = "";
        if (server.type === 'ftp') {
            // Lệnh curl để upload FTP
            cmd = `curl -T "${SOURCE_FILE}" ftp://${server.user}:${server.password}@${server.host}${server.path}`;
        } else if (server.type === 's3') {
            // Lệnh aws cli để upload S3
            cmd = `aws s3 cp "${SOURCE_FILE}" s3://${server.bucket}${server.path} --region ${server.region}`;
        } else if (server.type === 'sftp') {
            // Lệnh curl cho SFTP
            cmd = `curl -u ${server.user}:${server.password} -T "${SOURCE_FILE}" sftp://${server.host}${server.path}`;
        }

        if (cmd) {
            console.log("⏳ Đang thực thi lệnh upload...");
            execSync(cmd, { stdio: 'inherit' });
            console.log(`✅ Thành công: ${server.name}`);
        } else {
            console.warn(`⚠️ Loại server ${server.type} không hỗ trợ.`);
        }
    } catch (error) {
        console.error(`❌ Thất bại tại ${server.name}:`, error.message);
    }
});

console.log(`\n=========================================`);
console.log("🎉 QUÁ TRÌNH ĐỒNG BỘ HOÀN TẤT!");
