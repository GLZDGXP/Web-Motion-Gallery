(()=>{var F=Object.defineProperty;var R=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var N=(t,e,o)=>e in t?F(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,E=(t,e)=>{for(var o in e||(e={}))M.call(e,o)&&N(t,o,e[o]);if(R)for(var o of R(e))z.call(e,o)&&N(t,o,e[o]);return t};const A=`
  .twk-panel{position:fixed;right:16px;top:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:top right;
    background:#fff;color:#1F2329;
    border:.5px solid #DEE0E3;border-radius:12px;
    box-shadow:0 8px 24px 8px rgba(0,0,0,.04),0 6px 12px rgba(0,0,0,.04),0 2px 6px rgba(0,0,0,.04);
    font:12px/1.5 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:12px 12px 12px 16px;cursor:move;user-select:none;
    border-bottom:.5px solid #EBECEE}
  .twk-hd b{font-size:14px;font-weight:600;letter-spacing:.01em;color:#1F2329}
  .twk-x{appearance:none;border:0;background:transparent;color:#86909C;
    width:24px;height:24px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:#F2F3F5;color:#1F2329}
  .twk-body{padding:14px 16px 16px;display:flex;flex-direction:column;gap:14px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:#DEE0E3 transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:#DEE0E3;border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:#C9CDD4;
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:8px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:#1F2329}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:#646A73;font-variant-numeric:tabular-nums}

  .twk-sect{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:#86909C;padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:32px;padding:0 10px;
    border:.5px solid #DEE0E3;border-radius:8px;
    background:#fff;color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:#1F2329;box-shadow:0 0 0 2px rgba(31,35,41,.1)}
  select.twk-field{padding-right:24px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%234E5969' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 10px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:#EBECEE;outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:16px;height:16px;border-radius:50%;background:#fff;
    border:.5px solid #DEE0E3;box-shadow:0 1px 3px rgba(0,0,0,.16);cursor:default}
  .twk-slider::-moz-range-thumb{width:16px;height:16px;border-radius:50%;
    background:#fff;border:.5px solid #DEE0E3;box-shadow:0 1px 3px rgba(0,0,0,.16);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:#EBECEE;user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.1);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:#646A73;font:inherit;font-weight:500;min-height:28px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere;transition:color .15s}
  .twk-seg button[aria-checked="true"]{color:#1F2329}

  .twk-toggle{position:relative;width:36px;height:20px;border:0;border-radius:999px;
    background:#E4E6E8;transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#1F2329}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(16px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:32px;padding:0 0 0 10px;
    border:.5px solid #DEE0E3;border-radius:8px;background:#fff}
  .twk-num-lbl{font-weight:500;color:#646A73;cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 10px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:10px;color:#86909C}

  .twk-btn{appearance:none;height:32px;padding:0 14px;border:0;border-radius:8px;
    background:#1F2329;color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:#333A44}
  .twk-btn.secondary{background:#F2F3F5;color:#1F2329}
  .twk-btn.secondary:hover{background:#E5E6EB}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:24px;
    border:.5px solid #DEE0E3;border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:8px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:40px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.05);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.14),0 4px 10px rgba(0,0,0,.1)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 2px #fff,0 0 0 3.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;function j(t){const[e,o]=React.useState(t),r=React.useCallback((i,c)=>{const a=typeof i=="object"&&i!==null?i:{[i]:c};o(d=>E(E({},d),a));try{window.parent.postMessage({type:"miaoda:tweaks:set-keys",edits:a},"*")}catch(d){}window.dispatchEvent(new CustomEvent("tweakchange",{detail:a}))},[]);return[e,r]}function S({title:t="Tweaks",children:e}){const[o,r]=React.useState(!1),i=React.useRef(null),c=React.useRef({x:16,y:16}),a=16,d=React.useCallback(()=>{const s=i.current;if(!s)return;const u=s.offsetWidth,p=s.offsetHeight,w=Math.max(a,window.innerWidth-u-a),f=Math.max(a,window.innerHeight-p-a);c.current={x:Math.min(w,Math.max(a,c.current.x)),y:Math.min(f,Math.max(a,c.current.y))},s.style.right=c.current.x+"px",s.style.top=c.current.y+"px"},[]);React.useEffect(()=>{if(!o)return;if(d(),typeof ResizeObserver=="undefined")return window.addEventListener("resize",d),()=>window.removeEventListener("resize",d);const s=new ResizeObserver(d);return s.observe(document.documentElement),()=>s.disconnect()},[o,d]),React.useEffect(()=>{const s=u=>{var w;const p=(w=u==null?void 0:u.data)==null?void 0:w.type;p==="miaoda:tweaks:activate"?r(!0):p==="miaoda:tweaks:deactivate"&&r(!1)};window.addEventListener("message",s);try{window.parent.postMessage({type:"miaoda:tweaks:available"},"*")}catch(u){}return()=>window.removeEventListener("message",s)},[]);const h=()=>{r(!1);try{window.parent.postMessage({type:"miaoda:tweaks:dismissed"},"*")}catch(s){}},x=s=>{const u=i.current;if(!u)return;const p=u.getBoundingClientRect(),w=s.clientX,f=s.clientY,m=window.innerWidth-p.right,k=p.top,n=l=>{c.current={x:m-(l.clientX-w),y:k+(l.clientY-f)},d()},g=()=>{window.removeEventListener("mousemove",n),window.removeEventListener("mouseup",g)};window.addEventListener("mousemove",n),window.addEventListener("mouseup",g)};return o?React.createElement(React.Fragment,null,React.createElement("style",null,A),React.createElement("div",{ref:i,className:"twk-panel","data-miaoda-chrome":"",style:{right:c.current.x,top:c.current.y}},React.createElement("div",{className:"twk-hd",onMouseDown:x},React.createElement("b",null,t),React.createElement("button",{className:"twk-x","aria-label":"Close tweaks",onMouseDown:s=>s.stopPropagation(),onClick:h},"\u2715")),React.createElement("div",{className:"twk-body"},e))):null}function _({label:t,children:e}){return React.createElement(React.Fragment,null,React.createElement("div",{className:"twk-sect"},t),e)}function v({label:t,value:e,children:o,inline:r=!1}){return React.createElement("div",{className:r?"twk-row twk-row-h":"twk-row"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,t),e!=null&&React.createElement("span",{className:"twk-val"},e)),o)}function B({label:t,value:e,min:o=0,max:r=100,step:i=1,unit:c="",onChange:a}){return React.createElement(v,{label:t,value:`${e}${c}`},React.createElement("input",{type:"range",className:"twk-slider",min:o,max:r,step:i,value:e,onChange:d=>a(Number(d.target.value))}))}function P({label:t,value:e,onChange:o}){return React.createElement("div",{className:"twk-row twk-row-h"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,t)),React.createElement("button",{type:"button",className:"twk-toggle","data-on":e?"1":"0",role:"switch","aria-checked":!!e,onClick:()=>o(!e)},React.createElement("i",null)))}function H({label:t,value:e,options:o,onChange:r}){var k;const i=React.useRef(null),[c,a]=React.useState(!1),d=React.useRef(e);d.current=e;const h=n=>String(typeof n=="object"?n.label:n).length;if(!(o.reduce((n,g)=>Math.max(n,h(g)),0)<=((k={2:16,3:10}[o.length])!=null?k:0))){const n=g=>{const l=o.find(b=>String(typeof b=="object"?b.value:b)===g);return l===void 0?g:typeof l=="object"?l.value:l};return React.createElement(C,{label:t,value:e,options:o,onChange:g=>r(n(g))})}const u=o.map(n=>typeof n=="object"?n:{value:n,label:n}),p=Math.max(0,u.findIndex(n=>n.value===e)),w=u.length,f=n=>{const g=i.current.getBoundingClientRect(),l=g.width-4,b=Math.floor((n-g.left-2)/l*w);return u[Math.max(0,Math.min(w-1,b))].value};return React.createElement(v,{label:t},React.createElement("div",{ref:i,role:"radiogroup",onPointerDown:n=>{a(!0);const g=f(n.clientX);g!==d.current&&r(g);const l=L=>{if(!i.current)return;const y=f(L.clientX);y!==d.current&&r(y)},b=()=>{a(!1),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",b)};window.addEventListener("pointermove",l),window.addEventListener("pointerup",b)},className:c?"twk-seg dragging":"twk-seg"},React.createElement("div",{className:"twk-seg-thumb",style:{left:`calc(2px + ${p} * (100% - 4px) / ${w})`,width:`calc((100% - 4px) / ${w})`}}),u.map(n=>React.createElement("button",{key:n.value,type:"button",role:"radio","aria-checked":n.value===e},n.label))))}function C({label:t,value:e,options:o,onChange:r}){return React.createElement(v,{label:t},React.createElement("select",{className:"twk-field",value:e,onChange:i=>r(i.target.value)},o.map(i=>{const c=typeof i=="object"?i.value:i,a=typeof i=="object"?i.label:i;return React.createElement("option",{key:c,value:c},a)})))}function I({label:t,value:e,placeholder:o,onChange:r}){return React.createElement(v,{label:t},React.createElement("input",{className:"twk-field",type:"text",value:e,placeholder:o,onChange:i=>r(i.target.value)}))}function X({label:t,value:e,min:o,max:r,step:i=1,unit:c="",onChange:a}){const d=s=>o!=null&&s<o?o:r!=null&&s>r?r:s,h=React.useRef({x:0,val:0});return React.createElement("div",{className:"twk-num"},React.createElement("span",{className:"twk-num-lbl",onPointerDown:s=>{s.preventDefault(),h.current={x:s.clientX,val:e};const u=(String(i).split(".")[1]||"").length,p=f=>{const m=f.clientX-h.current.x,k=h.current.val+m*i,n=Math.round(k/i)*i;a(d(Number(n.toFixed(u))))},w=()=>{window.removeEventListener("pointermove",p),window.removeEventListener("pointerup",w)};window.addEventListener("pointermove",p),window.addEventListener("pointerup",w)}},t),React.createElement("input",{type:"number",value:e,min:o,max:r,step:i,onChange:s=>a(d(Number(s.target.value)))}),c&&React.createElement("span",{className:"twk-num-unit"},c))}function V(t){const e=String(t).replace("#",""),o=e.length===3?e.replace(/./g,d=>d+d):e.padEnd(6,"0"),r=parseInt(o.slice(0,6),16);if(Number.isNaN(r))return!0;const i=r>>16&255,c=r>>8&255,a=r&255;return i*299+c*587+a*114>148e3}const W=({light:t})=>React.createElement("svg",{viewBox:"0 0 14 14","aria-hidden":"true"},React.createElement("path",{d:"M3 7.2 5.8 10 11 4.2",fill:"none",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",stroke:t?"rgba(0,0,0,.78)":"#fff"}));function K({label:t,value:e,options:o,onChange:r}){if(!o||!o.length)return React.createElement("div",{className:"twk-row twk-row-h"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,t)),React.createElement("input",{type:"color",className:"twk-swatch",value:e,onChange:a=>r(a.target.value)}));const i=a=>String(JSON.stringify(a)).toLowerCase(),c=i(e);return React.createElement(v,{label:t},React.createElement("div",{className:"twk-chips",role:"radiogroup"},o.map((a,d)=>{const h=Array.isArray(a)?a:[a],[x,...s]=h,u=s.slice(0,4),p=i(a)===c;return React.createElement("button",{key:d,type:"button",className:"twk-chip",role:"radio","aria-checked":p,"data-on":p?"1":"0","aria-label":h.join(", "),title:h.join(" \xB7 "),style:{background:x},onClick:()=>r(a)},u.length>0&&React.createElement("span",null,u.map((w,f)=>React.createElement("i",{key:f,style:{background:w}}))),p&&React.createElement(W,{light:V(x)}))})))}function O({label:t,onClick:e,secondary:o=!1}){return React.createElement("button",{type:"button",className:o?"twk-btn secondary":"twk-btn",onClick:e},t)}S.dcOverlay=!0;Object.assign(window,{useTweaks:j,TweaksPanel:S,TweakSection:_,TweakRow:v,TweakSlider:B,TweakToggle:P,TweakRadio:H,TweakSelect:C,TweakText:I,TweakNumber:X,TweakColor:K,TweakButton:O});(function(){const t=document.createElement("style");t.textContent=`
    @keyframes twk-blink{50%{opacity:0}}
    @keyframes twk-fadein{from{opacity:0;transform:translateX(4px)}to{opacity:1;transform:none}}
    .twk-sugg{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:8px;
      background:#F7F8FA;border:.5px solid #EBECEE;transition:all .15s}
    .twk-sugg:focus-within{background:#F2F3F5;border-color:#DEE0E3}
    .twk-sugg-field{position:relative;flex:1;min-width:0}
    .twk-sugg-field input{width:100%;height:20px;border:0;background:transparent;
      font:inherit;outline:none;color:inherit}
    .twk-sugg-ghost{position:absolute;inset:0;display:flex;align-items:center;
      color:#86909C;pointer-events:none;white-space:nowrap;overflow:hidden}
    .twk-sugg-ghost.hint{color:#A9AEB8}
    .twk-sugg-caret{display:inline-block;width:1px;height:13px;margin-left:1px;
      border-right:1.5px solid currentColor;opacity:.5;animation:twk-blink 1s step-end infinite}
    .twk-sugg-ideas{appearance:none;border:0;background:transparent;font:inherit;
      font-size:10.5px;font-weight:600;color:#646A73;cursor:default;padding:0 2px;
      white-space:nowrap;animation:twk-fadein .25s ease}
    .twk-sugg-ideas:hover{color:#1F2329}
    .twk-sugg-ideas svg{color:#D97757}
    .twk-sugg-send{appearance:none;border:0;height:20px;padding:0 8px;border-radius:5px;
      background:#1F2329;color:#fff;font:inherit;font-size:10px;font-weight:600;cursor:default}
  `,document.head.appendChild(t)})();const T=t=>{try{window.parent.postMessage({type:"miaoda:tweaks:chat",text:t},"*")}catch(e){}},$="M18.3658 62.2435L36.7823 51.9165L37.0858 51.012L36.7823 50.5083H35.8716L32.7853 50.3206L22.2616 50.0389L13.1546 49.6634L4.30054 49.194L2.07438 48.7246L0 45.9551L0.202378 44.5938L2.07438 43.3264L4.75589 43.5611L10.6755 43.9836L19.5801 44.5938L26.0056 44.9693L35.568 45.9551H37.0858L37.2882 45.3448L36.7823 44.9693L36.3775 44.5938L27.1693 38.3507L17.2022 31.7789L11.9909 27.9767L9.20822 26.0522L7.79157 24.2684L7.18443 20.3254L9.71416 17.5089L13.1546 17.7436L14.0147 17.9783L17.5057 20.654L24.9431 26.4277L34.6573 33.5627L36.0739 34.7362L36.6444 34.3512L36.7317 34.079L36.0739 32.9994L30.8121 23.4704L25.1961 13.7537L22.6664 9.71675L22.0086 7.32277C21.7539 6.31812 21.6039 5.48695 21.6039 4.45938L24.4878 0.516349L26.1068 0L30.0026 0.516349L31.6216 1.92457L34.0502 7.46359L37.9459 16.1476L44.0173 27.9767L45.7881 31.4973L46.7494 34.7362L47.1036 35.722H47.7107V35.1587L48.2166 28.4931L49.1274 20.3254L50.0381 9.81063L50.3416 6.85336L51.8089 3.28586L54.7434 1.36128L57.0201 2.44092L58.8921 5.11655L58.6391 6.85336L57.5261 14.0822L55.3505 25.395L53.9338 32.9994H54.7434L55.7047 32.0136L59.5498 26.944L65.9753 18.8702L68.8086 15.6782L72.1479 12.1577L74.2729 10.4678H78.3204L81.2549 14.8802L79.9395 19.4335L75.7907 24.6909L72.3503 29.1503L67.4173 35.7593L64.3563 41.0732L64.6308 41.5116L65.3682 41.4487L76.499 39.0548L82.5198 37.9751L89.7042 36.7547L92.9423 38.2568L93.2964 39.8058L92.0316 42.9509L84.3412 44.8285L75.3354 46.6592L61.9245 49.8162L61.776 49.9356L61.9513 50.1956L67.9991 50.743L70.5795 50.8839H76.9038L88.6923 51.7757L91.7786 53.7942L93.6 56.282L93.2964 58.2066L88.5405 60.6006L82.1656 59.0985L67.2402 55.531L62.1302 54.2636H61.4218V54.6861L65.6718 58.8638L73.514 65.9049L83.2787 75.0114L83.7846 77.2646L82.5198 79.0483L81.2043 78.8606L72.6032 72.3827L69.264 69.4724L61.776 63.1354H61.2701V63.7926L62.9903 66.3274L72.1479 80.081L72.6032 84.3057L71.9455 85.667L69.5676 86.5119L66.9872 86.0425L61.5736 78.4851L56.0588 70.0357L51.6065 62.4313L51.0687 62.7708L48.419 91.0652L47.2048 92.5204L44.3715 93.6L41.9935 91.8162L40.7286 88.9059L41.9935 83.1322L43.5114 75.6217L44.7256 69.6602L45.8387 62.2435L46.5185 59.7659L46.4584 59.6001L45.9153 59.6914L40.3239 67.3601L31.824 78.8606L25.0949 86.0425L23.4759 86.6997L20.6932 85.2445L20.9462 82.6628L22.5146 80.3627L31.824 68.5336L37.44 61.1639L41.0595 56.9335L41.0243 56.3216L40.8245 56.3046L16.0891 72.4297L11.6874 72.993L9.76476 71.2092L10.0177 68.2989L10.9284 67.3601L18.3658 62.2435Z";function Y({size:t=12}){return React.createElement("svg",{width:t,height:t,viewBox:"0 0 94 94",fill:"currentColor",style:{display:"inline-block",verticalAlign:"-1px"}},React.createElement("path",{d:$}))}function J({suggestions:t=[],placeholder:e="Describe a tweak\u2026",ideasPrompt:o="Suggest three more tweak ideas for this design and update the suggestions on TweakSuggestionBar."}){const[r,i]=React.useState(""),[c,a]=React.useState(""),[d,h]=React.useState(!1),x=React.useRef(null),s=q(t,{placeholder:e,enabled:!r&&!c&&!d}),u=()=>{var g;if(s.markPlayed(),r||c)return;const n=s.done?"":t[s.idx];n&&a(n),(g=x.current)==null||g.focus()},p=()=>{const n=(r||c).trim();n&&(T(n),i(""),a(""))},w=n=>{n.key==="Tab"&&c&&!r?(n.preventDefault(),i(c),a("")):n.key==="Enter"?(n.preventDefault(),p()):n.key==="Escape"&&a("")},f=()=>T(o),m=!r&&!c&&!d&&!s.done,k=!r&&!c&&!d&&s.done;return React.createElement("div",{className:"twk-sugg",onMouseDown:u},React.createElement("div",{className:"twk-sugg-field"},React.createElement("input",{ref:x,value:r,placeholder:d&&!c?e:"",onChange:n=>{i(n.target.value),a("")},onFocus:()=>{h(!0),s.markPlayed()},onBlur:()=>{h(!1),r||a("")},onKeyDown:w}),m&&React.createElement("div",{className:"twk-sugg-ghost"},s.text,React.createElement("span",{className:"twk-sugg-caret"})),k&&React.createElement("div",{className:"twk-sugg-ghost"},s.tail,s.tail.length<e.length&&React.createElement("span",{className:"twk-sugg-caret"})),c&&!r&&React.createElement("div",{className:"twk-sugg-ghost hint"},c)),r||c?React.createElement("button",{className:"twk-sugg-send",onMouseDown:n=>{n.stopPropagation(),n.preventDefault()},onClick:p},"Add"):s.done&&!d?React.createElement("button",{className:"twk-sugg-ideas",onMouseDown:n=>{n.stopPropagation(),n.preventDefault()},onClick:f},"Ideas ",React.createElement(Y,null)):null)}function q(t,{placeholder:e,typeMs:o=35,eraseMs:r=22,pauseMs:i=1800,enabled:c=!0}={}){const a=React.useMemo(()=>"__twk_played:"+JSON.stringify(t),[t.join(`
`)]),d=()=>{try{return sessionStorage.getItem(a)==="1"}catch(l){return!1}},[h,x]=React.useState(""),[s,u]=React.useState(()=>t.length===0||d()?e:""),[p,w]=React.useState(0),[f,m]=React.useState(()=>t.length===0||d()),k=React.useRef("type"),n=React.useRef(0),g=React.useCallback(()=>{try{sessionStorage.setItem(a,"1")}catch(l){}m(!0)},[a]);return React.useEffect(()=>{const l=t.length===0||d();x(""),w(0),m(l),u(l?e:""),k.current="type",n.current=0},[a]),React.useEffect(()=>{var y;if(f||!c)return;const l=(y=t[p])!=null?y:"";let b;const L=()=>{if(k.current==="type")n.current++,x(l.slice(0,n.current)),n.current>=l.length?(k.current="pause",b=setTimeout(L,i)):b=setTimeout(L,o+Math.random()*20);else if(k.current==="pause")k.current="erase",b=setTimeout(L,r);else if(n.current--,x(l.slice(0,n.current)),n.current<=0){if(p===t.length-1){g();return}k.current="type",w(D=>D+1)}else b=setTimeout(L,r)};return k.current="type",n.current=0,x(""),b=setTimeout(L,400),()=>clearTimeout(b)},[p,f,a,c,o,r,i]),React.useEffect(()=>{if(!f||s===e)return;let l=0;const b=setInterval(()=>{l++,u(e.slice(0,l)),l>=e.length&&clearInterval(b)},28);return()=>clearInterval(b)},[f,e]),{text:h,tail:s,idx:p,done:f,markPlayed:g}}Object.assign(window,{TweakSuggestionBar:J});})();
