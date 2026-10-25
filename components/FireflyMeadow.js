(function () {
  // FireflyMeadow · 萤火虫草甸：暖色光点在草丛间漂浮闪烁
  function FireflyMeadow({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const N = motionLevel === 'subtle' ? 18 : motionLevel === 'intense' ? 70 : 40;
      const flies = [];
      for (let i = 0; i < N; i++) flies.push({
        x: Math.random() * w, y: h * (0.3 + Math.random() * 0.7),
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.3,
        ph: Math.random() * 6.28, sp: 0.5 + Math.random()
      });
      return { flies };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = 'rgba(4,10,8,0.25)';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.2 : 1;
      // 草地剪影
      ctx.fillStyle = '#06140d';
      ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 10) ctx.lineTo(x, h - 20 - Math.sin(x * 0.02) * 12);
      ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      for (const f of s.flies) {
        f.x += f.vx * sp; f.y += f.vy * sp;
        if (f.x < 0) f.x += w; if (f.x > w) f.x -= w;
        if (f.y < h * 0.2) f.vy += 0.02; if (f.y > h) f.vy -= 0.02;
        const a = 0.3 + 0.7 * Math.pow(Math.sin(time * 0.001 * f.sp + f.ph) * 0.5 + 0.5, 2);
        ctx.beginPath(); ctx.arc(f.x, f.y, 2 + a * 2, 0, 6.283);
        ctx.fillStyle = window.hexToRgba(accentColor, a);
        ctx.shadowColor = accentColor; ctx.shadowBlur = 10 * a;
        ctx.fill(); ctx.shadowBlur = 0;
      }
      ctx.globalCompositeOperation = 'source-over';
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.FireflyMeadow = FireflyMeadow;
})();
