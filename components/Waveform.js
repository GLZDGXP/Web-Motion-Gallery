(()=>{function Z({accentColor:p="#00e5ff",motionLevel:i="rich"}){var D;const l=React.useRef(null),d=React.useRef(null),r=useMousePosition(d),u=React.useRef({x:-999,y:.5,active:!1}),m=React.useRef(0),C=React.useRef(null),N=React.useRef(null);React.useEffect(()=>{var t;u.current={x:r.x,y:r.y/(((t=d.current)==null?void 0:t.clientHeight)||1),active:r.active}},[r]);const B=i==="subtle"?.5:i==="intense"?1.8:1,j=(D=PerfMonitor.isLow)!=null&&D.call(PerfMonitor)?24:i==="intense"?56:40,S=Math.max(16,Math.min(64,j)),q=React.useCallback((t,a,c,n,M,h)=>{var U;const s=h.baseHue,f=h.bars,K=n*.001;(!C.current||C.current.width!==Math.ceil(a/S)*2)&&F(s,Math.ceil(a/S),c),m.current+=M*.003*B;const k=m.current,Q=u.current.y,X=u.current.active?.6+Math.max(0,1-Math.abs(Q-.5)*2)*.6:.5;t.clearRect(0,0,a,c);const R=c/2,L=a/f.length,O=2,W=Math.max(1,L-O),I=C.current,b=N.current;for(let o=0;o<f.length;o++){const e=f[o],g=o/f.length,V=Math.sin(g*8+k)*.3+Math.sin(g*16-k*1.3)*.2+Math.sin(g*4+k*.7)*.25+Math.sin(g*24+k*2)*.1+Math.sin(g*2+k*.3)*.15,T=(Math.sin(K*10+o*.7)*.5+.5)*.2,H=(Math.abs(V)+T*.3)*X;e.amp+=(H-e.amp)*.2,e.peak=Math.max(e.peak*.96,e.amp);const w=e.amp*c*.4,E=e.peak*c*.4,x=o*L+O/2;if(I&&w>.5){const Y=Math.max(1,w*2),A=R-w;t.drawImage(I,0,0,I.width,I.height,x,A,W,Y)}e.peak>.05&&b&&(t.drawImage(b,0,0,b.width,b.height,x,R-E-1.5,W,2),t.drawImage(b,0,0,b.width,b.height,x,R+E-.5,W,2))}const P=t.createLinearGradient(0,R-2,0,R+2);P.addColorStop(0,"transparent"),P.addColorStop(.5,`hsla(${s}, 100%, 80%, 0.6)`),P.addColorStop(1,"transparent"),t.fillStyle=P,t.fillRect(0,R-2,a,4);const v=a/2,y=c/2,$=Math.min(a,c)*.28;t.lineWidth=1,t.strokeStyle=`hsla(${s}, 100%, 70%, 0.12)`,t.beginPath(),t.arc(v,y,$,0,Math.PI*2),t.stroke();const G=32;for(let o=0;o<G;o++){const e=o/G*Math.PI*2-Math.PI/2,g=Math.floor(o/G*f.length),T=(((U=f[g])==null?void 0:U.amp)||0)*$*.8,H=$-2,w=$+T+4,E=v+Math.cos(e)*H,x=y+Math.sin(e)*H,Y=v+Math.cos(e)*w,A=y+Math.sin(e)*w;t.strokeStyle=`hsla(${s+o*4}, 100%, 70%, 0.4)`,t.lineWidth=2,t.lineCap="round",t.beginPath(),t.moveTo(E,x),t.lineTo(Y,A),t.stroke()}const z=t.createRadialGradient(v,y,0,v,y,20);z.addColorStop(0,`hsla(${s}, 100%, 80%, 0.8)`),z.addColorStop(1,"transparent"),t.fillStyle=z,t.beginPath(),t.arc(v,y,20,0,Math.PI*2),t.fill()},[B]);function F(t,a,c){const n=document.createElement("canvas");n.width=Math.max(2,a),n.height=Math.max(4,Math.min(200,c));const M=n.getContext("2d"),h=M.createLinearGradient(0,0,0,n.height);h.addColorStop(0,`hsla(${t}, 100%, 75%, 0.9)`),h.addColorStop(.5,`hsla(${(t+20)%360}, 100%, 65%, 0.95)`),h.addColorStop(1,`hsla(${t}, 100%, 75%, 0.9)`),M.fillStyle=h,M.fillRect(0,0,n.width,n.height),C.current=n;const s=document.createElement("canvas");s.width=Math.max(2,a),s.height=4;const f=s.getContext("2d");f.fillStyle=`hsla(${(t+30)%360}, 100%, 85%, 0.8)`,f.fillRect(0,0,s.width,s.height),N.current=s}const J=React.useCallback((t,a,c)=>{const n=tt(p),M=[];for(let h=0;h<S;h++)M.push({amp:0,peak:0,phase:Math.random()*Math.PI*2});return F(n,Math.ceil(a/S),c),{bars:M,baseHue:n}},[p,S]);return React.createElement("div",{ref:d,style:{position:"absolute",inset:0,background:"#05070f",cursor:"crosshair"}},React.createElement("style",null,`
        .wf-label {
          position: absolute;
          top: 16px;
          left: 18px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1.5px;
          pointer-events: none;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wf-label-val {
          color: ${hexToRgba(p,.7)};
        }
        .wf-hint {
          position: absolute;
          bottom: 16px;
          right: 18px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
          pointer-events: none;
          z-index: 2;
        }
      `),React.createElement("canvas",{ref:l,style:{position:"absolute",inset:0,display:"block"}}),React.createElement("div",{className:"wf-label"},React.createElement("span",null,"CH \xB7 01"),React.createElement("span",{className:"wf-label-val"},"AUDIO \xB7 WAVE")),React.createElement("div",{className:"wf-hint"},"\u2191 \u79FB\u52A8\u9F20\u6807\u8C03\u8282\u5F3A\u5EA6"),React.createElement(_,{draw:q,setup:J,canvasRef:l}))}function _({draw:p,setup:i,canvasRef:l}){return useCanvasEffect(l,{draw:p,setup:i,active:!0}),null}function tt(p){const i=parseInt(p.slice(1,3),16)/255,l=parseInt(p.slice(3,5),16)/255,d=parseInt(p.slice(5,7),16)/255,r=Math.max(i,l,d),u=Math.min(i,l,d);let m;return r===u?m=0:r===i?m=(l-d)/(r-u)%6:r===l?m=(d-i)/(r-u)+2:m=(i-l)/(r-u)+4,Math.round(m*60)}window.Waveform=Z;})();
