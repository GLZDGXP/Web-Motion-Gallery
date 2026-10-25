// 波浪文字 3D WaveText3D
// Canvas 2D: 文字在波浪曲面上起伏 + 色散辉光 + 鼠标控制波频
function WaveText3D({ accentColor = '#00e5ff' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let rafId = null;
    let time = 0;
    let waveFreq = 2;
    let targetWaveFreq = 2;
    let mouseX = 0;

    const TEXT = 'MOTION DESIGN';

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // 获取文字轮廓的像素采样（用于波浪变形）
    function getTextPixels() {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const octx = off.getContext('2d');
      const fontSize = Math.min(w / 10, h / 4);
      octx.fillStyle = '#fff';
      octx.font = `bold ${fontSize}px system-ui, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText(TEXT, w / 2, h / 2);
      return octx.getImageData(0, 0, w, h).data;
    }

    let textPixels = null;
    let textDataReady = false;
    setTimeout(() => { textPixels = getTextPixels(); textDataReady = true; }, 50);

    // 用离屏 canvas 做文字到粒子的转换
    function createTextParticles() {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const octx = off.getContext('2d');
      const fontSize = Math.min(w / 12, h / 5);
      octx.fillStyle = '#fff';
      octx.font = `bold ${fontSize}px system-ui, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText(TEXT, w / 2, h / 2);
      const data = octx.getImageData(0, 0, w, h).data;

      const particles = [];
      const step = Math.max(2, Math.floor(fontSize / 20));
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          if (data[idx + 3] > 128) {
            particles.push({
              baseX: x,
              baseY: y,
              size: step * 0.8,
            });
          }
        }
      }
      return particles;
    }

    let particles = [];
    let particlesReady = false;
    setTimeout(() => { particles = createTextParticles(); particlesReady = true; }, 50);

    function draw(t) {
      rafId = requestAnimationFrame(draw);
      time = t;
      waveFreq += (targetWaveFreq - waveFreq) * 0.05;

      ctx.fillStyle = 'rgba(8, 12, 25, 0.2)';
      ctx.fillRect(0, 0, w, h);

      if (!particlesReady) return;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 波浪参数
      const waveAmp = 15;
      const waveSpeed = t * 0.002;

      // 渲染粒子文字（R/G/B 通道偏移制造色散）
      for (let pass = 0; pass < 3; pass++) {
        const offsets = [
          { dx: -2, color: 'rgba(255, 80, 80, 0.6)', dyOff: 0 },
          { dx: 0, color: 'rgba(80, 255, 200, 0.7)', dyOff: 0.2 },
          { dx: 2, color: 'rgba(80, 150, 255, 0.6)', dyOff: 0.4 },
        ];
        const passInfo = offsets[pass];

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const x = p.baseX + passInfo.dx;
          const wave = Math.sin(p.baseX * 0.01 * waveFreq + waveSpeed + passInfo.dyOff) * waveAmp
                     + Math.sin(p.baseX * 0.02 * waveFreq + waveSpeed * 1.5) * waveAmp * 0.5;
          const y = p.baseY + wave;

          // 透视感：波浪高处更大更亮
          const depthFactor = 0.7 + (wave / waveAmp) * 0.3;
          const size = p.size * (0.8 + depthFactor * 0.4);

          ctx.fillStyle = passInfo.color;
          ctx.globalAlpha = 0.5 + depthFactor * 0.3;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      // 辉光层（更大更透明的粒子）
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const wave = Math.sin(p.baseX * 0.01 * waveFreq + waveSpeed) * waveAmp;
        const y = p.baseY + wave;
        const depthFactor = 0.7 + (wave / waveAmp) * 0.3;
        const size = p.size * 3 * (0.8 + depthFactor * 0.4);
        ctx.fillRect(p.baseX - size / 2, y - size / 2, size, size);
      }

      ctx.restore();
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      targetWaveFreq = 0.5 + mouseX * 5;
    };

    canvas.addEventListener('mousemove', onMove);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: '100%', height: '100%', display: 'block' }
  });
}

window.WaveText3D = WaveText3D;
