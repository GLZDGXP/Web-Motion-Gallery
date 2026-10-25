// 樱花飘落 SakuraPetals
// Canvas 2D: 花瓣飘落旋转 + 风场扰动 + 点击扬起花瓣
function SakuraPetals({ accentColor = '#ffb7c5' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let rafId = null;
    let time = 0;
    let windX = 0.5;
    let mouseX = 0, mouseY = 0;

    const PETAL_COUNT = 80;
    const petals = [];

    // 预渲染花瓣 sprite（GPU 加速：用 drawImage 替代路径绘制）
    function makePetalSprite(size) {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const cx = c.getContext('2d');
      const s = size / 2;
      // 花瓣形状：椭圆 + 渐变
      const grad = cx.createRadialGradient(s * 0.7, s * 0.5, 0, s, s * 0.5, s);
      grad.addColorStop(0, '#fff0f5');
      grad.addColorStop(0.4, '#ffd1dc');
      grad.addColorStop(0.7, '#ffb7c5');
      grad.addColorStop(1, '#ff9eb5');
      cx.fillStyle = grad;
      cx.beginPath();
      cx.ellipse(s, s * 0.5, s * 0.9, s * 0.4, 0, 0, Math.PI * 2);
      cx.fill();
      // 纹路
      cx.strokeStyle = 'rgba(255, 100, 130, 0.3)';
      cx.lineWidth = 0.5;
      cx.beginPath();
      cx.moveTo(s * 0.1, s * 0.5);
      cx.lineTo(s * 1.9, s * 0.5);
      cx.stroke();
      return c;
    }

    const petalSprites = [
      makePetalSprite(16),
      makePetalSprite(24),
      makePetalSprite(32),
    ];

    function createPetal(fromTop = true) {
      const sizeIdx = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * w,
        y: fromTop ? -20 - Math.random() * 100 : Math.random() * h,
        vx: windX + (Math.random() - 0.5) * 1,
        vy: 0.5 + Math.random() * 1.5,
        size: sizeIdx,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.02 + Math.random() * 0.02,
        depth: sizeIdx / 2, // 0 = 远, 1 = 近
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // 初始化花瓣
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(createPetal(false));
    }

    function draw(t) {
      rafId = requestAnimationFrame(draw);
      const dt = Math.min((t - time) / 16.67, 2);
      time = t;

      ctx.clearRect(0, 0, w, h);

      // 背景淡粉渐变
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#1a1525');
      bgGrad.addColorStop(1, '#0d0a15');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 风场更新
      windX = 0.3 + Math.sin(t * 0.001) * 0.5;

      // 更新和绘制花瓣
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.swing += p.swingSpeed * dt;
        p.rotation += p.rotSpeed * dt;

        // 摆动 + 风
        p.vx += Math.sin(p.swing) * 0.02 * dt;
        p.vx += (windX - p.vx) * 0.01 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * (1 + p.depth * 0.5) * dt;

        // 超出边界重置
        if (p.y > h + 30 || p.x < -30 || p.x > w + 30) {
          petals[i] = createPetal(true);
          continue;
        }

        // 绘制
        const sprite = petalSprites[p.size];
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation + Math.sin(p.swing) * 0.3);
        ctx.globalAlpha = 0.7 + p.depth * 0.3;
        ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        ctx.restore();
      }

      // 地面花瓣堆积
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 15; i++) {
        const x = (i / 15) * w + Math.sin(t * 0.0005 + i) * 5;
        const y = h - 5 + Math.sin(i * 1.5) * 3;
        const s = 8 + (i % 3) * 4;
        ctx.drawImage(petalSprites[i % 3], x - s / 2, y - s / 2, s, s * 0.5);
      }
      ctx.globalAlpha = 1;
    }

    // 交互：点击扬起花瓣
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 12; i++) {
        const p = createPetal(true);
        p.x = cx + (Math.random() - 0.5) * 40;
        p.y = cy + (Math.random() - 0.5) * 30;
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = -2 - Math.random() * 3;
        petals.push(p);
      }
      // 限制总数
      while (petals.length > PETAL_COUNT + 20) petals.shift();
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMove);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: '100%', height: '100%', display: 'block', cursor: 'pointer' }
  });
}

window.SakuraPetals = SakuraPetals;
