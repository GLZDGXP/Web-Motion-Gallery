// 逐字立体入场 — 字符 3D 翻转/缩放依次入场，带阴影、辉光和景深
function TextStereoEntry({ accentColor = "#ff6b9d", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [replay, setReplay] = React.useState(0);
  const stateRef = React.useRef(null);

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    stateRef.current = state;
    if (w <= 0 || h <= 0) return;

    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    const text = state.text;
    const chars = text.split("");
    const fontSize = Math.min(56, w / (chars.length * 0.9));
    const cx = w / 2;
    const cy = h / 2;
    const totalW = chars.length * fontSize * 0.7;
    const startX = cx - totalW / 2 + fontSize * 0.35;

    const PSC = window.ParticleSpriteCache;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const x = startX + i * fontSize * 0.7;
      const delay = i * 0.12 * state.speedMul;
      const elapsed = Math.max(0, state.elapsed - delay);
      const duration = 0.8;
      const t = Math.min(1, elapsed / duration);

      // 入场缓动：弹性回弹
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const bounce = Math.sin(t * Math.PI * 3) * (1 - t) * 0.15;

      // 3D 效果：缩放 + 旋转 + Y轴位移
      const scale = 0.3 + eased * 0.7 + bounce;
      const rotY = (1 - eased) * Math.PI * 0.6;
      const yOffset = (1 - eased) * -40 - bounce * 20;
      const alpha = Math.min(1, eased * 1.5);

      if (alpha <= 0) continue;

      ctx.save();
      ctx.translate(x, cy + yOffset);
      ctx.scale(scale, scale);

      // 背面（暗面）
      ctx.globalAlpha = alpha * 0.3;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillText(ch, 2, 3);

      // 侧面渐变（模拟立体厚度）
      const grad = ctx.createLinearGradient(-fontSize * 0.3, 0, fontSize * 0.3, 0);
      const baseHue = state.baseHue;
      grad.addColorStop(0, `hsl(${baseHue - 15}, 80%, 35%)`);
      grad.addColorStop(0.5, `hsl(${baseHue}, 90%, 60%)`);
      grad.addColorStop(1, `hsl(${baseHue + 15}, 80%, 40%)`);

      // 辉光
      ctx.globalAlpha = alpha * 0.5;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;
      ctx.fillStyle = grad;
      ctx.fillText(ch, 0, 0);
      ctx.shadowBlur = 0;

      // 核心文字
      ctx.globalAlpha = alpha;
      const coreGrad = ctx.createLinearGradient(0, -fontSize / 2, 0, fontSize / 2);
      coreGrad.addColorStop(0, "rgba(255,255,255,0.95)");
      coreGrad.addColorStop(0.5, accentColor);
      coreGrad.addColorStop(1, `hsl(${baseHue + 10}, 80%, 40%)`);
      ctx.fillStyle = coreGrad;
      ctx.fillText(ch, 0, 0);

      // 顶部高光条
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alpha * 0.4;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(ch, 0, -2);

      ctx.restore();

      // 入场粒子（每个字符落地时飞溅）
      if (t > 0.7 && t < 1 && state.landParticles) {
        const particleAlpha = (t - 0.7) / 0.3;
        ctx.globalCompositeOperation = "lighter";
        for (let j = 0; j < 3; j++) {
          const px = x + (Math.random() - 0.5) * fontSize * 0.5;
          const py = cy + fontSize * 0.2 + Math.random() * 20;
          const ps = 1 + Math.random() * 1.5;
          const pc = `hsla(${baseHue + 20}, 100%, 80%, ${particleAlpha * 0.6})`;
          if (PSC) {
            const s = PSC.get(ps * 2, pc, true);
            ctx.drawImage(s, px - s.width / 2, py - s.height / 2);
          } else {
            ctx.fillStyle = pc;
            ctx.beginPath();
            ctx.arc(px, py, ps, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 底部装饰线
    const lineAlpha = Math.min(1, state.elapsed / (chars.length * 0.12 * state.speedMul + 0.5));
    if (lineAlpha > 0) {
      ctx.globalCompositeOperation = "lighter";
      const lineGrad = ctx.createLinearGradient(cx - totalW * 0.6, 0, cx + totalW * 0.6, 0);
      lineGrad.addColorStop(0, "transparent");
      lineGrad.addColorStop(0.5, hexToRgba(accentColor, 0.5 * lineAlpha));
      lineGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - totalW * 0.6, cy + fontSize * 0.8);
      ctx.lineTo(cx + totalW * 0.6, cy + fontSize * 0.8);
      ctx.stroke();
    }

    ctx.restore();

    // 更新计时器
    state.elapsed += delta / 1000;
    if (state.elapsed > chars.length * 0.12 * state.speedMul + 2.5) {
      state.elapsed = -0.5; // 循环重放（0.5s 停顿后重新开始）
    }
  }, []);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 330;
    return {
      text: "AURORA",
      baseHue,
      elapsed: -0.2,
      bgFade: "rgba(10, 5, 15, 0.12)",
      speedMul: motionLevel === "intense" ? 0.7 : motionLevel === "subtle" ? 1.6 : 1,
      landParticles: motionLevel !== "subtle",
    };
  }, [accentColor, motionLevel]);

  const handleClick = () => {
    const state = stateRef.current;
    if (state) state.elapsed = -0.2;
  };

  useCanvasEffect(canvasRef, { draw, setup, active: true });
  return /* @__PURE__ */ React.createElement("div", { ref: containerRef, onClick: handleClick, style: { position: "absolute", inset: 0, overflow: "hidden", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center top, #1a0a20 0%, #080310 60%, #040108 100%)"
  } }), /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { display: "block", position: "absolute", inset: 0 } }));
}

window.TextStereoEntry = TextStereoEntry;
