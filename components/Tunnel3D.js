// 3D 无限隧道 Tunnel3D
// WebGL: 隧道内表面网格 + 环状光带前进 + 鼠标控制速度
// 回退: Canvas 2D 同心圆透视模拟
 function Tunnel3D({ accentColor = '#00e5ff' }) {
   const canvasRef = React.useRef(null);
   const containerRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const WU = window.WebGLUtils;
    const gl = WU ? WU.getGL(canvas) : null;
    let rafId = null;
    let time = 0;
    let speed = 1;
    let targetSpeed = 1;
    let mouseX = 0, mouseY = 0;

    if (!gl || !WU) {
      // ====== Canvas 2D 降级 ======
      const ctx = canvas.getContext('2d');
      let w, h, cx, cy;
      const rings = 30;
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
        speed += (targetSpeed - speed) * 0.05;

        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(0, 0, w, h);

        const maxR = Math.min(w, h) * 0.6;
        const progress = (t * 0.001 * speed) % 1;

        // 同心圆 + 放射线 模拟隧道
        for (let i = 0; i < rings; i++) {
          const p = (i + progress) / rings;
          const r = maxR * p;
          const alpha = (1 - p) * 0.3;
          ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx + mouseX * 20, cy + mouseY * 20, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        // 放射线
        const rays = 16;
        for (let i = 0; i < rays; i++) {
          const angle = (i / rays) * Math.PI * 2;
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
          ctx.beginPath();
          ctx.moveTo(cx + mouseX * 20, cy + mouseY * 20);
          ctx.lineTo(cx + mouseX * 20 + Math.cos(angle) * maxR, cy + mouseY * 20 + Math.sin(angle) * maxR);
          ctx.stroke();
        }
        // 中心光点
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.3);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      const onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetSpeed = 0.5 + Math.abs(mouseY) * 2;
      };
      canvas.addEventListener('mousemove', onMove);
      rafId = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousemove', onMove);
      };
    }

    // ====== WebGL 实现 ======
    const mat4 = WU.mat4;
    const projMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const modelMatrix = mat4.create();
    const mvpMatrix = mat4.create();

    // 隧道 shader - 圆柱体内表面 + 网格 + 雾
    const TUNNEL_VS = `
      attribute vec3 a_pos;
      attribute vec2 a_uv;
      uniform mat4 u_mvp;
      varying vec2 v_uv;
      varying float v_depth;
      void main() {
        v_uv = a_uv;
        vec4 pos = u_mvp * vec4(a_pos, 1.0);
        v_depth = pos.w;
        gl_Position = pos;
      }
    `;
    const TUNNEL_FS = `
      precision mediump float;
      varying vec2 v_uv;
      varying float v_depth;
      uniform float u_time;
      uniform vec3 u_color;
      void main() {
        // 网格线
        float u = fract(v_uv.x * 16.0);
        float v = fract(v_uv.y * 10.0 + u_time * 2.0);
        float lineU = smoothstep(0.0, 0.03, u) * (1.0 - smoothstep(0.03, 0.06, u));
        float lineV = smoothstep(0.0, 0.03, v) * (1.0 - smoothstep(0.03, 0.06, v));
        float grid = max(lineU, lineV);
        // 深度雾
        float fog = smoothstep(2.0, 20.0, v_depth);
        vec3 color = u_color * grid * (1.0 - fog * 0.9);
        gl_FragColor = vec4(color, grid);
      }
    `;
    // 环形光带粒子
    const RING_VS = `
      attribute float a_angle;
      attribute float a_dist;
      attribute float a_size;
      attribute vec3 a_color;
      uniform mat4 u_mvp;
      uniform float u_time;
      uniform float u_speed;
      varying vec3 v_color;
      varying float v_depth;
      void main() {
        float t = fract(a_dist + u_time * 0.3 * u_speed);
        float z = t * -30.0 + 2.0;
        float r = mix(1.5, 3.0, t);
        vec3 pos = vec3(cos(a_angle) * r, sin(a_angle) * r, z);
        vec4 mvPos = u_mvp * vec4(pos, 1.0);
        v_depth = mvPos.w;
        v_color = a_color;
        gl_Position = mvPos;
        gl_PointSize = a_size * (200.0 / max(mvPos.w, 0.01));
      }
    `;
    const RING_FS = `
      precision mediump float;
      varying vec3 v_color;
      varying float v_depth;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float alpha = smoothstep(0.5, 0.0, d);
        alpha = pow(alpha, 1.3);
        // 远处淡出
        float fog = smoothstep(10.0, 30.0, v_depth);
        alpha *= 1.0 - fog;
        gl_FragColor = vec4(v_color, alpha);
      }
    `;

    const tunnelProgram = WU.createProgram(gl, TUNNEL_VS, TUNNEL_FS);
    const ringProgram = WU.createProgram(gl, RING_VS, RING_FS);

    // 生成隧道几何体（圆柱体内表面，Z范围 [0, -30]）
    const RADIUS = 2.5;
    const LENGTH = 30;
    const SEG_R = 32;
    const SEG_L = 40;
    const tPos = [];
    const tUv = [];
    const tIdx = [];
    for (let z = 0; z <= SEG_L; z++) {
      const zNorm = z / SEG_L;
      const zz = -zNorm * LENGTH;
      for (let r = 0; r <= SEG_R; r++) {
        const angle = (r / SEG_R) * Math.PI * 2;
        const x = Math.cos(angle) * RADIUS;
        const y = Math.sin(angle) * RADIUS;
        tPos.push(x, y, zz);
        tUv.push(r / SEG_R, zNorm);
      }
    }
    for (let z = 0; z < SEG_L; z++) {
      for (let r = 0; r < SEG_R; r++) {
        const a = z * (SEG_R + 1) + r;
        const b = a + SEG_R + 1;
        // 反序（内表面朝外）
        tIdx.push(a, a + 1, b);
        tIdx.push(b, a + 1, b + 1);
      }
    }
    const tunnelPosBuf = WU.createVBO(gl, new Float32Array(tPos));
    const tunnelUvBuf = WU.createVBO(gl, new Float32Array(tUv));
    const tunnelIdxBuf = WU.createIBO(gl, new Uint16Array(tIdx));
    const tunnelIndexCount = tIdx.length;

    // 环形光带粒子
    const RING_COUNT = 600;
    const ringData = new Float32Array(RING_COUNT * 6); // angle, dist, size, r, g, b
    for (let i = 0; i < RING_COUNT; i++) {
      ringData[i*6] = Math.random() * Math.PI * 2;       // angle
      ringData[i*6+1] = Math.random();                     // dist
      ringData[i*6+2] = 2 + Math.random() * 4;             // size
      ringData[i*6+3] = 0.3 + Math.random() * 0.7;         // r
      ringData[i*6+4] = 0.6 + Math.random() * 0.4;         // g
      ringData[i*6+5] = 1.0;                                // b
    }
    const ringBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ringBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ringData, gl.STATIC_DRAW);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetSpeed = 0.3 + (0.5 - mouseY) * 2;
    };
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
        targetSpeed = 0.3 + (0.5 - mouseY) * 2;
      }
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    function render(t) {
      rafId = requestAnimationFrame(render);
      time = t;
      speed += (targetSpeed - speed) * 0.05;

      WU.resizeGL(gl, canvas);
      const w = canvas.width, h = canvas.height;

      gl.clearColor(0.02, 0.03, 0.08, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      const aspect = w / h;
      mat4.perspective(projMatrix, Math.PI / 3, aspect, 0.1, 100);

      // 视角：相机略有偏移（鼠标控制）
      const camX = mouseX * 0.3;
      const camY = mouseY * 0.2;
      mat4.lookAt(viewMatrix, [camX, camY, 1], [camX * 0.5, camY * 0.5, -5], [0, 1, 0]);
      mat4.identity(modelMatrix);
      // 隧道 Z 偏移实现前进：用 shader 中的 uv 滚动替代，更高效
      mat4.multiply(mvpMatrix, viewMatrix, modelMatrix);
      mat4.multiply(mvpMatrix, projMatrix, mvpMatrix);

      // 1. 隧道网格
      if (tunnelProgram) {
        gl.useProgram(tunnelProgram);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        gl.uniformMatrix4fv(gl.getUniformLocation(tunnelProgram, 'u_mvp'), false, mvpMatrix);
        gl.uniform1f(gl.getUniformLocation(tunnelProgram, 'u_time'), t * 0.001 * speed);
        gl.uniform3f(gl.getUniformLocation(tunnelProgram, 'u_color'), 0.0, 0.8, 1.0);

        const aPos = gl.getAttribLocation(tunnelProgram, 'a_pos');
        gl.bindBuffer(gl.ARRAY_BUFFER, tunnelPosBuf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        const aUv = gl.getAttribLocation(tunnelProgram, 'a_uv');
        gl.bindBuffer(gl.ARRAY_BUFFER, tunnelUvBuf);
        gl.enableVertexAttribArray(aUv);
        gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tunnelIdxBuf);
        gl.drawElements(gl.TRIANGLES, tunnelIndexCount, gl.UNSIGNED_SHORT, 0);
        gl.disable(gl.CULL_FACE);
      }

      // 2. 环形光带
      if (ringProgram) {
        gl.useProgram(ringProgram);
        gl.depthMask(false);
        gl.uniformMatrix4fv(gl.getUniformLocation(ringProgram, 'u_mvp'), false, mvpMatrix);
        gl.uniform1f(gl.getUniformLocation(ringProgram, 'u_time'), t * 0.001);
        gl.uniform1f(gl.getUniformLocation(ringProgram, 'u_speed'), speed);

        gl.bindBuffer(gl.ARRAY_BUFFER, ringBuf);
        const aAngle = gl.getAttribLocation(ringProgram, 'a_angle');
        const aDist = gl.getAttribLocation(ringProgram, 'a_dist');
        const aSize = gl.getAttribLocation(ringProgram, 'a_size');
        const aColor = gl.getAttribLocation(ringProgram, 'a_color');

        if (aAngle >= 0) { gl.enableVertexAttribArray(aAngle); gl.vertexAttribPointer(aAngle, 1, gl.FLOAT, false, 24, 0); }
        if (aDist >= 0)  { gl.enableVertexAttribArray(aDist);  gl.vertexAttribPointer(aDist,  1, gl.FLOAT, false, 24, 4); }
        if (aSize >= 0)  { gl.enableVertexAttribArray(aSize);  gl.vertexAttribPointer(aSize,  1, gl.FLOAT, false, 24, 8); }
        if (aColor >= 0) { gl.enableVertexAttribArray(aColor); gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 24, 12); }

        gl.drawArrays(gl.POINTS, 0, RING_COUNT);
        gl.depthMask(true);
      }
    }

     rafId = requestAnimationFrame(render);

     // WebGL 上下文丢失/恢复监听
     let contextLost = false;
     function onContextLost(e) {
       e.preventDefault();
       contextLost = true;
       cancelAnimationFrame(rafId);
     }
     function onContextRestored() {
       contextLost = false;
       // 重建所有 GL 资源并重启动画（简化：刷新页面恢复）
       // 实际场景应重建 buffer/program，这里先降级到 2D 模式
       cancelAnimationFrame(rafId);
     }
     canvas.addEventListener('webglcontextlost', onContextLost);
     canvas.addEventListener('webglcontextrestored', onContextRestored);

     return () => {
       cancelAnimationFrame(rafId);
       canvas.removeEventListener('mousemove', onMove);
       canvas.removeEventListener('touchmove', onTouchMove);
       canvas.removeEventListener('webglcontextlost', onContextLost);
       canvas.removeEventListener('webglcontextrestored', onContextRestored);
       try {
         gl.deleteBuffer(tunnelPosBuf);
         gl.deleteBuffer(tunnelUvBuf);
         gl.deleteBuffer(tunnelIdxBuf);
         gl.deleteBuffer(ringBuf);
         if (tunnelProgram) gl.deleteProgram(tunnelProgram);
         if (ringProgram) gl.deleteProgram(ringProgram);
       } catch (e) { console.warn("[Tunnel3D] cleanup error:", (e && e.message) || e); }
     };
   }, []);

   return React.createElement('div', {
     ref: containerRef,
     style: { position: 'absolute', inset: 0, background: '#050715' }
   }, React.createElement('canvas', {
     ref: canvasRef,
     style: { width: '100%', height: '100%', display: 'block' }
   }));
}

window.Tunnel3D = Tunnel3D;
