(()=>{function x({accentColor:t="#00e5ff",motionLevel:c="rich"}){const[n,g]=React.useState(!1),[p,b]=React.useState({x:0,y:0}),[v,f]=React.useState([]),r=React.useRef(null),m=React.useRef(0);return React.createElement("div",{className:"flip3d-stage",onMouseMove:e=>{if(!r.current||n)return;const a=r.current.getBoundingClientRect(),s=(e.clientX-a.left)/a.width-.5,l=(e.clientY-a.top)/a.height-.5;b({x:l*-15,y:s*15})},onMouseLeave:()=>{b({x:0,y:0})},onClick:()=>{var a;const e=(a=r.current)==null?void 0:a.getBoundingClientRect();if(e){const s=[],l=c==="subtle"?12:c==="intense"?28:20;for(let i=0;i<l;i++){const d=i/l*Math.PI*2+Math.random()*.5,o=30+Math.random()*60;s.push({id:m.current++,x:e.width/2,y:e.height/2,vx:Math.cos(d)*o,vy:Math.sin(d)*o,size:2+Math.random()*3,hue:i%2===0?0:280})}f(i=>[...i,...s]),setTimeout(()=>{const i=s.map(d=>d.id);f(d=>d.filter(o=>!i.includes(o.id)))},900)}g(!n)}},React.createElement("style",null,`
        .flip3d-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          cursor: pointer;
          background:
            radial-gradient(ellipse at center, ${hexToRgba(t,.08)} 0%, transparent 70%),
            #0a0d18;
        }

        .flip3d-card {
          width: 180px;
          height: 240px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform: ${n?"rotateY(180deg)":`rotateX(${p.x}deg) rotateY(${p.y}deg)`};
        }

        .flip3d-face {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 40px ${hexToRgba(t,.1)},
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }

        /* \u8FB9\u7F18\u5149\u6548 */
        .flip3d-face::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(
            ${135+p.y*2}deg,
            rgba(255,255,255,0.3) 0%,
            rgba(255,255,255,0.05) 30%,
            transparent 60%,
            ${hexToRgba(t,.3)} 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Front face */
        .flip3d-front {
          background: linear-gradient(145deg,
            rgba(30, 40, 70, 0.9) 0%,
            rgba(15, 20, 40, 0.95) 100%);
          border: 1px solid ${hexToRgba(t,.2)};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .flip3d-front::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg,
            transparent 0deg,
            ${hexToRgba(t,.3)} 60deg,
            transparent 120deg,
            transparent 180deg,
            rgba(177, 77, 255, 0.3) 240deg,
            transparent 300deg);
          animation: rotate-gradient 4s linear infinite;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .flip3d-face:hover .flip3d-front::before { opacity: 1; }
        @keyframes rotate-gradient {
          to { transform: rotate(360deg); }
        }
        .flip3d-front-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .flip3d-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${t}, #b14dff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: #0a0d18;
          font-family: var(--font-display);
          box-shadow: 0 0 30px ${hexToRgba(t,.5)};
        }
        .flip3d-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .flip3d-role {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .flip3d-divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${t}, transparent);
        }

        /* Back face */
        .flip3d-back {
          background: linear-gradient(145deg,
            rgba(40, 20, 60, 0.95) 0%,
            rgba(20, 10, 40, 0.98) 100%);
          border: 1px solid rgba(177, 77, 255, 0.3);
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          gap: 14px;
        }
        .flip3d-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .flip3d-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .flip3d-stat-value {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: ${t};
        }
        .flip3d-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .flip3d-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, ${t}, #b14dff);
          box-shadow: 0 0 8px ${hexToRgba(t,.5)};
        }
        .flip3d-back-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .flip3d-back-title::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #b14dff;
          box-shadow: 0 0 8px #b14dff;
        }

        .flip3d-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          letter-spacing: 1px;
          opacity: 0.6;
          pointer-events: none;
          z-index: 20;
        }

        .flip3d-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
        }
        .flip3d-particle {
          position: absolute;
          border-radius: 50%;
          animation: flip-particle-burst 0.9s ease-out forwards;
          box-shadow: 0 0 6px currentColor;
        }
        @keyframes flip-particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0);
            opacity: 0;
          }
        }
      `),React.createElement("div",{ref:r,className:"flip3d-card"},React.createElement("div",{className:"flip3d-face flip3d-front"},React.createElement("div",{className:"flip3d-front-inner"},React.createElement("div",{className:"flip3d-avatar"},"3D"),React.createElement("div",{className:"flip3d-divider"}),React.createElement("div",{className:"flip3d-name"},"Motion Card"),React.createElement("div",{className:"flip3d-role"},"Hover to tilt \xB7 Click to flip"))),React.createElement("div",{className:"flip3d-face flip3d-back"},React.createElement("div",{className:"flip3d-back-title"},"Performance"),React.createElement("div",{className:"flip3d-stat"},React.createElement("span",{className:"flip3d-stat-label"},"Framerate"),React.createElement("span",{className:"flip3d-stat-value"},"120fps")),React.createElement("div",{className:"flip3d-bar"},React.createElement("div",{className:"flip3d-bar-fill",style:{width:"96%"}})),React.createElement("div",{className:"flip3d-stat"},React.createElement("span",{className:"flip3d-stat-label"},"Smoothness"),React.createElement("span",{className:"flip3d-stat-value"},"A+")),React.createElement("div",{className:"flip3d-bar"},React.createElement("div",{className:"flip3d-bar-fill",style:{width:"92%"}})),React.createElement("div",{className:"flip3d-stat"},React.createElement("span",{className:"flip3d-stat-label"},"Depth"),React.createElement("span",{className:"flip3d-stat-value"},"\u221E")),React.createElement("div",{className:"flip3d-bar"},React.createElement("div",{className:"flip3d-bar-fill",style:{width:"100%"}})),React.createElement("div",{className:"flip3d-stat"},React.createElement("span",{className:"flip3d-stat-label"},"Wow factor"),React.createElement("span",{className:"flip3d-stat-value"},"100%")),React.createElement("div",{className:"flip3d-bar"},React.createElement("div",{className:"flip3d-bar-fill",style:{width:"100%"}})))),React.createElement("div",{className:"flip3d-particles",key:n?"flipped":"front"},v.map(e=>React.createElement("div",{key:e.id,className:"flip3d-particle",style:{left:e.x,top:e.y,width:e.size,height:e.size,color:e.hue===0?t:"#b14dff",background:e.hue===0?t:"#b14dff","--dx":`${e.vx}px`,"--dy":`${e.vy}px`},onAnimationEnd:()=>{f(a=>a.filter(s=>s.id!==e.id))}}))),React.createElement("div",{className:"flip3d-hint"},"\u70B9\u51FB\u7FFB\u8F6C \xB7 \u60AC\u505C\u503E\u659C"))}window.Flip3D=x;})();
