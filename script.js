<canvas id="fireworksCanvas"></canvas>
    <script>
    // Cài đặt canvas
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Lớp hạt pháo hoa hoặc lấp lánh quanh cờ
    class Particle {
      constructor(x, y, color, size, speedX, speedY, life, type = "normal") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.life = life;
        this.type = type;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type !== "trail" && this.type !== "flagSparkle") {
          this.speedY += 0.1;
          this.size *= 0.95;
        } else if (this.type === "flagSparkle") {
          this.size *= 0.98;
        }
        this.life--;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.type === "sparkle" || this.type === "flagSparkle" ? 20 : 12;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    const particles = [];
    let activeFireworks = [];
    let animationFrameId = null;
    let lastFireworkTime = 0;
    let fireworkInterval = null;
    let flagInterval = null;

    // Thêm cờ phấp phới và lấp lánh
    function showFlag() {
      const flag = document.createElement("img");
      flag.src = "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg";
      flag.className = "flag";
      const x = Math.random() * (window.innerWidth - 50);
      const y = Math.random() * (window.innerHeight - 30);
      flag.style.left = x + "px";
      flag.style.top = y + "px";

      document.body.appendChild(flag);
      createFlagSparkles(x + 25, y + 15);
      setTimeout(() => flag.remove(), 2500);
    }

    // Tạo hạt lấp lánh quanh cờ
    function createFlagSparkles(x, y) {
      const numSparkles = 10;
      const colors = ["#ff0000", "#ffd700"];
      for (let i = 0; i < numSparkles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 2 + 1;
        const size = Math.random() * 2 + 1;
        particles.push(new Particle(
          x, y, colors[Math.floor(Math.random() * 2)], size,
          Math.cos(angle) * speed, Math.sin(angle) * speed, 20, "flagSparkle"
        ));
      }
    }

    // Tạo pháo hoa bắn lên và nổ
    function firework() {
      const now = performance.now();
      if (now - lastFireworkTime < 800 || particles.length > 500 || activeFireworks.length > 3) return;
      lastFireworkTime = now;

      const colors = ["#ff0000", "#ffd700"];
      const fw = {
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: canvas.height * (0.1 + Math.random() * 0.3),
        speedY: -12,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      };

      activeFireworks.push(fw);
    }

    // Tạo hiệu ứng nổ tròn
    function createExplosion(x, y, color) {
      const numParticles = 50;
      for (let i = 0; i < numParticles; i++) {
        const type = Math.random() < 0.4 ? "sparkle" : "normal";
        const size = type === "sparkle" ? Math.random() * 2 + 1 : Math.random() * 4 + 2;
        const angle = (i / numParticles) * 2 * Math.PI;
        const speed = Math.random() * 5 + 2;
        const speedX = Math.cos(angle) * speed;
        const speedY = Math.sin(angle) * speed;
        particles.push(new Particle(
          x, y, color, size, speedX, speedY, Math.random() * 40 + 50, type
        ));
      }
    }

    // Vòng lặp animation
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cập nhật và vẽ pháo hoa
      activeFireworks = activeFireworks.filter(fw => fw.y > fw.targetY);
      activeFireworks.forEach(fw => {
        fw.y += fw.speedY;
        if (Math.random() < 0.5) {
          fw.trail.push(new Particle(fw.x, fw.y, fw.color, 1.5, Math.random() * 1 - 0.5, 0, 8, "trail"));
        }
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = fw.color;
        ctx.fill();

        fw.trail = fw.trail.filter(p => p.life > 0);
        fw.trail.forEach(p => {
          p.update();
          p.draw();
          particles.push(p);
        });

        if (fw.y <= fw.targetY) {
          createExplosion(fw.x, fw.y, fw.color);
        }
      });

      // Cập nhật và vẽ hạt
      particles.forEach((particle, index) => {
        if (particle.life <= 0 || particle.size <= 0.1) {
          particles.splice(index, 1);
        } else {
          particle.update();
          particle.draw();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    // Quản lý hiệu ứng khi tab thay đổi trạng thái
    function startIntervals() {
      // Reset trạng thái
      activeFireworks = [];
      particles.length = 0;
      if (!fireworkInterval) {
        fireworkInterval = setInterval(firework, 2000);
      }
      if (!flagInterval) {
        flagInterval = setInterval(showFlag, 2500);
      }
      if (!animationFrameId) {
        animate();
      }
    }

    function stopIntervals() {
      clearInterval(fireworkInterval);
      clearInterval(flagInterval);
      fireworkInterval = null;
      flagInterval = null;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      activeFireworks = [];
      particles.length = 0;
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        startIntervals();
      } else {
        stopIntervals();
      }
    });

    // Bắt đầu hiệu ứng
    startIntervals();
  </script>
