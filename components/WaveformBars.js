// 频谱波形柱状图 — 模拟音频可视化，节拍律动，倒影辉光
function WaveformBars({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  const baseBars = motionLevel === "intense" ? 64 : motionLevel === "subtle" ? 32 : 48;
  const barCount = Math.min(80, PerfMonitor.getParticleCount(baseBars));
  const speedMul = motionLevel === "intense" ? 1.3 : motionLevel === "subtle" ? 0.55 : 1;

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mActive = mouseRef.current.active;

    // 清屏
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    const bars = state.bars;
    const beatPeriod = 600 / state.speedMul; // 约 100 BPM
    const beatPhase = (time % beatPeriod) / beatPeriod;
    const beatPulse = Math.pow(Math.max(0, 1 - beatPhase), 3); // 节拍脉冲

    const mxFreq = mActive ? mx / w : 0.5;
    const mxIntensity = mActive ? 1 - my / h : 0.7;

    // 更新柱子
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const freq = i / bars.length; // 0=低频 1=高频
      // 目标高度：多层正弦 + 噪声 + 节拍脉冲（低频更明显）
      let target =
        0.3 +
        0.2 * Math.sin(time * 0.002 * state.speedMul + bar.phase) +
        0.15 * Math.sin(time * 0.0043 * state.speedMul + bar.phase * 2.3) +
        0.1 * Math.sin(time * 0.0071 * state.speedMul + bar.phase * 0.7);
      // 节拍脉冲：低频强，高频弱
      const lowFreqBoost = Math.max(0, 1 - freq * 2) * beatPulse * 0.6;
      target += lowFreqBoost;
      // 随机噪声
      target += (Math.random() - 0.5) * 0.08;
      // 鼠标频段增益
      const freqBoost = Math.max(0, 1 - Math.abs(freq - mxFreq) * 3) * 0.4 * mxIntensity;
      target += freqBoost;
      target = Math.max(0.05, Math.min(1, target * (0.5 + mxIntensity * 0.8)));

      // 弹簧缓动
      bar.amp += (target - bar.amp) * 0.15;
      // 峰值回落
      bar.peak = Math.max(bar.peak * 0.97, bar.amp);
    }

    const centerY = h * 0.55;
    const maxH = h * 0.4;
    const barW = w / bars.length * 0.7;
    const gap = w / bars.length * 0.3;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // 绘制柱子 + 倒影
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const x = i * (barW + gap) + gap / 2;
      const hue = state.baseHue + (i / bars.length) * 80 - 40;

      const barH = bar.amp * maxH;
      const topY = centerY - barH;
      const bottomY = centerY;

      // 柱子渐变
      const grad = ctx.createLinearGradient(0, topY, 0, bottomY);
      grad.addColorStop(0, `hsla(${hue}, 90%, 75%, 0.9)`);
      grad.addColorStop(1, `hsla(${hue - 10}, 85%, 55%, 0.7)`);

      // 辉光外层
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.2)`;
      roundRect(ctx, x - 1, topY - 1, barW + 2, barH + 1, barW / 2);
      ctx.fill();

      // 主柱
      ctx.fillStyle = grad;
      roundRect(ctx, x, topY, barW, barH, barW / 2);
      ctx.fill();

      // 峰值指示器
      const peakY = centerY - bar.peak * maxH;
      ctx.fillStyle = `hsla(${hue + 20}, 100%, 85%, 0.8)`;
      roundRect(ctx, x, peakY, barW, 2, 1);
      ctx.fill();

      // 倒影（下方）
      const reflectH = barH * 0.5;
      const reflectGrad = ctx.createLinearGradient(0, bottomY, 0, bottomY + reflectH);
      reflectGrad.addColorStop(0, `hsla(${hue}, 85%, 60%, 0.4)`);
      reflectGrad.addColorStop(1, `hsla(${hue}, 80%, 50%, 0)`);
      ctx.fillStyle = reflectGrad;
      roundRect(ctx, x, bottomY, barW, reflectH, barW / 2);
      ctx.fill();
    }

    // 中心分隔线
    ctx.strokeStyle = `hsla(${state.baseHue + 40}, 60%, 50%, 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    ctx.restore();

    // 底部装饰线
    const glowGrad = ctx.createRadialGradient(w / 2, centerY, 0, w / 2, centerY, w / 2);
    glowGrad.addColorStop(0, `hsla(${state.baseHue}, 80%, 60%, 0.15)`);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, centerY - maxH * 0.5, w, maxH);
  }, [barCount, speedMul]);

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const bars = [];
    for (let i = 0; i < barCount; i++) {
      bars.push({
        amp: 0.3,
        peak: 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }
    return {
      bars,
      baseHue,
      speedMul,
      bgFade: "rgba(3, 5, 15, 0.2)"
    };
  }, [accentColor, barCount, speedMul]);

  useCanvasEffect(canvasRef, { draw, setup, active: true });

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0 } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.WaveformBars = WaveformBars;
