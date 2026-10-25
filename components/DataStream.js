(function () {
  // DataStream · 数据瀑布：竖直字符流如数字雨，头部高亮
  const GLYPHS = '01ｱｲｳｴｵｶｷｸ#$%&*=+<>{}[]';
  function DataStream({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const fs = motionLevel === 'subtle' ? 18 : 14;
      const cols = Math.ceil(w / fs);
      const drops = [];
      for (let i = 0; i < cols; i++) drops.push(Math.random() * h);
      return { fs, cols, drops };
    }, [motionLevel]);
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = 'rgba(2,6,4,0.18)';
      ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.12 : 1;
      ctx.font = s.fs + 'px monospace';
      ctx.textAlign = 'center';
      for (let c = 0; c < s.cols; c++) {
        const x = c * s.fs + s.fs / 2;
        const y = s.drops[c];
        const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        ctx.fillStyle = window.hexToRgba(accentColor, 0.9);
        ctx.fillText(g, x, y);
        ctx.fillStyle = window.hexToRgba(accentColor, 0.25);
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - s.fs);
        s.drops[c] += s.fs * (0.4 + Math.random() * 0.5) * sp;
        if (s.drops[c] > h && Math.random() > 0.975) s.drops[c] = -Math.random() * h * 0.3;
      }
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.DataStream = DataStream;
})();
