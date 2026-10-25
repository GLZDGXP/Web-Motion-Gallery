// 粒子形态文字 — 聚合/消散成文字，循环切换词语，鼠标排斥
function ParticleTextMorph({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  const baseCount = motionLevel === "intense" ? 1000 : motionLevel === "subtle" ? 400 : 700;
  const particleCount = PerfMonitor.getParticleCount(baseCount);
  const speedMul = motionLevel === "intense" ? 1.3 : motionLevel === "subtle" ? 0.6 : 1;
  const words = ["CREATE", "DESIGN", "CODE", "MOTION", "DREAM"];

  const draw = React.useCallback((ctx, w, h, time, delta, state) => {
    const particles = state.particles;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mActive = mouseRef.current.active;

    // 淡入清屏
    ctx.fillStyle = state.bgFade;
    ctx.fillRect(0, 0, w, h);

    // 状态机推进
    const elapsed = time - state.phaseStart;
    if (state.phase === "forming") {
      const t = Math.min(1, elapsed / (1200 / state.speedMul));
      state.formT = easeOutCubic(t);
      if (t >= 1) {
        state.phase = "holding";
        state.phaseStart = time;
      }
    } else if (state.phase === "holding") {
      state.formT = 1;
      if (elapsed > 1500 / state.speedMul) {
        state.phase = "exploding";
        state.phaseStart = time;
      }
    } else if (state.phase === "exploding") {
      const t = Math.min(1, elapsed / (800 / state.speedMul));
      state.explodeT = t;
      if (t >= 1) {
        // 切换到下一个词
        state.wordIndex = (state.wordIndex + 1) % state.words.length;
        sampleWordTargets(ctx, state, w, h);
        state.phase = "forming";
        state.phaseStart = time;
        state.formT = 0;
        state.explodeT = 0;
      }
    }

    // 粒子更新
    ctx.globalCompositeOperation = "lighter";
    const PSC = window.ParticleSpriteCache;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const tx = p.targetX;
      const ty = p.targetY;

      if (state.phase === "forming" || state.phase === "holding") {
        // 弹簧力回到目标位置
        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx += dx * 0.02 * state.formT;
        p.vy += dy * 0.02 * state.formT;
        p.vx *= 0.9;
        p.vy *= 0.9;
        // 呼吸抖动
        p.x += Math.sin(time * 0.002 + p.phase) * 0.3 * state.formT;
        p.y += Math.cos(time * 0.003 + p.phase * 1.5) * 0.3 * state.formT;
      } else if (state.phase === "exploding") {
        // 爆炸散开
        p.vy += 0.05;
        p.vx *= 0.99;
        p.vy *= 0.99;
      }

      // 鼠标排斥
      if (mActive) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 6400) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / 80) * 3;
          p.vx += dx / dist * force;
          p.vy += dy / dist * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // alpha 和大小控制
      let alpha = 0.7;
      let size = p.size;
      if (state.phase === "forming") {
        alpha = 0.2 + state.formT * 0.6;
        size = p.size * (0.5 + state.formT * 0.5);
      } else if (state.phase === "exploding") {
        alpha = 0.8 * (1 - state.explodeT);
        size = p.size * (1 + state.explodeT * 0.5);
      }

      const color = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
      if (PSC) {
        const sprite = PSC.get(size * 2, color, false);
        ctx.drawImage(sprite, p.x - sprite.width / 2, p.y - sprite.height / 2);
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 连线（forming 阶段）
    if (state.phase !== "exploding" && state.formT > 0.5) {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 0.5;
      const linkD = 30;
      for (let i = 0; i < Math.min(particles.length, 80); i++) {
        for (let j = i + 1; j < Math.min(particles.length, 80); j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < linkD * linkD) {
            const dist = Math.sqrt(dist2);
            const alpha = (1 - dist / linkD) * 0.15 * (state.formT - 0.5) * 2;
            ctx.strokeStyle = `hsla(${state.baseHue}, 80%, 70%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }, [particleCount, speedMul]);

  const setup = React.useCallback((ctx, w, h) => {
    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: Math.random() * w,
        targetY: Math.random() * h,
        size: 1.5 + Math.random() * 2,
        hue: baseHue + Math.random() * 60 - 30,
        phase: Math.random() * Math.PI * 2
      });
    }
    const state = {
      particles,
      baseHue,
      phase: "forming",
      phaseStart: 0,
      formT: 0,
      explodeT: 0,
      wordIndex: 0,
      words,
      bgFade: "rgba(3, 5, 20, 0.15)",
      speedMul
    };
    sampleWordTargets(ctx, state, w, h);
    return state;
  }, [accentColor, particleCount, speedMul]);

  function sampleWordTargets(ctx, state, w, h) {
    const word = state.words[state.wordIndex];
    const fontSize = Math.min(w * 0.18, h * 0.3, 120);
    ctx.save();
    ctx.font = `800 ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const metrics = ctx.measureText(word);
    const textW = metrics.width;
    const textH = fontSize;
    // 离屏渲染文字
    const off = document.createElement('canvas');
    off.width = Math.ceil(textW) + 20;
    off.height = Math.ceil(textH) + 20;
    const octx = off.getContext('2d');
    octx.font = `800 ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillStyle = 'white';
    octx.fillText(word, off.width / 2, off.height / 2);
    const imgData = octx.getImageData(0, 0, off.width, off.height);
    const data = imgData.data;
    const targets = [];
    const gap = Math.max(2, Math.floor(Math.sqrt((off.width * off.height) / state.particles.length)));
    for (let y = 0; y < off.height; y += gap) {
      for (let x = 0; x < off.width; x += gap) {
        const idx = (y * off.width + x) * 4 + 3;
        if (data[idx] > 128) {
          targets.push({ x, y });
        }
      }
    }
    // 将目标分配给粒子
    const particles = state.particles;
    for (let i = 0; i < particles.length; i++) {
      const t = targets[i % targets.length];
      particles[i].targetX = (w - off.width) / 2 + t.x + (Math.random() - 0.5) * gap * 0.5;
      particles[i].targetY = (h - off.height) / 2 + t.y + (Math.random() - 0.5) * gap * 0.5;
      // 爆炸时给一个初速度
      particles[i].vx = (Math.random() - 0.5) * 4;
      particles[i].vy = (Math.random() - 0.5) * 4 - 2;
    }
    ctx.restore();
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  useCanvasEffect(canvasRef, { draw, setup, active: true });

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0 } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.ParticleTextMorph = ParticleTextMorph;
