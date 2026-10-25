(function () {
  // PlasmaBlobs · 等离子球：多个发光球随 additive 混合流动
  function PlasmaBlobs({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback(() => {
      const N = motionLevel === 'subtle' ? 3 : motionLevel === 'intense' ? 7 : 5;
      const blobs = [];
      for (let i = 0; i < N; i++) blobs.push({ ph: Math.random() * 6.28, sp: 0.2 + Math.random() * 0.5, r: 0.18 + Math.random() * 0.12 });
      return { blobs };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = '#04060f';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const sp = reduced ? 0.15 : 1;
      const R = Math.min(w, h);
      for (const b of s.blobs) {
        const cx = w * (0.5 + 0.32 * Math.cos(time * 0.0004 * b.sp * sp + b.ph));
        const cy = h * (0.5 + 0.32 * Math.sin(time * 0.0005 * b.sp * sp + b.ph * 1.3));
        const r = R * b.r;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, window.hexToRgba(accentColor, 0.5));
        g.addColorStop(1, window.hexToRgba(accentColor, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.PlasmaBlobs = PlasmaBlobs;
})();
