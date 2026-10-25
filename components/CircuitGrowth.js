// 电路生长 — 电路板线路从中心向外生长蔓延
function CircuitGrowth({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  const baseNodeCount = motionLevel === "intense" ? 200 : motionLevel === "subtle" ? 80 : 140;
  const maxNodes = PerfMonitor.getParticleCount(baseNodeCount);
  const speedMul = motionLevel === "intense" ? 1.4 : motionLevel === "subtle" ? 0.5 : 1;

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mActive = mouseRef.current.active;

    // 清屏淡入
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    const segments = state.segments;
    const nodes = state.nodes;
    const completed = state.completed;
    const gridSize = state.gridSize;

    // 生长进度
    const growAmount = delta * 0.003 * state.speedMul;

    for (let i = segments.length - 1; i >= 0; i--) {
      const s = segments[i];
      s.progress += growAmount * (0.7 + s.speed * 0.6);
      if (s.progress >= 1) {
        s.progress = 1;
        // 生长完成，加入节点
        const endX = s.startX + s.dx;
        const endY = s.startY + s.dy;
        // 检查是否已有节点在附近
        let nodeIdx = -1;
        for (let j = 0; j < nodes.length; j++) {
          const n = nodes[j];
          const dx = n.x - endX, dy = n.y - endY;
          if (dx * dx + dy * dy < gridSize * gridSize * 0.3) {
            nodeIdx = j; break;
          }
        }
        if (nodeIdx === -1 && nodes.length < state.maxNodes) {
          nodes.push({ x: endX, y: endY, born: time, hue: s.hue });
          nodeIdx = nodes.length - 1;
        }
        if (nodeIdx >= 0) {
          // 完成的线段
          completed.push({
            x1: s.startX, y1: s.startY,
            x2: endX, y2: endY,
            hue: s.hue,
            alpha: 1,
            born: time
          });
          s.endNodeIdx = nodeIdx;
        }
        segments.splice(i, 1);

        // 从新节点生长新线段（有概率）
        if (nodeIdx >= 0 && nodes.length < state.maxNodes && segments.length < 60) {
          const n = nodes[nodeIdx];
          const branchCount = Math.random() < 0.3 ? 2 : 1;
          for (let b = 0; b < branchCount; b++) {
            const dir = Math.floor(Math.random() * 4); // 0右 1下 2左 3上
            let dx = 0, dy = 0;
            if (dir === 0) dx = gridSize * (1 + Math.random());
            else if (dir === 1) dy = gridSize * (1 + Math.random());
            else if (dir === 2) dx = -gridSize * (1 + Math.random());
            else dy = -gridSize * (1 + Math.random());

            // 鼠标吸引
            if (mActive && Math.random() < 0.4) {
              const mdx = mx - n.x;
              const mdy = my - n.y;
              if (Math.abs(mdx) > Math.abs(mdy)) {
                dx = Math.sign(mdx) * gridSize * (1 + Math.random());
                dy = 0;
              } else {
                dy = Math.sign(mdy) * gridSize * (1 + Math.random());
                dx = 0;
              }
            }

            const newX = n.x + dx;
            const newY = n.y + dy;
            if (newX > 10 && newX < w - 10 && newY > 10 && newY < h - 10) {
              segments.push({
                startX: n.x, startY: n.y,
                dx, dy,
                progress: 0,
                speed: 0.7 + Math.random() * 0.6,
                hue: s.hue + (Math.random() - 0.5) * 20
              });
            }
          }
        }
      }
    }

    // 清理太老的完成线段
    const maxCompleted = 200;
    if (completed.length > maxCompleted) {
      const removeCount = completed.length - maxCompleted;
      for (let i = 0; i < removeCount; i++) {
        completed[i].fading = true;
      }
    }
    for (let i = completed.length - 1; i >= 0; i--) {
      if (completed[i].fading) {
        completed[i].alpha -= 0.01;
        if (completed[i].alpha <= 0) completed.splice(i, 1);
      }
    }
    // 节点也同步清理
    const maxNodeAge = 15000;
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (time - nodes[i].born > maxNodeAge && nodes.length > state.maxNodes * 0.7) {
        nodes.splice(i, 1);
      }
    }

    // 补充生长起点（中心区域）
    if (segments.length < 5 && nodes.length < state.maxNodes) {
      const cx = w / 2 + (Math.random() - 0.5) * w * 0.3;
      const cy = h / 2 + (Math.random() - 0.5) * h * 0.3;
      nodes.push({ x: cx, y: cy, born: time, hue: state.baseHue });
      for (let d = 0; d < 2; d++) {
        const dir = Math.floor(Math.random() * 4);
        let dx = 0, dy = 0;
        if (dir === 0) dx = gridSize;
        else if (dir === 1) dy = gridSize;
        else if (dir === 2) dx = -gridSize;
        else dy = -gridSize;
        segments.push({
          startX: cx, startY: cy,
          dx: dx * (1 + Math.random()),
          dy: dy * (1 + Math.random()),
          progress: 0,
          speed: 0.8 + Math.random() * 0.5,
          hue: state.baseHue + Math.random() * 40 - 20
        });
      }
    }

    // 绘制网格点（背景）
    ctx.fillStyle = state.gridColor;
    const gridOffset = state.gridOffset;
    for (let x = gridOffset.x; x < w; x += gridSize) {
      for (let y = gridOffset.y; y < h; y += gridSize) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 绘制已完成线段
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < completed.length; i++) {
      const c = completed[i];
      const alpha = c.alpha * 0.6;
      // 外层辉光
      ctx.strokeStyle = `hsla(${c.hue}, 80%, 60%, ${alpha * 0.3})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(c.x1, c.y1);
      ctx.lineTo(c.x2, c.y2);
      ctx.stroke();
      // 内层主线
      ctx.strokeStyle = `hsla(${c.hue}, 90%, 70%, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(c.x1, c.y1);
      ctx.lineTo(c.x2, c.y2);
      ctx.stroke();
    }

    // 绘制正在生长的线段 + 头部亮点
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      const ex = s.startX + s.dx * s.progress;
      const ey = s.startY + s.dy * s.progress;
      // 辉光外层
      ctx.strokeStyle = `hsla(${s.hue}, 80%, 60%, 0.3)`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(s.startX, s.startY);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // 主线
      ctx.strokeStyle = `hsla(${s.hue}, 100%, 75%, 0.9)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.startX, s.startY);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // 头部亮点（焊盘）
      ctx.fillStyle = `hsla(${s.hue}, 100%, 85%, 1)`;
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制节点（焊盘）
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const age = (time - n.born) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + i);
      const size = 2.5 + pulse * 1.5;
      ctx.fillStyle = `hsla(${n.hue}, 100%, 80%, 0.8)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsla(${n.hue}, 100%, 95%, 0.9)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [maxNodes, speedMul]);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const gridSize = 25;
    const segments = [];
    const nodes = [];
    const completed = [];
    // 初始中心节点 + 4 个方向
    const cx = w / 2, cy = h / 2;
    nodes.push({ x: cx, y: cy, born: 0, hue: baseHue });
    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (let d = 0; d < 4; d++) {
      segments.push({
        startX: cx, startY: cy,
        dx: dirs[d][0] * gridSize * (1.5 + Math.random()),
        dy: dirs[d][1] * gridSize * (1.5 + Math.random()),
        progress: 0,
        speed: 0.8 + Math.random() * 0.5,
        hue: baseHue + d * 20
      });
    }
    return {
      segments, nodes, completed,
      maxNodes,
      baseHue,
      gridSize,
      speedMul,
      bgFade: "rgba(3, 5, 12, 0.08)",
      gridColor: `hsla(${baseHue}, 50%, 40%, 0.08)`,
      gridOffset: { x: Math.floor((w % gridSize) / 2), y: Math.floor((h % gridSize) / 2) }
    };
  }, [accentColor, maxNodes, speedMul]);

  useCanvasEffect(canvasRef, { draw, setup, active: true });

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0, cursor: "crosshair" } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.CircuitGrowth = CircuitGrowth;
