(function () {
  // NeonGridPulse · 霓虹网格脉冲：网格节点按相位呼吸发光
  function NeonGridPulse({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const gap = motionLevel === 'subtle' ? 42 : 30;
      return { gap, cols: Math.ceil(w / gap) + 1, rows: Math.ceil(h / gap) + 1 };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.2 : 1;
      for (let r = 0; r <= s.rows; r++) {
        for (let c = 0; c <= s.cols; c++) {
          const x = c * s.gap, y = r * s.gap;
          const p = 0.5 + 0.5 * Math.sin(time * 0.002 * sp + (x + y) * 0.06);
          ctx.beginPath();
          ctx.arc(x, y, 1 + p * 2.5, 0, 6.283);
          ctx.fillStyle = window.hexToRgba(accentColor, 0.15 + p * 0.6);
          ctx.fill();
          if (p > 0.85) {
            ctx.shadowColor = accentColor; ctx.shadowBlur = 12;
            ctx.fill(); ctx.shadowBlur = 0;
          }
        }
      }
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.NeonGridPulse = NeonGridPulse;
})();
