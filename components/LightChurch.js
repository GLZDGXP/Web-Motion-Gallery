// 光之教堂 LightChurch
// Canvas 2D: 体积光柱阵列 + 尘埃粒子 + 鼠标控制偏移
function LightChurch({ accentColor = '#ffddaa' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let rafId = null;
    let time = 0;
    let mouseX = 0, mouseY = 0;

    const BEAM_COUNT = 6;
    const DUST_COUNT = 80;

    const dust = [];

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

    // 初始化尘埃
    for (let i = 0; i < DUST_COUNT; i++) {
      dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.1 + Math.random() * 0.3,
        size: 0.5 + Math.random() * 2,
        twinkle: Math.random() * Math.PI * 2,
        inBeam: 0,
      });
    }

    function draw(t) {
      rafId = requestAnimationFrame(draw);
      const dt = Math.min((t - time) / 16.67, 2);
      time = t;

      // 深色背景
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0d15');
      bgGrad.addColorStop(1, '#05060a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const beamOffsetX = mouseX * 30;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 光束（梯形体积光）
      for (let i = 0; i < BEAM_COUNT; i++) {
        const bx = (i + 0.5) * (w / BEAM_COUNT) + beamOffsetX * (i % 2 ? 1 : -1);
        const beamTopW = 15 + Math.sin(t * 0.001 + i) * 5;
        const beamBottomW = 60 + Math.sin(t * 0.0015 + i * 1.5) * 15;
        const beamTop = -10;
        const beamBottom = h + 10;

        const grad = ctx.createLinearGradient(bx, beamTop, bx, beamBottom);
        grad.addColorStop(0, 'rgba(255, 230, 180, 0)');
        grad.addColorStop(0.2, 'rgba(255, 220, 160, 0.08)');
        grad.addColorStop(0.5, 'rgba(255, 200, 140, 0.12)');
        grad.addColorStop(0.8, 'rgba(255, 180, 120, 0.06)');
        grad.addColorStop(1, 'rgba(255, 160, 100, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(bx - beamTopW, beamTop);
        ctx.lineTo(bx + beamTopW, beamTop);
        ctx.lineTo(bx + beamBottomW, beamBottom);
        ctx.lineTo(bx - beamBottomW, beamBottom);
        ctx.closePath();
        ctx.fill();

        // 光束边缘
        ctx.strokeStyle = 'rgba(255, 220, 160, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx - beamTopW, beamTop);
        ctx.lineTo(bx - beamBottomW, beamBottom);
        ctx.moveTo(bx + beamTopW, beamTop);
        ctx.lineTo(bx + beamBottomW, beamBottom);
        ctx.stroke();
      }

      // 尘埃粒子
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.twinkle += 0.02 * dt;

        if (d.y > h + 10) { d.y = -10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;

        // 判断是否在光束中（简化：看 x 是否靠近光束中心）
        let brightness = 0.3;
        for (let j = 0; j < BEAM_COUNT; j++) {
          const bx = (j + 0.5) * (w / BEAM_COUNT) + beamOffsetX * (j % 2 ? 1 : -1);
          const beamW = 40 + (d.y / h) * 40;
          const dist = Math.abs(d.x - bx);
          if (dist < beamW) {
            brightness = Math.max(brightness, (1 - dist / beamW) * 1.5);
          }
        }
        d.inBeam = brightness;

        const alpha = brightness * (0.5 + Math.sin(d.twinkle) * 0.3);
        const size = d.size * (1 + brightness * 0.5);

        ctx.fillStyle = `rgba(255, 230, 190, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 底部地面反光
      const groundGrad = ctx.createLinearGradient(0, h - 20, 0, h);
      groundGrad.addColorStop(0, 'rgba(255, 200, 150, 0.05)');
      groundGrad.addColorStop(1, 'rgba(255, 200, 150, 0)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h - 20, w, 20);
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    canvas.addEventListener('mousemove', onMove);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: '100%', height: '100%', display: 'block' }
  });
}

window.LightChurch = LightChurch;
