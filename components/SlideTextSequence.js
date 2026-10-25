(()=>{function u({accentColor:n="#00e5ff",motionLevel:a="rich"}){const[c,r]=React.useState(0),[y,o]=React.useState(!1),f=React.useRef(null),e=["DYNAMIC","FLUID","MOTION","GRAVITY"],i=a==="subtle"?3500:a==="intense"?1800:2500,l=a==="subtle"?40:a==="intense"?20:30;React.useEffect(()=>{const t=setInterval(()=>{r(s=>(s+1)%e.length)},i);return()=>clearInterval(t)},[i,e.length]);const p=React.useCallback(()=>{o(!0),r(t=>(t+1)%e.length)},[e.length]),d=e[c];return React.createElement("div",{ref:f,className:"sts-container",onMouseEnter:p,style:{"--char-delay":`${l}ms`}},React.createElement("style",null,`
        .sts-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a0d18;
          cursor: pointer;
        }
        .sts-stage {
          position: relative;
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sts-char {
          display: inline-block;
          font-family: 'SF Mono', 'Monaco', monospace;
          font-size: 42px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #fff;
          text-shadow: 0 0 20px ${n}, 0 0 40px ${n}66;
          animation: sts-slidein 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        @keyframes sts-slidein {
          0% { opacity: 0; transform: translateY(-30px) translateX(var(--from, -20px)) scale(0.5); }
          60% { opacity: 1; transform: translateY(5px) translateX(0) scale(1.1); }
          100% { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
        }
      `),React.createElement("div",{key:c,className:"sts-stage"},d.split("").map((t,s)=>React.createElement("span",{key:s,className:"sts-char",style:{animationDelay:`${s*l}ms`,"--from":s%2===0?"-30px":"30px"}},t))))}window.SlideTextSequence=u;})();
