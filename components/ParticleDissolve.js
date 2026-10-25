(() => {
  // ParticleDissolve - v1.0.3 重调：大幅降低粒子数 + 柔和呼吸 + 防过曝
  // 原始为 JSX 编译产物，此处直接改编译后的 .js
  function ParticleDissolve({ accentColor: f = "#00e5ff", particleAmount: i = "medium", motionLevel = "rich" }) {
    const n = React.useRef(null),
      u = React.useRef(null),
      l = useMousePosition(u),
      o = React.useRef({ x: 0, y: 0, active: false });
    React.useEffect(() => { o.current = l; }, [l]);

    // ===== v1.0.3 调整：粒子数量大幅下调 =====
    // 按 motionLevel 分档：subtle ~40, rich ~70, intense ~100
    // 再叠加 particleAmount 微调
    const baseByLevel = motionLevel === "subtle" ? 40 : motionLevel === "intense" ? 100 : 70;
    const amountMult = i === "low" ? 0.7 : i === "high" ? 1.3 : 1;
    const targetCount = Math.round(baseByLevel * amountMult);
    const X = PerfMonitor.getParticleCount(targetCount);

    const H = React.useCallback((t, M, g, m, P, c) => {
      const a = c.particles,
        R = c.baseHue,
        r = c.trails,
        C = o.current.x,
        Y = o.current.y,
        S = o.current.active,
        x = c.prevActive;
      c.prevActive = S;

      // ===== v1.0.3 修复：solid 实色清屏，防亮度累积过曝 =====
      // 改用纯黑清屏（带极微 trail 0.06 alpha，保留淡淡拖尾但不累积）
      t.fillStyle = "rgba(0, 0, 0, 0.15)";
      t.fillRect(0, 0, M, g);

      // 鼠标轨迹
      if (S && x) {
        const s = { x: C, y: Y, life: 1 };
        r.push(s);
      }
      for (let s = r.length - 1; s >= 0; s--) {
        r[s].life -= 0.03;
        if (r[s].life <= 0) r.splice(s, 1);
      }
      if (r.length > 1) {
        t.lineCap = "round";
        for (let s = 1; s < r.length; s++) {
          const e = r[s], h = r[s - 1];
          // 轨迹亮度降低
          t.strokeStyle = `hsla(${R}, 100%, 65%, ${e.life * 0.25})`;
          t.lineWidth = e.life * 2.5;
          t.beginPath();
          t.moveTo(h.x, h.y);
          t.lineTo(e.x, e.y);
          t.stroke();
        }
      }

      // 粒子连线——距离阈值降低、线更淡
      t.lineWidth = 0.3;
      const $ = 45;
      for (let s = 0; s < a.length; s++) {
        for (let e = s + 1; e < a.length; e++) {
          const h = a[s].x - a[e].x, d = a[s].y - a[e].y, y = h * h + d * d;
          if (y < $ * $) {
            const p = (1 - Math.sqrt(y) / $) * 0.08; // 连线 alpha 减半
            t.strokeStyle = `hsla(${R}, 100%, 65%, ${p})`;
            t.beginPath();
            t.moveTo(a[s].x, a[s].y);
            t.lineTo(a[e].x, a[e].y);
            t.stroke();
          }
        }
      }

      // ===== v1.0.3 核心：消除高频闪烁 =====
      // 粒子亮度用低频正弦呼吸，而非每帧随机
      // alpha 基准落在低区间 (0.15-0.35)，避免同步峰值
      for (let s = 0; s < a.length; s++) {
        const e = a[s];

        // 位置更新：回弹 + 微漂
        if (e.trailX2 = e.trailX1, e.trailY2 = e.trailY1,
          e.trailX1 = e.x, e.trailY1 = e.y,
          e.vx += (e.baseX - e.x) * 0.012,
          e.vy += (e.baseY - e.y) * 0.012,
          S) {
          const p = e.x - C, b = e.y - Y, T = p * p + b * b;
          if (T < 14400) {
            const k = Math.sqrt(T), A = (1 - k / 120) * 6; // 推力减小
            e.vx += p / k * A;
            e.vy += b / k * A;
            e.brightness = Math.min(0.8, (e.brightness || 0) + 0.08); // 亮度上限降低
          }
        }

        // 亮度衰减更慢更柔和
        e.brightness = Math.max(0, (e.brightness || 0) - 0.008);

        // 漂浮力减小
        e.vx += Math.sin(m * 0.0008 + e.phase) * 0.012;
        e.vy += Math.cos(m * 0.001 + e.phase) * 0.012;
        e.vx *= 0.95;
        e.vy *= 0.95;
        e.x += e.vx;
        e.y += e.vy;

        // 环绕边界
        if (e.x < -20 && (e.x = M + 20), e.x > M + 20 && (e.x = -20),
          e.y < -20 && (e.y = g + 20), e.y > g + 20 && (e.y = -20),
          h = Math.sqrt(e.vx * e.vx + e.vy * e.vy),

          // ===== v1.0.3：柔和呼吸 alpha =====
          // 用低频正弦 (周期 ~3-5s) + 相位错开，避免同步闪烁
          // 基准 alpha 落在 0.15-0.35 低区间
          breatheAlpha = 0.15 + 0.2 * (0.5 + 0.5 * Math.sin(m * 0.0006 + e.breathePhase)),

          d = e.baseSize * (0.9 + 0.1 * Math.sin(m * 0.001 + e.phase)) + h * 0.08,
          y = (R + e.hueShift + 360) % 360,

          // ===== v1.0.3：拖尾亮度上限 =====
          // 拖尾 alpha 降低，避免叠加过曝
          h > 0.2 && e.trailX2 !== void 0) {
          const p = Math.min(0.3, h * 0.06) * breatheAlpha;
          const b2 = t.createLinearGradient(e.trailX2, e.trailY2, e.x, e.y);
          b2.addColorStop(0, `hsla(${y}, 100%, 65%, 0)`);
          b2.addColorStop(1, `hsla(${y}, 100%, 70%, ${p})`);
          t.strokeStyle = b2;
          t.lineWidth = d * 0.7;
          t.lineCap = "round";
          t.beginPath();
          t.moveTo(e.trailX2, e.trailY2);
          t.lineTo(e.x, e.y);
          t.stroke();
        }

        // ===== v1.0.3：三层光晕强度全面下调 =====
        // 外层光晕（最淡）
        const outerAlpha = 0.06 + e.brightness * 0.12;
        t.fillStyle = `hsla(${y}, 100%, 65%, ${outerAlpha})`;
        t.beginPath();
        t.arc(e.x, e.y, d * 2.5, 0, Math.PI * 2);
        t.fill();

        // 中层
        const midAlpha = 0.15 + e.brightness * 0.2;
        t.fillStyle = `hsla(${y}, 100%, 70%, ${midAlpha})`;
        t.beginPath();
        t.arc(e.x, e.y, d * 1.2, 0, Math.PI * 2);
        t.fill();

        // 核心（用呼吸 alpha + 亮度叠加，上限封顶）
        const coreAlpha = Math.min(0.6, breatheAlpha + e.brightness * 0.4);
        t.fillStyle = `hsla(${y}, 100%, 80%, ${coreAlpha})`;
        t.beginPath();
        t.arc(e.x, e.y, d * 0.5, 0, Math.PI * 2);
        t.fill();
      }
    }, []);

    const q = React.useCallback((t, M, g) => {
      const m = hexToHue(f);
      const P = [];
      for (let c = 0; c < X; c++) {
        P.push({
          baseX: Math.random() * M,
          baseY: Math.random() * g,
          x: Math.random() * M,
          y: Math.random() * g,
          vx: 0,
          vy: 0,
          trailX1: 0,
          trailY1: 0,
          trailX2: 0,
          trailY2: 0,
          baseSize: Math.random() * 1.5 + 0.8, // 粒子尺寸略减小
          phase: Math.random() * Math.PI * 2,
          breathePhase: Math.random() * Math.PI * 2, // 呼吸相位错开
          hueShift: Math.random() * 30 - 15, // 色偏范围缩小
          opacity: 0.3 + Math.random() * 0.3, // 基准 opacity 降低：0.3-0.6
          brightness: 0
        });
      }
      return { particles: P, baseHue: m, trails: [], prevActive: false };
    }, [f, X]);

    return React.createElement(
      "div",
      { ref: u, style: { position: "absolute", inset: 0 } },
      React.createElement("canvas", { ref: n, style: { display: "block" } }),
      React.createElement(CanvasHost, { draw: H, setup: q, canvasRef: n })
    );
  }

  function CanvasHost({ draw: f, setup: i, canvasRef: n }) {
    useCanvasEffect(n, { draw: f, setup: i, active: true });
    return null;
  }

  function hexToHue(f) {
    const i = parseInt(f.slice(1, 3), 16) / 255,
      n = parseInt(f.slice(3, 5), 16) / 255,
      u = parseInt(f.slice(5, 7), 16) / 255,
      l = Math.max(i, n, u),
      o = Math.min(i, n, u);
    let v;
    return l === o ? v = 0 : l === i ? v = (n - u) / (l - o) % 6 : l === n ? v = (u - i) / (l - o) + 2 : v = (i - n) / (l - o) + 4, Math.round(v * 60);
  }

  window.ParticleDissolve = ParticleDissolve;
})();
