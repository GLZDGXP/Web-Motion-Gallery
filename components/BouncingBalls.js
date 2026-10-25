// 弹跳球物理群 BouncingBalls
// Canvas 2D: 弹性小球碰撞弹跳 + 重力摩擦 + 点击注入
function BouncingBalls({ accentColor = '#00e5ff' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let rafId = null;
    let time = 0;
    let mouseX = 0, mouseY = 0;

    const BALL_COUNT = 30;
    const balls = [];

    // 预渲染球 sprite（带高光）
    function makeBallSprite(size, color) {
      const c = document.createElement('canvas');
      c.width = c.height = size * 2;
      const cx = c.getContext('2d');
      const grad = cx.createRadialGradient(size * 0.6, size * 0.4, size * 0.1, size, size, size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, color.replace(')', ', 0.7)').replace('rgb', 'rgba'));
      cx.fillStyle = grad;
      cx.beginPath();
      cx.arc(size, size, size * 0.95, 0, Math.PI * 2);
      cx.fill();
      return c;
    }

    const colors = [
      'rgb(0, 229, 255)',
      'rgb(177, 77, 255)',
      'rgb(255, 100, 150)',
      'rgb(255, 200, 80)',
      'rgb(100, 255, 180)',
      'rgb(255, 150, 80)',
    ];

    function createBall(x, y, vx, vy) {
      const r = 8 + Math.random() * 16;
      const colorIdx = Math.floor(Math.random() * colors.length);
      return {
        x, y,
        vx: vx !== undefined ? vx : (Math.random() - 0.5) * 4,
        vy: vy !== undefined ? vy : (Math.random() - 0.5) * 4,
        r,
        mass: r * r * 0.01,
        colorIdx,
        sprite: makeBallSprite(r, colors[colorIdx]),
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

    for (let i = 0; i < BALL_COUNT; i++) {
      balls.push(createBall(
        Math.random() * w,
        Math.random() * h * 0.5,
      ));
    }

     const GRAVITY = 0.15;
     const FRICTION = 0.995;
     const BOUNCE = 0.55;
     const RESTITUTION = 0.6;

    function draw(t) {
      rafId = requestAnimationFrame(draw);
      const dt = Math.min((t - time) / 16.67, 2);
      time = t;

      ctx.fillStyle = 'rgba(10, 15, 30, 0.25)';
      ctx.fillRect(0, 0, w, h);

      // 地面阴影
      const groundY = h - 4;
      ctx.fillStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.fillRect(0, groundY, w, 4);

      // 更新物理
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.vy += GRAVITY * dt;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // 墙壁碰撞
        if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * BOUNCE; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -b.vx * BOUNCE; }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = -b.vy * BOUNCE; }
        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy = -b.vy * BOUNCE;
          if (Math.abs(b.vy) < 1) b.vy = 0;
        }
      }

      // 球与球碰撞（空间分区优化）
      const cellSize = 40;
      const grid = new Map();
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const gx = Math.floor(b.x / cellSize);
        const gy = Math.floor(b.y / cellSize);
        const key = gx + ',' + gy;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(i);
      }

      const checked = new Set();
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const gx = Math.floor(b.x / cellSize);
        const gy = Math.floor(b.y / cellSize);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = (gx+dx) + ',' + (gy+dy);
            const cell = grid.get(key);
            if (!cell) continue;
            for (const j of cell) {
              if (j <= i) continue;
              const pairKey = i < j ? i + '-' + j : j + '-' + i;
              if (checked.has(pairKey)) continue;
              checked.add(pairKey);
              const other = balls[j];
              const dx2 = other.x - b.x;
              const dy2 = other.y - b.y;
              const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
              const minDist = b.r + other.r;
              if (dist < minDist && dist > 0) {
                // 碰撞响应
                const nx = dx2 / dist;
                const ny = dy2 / dist;
                const overlap = minDist - dist;
                const totalMass = b.mass + other.mass;
                b.x -= nx * overlap * (other.mass / totalMass);
                b.y -= ny * overlap * (other.mass / totalMass);
                other.x += nx * overlap * (b.mass / totalMass);
                other.y += ny * overlap * (b.mass / totalMass);

                const dvx = b.vx - other.vx;
                const dvy = b.vy - other.vy;
                const dvDotN = dvx * nx + dvy * ny;
                if (dvDotN > 0) continue;

                const impulse = -(1 + RESTITUTION) * dvDotN / totalMass;
                b.vx += impulse * other.mass * nx;
                b.vy += impulse * other.mass * ny;
                other.vx -= impulse * b.mass * nx;
                other.vy -= impulse * b.mass * ny;
              }
            }
          }
        }
      }

      // 绘制
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        // 地面投影
        const shadowY = h - 2;
        const shadowScale = Math.max(0.3, 1 - (shadowY - b.y) / h * 0.7);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * shadowScale})`;
        ctx.beginPath();
        ctx.ellipse(b.x, shadowY, b.r * shadowScale, b.r * 0.2 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        // 球
        ctx.drawImage(b.sprite, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
    }

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // 添加新球
      for (let i = 0; i < 3; i++) {
        balls.push(createBall(
          x + (Math.random() - 0.5) * 20,
          y,
          (Math.random() - 0.5) * 6,
          -2 - Math.random() * 3,
        ));
      }
      if (balls.length > 120) balls.splice(0, balls.length - 120);
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

window.BouncingBalls = BouncingBalls;
