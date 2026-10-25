(()=>{function l({accentColor:a="#00e5ff"}){const i=React.useRef(null),[t,n]=React.useState({x:0,y:0}),s=[{id:1,title:"Front Layer",color:a,depth:30,size:"sm"},{id:2,title:"Mid Layer",color:"#b14dff",depth:60,size:"md"},{id:3,title:"Back Layer",color:"#ff4d9d",depth:90,size:"lg"}];return React.createElement("div",{ref:i,className:"pc-container",onMouseMove:e=>{if(!i.current)return;const r=i.current.getBoundingClientRect(),o=(e.clientX-r.left)/r.width-.5,c=(e.clientY-r.top)/r.height-.5;n({x:o*2,y:c*2})},onMouseLeave:()=>n({x:0,y:0})},React.createElement("style",null,`
        .pc-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 800px;
          background:
            radial-gradient(ellipse at center, ${hexToRgba(a,.06)} 0%, transparent 70%),
            #0a0d18;
          cursor: pointer;
        }

        .pc-stack {
          position: relative;
          width: 200px;
          height: 240px;
          transform-style: preserve-3d;
        }

        .pc-card {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 16px;
          background: linear-gradient(145deg,
            rgba(30, 35, 55, 0.9) 0%,
            rgba(15, 18, 32, 0.95) 100%);
          border: 1px solid rgba(120, 150, 255, 0.15);
          backdrop-filter: blur(10px);
          box-shadow:
            0 10px 40px rgba(0,0,0,0.3),
            0 0 30px var(--card-glow, transparent);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          overflow: hidden;
        }

        .pc-card.sm {
          width: 140px;
          height: 170px;
          transform: translate(-50%, -50%) translateZ(80px);
          --card-glow: ${hexToRgba(a,.2)};
          z-index: 3;
        }
        .pc-card.md {
          width: 170px;
          height: 200px;
          transform: translate(-50%, -50%) translateZ(40px) translateY(10px);
          --card-glow: rgba(177, 77, 255, 0.15);
          z-index: 2;
        }
        .pc-card.lg {
          width: 200px;
          height: 230px;
          transform: translate(-50%, -50%) translateZ(0) translateY(20px);
          --card-glow: rgba(255, 77, 157, 0.1);
          z-index: 1;
        }

        .pc-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--card-color), #fff4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-card-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .pc-card-sub {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .pc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            var(--card-color),
            transparent);
          opacity: 0.5;
        }
      `),React.createElement("div",{className:"pc-stack",style:{transform:`rotateX(${t.y*-5}deg) rotateY(${t.x*5}deg)`,transition:"transform 0.2s ease-out"}},s.map(e=>React.createElement("div",{key:e.id,className:`pc-card ${e.size}`,style:{"--card-color":e.color,transform:`translate(calc(-50% + ${t.x*e.depth*.1}px), calc(-50% + ${t.y*e.depth*.1}px)) translateZ(${e.size==="sm"?80:e.size==="md"?40:0}px) translateY(${e.size==="md"?10:e.size==="lg"?20:0}px)`}},React.createElement("div",{className:"pc-card-icon"},React.createElement("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#fff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},e.size==="sm"&&React.createElement(React.Fragment,null,React.createElement("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})),e.size==="md"&&React.createElement(React.Fragment,null,React.createElement("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"})),e.size==="lg"&&React.createElement(React.Fragment,null,React.createElement("circle",{cx:"12",cy:"12",r:"10"})))),React.createElement("div",{className:"pc-card-title"},e.title),React.createElement("div",{className:"pc-card-sub"},"Layer ",e.id)))))}window.ParallaxCards=l;})();
