// ============================================================
// WebGL Utils - 轻量 WebGL 工具库（零依赖）
// 提供：mat4 矩阵、shader 编译、VBO 管理、context 丢失恢复、DPR 自适应
// ============================================================

const WebGLUtils = (() => {
  // ---- mat4 最小矩阵库 ----
  const mat4 = {
    create() { return new Float32Array(16); },
    identity(out) {
      out[0]=1; out[1]=0; out[2]=0; out[3]=0;
      out[4]=0; out[5]=1; out[6]=0; out[7]=0;
      out[8]=0; out[9]=0; out[10]=1; out[11]=0;
      out[12]=0; out[13]=0; out[14]=0; out[15]=1;
      return out;
    },
    perspective(out, fovy, aspect, near, far) {
      // 边界防护：避免 fovy 接近 0/π 导致 tan 趋近 0/无穷
      const safeFovy = Math.max(0.01, Math.min(Math.PI - 0.01, fovy));
      const f = 1.0 / Math.tan(safeFovy / 2);
      const nf = Math.max(near - far, -1e10); // near - far 恒为负，防 -0
      const safeAspect = Math.max(aspect, 0.001);
      out[0] = f / safeAspect; out[1] = 0; out[2] = 0; out[3] = 0;
      out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
      out[8] = 0; out[9] = 0; out[10] = (far + near) / nf; out[11] = -1;
      out[12] = 0; out[13] = 0; out[14] = (2 * far * near) / nf; out[15] = 0;
      return out;
    },
    lookAt(out, eye, center, up) {
      let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
      z0 = eye[0] - center[0]; z1 = eye[1] - center[1]; z2 = eye[2] - center[2];
      len = 1 / Math.sqrt(z0*z0 + z1*z1 + z2*z2);
      z0 *= len; z1 *= len; z2 *= len;
      x0 = up[1]*z2 - up[2]*z1; x1 = up[2]*z0 - up[0]*z2; x2 = up[0]*z1 - up[1]*z0;
      len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
      if (len) { len = 1/len; x0 *= len; x1 *= len; x2 *= len; }
      y0 = z1*x2 - z2*x1; y1 = z2*x0 - z0*x2; y2 = z0*x1 - z1*x0;
      out[0]=x0; out[1]=y0; out[2]=z0; out[3]=0;
      out[4]=x1; out[5]=y1; out[6]=z1; out[7]=0;
      out[8]=x2; out[9]=y2; out[10]=z2; out[11]=0;
      out[12]=-(x0*eye[0]+x1*eye[1]+x2*eye[2]);
      out[13]=-(y0*eye[0]+y1*eye[1]+y2*eye[2]);
      out[14]=-(z0*eye[0]+z1*eye[1]+z2*eye[2]);
      out[15]=1;
      return out;
    },
    multiply(out, a, b) {
      const a0=a[0],a1=a[1],a2=a[2],a3=a[3],a4=a[4],a5=a[5],a6=a[6],a7=a[7];
      const a8=a[8],a9=a[9],a10=a[10],a11=a[11],a12=a[12],a13=a[13],a14=a[14],a15=a[15];
      let b0=b[0],b1=b[1],b2=b[2],b3=b[3];
      out[0] = a0*b0 + a4*b1 + a8*b2 + a12*b3;
      out[1] = a1*b0 + a5*b1 + a9*b2 + a13*b3;
      out[2] = a2*b0 + a6*b1 + a10*b2 + a14*b3;
      out[3] = a3*b0 + a7*b1 + a11*b2 + a15*b3;
      b0=b[4];b1=b[5];b2=b[6];b3=b[7];
      out[4] = a0*b0 + a4*b1 + a8*b2 + a12*b3;
      out[5] = a1*b0 + a5*b1 + a9*b2 + a13*b3;
      out[6] = a2*b0 + a6*b1 + a10*b2 + a14*b3;
      out[7] = a3*b0 + a7*b1 + a11*b2 + a15*b3;
      b0=b[8];b1=b[9];b2=b[10];b3=b[11];
      out[8] = a0*b0 + a4*b1 + a8*b2 + a12*b3;
      out[9] = a1*b0 + a5*b1 + a9*b2 + a13*b3;
      out[10] = a2*b0 + a6*b1 + a10*b2 + a14*b3;
      out[11] = a3*b0 + a7*b1 + a11*b2 + a15*b3;
      b0=b[12];b1=b[13];b2=b[14];b3=b[15];
      out[12] = a0*b0 + a4*b1 + a8*b2 + a12*b3;
      out[13] = a1*b0 + a5*b1 + a9*b2 + a13*b3;
      out[14] = a2*b0 + a6*b1 + a10*b2 + a14*b3;
      out[15] = a3*b0 + a7*b1 + a11*b2 + a15*b3;
      return out;
    },
    rotateY(out, a) {
      const s = Math.sin(a), c = Math.cos(a);
      const a00=out[0],a01=out[1],a02=out[2],a03=out[3];
      const a20=out[8],a21=out[9],a22=out[10],a23=out[11];
      out[0] = a00*c - a20*s;
      out[1] = a01*c - a21*s;
      out[2] = a02*c - a22*s;
      out[3] = a03*c - a23*s;
      out[8] = a00*s + a20*c;
      out[9] = a01*s + a21*c;
      out[10] = a02*s + a22*c;
      out[11] = a03*s + a23*c;
      return out;
    },
    rotateX(out, a) {
      const s = Math.sin(a), c = Math.cos(a);
      const a10=out[4],a11=out[5],a12=out[6],a13=out[7];
      const a20=out[8],a21=out[9],a22=out[10],a23=out[11];
      out[4] = a10*c + a20*s;
      out[5] = a11*c + a21*s;
      out[6] = a12*c + a22*s;
      out[7] = a13*c + a23*s;
      out[8] = a20*c - a10*s;
      out[9] = a21*c - a11*s;
      out[10] = a22*c - a12*s;
      out[11] = a23*c - a13*s;
      return out;
    },
    translate(out, v) {
      const x=v[0], y=v[1], z=v[2];
      out[12] = out[0]*x + out[4]*y + out[8]*z + out[12];
      out[13] = out[1]*x + out[5]*y + out[9]*z + out[13];
      out[14] = out[2]*x + out[6]*y + out[10]*z + out[14];
      out[15] = out[3]*x + out[7]*y + out[11]*z + out[15];
      return out;
    },
    scale(out, v) {
      const x=v[0], y=v[1], z=v[2];
      out[0]*=x; out[1]*=x; out[2]*=x; out[3]*=x;
      out[4]*=y; out[5]*=y; out[6]*=y; out[7]*=y;
      out[8]*=z; out[9]*=z; out[10]*=z; out[11]*=z;
      return out;
    },
    copy(out, m) { out.set(m); return out; },
  };

  // ---- Shader 编译 ----
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[WebGL] shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[WebGL] program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  // ---- DPR 自适应 resize ----
  function resizeGL(gl, canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      return true;
    }
    return false;
  }

  // ---- 获取 WebGL 上下文（带降级）----
  function getGL(canvas) {
    const attrs = { antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', attrs);
    if (!gl) gl = canvas.getContext('webgl', attrs);
    if (!gl) gl = canvas.getContext('experimental-webgl', attrs);
    return gl;
  }

  // ---- 生成球体顶点（经纬度法）----
  function makeSphere(radius = 1, latBands = 30, longBands = 40) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let lat = 0; lat <= latBands; lat++) {
      const theta = lat * Math.PI / latBands;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= longBands; lon++) {
        const phi = lon * 2 * Math.PI / longBands;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        const x = cosP * sinT;
        const y = cosT;
        const z = sinP * sinT;

        positions.push(x * radius, y * radius, z * radius);
        normals.push(x, y, z);
        uvs.push(lon / longBands, lat / latBands);
      }
    }

    for (let lat = 0; lat < latBands; lat++) {
      for (let lon = 0; lon < longBands; lon++) {
        const first = lat * (longBands + 1) + lon;
        const second = first + longBands + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
      vertexCount: indices.length,
    };
  }

  // ---- 生成球体 wireframe 线条（经纬线）----
  function makeSphereWireframe(radius = 1, latLines = 16, longLines = 24) {
    const positions = [];
    // 纬线
    for (let i = 1; i < latLines; i++) {
      const theta = (i / latLines) * Math.PI;
      const y = Math.cos(theta) * radius;
      const r = Math.sin(theta) * radius;
      const segs = longLines;
      for (let j = 0; j <= segs; j++) {
        const phi = (j / segs) * Math.PI * 2;
        positions.push(Math.cos(phi) * r, y, Math.sin(phi) * r);
      }
    }
    // 经线
    for (let i = 0; i < longLines; i++) {
      const phi = (i / longLines) * Math.PI * 2;
      const segs = latLines * 2;
      for (let j = 0; j <= segs; j++) {
        const theta = (j / segs) * Math.PI;
        const y = Math.cos(theta) * radius;
        const r = Math.sin(theta) * radius;
        positions.push(Math.cos(phi) * r, y, Math.sin(phi) * r);
      }
    }
    return { positions: new Float32Array(positions), vertexCount: positions.length / 3 };
  }

  // ---- 生成平面网格 ----
  function makePlaneGrid(width, height, segW, segH) {
    const positions = [];
    const uvs = [];
    const indices = [];
    for (let y = 0; y <= segH; y++) {
      for (let x = 0; x <= segW; x++) {
        const u = x / segW;
        const v = y / segH;
        positions.push((u - 0.5) * width, (v - 0.5) * height, 0);
        uvs.push(u, v);
      }
    }
    for (let y = 0; y < segH; y++) {
      for (let x = 0; x < segW; x++) {
        const a = y * (segW + 1) + x;
        const b = a + segW + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return {
      positions: new Float32Array(positions),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
      vertexCount: indices.length,
    };
  }

  // ---- 创建 VBO ----
  function createVBO(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  }

  function createIBO(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  }

  // ---- 粒子精灵着色器（通用）----
  const PARTICLE_VS = `
    attribute vec3 a_pos;
    attribute float a_size;
    attribute vec3 a_color;
    uniform mat4 u_mvp;
    varying vec3 v_color;
    void main() {
      v_color = a_color;
      vec4 pos = u_mvp * vec4(a_pos, 1.0);
      gl_Position = pos;
      gl_PointSize = a_size * (300.0 / max(pos.w, 0.01));
    }
  `;

  const PARTICLE_FS = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      float alpha = smoothstep(0.5, 0.0, d);
      alpha = pow(alpha, 1.5);
      gl_FragColor = vec4(v_color, alpha);
    }
  `;

  // ---- 离屏 Canvas 粒子 sprite 缓存（Canvas 2D 优化用）----
  function makeParticleSprite(size, color, glow = true) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const cx = size / 2, cy = size / 2;
    if (glow) {
      // 先以实色绘制，再用 destination-out 径向渐变把边缘擦成透明。
      // 该方式对任意颜色格式（hex / rgb / rgba / hsl）均安全，
      // 旧实现对颜色字符串做 ')' / 'rgb' 替换，传入 rgba(...) 时会拼出非法颜色导致 addColorStop 抛错。
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.3, 'rgba(0,0,0,0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  }

  return {
    mat4,
    createShader,
    createProgram,
    resizeGL,
    getGL,
    makeSphere,
    makeSphereWireframe,
    makePlaneGrid,
    createVBO,
    createIBO,
    PARTICLE_VS,
    PARTICLE_FS,
    makeParticleSprite,
  };
})();

window.WebGLUtils = WebGLUtils;
