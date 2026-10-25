(()=>{function x({accentColor:t="#00e5ff"}){const a=React.useRef(null),c=React.useRef(null),[e,s]=React.useState({rx:0,ry:0,gx:50,gy:50});return React.createElement("div",{ref:c,className:"tilt-container",onMouseMove:n=>{const l=a.current;if(!l)return;const i=l.getBoundingClientRect(),r=n.clientX-i.left,o=n.clientY-i.top,d=i.width/2,p=i.height/2,g=(r-d)/d*12,v=-((o-p)/p)*12;s({rx:v,ry:g,gx:r/i.width*100,gy:o/i.height*100})},onMouseLeave:()=>{s({rx:0,ry:0,gx:50,gy:50})}},React.createElement("style",null,`
        .tilt-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 800px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at center, ${hexToRgba(t,.08)} 0%, transparent 70%),
            #0a0d18;
        }

        .tilt-card {
          width: 180px;
          height: 240px;
          border-radius: 16px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out;
          transform: rotateX(${e.rx}deg) rotateY(${e.ry}deg);
          cursor: pointer;
        }

        .tilt-card-inner {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background:
            radial-gradient(circle at ${e.gx}% ${e.gy}%,
              ${hexToRgba(t,.2)} 0%,
              transparent 50%),
            linear-gradient(145deg,
              rgba(30, 40, 70, 0.95) 0%,
              rgba(12, 15, 30, 0.98) 100%);
          border: 1px solid ${hexToRgba(t,.25)};
          overflow: hidden;
          box-shadow:
            0 25px 80px rgba(0,0,0,0.4),
            0 0 60px ${hexToRgba(t,.1)};
        }

        .tilt-card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.1) 0%,
            transparent 40%,
            transparent 60%,
            rgba(255,255,255,0.05) 100%
          );
          pointer-events: none;
        }

        .tilt-glare {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            circle at ${e.gx}% ${e.gy}%,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.05) 20%,
            transparent 50%
          );
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .tilt-content {
          position: absolute;
          inset: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transform: translateZ(30px);
        }

        .tilt-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .tilt-chip {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 4px;
          background: ${hexToRgba(t,.15)};
          color: ${t};
          border: 1px solid ${hexToRgba(t,.3)};
          letter-spacing: 1px;
        }
        .tilt-level {
          font-family: var(--font-display);
          font-size: 12px;
          color: var(--text-muted);
        }

        .tilt-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .tilt-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${t}, #b14dff);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px ${hexToRgba(t,.4)};
        }
        .tilt-badge svg {
          width: 28px;
          height: 28px;
          color: #0a0d18;
        }
        .tilt-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .tilt-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tilt-stat {
          text-align: center;
        }
        .tilt-stat-val {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: ${t};
        }
        .tilt-stat-lbl {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* 3D depth layers */
        .tilt-layer {
          position: absolute;
          transform-style: preserve-3d;
        }
        .tilt-layer.l1 { transform: translateZ(15px); }
        .tilt-layer.l2 { transform: translateZ(35px); }
        .tilt-layer.l3 { transform: translateZ(55px); }

        .tilt-float-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .tilt-p {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${t};
          box-shadow: 0 0 8px ${t};
        }
      `),React.createElement("div",{ref:a,className:"tilt-card"},React.createElement("div",{className:"tilt-card-inner"},React.createElement("div",{className:"tilt-glare"}),React.createElement("div",{className:"tilt-content"},React.createElement("div",{className:"tilt-top"},React.createElement("span",{className:"tilt-chip"},"PRO"),React.createElement("span",{className:"tilt-level"},"Lv.99")),React.createElement("div",{className:"tilt-center tilt-layer l2"},React.createElement("div",{className:"tilt-badge"},React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"}))),React.createElement("div",{className:"tilt-name"},"MOTION+")),React.createElement("div",{className:"tilt-bottom"},React.createElement("div",{className:"tilt-stat"},React.createElement("div",{className:"tilt-stat-val"},"8+"),React.createElement("div",{className:"tilt-stat-lbl"},"Effects")),React.createElement("div",{className:"tilt-stat"},React.createElement("div",{className:"tilt-stat-val"},"60"),React.createElement("div",{className:"tilt-stat-lbl"},"FPS")),React.createElement("div",{className:"tilt-stat"},React.createElement("div",{className:"tilt-stat-val"},"3D"),React.createElement("div",{className:"tilt-stat-lbl"},"Depth")))))))}window.Tilt3DCard=x;})();
