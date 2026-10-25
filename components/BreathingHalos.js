(()=>{function b({accentColor:m="#00e5ff",motionLevel:o="rich"}){const[c,n]=React.useState([]),r=React.useRef(null),t=React.useRef(0);React.useEffect(()=>{const e=[{id:t.current++,x:30,y:40,size:200,hue:190,delay:0},{id:t.current++,x:70,y:60,size:250,hue:280,delay:1.5},{id:t.current++,x:50,y:50,size:180,hue:330,delay:3}];n(e)},[]);const l=React.useCallback(e=>{if(!r.current)return;const a=r.current.getBoundingClientRect(),u=(e.clientX-a.left)/a.width*100,d=(e.clientY-a.top)/a.height*100,i=t.current++,h=180+Math.random()*120,f=100+Math.random()*100;n(s=>[...s,{id:i,x:u,y:d,size:f,hue:h,delay:0,temporary:!0}]),setTimeout(()=>{n(s=>s.filter(y=>y.id!==i))},4e3)},[]);return React.createElement("div",{ref:r,className:"bh-container",onMouseMove:l},React.createElement("style",null,`
        .bh-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #0a0d18;
        }
        .bh-halo {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          animation: bh-breath ${o==="subtle"?6:o==="intense"?2.5:4}s ease-in-out infinite alternate;
        }
        @keyframes bh-breath {
          0% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
        }
        .bh-halo.bh-temp {
          animation: bh-fadeout 4s ease-out forwards;
        }
        @keyframes bh-fadeout {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.3); }
          30% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
      `),c.map(e=>React.createElement("div",{key:e.id,className:`bh-halo ${e.temporary?"bh-temp":""}`,style:{left:`${e.x}%`,top:`${e.y}%`,width:e.size,height:e.size,background:`radial-gradient(circle, hsla(${e.hue}, 80%, 60%, 0.7) 0%, transparent 70%)`,animationDelay:`${e.delay}s`}})))}window.BreathingHalos=b;})();
