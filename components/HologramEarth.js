// 全息地球 HologramEarth · 纯 Canvas 2D 实现（稳健，无 WebGL 依赖）
// 旋转经纬球 + 大气辉光 + 城市灯光点 + 鼠标/触摸拖拽旋转
(function () {
  function HologramEarth({ accentColor = '#00e5ff', motionLevel = 'rich' }) {
    const ref = React.useRef(null);
    const reduced = React.useMemo(() => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    const st = React.useRef({ rotY: 0, rotX: -0.35, tRotY: 0, tRotX: -0.35, drag: false, lx: 0, ly: 0 });

    React.useEffect(() => {
      const cv = ref.current; if (!cv) return;
      const getP = (e) => (e.touches && e.touches[0]) ? e.touches[0] : e;
      const onD = (e) => { const p = getP(e); st.current.drag = true; st.current.lx = p.clientX; st.current.ly = p.clientY; };
      const onU = () => { st.current.drag = false; };
      const onM = (e) => {
        if (!st.current.drag) return;
        const p = getP(e);
        const dx = p.clientX - st.current.lx, dy = p.clientY - st.current.ly;
        st.current.lx = p.clientX; st.current.ly = p.clientY;
        st.current.tRotY += dx * 0.01;
        st.current.tRotX = Math.max(-1.4, Math.min(1.4, st.current.tRotX + dy * 0.01));
      };
      cv.addEventListener('mousedown', onD);
      window.addEventListener('mouseup', onU);
      window.addEventListener('mousemove', onM);
      cv.addEventListener('touchstart', onD, { passive: true });
      window.addEventListener('touchend', onU);
      cv.addEventListener('touchmove', onM, { passive: true });
      return () => {
        cv.removeEventListener('mousedown', onD);
        window.removeEventListener('mouseup', onU);
        window.removeEventListener('mousemove', onM);
        cv.removeEventListener('touchstart', onD);
        window.removeEventListener('touchend', onU);
        cv.removeEventListener('touchmove', onM);
      };
    }, []);

    const setup = React.useCallback((ctx, w, h) => {
      const stars = [];
      for (let i = 0; i < 70; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, s: Math.random() * 1.5 + 0.3, tw: Math.random() * 6.28 });
      const cities = [];
      for (let i = 0; i < 140; i++) cities.push({ lon: Math.random() * 6.283, lat: Math.asin(Math.random() * 2 - 1), br: Math.random(), tw: Math.random() * 6.28 });
      return { stars, cities };
    }, []);

    const draw = React.useCallback((ctx, w, h, time, dt, s) => {
      const sp = reduced ? 0.08 : 1;
      const o = st.current;
      if (!o.drag) o.tRotY += 0.0016 * sp;
      o.rotY += (o.tRotY - o.rotY) * 0.1;
      o.rotX += (o.tRotX - o.rotX) * 0.1;

      ctx.fillStyle = '#050a16';
      ctx.fillRect(0, 0, w, h);
      for (const st2 of s.stars) {
        const a = 0.3 + 0.7 * Math.sin(time * 0.002 + st2.tw);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(st2.x, st2.y, st2.s, 0, 6.283); ctx.fill();
      }

      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.34;
      const at = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.35);
      at.addColorStop(0, window.hexToRgba(accentColor, 0.28));
      at.addColorStop(1, window.hexToRgba(accentColor, 0));
      ctx.fillStyle = at; ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, 6.283); ctx.fill();

      const cosY = Math.cos(o.rotY), sinY = Math.sin(o.rotY);
      const cosX = Math.cos(o.rotX), sinX = Math.sin(o.rotX);
      const proj = (lat, lon) => {
        const x = Math.cos(lat) * Math.cos(lon);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.sin(lon);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        return [cx + x1 * R, cy - y2 * R, z2];
      };

      const sg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      sg.addColorStop(0, window.hexToRgba(accentColor, 0.22));
      sg.addColorStop(1, window.hexToRgba(accentColor, 0.04));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();

      ctx.strokeStyle = window.hexToRgba(accentColor, 0.22);
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let first = true;
        for (let lon = 0; lon <= 6.283; lon += 0.2) {
          const [px, py, dz] = proj(lat * Math.PI / 180, lon);
          if (dz > 0) { first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py); } else first = true;
        }
        ctx.stroke();
      }
      for (let lon = 0; lon < 6.283; lon += 6.283 / 12) {
        ctx.beginPath(); let first = true;
        for (let lat = -90; lat <= 90; lat += 6) {
          const [px, py, dz] = proj(lat * Math.PI / 180, lon);
          if (dz > 0) { first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py); } else first = true;
        }
        ctx.stroke();
      }

      for (const c of s.cities) {
        const [px, py, dz] = proj(c.lat, c.lon);
        if (dz <= 0) continue;
        const a = (0.5 + 0.5 * Math.sin(time * 0.002 + c.tw)) * (0.6 + c.br * 0.4);
        ctx.fillStyle = `rgba(255,224,150,${a})`;
        ctx.beginPath(); ctx.arc(px, py, 1.4, 0, 6.283); ctx.fill();
      }
    }, [accentColor, reduced]);

    useCanvasEffect(ref, { draw, setup, active: true });
    return React.createElement('canvas', { ref, style: { width: '100%', height: '100%', display: 'block', touchAction: 'none' } });
  }
  window.HologramEarth = HologramEarth;
})();
