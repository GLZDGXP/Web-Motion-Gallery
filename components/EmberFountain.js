(function () {
  // EmberFountain · 余烬喷泉：粒子向上喷射受重力回落，暖色余烬
  function EmberFountain({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback(() => ({ ps: [] }), []);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = 'rgba(8,6,12,0.2)';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.25 : 1;
      if (Math.random() < (reduced ? 0.05 : 0.4)) {
        const burst = motionLevel === 'subtle' ? 1 : motionLevel === 'intense' ? 4 : 2;
        for (let i = 0; i < burst; i++)
          s.ps.push({ x: w / 2 + (Math.random() - 0.5) * 20, y: h, vx: (Math.random() - 0.5) * 2, vy: -(4 + Math.random() * 4), life: 1 });
      }
      for (let i = s.ps.length - 1; i >= 0; i--) {
        const p = s.ps[i];
        p.vy += 0.12 * sp; p.x += p.vx * sp; p.y += p.vy * sp; p.life -= 0.012 * sp;
        if (p.life <= 0 || p.y > h) { s.ps.splice(i, 1); continue; }
        const a = Math.max(0, p.life);
        ctx.fillStyle = window.hexToRgba(accentColor, a);
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5 + a * 2, 0, 6.283); ctx.fill();
      }
    }, [accentColor, reduced, motionLevel]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.EmberFountain = EmberFountain;
})();
