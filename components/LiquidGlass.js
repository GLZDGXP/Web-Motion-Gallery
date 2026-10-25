(()=>{function P({accentColor:r="#00e5ff",motionLevel:m="rich"}){const l=React.useRef(null),h=React.useRef(null),v=useMousePosition(l),k=React.useRef({x:-100,y:-100,active:!1}),z=React.useRef([]),A=React.useRef(`lg_${Math.random().toString(36).slice(2,8)}`),s=PerfMonitor.isLow(),y=PerfMonitor.getAdaptiveLevel(),G=7-y*2,w=s?3:Math.max(3,G),R=s?8:Math.max(10,20-y*3),L=m==="subtle"?.5:m==="intense"?1.4:1,d=React.useMemo(()=>Array.from({length:w},(t,i)=>({id:i,size:50+Math.random()*120,baseX:8+Math.random()*84,baseY:10+Math.random()*80,delay:Math.random()*8,duration:s?16+Math.random()*10:10+Math.random()*10,driftX:(Math.random()-.5)*24,driftY:(Math.random()-.5)*18,hueShift:Math.random()*40-20,rotateSeed:Math.random()*360,shape:Math.random()>.55?"circle":"blob"})),[w,s]);return React.useEffect(()=>{const t=A.current,i=h.current,g=l.current;if(!i||!g)return;const n=Array.from(g.querySelectorAll(".glass-orb"));z.current=n;let b=-100,c=-100,X=!1;const Y=(B,E)=>{const e=k.current,$=.12,T=e.active?e.x:-200,F=e.active?e.y:-200;if(b+=(T-b)*$,c+=(F-c)*$,X=e.active,i.style.transform=`translate(${b}px, ${c}px)`,e.active)for(let a=0;a<n.length;a++){const p=n[a];if(!d[a])continue;const o=p.getBoundingClientRect(),M=g.getBoundingClientRect(),S=o.left+o.width/2-M.left,D=o.top+o.height/2-M.top,u=e.x-S,f=e.y-D,N=Math.sqrt(u*u+f*f),q=200;if(N<q){const x=(1-N/q)*.6;p.style.transform=`translate(${u*x*.2}px, ${f*x*.2}px) scale(${1+x*.05})`}else p.style.transform=""}else for(let a=0;a<n.length;a++)n[a].style.transform=""};return GlobalRAF.register(t,Y),()=>GlobalRAF.unregister(t)},[d]),React.useEffect(()=>{k.current=v},[v]),React.createElement("div",{ref:l,className:"liquid-glass-container",style:{cursor:"none"}},React.createElement("style",null,`
        .liquid-glass-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 30% 20%, ${hexToRgba(r,.18)} 0%, transparent 55%),
            radial-gradient(ellipse at 75% 75%, rgba(177, 77, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 10%, rgba(255, 77, 157, 0.08) 0%, transparent 40%),
            #0a0d18;
        }

        /* \u80CC\u666F\u8272\u5757\uFF08\u6A21\u7CCA\u6563\u7126\u5149\u6591\uFF09 */
        .lg-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.5;
          animation: blob-drift 14s ease-in-out infinite;
        }
        .lg-bg-blob.b1 {
          width: 220px; height: 220px;
          background: ${r};
          top: 5%; left: 15%;
          animation-delay: 0s;
        }
        .lg-bg-blob.b2 {
          width: 160px; height: 160px;
          background: #b14dff;
          bottom: 10%; right: 18%;
          animation-delay: -5s;
        }
        .lg-bg-blob.b3 {
          width: 120px; height: 120px;
          background: #ff4d9d;
          top: 55%; left: 55%;
          animation-delay: -9s;
        }
        .lg-bg-blob.b4 {
          width: 90px; height: 90px;
          background: ${r};
          top: 30%; right: 25%;
          animation-delay: -3s;
          opacity: 0.35;
        }
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -25px) scale(1.08); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(25px, 15px) scale(1.03); }
        }

        /* \u7F51\u683C\u5E95\u7EB9 */
        .lg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(${hexToRgba(r,.025)} 1px, transparent 1px),
            linear-gradient(90deg, ${hexToRgba(r,.025)} 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        /* \u73BB\u7483\u7403\u6838\u5FC3 */
        .glass-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(${R}px) saturate(200%) contrast(110%);
          -webkit-backdrop-filter: blur(${R}px) saturate(200%) contrast(110%);
          border: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow:
            inset 0 0 40px rgba(255, 255, 255, 0.08),
            inset 0 -20px 40px rgba(0, 0, 0, 0.2),
            inset 20px 0 40px rgba(255, 255, 255, 0.05),
            inset -20px 0 40px rgba(0, 0, 0, 0.1),
            0 10px 50px rgba(0, 0, 0, 0.3),
            0 0 40px ${hexToRgba(r,.06)};
          animation: glass-float 10s ease-in-out infinite;
          will-change: transform;
        }
        /* \u4E3B\u9AD8\u5149\uFF1A\u5DE6\u4E0A\u692D\u5706\u5F62\u5927\u7247\u6F2B\u53CD\u5C04 */
        .glass-orb::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(ellipse 80% 50% at 28% 22%,
              rgba(255, 255, 255, 0.45) 0%,
              rgba(255, 255, 255, 0.15) 30%,
              transparent 55%);
          pointer-events: none;
        }
        /* \u9510\u5229\u9AD8\u5149\u70B9 + \u73AF\u5883\u53CD\u5C04\u5149\u5E26 */
        .glass-orb::after {
          content: '';
          position: absolute;
          top: 8%;
          left: 18%;
          width: 22%;
          height: 14%;
          background: radial-gradient(ellipse at center,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%);
          border-radius: 50%;
          filter: blur(0.5px);
          pointer-events: none;
          box-shadow:
            60px 20px 8px -2px rgba(255, 255, 255, 0.12),
            45px 5px 4px -1px rgba(255, 255, 255, 0.08);
        }
        /* Fresnel \u8FB9\u7F18\u8F89\u5149 \u2014\u2014 \u6A21\u62DF\u8FB9\u7F18\u5149\u7EBF\u6298\u5C04 */
        .glass-edge {
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          pointer-events: none;
          background: conic-gradient(
            from 210deg,
            transparent 0deg,
            rgba(255, 255, 255, 0.05) 25deg,
            rgba(255, 255, 255, 0.25) 45deg,
            rgba(255, 255, 255, 0.5) 55deg,
            rgba(255, 255, 255, 0.3) 65deg,
            rgba(255, 255, 255, 0.08) 85deg,
            transparent 110deg,
            transparent 180deg,
            rgba(255, 255, 255, 0.03) 200deg,
            rgba(255, 255, 255, 0.12) 240deg,
            rgba(255, 255, 255, 0.04) 280deg,
            transparent 310deg,
            transparent 360deg
          );
          mask: radial-gradient(circle at center, transparent 46%, black 48%, black 50%, transparent 52%);
          -webkit-mask: radial-gradient(circle at center, transparent 46%, black 48%, black 50%, transparent 52%);
        }
        /* \u8272\u6563\u8FB9\u7F18\uFF08\u5F69\u8679\u8272\u8FB9\u7F18\u6298\u5C04\uFF09 */
        .glass-dispersion {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          pointer-events: none;
          background: conic-gradient(
            from 200deg,
            transparent 0deg,
            rgba(255, 100, 100, 0.15) 40deg,
            rgba(255, 200, 100, 0.12) 45deg,
            rgba(100, 255, 150, 0.1) 50deg,
            rgba(100, 200, 255, 0.12) 55deg,
            rgba(180, 100, 255, 0.1) 60deg,
            transparent 80deg,
            transparent 360deg
          );
          mask: radial-gradient(circle at center, transparent 45%, black 47%, black 49%, transparent 51%);
          -webkit-mask: radial-gradient(circle at center, transparent 45%, black 47%, black 49%, transparent 51%);
          filter: blur(1px);
          opacity: 0.6;
        }
        /* \u5E95\u90E8\u6697\u8FB9\uFF0C\u589E\u52A0\u4F53\u79EF\u611F */
        .glass-bottom-shadow {
          position: absolute;
          left: 15%;
          right: 15%;
          bottom: 6%;
          height: 12%;
          background: radial-gradient(ellipse at center,
            rgba(0, 0, 0, 0.3) 0%,
            transparent 70%);
          border-radius: 50%;
          filter: blur(4px);
          pointer-events: none;
        }
        /* \u5185\u90E8\u6298\u5C04\u5149\u5E26\uFF08\u7A7F\u8FC7\u7403\u4F53\u7684\u73AF\u5883\u5149\uFF09 */
        .glass-inner-caustic {
          position: absolute;
          left: 25%;
          right: 25%;
          top: 55%;
          height: 20%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%);
          filter: blur(3px);
          pointer-events: none;
          transform: rotate(-5deg);
        }

        @keyframes glass-float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(var(--dx, 20px), var(--dy, -15px)) rotate(3deg);
          }
        }

        /* \u9F20\u6807\u73BB\u7483\u7403 */
        .lg-cursor-glass {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(${s?8:18}px) saturate(200%);
          -webkit-backdrop-filter: blur(${s?8:18}px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 20;
          box-shadow:
            inset 0 0 25px rgba(255, 255, 255, 0.12),
            0 0 40px ${hexToRgba(r,.12)},
            0 8px 25px rgba(0, 0, 0, 0.25);
          transition: opacity 0.3s ease, width 0.25s ease, height 0.25s ease;
          transform: translate(-50%, -50%);
        }
        .lg-cursor-glass::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 22%;
          width: 30%;
          height: 18%;
          background: radial-gradient(ellipse at center,
            rgba(255, 255, 255, 0.65) 0%,
            transparent 80%);
          border-radius: 50%;
          transform: rotate(-20deg);
        }
        .lg-cursor-glass::after {
          content: '';
          position: absolute;
          bottom: 12%;
          right: 18%;
          width: 12%;
          height: 8%;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          filter: blur(2px);
        }

        /* \u4E2D\u5FC3\u6587\u5B57 */
        .lg-center-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
        }
        .lg-center-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .lg-center-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .liquid-glass-container { cursor: auto; }
          .lg-cursor-glass { display: none; }
        }
      `),React.createElement("div",{className:"lg-bg-blob b1"}),React.createElement("div",{className:"lg-bg-blob b2"}),React.createElement("div",{className:"lg-bg-blob b3"}),React.createElement("div",{className:"lg-bg-blob b4"}),React.createElement("div",{className:"lg-grid"}),React.createElement("div",{className:"lg-center-text"},React.createElement("span",{className:"lg-center-label"},"Glassmorphism"),React.createElement("span",{className:"lg-center-title"},"Liquid Glass")),d.map(t=>React.createElement("div",{key:t.id,className:"glass-orb",style:{width:t.size,height:t.size,left:`${t.baseX}%`,top:`${t.baseY}%`,animationDelay:`${t.delay}s`,animationDuration:`${t.duration/L}s`,"--dx":`${t.driftX}px`,"--dy":`${t.driftY}px`}},React.createElement("div",{className:"glass-dispersion"}),React.createElement("div",{className:"glass-edge"}),React.createElement("div",{className:"glass-inner-caustic"}),React.createElement("div",{className:"glass-bottom-shadow"}))),React.createElement("div",{ref:h,className:"lg-cursor-glass",style:{left:0,top:0,transform:"translate(-200px, -200px)",willChange:"transform"}}))}window.LiquidGlass=P;})();
