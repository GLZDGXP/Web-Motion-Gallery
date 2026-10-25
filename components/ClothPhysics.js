// 布料物理 — Verlet 积分 + 弹簧约束 + 拖拽交互
function ClothPhysics({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false, down: false });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  const cols = motionLevel === "intense" ? 40 : motionLevel === "subtle" ? 20 : 30;
  const rows = motionLevel === "intense" ? 28 : motionLevel === "subtle" ? 14 : 20;
  const speedMul = motionLevel === "intense" ? 1.3 : motionLevel === "subtle" ? 0.6 : 1;

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    const points = state.points;
    const sticks = state.sticks;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mActive = mouseRef.current.active;

    // 风力
    const windX = Math.sin(time * 0.001) * 0.15 * state.speedMul;
    const windY = Math.cos(time * 0.0013) * 0.05 * state.speedMul;
    const gravity = 0.3 * state.speedMul;

    // Verlet 积分 + 施力
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.pinned) continue;
      const vx = (p.x - p.px) * 0.99;
      const vy = (p.y - p.py) * 0.99;
      p.px = p.x;
      p.py = p.y;
      p.x += vx + windX;
      p.y += vy + gravity + windY;
    }

    // 鼠标交互：排斥力
    if (mActive) {
      const radius = 80;
      const force = 8;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < radius * radius && dist2 > 1) {
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / radius) * force;
          p.x += dx / dist * f;
          p.y += dy / dist * f;
        }
      }
    }

    // 约束迭代
    const iterations = 5;
    for (let it = 0; it < iterations; it++) {
      for (let i = 0; i < sticks.length; i++) {
        const s = sticks[i];
        const p0 = points[s.a];
        const p1 = points[s.b];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const diff = (s.length - dist) / dist;
        const offsetX = dx * 0.5 * diff;
        const offsetY = dy * 0.5 * diff;
        if (!p0.pinned) { p0.x -= offsetX; p0.y -= offsetY; }
        if (!p1.pinned) { p1.x += offsetX; p1.y += offsetY; }
      }
      // 边界约束
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;
        if (p.y > h - 5) p.y = h - 5;
        if (p.x < 5) p.x = 5;
        if (p.x > w - 5) p.x = w - 5;
      }
    }

    // 清屏
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    // 渲染布料：填充三角形 + 描边网格
    const baseHue = state.baseHue;

    // 经纬线
    ctx.lineWidth = 1;
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const idx = r * state.cols + c;
        const p = points[idx];

        // 水平连线
        if (c < state.cols - 1) {
          const next = points[idx + 1];
          // 计算法线（用斜率模拟光照）
          const slope = Math.abs(next.y - p.y) / Math.max(1, Math.abs(next.x - p.x));
          const light = 0.4 + 0.6 * Math.min(1, slope * 0.5 + 0.5);
          ctx.strokeStyle = `hsla(${baseHue}, 70%, ${40 + light * 30}%, ${0.4 + light * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }

        // 垂直连线
        if (r < state.rows - 1) {
          const below = points[idx + state.cols];
          const slope = Math.abs(below.x - p.x) / Math.max(1, Math.abs(below.y - p.y));
          const light = 0.4 + 0.6 * Math.min(1, slope * 0.5 + 0.5);
          ctx.strokeStyle = `hsla(${baseHue + 20}, 70%, ${35 + light * 25}%, ${0.3 + light * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(below.x, below.y);
          ctx.stroke();
        }

        // 节点（固定点高亮）
        if (p.pinned) {
          ctx.fillStyle = `hsla(${baseHue + 60}, 90%, 70%, 0.9)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [cols, rows, speedMul]);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const points = [];
    const sticks = [];
    const clothW = Math.min(w * 0.7, 400);
    const clothH = clothW * (rows / cols) * 0.8;
    const startX = (w - clothW) / 2;
    const startY = h * 0.15;
    const spacingX = clothW / (cols - 1);
    const spacingY = clothH / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        points.push({
          x, y, px: x, py: y,
          pinned: r === 0 && (c % 4 === 0 || c === cols - 1)
        });
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (c < cols - 1) {
          sticks.push({ a: idx, b: idx + 1, length: spacingX });
        }
        if (r < rows - 1) {
          sticks.push({ a: idx, b: idx + cols, length: spacingY });
        }
      }
    }

    return {
      points, sticks,
      cols, rows,
      baseHue,
      bgFade: "rgba(5, 5, 20, 0.25)",
      speedMul
    };
  }, [accentColor, cols, rows, speedMul]);

  const handleClick = (e) => {
    const state = stateRef?.current;
    if (!state) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // 冲击波
    const radius = 100;
    for (let i = 0; i < state.points.length; i++) {
      const p = state.points[i];
      if (p.pinned) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < radius * radius && dist2 > 1) {
        const dist = Math.sqrt(dist2);
        const f = (1 - dist / radius) * 20;
        p.x += dx / dist * f;
        p.y += dy / dist * f;
      }
    }
  };

  const stateRef = React.useRef(null);
  // 用 stateRef 共享 state 给点击事件（在 draw 中更新 stateRef）
  const originalDraw = draw;
  const drawWithRef = React.useCallback((ctx, w, h, time, delta, state) => {
    stateRef.current = state;
    originalDraw(ctx, w, h, time, delta, state);
  }, [originalDraw]);

  useCanvasEffect(canvasRef, { draw: drawWithRef, setup, active: true });

  return React.createElement("div", {
    ref: containerRef,
    onClick: handleClick,
    style: { position: "absolute", inset: 0, cursor: "pointer" }
  },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.ClothPhysics = ClothPhysics;
