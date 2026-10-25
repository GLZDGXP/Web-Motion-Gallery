(function () {
  // CosmicDrift · 宇宙漂流：星云辉光 + 星点视差漂移
  function CosmicDrift({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const N = motionLevel === 'subtle' ? 80 : motionLevel === 'intense' ? 260 : 160;
      const stars = [];
      for (let i = 0; i < N; i++) stars.push({ x: Math.random(), y: Math.random(), z: 0.2 + Math.random(), tw: Math.random() * 6.28 });
      const neb = [];
      for (let i = 0; i < 3; i++) neb.push({ x: Math.random(), y: Math.random(), r: 0.2 + Math.random() * 0.3, ph: Math.random() * 6.28 });
      return { stars, neb };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = '#03040c';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.1 : 1;
      ctx.globalCompositeOperation = 'lighter';
      for (const n of s.neb) {
        const cx = n.x * w, cy = n.y * h, r = n.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, window.hexToRgba(accentColor, 0.10 + 0.04 * Math.sin(time * 0.0005 + n.ph)));
        g.addColorStop(1, window.hexToRgba(accentColor, 0));
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const st of s.stars) {
        st.y += 0.0006 * st.z * sp; if (st.y > 1) st.y -= 1;
        const x = st.x * w, y = st.y * h, sz = st.z * 1.6;
        const a = 0.4 + 0.6 * Math.sin(time * 0.002 * st.z + st.tw);
        ctx.fillStyle = `rgba(255,255,255,${a * st.z})`;
        ctx.beginPath(); ctx.arc(x, y, sz, 0, 6.283); ctx.fill();
      }
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.CosmicDrift = CosmicDrift;
})();
