// 星环飞行 RingFlight
// WebGL: 粒子环带 + 穿过视角 + 鼠标控制视角
function RingFlight({ accentColor = '#b14dff' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const WU = window.WebGLUtils;
    const gl = WU ? WU.getGL(canvas) : null;
    let rafId = null;
    let time = 0;
    let mouseX = 0, mouseY = 0;

    if (!gl || !WU) {
      // Canvas 2D 降级
      const ctx = canvas.getContext('2d');
      let w, h, cx, cy;
      const RINGS = 40;
      const rings = Array.from({ length: RINGS }, (_, i) => ({
        z: i / RINGS,
        r: 0.3 + Math.random() * 0.7,
        color: `hsl(${Math.floor(Math.random() * 60 + 240)}, 80%, 70%)`,
        dots: 20 + Math.floor(Math.random() * 30),
      }));
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
        time = t;
        ctx.fillStyle = 'rgba(5, 5, 20, 0.2)';
        ctx.fillRect(0, 0, w, h);

        const maxR = Math.min(w, h) * 0.6;
        rings.forEach((ring, i) => {
          ring.z += 0.003;
          if (ring.z > 1) ring.z = 0;
          const depth = ring.z;
          const scale = 1 / (1 - depth * 0.9);
          const r = maxR * depth * ring.r;
          const alpha = depth * 0.5;
          const offsetX = mouseX * 50 * depth;
          const offsetY = mouseY * 30 * depth;
          ctx.strokeStyle = ring.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
          ctx.lineWidth = 1 + scale * 0.5;
          ctx.beginPath();
          ctx.ellipse(cx + offsetX, cy + offsetY, r, r * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
          // 亮点
          for (let d = 0; d < ring.dots; d++) {
            const a = (d / ring.dots) * Math.PI * 2 + t * 0.0005;
            const dx = cx + offsetX + Math.cos(a) * r;
            const dy = cy + offsetY + Math.sin(a) * r * 0.4;
            ctx.fillStyle = ring.color.replace(')', `, ${alpha * 2})`).replace('hsl', 'hsla');
            ctx.beginPath();
            ctx.arc(dx, dy, 1 + scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
      const onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
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
    const mvpMatrix = mat4.create();

    const RING_VS = `
      attribute float a_angle;
      attribute float a_radius;
      attribute float a_ringZ;
      attribute float a_size;
      attribute float a_hue;
      uniform mat4 u_mvp;
      uniform float u_time;
      uniform float u_speed;
      varying float v_hue;
      varying float v_depth;
      float hue2rgb(float p, float q, float t) {
        if(t < 0.0) t += 1.0;
        if(t > 1.0) t -= 1.0;
        if(t < 1.0/6.0) return p + (q - p) * 6.0 * t;
        if(t < 1.0/2.0) return q;
        if(t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
        return p;
      }
      vec3 hsl2rgb(float h, float s, float l) {
        float p, q;
        if(s == 0.0) return vec3(l);
        q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        p = 2.0 * l - q;
        return vec3(
          hue2rgb(p, q, h + 1.0/3.0),
          hue2rgb(p, q, h),
          hue2rgb(p, q, h - 1.0/3.0)
        );
      }
      void main() {
        float zOffset = fract(u_time * u_speed + a_ringZ) * -50.0;
        // 环波动
        float wobble = sin(a_angle * 3.0 + u_time + a_ringZ * 10.0) * 0.15
                     + sin(a_angle * 5.0 + u_time * 1.3 + a_ringZ * 7.0) * 0.08;
        float r = a_radius + wobble;
        vec3 pos = vec3(cos(a_angle) * r, sin(a_angle) * r, zOffset);
        vec4 mvPos = u_mvp * vec4(pos, 1.0);
        v_depth = mvPos.w;
        v_hue = a_hue + u_time * 0.1;
        gl_Position = mvPos;
        gl_PointSize = a_size * (150.0 / max(mvPos.w, 0.01));
      }
    `;
    const RING_FS = `
      precision mediump float;
      varying float v_hue;
      varying float v_depth;
      float hue2rgb(float p, float q, float t) {
        if(t < 0.0) t += 1.0;
        if(t > 1.0) t -= 1.0;
        if(t < 1.0/6.0) return p + (q - p) * 6.0 * t;
        if(t < 1.0/2.0) return q;
        if(t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
        return p;
      }
      vec3 hsl2rgb(float h, float s, float l) {
        float p, q;
        if(s == 0.0) return vec3(l);
        q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        p = 2.0 * l - q;
        return vec3(
          hue2rgb(p, q, h + 1.0/3.0),
          hue2rgb(p, q, h),
          hue2rgb(p, q, h - 1.0/3.0)
        );
      }
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float alpha = smoothstep(0.5, 0.0, d);
        alpha = pow(alpha, 1.3);
        // 深度淡出
        float fog = smoothstep(20.0, 50.0, v_depth);
        alpha *= 1.0 - fog;
        vec3 color = hsl2rgb(fract(v_hue), 0.8, 0.7);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const ringProgram = WU.createProgram(gl, RING_VS, RING_FS);

    // 生成环粒子
    const RING_COUNT = 12000;
    const RINGS_NUM = 30;
    const ringData = new Float32Array(RING_COUNT * 5); // angle, radius, ringZ, size, hue

    let idx = 0;
    for (let r = 0; r < RINGS_NUM; r++) {
      const ringZ = r / RINGS_NUM;
      const particlesInRing = Math.floor(RING_COUNT / RINGS_NUM);
      for (let i = 0; i < particlesInRing && idx < RING_COUNT; i++, idx++) {
        const angle = (i / particlesInRing) * Math.PI * 2 + Math.random() * 0.1;
        const radius = 2 + Math.random() * 1.5;
        ringData[idx*5] = angle;
        ringData[idx*5+1] = radius;
        ringData[idx*5+2] = ringZ + Math.random() * 0.02;
        ringData[idx*5+3] = 1.5 + Math.random() * 2.5;
        ringData[idx*5+4] = (r / RINGS_NUM) * 0.3 + 0.6; // hue 范围
      }
    }

    const ringBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ringBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ringData, gl.STATIC_DRAW);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
      }
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    function render(t) {
      rafId = requestAnimationFrame(render);
      time = t;
      WU.resizeGL(gl, canvas);
      const w = canvas.width, h = canvas.height;

      gl.clearColor(0.02, 0.01, 0.08, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.depthMask(false);

      const aspect = w / h;
      mat4.perspective(projMatrix, Math.PI / 3, aspect, 0.1, 100);
      // 相机偏移（鼠标控制视角）
      const camX = mouseX * 1.5;
      const camY = -mouseY * 0.8;
      mat4.lookAt(viewMatrix, [camX, camY, 1.5], [camX * 0.3, camY * 0.3, -10], [0, 1, 0]);
      mat4.multiply(mvpMatrix, projMatrix, viewMatrix);

      if (ringProgram) {
        gl.useProgram(ringProgram);
        gl.uniformMatrix4fv(gl.getUniformLocation(ringProgram, 'u_mvp'), false, mvpMatrix);
        gl.uniform1f(gl.getUniformLocation(ringProgram, 'u_time'), t * 0.001);
        gl.uniform1f(gl.getUniformLocation(ringProgram, 'u_speed'), 0.3);

        gl.bindBuffer(gl.ARRAY_BUFFER, ringBuf);
        const stride = 20;
        const aAngle = gl.getAttribLocation(ringProgram, 'a_angle');
        const aRadius = gl.getAttribLocation(ringProgram, 'a_radius');
        const aRingZ = gl.getAttribLocation(ringProgram, 'a_ringZ');
        const aSize = gl.getAttribLocation(ringProgram, 'a_size');
        const aHue = gl.getAttribLocation(ringProgram, 'a_hue');

        if (aAngle >= 0) { gl.enableVertexAttribArray(aAngle); gl.vertexAttribPointer(aAngle, 1, gl.FLOAT, false, stride, 0); }
        if (aRadius >= 0) { gl.enableVertexAttribArray(aRadius); gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, stride, 4); }
        if (aRingZ >= 0) { gl.enableVertexAttribArray(aRingZ); gl.vertexAttribPointer(aRingZ, 1, gl.FLOAT, false, stride, 8); }
        if (aSize >= 0) { gl.enableVertexAttribArray(aSize); gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 12); }
        if (aHue >= 0) { gl.enableVertexAttribArray(aHue); gl.vertexAttribPointer(aHue, 1, gl.FLOAT, false, stride, 16); }

        gl.drawArrays(gl.POINTS, 0, idx);
      }

      gl.depthMask(true);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      try {
        gl.deleteBuffer(ringBuf);
        if (ringProgram) gl.deleteProgram(ringProgram);
      } catch (e) {}
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: '100%', height: '100%', display: 'block' }
  });
}

window.RingFlight = RingFlight;
