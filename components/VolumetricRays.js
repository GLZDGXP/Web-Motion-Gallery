// 体积光柱阵列 — WebGL 实现 God Rays + 尘埃粒子 + 鼠标控制
function VolumetricRays({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mouse = useMousePosition(containerRef);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const WU = window.WebGLUtils;
    const gl = WU ? WU.getGL(canvas) : null;
    let rafId = null;
    let time = 0;

    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
    const speedMul = motionLevel === "intense" ? 1.4 : motionLevel === "subtle" ? 0.5 : 1;
    const rayCount = motionLevel === "intense" ? 8 : motionLevel === "subtle" ? 3 : 5;
    const dustCount = motionLevel === "intense" ? 250 : motionLevel === "subtle" ? 80 : 150;
    const PM = window.PerfMonitor;
    const dustTotal = PM ? PM.getParticleCount(dustCount) : dustCount;

    function hsl2rgb(h, s, l) {
      h /= 360; let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1; if (t > 1) t -= 1;
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

    if (!gl || !WU) {
      // Canvas 2D 回退
      const ctx = canvas.getContext('2d');
      let w, h;
      let rays = [];
      for (let i = 0; i < rayCount; i++) {
        rays.push({
          x: (i + 0.5) / rayCount,
          width: 0.08 + Math.random() * 0.06,
          intensity: 0.3 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          hue: baseHue + Math.random() * 40 - 20
        });
      }
      let dust = [];
      for (let i = 0; i < dustTotal; i++) {
        dust.push({
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0005,
          vy: -0.0002 - Math.random() * 0.0003,
          size: 1 + Math.random() * 2,
          alpha: 0.2 + Math.random() * 0.5,
          rayIdx: Math.floor(Math.random() * rays.length)
        });
      }

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      function draw2D(t) {
        rafId = requestAnimationFrame(draw2D);
        time = t;
        const dt = 16;
        ctx.fillStyle = 'rgba(3, 5, 15, 0.12)';
        ctx.fillRect(0, 0, w, h);

        const mouseX = mouseRef.current.x / w || 0;
        const tilt = (mouseX - 0.5) * 0.2;

        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < rays.length; i++) {
          const r = rays[i];
          const sway = Math.sin(t * 0.0005 * speedMul + r.phase) * 0.03;
          const rx = (r.x + sway + tilt) * w;
          const rw = r.width * w * (0.9 + 0.2 * Math.sin(t * 0.0007 + r.phase * 2));
          const grad = ctx.createLinearGradient(rx - rw, 0, rx + rw, 0);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.5, `hsla(${r.hue}, 80%, 60%, ${r.intensity * 0.6})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(rx - rw * 0.4, 0);
          ctx.lineTo(rx + rw * 0.4, 0);
          ctx.lineTo(rx + rw, h);
          ctx.lineTo(rx - rw, h);
          ctx.closePath();
          ctx.fill();
        }

        // 尘埃粒子
        for (let i = 0; i < dust.length; i++) {
          const d = dust[i];
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (d.y < 0) { d.y = 1; d.x = Math.random(); }
          if (d.x < 0 || d.x > 1) d.vx *= -1;
          ctx.fillStyle = `hsla(${baseHue + 40}, 90%, 80%, ${d.alpha})`;
          ctx.beginPath();
          ctx.arc(d.x * w, d.y * h, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      rafId = requestAnimationFrame(draw2D);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
      };
    }

    // ====== WebGL 实现 ======
    const mat4 = WU.mat4;
    const projMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const mvpMatrix = mat4.create();

    function makeOrtho(left, right, bottom, top, near, far) {
      const out = new Float32Array(16);
      const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
      out[0] = -2 * lr; out[5] = -2 * bt; out[10] = 2 * nf;
      out[12] = (left + right) * lr; out[13] = (top + bottom) * bt; out[14] = (far + near) * nf; out[15] = 1;
      return out;
    }

    // 光柱几何：每道光柱 4 个顶点（上窄下宽梯形）+ TRIANGLE_STRIP
    let rayPositions = [];
    let rayColors = [];
    for (let i = 0; i < rayCount; i++) {
      const x = (i + 0.5) / rayCount * 2 - 1; // -1 ~ 1
      const topW = 0.04 + Math.random() * 0.03;
      const bottomW = 0.12 + Math.random() * 0.08;
      const hue = baseHue + Math.random() * 50 - 25;
      const rgb = hsl2rgb(hue, 0.8, 0.65);
      const intensity = 0.4 + Math.random() * 0.4;
      // 上左, 上右, 下左, 下右
      rayPositions.push(x - topW, 1, 0, x + topW, 1, 0, x - bottomW, -1, 0, x + bottomW, -1, 0);
      // 顶点颜色（上亮下暗？不，光柱是上窄下宽但整体均匀，边缘透明）
      // alpha 从中间向两边衰减，用 varying
      rayColors.push(rgb[0], rgb[1], rgb[2], 0, rgb[0], rgb[1], rgb[2], 0,
                     rgb[0], rgb[1], rgb[2], intensity, rgb[0], rgb[1], rgb[2], intensity);
    }

    const rayPosBuf = WU.createVBO(gl, new Float32Array(rayPositions));
    const rayColorBuf = WU.createVBO(gl, new Float32Array(rayColors));

    // 尘埃粒子
    let dustPos = new Float32Array(dustTotal * 3);
    let dustColor = new Float32Array(dustTotal * 4);
    let dustSize = new Float32Array(dustTotal);
    let dustData = [];
    for (let i = 0; i < dustTotal; i++) {
      dustData.push({
        rayIdx: Math.floor(Math.random() * rayCount),
        offsetX: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 2 - 1,
        vy: -0.0005 - Math.random() * 0.0008,
        phase: Math.random() * Math.PI * 2
      });
      dustPos[i*3] = 0; dustPos[i*3+1] = 0; dustPos[i*3+2] = 0;
      const rgb = hsl2rgb(baseHue + 30, 0.9, 0.75);
      dustColor[i*4] = rgb[0]; dustColor[i*4+1] = rgb[1]; dustColor[i*4+2] = rgb[2];
      dustColor[i*4+3] = 0.3 + Math.random() * 0.5;
      dustSize[i] = 1.5 + Math.random() * 2;
    }
    const dustPosBuf = WU.createVBO(gl, dustPos);
    const dustColorBuf = WU.createVBO(gl, dustColor);
    const dustSizeBuf = WU.createVBO(gl, dustSize);

    // Shaders
    const RAY_VS = `
      attribute vec3 a_pos;
      attribute vec4 a_color;
      uniform mat4 u_mvp;
      varying vec4 v_color;
      void main() {
        v_color = a_color;
        gl_Position = u_mvp * vec4(a_pos, 1.0);
      }
    `;
    const RAY_FS = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        gl_FragColor = v_color;
      }
    `;
    const DUST_VS = `
      attribute vec3 a_pos;
      attribute vec4 a_color;
      attribute float a_size;
      uniform mat4 u_mvp;
      varying vec4 v_color;
      void main() {
        v_color = a_color;
        vec4 mvPos = u_mvp * vec4(a_pos, 1.0);
        gl_Position = mvPos;
        gl_PointSize = a_size;
      }
    `;
    const DUST_FS = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
      }
    `;

    const rayProgram = WU.createProgram(gl, RAY_VS, RAY_FS);
    const dustProgram = WU.createProgram(gl, DUST_VS, DUST_FS);

    function render(t) {
      rafId = requestAnimationFrame(render);
      const delta = t - time;
      time = t;
      WU.resizeGL(gl, canvas);
      const w = canvas.width, h = canvas.height;

      gl.clearColor(0.015, 0.02, 0.06, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      // 鼠标控制倾斜
      const mouseX = (mouseRef.current.x / (w / (window.devicePixelRatio || 1))) || 0.5;
      const tilt = (mouseX - 0.5) * 0.3;

      // 正交投影，根据 canvas 宽高比调整
      const aspect = w / h;
      const ortho = makeOrtho(-aspect, aspect, -1, 1, -1, 1);
      mat4.identity(viewMatrix);
      mat4.translate(viewMatrix, [tilt, 0, 0]);
      mat4.multiply(mvpMatrix, ortho, viewMatrix);

      // 更新光柱摆动
      const rayPosData = new Float32Array(rayCount * 4 * 3);
      const rayColorData = new Float32Array(rayCount * 4 * 4);
      for (let i = 0; i < rayCount; i++) {
        const baseX = (i + 0.5) / rayCount * 2 - 1;
        const sway = Math.sin(t * 0.0005 * speedMul + i * 0.8) * 0.04;
        const widthMod = 0.9 + 0.2 * Math.sin(t * 0.0007 * speedMul + i * 1.3);
        const topW = (0.04 + (i % 3) * 0.01) * widthMod;
        const bottomW = (0.12 + (i % 3) * 0.03) * widthMod;
        const x = baseX + sway;
        const hue = baseHue + i * 12 + Math.sin(t * 0.0003 + i) * 10;
        const rgb = hsl2rgb(hue, 0.8, 0.65);
        const intensity = (0.4 + (i % 3) * 0.15) * (0.8 + 0.2 * Math.sin(t * 0.001 + i * 2));

        const idx = i * 4 * 3;
        rayPosData[idx] = x - topW; rayPosData[idx+1] = 1; rayPosData[idx+2] = 0;
        rayPosData[idx+3] = x + topW; rayPosData[idx+4] = 1; rayPosData[idx+5] = 0;
        rayPosData[idx+6] = x - bottomW; rayPosData[idx+7] = -1; rayPosData[idx+8] = 0;
        rayPosData[idx+9] = x + bottomW; rayPosData[idx+10] = -1; rayPosData[idx+11] = 0;

        const ci = i * 4 * 4;
        // 顶部暗，底部亮，边缘更暗
        rayColorData[ci] = rgb[0]; rayColorData[ci+1] = rgb[1]; rayColorData[ci+2] = rgb[2]; rayColorData[ci+3] = 0;
        rayColorData[ci+4] = rgb[0]; rayColorData[ci+5] = rgb[1]; rayColorData[ci+6] = rgb[2]; rayColorData[ci+7] = 0;
        rayColorData[ci+8] = rgb[0]; rayColorData[ci+9] = rgb[1]; rayColorData[ci+10] = rgb[2]; rayColorData[ci+11] = intensity * 0.8;
        rayColorData[ci+12] = rgb[0]; rayColorData[ci+13] = rgb[1]; rayColorData[ci+14] = rgb[2]; rayColorData[ci+15] = intensity * 0.8;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, rayPosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, rayPosData, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, rayColorBuf);
      gl.bufferData(gl.ARRAY_BUFFER, rayColorData, gl.DYNAMIC_DRAW);

      // 绘制光柱
      if (rayProgram) {
        gl.useProgram(rayProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, rayPosBuf);
        const aPos = gl.getAttribLocation(rayProgram, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, rayColorBuf);
        const aColor = gl.getAttribLocation(rayProgram, 'a_color');
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

        const uMvp = gl.getUniformLocation(rayProgram, 'u_mvp');
        gl.uniformMatrix4fv(uMvp, false, mvpMatrix);

        for (let i = 0; i < rayCount; i++) {
          gl.drawArrays(gl.TRIANGLE_STRIP, i * 4, 4);
        }
      }

      // 更新尘埃
      const dustPosData = new Float32Array(dustTotal * 3);
      const dustColorData = new Float32Array(dustTotal * 4);
      for (let i = 0; i < dustTotal; i++) {
        const d = dustData[i];
        d.y += d.vy * delta * 0.06 * speedMul;
        if (d.y < -1) {
          d.y = 1;
          d.offsetX = (Math.random() - 0.5) * 0.1;
          d.rayIdx = Math.floor(Math.random() * rayCount);
        }
        const rayBaseX = (d.rayIdx + 0.5) / rayCount * 2 - 1;
        const raySway = Math.sin(t * 0.0005 * speedMul + d.rayIdx * 0.8) * 0.04;
        const rayX = rayBaseX + raySway + tilt;
        // 尘埃在光柱内部水平漂移
        const horizontalDrift = Math.sin(t * 0.001 + d.phase) * 0.03;
        const px = (rayX + d.offsetX + horizontalDrift) * aspect;
        const py = d.y;
        dustPosData[i*3] = px;
        dustPosData[i*3+1] = py;
        dustPosData[i*3+2] = 0;

        // 根据 y 位置调整透明度（上下淡出）
        const fadeTop = Math.max(0, Math.min(1, (1 - d.y) * 3));
        const fadeBottom = Math.max(0, Math.min(1, (d.y + 1) * 3));
        const alpha = 0.4 * fadeTop * fadeBottom;
        const rgb = hsl2rgb(baseHue + 30, 0.9, 0.75);
        dustColorData[i*4] = rgb[0];
        dustColorData[i*4+1] = rgb[1];
        dustColorData[i*4+2] = rgb[2];
        dustColorData[i*4+3] = alpha;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, dustPosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, dustPosData, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, dustColorBuf);
      gl.bufferData(gl.ARRAY_BUFFER, dustColorData, gl.DYNAMIC_DRAW);

      // 绘制尘埃
      if (dustProgram) {
        gl.useProgram(dustProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, dustPosBuf);
        const aPos = gl.getAttribLocation(dustProgram, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, dustColorBuf);
        const aColor = gl.getAttribLocation(dustProgram, 'a_color');
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, dustSizeBuf);
        const aSize = gl.getAttribLocation(dustProgram, 'a_size');
        gl.enableVertexAttribArray(aSize);
        gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

        const uMvp = gl.getUniformLocation(dustProgram, 'u_mvp');
        gl.uniformMatrix4fv(uMvp, false, mvpMatrix);

        gl.drawArrays(gl.POINTS, 0, dustTotal);
      }

      gl.disable(gl.BLEND);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      try {
        gl.deleteBuffer(rayPosBuf);
        gl.deleteBuffer(rayColorBuf);
        gl.deleteBuffer(dustPosBuf);
        gl.deleteBuffer(dustColorBuf);
        gl.deleteBuffer(dustSizeBuf);
        if (rayProgram) gl.deleteProgram(rayProgram);
        if (dustProgram) gl.deleteProgram(dustProgram);
      } catch (e) {}
    };
  }, [accentColor, motionLevel]);

  return React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0 } },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.VolumetricRays = VolumetricRays;
