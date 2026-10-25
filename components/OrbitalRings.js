(function () {
  // OrbitalRings · 轨道光环：多圈旋转轨道 + 沿轨卫星，中心核辉光
  function OrbitalRings({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const rings = [];
      const n = motionLevel === 'subtle' ? 3 : motionLevel === 'intense' ? 6 : 4;
      for (let i = 0; i < n; i++) rings.push({
        r: 0.16 + i * 0.13, tilt: (i * 0.4) % Math.PI, sp: (i % 2 ? 1 : -1) * (0.3 + i * 0.12), ph: Math.random() * 6.28
      });
      return { rings };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = '#04060f';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.1 : 1;
      const cx = w / 2, cy = h / 2, R = Math.min(w, h);
      // 核心辉光
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.22);
      g.addColorStop(0, window.hexToRgba(accentColor, 0.8));
      g.addColorStop(1, window.hexToRgba(accentColor, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.22, 0, 6.283); ctx.fill();
      for (const ring of s.rings) {
        const rr = ring.r * R;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.tilt);
        ctx.strokeStyle = window.hexToRgba(accentColor, 0.35);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * 0.42, 0, 0, 6.283); ctx.stroke();
        const a = time * 0.0006 * ring.sp * sp + ring.ph;
        const sx = Math.cos(a) * rr, sy = Math.sin(a) * rr * 0.42;
        ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 6.283);
        ctx.fillStyle = window.hexToRgba(accentColor, 0.95);
        ctx.shadowColor = accentColor; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
        ctx.restore();
      }
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.OrbitalRings = OrbitalRings;
})();
