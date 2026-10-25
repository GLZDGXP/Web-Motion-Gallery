(()=>{function p({accentColor:t="#00e5ff",motionLevel:s="rich"}){const[i,c]=React.useState(0),n=[{title:"\u6D41\u52A8",subtitle:"FLUID"},{title:"\u6D88\u6563",subtitle:"DISSOLVE"},{title:"\u95EA\u70C1",subtitle:"FLICKER"},{title:"\u8109\u51B2",subtitle:"PULSE"}];React.useEffect(()=>{const r=setInterval(()=>{c(e=>(e+1)%n.length)},2500);return()=>clearInterval(r)},[n.length]);const a=s==="subtle"?1.5:s==="intense"?.6:1;return React.createElement("div",{className:"tr-container"},React.createElement("style",null,`
        .tr-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at center, ${hexToRgba(t,.05)} 0%, transparent 70%),
            #0a0d18;
        }

        .tr-stage {
          position: relative;
          width: 200px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tr-word-cn {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .tr-char {
          display: inline-block;
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 2px;
          opacity: 0;
          transform: translateY(30px) rotateX(-90deg);
          animation: char-reveal ${.8*a}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          position: relative;
        }
        .tr-char::after {
          content: attr(data-char);
          position: absolute;
          inset: 0;
          color: ${t};
          opacity: 0;
          filter: blur(8px);
          animation: char-glow ${.8*a}s ease-out forwards;
          animation-delay: inherit;
          pointer-events: none;
        }
        @keyframes char-reveal {
          0% {
            opacity: 0;
            transform: translateY(30px) rotateX(-90deg) scale(0.8);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(-4px) rotateX(10deg) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg) scale(1);
            filter: blur(0);
          }
        }
        @keyframes char-glow {
          0% { opacity: 0; filter: blur(12px); }
          50% { opacity: 0.6; filter: blur(6px); }
          100% { opacity: 0; filter: blur(12px); }
        }

        .tr-word-cn.leaving .tr-char {
          animation: char-leave ${.5*a}s cubic-bezier(0.4, 0, 0.8, 0.2) forwards;
        }
        @keyframes char-leave {
          0% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) rotateX(90deg);
            filter: blur(4px);
          }
        }

        .tr-word-en {
          position: absolute;
          bottom: -30px;
          font-family: var(--font-mono);
          font-size: 14px;
          letter-spacing: 8px;
          color: ${t};
          opacity: 0;
          animation: en-reveal ${.8*a}s ease forwards;
          animation-delay: ${.4*a}s;
          text-transform: uppercase;
        }
        @keyframes en-reveal {
          0% {
            opacity: 0;
            letter-spacing: 2px;
          }
          100% {
            opacity: 1;
            letter-spacing: 8px;
          }
        }

        .tr-word-cn.leaving + .tr-word-en {
          animation: en-leave ${.4*a}s ease forwards;
        }
        @keyframes en-leave {
          0% { opacity: 1; letter-spacing: 8px; }
          100% { opacity: 0; letter-spacing: 2px; }
        }

        /* Character gradient accent */
        .tr-char.accent {
          background: linear-gradient(135deg, ${t}, #b14dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Floating characters in background */
        .tr-bg-chars {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .tr-bg-char {
          position: absolute;
          font-family: var(--font-display);
          font-weight: 700;
          color: ${hexToRgba(t,.06)};
          animation: float-char ${8*a}s ease-in-out infinite;
        }
        @keyframes float-char {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .tr-indicators {
          position: absolute;
          bottom: 40px;
          display: flex;
          gap: 8px;
        }
        .tr-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
          transition: all 0.3s;
        }
        .tr-dot.active {
          background: ${t};
          box-shadow: 0 0 10px ${t};
          transform: scale(1.4);
        }

        .tr-label {
          position: absolute;
          top: 24px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `),React.createElement("span",{className:"tr-label"},"KINETIC TYPOGRAPHY"),React.createElement("div",{className:"tr-bg-chars"},React.createElement("div",{className:"tr-bg-char",style:{top:"10%",left:"8%",fontSize:"40px",animationDelay:"-1s",color:hexToRgba(t,.08)}},"\u5B57"),React.createElement("div",{className:"tr-bg-char",style:{top:"65%",left:"3%",fontSize:"28px",animationDelay:"-3s",color:"rgba(177,77,255,0.08)"}},"\u52A8"),React.createElement("div",{className:"tr-bg-char",style:{top:"20%",right:"6%",fontSize:"36px",animationDelay:"-5s",color:hexToRgba(t,.06)}},"\u6548"),React.createElement("div",{className:"tr-bg-char",style:{bottom:"15%",right:"12%",fontSize:"26px",animationDelay:"-2s",color:"rgba(177,77,255,0.07)"}},"\u6587"),React.createElement("div",{className:"tr-bg-char",style:{top:"75%",left:"78%",fontSize:"20px",animationDelay:"-7s"}},"\u5B57"),React.createElement("div",{className:"tr-bg-char",style:{top:"45%",left:"12%",fontSize:"18px",animationDelay:"-4s",color:hexToRgba(t,.05)}},"M"),React.createElement("div",{className:"tr-bg-char",style:{top:"30%",right:"20%",fontSize:"22px",animationDelay:"-6s",color:"rgba(177,77,255,0.05)"}},"OT"),React.createElement("div",{className:"tr-bg-char",style:{bottom:"35%",left:"25%",fontSize:"16px",animationDelay:"-2.5s"}},"ION")),React.createElement("div",{className:"tr-stage"},n.map((r,e)=>i===e&&React.createElement(React.Fragment,{key:e},React.createElement("div",{className:"tr-word-cn",key:`cn-${e}-${i}`},r.title.split("").map((l,o)=>React.createElement("span",{key:o,className:`tr-char ${o===0?"accent":""}`,"data-char":l,style:{animationDelay:`${o*.12}s`}},l))),React.createElement("div",{className:"tr-word-en",key:`en-${e}-${i}`},r.subtitle)))),React.createElement("div",{className:"tr-indicators"},n.map((r,e)=>React.createElement("div",{key:e,className:`tr-dot ${i===e?"active":""}`}))))}window.TextReveal=p;})();
