// ScrollParallax · 滚动视差场景：星空/月亮/远近山峦/树/萤火虫，滚轮驱动纵深
(function () {
  function ScrollParallax({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const wrapRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const scrollY = React.useRef(0);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);

    React.useEffect(() => {
      const el = wrapRef.current; if (!el) return;
      const onWheel = (e) => {
        e.preventDefault();
        const h = canvasRef.current ? canvasRef.current.height : 600;
        scrollY.current = Math.max(0, Math.min(h * 2.4, scrollY.current + e.deltaY * 0.8));
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }, []);

    const mkMountains = (w, base, amp, step) => {
      const pts = [];
      for (let x = 0; x <= w + step; x += step) {
        const y = base + Math.sin(x * 0.01) * amp + Math.sin(x * 0.027 + 1) * amp * 0.5 + Math.sin(x * 0.05 + 2) * amp * 0.25;
        pts.push({ x, y });
      }
      return pts;
    };

    const setup = React.useCallback((ctx, w, h) => {
      const stars = [];
      for (let i = 0; i < 60; i++) stars.push({ x: Math.random() * w, y: Math.random() * h * 0.6, s: 1 + (Math.random() * 3 | 0), a: 0.4 + Math.random() * 0.5, ph: Math.random() * 6.28 });
      const clouds = [{ x: w * 0.2, y: h * 0.25, w: 50, h: 10 }, { x: w * 0.7, y: h * 0.35, w: 40, h: 8 }, { x: w * 0.5, y: h * 0.2, w: 45, h: 9 }];
      const far = mkMountains(w, h * 0.55, h * 0.10, w / 24);
      const mid = mkMountains(w, h * 0.65, h * 0.14, w / 18);
      const trees = [];
      const xs = [3, 12, 22, 35, 48, 62, 75, 88, 95];
      for (const p of xs) trees.push({ x: w * p / 100, h: 28 + Math.random() * 20, trunk: 4 });
      const flies = [];
      for (let i = 0; i < 12; i++) flies.push({ x: Math.random() * w, y: h * (0.55 + Math.random() * 0.3), vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.3, ph: Math.random() * 6.28 });
      return { stars, clouds, far, mid, trees, flies, total: h * 2.4 };
    }, [motionLevel]);

    const drawMountains = (ctx, w, h, pts, offset, colors) => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (const p of pts) ctx.lineTo(p.x, p.y + offset);
      ctx.lineTo(w, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      const sp = reduced ? 0.1 : 1;
      const sc = scrollY.current;
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#05071a'); sky.addColorStop(0.45, '#0d1030'); sky.addColorStop(0.75, '#1a1845'); sky.addColorStop(1, '#2d1d50');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

      for (const st of s.stars) {
        let y = (st.y - sc * 0.05 * sp) % h; if (y < 0) y += h;
        ctx.fillStyle = `rgba(255,255,255,${st.a * (0.5 + 0.5 * Math.sin(time * 0.002 + st.ph))})`;
        ctx.fillRect(st.x, y, st.s, st.s);
      }

      const mx = w * 0.72, my = h * 0.2 - sc * 0.08 * sp;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
      mg.addColorStop(0, 'rgba(255,215,0,0.95)'); mg.addColorStop(0.4, 'rgba(255,120,40,0.4)'); mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, 60, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(mx, my, 18, 0, 6.283); ctx.fill();

      for (const c of s.clouds) {
        const y = c.y - sc * 0.1 * sp;
        if (y < -30 || y > h + 30) continue;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath(); ctx.ellipse(c.x, y, c.w, c.h, 0, 0, 6.283); ctx.fill();
      }

      drawMountains(ctx, w, h, s.far, -sc * 0.25 * sp, ['#3a2d5e', '#28204a']);
      drawMountains(ctx, w, h, s.mid, -sc * 0.5 * sp, ['#1e4a3a', '#14352a']);

      const treeOff = -sc * 0.8 * sp;
      for (const t of s.trees) {
        const ty = h - 8 + treeOff;
        if (ty < -60 || ty > h + 60) continue;
        ctx.fillStyle = '#23402a'; ctx.fillRect(t.x - t.trunk / 2, ty - t.h, t.trunk, t.h);
        ctx.fillStyle = '#2f6b3f';
        ctx.beginPath(); ctx.moveTo(t.x, ty - t.h - 8); ctx.lineTo(t.x + t.h / 2, ty - t.h + 6); ctx.lineTo(t.x - t.h / 2, ty - t.h + 6); ctx.closePath(); ctx.fill();
      }

      for (const f of s.flies) {
        f.x += f.vx * sp; f.y += f.vy * sp;
        if (f.x < 0) f.x += w; if (f.x > w) f.x -= w;
        const a = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.002 + f.ph));
        ctx.beginPath(); ctx.arc(f.x, f.y + treeOff * 0.3, 1.5, 0, 6.283);
        ctx.fillStyle = window.hexToRgba(accentColor, a);
        ctx.shadowColor = accentColor; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
      }

      const groundY = h * 0.88 - sc * 1.0 * sp;
      if (groundY > -40 && groundY < h + 40) {
        const gg = ctx.createLinearGradient(0, groundY - 12, 0, groundY + 12);
        gg.addColorStop(0, '#1a3020'); gg.addColorStop(1, '#060f08');
        ctx.fillStyle = gg; ctx.fillRect(0, groundY - 12, w, h - groundY + 24);
        const px = w / 2, py = groundY - 10;
        const pg = ctx.createLinearGradient(px - 9, py - 30, px + 9, py);
        pg.addColorStop(0, accentColor); pg.addColorStop(1, '#b14dff');
        ctx.fillStyle = pg; ctx.fillRect(px - 9, py - 28, 18, 28);
        ctx.fillStyle = '#e8d4b8'; ctx.beginPath(); ctx.arc(px, py - 35, 7, 0, 6.283); ctx.fill();
      }

      const prog = Math.min(1, sc / s.total);
      const bx = w - 10, by = h / 2 - 25;
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(bx, by, 2, 50);
      ctx.fillStyle = accentColor; ctx.fillRect(bx, by, 2, 50 * prog);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      ctx.fillText('↕ SCROLL', w / 2, 22);
    }, [accentColor, reduced]);

    useCanvasEffect(canvasRef, { draw, setup, active: true });
    return React.createElement('div', { ref: wrapRef, style: { position: 'absolute', inset: 0, overflow: 'hidden', background: '#05071a', cursor: 'grab' } },
      React.createElement('canvas', { ref: canvasRef, style: { display: 'block', width: '100%', height: '100%' } })
    );
  }
  window.ScrollParallax = ScrollParallax;
})();
