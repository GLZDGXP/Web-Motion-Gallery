// Fluid Smoke Cursor — WebGL 烟雾流体跟随鼠标效果
// 简化方案：多个高斯烟团(blob)跟随鼠标轨迹，扩散消散，加性混合
function FluidSmokeCursor({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({
    x: 0, y: 0, active: false,
    vx: 0, vy: 0, prevX: 0, prevY: 0,
    speed: 0,
  });

  React.useEffect(() => {
    const m = mouseRef.current;
    if (mouse.x !== void 0) {
      m.vx = mouse.x - (m.prevX || mouse.x);
      m.vy = mouse.y - (m.prevY || mouse.y);
      m.prevX = mouse.x;
      m.prevY = mouse.y;
      m.speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
    }
    m.x = mouse.x !== void 0 ? mouse.x : 0;
    m.y = mouse.y !== void 0 ? mouse.y : 0;
    m.active = mouse.active;
  }, [mouse]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const WU = window.WebGLUtils;
    const gl = WU ? WU.getGL(canvas) : null;
    let rafId = null;
    let time = 0;

    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 190;
    const PM = window.PerfMonitor;

    // motionLevel 配置
    const levelConfig = {
      subtle: { maxBlobs: 30, spreadMul: 0.7, buoyancy: 0.3 },
      rich:   { maxBlobs: 60, spreadMul: 1.0, buoyancy: 0.5 },
      intense:{ maxBlobs: 100, spreadMul: 1.4, buoyancy: 0.7 },
    };
    const cfg = levelConfig[motionLevel] || levelConfig.rich;
    const maxBlobs = PM ? PM.getParticleCount(cfg.maxBlobs) : cfg.maxBlobs;
    const buoyancy = cfg.buoyancy;
    const spreadMul = cfg.spreadMul;

    // ====== 工具函数 ======
    function hsl2rgb(h, s, l) {
      h = ((h % 360) + 360) % 360;
      h /= 360;
      let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return [r, g, b];
    }

    // ====== 烟团数据 ======
    const blobs = [];
    function spawnBlob(x, y, vx, vy, size, hueOffset) {
      if (blobs.length >= maxBlobs) {
        const b = blobs.shift();
        b.x = x; b.y = y;
        b.vx = vx; b.vy = vy;
        b.size = size;
        b.maxSize = size * (2.5 + Math.random() * 2) * spreadMul;
        b.life = 1;
        b.decay = 0.004 + Math.random() * 0.006;
        b.hue = baseHue + hueOffset;
        b.seed = Math.random();
        blobs.push(b);
      } else {
        blobs.push({
          x, y, vx, vy,
          size,
          maxSize: size * (2.5 + Math.random() * 2) * spreadMul,
          life: 1,
          decay: 0.004 + Math.random() * 0.006,
          hue: baseHue + hueOffset,
          seed: Math.random(),
        });
      }
    }

    let spawnAccumulator = 0;

    function updateBlobs(delta, w, h) {
      const m = mouseRef.current;
      const dt = Math.min(delta, 33) / 16.67;

      // 鼠标移动时喷射烟团
      if (m.active && m.speed > 0.5) {
        const spawnRate = 0.3 + m.speed * 0.08;
        spawnAccumulator += spawnRate * dt;
        while (spawnAccumulator >= 1) {
          spawnAccumulator -= 1;
          const offsetAngle = Math.random() * Math.PI * 2;
          const offsetR = Math.random() * 6;
          const px = m.x + Math.cos(offsetAngle) * offsetR;
          const py = m.y + Math.sin(offsetAngle) * offsetR;
          const speedFactor = Math.min(m.speed / 20, 1);
          const baseSize = 20 + speedFactor * 40 + Math.random() * 15;
          const hueShift = (Math.random() - 0.5) * 60;
          const vxB = m.vx * 0.1 + (Math.random() - 0.5) * 0.5;
          const vyB = m.vy * 0.1 + (Math.random() - 0.5) * 0.3 - buoyancy * 0.5;
          spawnBlob(px, py, vxB, vyB, baseSize, hueShift);
        }
      } else {
        spawnAccumulator = Math.max(0, spawnAccumulator - dt);
      }

      // 更新所有烟团
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        // 浮力上升
        b.vy -= buoyancy * 0.02 * dt;
        // 轻微水平扰动
        b.vx += Math.sin(b.seed * 10 + time * 0.001) * 0.01 * dt;
        // 阻尼
        b.vx *= 0.98;
        b.vy *= 0.98;

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // 扩散
        b.size += (b.maxSize - b.size) * 0.015 * dt;

        // 生命衰减
        b.life -= b.decay * dt;

        if (b.life <= 0 || b.y < -b.size || b.y > h + b.size ||
            b.x < -b.size || b.x > w + b.size) {
          blobs.splice(i, 1);
        }
      }
    }

    // ====== Canvas 2D 回退 ======
    function setup2D() {
      const ctx = canvas.getContext('2d');
      let w, h, dpr;

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      // 预渲染烟雾 sprite（白底径向渐变，运行时染色）
      const spriteSize = 128;
      const smokeSprite = document.createElement('canvas');
      smokeSprite.width = smokeSprite.height = spriteSize;
      const sctx = smokeSprite.getContext('2d');
      const grad = sctx.createRadialGradient(
        spriteSize / 2, spriteSize / 2, 0,
        spriteSize / 2, spriteSize / 2, spriteSize / 2
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.85)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.35)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, spriteSize, spriteSize);

      function draw2D(t) {
        rafId = requestAnimationFrame(draw2D);
        const delta = t - time;
        time = t;

        // 淡出背景（产生拖尾效果）
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, w, h);

        updateBlobs(delta, w, h);

        // 加性混合绘制烟团
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < blobs.length; i++) {
          const b = blobs[i];
          const alpha = b.life * 0.45;
          const size = b.size;
          // 先画白色烟雾基底
          ctx.globalAlpha = alpha * 0.7;
          ctx.drawImage(
            smokeSprite,
            b.x - size / 2,
            b.y - size / 2,
            size,
            size
          );
          // 再叠有色核心
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsla(${b.hue}, 85%, 60%, 1)`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(draw2D);

      return function cleanup() {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
      };
    }

    // ====== WebGL 实现 ======
    if (gl && WU) {
      const mat4 = WU.mat4;
      const mvpMatrix = new Float32Array(16);

      function makeOrtho(left, right, bottom, top, near, far) {
        const out = new Float32Array(16);
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[5] = -2 * bt;
        out[10] = 2 * nf;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
      }

      // Shaders — POINTS 模式 + 径向渐变片元
      const VS = `
        attribute vec2 a_pos;
        attribute float a_size;
        attribute vec4 a_color;
        uniform mat4 u_mvp;
        varying vec4 v_color;
        void main() {
          v_color = a_color;
          vec4 pos = u_mvp * vec4(a_pos, 0.0, 1.0);
          gl_Position = pos;
          gl_PointSize = a_size;
        }
      `;

      const FS = `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d);
          alpha = pow(alpha, 1.8);
          gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
        }
      `;

      const program = WU.createProgram(gl, VS, FS);
      if (!program) {
        // WebGL 程序创建失败，降级到 Canvas 2D
        return setup2D();
      }

      // 顶点数据 buffer
      const posData = new Float32Array(maxBlobs * 2);
      const sizeData = new Float32Array(maxBlobs);
      const colorData = new Float32Array(maxBlobs * 4);

      const posBuf = WU.createVBO(gl, posData);
      const sizeBuf = WU.createVBO(gl, sizeData);
      const colorBuf = WU.createVBO(gl, colorData);

      const aPos = gl.getAttribLocation(program, 'a_pos');
      const aSize = gl.getAttribLocation(program, 'a_size');
      const aColor = gl.getAttribLocation(program, 'a_color');
      const uMvp = gl.getUniformLocation(program, 'u_mvp');

      function render(t) {
        rafId = requestAnimationFrame(render);
        const delta = t - time;
        time = t;

        WU.resizeGL(gl, canvas);
        const w = canvas.width;
        const h = canvas.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cssW = w / dpr;
        const cssH = h / dpr;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        // 正交投影：像素坐标，原点在左上
        const ortho = makeOrtho(0, cssW, cssH, 0, -1, 1);
        mat4.identity(mvpMatrix);
        mat4.multiply(mvpMatrix, ortho, mvpMatrix);

        // 更新烟团物理
        updateBlobs(delta, cssW, cssH);

        // 填充 GPU 数据
        const count = blobs.length;
        for (let i = 0; i < count; i++) {
          const b = blobs[i];
          posData[i * 2] = b.x;
          posData[i * 2 + 1] = b.y;
          sizeData[i] = b.size * dpr;
          const rgb = hsl2rgb(b.hue, 0.85, 0.6);
          const alpha = b.life * 0.5;
          colorData[i * 4] = rgb[0];
          colorData[i * 4 + 1] = rgb[1];
          colorData[i * 4 + 2] = rgb[2];
          colorData[i * 4 + 3] = alpha;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, posData.subarray(0, count * 2), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
        gl.bufferData(gl.ARRAY_BUFFER, sizeData.subarray(0, count), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
        gl.bufferData(gl.ARRAY_BUFFER, colorData.subarray(0, count * 4), gl.DYNAMIC_DRAW);

        // 绘制
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
        gl.enableVertexAttribArray(aSize);
        gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(uMvp, false, mvpMatrix);

        gl.drawArrays(gl.POINTS, 0, count);

        gl.disable(gl.BLEND);
      }

      rafId = requestAnimationFrame(render);

      return function cleanup() {
        cancelAnimationFrame(rafId);
        try {
          gl.deleteBuffer(posBuf);
          gl.deleteBuffer(sizeBuf);
          gl.deleteBuffer(colorBuf);
          if (program) gl.deleteProgram(program);
        } catch (e) { console.warn("[FluidSmokeCursor] cleanup error:", (e && e.message) || e); }
      };
    }

    // WebGL 不可用时用 Canvas 2D
    return setup2D();
  }, [accentColor, motionLevel]);

  return React.createElement(
    "div",
    {
      ref: containerRef,
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      },
    },
    React.createElement("canvas", {
      ref: canvasRef,
      style: {
        display: "block",
        width: "100%",
        height: "100%",
      },
    })
  );
}

window.FluidSmokeCursor = FluidSmokeCursor;
