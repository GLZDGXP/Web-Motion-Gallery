// 像素数字时钟 — LED 点阵 + 翻页粒子过渡
function PixelClock({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const pixelSize = motionLevel === "intense" ? 8 : motionLevel === "subtle" ? 5 : 6;
  const cols = 5;
  const rows = 7;
  const speedMul = motionLevel === "intense" ? 1.3 : motionLevel === "subtle" ? 0.6 : 1;

  // 5x7 点阵字体（0-9）
  const FONT = [
    [1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1], // 0
    [0,0,1,0,0, 0,1,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0], // 1
    [1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1], // 2
    [1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,1], // 3
    [1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 0,0,0,0,1], // 4
    [1,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,1], // 5
    [1,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1], // 6
    [1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 0,0,0,0,1, 0,0,0,0,1, 0,0,0,0,1, 0,0,0,0,1], // 7
    [1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1], // 8
    [1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,1], // 9
  ];

   const draw = React.useCallback((ctx, w, h, time, delta, state) => {
     // 尺寸守卫
     if (w <= 0 || h <= 0) return;
     const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const ss = now.getSeconds();
    const ms = now.getMilliseconds();
    const timeStr = [
      String(Math.floor(hh / 10)),
      String(hh % 10),
      ':',
      String(Math.floor(mm / 10)),
      String(mm % 10),
      ':',
      String(Math.floor(ss / 10)),
      String(ss % 10)
    ];

    // 检查数字变化（秒个位每秒变，秒十位每10秒变，分个位每分变...）
    for (let i = 0; i < timeStr.length; i++) {
      if (timeStr[i] !== state.lastDigits[i] && timeStr[i] !== ':') {
        // 触发过渡
        state.transitions[i] = {
          oldDigit: parseInt(state.lastDigits[i]),
          newDigit: parseInt(timeStr[i]),
          startTime: time,
          duration: 800 / state.speedMul
        };
      }
      state.lastDigits[i] = timeStr[i];
    }

    // 清屏
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    // 计算整体布局
    const digitW = cols * state.pixelSize;
    const digitH = rows * state.pixelSize;
    const colonW = state.pixelSize * 1.5;
    const gap = state.pixelSize * 1.5;
    const totalW = digitW * 6 + colonW * 2 + gap * 7;
    const startX = (w - totalW) / 2;
    const startY = (h - digitH) / 2;

    const PSC = window.ParticleSpriteCache;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    let x = startX;
    for (let i = 0; i < timeStr.length; i++) {
      const ch = timeStr[i];
      const trans = state.transitions[i];
      const w_each = ch === ':' ? colonW : digitW;

      if (ch === ':') {
        // 冒号闪烁
        const blink = 0.6 + 0.4 * Math.sin(time * 0.01 * state.speedMul);
        const cx = x + colonW / 2;
        const cy1 = startY + digitH * 0.3;
        const cy2 = startY + digitH * 0.7;
        const color = `hsla(${state.baseHue}, 90%, 70%, ${blink})`;
        if (PSC) {
          const s = PSC.get(state.pixelSize * 1.2, color, true);
          ctx.drawImage(s, cx - s.width / 2, cy1 - s.height / 2);
          ctx.drawImage(s, cx - s.width / 2, cy2 - s.height / 2);
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(cx, cy1, state.pixelSize * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, cy2, state.pixelSize * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        x += w_each + gap;
        continue;
      }

      const digit = parseInt(ch);
      const font = FONT[digit];
      const ps = state.pixelSize;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (!font[idx]) {
            // 未点亮的像素（暗淡底）
            const px = x + c * ps;
            const py = startY + r * ps;
            ctx.fillStyle = `hsla(${state.baseHue}, 40%, 30%, 0.15)`;
            ctx.fillRect(px + 0.5, py + 0.5, ps - 1, ps - 1);
            continue;
          }

          let px = x + c * ps;
          let py = startY + r * ps;
          let alpha = 1;

          // 过渡动画：旧数字像素上升消散，新数字像素从下方浮入
          if (trans) {
            const t = Math.min(1, (time - trans.startTime) / trans.duration);
            const oldFont = FONT[trans.oldDigit];
            const newFont = FONT[trans.newDigit];
            const wasOn = oldFont[idx];
            const isOn = newFont[idx];

            if (wasOn && !isOn) {
              // 正在消失的像素：向上飘
              alpha = 1 - t;
              py = startY + r * ps - t * t * 60 * state.speedMul;
            } else if (!wasOn && isOn) {
              // 正在出现的像素：从下方浮上来
              alpha = t;
              py = startY + r * ps + (1 - t) * (1 - t) * 60 * state.speedMul;
            }
            // wasOn && isOn 的像素保持原位
          }

          const color = `hsla(${state.baseHue}, 95%, 72%, ${alpha * 0.9})`;
          if (PSC) {
            const s = PSC.get(ps * 1.2, color, true);
            ctx.drawImage(s, px + ps / 2 - s.width / 2, py + ps / 2 - s.height / 2);
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(px + 1, py + 1, ps - 2, ps - 2);
          }
        }
      }
      x += w_each + gap;
    }

    ctx.restore();

    // 外发光
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glowGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, totalW * 0.8);
    glowGrad.addColorStop(0, `hsla(${state.baseHue}, 80%, 60%, 0.12)`);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }, [pixelSize, speedMul]);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    return {
       lastDigits: ['0', '0', ':', '0', '0', ':', '0', '0'],
      transitions: {},
      baseHue,
      pixelSize,
      speedMul,
      bgFade: "rgba(2, 4, 10, 0.15)"
    };
  }, [accentColor, pixelSize, speedMul]);

  useCanvasEffect(canvasRef, { draw, setup, active: true });

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0 } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.PixelClock = PixelClock;
