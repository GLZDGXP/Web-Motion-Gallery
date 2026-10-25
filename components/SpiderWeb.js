// 织网蛛丝 SpiderWeb
// Canvas 2D: 蛛网从中心向外生长 + 节点连接 + 点击结网
function SpiderWeb({ accentColor = '#e0e0ff' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, cx, cy;
    let rafId = null;
    let time = 0;
    let growth = 0;
    let growing = true;
    let mouseX = 0, mouseY = 0;

    // 蛛网结构
    const RADIAL_COUNT = 12;
    const SPIRAL_COUNT = 15;
    const nodes = []; // {x, y, radius, angle, ringIndex}
    const clickWebs = []; // 额外点击结的网

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      buildWeb();
    }

    function buildWeb() {
      nodes.length = 0;
      const maxR = Math.min(w, h) * 0.42;
      for (let r = 0; r < SPIRAL_COUNT; r++) {
        const ringR = (r + 1) / SPIRAL_COUNT * maxR;
        for (let i = 0; i < RADIAL_COUNT; i++) {
          const angle = (i / RADIAL_COUNT) * Math.PI * 2 + r * 0.15; // 螺旋偏移
          nodes.push({
            x: cx + Math.cos(angle) * ringR,
            y: cy + Math.sin(angle) * ringR,
            radius: ringR,
            angle,
            ringIndex: r,
            visible: false,
            appearTime: (r / SPIRAL_COUNT) * 0.8 + Math.random() * 0.2,
          });
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw(t) {
      rafId = requestAnimationFrame(draw);
      time = t;

      // 生长动画
      if (growing) {
        growth += 0.005;
        if (growth >= 1) { growth = 1; growing = false; }
      }

      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, w, h);

      // 更新节点可见性
      const maxR = Math.min(w, h) * 0.42;
      const currentGrowth = growth;

      // 绘制放射线
      ctx.strokeStyle = 'rgba(200, 210, 255, 0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i < RADIAL_COUNT; i++) {
        const angle = (i / RADIAL_COUNT) * Math.PI * 2;
        const r = maxR * currentGrowth;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        ctx.stroke();
      }

      // 绘制螺旋环
      ctx.strokeStyle = 'rgba(220, 230, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.appearTime <= currentGrowth) {
          if (i === 0 || nodes[i-1].ringIndex !== n.ringIndex) {
            ctx.moveTo(n.x, n.y);
          } else {
            ctx.lineTo(n.x, n.y);
          }
        }
      }
      ctx.stroke();

      // 节点发光点
      ctx.fillStyle = 'rgba(200, 220, 255, 0.8)';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.appearTime <= currentGrowth) {
          const pulse = 0.5 + Math.sin(t * 0.003 + n.angle * 3) * 0.5;
          ctx.globalAlpha = 0.3 + pulse * 0.3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.5 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 中心亮点
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      centerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      centerGrad.addColorStop(0.5, 'rgba(200, 220, 255, 0.2)');
      centerGrad.addColorStop(1, 'rgba(200, 220, 255, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();

      // 鼠标附近的蛛网振动
      const mDist = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2);
      if (mDist < maxR && mDist > 0) {
        ctx.strokeStyle = `rgba(200, 230, 255, ${0.5 * (1 - mDist / maxR)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 20 + Math.sin(t * 0.01) * 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 点击的额外蛛网
      for (let i = clickWebs.length - 1; i >= 0; i--) {
        const cw = clickWebs[i];
        cw.life -= 0.008;
        if (cw.life <= 0) { clickWebs.splice(i, 1); continue; }

        const r = cw.radius * (1 - cw.life);
        ctx.strokeStyle = `rgba(220, 230, 255, ${cw.life * 0.6})`;
        ctx.lineWidth = 1;
        // 小蛛网（放射线 + 两个环）
        for (let j = 0; j < 8; j++) {
          const a = (j / 8) * Math.PI * 2 + cw.rot;
          ctx.beginPath();
          ctx.moveTo(cw.x, cw.y);
          ctx.lineTo(cw.x + Math.cos(a) * r, cw.y + Math.sin(a) * r);
          ctx.stroke();
        }
        for (let ring = 1; ring <= 3; ring++) {
          const rr = r * (ring / 3);
          ctx.beginPath();
          for (let j = 0; j <= 8; j++) {
            const a = (j / 8) * Math.PI * 2 + cw.rot + ring * 0.2;
            const px = cw.x + Math.cos(a) * rr;
            const py = cw.y + Math.sin(a) * rr;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
    }

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      clickWebs.push({
        x, y,
        radius: 30 + Math.random() * 40,
        life: 1,
        rot: Math.random() * Math.PI,
      });
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

window.SpiderWeb = SpiderWeb;
