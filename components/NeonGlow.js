(()=>{function $({accentColor:e="#00e5ff",motionLevel:i="rich"}){const[o,a]=React.useState(!0),[x,h]=React.useState({x:.5,y:.5}),[f,b]=React.useState(!1),d=React.useRef(null),l=React.useRef([]),u=i==="subtle"?4e3:i==="intense"?1500:2500;React.useEffect(()=>{if(i==="subtle")return;const s=()=>{l.current.forEach(r=>clearTimeout(r)),l.current=[]},n=(r,c)=>{const g=setTimeout(r,c);return l.current.push(g),g},p=setInterval(()=>{a(!1),n(()=>a(!0),80),i==="intense"&&n(()=>{a(!1),n(()=>a(!0),60)},200)},u+Math.random()*1e3);return()=>{clearInterval(p),s()}},[u,i]);const m=s=>{if(!d.current)return;const n=d.current.getBoundingClientRect(),p=(s.clientX-n.left)/n.width,r=(s.clientY-n.top)/n.height;h({x:p,y:r});const c=Math.sqrt((p-.5)**2+(r-.5)**2);b(c<.4)},v=PerfMonitor.isLow(),t="#ff4d9d",w=v?2:3,y=o?f?1.3:1:.4;return React.createElement("div",{ref:d,className:"neon-container",onMouseMove:m,onMouseLeave:()=>b(!1)},React.createElement("style",null,`
        .neon-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            linear-gradient(180deg, #080710 0%, #0f0a1a 100%);
          perspective: 800px;
        }

        /* Brick wall texture */
        .neon-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 30px;
          opacity: 0.5;
        }
        .neon-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5) 100%);
          pointer-events: none;
        }

        .neon-stage {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transform: rotateX(${x.y*-6+3}deg) rotateY(${x.x*6-3}deg);
          transition: transform 0.3s ease-out;
        }

        .neon-text {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #fff;
          transition: opacity 0.08s linear, text-shadow 0.2s ease-out;
          opacity: ${o?y:.4};
          animation: neon-breath 4s ease-in-out infinite;
          text-shadow: ${o?`0 0 4px #fff, 0 0 12px ${e}, 0 0 28px ${e}, 0 0 60px ${hexToRgba(e,f?.5:.3)}`:`0 0 2px #fff, 0 0 8px ${e}`};
        }

        @keyframes neon-breath {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(0.88); }
        }

        .neon-sub {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 6px;
          color: #fff;
          text-transform: uppercase;
          text-shadow: 0 0 4px #fff, 0 0 10px ${t}, 0 0 20px ${t};
          opacity: ${o?.9:.2};
          transition: opacity 0.08s linear;
        }

        /* Neon tube frame */
        .neon-frame {
          position: absolute;
          inset: 24px;
          border: 2px solid transparent;
          border-radius: 4px;
          pointer-events: none;
        }
        .neon-frame::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 4px;
          border: 1px solid ${e};
          box-shadow:
            inset 0 0 20px ${hexToRgba(e,.2)},
            0 0 20px ${hexToRgba(e,.3)},
            0 0 40px ${hexToRgba(e,.15)};
           opacity: ${o?1:.4};
           animation: neon-breath 4s ease-in-out infinite;
           transition: opacity 0.1s linear;
        }
        .neon-frame::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 6px;
          border: 1px solid ${t};
          opacity: 0.3;
          box-shadow:
            0 0 20px ${hexToRgba(t,.2)};
        }

        /* Corner accents */
        .neon-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid ${e};
          box-shadow: 0 0 10px ${hexToRgba(e,.5)};
        }
        .neon-corner.tl { top: 32px; left: 32px; border-right: none; border-bottom: none; }
        .neon-corner.tr { top: 32px; right: 32px; border-left: none; border-bottom: none; }
        .neon-corner.bl { bottom: 32px; left: 32px; border-right: none; border-top: none; }
        .neon-corner.br { bottom: 32px; right: 32px; border-left: none; border-top: none; }

        /* Ground reflection */
        .neon-reflection {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleY(-1);
          transform-origin: bottom center;
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 700;
          letter-spacing: 4px;
          color: ${e};
          opacity: 0.15;
          filter: blur(4px);
          z-index: 1;
          white-space: nowrap;
        }

        /* Neon cable / wire coming from top */
        .neon-cable {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 40px;
          background: linear-gradient(180deg, #1a1a2e 0%, ${e} 100%);
          box-shadow: 0 0 8px ${hexToRgba(e,.5)};
        }

        .neon-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 4px 10px;
          border: 1px solid ${t};
          color: ${t};
          border-radius: 4px;
          text-shadow: 0 0 8px ${hexToRgba(t,.5)};
          box-shadow:
            0 0 10px ${hexToRgba(t,.2)},
            inset 0 0 10px ${hexToRgba(t,.05)};
          letter-spacing: 1px;
        }
      `),React.createElement("div",{className:"neon-cable"}),React.createElement("div",{className:"neon-frame"}),React.createElement("div",{className:"neon-corner tl"}),React.createElement("div",{className:"neon-corner tr"}),React.createElement("div",{className:"neon-corner bl"}),React.createElement("div",{className:"neon-corner br"}),React.createElement("div",{className:"neon-badge"},"NEON \xB7 2025"),React.createElement("div",{className:"neon-stage"},React.createElement("div",{className:"neon-text"},"NEON"),React.createElement("div",{className:"neon-sub"},"Cyberpunk Aesthetic")),React.createElement("div",{className:"neon-reflection",style:{opacity:o?.15:.05}},"NEON"))}window.NeonGlow=$;})();
