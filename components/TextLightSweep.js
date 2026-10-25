// 文字流光扫描 — 多层辉光文字 + 横向扫描光带 + 粒子飞溅
function TextLightSweep({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });

  React.useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    // 尺寸守卫
    if (w <= 0 || h <= 0) return;
    const m = mouseRef.current;

    // 拖尾淡出
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    const text = state.text;
    const fontSize = Math.min(72, w * 0.12);
    const cx = w / 2;
    const cy = h / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;

    // 多层辉光文字（外 → 内）
    const glowLayers = [
      { blur: 30, alpha: 0.25, offset: 0 },
      { blur: 15, alpha: 0.4, offset: 0 },
      { blur: 6, alpha: 0.6, offset: 0 },
    ];
    for (let i = 0; i < glowLayers.length; i++) {
      const layer = glowLayers[i];
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = layer.blur;
      ctx.fillStyle = hexToRgba(accentColor, layer.alpha);
      ctx.fillText(text, cx, cy + layer.offset);
    }
    ctx.shadowBlur = 0;

    // 核心文字（最亮）
    const coreGrad = ctx.createLinearGradient(cx - fontSize * 2, cy, cx + fontSize * 2, cy);
    coreGrad.addColorStop(0, hexToRgba(accentColor, 0.9));
    coreGrad.addColorStop(0.5, "rgba(255,255,255,0.95)");
    coreGrad.addColorStop(1, hexToRgba(accentColor, 0.9));
    ctx.fillStyle = coreGrad;
    ctx.fillText(text, cx, cy);

    // 横向扫描光带
    const sweepX = ((time * 0.08 * state.speedMul) % (w + 200)) - 100;
    const sweepW = fontSize * 1.5;
    ctx.save();
    ctx.beginPath();
    ctx.rect(sweepX - sweepW / 2, cy - fontSize, sweepW, fontSize * 2);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    const sweepGrad = ctx.createLinearGradient(sweepX - sweepW / 2, 0, sweepX + sweepW / 2, 0);
    sweepGrad.addColorStop(0, "rgba(255,255,255,0)");
    sweepGrad.addColorStop(0.5, "rgba(255,255,255,0.85)");
    sweepGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sweepGrad;
    ctx.fillText(text, cx, cy);
    // 彩色色散边缘
    const hueShift = Math.sin(time * 1e-3) * 30;
    ctx.fillStyle = `hsla(${state.baseHue + hueShift}, 100%, 75%, 0.5)`;
    ctx.globalAlpha = 0.5;
    ctx.fillText(text, cx - 2, cy - 1);
    ctx.fillStyle = `hsla(${state.baseHue - hueShift + 60}, 100%, 70%, 0.5)`;
    ctx.fillText(text, cx + 2, cy + 1);
    ctx.restore();

    // 扫描光带粒子飞溅
    if (state.sweepParticles && state.sweepParticles.length > 0) {
      ctx.globalCompositeOperation = "lighter";
      const PSC = window.ParticleSpriteCache;
      for (let i = 0; i < state.sweepParticles.length; i++) {
        const p = state.sweepParticles[i];
        p.life -= 0.02;
        if (p.life <= 0) {
          p.x = sweepX + (Math.random() - 0.5) * sweepW * 0.5;
          p.y = cy + (Math.random() - 0.5) * fontSize * 1.2;
          p.vx = (Math.random() - 0.5) * 3;
          p.vy = (Math.random() - 0.5) * 2.5;
          p.life = 0.6 + Math.random() * 0.4;
          p.size = 1 + Math.random() * 2;
          continue;
        }
        p.vy += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        const pColor = `hsla(${state.baseHue + Math.random() * 40 - 20}, 100%, 80%, ${p.life})`;
        if (PSC) {
          const s = PSC.get(p.size * 2, pColor, true);
          ctx.drawImage(s, p.x - s.width / 2, p.y - s.height / 2);
        } else {
          ctx.fillStyle = pColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();

    // 鼠标交互：悬停时辉光增强
    if (m.active) {
      const dist = Math.sqrt((m.x - cx) ** 2 + (m.y - cy) ** 2);
      if (dist < fontSize * 2) {
        const intensity = 1 - dist / (fontSize * 2);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const mouseGlow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 60);
        mouseGlow.addColorStop(0, hexToRgba(accentColor, 0.3 * intensity));
        mouseGlow.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }, []);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const sweepParticles = [];
    const pCount = motionLevel === "intense" ? 40 : motionLevel === "subtle" ? 15 : 25;
    for (let i = 0; i < pCount; i++) {
      sweepParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0, vy: 0,
        life: Math.random(),
        size: 1 + Math.random() * 2
      });
    }
    return {
      text: "LUMINOUS",
      baseHue,
      bgFade: "rgba(5, 8, 20, 0.15)",
      speedMul: motionLevel === "intense" ? 1.4 : motionLevel === "subtle" ? 0.5 : 1,
      sweepParticles,
    };
  }, [accentColor, motionLevel]);

  useCanvasEffect(canvasRef, { draw, setup, active: true });
  return /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, #081020 0%, #03050f 70%)"
  } }), /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { display: "block", position: "absolute", inset: 0 } }));
}

window.TextLightSweep = TextLightSweep;
