(function () {
  // AetherWaves · 以太波：多层正弦波叠加，呼吸式明灭
  function AetherWaves({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const N = motionLevel === 'subtle' ? 14 : motionLevel === 'intense' ? 40 : 26;
      const lines = [];
      for (let i = 0; i < N; i++) {
        lines.push({ y: (i + 0.5) / N, amp: 8 + Math.random() * 26, ph: Math.random() * 6.28, sp: 0.3 + Math.random() * 0.7 });
      }
      return { lines };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = 'rgba(7,10,22,0.22)';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.15 : 1;
      ctx.lineWidth = 1.4;
      for (const ln of s.lines) {
        const y0 = ln.y * h;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 5) {
          const y = y0 + Math.sin(x * 0.012 + time * 0.0006 * ln.sp * sp + ln.ph) * ln.amp
                      + Math.sin(x * 0.03 - time * 0.0009 * ln.sp + ln.ph) * ln.amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = window.hexToRgba(accentColor, 0.18 + 0.32 * Math.pow(Math.sin(time * 0.001 + ln.ph), 2));
        ctx.stroke();
      }
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.AetherWaves = AetherWaves;
})();
