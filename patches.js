/* ============================================================
 * patches.js — 覆盖 bundle 内两个问题组件
 *  1) Diamond3D  ：flat shading 重写（去每帧渐变 → 性能大增；facet 锐利+火彩+色散 → 更像钻石）
 *  2) ProgressCounter：健壮重写（stats 安全默认 + progress 防除零 + in-view 触发 → 修加载异常）
 * 时机：本脚本在 bundle 之后同步执行（defer），此时 React 尚未开始并发渲染，
 *       覆盖 window 全局后，渲染（含第16+懒挂载卡片）即使用优化版。
 * ============================================================ */
(function () {
  'use strict';
  var React = window.React;
  if (!React || !React.createElement) return;
  var h = React.createElement;

  function hexA(hex, a) {
    var al = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16);
    if (al.length < 2) al = '0' + al;
    return (/^#[0-9a-f]{6}$/i.test(hex)) ? hex + al : hex;
  }

  /* ================= 1) 优化版 3D 钻石 ================= */
  function buildGeo() {
    var V = [{ x: 0, y: -0.8, z: 0 }], i, a;
    for (i = 0; i < 8; i++) { a = i / 8 * 6.2831853; V.push({ x: Math.cos(a) * 0.5, y: -0.36, z: Math.sin(a) * 0.5 }); }
    for (i = 0; i < 8; i++) { a = i / 8 * 6.2831853 + 0.3926991; V.push({ x: Math.cos(a) * 1, y: 0, z: Math.sin(a) * 1 }); }
    for (i = 0; i < 8; i++) { a = i / 8 * 6.2831853; V.push({ x: Math.cos(a) * 0.42, y: 0.6, z: Math.sin(a) * 0.42 }); }
    V.push({ x: 0, y: 1, z: 0 });
    var F = [], b, c, d;
    for (i = 0; i < 8; i++) F.push([0, 1 + i, 1 + (i + 1) % 8]);
    for (i = 0; i < 8; i++) { a = 1 + i; b = 1 + (i + 1) % 8; c = 9 + (i + 1) % 8; d = 9 + i; F.push([a, b, c], [a, c, d]); }
    for (i = 0; i < 8; i++) { a = 9 + i; b = 9 + (i + 1) % 8; c = 17 + (i + 1) % 8; d = 17 + i; F.push([a, b, c], [a, c, d]); }
    for (i = 0; i < 8; i++) F.push([17 + i, 17 + (i + 1) % 8, 25]);
    return { V: V, F: F };
  }

  function Diamond3D() {
    var canvasRef = React.useRef(null);
    var rot = React.useRef({ x: -0.3, y: 0.5 });
    var drag = React.useRef(false);
    var last = React.useRef({ x: 0, y: 0 });
    var auto = React.useRef(true);
    var geo = React.useMemo(buildGeo, []);

    React.useEffect(function () {
      var el = canvasRef.current; if (!el) return;
      function pt(e) { return (e.touches && e.touches[0]) ? e.touches[0] : e; }
      function down(e) { drag.current = true; auto.current = false; var p = pt(e); last.current = { x: p.clientX, y: p.clientY }; }
      function up() { drag.current = false; }
      function move(e) {
        if (!drag.current) return; var p = pt(e); if (p.clientX == null) return;
        var dx = p.clientX - last.current.x, dy = p.clientY - last.current.y;
        last.current = { x: p.clientX, y: p.clientY };
        rot.current.y += dx * 0.01; rot.current.x = Math.max(-1.2, Math.min(1.2, rot.current.x + dy * 0.01));
        if (e.cancelable) e.preventDefault();
      }
      el.addEventListener('mousedown', down); window.addEventListener('mouseup', up); window.addEventListener('mousemove', move);
      el.addEventListener('touchstart', down, { passive: true }); window.addEventListener('touchend', up); window.addEventListener('touchmove', move, { passive: false });
      return function () {
        el.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', move);
        el.removeEventListener('touchstart', down); window.removeEventListener('touchend', up); window.removeEventListener('touchmove', move);
      };
    }, []);

    var drawRef = React.useRef(null);
    if (!drawRef.current) {
      drawRef.current = function (ctx, w, hh, t, dt, st) {
        // 尺寸稳定：过滤 <2px 抖动，避免滚动时重置
        if (st.__W === undefined) { st.__W = w; st.__H = hh; }
        var W = st.__W, H = st.__H;
        if (Math.abs(w - W) > 2 || Math.abs(hh - H) > 2) { W = w; H = hh; st.__W = w; st.__H = hh; }
        if (auto.current && !drag.current) rot.current.y += dt * 0.00035;
        var rx = rot.current.x, ry = rot.current.y;
        var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
        var ox = W / 2, oy = H / 2, sc = Math.min(W, H) * 0.33, cam = 3.2;
        var V = geo.V, F = geo.F, P = new Array(V.length), i, n;
        for (i = 0; i < V.length; i++) {
          n = V[i];
          var x1 = n.x * cy - n.z * sy, z1 = n.x * sy + n.z * cy;
          var y1 = n.y * cx - z1 * sx, z2 = n.y * sx + z1 * cx;
          var k = cam / (cam + z2);
          P[i] = { x: ox + x1 * sc * k, y: oy + y1 * sc * k, z: z2 };
        }
        var Lx = 0.35, Ly = -0.5, Lz = -0.78, Ll = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
        var list = [];
        for (i = 0; i < F.length; i++) {
          var f = F[i], a = P[f[0]], b = P[f[1]], c = P[f[2]];
          var ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
          var vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
          var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
          var nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1; nx /= nl; ny /= nl; nz /= nl;
          if (nz > 0.03) continue; // 背面剔除
          var ndl = Math.max(0, -(nx * Lx + ny * Ly + nz * Lz) / Ll);
          list.push({ f: f, z: (a.z + b.z + c.z) / 3, l: ndl });
        }
        list.sort(function (p, q) { return q.z - p.z; });
        ctx.clearRect(0, 0, W, H);
        for (i = 0; i < list.length; i++) {
          var fc = list[i]; f = fc.f; a = P[f[0]]; b = P[f[1]]; c = P[f[2]];
          var li = fc.l, lum = 16 + li * 64, sat = 50 + li * 30, al = 0.82 + li * 0.18;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
          ctx.fillStyle = 'hsla(166,' + sat.toFixed(0) + '%,' + lum.toFixed(0) + '%,' + al.toFixed(2) + ')';
          ctx.fill();
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = 'hsla(186,90%,' + (58 + li * 30).toFixed(0) + '%,' + (0.22 + li * 0.4).toFixed(2) + ')';
          ctx.stroke();
        }
        // 顶点火彩（限流 ~130ms，避免每帧多个径向渐变）
        if (st.__spk == null || (t || 0) - st.__spt > 130) { st.__spt = t || 0; st.__spk = 0.55 + Math.random() * 0.5; }
        var sp = st.__spk;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        var top = P[0];
        if (top && top.z < 1.6) {
          var g = ctx.createRadialGradient(top.x, top.y, 0, top.x, top.y, 30 * sp);
          g.addColorStop(0, 'rgba(255,255,255,' + (0.5 * sp).toFixed(2) + ')');
          g.addColorStop(0.45, 'hsla(178,100%,88%,' + (0.22 * sp).toFixed(2) + ')');
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(top.x, top.y, 30 * sp, 0, 6.2832); ctx.fill();
        }
        ctx.restore();
        // 底部投影
        var shy = oy + sc * 0.92;
        var sh = ctx.createRadialGradient(ox, shy, 0, ox, shy, sc * 0.55);
        sh.addColorStop(0, 'rgba(0,0,0,0.32)'); sh.addColorStop(1, 'transparent');
        ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(ox, shy, sc * 0.5, sc * 0.13, 0, 0, 6.2832); ctx.fill();
      };
    }
    if (window.useCanvasEffect) window.useCanvasEffect(canvasRef, { setup: function () { return {}; }, draw: drawRef.current, active: true });
    return h('div', { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, #0a1626, #05060e)', cursor: 'grab' } },
      h('canvas', { ref: canvasRef, style: { display: 'block', width: '100%', height: '100%' } }));
  }
  window.Diamond3D = Diamond3D;

  /* ================= 2) 健壮版 滚动数据 ================= */
  function ProgressCounter(props) {
    var accent = (props && props.accentColor) || '#00e5ff';
    var s1 = React.useState(false), inView = s1[0], setInView = s1[1];
    var s2 = React.useState(0), prog = s2[0], setProg = s2[1];
    var boxRef = React.useRef(null);
    React.useEffect(function () {
      var el = boxRef.current; if (!el) return;
      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { setInView(true); io.unobserve(e.target); } });
        }, { threshold: 0.15 });
        io.observe(el);
      } else { setInView(true); }
      function onSc() { var sh = el.scrollHeight - el.clientHeight; setProg(sh > 0 ? Math.max(0, Math.min(1, el.scrollTop / sh)) : 0); }
      el.addEventListener('scroll', onSc, { passive: true });
      return function () { if (io) io.disconnect(); el.removeEventListener('scroll', onSc); };
    }, []);
    var pct = Math.round(prog * 100);
    var bars = [['渲染性能', 96], ['内存效率', 88], ['代码覆盖率', 92]];
    var circles = [['CSS', 78, ''], ['Canvas', 65, 'purple'], ['SVG', 85, 'pink']];
    var tl = [['2023', '初始版本发布', 'done'], ['2024', '新增 15 种动效', 'done'], ['2025', '性能全面优化', 'active'], ['2026', 'AI 动效生成', 'todo']];
    return h('div', { ref: boxRef, className: 'pcx' },
      h('style', null, PCX_CSS(accent)),
      h('div', { className: 'pcx-bar' }, h('div', { className: 'pcx-bar-fill', style: { width: pct + '%' } })),
      h('div', { className: 'pcx-inner' },
        h('div', { className: 'pcx-stats' },
          h('div', { className: 'pcx-stat' }, h('div', { className: 'pcx-num' }, (12480).toLocaleString()), h('div', { className: 'pcx-lab' }, 'Users')),
          h('div', { className: 'pcx-stat' }, h('div', { className: 'pcx-num' }, '120'), h('div', { className: 'pcx-lab' }, 'Effects')),
          h('div', { className: 'pcx-stat' }, h('div', { className: 'pcx-num' }, '99%'), h('div', { className: 'pcx-lab' }, 'Uptime'))),
        h('div', { className: 'pcx-sec' }, h('div', { className: 'pcx-sec-t' }, '性能指标'),
          bars.map(function (b, i) {
            return h('div', { className: 'pcx-bitem', key: i },
              h('div', { className: 'pcx-brow' }, h('span', null, b[0]), h('span', { className: 'pcx-bval' }, b[1] + '%')),
              h('div', { className: 'pcx-btrack' }, h('div', { className: 'pcx-bfill', style: { width: inView ? b[1] + '%' : '0%' } })));
          })),
        h('div', { className: 'pcx-sec' }, h('div', { className: 'pcx-sec-t' }, '环形数据'),
          h('div', { className: 'pcx-circles' }, circles.map(function (c, i) {
            return h('div', { className: 'pcx-cstat', key: i },
              h('div', { className: 'pcx-ring ' + c[2], style: { '--pct': inView ? c[1] + '%' : '0%' } }, h('div', { className: 'pcx-cinner' }, c[1] + '%')),
              h('div', { className: 'pcx-clab' }, c[0]));
          }))),
        h('div', { className: 'pcx-sec' }, h('div', { className: 'pcx-sec-t' }, '时间线'),
          tl.map(function (m, i) {
            return h('div', { className: 'pcx-tl', key: i },
              h('div', { className: 'pcx-tldot ' + m[2] }),
              h('div', null, h('div', { className: 'pcx-tlyear' }, m[0]), h('div', { className: 'pcx-tllab' }, m[1])));
          })),
        h('div', { className: 'pcx-hint' }, '— SCROLL PROGRESS · ' + pct + '% —')));
  }
  window.ProgressCounter = ProgressCounter;

  function PCX_CSS(a) {
    return [
      '.pcx{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;background:radial-gradient(ellipse at top,' + hexA(a, 0.08) + ' 0%,transparent 60%),#0a0d18;font-family:var(--font-body)}',
      '.pcx::-webkit-scrollbar{display:none}',
      '.pcx-bar{position:sticky;top:0;left:0;right:0;height:3px;background:rgba(120,150,255,.1);z-index:20}',
      '.pcx-bar-fill{height:100%;width:0;background:linear-gradient(90deg,' + a + ',#b14dff,#ff4d9d);box-shadow:0 0 10px ' + hexA(a, 0.5) + ';transition:width .05s linear}',
      '.pcx-inner{padding:24px}',
      '.pcx-stats{display:flex;gap:12px;margin-bottom:24px}',
      '.pcx-stat{flex:1;text-align:center;padding:16px 8px;background:rgba(120,150,255,.05);border:1px solid rgba(120,150,255,.1);border-radius:12px}',
      '.pcx-num{font-family:var(--font-display);font-size:22px;font-weight:700;color:' + a + ';line-height:1.2}',
      '.pcx-lab{font-size:10px;color:var(--text-muted);margin-top:4px;text-transform:uppercase;letter-spacing:.8px}',
      '.pcx-sec{margin-bottom:28px}',
      '.pcx-sec-t{font-family:var(--font-display);font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:8px}',
      '.pcx-sec-t::before{content:"";width:4px;height:16px;background:' + a + ';border-radius:2px;box-shadow:0 0 8px ' + a + '}',
      '.pcx-bitem{margin-bottom:10px}',
      '.pcx-brow{display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;color:var(--text-secondary)}',
      '.pcx-bval{color:' + a + ';font-family:var(--font-mono);font-weight:500}',
      '.pcx-btrack{height:6px;background:rgba(120,150,255,.1);border-radius:3px;overflow:hidden}',
      '.pcx-bfill{height:100%;border-radius:3px;background:linear-gradient(90deg,' + a + ',#b14dff);box-shadow:0 0 6px ' + hexA(a, 0.4) + ';transition:width 1.5s cubic-bezier(.2,.8,.2,1)}',
      '.pcx-circles{display:flex;justify-content:space-around;align-items:center;margin:16px 0}',
      '.pcx-cstat{text-align:center}',
      '.pcx-ring{width:70px;height:70px;border-radius:50%;background:conic-gradient(' + a + ' 0%,' + a + ' var(--pct,70%),rgba(120,150,255,.1) var(--pct,70%));display:flex;align-items:center;justify-content:center;margin:0 auto 6px;box-shadow:0 0 20px ' + hexA(a, 0.15) + '}',
      '.pcx-ring.purple{background:conic-gradient(#b14dff 0%,#b14dff var(--pct,70%),rgba(120,150,255,.1) var(--pct,70%))}',
      '.pcx-ring.pink{background:conic-gradient(#ff4d9d 0%,#ff4d9d var(--pct,70%),rgba(120,150,255,.1) var(--pct,70%))}',
      '.pcx-cinner{width:54px;height:54px;border-radius:50%;background:#0a0d18;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;font-weight:600;color:var(--text-primary)}',
      '.pcx-clab{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}',
      '.pcx-tl{display:flex;gap:12px;padding:8px 0;align-items:flex-start}',
      '.pcx-tldot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px;background:#333}',
      '.pcx-tldot.done{background:' + a + ';box-shadow:0 0 8px ' + a + '}',
      '.pcx-tldot.active{background:#ffd700;box-shadow:0 0 8px #ffd700}',
      '.pcx-tlyear{font-family:var(--font-mono);font-size:11px;color:var(--text-muted)}',
      '.pcx-tllab{font-size:12px;color:var(--text-secondary)}',
      '.pcx-hint{text-align:center;font-family:var(--font-mono);font-size:10px;color:var(--text-muted);padding:16px 0;letter-spacing:1px}'
    ].join('\n');
  }

  /* ===== 全局兜底：拦截 NaN/非法颜色，避免 addColorStop 报错导致 useCanvasEffect 连续报错停渲染 ===== */
  (function () {
    var proto = window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype;
    if (!proto) return;
    var SAFE = 'rgba(0, 229, 255, 0.25)';
    // 共享一个守卫函数（this=gradient），避免每个渐变/每帧都新建闭包，降低 GC 压力
    var guarded = function (off, col) {
      var add = this.__oa;
      try { add(off, (typeof col !== 'string' || /NaN|undefined/.test(col)) ? SAFE : col); }
      catch (e) { try { add(off, SAFE); } catch (_) {} }
    };
    ['createLinearGradient', 'createRadialGradient', 'createConicGradient'].forEach(function (fn) {
      var orig = proto[fn];
      if (typeof orig !== 'function') return;
      proto[fn] = function () {
        var g = orig.apply(this, arguments);
        if (g && typeof g.addColorStop === 'function' && !g.__guard) {
          g.__oa = g.addColorStop.bind(g);
          g.__guard = true;
          g.addColorStop = guarded;
        }
        return g;
      };
    });
  })();

  /* ===== 根治：window.hexToRgba / window.hexToHue 对无效输入回退主题青，而非 NaN ===== */
  (function () {
    var origRgba = window.hexToRgba;
    if (typeof origRgba === 'function') {
      window.hexToRgba = function (hex, a) {
        try { var r = origRgba(hex, a); if (typeof r === 'string' && r.indexOf('NaN') < 0 && r.indexOf('undefined') < 0) return r; } catch (e) {}
        return 'rgba(0, 229, 255, ' + (typeof a === 'number' && isFinite(a) ? a : 1) + ')';
      };
    }
    var origHue = window.hexToHue;
    if (typeof origHue === 'function') {
      window.hexToHue = function (hex) {
        try { var hu = origHue(hex); if (typeof hu === 'number' && isFinite(hu)) return hu; } catch (e) {}
        return 190;
      };
    }
  })();

  /* ===== 限制 canvas DPR：高分屏(DPR>1.5)像素翻倍是 GPU 光栅化大头，cap 到 1.5 兼顾清晰与性能 ===== */
  (function () {
    var real = window.devicePixelRatio || 1;
    if (real > 1.5) {
      try { Object.defineProperty(window, 'devicePixelRatio', { get: function () { return 1.5; }, configurable: true }); } catch (e) {}
    }
  })();
})();
