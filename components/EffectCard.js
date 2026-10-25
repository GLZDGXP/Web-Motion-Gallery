(()=>{var P=Object.defineProperty;var _=(e,d,t)=>d in e?P(e,d,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[d]=t;var B=(e,d,t)=>(_(e,typeof d!="symbol"?d+"":d,t),t);const E=(()=>{const e=new Map;let d=!1,t=0,f=0,c=!1;function g(o){if(!o.el)return 100;const s=o.el.getBoundingClientRect(),l=Math.max(1,s.width*s.height);return Math.max(50,Math.floor(80+l/5e3))}function R(){d=!1,t++,f=Date.now();const o=window.innerHeight,s=100,l=-s,v=o+s,w=o/2,z=c?o*.33:-1/0,b=c?o*.67:1/0,y=[];e.forEach((a,r)=>{if(!a.el)return;const n=a.el.getBoundingClientRect(),u=n.top+n.height/2,p=Math.abs(u-w),M=n.top<v&&n.bottom>l,C=!c||u>=z&&u<=b,A=Math.max(n.top,l),I=Math.min(n.bottom,v),L=Math.max(0,I-A);y.push({id:r,distance:p,inViewport:M,inFocusZone:C,visibleArea:L,cost:g(a)})});const k=y.filter(a=>a.inViewport&&a.visibleArea>0&&a.inFocusZone);k.sort((a,r)=>r.visibleArea!==a.visibleArea?r.visibleArea-a.visibleArea:a.distance-r.distance);const S=typeof PerfMonitor!="undefined"?PerfMonitor.getTargetCost():800;let m=0;const h=new Set;for(const a of k)if(m+a.cost<=S*1.1)h.add(a.id),m+=a.cost;else{h.size===0&&(h.add(a.id),m+=a.cost);break}let T=0;e.forEach((a,r)=>{const n=h.has(r);if(n!==a.active){a.active=n;try{a.setActive(n)}catch(u){}T++}})}function i(){d||(d=!0,requestAnimationFrame(R))}let N=null;function x(){N||(N=setInterval(()=>{document&&document.hidden||i()},300))}return typeof window!="undefined"&&(window.addEventListener("scroll",i,{passive:!0}),window.addEventListener("resize",i),setTimeout(()=>{window.EventBus&&(window.EventBus.on("perf-adapt","activation-scheduler",()=>i()),window.EventBus.on("perf-cost-change","activation-scheduler",()=>i()),window.EventBus.on("perf-focus-change","activation-scheduler",o=>{c=o,i()}))},0),document.readyState==="complete"||document.readyState==="interactive"?(setTimeout(i,50),setTimeout(i,150),setTimeout(i,300)):window.addEventListener("load",()=>{setTimeout(i,50),setTimeout(i,150),setTimeout(i,300)},{once:!0}),x()),{register(o,s,l){e.set(o,{el:s,setActive:l,active:!1}),i()},unregister(o){e.delete(o),i()},updateEl(o,s){const l=e.get(o);l&&(l.el=s,i())},_count:()=>e.size,_activeCount:()=>Array.from(e.values()).filter(o=>o.active).length,_recompute:R,_getCards:()=>e,_tickCount:()=>t,_lastTickTs:()=>f,_isFocusMode:()=>c}})();class $ extends React.Component{constructor(t){super(t);B(this,"resetError",()=>{this.setState({hasError:!1,error:""})});this.state={hasError:!1,error:""}}static getDerivedStateFromError(t){return{hasError:!0,error:(t==null?void 0:t.message)||String(t)}}componentDidCatch(t,f){console.warn("[EffectCard] card render error caught:",(t==null?void 0:t.message)||t)}render(){var t;if(this.state.hasError){const{onReload:f}=this.props;return React.createElement("div",{className:"card-error-fallback",style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"10px",background:"rgba(255, 80, 80, 0.06)",color:"rgba(255, 120, 120, 0.7)",fontSize:"12px",padding:"16px"}},React.createElement("div",{style:{fontSize:"24px"}},"\u26A0"),React.createElement("div",{style:{fontWeight:500}},"\u7EC4\u4EF6\u52A0\u8F7D\u5F02\u5E38"),React.createElement("div",{style:{fontSize:"11px",color:"rgba(255,120,120,0.5)",textAlign:"center",lineHeight:1.5}},((t=this.state.error)==null?void 0:t.slice(0,60))||"\u672A\u77E5\u9519\u8BEF"),React.createElement("button",{onClick:c=>{c.stopPropagation(),this.resetError(),f==null||f()},style:{marginTop:4,padding:"6px 14px",borderRadius:8,background:"rgba(255,120,120,0.15)",color:"#ff8a95",border:"1px solid rgba(255,120,120,0.3)",cursor:"pointer",fontSize:12,fontWeight:500}},"\u91CD\u65B0\u52A0\u8F7D"))}return this.props.children||null}}function V({effect:e,accentColor:d,onHover:t,children:f,favorite:c,onFavorite:g,onClick:R}){const[i,N]=React.useState(!1),x=React.useRef(null),o=React.useRef(null),[s,l]=React.useState(!1),[v,w]=React.useState(!1),[z,b]=React.useState(!1),[y,k]=React.useState(0),[S,m]=React.useState(!1),h=React.useRef(null),T=React.useCallback(()=>{const r=`${location.origin}${location.pathname}#${e.id}`,n=()=>{try{const p=document.createElement("textarea");return p.value=r,p.style.position="fixed",p.style.opacity="0",document.body.appendChild(p),p.select(),document.execCommand("copy"),document.body.removeChild(p),!0}catch(p){return!1}},u=()=>{m(!0),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>m(!1),1500)};navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(r).then(u).catch(()=>{n()&&u()}):n()&&u()},[e.id]);React.useEffect(()=>{const r=o.current;if(!r)return;const n=r.getBoundingClientRect();n.top<window.innerHeight+100&&n.bottom>-100&&n.width>0&&n.height>0&&(l(!0),b(!0));const p=new IntersectionObserver(M=>{M.forEach(C=>{l(C.isIntersecting),C.isIntersecting&&b(!0)})},{rootMargin:"100px 0px 100px 0px",threshold:0});return p.observe(r),()=>{p.disconnect(),l(!1),b(!1),w(!1)}},[e.id]),React.useEffect(()=>{if(!s||!x.current){E.unregister(e.id);return}return E.register(e.id,x.current,w),()=>E.unregister(e.id)},[s,e.id]);const a=s&&v;return React.createElement("div",{ref:x,className:`effect-card ${c?"favorited":""}`,"data-id":e.id},React.createElement("style",null,`
        .effect-card .card-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px 10px;
          position: relative;
          z-index: 3;
          background: linear-gradient(180deg, rgba(10,13,24,0.85) 0%, rgba(10,13,24,0.4) 100%);
        }
        .effect-card .card-index {
          flex-shrink: 0;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 500;
          color: color-mix(in srgb, var(--accent, #00e5ff) 70%, white);
          letter-spacing: 1.5px;
          line-height: 1.4;
          padding-top: 2px;
          min-width: 22px;
        }
        .effect-card .card-title-group {
          flex: 1;
          min-width: 0; /* \u5141\u8BB8 flex \u5B50\u9879\u6536\u7F29\uFF0C\u9632\u6B62\u6587\u5B57\u6491\u7834 */
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .effect-card .card-title {
          margin: 0;
          font-family: var(--font-display, -apple-system, sans-serif);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
          color: var(--text-primary, #fff);
          letter-spacing: 0.2px;
          /* \u591A\u884C\u81EA\u9002\u5E94 + \u6700\u591A 2 \u884C\u622A\u65AD */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        .effect-card .card-en {
          margin: 0;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 400;
          line-height: 1.3;
          color: var(--text-muted, rgba(255,255,255,0.5));
          letter-spacing: 0.6px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .effect-card .fav-btn {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s, transform 0.2s;
        }
        .effect-card .fav-btn:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.06);
        }
        .effect-card .fav-btn.active {
          color: #ff6b6b;
        }
        .effect-card .fav-btn svg {
          width: 16px;
          height: 16px;
        }
        .effect-card .card-demo {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .effect-card .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px 14px;
          gap: 10px;
        }
        .effect-card .card-footer .card-category {
          position: static;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.04);
          color: var(--text-muted, rgba(255,255,255,0.5));
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
        }
        .effect-card .card-actions {
          position: static;
          display: flex;
          gap: 6px;
          opacity: 1;
        }
        .effect-card .card-action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .effect-card .card-action-btn:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          border-color: rgba(255,255,255,0.15);
        }
        .effect-card .card-action-btn svg {
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }
        .effect-card .card-action-btn.fav.active {
          color: #ff6b6b;
          border-color: rgba(255, 107, 107, 0.2);
        }
        .effect-card .card-action-btn.copied {
          color: #33ff99;
          border-color: rgba(51, 255, 153, 0.2);
        }
        @media (max-width: 768px) {
          .effect-card .card-header { padding: 12px 12px 8px; }
          .effect-card .card-title { font-size: 14px; -webkit-line-clamp: 2; }
          .effect-card .card-en { font-size: 9px; }
          .effect-card .card-footer { padding: 8px 12px 12px; }
          .effect-card .card-demo { height: 200px; }
        }
      `),React.createElement("div",{className:"card-header"},React.createElement("div",{className:"card-index"},e.index),React.createElement("div",{className:"card-title-group"},React.createElement("h3",{className:"card-title"},e.name),React.createElement("p",{className:"card-en"},e.enName)),React.createElement("button",{className:`fav-btn ${c?"active":""}`,onClick:r=>{r.stopPropagation(),g==null||g(e.id)},"aria-label":c?"\u53D6\u6D88\u6536\u85CF":"\u6536\u85CF"},React.createElement("svg",{viewBox:"0 0 24 24",fill:c?"currentColor":"none",stroke:"currentColor",strokeWidth:"2"},React.createElement("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})))),React.createElement("div",{ref:o,className:"card-demo",onMouseEnter:()=>t==null?void 0:t(!0),onMouseLeave:()=>t==null?void 0:t(!1)},a?React.createElement($,{key:y,onReload:()=>k(r=>r+1)},f):React.createElement("div",{className:"card-placeholder"},s?React.createElement("div",{className:"placeholder-text standby"},React.createElement("span",{className:"placeholder-dot standby-dot"}),React.createElement("span",null,"\u5F85\u673A\u4E2D")):React.createElement("div",{className:"placeholder-text"},React.createElement("span",{className:"placeholder-dot"}),React.createElement("span",null,"\u6EDA\u5165\u89C6\u53E3\u540E\u52A0\u8F7D")))),React.createElement("div",{className:"card-footer"},React.createElement("div",{className:"card-category"},e.category),React.createElement("div",{className:"card-actions"},React.createElement("button",{className:"card-action-btn",onClick:r=>{r.stopPropagation(),T()}},React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"},React.createElement("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2"}),React.createElement("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})),S?"\u5DF2\u590D\u5236":"\u5206\u4EAB"),React.createElement("button",{className:`card-action-btn fav ${c?"active":""}`,onClick:r=>{r.stopPropagation(),g==null||g(e.id)}},React.createElement("svg",{viewBox:"0 0 24 24",fill:c?"currentColor":"none",stroke:"currentColor",strokeWidth:"2"},React.createElement("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})),c?"\u5DF2\u6536\u85CF":"\u6536\u85CF"))))}window.EffectCard=V;window.ActivationScheduler=E;})();
