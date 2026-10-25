(()=>{function h({accentColor:i="#00e5ff",motionLevel:d="rich"}){const[o,u]=React.useState(0),[t,c]=React.useState(""),[a,p]=React.useState(!1),g=React.useRef(null),[m,f]=React.useState(!1);React.useEffect(()=>{const n=g.current;if(!n)return;const e=n.getBoundingClientRect();e.top<window.innerHeight&&e.bottom>0&&e.width>0&&f(!0);const s=new IntersectionObserver(x=>{x.forEach(w=>f(w.isIntersecting))},{threshold:.1});return s.observe(n),()=>s.disconnect()},[]);const l=["Web \u52A8\u6548\u7684\u65E0\u9650\u53EF\u80FD","Liquid Glass Morphing","\u7C92\u5B50\u7269\u7406\u5B9E\u65F6\u6A21\u62DF","3D Transform Magic","\u4EE3\u7801\u4E0E\u7F8E\u5B66\u7684\u78B0\u649E","Canvas Pixel Artistry"],r=d==="subtle"?1.5:d==="intense"?.6:1;return React.useEffect(()=>{if(!m)return;const n=l[o];let e;return!a&&t.length<n.length?e=setTimeout(()=>{c(n.slice(0,t.length+1))},80*r+Math.random()*60*r):!a&&t.length===n.length?e=setTimeout(()=>{p(!0)},2e3*r):a&&t.length>0?e=setTimeout(()=>{c(t.slice(0,-1))},40*r):a&&t.length===0&&(p(!1),u(s=>(s+1)%l.length)),()=>clearTimeout(e)},[t,a,o,m,r]),React.createElement("div",{ref:g,className:"tw-container"},React.createElement("style",null,`
        .tw-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse at center, ${hexToRgba(i,.06)} 0%, transparent 70%),
            #0a0d18;
          overflow: hidden;
        }

        .tw-terminal {
          width: 85%;
          max-width: 320px;
          background: rgba(15, 18, 30, 0.8);
          border: 1px solid rgba(120, 150, 255, 0.15);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .tw-terminal-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(120, 150, 255, 0.1);
        }
        .tw-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .tw-dot.r { background: #ff5f56; }
        .tw-dot.y { background: #ffbd2e; }
        .tw-dot.g { background: #27c93f; }
        .tw-terminal-title {
          margin-left: auto;
          margin-right: auto;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .tw-terminal-body {
          padding: 18px 16px;
          min-height: 80px;
          display: flex;
          align-items: center;
        }
        .tw-prompt {
          font-family: var(--font-mono);
          font-size: 12px;
          color: ${i};
          margin-right: 8px;
          flex-shrink: 0;
        }
        .tw-text {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.4;
          letter-spacing: 0.3px;
        }
        .tw-cursor {
          display: inline-block;
          width: 2px;
          height: 16px;
          background: ${i};
          margin-left: 2px;
          vertical-align: -3px;
          animation: cursor-blink 1s step-end infinite;
          box-shadow: 0 0 8px ${i};
        }
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .tw-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(0,0,0,0.2) 3px,
            rgba(0,0,0,0.2) 4px
          );
          opacity: 0.3;
          mix-blend-mode: overlay;
        }

        .tw-counter {
          position: absolute;
          top: 24px;
          right: 24px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .tw-counter-num {
          color: ${i};
          font-weight: 600;
        }
      `),React.createElement("div",{className:"tw-counter"},React.createElement("span",{className:"tw-counter-num"},o+1)," / ",l.length),React.createElement("div",{className:"tw-terminal"},React.createElement("div",{className:"tw-terminal-header"},React.createElement("div",{className:"tw-dot r"}),React.createElement("div",{className:"tw-dot y"}),React.createElement("div",{className:"tw-dot g"}),React.createElement("span",{className:"tw-terminal-title"},"motion-gallery.sh")),React.createElement("div",{className:"tw-terminal-body"},React.createElement("span",{className:"tw-prompt"},"$"),React.createElement("span",{className:"tw-text"},t,React.createElement("span",{className:"tw-cursor"})))),React.createElement("div",{className:"tw-lines"}))}window.Typewriter=h;})();
