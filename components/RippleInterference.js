(function () {
  // RippleInterference · 涟漪干涉：双源同心波叠加产生干涉条纹（离屏低分辨率 + 拉伸，规避 DPR 错位）
  function RippleInterference({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const setup = React.useCallback((ctx, w, h) => {
      const off = document.createElement('canvas');
      const RES = motionLevel === 'subtle' ? 120 : motionLevel === 'intense' ? 220 : 170;
      off.width = RES; off.height = Math.max(1, Math.round(RES * 0.6));
      return { off, octx: off.getContext('2d'), ow: off.width, oh: off.height };
    }, [motionLevel]);
    const toRGB = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      ctx.fillStyle = '#04060e'; ctx.fillRect(0, 0, w, h);
      const sp = reduced ? 0.15 : 1;
      const c = toRGB(accentColor);
      const img = s.octx.createImageData(s.ow, s.oh);
      const d = img.data;
      const srcs = [[s.ow * 0.35, s.oh * 0.5], [s.ow * 0.65, s.oh * 0.5]];
      for (let y = 0; y < s.oh; y++) {
        for (let x = 0; x < s.ow; x++) {
          let v = 0;
          for (let k = 0; k < srcs.length; k++) {
            const dist = Math.hypot(x - srcs[k][0], y - srcs[k][1]);
            v += Math.sin(dist * 0.08 - time * 0.004 * sp);
          }
          v = (v / 2) * 0.5 + 0.5;
          const idx = (y * s.ow + x) * 4;
          d[idx] = c[0] * v; d[idx + 1] = c[1] * v; d[idx + 2] = c[2] * v; d[idx + 3] = 255 * v;
        }
      }
      s.octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(s.off, 0, 0, w, h);
    }, [accentColor, reduced]);
    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block' } });
  }
  window.RippleInterference = RippleInterference;
})();
