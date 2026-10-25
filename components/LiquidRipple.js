(()=>{function B({accentColor:i="#00e5ff",motionLevel:o="rich"}){const h=React.useRef(null),[w,m]=React.useState([]),g=React.useRef(0),b=React.useRef(null),u=React.useRef(null),c=React.useRef([]),s=o==="subtle"?.6:o==="intense"?1.5:1,x=2400/s,f=o==="subtle"?0:o==="intense"?1e3:1800,r=React.useCallback((t,a,e=!1)=>{const n=g.current++;m(d=>[...d,{id:n,x:t,y:a,ambient:e}]);const l=setTimeout(()=>{m(d=>d.filter(p=>p.id!==n))},x+100)},[x]);React.useEffect(()=>{const t=h.current;if(!t)return;const a=[];return a.push(setTimeout(()=>{const e=t.getBoundingClientRect();e.width>0&&r(e.width*.5,e.height*.55,!0)},200)),a.push(setTimeout(()=>{const e=t.getBoundingClientRect();e.width>0&&r(e.width*.3,e.height*.4,!0)},800)),a.push(setTimeout(()=>{const e=t.getBoundingClientRect();e.width>0&&r(e.width*.7,e.height*.6,!0)},1400)),b.current=a,f>0&&(u.current=setInterval(()=>{const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=30+Math.random()*(e.width-60),l=30+Math.random()*(e.height-60);r(n,l,!0)},f)),()=>{b.current&&b.current.forEach(e=>clearTimeout(e)),u.current&&clearInterval(u.current),c.current&&c.current.forEach(e=>clearTimeout(e)),c.current=[]}},[r,f]);const y=t=>{const a=h.current.getBoundingClientRect(),e=t.clientX-a.left,n=t.clientY-a.top;r(e,n,!1);const l="halo-"+g.current++;v(p=>[...p,{id:l,x:e,y:n}]);const d=setTimeout(()=>v(p=>p.filter(N=>N.id!==l)),1200);c.current.push(d)},[R,v]=React.useState([]),T=`${2.2/s}s`,$=`${.2/s}s`,k=`${.4/s}s`;return React.createElement("div",{ref:h,className:"lr-container",onClick:y,style:{cursor:"pointer"}},React.createElement("style",null,`
        .lr-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 60%, ${hexToRgba(i,.15)} 0%, transparent 60%),
            linear-gradient(180deg, #060a18 0%, #0a1528 100%);
        }

        /* \u5E95\u90E8\u6DB2\u6001\u6CE2\u6D6A */
        .lr-surface {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 55%;
          pointer-events: none;
        }
        .lr-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          animation: wave-move ${10/s}s linear infinite;
        }
        .lr-wave.w2 {
          animation-duration: ${14/s}s;
          animation-direction: reverse;
          opacity: 0.5;
          bottom: -12px;
        }
        .lr-wave.w3 {
          animation-duration: ${18/s}s;
          opacity: 0.3;
          bottom: -6px;
        }
        @keyframes wave-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* \u6D9F\u6F2A */
        .ripple {
          position: absolute;
          border-radius: 50%;
          border: 2px solid ${hexToRgba(i,.7)};
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-expand ${T} ease-out forwards;
          pointer-events: none;
          box-shadow: 0 0 12px ${hexToRgba(i,.4)};
        }
        .ripple.r2 {
          animation-delay: ${$};
          border-width: 1px;
          border-color: ${hexToRgba(i,.5)};
          box-shadow: none;
        }
        .ripple.r3 {
          animation-delay: ${k};
          border-width: 1px;
          border-color: rgba(177, 77, 255, 0.5);
          box-shadow: 0 0 8px rgba(177, 77, 255, 0.3);
        }
        .ripple.ambient {
          opacity: 0.5;
          border-width: 1.5px;
          box-shadow: none;
        }
        @keyframes ripple-expand {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(5);
            opacity: 0;
          }
        }

        /* \u6C34\u9762\u53CD\u5149 */
        .lr-shine {
          position: absolute;
          top: 35%;
          left: 15%;
          width: 70%;
          height: 2px;
          background: linear-gradient(90deg,
            transparent,
            ${hexToRgba(i,.5)},
            transparent);
          animation: shine-move ${5/s}s ease-in-out infinite;
          pointer-events: none;
          opacity: 0.6;
        }
        .lr-shine.s2 {
          top: 50%;
          left: 25%;
          width: 50%;
          animation-delay: -2.5s;
          opacity: 0.35;
        }
        @keyframes shine-move {
          0%, 100% { transform: translateX(-15px); opacity: 0.3; }
          50% { transform: translateX(15px); opacity: 0.7; }
        }

        /* \u73BB\u7483\u7403 */
        .glass-orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .glass-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%,
            rgba(255,255,255,0.4) 0%,
            rgba(255,255,255,0.1) 30%,
            rgba(0,229,255,0.15) 60%,
            rgba(0,229,255,0.05) 100%);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow:
            inset -4px -4px 12px rgba(0,0,0,0.2),
            inset 4px 4px 12px rgba(255,255,255,0.15),
            0 4px 20px rgba(0,229,255,0.2);
          backdrop-filter: blur(2px);
          animation: orb-float 6s ease-in-out infinite;
        }
        .glass-orb.o1 { width: 36px; height: 36px; top: 20%; left: 18%; animation-duration: 7s; }
        .glass-orb.o2 { width: 24px; height: 24px; top: 35%; left: 65%; animation-duration: 5.5s; animation-delay: -2s; }
        .glass-orb.o3 { width: 48px; height: 48px; top: 15%; left: 75%; animation-duration: 8s; animation-delay: -4s; }
        .glass-orb.o4 { width: 20px; height: 20px; top: 42%; left: 35%; animation-duration: 6.5s; animation-delay: -1s; }
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .glass-orb::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 25%;
          width: 25%;
          height: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          filter: blur(1px);
        }

        /* \u70B9\u51FB\u5149\u6655 */
        .click-halo {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
          animation: halo-burst 1.2s ease-out forwards;
        }
        @keyframes halo-burst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(6); opacity: 0; }
        }

        /* \u9F20\u6807\u5149\u70B9 */
        .lr-mouse-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(0,229,255,0.8), transparent 70%);
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 15;
        }

        .lr-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          font-family: var(--font-mono);
          letter-spacing: 1.5px;
          pointer-events: none;
          z-index: 20;
        }

        /* \u6C34\u6EF4 */
        .lr-droplets {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60%;
          pointer-events: none;
          overflow: hidden;
        }
        .droplet {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: ${i};
          box-shadow: 0 0 6px ${hexToRgba(i,.7)};
          animation: droplet-fall ${4/s}s ease-in infinite;
          opacity: 0;
        }
        @keyframes droplet-fall {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(350px); opacity: 0; }
        }
      `),React.createElement("div",{className:"lr-droplets"},[...Array(o==="subtle"?3:o==="intense"?10:6)].map((t,a)=>React.createElement("div",{key:a,className:"droplet",style:{left:`${8+a*13%84}%`,animationDelay:`${-a*.7}s`,animationDuration:`${3+a%4}s`}}))),React.createElement("div",{className:"glass-orbs"},React.createElement("div",{className:"glass-orb o1"}),React.createElement("div",{className:"glass-orb o2"}),React.createElement("div",{className:"glass-orb o3"}),React.createElement("div",{className:"glass-orb o4"})),R.map(t=>React.createElement("div",{key:t.id,className:"click-halo",style:{left:t.x,top:t.y,width:40,height:40,background:`radial-gradient(circle, ${hexToRgba(i,.6)}, transparent 70%)`}})),React.createElement("div",{className:"lr-shine"}),React.createElement("div",{className:"lr-shine s2"}),React.createElement("div",{className:"lr-surface"},React.createElement("svg",{className:"lr-wave w1",viewBox:"0 0 1200 220",preserveAspectRatio:"none"},React.createElement("defs",null,React.createElement("linearGradient",{id:"waveGrad1",x1:"0%",y1:"0%",x2:"0%",y2:"100%"},React.createElement("stop",{offset:"0%",stopColor:i,stopOpacity:"0.25"}),React.createElement("stop",{offset:"100%",stopColor:i,stopOpacity:"0.03"}))),React.createElement("path",{d:"M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,220 L0,220 Z",fill:"url(#waveGrad1)"})),React.createElement("svg",{className:"lr-wave w2",viewBox:"0 0 1200 220",preserveAspectRatio:"none"},React.createElement("path",{d:"M0,90 Q150,50 300,90 T600,90 T900,90 T1200,90 L1200,220 L0,220 Z",fill:hexToRgba(i,.12)})),React.createElement("svg",{className:"lr-wave w3",viewBox:"0 0 1200 220",preserveAspectRatio:"none"},React.createElement("path",{d:"M0,110 Q150,70 300,110 T600,110 T900,110 T1200,110 L1200,220 L0,220 Z",fill:hexToRgba(i,.06)}))),w.map(t=>React.createElement(React.Fragment,{key:t.id},React.createElement("div",{className:`ripple r1 ${t.ambient?"ambient":""}`,style:{left:t.x,top:t.y,width:t.ambient?30:50,height:t.ambient?30:50}}),React.createElement("div",{className:`ripple r2 ${t.ambient?"ambient":""}`,style:{left:t.x,top:t.y,width:t.ambient?30:50,height:t.ambient?30:50}}),React.createElement("div",{className:`ripple r3 ${t.ambient?"ambient":""}`,style:{left:t.x,top:t.y,width:t.ambient?30:50,height:t.ambient?30:50}}))),React.createElement("div",{className:"lr-hint"},"\u70B9\u51FB\u6C34\u9762 \xB7 \u4EA7\u751F\u6D9F\u6F2A"))}window.LiquidRipple=B;})();
