// 3D 视差场景 — 多层山峦/星空/月亮，鼠标视差 + 昼夜渐变
function ParallaxScene({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  const smoothRef = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  const layerCount = motionLevel === "intense" ? 6 : motionLevel === "subtle" ? 4 : 5;
  const speedMul = motionLevel === "intense" ? 1.3 : motionLevel === "subtle" ? 0.5 : 1;

  function generateMountainProfile(width, numPeaks, heightRatio, baseY) {
    const points = [];
    const step = width / (numPeaks * 2);
    for (let i = 0; i <= numPeaks * 2 + 1; i++) {
      const x = i * step;
      // 多层正弦叠加
      const noise =
        Math.sin(i * 0.8) * 0.4 +
        Math.sin(i * 1.7 + 1) * 0.25 +
        Math.sin(i * 3.2 + 2) * 0.15 +
        0.6;
      const y = baseY - noise * heightRatio * baseY;
      points.push({ x, y });
    }
    return points;
  }

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mActive = mouseRef.current.active;

    // 平滑鼠标
    const targetX = mActive ? (mx - w / 2) / w * 2 : Math.sin(time * 3e-4 * state.speedMul) * 30;
    const targetY = mActive ? (my - h / 2) / h * 2 * 0.3 : Math.cos(time * 2e-4 * state.speedMul) * 10;
    smoothRef.current.x += (targetX - smoothRef.current.x) * 0.06;
    smoothRef.current.y += (targetY - smoothRef.current.y) * 0.06;
    const offX = smoothRef.current.x;
    const offY = smoothRef.current.y;

    // 昼夜色相位
    const cycleHue = state.baseHue + Math.sin(time * 5e-5 * state.speedMul) * 30;

    // 天空渐变
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, `hsl(${cycleHue + 40}, 70%, 15%)`);
    skyGrad.addColorStop(0.4, `hsl(${cycleHue + 20}, 65%, 12%)`);
    skyGrad.addColorStop(0.7, `hsl(${cycleHue}, 60%, 10%)`);
    skyGrad.addColorStop(1, `hsl(${cycleHue - 20}, 50%, 8%)`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 星星
    const stars = state.stars;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 1e-3 + s.phase));
      ctx.fillStyle = `hsla(${cycleHue + 60}, 80%, 90%, ${tw * s.alpha})`;
      const sx = s.x + offX * s.layer;
      const sy = s.y + offY * s.layer * 0.3;
      ctx.fillRect(sx, sy, s.size, s.size);
    }

    // 月亮
    const moonX = w * 0.8 + offX * 0.03;
    const moonY = h * 0.2 + offY * 0.03;
    const moonR = Math.min(w, h) * 0.08;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 4);
    moonGlow.addColorStop(0, `hsla(${cycleHue + 20}, 60%, 85%, 0.3)`);
    moonGlow.addColorStop(0.3, `hsla(${cycleHue + 30}, 50%, 70%, 0.1)`);
    moonGlow.addColorStop(1, "transparent");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsl(${cycleHue + 30}, 50%, 85%)`;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    // 多层山
    const layers = state.mountains;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const offsetX = offX * layer.factor;
      const offsetY = offY * layer.factor * 0.3;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.beginPath();
      ctx.moveTo(-50, h);
      const pts = layer.points;
      ctx.lineTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length; j++) {
        ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.lineTo(w + 50, h);
      ctx.closePath();

      const mGrad = ctx.createLinearGradient(0, layer.baseY * 0.5, 0, h);
      mGrad.addColorStop(0, layer.colorTop);
      mGrad.addColorStop(1, layer.colorBottom);
      ctx.fillStyle = mGrad;
      ctx.fill();
      ctx.restore();
    }

    // 雾霭层
    const fogGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    fogGrad.addColorStop(0, "transparent");
    fogGrad.addColorStop(0.5, `hsla(${cycleHue + 10}, 40%, 50%, 0.08)`);
    fogGrad.addColorStop(1, `hsla(${cycleHue + 20}, 30%, 40%, 0.15)`);
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, w, h);
  }, [layerCount, speedMul]);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;

    // 星星
    const starCount = motionLevel === "intense" ? 150 : motionLevel === "subtle" ? 60 : 100;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const layer = 0.02 + Math.random() * 0.1;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.6,
        size: Math.random() < 0.8 ? 1 : 1.5,
        alpha: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        layer
      });
    }

    // 多层山
    const mountains = [];
    for (let i = 0; i < layerCount; i++) {
      const t = i / (layerCount - 1); // 0 = 最远, 1 = 最近
      const baseY = h * (0.55 + t * 0.3);
      const heightRatio = 0.15 + t * 0.2;
      const peaks = 3 + Math.floor(t * 5);
      const hue = baseHue + 10 - t * 30;
      const sat = 30 + t * 20;
      const lightFar = 15 + t * 10;
      const lightNear = 8 + t * 7;
      const points = generateMountainProfile(w + 100, peaks, heightRatio * baseY, baseY);
      mountains.push({
        points,
        baseY,
        factor: 0.1 + t * 0.8,
        colorTop: `hsl(${hue}, ${sat}%, ${lightFar}%)`,
        colorBottom: `hsl(${hue - 10}, ${sat - 5}%, ${lightNear}%)`
      });
    }
    // 最近一层加树木（简化：山顶上的尖刺）
    // 此处略，山体层数已足够

    return {
      stars,
      mountains,
      baseHue,
      speedMul
    };
  }, [accentColor, layerCount, speedMul, motionLevel]);

  useCanvasEffect(canvasRef, { draw, setup, active: true });

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0 } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.ParallaxScene = ParallaxScene;
