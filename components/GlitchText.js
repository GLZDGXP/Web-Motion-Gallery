(()=>{function u({accentColor:t="#00e5ff",motionLevel:e="rich"}){const[s,i]=React.useState(!1),[o,f]=React.useState(0),r=React.useRef(null),n=React.useRef(null),l=["SYSTEM FAILURE","DATA CORRUPT","GLITCH MODE","ERROR 404"];React.useEffect(()=>{const x=()=>{i(!0),Math.random()>.5&&f(d=>(d+1)%l.length),n.current&&clearTimeout(n.current),n.current=setTimeout(()=>i(!1),180+Math.random()*220)},h=e==="subtle"?5e3:e==="intense"?1500:3e3,g=e==="subtle"?.4:e==="intense"?1.8:1,p=()=>{r.current=setTimeout(()=>{x(),p()},h/g+Math.random()*2e3)};return r.current=setTimeout(p,1200),()=>{r.current&&clearTimeout(r.current),n.current&&clearTimeout(n.current)}},[e]);const c=l[o];return React.createElement("div",{className:`glitch-container ${s?"active":""}`,"data-text":c},React.createElement("style",null,`
        .glitch-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #08080f;
          overflow: hidden;
          user-select: none;
        }
        .glitch-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at center, ${a(t,.06)} 0%, transparent 60%),
            #06060d;
        }
        /* \u626B\u63CF\u7EBF */
        .glitch-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          opacity: 0.5;
        }

        .glitch-text {
          position: relative;
          z-index: 1;
          font-family: var(--font-display);
          font-size: 38px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #fff;
          text-shadow: 0 0 8px rgba(255,255,255,0.3);
        }

        /* \u7528\u4F2A\u5143\u7D20\u5B9E\u73B0 R/G/B \u4E09\u5C42\u6545\u969C\u8272\uFF0Cdata-text \u63D0\u4F9B\u6587\u5B57\u5185\u5BB9 */
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
        }
        .glitch-text::before {
          color: #ff3355;
          text-shadow: 0 0 8px #ff3355;
          mix-blend-mode: screen;
          transform: translateX(0);
          clip-path: inset(45% 0 45% 0);
          opacity: 0;
        }
        .glitch-text::after {
          color: #00ffff;
          text-shadow: 0 0 8px #00ffff;
          mix-blend-mode: screen;
          transform: translateX(0);
          clip-path: inset(55% 0 25% 0);
          opacity: 0;
        }

        .glitch-container.active .glitch-text::before {
          animation: glitch-red 0.2s ease-out;
        }
        .glitch-container.active .glitch-text::after {
          animation: glitch-cyan 0.22s ease-out;
        }
        .glitch-container.active .glitch-text {
          animation: glitch-shake 0.18s ease-out;
        }

        @keyframes glitch-red {
          0% { opacity: 0.9; transform: translateX(-6px); clip-path: inset(35% 0 40% 0); }
          50% { opacity: 0.7; transform: translateX(-3px); clip-path: inset(50% 0 30% 0); }
          100% { opacity: 0; transform: translateX(-8px); clip-path: inset(20% 0 60% 0); }
        }
        @keyframes glitch-cyan {
          0% { opacity: 0.8; transform: translateX(5px); clip-path: inset(60% 0 20% 0); }
          40% { opacity: 0.6; transform: translateX(8px); clip-path: inset(30% 0 45% 0); }
          100% { opacity: 0; transform: translateX(3px); clip-path: inset(55% 0 30% 0); }
        }
        @keyframes glitch-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }

        /* \u89D2\u6807 */
        .glitch-corners {
          position: absolute;
          inset: 20px;
          pointer-events: none;
          z-index: 2;
        }
        .glitch-corners::before,
        .glitch-corners::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1px solid ${a(t,.4)};
        }
        .glitch-corners::before {
          top: 0; left: 0;
          border-right: none;
          border-bottom: none;
          box-shadow: calc(100% - 24px + 2px) 0 0 -1px ${a(t,.4)},
                      0 calc(100% - 24px + 2px) 0 -1px ${a(t,.4)},
                      calc(100% - 24px + 2px) calc(100% - 24px + 2px) 0 -1px ${a(t,.4)};
        }

        .glitch-tag {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-mono);
          font-size: 10px;
          color: ${a(t,.6)};
          letter-spacing: 3px;
          text-transform: uppercase;
          z-index: 2;
        }

        .glitch-status {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-mono);
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          z-index: 2;
        }
        .glitch-status-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ff3355;
          margin-right: 6px;
          animation: status-blink 2s ease-in-out infinite;
          vertical-align: middle;
        }
        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `),React.createElement("div",{className:"glitch-tag"},"// warning"),React.createElement("div",{className:"glitch-corners"}),React.createElement("div",{className:"glitch-text","data-text":c},c),React.createElement("div",{className:"glitch-status"},React.createElement("span",{className:"glitch-status-dot"}),"SIGNAL DEGRADED"))}function a(t,e){const s=parseInt(t.slice(1,3),16),i=parseInt(t.slice(3,5),16),o=parseInt(t.slice(5,7),16);return`rgba(${s}, ${i}, ${o}, ${e})`}window.GlitchText=u;})();
