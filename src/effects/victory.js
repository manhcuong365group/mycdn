/**
 * Victory (30/04 Anniversary) Effect Logic - Cinematic Pro Version
 * Features Shape-Based Fireworks (Text, Emojis, Stars) via Canvas Sampling.
 */

// Cache for shape vectors to save performance
const shapeCache = {};

function getShapeVectors(text) {
    if (shapeCache[text]) return shapeCache[text];
    
    // Tạo canvas ngang dài để chứa được toàn bộ chữ rộng
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    if (text === "FLAG") {
        // DỰNG CỜ VIỆT NAM TRÊN CANVAS
        // Nền đỏ (Tỷ lệ cờ chuẩn 2/3)
        const flagW = 210;
        const flagH = 140;
        ctx.fillStyle = "#FF0000"; // Red
        ctx.fillRect(300 - flagW/2, 100 - flagH/2, flagW, flagH);
        
        // Ngôi sao vàng ở giữa
        ctx.fillStyle = "#FFFF00"; // Yellow
        ctx.save();
        ctx.translate(300, 100);
        ctx.beginPath();
        const points = 5;
        const outerRadius = 35;
        const innerRadius = 14;
        for (let i = 0; i < points * 2; i++) {
            const r = (i % 2 === 0) ? outerRadius : innerRadius;
            const a = (i * Math.PI) / points - (Math.PI / 2);
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
    } else {
        if (text === "★") {
            ctx.font = "80px Arial";
        } else {
            ctx.font = "bold 60px 'Arial Black', sans-serif";
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        
        // Hỗ trợ tính năng xuống dòng bằng ký tự \n
        const lines = text.split('\n');
        // Căn giữa theo trục Y
        const startY = 100 - ((lines.length - 1) * 35);
        
        lines.forEach((line, i) => {
            ctx.fillText(line, 300, startY + (i * 70));
        });
    }
    
    const imgData = ctx.getImageData(0, 0, 600, 200).data;
    const vectors = [];
    
    // Lấy mẫu (step=4)
    for (let y = 0; y < 200; y += 4) {
        for (let x = 0; x < 600; x += 4) {
            const idx = (y * 600 + x) * 4;
            const a = imgData[idx + 3];
            
            if (a > 128) {
                let sparkColor = null;
                
                // Phân biệt đỏ và vàng theo mức độ kênh G của Pixel thực tế
                if (text === "FLAG") {
                    const g = imgData[idx + 1]; 
                    if (g > 128) {
                        sparkColor = "#FFD600"; // Màu Vàng (Sao)
                    } else {
                        sparkColor = "#FF5252"; // Màu Đỏ (Nền)
                    }
                }
                
                vectors.push({
                    vx: (x - 300) * 0.045, 
                    vy: (y - 100) * 0.045,
                    color: sparkColor // Truyền tải luôn màu pixel vào vector
                });
            }
        }
    }
    
    // Shuffle
    vectors.sort(() => 0.5 - Math.random());
    
    // Cờ VN khối hình chữ nhật đông pixel nên cho limit to lên mới phủ kín
    const limit = text === "FLAG" ? 450 : 350;
    const finalVectors = vectors.slice(0, limit); 
    
    shapeCache[text] = finalVectors;
    return finalVectors;
}


function drawStar(ctx, size) {
    const points = 5;
    const inset = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0 - size);
    for (let i = 0; i < points; i++) {
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - (size * inset));
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - size);
    }
    ctx.closePath();
    ctx.fill();
}

export const victory = {
    isDraw: true,
    
    init: function(p) {
        const r = Math.random();
        
        // Cấu trúc lại để dồn toàn bộ sự chú ý vào Sao Vàng (95%) và Pháo Hoa VIP (5%)
        if (r < 0.9) {
            p.subType = 'star';
            p.color = "#FFD600";
        } else {
            // PHÁO HOA PRO (Chỉ 5%)
            p.subType = 'firework';
            p.state = 'shoot'; 
            p.color = Math.random() > 0.5 ? "#FFD600" : "#FF5252";
            p.y = window.innerHeight + 10;
            p.x = window.innerWidth * 0.15 + Math.random() * (window.innerWidth * 0.7);
            
            // Lên rất chậm từ từ chứ không vụt một phát bay mất
            p.targetY = window.innerHeight * 0.15 + Math.random() * (window.innerHeight * 0.25);
            p.speed = - (3 + Math.random() * 3); // Bay chậm
            p.sparks = [];
        }
    },

    draw: function(ctx, size, p) {
        size = size * 0.5;

        if (p.subType === 'firework') {
            ctx.rotate(-(p.rotation || 0) * Math.PI / 180);

            if (p.state === 'shoot') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Tia lửa đuôi
                for (let i = 0; i < 4; i++) {
                    ctx.globalAlpha = (p.opacity || 1) * (0.4 - (i * 0.1));
                    ctx.beginPath();
                    ctx.arc(0, 5 + (i * 4), 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Check nổ
                if (p.y <= p.targetY) {
                    p.state = 'explode';
                    p.speed = 0; 
                    
                    const colors = ["#FFD600", "#FF5252", "#00E5FF", "#4CAF50", "#FF9800"];
                    let unifiedColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    // CHIA ĐỀU TỶ LỆ: 50% Pháo Thường (4 loại) - 50% Pháo Chữ/Cờ VIP (5 loại)
                    const rType = Math.random();
                    let chosenType;
                    
                    // -- 50% Nhóm Thường (Nhiều kiểu dáng nghệ thuật) --
                    if (rType < 0.125) chosenType = "peony";         // Đa sắc xòe to
                    else if (rType < 0.25) chosenType = "willow";    // Liễu rủ vàng/bạc
                    else if (rType < 0.375) chosenType = "ring";     // Vòng khuyên (Ring)
                    else if (rType < 0.50) chosenType = "chrysanthemum"; // Cúc đại đóa
                    
                    // -- 50% Nhóm VIP (Hình, Chữ và Cờ VN) --
                    else if (rType < 0.60) chosenType = "★";            // Ngôi sao vàng
                    else if (rType < 0.70) chosenType = "30 - 04";      // Ngày lịch sử
                    else if (rType < 0.80) chosenType = "1975\n2026";   // Năm
                    else if (rType < 0.90) chosenType = "TỰ HÀO\nVIỆT NAM";                // Hoành tráng
                    else chosenType = "FLAG";                           // Cờ VN

                    // Nếu là Ngôi Sao thì BẮT BUỘC MÀU VÀNG
                    if (chosenType === "★") {
                        unifiedColor = "#FFD600";
                    }

                    if (chosenType === "peony") {
                        // Cúc mẫu đơn (Bùng xòe ra to, tan nhanh)
                        const sparkCount = 45 + Math.floor(Math.random() * 20);
                        for (let i = 0; i < sparkCount; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const force = 2 + Math.random() * 4; 
                            p.sparks.push({
                                x: 0, y: 0,
                                vx: Math.cos(angle) * force, vy: Math.sin(angle) * force,
                                life: 1.2, size: 1.5 + Math.random(),
                                color: colors[Math.floor(Math.random() * colors.length)],
                                drag: 0.96, gravity: 0.05
                            });
                        }
                    } else if (chosenType === "chrysanthemum") {
                        // Cúc đại đóa (Đuôi dài hơn, bay xa, nổ ra lớn)
                        const sparkCount = 60 + Math.floor(Math.random() * 20);
                        for (let i = 0; i < sparkCount; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const force = 3 + Math.random() * 5; 
                            p.sparks.push({
                                x: 0, y: 0,
                                vx: Math.cos(angle) * force, vy: Math.sin(angle) * force,
                                life: 1.5, size: 1.8,
                                color: unifiedColor, 
                                drag: 0.94, gravity: 0.04
                            });
                        }
                    } else if (chosenType === "willow") {
                        // Liễu rủ (Rớt từ từ)
                        const sparkCount = 50 + Math.floor(Math.random() * 15);
                        const willowColor = Math.random() > 0.5 ? "#FFD700" : "#FFFFFF"; // Vàng hoặc bạc
                        for (let i = 0; i < sparkCount; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const force = 1 + Math.random() * 2.5; 
                            p.sparks.push({
                                x: 0, y: 0,
                                vx: Math.cos(angle) * force, vy: Math.sin(angle) * force,
                                life: 2.0, size: 1.2 + Math.random(), // Thọ lâu
                                color: willowColor,
                                drag: 0.98, gravity: 0.08
                            });
                        }
                    } else if (chosenType === "ring") {
                        // Vòng khuyên (Ring tròn hoàn hảo)
                        const sparkCount = 35 + Math.floor(Math.random() * 15);
                        const force = 4 + Math.random() * 2; // Lực đồng đều
                        for (let i = 0; i < sparkCount; i++) {
                            const angle = (i / sparkCount) * Math.PI * 2;
                            p.sparks.push({
                                x: 0, y: 0,
                                vx: Math.cos(angle) * force, vy: Math.sin(angle) * force,
                                life: 1.2, size: 1.8 + Math.random(),
                                color: unifiedColor,
                                drag: 0.96, gravity: 0.02
                            });
                        }
                    } else {
                        // Text / Hình Siêu Rõ
                        const vectors = getShapeVectors(chosenType);
                        vectors.forEach(v => {
                            p.sparks.push({
                                x: 0, y: 0,
                                vx: v.vx + (Math.random() - 0.5) * 0.3,
                                vy: v.vy + (Math.random() - 0.5) * 0.3,
                                life: 3.5, // Giữ cực lâu trên bầu trời để cho dễ ấn tượng
                                size: 1.2 + Math.random(),
                                color: v.color || unifiedColor, // Ưu tiên màu lấy từ Pixel 
                                drag: 0.92, gravity: 0.01 // Khựng lại thành chữ trên cao
                            });
                        });
                    }
                }
            } else if (p.state === 'explode') {
                let allDead = true;
                ctx.lineCap = "round";
                
                p.sparks.forEach(s => {
                    if (s.life > 0) {
                        allDead = false;
                        
                        if (p.y + s.y < 0) {
                            s.life = 0; return;
                        }

                        ctx.globalAlpha = Math.max(0, s.life * (p.opacity || 1));
                        
                        ctx.strokeStyle = s.color || p.color;
                        ctx.lineWidth = s.size;
                        
                        // Vẽ Motion Blur 
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(s.x - s.vx * 2.5, s.y - s.vy * 2.5); 
                        ctx.stroke();

                        // Vật lý 
                        s.x += s.vx;
                        s.y += s.vy;
                        s.vy += s.gravity;    
                        s.vx *= s.drag;       
                        s.vy *= s.drag; 
                        s.life -= 0.012; // Phân rã siêu rùa
                    }
                });

                if (allDead) {
                    p.state = 'shoot';
                    p.y = window.innerHeight + 10; 
                    p.x = window.innerWidth * 0.15 + Math.random() * (window.innerWidth * 0.7);
                    p.targetY = window.innerHeight * 0.15 + Math.random() * (window.innerHeight * 0.25);
                    p.speed = - (3 + Math.random() * 3); // Bay chậm
                    p.sparks = [];
                }
            }
            return;
        }

        ctx.fillStyle = p.color || "#FFD600";
        if (p.subType === 'star') {
            drawStar(ctx, size);
        }
    }
};
