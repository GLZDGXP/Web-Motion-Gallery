(function () {
  'use strict';
  // React 由 CDN 同步加载，在本 IIFE 执行时（defer，晚于同步脚本）已就绪。
  const React = window.React;
  // 关键：useCanvasEffect 是 bundle.min.js 在运行时挂到 window 的全局，
  // 必须延迟到组件真正渲染（app 已挂载）时才读取，不能在 IIFE 顶层提前捕获。
  //
  // 两个关键修复（根治“上下滑动时前 10 个动效不断闪烁/重置”）：
  // 1) 引用恒定：useCanvasEffect 内部是 React.useEffect(..., [ref, active, draw, setup, cleanup])。
  //    若每次渲染都传新的 draw/setup/cleanup 引用，滚动触发组件重渲染时 effect 会反复
  //    销毁重建（cleanup 置空状态 + 重新 getContext/注册）→ 视觉上“闪烁重置”。
  //    这里用 ref 持有最新 opts，三个回调只创建一次（引用恒定），effect 不再因重渲染重建。
  // 2) 尺寸稳定：draw 的 w/h 变化会重置内部状态。滚动时父容器有亚像素抖动，导致
  //    st.w!==w 每帧为真 → 反复重置。这里缓存“稳定尺寸”，过滤 <2px 抖动，
  //    仅在真实尺寸显著变化(>2px)时才让动效看到新尺寸并重置一次。
  const ce = (ref, opts) => {
    const optsRef = React.useRef(opts);
    optsRef.current = opts;

    const drawRef = React.useRef(null);
    if (!drawRef.current) {
      drawRef.current = (ctx, w, h, t, dt, st) => {
        const o = optsRef.current;
        if (st.__stableW === undefined) { st.__stableW = w; st.__stableH = h; }
        let W = st.__stableW, H = st.__stableH;
        const dw = Math.abs(w - W), dh = Math.abs(h - H);
        if (dw > 2 || dh > 2) { W = w; H = h; st.__stableW = w; st.__stableH = h; }
        return o.draw(ctx, W, H, t, dt, st);
      };
    }
    const setupRef = React.useRef(null);
    if (!setupRef.current) {
      setupRef.current = () => (optsRef.current.setup ? optsRef.current.setup() : undefined);
    }
    const cleanupRef = React.useRef(null);
    if (!cleanupRef.current) {
      cleanupRef.current = (st) => { const c = optsRef.current.cleanup; if (typeof c === 'function') c(st); };
    }
    return window.useCanvasEffect(ref, {
      setup: setupRef.current,
      draw: drawRef.current,
      cleanup: cleanupRef.current,
      active: opts.active
    });
  };

  function hsl(h, s, l, a) {
    return a == null ? 'hsl(' + (h % 360) + ',' + s + '%,' + l + '%)'
      : 'hsla(' + (h % 360) + ',' + s + '%,' + l + '%,' + a + ')';
  }
  function canvasEl(ref) {
    return React.createElement('canvas', { ref: ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  // 以 300x200 卡片为基准，按 canvas 面积缩放粒子数：小卡片少粒子省 CPU，大卡片更饱满
  function particleCount(w, h, base, min, max) {
    const n = Math.round(base * (w * h) / (300 * 200));
    return n < min ? min : (n > max ? max : n);
  }

  /* 1. Voronoi Cells — 动态泰森多边形，种子漂移形成活细胞 */
  function VoronoiCells() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { sites: null, w: 0, h: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        if (!st.sites || st.w !== w || st.h !== h) {
          st.w = w; st.h = h;
          const N = particleCount(w, h, 15, 6, 40);
          st.sites = [];
          for (let i = 0; i < N; i++) st.sites.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
            hue: Math.random() * 360
          });
        }
        const S = st.sites;
        for (let i = 0; i < S.length; i++) {
          const s = S[i];
          s.x += s.vx; s.y += s.vy;
          if (s.x < 0 || s.x > w) s.vx *= -1;
          if (s.y < 0 || s.y > h) s.vy *= -1;
        }
        ctx.fillStyle = '#04060c'; ctx.fillRect(0, 0, w, h);
        const gw = Math.max(40, Math.min(150, Math.floor(w / 5)));
        const gh = Math.max(30, Math.min(110, Math.floor(h / 5)));
        const cw = w / gw, ch = h / gh;
        for (let y = 0; y < gh; y++) {
          const py = y * ch + ch / 2;
          for (let x = 0; x < gw; x++) {
            const px = x * cw + cw / 2;
            let best = 1e18, bi = 0;
            for (let i = 0; i < S.length; i++) {
              const dx = S[i].x - px, dy = S[i].y - py, d = dx * dx + dy * dy;
              if (d < best) { best = d; bi = i; }
            }
            ctx.fillStyle = hsl(S[bi].hue, 70, 52);
            ctx.fillRect(x * cw, y * ch, cw + 1, ch + 1);
          }
        }
        for (let i = 0; i < S.length; i++) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.fillRect(S[i].x - 1.2, S[i].y - 1.2, 2.4, 2.4);
        }
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.VoronoiCells = VoronoiCells;

  /* 2. Boids Flocking — 经典鸟群算法（分离/对齐/聚合） */
  function BoidsFlock() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { boids: null, w: 0, h: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        if (!st.boids || st.w !== w || st.h !== h) {
          st.w = w; st.h = h; st.boids = [];
          const N = particleCount(w, h, 180, 90, 260);
          for (let i = 0; i < N; i++) st.boids.push({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0 });
        }
        const B = st.boids, n = B.length, max = 60, sep = 18, ali = 0.05, coh = 0.005, sp = 2.2;
        for (let i = 0; i < n; i++) {
          const b = B[i]; let ax = 0, ay = 0, cx = 0, cy = 0, nav = 0, sx = 0, sy = 0, ns = 0;
          for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const o = B[j], dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 < sep * sep) { const d = Math.sqrt(d2) || 1; sx -= dx / d; sy -= dy / d; ns++; }
            if (d2 < max * max) { ax += o.vx; ay += o.vy; cx += o.x; cy += o.y; nav++; }
          }
          if (nav > 0) {
            b.vx += (ax / nav - b.vx) * ali; b.vy += (ay / nav - b.vy) * ali;
            cx /= nav; cy /= nav; b.vx += (cx - b.x) * coh; b.vy += (cy - b.y) * coh;
          }
          if (ns > 0) { b.vx += sx * 0.06; b.vy += sy * 0.06; }
          const m = Math.hypot(b.vx, b.vy) || 1;
          b.vx = b.vx / m * sp; b.vy = b.vy / m * sp;
          b.x += b.vx; b.y += b.vy;
          if (b.x < 0) b.x += w; if (b.x > w) b.x -= w;
          if (b.y < 0) b.y += h; if (b.y > h) b.y -= h;
        }
        ctx.fillStyle = 'rgba(5,8,16,0.25)'; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < n; i++) {
          const b = B[i], a = Math.atan2(b.vy, b.vx);
          ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(a);
          ctx.fillStyle = hsl(b.x / w * 360, 80, 62);
          ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-3, 3); ctx.lineTo(-3, -3); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.BoidsFlock = BoidsFlock;

  /* 3. Reaction-Diffusion (Gray-Scott) — 反应扩散斑图 */
  function ReactionDiffusion() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { g: null, na: null, nb: null, img: null, tmp: null, G: 110 }; },
      draw(ctx, w, h, t, dt, st) {
        const G = st.G;
        if (!st.g) {
          st.g = { a: new Float32Array(G * G), b: new Float32Array(G * G) };
          for (let i = 0; i < G * G; i++) st.g.a[i] = 1;
          for (let y = G / 2 - 8; y < G / 2 + 8; y++)
            for (let x = G / 2 - 8; x < G / 2 + 8; x++) st.g.b[y * G + x] = 1;
          st.na = new Float32Array(G * G); st.nb = new Float32Array(G * G);
          st.img = ctx.createImageData(G, G);
          st.tmp = document.createElement('canvas'); st.tmp.width = G; st.tmp.height = G;
          st.acc = 0;
        }
        // 模拟按时间节流：每 ~28ms 推进一步（约 36 steps/s），
        // 既保持演化观感，又避免每帧 ~10 万次运算拖垮主线程。
        const g = st.g, A = g.a, B = g.b, da = 1, db = 0.5, feed = 0.055, kill = 0.062, na = st.na, nb = st.nb;
        st.acc = (st.acc || 0) + dt;
        if (st.acc >= 28) {
          st.acc = 0;
          for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
            const i = y * G + x; let sa = 0, sb = 0;
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const xx = (x + dx + G) % G, yy = (y + dy + G) % G, j = yy * G + xx;
              sa += A[j]; sb += B[j];
            }
            sa /= 8; sb /= 8;
            const a = A[i], b = B[i], abb = a * b * b;
            na[i] = a + (da * (sa - a) - abb + feed * (1 - a));
            nb[i] = b + (db * (sb - b) + abb - (kill + feed) * b);
          }
          for (let i = 0; i < G * G; i++) {
            A[i] = na[i] < 0 ? 0 : na[i] > 1 ? 1 : na[i];
            B[i] = nb[i] < 0 ? 0 : nb[i] > 1 ? 1 : nb[i];
          }
        }
        const d = st.img.data;
        for (let i = 0; i < G * G; i++) {
          const c = B[i] * 255;
          d[i * 4] = c * 0.25; d[i * 4 + 1] = c * 0.85; d[i * 4 + 2] = c; d[i * 4 + 3] = 255;
        }
        st.tmp.getContext('2d').putImageData(st.img, 0, 0);
        ctx.imageSmoothingEnabled = false; ctx.drawImage(st.tmp, 0, 0, w, h);
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.ReactionDiffusion = ReactionDiffusion;

  /* 4. Harmonograph — 衰减谐波摆绘图 */
  function Harmonograph() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { hue: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        ctx.fillStyle = 'rgba(3,4,10,0.06)'; ctx.fillRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2, sc = Math.min(w, h) / 3, tt = t * 0.001;
        ctx.beginPath(); ctx.strokeStyle = hsl(st.hue, 85, 62); ctx.lineWidth = 1;
        for (let i = 0; i < 40; i++) {
          const ph = i * 0.018;
          const x = cx + sc * (Math.sin(tt * 2.01 + ph) * Math.exp(-0.0016 * tt) + 0.5 * Math.sin(tt * 3.0 + ph) * Math.exp(-0.0026 * tt));
          const y = cy + sc * (Math.sin(tt * 2.02 + ph + 1.5) * Math.exp(-0.0016 * tt) + 0.5 * Math.sin(tt * 2.5 + ph) * Math.exp(-0.0026 * tt));
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        st.hue = (st.hue + 0.4) % 360;
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.Harmonograph = Harmonograph;

  /* 5. Strange Attractor — 洛伦兹奇怪吸引子（3D 投影） */
  function StrangeAttractor() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { p: [0.1, 0, 0], hue: 200 }; },
      draw(ctx, w, h, t, dt, st) {
        ctx.fillStyle = 'rgba(2,3,8,0.10)'; ctx.fillRect(0, 0, w, h);
        const p = st.p;
        let x = p[0], y = p[1], z = p[2];
        const dt2 = 0.005, rot = t * 0.0002, S = Math.min(w, h) / 55;
        ctx.fillStyle = hsl(st.hue, 90, 66);
        for (let i = 0; i < 220; i++) {
          const dx = 10 * (y - x), dy = x * (28 - z) - y, dz = x * y - 2.667 * z;
          x += dx * dt2; y += dy * dt2; z += dz * dt2;
          const sx = w / 2 + (x * Math.cos(rot) - y * Math.sin(rot)) * S;
          const sy = h / 2 + (x * Math.sin(rot) + y * Math.cos(rot)) * S - (z - 25) * S * 0.55;
          if (sx > 0 && sx < w && sy > 0 && sy < h) ctx.fillRect(sx, sy, 1.4, 1.4);
        }
        p[0] = x; p[1] = y; p[2] = z;
        st.hue = (st.hue + 0.3) % 360;
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.StrangeAttractor = StrangeAttractor;

  /* 6. Flow Field — 旋度噪声流场粒子 */
  function FlowField() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { ps: null, w: 0, h: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        if (!st.ps || st.w !== w || st.h !== h) {
          st.w = w; st.h = h; st.ps = [];
          const N = particleCount(w, h, 450, 150, 700);
          for (let i = 0; i < N; i++) st.ps.push({ x: Math.random() * w, y: Math.random() * h });
        }
        ctx.fillStyle = 'rgba(4,6,12,0.08)'; ctx.fillRect(0, 0, w, h);
        const ang = (x, y) => Math.sin(x * 0.01 + t * 0.0003) * Math.cos(y * 0.01 - t * 0.0002) * Math.PI * 2;
        for (const p of st.ps) {
          const a = ang(p.x, p.y);
          p.x += Math.cos(a) * 1.6; p.y += Math.sin(a) * 1.6;
          if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; }
          ctx.fillStyle = hsl(((p.x / w) * 360 + t * 0.02) % 360, 80, 60);
          ctx.fillRect(p.x, p.y, 1.6, 1.6);
        }
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.FlowField = FlowField;

  /* 7. Chladni — 克拉德尼驻波图形 */
  function Chladni() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { ps: null, w: 0, h: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        if (!st.ps || st.w !== w || st.h !== h) {
          st.w = w; st.h = h; st.ps = [];
          const N = particleCount(w, h, 700, 220, 1000);
          for (let i = 0; i < N; i++) st.ps.push({ x: Math.random() * w, y: Math.random() * h });
        }
        ctx.fillStyle = 'rgba(3,4,10,0.12)'; ctx.fillRect(0, 0, w, h);
        const a = Math.sin(t * 0.0003) * 4 + 3, b = Math.cos(t * 0.0004) * 4 + 3,
          c = Math.sin(t * 0.0005) * 4 + 3, d = Math.cos(t * 0.0002) * 4 + 3;
        for (const p of st.ps) {
          const f = Math.sin(a * Math.PI * p.x / w) * Math.cos(b * Math.PI * p.y / h) +
            Math.cos(c * Math.PI * p.x / w) * Math.sin(d * Math.PI * p.y / h);
          const m = Math.abs(f), amp = 0.5;
          p.x += (Math.random() - 0.5) * (m * amp + 0.02) * 9;
          p.y += (Math.random() - 0.5) * (m * amp + 0.02) * 9;
          p.x = (p.x + w) % w; p.y = (p.y + h) % h;
          ctx.fillStyle = 'rgba(180,230,255,0.8)';
          ctx.fillRect(p.x, p.y, 1.3, 1.3);
        }
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.Chladni = Chladni;

  /* 8. L-System Tree — 递归分形树 + 风吹摆动 */
  function LSystemTree() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { segs: null, w: 0, h: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        if (!st.segs || st.w !== w || st.h !== h) {
          st.w = w; st.h = h; st.segs = [];
          const rec = (x, y, ang, len, depth) => {
            if (depth > 7) return;
            const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
            st.segs.push({ x1: x, y1: y, x2: x2, y2: y2, depth: depth });
            rec(x2, y2, ang - 0.42, len * 0.72, depth + 1);
            rec(x2, y2, ang + 0.42, len * 0.72, depth + 1);
          };
          rec(w / 2, h, -Math.PI / 2, h * 0.24, 0);
        }
        ctx.fillStyle = '#05070d'; ctx.fillRect(0, 0, w, h);
        const sway = Math.sin(t * 0.001) * 0.14;
        for (const s of st.segs) {
          const a = Math.atan2(s.y2 - s.y1, s.x2 - s.x1) + s.depth * 0.02 * sway;
          ctx.strokeStyle = hsl(130 - s.depth * 16, 60, 50);
          ctx.lineWidth = Math.max(0.6, 6 - s.depth);
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x1 + Math.cos(a) * (s.x2 - s.x1), s.y1 + Math.sin(a) * (s.y2 - s.y1));
          ctx.stroke();
        }
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.LSystemTree = LSystemTree;

  /* 9. Game of Life — 生命游戏（艺术化着色） */
  function GameOfLife() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { g: null, w: 0, h: 0, acc: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        const Gw = Math.max(40, Math.floor(w / 9)), Gh = Math.max(30, Math.floor(h / 9));
        if (!st.g || st.w !== w || st.h !== h) {
          st.w = w; st.h = h; st.g = [];
          for (let y = 0; y < Gh; y++) { st.g[y] = []; for (let x = 0; x < Gw; x++) st.g[y][x] = Math.random() < 0.18 ? 1 : 0; }
        }
        st.acc += dt;
        if (st.acc >= 70) {
          st.acc = 0;
          const ng = [];
          for (let y = 0; y < Gh; y++) {
            ng[y] = [];
            for (let x = 0; x < Gw; x++) {
              let n = 0;
              for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                n += st.g[(y + dy + Gh) % Gh][(x + dx + Gw) % Gw];
              }
              ng[y][x] = st.g[y][x] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
            }
          }
          st.g = ng;
        }
        ctx.fillStyle = '#04060c'; ctx.fillRect(0, 0, w, h);
        const cw = w / Gw, ch = h / Gh;
        for (let y = 0; y < Gh; y++) for (let x = 0; x < Gw; x++) {
          if (st.g[y][x]) {
            ctx.fillStyle = hsl((x / Gw * 140 + 200) % 360, 80, 56);
            ctx.fillRect(x * cw, y * ch, cw + 0.6, ch + 0.6);
          }
        }
      },
      active: true
    });
    return canvasEl(ref);
  }
  window.GameOfLife = GameOfLife;

  /* 10. Hilbert Curve — 空间填充曲线动画 */
  function HilbertCurve() {
    const ref = React.useRef(null);
    ce(ref, {
      setup() { return { pts: null, w: 0, h: 0, tt: 0 }; },
      draw(ctx, w, h, t, dt, st) {
        if (!st.pts || st.w !== w || st.h !== h) {
          st.w = w; st.h = h; st.pts = buildHilbert(6, w, h);
        }
        ctx.fillStyle = '#04060c'; ctx.fillRect(0, 0, w, h);
        const N = st.pts.length;
        st.tt = (st.tt + dt * 0.05) % N;
        const head = Math.floor(st.tt);
        ctx.beginPath();
        for (let i = 0; i < head; i++) {
          const p = st.pts[i];
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = hsl(t * 0.02 % 360, 80, 62); ctx.lineWidth = 1.5; ctx.stroke();
        const hp = st.pts[head];
        if (hp) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hp.x, hp.y, 4, 0, 6.28); ctx.fill(); }
      },
      active: true
    });
    return canvasEl(ref);

    function buildHilbert(order, w, h) {
      const pts = [], n = 1 << order, size = Math.min(w, h) * 0.9, ox = (w - size) / 2, oy = (h - size) / 2;
      for (let i = 0; i < n * n; i++) {
        let rx, ry, s = i, t2 = 0, x = 0, y = 0;
        for (let d = 1; d < n; d *= 2) {
          rx = 1 & (t2 / 2); ry = 1 & (t2 ^ rx);
          if (ry === 0) { if (rx === 1) { x = d - 1 - x; y = d - 1 - y; } const tmp = x; x = y; y = tmp; }
          t2++;
        }
        pts.push({ x: ox + x * size / (n - 1), y: oy + y * size / (n - 1) });
      }
      return pts;
    }
  }
  window.HilbertCurve = HilbertCurve;

  // ============================================================
  // 鸿蒙「沉浸光感」——重写 HarmonyNotification（覆盖 bundle 版）
  // 参照 HarmonyOS 沉浸光感：磨砂玻璃通知卡片 + 星点光粒子，
  // 「指尖轻滑，光随指动」+「卡片消散如星光」。精细打磨：
  //  - 稳定 setup/draw/cleanup 引用（防滚动重渲染反复重建 effect）
  //  - dt 累积计时（待机暂停安全，恢复后动画不错位）
  //  - 自绘 accent 发光粒子精灵（高性能，lighter 叠加）
  //  - 磨砂玻璃：半透明渐变 + 圆角胶囊 + 边缘高光 + 外光晕 + 通知内容
  //  - 光随指动：指针光晕 + 附近粒子增亮放大
  //  - 星光消散：柔和上浮 + 淡出（非硬爆炸）
  // ============================================================
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function glowSprite(color) {
    const S = 64, c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, hexA(color, 1)); g.addColorStop(0.22, hexA(color, 0.85)); g.addColorStop(1, hexA(color, 0));
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return c;
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function layoutHN(s) {
    const cw = Math.min(s.w * 0.66, 300), ch = cw * 0.52;
    s.card = { x: (s.w - cw) / 2, y: (s.h - ch) / 2, w: cw, h: ch, r: Math.min(24, ch * 0.3) };
  }
  function initHN(s) {
    const c = s.card;
    const N = Math.max(120, Math.min(360, Math.round(240 * (s.w * s.h) / (300 * 200))));
    s.ps = [];
    for (let i = 0; i < N; i++) {
      let tx, ty;
      if (i % 3 === 0) { // 卡片边缘描边
        const per = (i / N) * 4, side = Math.floor(per), f = per - side;
        if (side === 0) { tx = c.x + f * c.w; ty = c.y; }
        else if (side === 1) { tx = c.x + c.w; ty = c.y + f * c.h; }
        else if (side === 2) { tx = c.x + c.w - f * c.w; ty = c.y + c.h; }
        else { tx = c.x; ty = c.y + c.h - f * c.h; }
      } else { // 卡片内部内容
        tx = c.x + c.w * (0.16 + Math.random() * 0.7);
        ty = c.y + c.h * (0.2 + Math.random() * 0.6);
      }
      s.ps.push({
        sx: Math.random() * s.w, sy: s.h + Math.random() * s.h * 0.7,
        tx: tx, ty: ty, x: 0, y: 0, vx: 0, vy: 0,
        startDist: 40 + Math.random() * 90, spiralAngle: Math.random() * 6.283,
        delay: Math.random(), phase: Math.random() * 6.283,
        twinkle: 0.5 + Math.random() * 2, size: 0.7 + Math.random() * 1.6,
        baseAlpha: 0.35 + Math.random() * 0.6, a: 0, sz: 1
      });
    }
  }
  function drawCardHN(ctx, s, accent) {
    const c = s.card, a = s.cardT;
    if (a <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowColor = hexA(accent, 0.5); ctx.shadowBlur = 28;
    rr(ctx, c.x, c.y, c.w, c.h, c.r);
    const g = ctx.createLinearGradient(c.x, c.y, c.x + c.w, c.y + c.h);
    g.addColorStop(0, 'rgba(255,255,255,0.16)');
    g.addColorStop(0.5, 'rgba(150,170,255,0.10)');
    g.addColorStop(1, hexA(accent, 0.16));
    ctx.fillStyle = g; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(c.x + c.r, c.y + 1); ctx.lineTo(c.x + c.w - c.r, c.y + 1);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    const ix = c.x + c.w * 0.17, iy = c.y + c.h * 0.5, ir = c.h * 0.2;
    const ig = ctx.createRadialGradient(ix - ir * 0.3, iy - ir * 0.3, 0, ix, iy, ir);
    ig.addColorStop(0, hexA(accent, 0.95)); ig.addColorStop(1, hexA(accent, 0.25));
    ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    rr(ctx, c.x + c.w * 0.34, c.y + c.h * 0.32, c.w * 0.46, c.h * 0.13, c.h * 0.07); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    rr(ctx, c.x + c.w * 0.34, c.y + c.h * 0.56, c.w * 0.32, c.h * 0.1, c.h * 0.05); ctx.fill();
    ctx.restore();
  }
  function HarmonyNotification(props) {
    const accent = (props && props.accentColor) || '#7c5cff';
    const ref = React.useRef(null);
    const optRef = React.useRef({ accent: accent });
    optRef.current.accent = accent;
    const setupRef = React.useRef(null), drawRef = React.useRef(null), cleanRef = React.useRef(null);
    if (!setupRef.current) {
      setupRef.current = function () {
        const canvas = ref.current;
        const s = {
          elapsed: 0, phase: 'forming', phaseStart: 0,
          formDuration: 2100, waitDuration: 3000, explodeDuration: 1700,
          cardT: 0, ps: null, card: null, w: 0, h: 0, sprite: null,
          pointer: { x: -999, y: -999, active: false }, _ls: []
        };
        s.sprite = glowSprite(optRef.current.accent);
        const onMove = function (e) { const r = canvas.getBoundingClientRect(); s.pointer.x = e.clientX - r.left; s.pointer.y = e.clientY - r.top; s.pointer.active = true; };
        const onDown = function (e) { const r = canvas.getBoundingClientRect(); s.pointer.x = e.clientX - r.left; s.pointer.y = e.clientY - r.top; s.pointer.active = true; if (s.phase === 'waiting') { s.phase = 'exploding'; s.phaseStart = s.elapsed; } };
        const onLeave = function () { s.pointer.active = false; s.pointer.x = -999; s.pointer.y = -999; };
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointerleave', onLeave);
        s._ls = [[canvas, 'pointermove', onMove], [canvas, 'pointerdown', onDown], [canvas, 'pointerleave', onLeave]];
        return s;
      };
    }
    if (!drawRef.current) {
      drawRef.current = function (ctx, w, h, t, dt, s) {
        if (!s.ps || s.w !== w || s.h !== h) { s.w = w; s.h = h; layoutHN(s); initHN(s); }
        s.elapsed += (dt > 0 && dt < 200 ? dt : 16);
        const now = s.elapsed, ps = s.ps, accent = optRef.current.accent;
        const px = s.pointer.x, py = s.pointer.y, pAct = s.pointer.active;
        if (pAct) {
          const R = 78, pg = ctx.createRadialGradient(px, py, 0, px, py, R);
          pg.addColorStop(0, hexA(accent, 0.22)); pg.addColorStop(1, hexA(accent, 0));
          ctx.fillStyle = pg; ctx.fillRect(px - R, py - R, R * 2, R * 2);
        }
        if (s.phase === 'forming') {
          const u = now - s.phaseStart, M = s.formDuration, tt = u / M >= 1 ? 1 : u / M;
          s.cardT = tt < 0.5 ? 8 * tt * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 4) / 2;
          for (let i = 0; i < ps.length; i++) {
            const y = ps[i], C = y.delay * 0.4, I = Math.max(0, Math.min(1, (tt - C) / (1 - C)));
            if (I <= 0) continue;
            const P = 1 - Math.pow(1 - I, 3), k = y.spiralAngle * (1 - P), D = y.startDist * (1 - P);
            y.x = y.sx + (y.tx - y.sx) * P + Math.cos(k) * D * 0.3;
            y.y = y.sy + (y.ty - y.sy) * P + Math.sin(k) * D * 0.2;
            y.a = y.baseAlpha * Math.min(1, I * 3);
            y.sz = y.size * (0.5 + 0.5 * P);
          }
          if (tt >= 1) { s.phase = 'waiting'; s.phaseStart = now; s.cardT = 1; }
        } else if (s.phase === 'waiting') {
          const u = now * 0.002;
          for (let i = 0; i < ps.length; i++) {
            const p2 = ps[i];
            p2.x = p2.tx + Math.sin(u + p2.phase) * 0.6;
            p2.y = p2.ty + Math.cos(u * 1.25 + p2.phase) * 0.5;
            let boost = 1;
            if (pAct) { const dx = p2.x - px, dy = p2.y - py, d2 = dx * dx + dy * dy; if (d2 < 8100) { const f = 1 - Math.sqrt(d2) / 90; boost = 1 + f * 1.8; } }
            p2.a = Math.min(1, p2.baseAlpha * boost * (0.72 + 0.28 * Math.sin(u * 3 + p2.twinkle)));
            p2.sz = p2.size * (0.55 + 0.45 * Math.sin(u * 2 + p2.twinkle)) * (boost > 1 ? 1.2 : 1);
          }
          if (now - s.phaseStart > s.waitDuration) { s.phase = 'exploding'; s.phaseStart = now; }
        } else {
          const u = now - s.phaseStart, M = s.explodeDuration, tt = u / M >= 1 ? 1 : u / M;
          s.cardT = Math.max(0, 1 - tt * 1.5);
          for (let i = 0; i < ps.length; i++) {
            const p2 = ps[i];
            p2.vx *= 0.97; p2.vy = p2.vy * 0.97 - 0.014;
            p2.x += p2.vx; p2.y += p2.vy;
            const k = 1 - tt;
            p2.a = p2.baseAlpha * k * k;
            p2.sz = p2.size * (1 + tt * 0.7);
          }
          if (tt >= 1) { s.phase = 'forming'; s.phaseStart = now; s.cardT = 0; }
        }
        drawCardHN(ctx, s, accent);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < ps.length; i++) {
          const p2 = ps[i];
          if (p2.a <= 0.02) continue;
          ctx.globalAlpha = p2.a > 1 ? 1 : p2.a;
          const r = p2.sz * 4;
          ctx.drawImage(s.sprite, p2.x - r, p2.y - r, r * 2, r * 2);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      };
    }
    if (!cleanRef.current) {
      cleanRef.current = function (s) { if (s && s._ls) for (let i = 0; i < s._ls.length; i++) s._ls[i][0].removeEventListener(s._ls[i][1], s._ls[i][2]); };
    }
    window.useCanvasEffect(ref, { setup: setupRef.current, draw: drawRef.current, cleanup: cleanRef.current, active: true });
    return React.createElement('canvas', { ref: ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.HarmonyNotification = HarmonyNotification;

})();
