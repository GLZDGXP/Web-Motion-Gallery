// DNA 双螺旋 — WebGL 3D + 碱基对 + 拖拽旋转
function DNAHelix({ accentColor = "#00e5ff", motionLevel = "rich" }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const dragRef = React.useRef({ down: false, lastX: 0, lastY: 0 });
  const yawRef = React.useRef(0);
  const pitchRef = React.useRef(0.3);
  const autoRotate = React.useRef(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const WU = window.WebGLUtils;
    const gl = WU ? WU.getGL(canvas) : null;
    let rafId = null;
    let time = 0;
    let targetYaw = 0, targetPitch = 0.3;

    const onDown = (e) => {
      dragRef.current.down = true;
      autoRotate.current = false;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };
    const onUp = () => { dragRef.current.down = false; };
    const onMove = (e) => {
      if (!dragRef.current.down) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      targetYaw += dx * 0.005;
      targetPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetPitch + dy * 0.005));
    };
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        dragRef.current.down = true;
        autoRotate.current = false;
        dragRef.current.lastX = e.touches[0].clientX;
        dragRef.current.lastY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!dragRef.current.down || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragRef.current.lastX;
      const dy = e.touches[0].clientY - dragRef.current.lastY;
      dragRef.current.lastX = e.touches[0].clientX;
      dragRef.current.lastY = e.touches[0].clientY;
      targetYaw += dx * 0.005;
      targetPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetPitch + dy * 0.005));
    };
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onUp);

    if (!gl || !WU) {
      // Canvas 2D 回退
      const ctx = canvas.getContext('2d');
      let w, h;
      const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
      const speedMul = motionLevel === "intense" ? 1.5 : motionLevel === "subtle" ? 0.5 : 1;
      const basePairs = motionLevel === "intense" ? 40 : motionLevel === "subtle" ? 20 : 30;

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
        if (autoRotate.current) targetYaw += 0.003 * speedMul;
        yawRef.current += (targetYaw - yawRef.current) * 0.1;
        pitchRef.current += (targetPitch - pitchRef.current) * 0.1;

        ctx.fillStyle = 'rgba(5, 5, 20, 0.2)';
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2, cy = h / 2;
        const radius = Math.min(w, h) * 0.15;
        const height = Math.min(h * 0.7, 400);
        const yaw = yawRef.current;

        // 碱基对 + 主链粒子
        for (let i = 0; i < basePairs; i++) {
          const t = i / basePairs;
          const y = cy - height / 2 + t * height;
          const angle = t * Math.PI * 4 + yaw;
          const x1 = cx + Math.cos(angle) * radius;
          const x2 = cx + Math.cos(angle + Math.PI) * radius;
          const z1 = Math.sin(angle);
          const z2 = Math.sin(angle + Math.PI);

          // 碱基对连线
          const lineAlpha = 0.3 + 0.3 * ((z1 + z2) / 2 + 1);
          ctx.strokeStyle = `hsla(${baseHue + 40}, 80%, 60%, ${lineAlpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();

          // 主链粒子
          const size1 = 3 + z1 * 2;
          const size2 = 3 + z2 * 2;
          ctx.fillStyle = `hsla(${baseHue}, 90%, 65%, ${0.7 + z1 * 0.3})`;
          ctx.beginPath(); ctx.arc(x1, y, size1, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `hsla(${baseHue + 180}, 90%, 65%, ${0.7 + z2 * 0.3})`;
          ctx.beginPath(); ctx.arc(x2, y, size2, 0, Math.PI * 2); ctx.fill();
        }
      }
      rafId = requestAnimationFrame(draw2D);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousedown', onDown);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('mousemove', onMove);
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchmove', onTouchMove);
        canvas.removeEventListener('touchend', onUp);
      };
    }

    // ====== WebGL 实现 ======
    const mat4 = WU.mat4;
    const projMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const mvpMatrix = mat4.create();

    const speedMul = motionLevel === "intense" ? 1.5 : motionLevel === "subtle" ? 0.5 : 1;
    const baseCount = motionLevel === "intense" ? 60 : motionLevel === "subtle" ? 25 : 40;
    const PM = window.PerfMonitor;
    const basePairs = PM ? Math.min(80, PM.getParticleCount(baseCount)) : baseCount;

    const baseHue = window.hexToHue ? window.hexToHue(accentColor) : 200;
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

    // 碱基对颜色（A-T, G-C 配对）
    const colorA = hsl2rgb(baseHue + 160, 0.9, 0.65);
    const colorT = hsl2rgb(baseHue + 20, 0.9, 0.65);
    const colorG = hsl2rgb(baseHue + 280, 0.9, 0.6);
    const colorC = hsl2rgb(baseHue + 100, 0.9, 0.6);

    // 构建顶点数据
    const backbonePos = [];
    const backboneColor = [];
    const backboneSize = [];
    const linePos = [];
    const lineColor = [];

    const helixRadius = 50;
    const helixHeight = 280;
    const twists = 2.5;

    for (let i = 0; i < basePairs; i++) {
      const t = i / basePairs;
      const y = (t - 0.5) * helixHeight;
      const angle = t * Math.PI * 2 * twists;
      const isGC = Math.random() > 0.5;
      const frontColor = isGC ? colorG : colorA;
      const backColor = isGC ? colorC : colorT;

      // 前链
      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      backbonePos.push(x1, y, z1);
      backboneColor.push(...frontColor, 1.0);
      backboneSize.push(4.5);

      // 后链
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;
      backbonePos.push(x2, y, z2);
      backboneColor.push(...backColor, 1.0);
      backboneSize.push(4.5);

      // 碱基对连线
      linePos.push(x1, y, z1, x2, y, z2);
      const midColor = [
        (frontColor[0] + backColor[0]) * 0.5,
        (frontColor[1] + backColor[1]) * 0.5,
        (frontColor[2] + backColor[2]) * 0.5
      ];
      lineColor.push(...midColor, 0.7, ...midColor, 0.7);
    }

    const backbonePosBuf = WU.createVBO(gl, new Float32Array(backbonePos));
    const backboneColorBuf = WU.createVBO(gl, new Float32Array(backboneColor));
    const backboneSizeBuf = WU.createVBO(gl, new Float32Array(backboneSize));
    const linePosBuf = WU.createVBO(gl, new Float32Array(linePos));
    const lineColorBuf = WU.createVBO(gl, new Float32Array(lineColor));
    const backboneCount = basePairs * 2;
    const lineVertexCount = basePairs * 2;

    // Shaders
    const VS_POINTS = `
      attribute vec3 a_pos;
      attribute vec4 a_color;
      attribute float a_size;
      uniform mat4 u_mvp;
      varying vec4 v_color;
      void main() {
        v_color = a_color;
        vec4 mvPos = u_mvp * vec4(a_pos, 1.0);
        gl_Position = mvPos;
        gl_PointSize = a_size / mvPos.w * 100.0;
      }
    `;
    const FS_POINTS = `
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
    const VS_LINES = `
      attribute vec3 a_pos;
      attribute vec4 a_color;
      uniform mat4 u_mvp;
      varying vec4 v_color;
      void main() {
        v_color = a_color;
        gl_Position = u_mvp * vec4(a_pos, 1.0);
      }
    `;
    const FS_LINES = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        gl_FragColor = v_color;
      }
    `;

    const pointsProgram = WU.createProgram(gl, VS_POINTS, FS_POINTS);
    const linesProgram = WU.createProgram(gl, VS_LINES, FS_LINES);

    function render(t) {
      rafId = requestAnimationFrame(render);
      const delta = t - time;
      time = t;
      WU.resizeGL(gl, canvas);
      const w = canvas.width, h = canvas.height;

      if (autoRotate.current && !dragRef.current.down) {
        targetYaw += 0.0008 * speedMul * delta;
      }
      yawRef.current += (targetYaw - yawRef.current) * 0.08;
      pitchRef.current += (targetPitch - pitchRef.current) * 0.08;

      gl.clearColor(0.02, 0.02, 0.06, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      const aspect = w / h;
      mat4.perspective(projMatrix, Math.PI / 5, aspect, 1, 2000);
      mat4.lookAt(viewMatrix, [0, 0, 200], [0, 0, 0], [0, 1, 0]);
      mat4.rotateX(viewMatrix, pitchRef.current);
      mat4.rotateY(viewMatrix, yawRef.current);
      mat4.multiply(mvpMatrix, projMatrix, viewMatrix);

      // 碱基对连线
      if (linesProgram) {
        gl.useProgram(linesProgram);
        gl.lineWidth(1.5);

        gl.bindBuffer(gl.ARRAY_BUFFER, linePosBuf);
        const aPos = gl.getAttribLocation(linesProgram, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuf);
        const aColor = gl.getAttribLocation(linesProgram, 'a_color');
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

        const uMvp = gl.getUniformLocation(linesProgram, 'u_mvp');
        gl.uniformMatrix4fv(uMvp, false, mvpMatrix);

        gl.drawArrays(gl.LINES, 0, lineVertexCount);
      }

      // 主链粒子
      if (pointsProgram) {
        gl.useProgram(pointsProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, backbonePosBuf);
        const aPos = gl.getAttribLocation(pointsProgram, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, backboneColorBuf);
        const aColor = gl.getAttribLocation(pointsProgram, 'a_color');
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, backboneSizeBuf);
        const aSize = gl.getAttribLocation(pointsProgram, 'a_size');
        gl.enableVertexAttribArray(aSize);
        gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

        const uMvp = gl.getUniformLocation(pointsProgram, 'u_mvp');
        gl.uniformMatrix4fv(uMvp, false, mvpMatrix);

        gl.drawArrays(gl.POINTS, 0, backboneCount);
      }

      gl.disable(gl.BLEND);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onUp);
      try {
        gl.deleteBuffer(backbonePosBuf);
        gl.deleteBuffer(backboneColorBuf);
        gl.deleteBuffer(backboneSizeBuf);
        gl.deleteBuffer(linePosBuf);
        gl.deleteBuffer(lineColorBuf);
        if (pointsProgram) gl.deleteProgram(pointsProgram);
        if (linesProgram) gl.deleteProgram(linesProgram);
      } catch (e) { console.warn("[DNAHelix] cleanup error:", (e && e.message) || e); }
    };
  }, [accentColor, motionLevel]);

  return React.createElement("div", {
    ref: containerRef,
    style: { position: "absolute", inset: 0, cursor: "grab", touchAction: "none" }
  },
    React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: "100%" } })
  );
}

window.DNAHelix = DNAHelix;
