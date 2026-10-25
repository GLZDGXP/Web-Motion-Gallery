// 粒子龙卷风 ParticleTornado
// Canvas 2D: 粒子绕轴螺旋上升 + 鼠标控制位置
function ParticleTornado({ accentColor = '#88ccff' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, cx, cy;
    let rafId = null;
    let time = 0;
    let targetX = 0, targetY = 0;
    let tornadoX = 0, tornadoY = 0;

    const PARTICLE_COUNT = 400;
    const particles = [];

    // 预渲染粒子 sprite
    const particleSprite = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 16;
      const ctx2 = c.getContext('2d');
      const g = ctx2.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, 'rgba(200, 220, 255, 0.9)');
      g.addColorStop(0.5, 'rgba(150, 190, 255, 0.4)');
      g.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx2.fillStyle = g;
      ctx2.fillRect(0, 0, 16, 16);
      return c;
    })();

    function createParticle() {
      const angle = Math.random() * Math.PI * 2;
      const t = Math.random(); // 0=底, 1=顶
      return {
        angle,
        radius: 5 + t * t * 80, // 底部窄顶部宽
        height: t,
        speed: 0.03 + Math.random() * 0.05,
        riseSpeed: 0.003 + Math.random() * 0.005,
        size: 2 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
        wobble: Math.random() * 0.5,
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      targetX = cx;
      targetY = h * 0.7;
      tornadoX = cx;
      tornadoY = h * 0.7;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    function draw(t) {
      rafId = requestAnimationFrame(draw);
      const dt = Math.min((t - time) / 16.67, 2);
      time = t;

      // 拖尾效果
      ctx.fillStyle = 'rgba(10, 15, 30, 0.15)';
      ctx.fillRect(0, 0, w, h);

      // 龙卷风中心移动
      tornadoX += (targetX - tornadoX) * 0.05;
      tornadoY += (targetY - tornadoY) * 0.05;

      const tornadoHeight = h * 0.7;

      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed * dt;
        p.height += p.riseSpeed * dt;
        p.phase += 0.02 * dt;

        // 顶部溢出重置到底部
        if (p.height > 1) {
          p.height = 0;
          p.angle = Math.random() * Math.PI * 2;
          p.radius = 5 + Math.random() * 10;
        }

        // 半径随高度增加（漏斗形）
        const r = p.radius + p.height * p.height * 60;
        // 摆动
        const wobbleX = Math.sin(p.phase) * p.wobble * 10;
        const wobbleY = Math.cos(p.phase * 1.3) * p.wobble * 5;

        const px = tornadoX + Math.cos(p.angle) * r + wobbleX;
        const py = tornadoY - p.height * tornadoHeight + wobbleY;
        const alpha = (1 - p.height * 0.6) * (0.3 + p.wobble * 0.4);
        const size = p.size * (1 + p.height * 0.5);

        ctx.globalAlpha = alpha;
        ctx.drawImage(particleSprite, px - size, py - size, size * 2, size * 2);
      }

      // 底部旋涡光晕
      const bottomGrad = ctx.createRadialGradient(tornadoX, tornadoY, 0, tornadoX, tornadoY, 80);
      bottomGrad.addColorStop(0, 'rgba(150, 200, 255, 0.3)');
      bottomGrad.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = bottomGrad;
      ctx.beginPath();
      ctx.ellipse(tornadoX, tornadoY, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = Math.min(h * 0.9, e.clientY - rect.top);
    };
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        targetX = e.touches[0].clientX - rect.left;
        targetY = Math.min(h * 0.9, e.touches[0].clientY - rect.top);
      }
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: '100%', height: '100%', display: 'block' }
  });
}

window.ParticleTornado = ParticleTornado;
