(()=>{function g({accentColor:t="#00e5ff"}){const[b,s]=React.useState({x:0,y:0}),[c,d]=React.useState(null),l=React.useRef(null),p=[{id:1,label:"Get Started",icon:"arrow"},{id:2,label:"Explore More",icon:"spark"},{id:3,label:"View Docs",icon:"doc"}],x=(o,a)=>{const e=a.current;if(!e)return;const n=e.getBoundingClientRect(),i=o.clientX-n.left-n.width/2,r=o.clientY-n.top-n.height/2;s({x:i*.3,y:r*.3})};return React.createElement("div",{ref:l,className:"mb-container"},React.createElement("style",null,`
        .mb-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          background:
            radial-gradient(ellipse at center, ${hexToRgba(t,.05)} 0%, transparent 70%),
            #0a0d18;
          padding: 20px;
        }

        .mag-btn {
          position: relative;
          width: 200px;
          height: 52px;
          border-radius: 100px;
          border: 1px solid ${hexToRgba(t,.3)};
          background: ${hexToRgba(t,.08)};
          color: var(--text-primary);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
          letter-spacing: 0.5px;
        }
        .mag-btn:hover {
          background: ${hexToRgba(t,.15)};
          border-color: ${hexToRgba(t,.6)};
          box-shadow:
            0 0 30px ${hexToRgba(t,.2)},
            inset 0 0 20px ${hexToRgba(t,.05)};
        }
        .mag-btn:active {
          transform: scale(0.97);
        }

        .mag-btn.primary {
          background: linear-gradient(135deg, ${t}, #b14dff);
          border: none;
          color: #0a0d18;
          font-weight: 600;
          box-shadow: 0 4px 20px ${hexToRgba(t,.3)};
        }
        .mag-btn.primary:hover {
          box-shadow:
            0 8px 30px ${hexToRgba(t,.4)},
            0 0 40px ${hexToRgba(t,.2)};
        }

        .mag-btn-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }
        .mag-btn:hover .mag-btn-icon {
          transform: translateX(3px);
        }

        .mag-btn-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, ${hexToRgba(t,.3)} 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mag-btn:hover .mag-btn-glow {
          opacity: 1;
        }

        .mb-label {
          position: absolute;
          top: 24px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .mb-hint {
          position: absolute;
          bottom: 16px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
          opacity: 0.6;
        }
      `),React.createElement("span",{className:"mb-label"},"MAGNETIC BUTTONS"),p.map((o,a)=>React.createElement("button",{key:o.id,className:`mag-btn ${a===0?"primary":""}`,onMouseMove:e=>{const n=e.currentTarget.getBoundingClientRect(),i=e.clientX-n.left-n.width/2,r=e.clientY-n.top-n.height/2;e.currentTarget.style.transform=`translate(${i*.25}px, ${r*.3}px)`},onMouseLeave:e=>{e.currentTarget.style.transform="translate(0, 0)"}},React.createElement("span",{className:"mag-btn-glow",style:{left:"50%",top:"50%"}}),o.label,React.createElement("svg",{className:"mag-btn-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),React.createElement("polyline",{points:"12 5 19 12 12 19"})))),React.createElement("span",{className:"mb-hint"},"\u60AC\u505C\u6309\u94AE \xB7 \u611F\u53D7\u78C1\u529B"))}window.MagneticButton=g;})();
