// 螺旋星系 SpiralGalaxy
// WebGL: 旋臂粒子 + 核球 + 鼠标扰动
function SpiralGalaxy({ accentColor = '#ff9d5c' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const WU = window.WebGLUtils;
    const gl = WU ? WU.getGL(canvas) : null;
    let rafId = null;
    let time = 0;
    let mouseX = 0, mouseY = 0;
    let mouseDown = false;

    if (!gl || !WU) {
      // Canvas 2D 降级
      const ctx = canvas.getContext('2d');
      let w, h, cx, cy;
      const ARMS = 4;
      const PARTICLES = 1500;
      const particles = Array.from({ length: PARTICLES }, () => {
        const arm = Math.floor(Math.random() * ARMS);
        const t = Math.random();
        const armAngle = (arm / ARMS) * Math.PI * 2;
        const spiralAngle = t * 3 * Math.PI;
        const angle = armAngle + spiralAngle + (Math.random() - 0.5) * 0.6;
        return {
          angle,
          radius: t * 0.8 + Math.random() * 0.1,
          size: 0.5 + Math.random() * 1.5,
          color: t < 0.3 ? [1, 0.9, 0.6] : t < 0.6 ? [1, 0.7, 0.4] : [0.6, 0.7, 1],
          speed: 0.2 + Math.random() * 0.3,
        };
      });
      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = w / 2; cy = h / 2;
      }
      resize();
      window.addEventListener('resize', resize);

      function draw(t) {
        rafId = requestAnimationFrame(draw);
        const dt = Math.min((t - time) / 1000, 0.05);
        time = t;
        ctx.fillStyle = 'rgba(5, 5, 15, 0.3)';
        ctx.fillRect(0, 0, w, h);

        const maxR = Math.min(w, h) * 0.38;
        // 核球
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.2);
        coreGrad.addColorStop(0, 'rgba(255, 220, 150, 0.6)');
        coreGrad.addColorStop(0.5, 'rgba(255, 150, 100, 0.2)');
        coreGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * 0.2, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p) => {
          p.angle += dt * p.speed;
          // 鼠标扰动
          if (mouseDown) {
            const dx = (mouseX - cx) / maxR;
            const dy = (mouseY - cy) / maxR;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 1) {
              p.angle += dt * (1 - dist) * 2;
            }
          }
          const px = cx + Math.cos(p.angle) * p.radius * maxR;
          const py = cy + Math.sin(p.angle) * p.radius * maxR * 0.5;
          const alpha = 1 - p.radius * 0.5;
          ctx.fillStyle = `rgba(${Math.floor(p.color[0]*255)},${Math.floor(p.color[1]*255)},${Math.floor(p.color[2]*255)},${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      const onDown = (e) => { mouseDown = true; };
      const onUp = () => { mouseDown = false; };
      const onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      };
      canvas.addEventListener('mousedown', onDown);
      window.addEventListener('mouseup', onUp);
      canvas.addEventListener('mousemove', onMove);
      rafId = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousedown', onDown);
        window.removeEventListener('mouseup', onUp);
        canvas.removeEventListener('mousemove', onMove);
      };
    }

    // ====== WebGL 实现 ======
    const mat4 = WU.mat4;
    const projMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const mvpMatrix = mat4.create();

    const GALAXY_VS = `
      attribute float a_angle;
      attribute float a_radius;
      attribute float a_size;
      attribute vec3 a_color;
      uniform mat4 u_mvp;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_mouseDown;
      varying vec3 v_color;
      varying float v_depth;
      void main() {
        float rot = a_angle + u_time * 0.15;
        float r = a_radius;
        // 鼠标扰动
        vec2 mouseWorld = u_mouse * 3.0;
        vec2 pos2d = vec2(cos(rot) * r, sin(rot) * r);
        float dist = length(pos2d - mouseWorld);
        float perturb = u_mouseDown * exp(-dist * 0.5) * 0.2;
        r += perturb;
        float angle = rot + perturb * 2.0;
        // 旋臂厚度（中心厚、边缘薄）
        float height = (1.0 - r / 5.0) * 0.3;
        float z = (a_angle * 0.3 - floor(a_angle * 0.3)) * height - height * 0.5;
        vec3 pos = vec3(cos(angle) * r, sin(angle) * r, z);
        vec4 mvPos = u_mvp * vec4(pos, 1.0);
        v_depth = mvPos.w;
        v_color = a_color;
        gl_Position = mvPos;
        gl_PointSize = a_size * (250.0 / max(mvPos.w, 0.01));
      }
    `;
    const GALAXY_FS = `
      precision mediump float;
      varying vec3 v_color;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
         float alpha = smoothstep(0.5, 0.0, d);
         alpha = pow(alpha, 2.0) * 0.6;
         gl_FragColor = vec4(v_color, alpha);
      }
    `;
    // 核球 shader
    const CORE_VS = `
      attribute float a_angle;
      attribute float a_radius;
      attribute float a_size;
      attribute vec3 a_color;
      uniform mat4 u_mvp;
      uniform float u_time;
      varying vec3 v_color;
      void main() {
        float r = a_radius * 0.3;
        vec3 pos = vec3(
          cos(a_angle + u_time * 0.3) * r,
          sin(a_angle + u_time * 0.2) * r * 0.8,
          (a_radius - 0.5) * 0.2
        );
        vec4 mvPos = u_mvp * vec4(pos, 1.0);
        v_color = a_color;
        gl_Position = mvPos;
        gl_PointSize = a_size * 1.5 * (250.0 / max(mvPos.w, 0.01));
      }
    `;

    const galaxyProgram = WU.createProgram(gl, GALAXY_VS, GALAXY_FS);
    const coreProgram = WU.createProgram(gl, CORE_VS, GALAXY_FS);

    // 生成星系粒子数据
    const ARMS = 4;
       const PARTICLE_COUNT = 10000;
       const CORE_COUNT = 1000;
    const galaxyData = new Float32Array(PARTICLE_COUNT * 6); // angle, radius, size, r, g, b

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const arm = i % ARMS;
      const t = Math.random();
      const armAngle = (arm / ARMS) * Math.PI * 2;
      const spiralAngle = t * 4 * Math.PI;
      const angle = armAngle + spiralAngle + (Math.random() - 0.5) * 0.8;
      const radius = t * 4.5 + Math.random() * 0.2;

      galaxyData[i*6] = angle;
      galaxyData[i*6+1] = radius;
      galaxyData[i*6+2] = 0.8 + Math.random() * 1.5;
      // 颜色：中心偏黄白，外围偏蓝
      const c = Math.max(0, 1 - t * 1.5);
      galaxyData[i*6+3] = 1.0;
      galaxyData[i*6+4] = 0.7 + c * 0.3;
      galaxyData[i*6+5] = 0.4 + (1 - t) * 0.4;
    }
    const galaxyBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, galaxyBuf);
    gl.bufferData(gl.ARRAY_BUFFER, galaxyData, gl.STATIC_DRAW);

    // 核球粒子
    const coreData = new Float32Array(CORE_COUNT * 6);
    for (let i = 0; i < CORE_COUNT; i++) {
      coreData[i*6] = Math.random() * Math.PI * 2;
      coreData[i*6+1] = Math.random();
      coreData[i*6+2] = 1 + Math.random() * 2;
      coreData[i*6+3] = 1.0;
      coreData[i*6+4] = 0.9 + Math.random() * 0.1;
      coreData[i*6+5] = 0.7 + Math.random() * 0.3;
    }
    const coreBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coreBuf);
    gl.bufferData(gl.ARRAY_BUFFER, coreData, gl.STATIC_DRAW);

    const onDown = (e) => { mouseDown = 1; };
    const onUp = () => { mouseDown = 0; };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('mousemove', onMove);

    let rotX = -0.4;

    function render(t) {
      rafId = requestAnimationFrame(render);
      time = t;
      WU.resizeGL(gl, canvas);
      const w = canvas.width, h = canvas.height;

      gl.clearColor(0.02, 0.02, 0.06, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
       gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);

      const aspect = w / h;
      mat4.perspective(projMatrix, Math.PI / 4, aspect, 0.1, 100);
      mat4.lookAt(viewMatrix, [0, -2, 8], [0, 0, 0], [0, 1, 0]);
      mat4.identity(mvpMatrix);
      mat4.rotateX(mvpMatrix, rotX);
      mat4.multiply(mvpMatrix, viewMatrix, mvpMatrix);
      mat4.multiply(mvpMatrix, projMatrix, mvpMatrix);

      // 旋臂粒子
      if (galaxyProgram) {
        gl.useProgram(galaxyProgram);
        gl.uniformMatrix4fv(gl.getUniformLocation(galaxyProgram, 'u_mvp'), false, mvpMatrix);
        gl.uniform1f(gl.getUniformLocation(galaxyProgram, 'u_time'), t * 0.001);
        gl.uniform2f(gl.getUniformLocation(galaxyProgram, 'u_mouse'), mouseX, mouseY);
        gl.uniform1f(gl.getUniformLocation(galaxyProgram, 'u_mouseDown'), mouseDown);

        gl.bindBuffer(gl.ARRAY_BUFFER, galaxyBuf);
        const stride = 24;
        const aAngle = gl.getAttribLocation(galaxyProgram, 'a_angle');
        const aRadius = gl.getAttribLocation(galaxyProgram, 'a_radius');
        const aSize = gl.getAttribLocation(galaxyProgram, 'a_size');
        const aColor = gl.getAttribLocation(galaxyProgram, 'a_color');
        if (aAngle >= 0) { gl.enableVertexAttribArray(aAngle); gl.vertexAttribPointer(aAngle, 1, gl.FLOAT, false, stride, 0); }
        if (aRadius >= 0) { gl.enableVertexAttribArray(aRadius); gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, stride, 4); }
        if (aSize >= 0) { gl.enableVertexAttribArray(aSize); gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 8); }
        if (aColor >= 0) { gl.enableVertexAttribArray(aColor); gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 12); }

        gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
      }

      // 核球
      if (coreProgram) {
        gl.useProgram(coreProgram);
        gl.uniformMatrix4fv(gl.getUniformLocation(coreProgram, 'u_mvp'), false, mvpMatrix);
        gl.uniform1f(gl.getUniformLocation(coreProgram, 'u_time'), t * 0.001);

        gl.bindBuffer(gl.ARRAY_BUFFER, coreBuf);
        const stride = 24;
        const aAngle = gl.getAttribLocation(coreProgram, 'a_angle');
        const aRadius = gl.getAttribLocation(coreProgram, 'a_radius');
        const aSize = gl.getAttribLocation(coreProgram, 'a_size');
        const aColor = gl.getAttribLocation(coreProgram, 'a_color');
        if (aAngle >= 0) { gl.enableVertexAttribArray(aAngle); gl.vertexAttribPointer(aAngle, 1, gl.FLOAT, false, stride, 0); }
        if (aRadius >= 0) { gl.enableVertexAttribArray(aRadius); gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, stride, 4); }
        if (aSize >= 0) { gl.enableVertexAttribArray(aSize); gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 8); }
        if (aColor >= 0) { gl.enableVertexAttribArray(aColor); gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 12); }

        gl.drawArrays(gl.POINTS, 0, CORE_COUNT);
      }

      gl.depthMask(true);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mousemove', onMove);
      try {
        gl.deleteBuffer(galaxyBuf);
        gl.deleteBuffer(coreBuf);
        if (galaxyProgram) gl.deleteProgram(galaxyProgram);
        if (coreProgram) gl.deleteProgram(coreProgram);
      } catch (e) { console.warn("[SpiralGalaxy] cleanup error:", (e && e.message) || e); }
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: '100%', height: '100%', display: 'block' }
  });
}

window.SpiralGalaxy = SpiralGalaxy;
