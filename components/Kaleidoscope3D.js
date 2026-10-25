// 3D 万花筒 — 六重对称反射 + 旋转几何体 + 色彩脉冲
function Kaleidoscope3D({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  const baseShapes = motionLevel === "intense" ? 60 : motionLevel === "subtle" ? 20 : 40;
  const shapeCount = PerfMonitor.getParticleCount(baseShapes);
  const speedMul = motionLevel === "intense" ? 1.4 : motionLevel === "subtle" ? 0.5 : 1;

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mActive = mouseRef.current.active;

    // 清屏（纯黑背景）
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) * 0.48;

    const mouseAngle = mActive ? Math.atan2(my - cy, mx - cx) : 0;
    const mouseDist = mActive ? Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2) / maxR : 0;

    const segments = 6; // 六重对称
    const segAngle = (Math.PI * 2) / segments;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // 绘制每一段
    for (let s = 0; s < segments; s++) {
      const baseAngle = s * segAngle + time * 0.0001 * state.speedMul + mouseAngle * 0.1;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(baseAngle);

      // 在这一段里绘制所有几何体（从中心向外径向分布）
      const shapes = state.shapes;
      for (let i = 0; i < shapes.length; i++) {
        const sh = shapes[i];
        const t = sh.phase + time * sh.speed * state.speedMul;
        const r = (sh.radius + Math.sin(t) * sh.wobble) * maxR;
        const angleOffset = Math.sin(t * 0.7 + sh.phase * 3) * segAngle * 0.3;

        // 形状位置
        const x = Math.cos(angleOffset) * r;
        const y = Math.sin(angleOffset) * r;
        const scale = sh.size * (0.7 + 0.3 * Math.sin(t * 1.3));
        const alpha = 0.5 + 0.4 * Math.sin(t + sh.phase * 2);
        const hue = state.baseHue + sh.hueShift + Math.sin(t * 0.5) * 20;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * sh.rotSpeed);
        ctx.globalAlpha = alpha;

        const color = `hsla(${hue}, 85%, 65%, 0.8)`;
        ctx.fillStyle = color;
        ctx.strokeStyle = `hsla(${hue + 20}, 95%, 80%, 0.6)`;
        ctx.lineWidth = 1;

        // 根据类型绘制不同形状
        if (sh.type === 0) {
          // 三角形
          ctx.beginPath();
          ctx.moveTo(0, -scale);
          ctx.lineTo(scale * 0.866, scale * 0.5);
          ctx.lineTo(-scale * 0.866, scale * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (sh.type === 1) {
          // 菱形
          ctx.beginPath();
          ctx.moveTo(0, -scale);
          ctx.lineTo(scale * 0.6, 0);
          ctx.lineTo(0, scale);
          ctx.lineTo(-scale * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (sh.type === 2) {
          // 六边形
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = k * Math.PI / 3;
            const px = Math.cos(a) * scale;
            const py = Math.sin(a) * scale;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // 星形
          ctx.beginPath();
          for (let k = 0; k < 10; k++) {
            const a = k * Math.PI / 5 - Math.PI / 2;
            const sr = k % 2 === 0 ? scale : scale * 0.4;
            const px = Math.cos(a) * sr;
            const py = Math.sin(a) * sr;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    }

    ctx.restore();

    // 中心光晕
    const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.15);
    centerGlow.addColorStop(0, `hsla(${state.baseHue + 30}, 90%, 70%, 0.4)`);
    centerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 外圈装饰线
    ctx.save();
    ctx.strokeStyle = `hsla(${state.baseHue}, 70%, 50%, 0.2)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const angle = i * segAngle + time * 0.0001 * state.speedMul;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * maxR * 0.1, cy + Math.sin(angle) * maxR * 0.1);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
    }
    // 外圆环
    ctx.strokeStyle = `hsla(${state.baseHue + 20}, 80%, 60%, 0.3)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }, [shapeCount, speedMul]);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const shapes = [];
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        radius: 0.1 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: (0.0003 + Math.random() * 0.0008) * (Math.random() < 0.5 ? 1 : -1),
        wobble: 0.05 + Math.random() * 0.1,
        size: 8 + Math.random() * 25,
        rotSpeed: (Math.random() - 0.5) * 0.002,
        hueShift: Math.random() * 80 - 40,
        type: Math.floor(Math.random() * 4)
      });
    }
    return {
      shapes,
      baseHue,
      speedMul,
      bgFade: "rgba(3, 5, 15, 0.12)"
    };
  }, [accentColor, shapeCount, speedMul]);

  useCanvasEffect(canvasRef, { draw, setup, active: true });

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0 } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.Kaleidoscope3D = Kaleidoscope3D;
