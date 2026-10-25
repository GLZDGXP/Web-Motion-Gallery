(function () {
  // HoneycombPulse · 蜂巢脉冲：六边形网格由中心向外扩散光波
  function HoneycombPulse({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const R = Math.min(w, h);
      const size = motionLevel === 'subtle' ? R * 0.10 : R * 0.07;
      return { size, cx: w / 2, cy: h / 2, t0: performance.now() };
    }, [motionLevel]);
    const hex = (ctx, x, y, s) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 3 * i - Math.PI / 6;
        const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = '#05080f';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.2 : 1;
      const sz = s.size, dx = sz * Math.sqrt(3), dy = sz * 1.5;
      const cols = Math.ceil(w / dx) + 1, rows = Math.ceil(h / dy) + 1;
      for (let r = -1; r <= rows; r++) {
        for (let c = -1; c <= cols; c++) {
          const x = c * dx + (r % 2 ? dx / 2 : 0);
          const y = r * dy;
          const dist = Math.hypot(x - s.cx, y - s.cy);
          const wave = Math.sin(dist * 0.02 - time * 0.002 * sp);
          const p = Math.max(0, wave);
          hex(ctx, x, y, sz * 0.92);
          ctx.fillStyle = window.hexToRgba(accentColor, 0.05 + p * 0.5);
          ctx.fill();
          if (p > 0.7) { ctx.shadowColor = accentColor; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0; }
        }
      }
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.HoneycombPulse = HoneycombPulse;
})();
