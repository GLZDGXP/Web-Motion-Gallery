(()=>{function f({accentColor:a="#00e5ff",motionLevel:t="rich"}){const[r,s]=React.useState({x:.5,y:.5}),i=React.useRef(null),o=t==="subtle"?.5:t==="intense"?2:1,l=n=>{if(!i.current)return;const e=i.current.getBoundingClientRect();s({x:(n.clientX-e.left)/e.width,y:(n.clientY-e.top)/e.height})},b=PerfMonitor.getAdaptiveLevel(),d=Math.max(2,(t==="subtle"?3:t==="intense"?6:5)-b);return React.createElement("div",{ref:i,className:"fg-container",onMouseMove:l},React.createElement("style",null,`
        .fg-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #05060a;
          cursor: crosshair;
        }

        .fg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.7;
          mix-blend-mode: screen;
          animation: blob-drift ${20/o}s ease-in-out infinite;
        }

        .fg-blob.b1 {
          width: 240px;
          height: 240px;
          background: ${a};
          top: 10%;
          left: 20%;
          animation-delay: 0s;
        }
        .fg-blob.b2 {
          width: 200px;
          height: 200px;
          background: #b14dff;
          top: 40%;
          right: 15%;
          animation-delay: -5s;
        }
        .fg-blob.b3 {
          width: 180px;
          height: 180px;
          background: #ff4d9d;
          bottom: 20%;
          left: 30%;
          animation-delay: -10s;
        }
        .fg-blob.b4 {
          width: 160px;
          height: 160px;
          background: #00ff88;
          top: 30%;
          left: 50%;
          animation-delay: -15s;
          opacity: 0.5;
        }
        .fg-blob.b5 {
          width: 220px;
          height: 220px;
          background: #ffd700;
          bottom: 10%;
          right: 25%;
          animation-delay: -7s;
          opacity: 0.4;
        }
        .fg-blob.b6 {
          width: 140px;
          height: 140px;
          background: #ff6b35;
          top: 60%;
          left: 10%;
          animation-delay: -12s;
          opacity: 0.5;
        }
        .fg-blob.b7 {
          width: 170px;
          height: 170px;
          background: #00bfff;
          top: 15%;
          right: 30%;
          animation-delay: -3s;
          opacity: 0.5;
        }

        @keyframes blob-drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(40px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-30px, 20px) scale(0.95);
          }
          75% {
            transform: translate(20px, 40px) scale(1.05);
          }
        }

        /* Cursor-attracted blob */
        .fg-cursor-blob {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, ${hexToRgba(a,.6)} 0%, transparent 70%);
          filter: blur(30px);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 0.2s ease-out, top 0.2s ease-out;
          mix-blend-mode: screen;
          z-index: 10;
        }

        /* Glass orb in center */
        .fg-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            inset 0 0 30px rgba(255, 255, 255, 0.05),
            0 0 40px rgba(0, 0, 0, 0.3);
          animation: orb-pulse ${4/o}s ease-in-out infinite;
        }
        @keyframes orb-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        .fg-orb-inner {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${a}, #b14dff);
          opacity: 0.6;
          filter: blur(2px);
          animation: orb-inner ${3/o}s ease-in-out infinite alternate;
        }
        @keyframes orb-inner {
          0% { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(1.2); opacity: 0.8; }
        }

        /* Grain overlay */
        .fg-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
          opacity: 0.4;
          mix-blend-mode: overlay;
        }

        .fg-label {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-mono);
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 2px;
          text-transform: uppercase;
          z-index: 20;
          pointer-events: none;
        }
      `),Array.from({length:d},(n,e)=>React.createElement("div",{key:e,className:`fg-blob b${e+1}`})),React.createElement("div",{className:"fg-cursor-blob",style:{left:`${r.x*100}%`,top:`${r.y*100}%`}}),React.createElement("div",{className:"fg-orb"},React.createElement("div",{className:"fg-orb-inner"})),React.createElement("div",{className:"fg-grain"}),React.createElement("span",{className:"fg-label"},"Fluid Gradient \xB7 Hover to interact"))}window.FluidGradient=f;})();
