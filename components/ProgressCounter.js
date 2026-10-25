(()=>{function w({accentColor:e="#00e5ff",active:b=!0,motionLevel:s="rich"}){const d=React.useRef(null),g=React.useRef(null),{active:u,inView:t}=useAnimated(d),k=b&&u,[o,x]=React.useState(0),[r,h]=React.useState({users:0,effects:0,uptime:0}),p=React.useRef(!1),N=a=>{const i=a.target,n=i.scrollTop/(i.scrollHeight-i.clientHeight);x(Math.min(1,Math.max(0,n)))};return React.useEffect(()=>{if(!t||p.current)return;p.current=!0;const a={users:12847,effects:256,uptime:99.97},i=s==="subtle"?2500:s==="intense"?1e3:1800,n=Date.now();let l=null,v=!1;const m=()=>{if(v)return;const y=Date.now()-n,f=Math.min(1,y/i),c=1-Math.pow(1-f,3);h({users:Math.floor(a.users*c),effects:Math.floor(a.effects*c),uptime:+(a.uptime*c).toFixed(2)}),f<1&&(l=requestAnimationFrame(m))};return m(),()=>{v=!0,l&&cancelAnimationFrame(l)}},[t,s]),React.createElement("div",{ref:d,className:"pc-container2",onScroll:N},React.createElement("style",null,`
        .pc-container2 {
          position: absolute;
          inset: 0;
          overflow-y: scroll;
          overflow-x: hidden;
          scrollbar-width: none;
          background:
            radial-gradient(ellipse at top, ${hexToRgba(e,.08)} 0%, transparent 60%),
            #0a0d18;
        }
        .pc-container2::-webkit-scrollbar { display: none; }

        .progress-bar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(120, 150, 255, 0.1);
          z-index: 20;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, ${e}, #b14dff, #ff4d9d);
          width: ${o*100}%;
          transition: width 0.05s linear;
          box-shadow: 0 0 10px ${hexToRgba(e,.5)};
        }

        .pc-inner {
          padding: 24px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-item {
          flex: 1;
          text-align: center;
          padding: 16px 8px;
          background: rgba(120, 150, 255, 0.05);
          border: 1px solid rgba(120, 150, 255, 0.1);
          border-radius: 12px;
        }
        .stat-num {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: ${e};
          line-height: 1.2;
        }
        .stat-label {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .pc-section {
          margin-bottom: 28px;
        }
        .pc-section-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-section-title::before {
          content: '';
          width: 4px;
          height: 16px;
          background: ${e};
          border-radius: 2px;
          box-shadow: 0 0 8px ${e};
        }

        .bar-item {
          margin-bottom: 10px;
        }
        .bar-label-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 11px;
        }
        .bar-name { color: var(--text-secondary); }
        .bar-val { color: ${e}; font-family: var(--font-mono); font-weight: 500; }
        .bar-track {
          height: 6px;
          background: rgba(120, 150, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, ${e}, #b14dff);
          box-shadow: 0 0 6px ${hexToRgba(e,.4)};
          transition: width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .pc-circles {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 16px 0;
        }
        .circle-stat {
          text-align: center;
        }
        .circle-ring {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: conic-gradient(
            ${e} 0%,
            ${e} var(--pct, 70%),
            rgba(120, 150, 255, 0.1) var(--pct, 70%),
            rgba(120, 150, 255, 0.1) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          box-shadow: 0 0 20px ${hexToRgba(e,.15)};
        }
        .circle-ring.purple {
          background: conic-gradient(
            #b14dff 0%,
            #b14dff var(--pct, 70%),
            rgba(120, 150, 255, 0.1) var(--pct, 70%),
            rgba(120, 150, 255, 0.1) 100%
          );
        }
        .circle-ring.pink {
          background: conic-gradient(
            #ff4d9d 0%,
            #ff4d9d var(--pct, 70%),
            rgba(120, 150, 255, 0.1) var(--pct, 70%),
            rgba(120, 150, 255, 0.1) 100%
          );
        }
        .circle-inner {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #0a0d18;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .circle-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pc-hint-bottom {
          text-align: center;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          padding: 16px 0;
          letter-spacing: 1px;
        }
      `),React.createElement("div",{className:"progress-bar"},React.createElement("div",{className:"progress-bar-fill"})),React.createElement("div",{ref:g,className:"pc-inner"},React.createElement("div",{className:"stat-row"},React.createElement("div",{className:"stat-item"},React.createElement("div",{className:"stat-num"},r.users.toLocaleString()),React.createElement("div",{className:"stat-label"},"Users")),React.createElement("div",{className:"stat-item"},React.createElement("div",{className:"stat-num"},r.effects),React.createElement("div",{className:"stat-label"},"Effects")),React.createElement("div",{className:"stat-item"},React.createElement("div",{className:"stat-num"},r.uptime,"%"),React.createElement("div",{className:"stat-label"},"Uptime"))),React.createElement("div",{className:"pc-section"},React.createElement("div",{className:"pc-section-title"},"\u6027\u80FD\u6307\u6807"),React.createElement("div",{className:"bar-item"},React.createElement("div",{className:"bar-label-row"},React.createElement("span",{className:"bar-name"},"\u6E32\u67D3\u6027\u80FD"),React.createElement("span",{className:"bar-val"},"96%")),React.createElement("div",{className:"bar-track"},React.createElement("div",{className:"bar-fill",style:{width:t?"96%":"0%"}}))),React.createElement("div",{className:"bar-item"},React.createElement("div",{className:"bar-label-row"},React.createElement("span",{className:"bar-name"},"\u5185\u5B58\u6548\u7387"),React.createElement("span",{className:"bar-val"},"88%")),React.createElement("div",{className:"bar-track"},React.createElement("div",{className:"bar-fill",style:{width:t?"88%":"0%"}}))),React.createElement("div",{className:"bar-item"},React.createElement("div",{className:"bar-label-row"},React.createElement("span",{className:"bar-name"},"\u4EE3\u7801\u8986\u76D6\u7387"),React.createElement("span",{className:"bar-val"},"92%")),React.createElement("div",{className:"bar-track"},React.createElement("div",{className:"bar-fill",style:{width:t?"92%":"0%"}})))),React.createElement("div",{className:"pc-section"},React.createElement("div",{className:"pc-section-title"},"\u73AF\u5F62\u6570\u636E"),React.createElement("div",{className:"pc-circles"},React.createElement("div",{className:"circle-stat"},React.createElement("div",{className:"circle-ring",style:{"--pct":t?"78%":"0%"}},React.createElement("div",{className:"circle-inner"},"78%")),React.createElement("div",{className:"circle-label"},"CSS")),React.createElement("div",{className:"circle-stat"},React.createElement("div",{className:"circle-ring purple",style:{"--pct":t?"65%":"0%"}},React.createElement("div",{className:"circle-inner"},"65%")),React.createElement("div",{className:"circle-label"},"Canvas")),React.createElement("div",{className:"circle-stat"},React.createElement("div",{className:"circle-ring pink",style:{"--pct":t?"85%":"0%"}},React.createElement("div",{className:"circle-inner"},"85%")),React.createElement("div",{className:"circle-label"},"SVG")))),React.createElement("div",{className:"pc-section"},React.createElement("div",{className:"pc-section-title"},"\u65F6\u95F4\u7EBF"),[{year:"2023",label:"\u521D\u59CB\u7248\u672C\u53D1\u5E03",status:"done"},{year:"2024",label:"\u65B0\u589E 15 \u79CD\u52A8\u6548",status:"done"},{year:"2025",label:"\u6027\u80FD\u5168\u9762\u4F18\u5316",status:"active"},{year:"2026",label:"AI \u52A8\u6548\u751F\u6210",status:"todo"}].map((a,i)=>React.createElement("div",{key:i,className:"tl-item",style:{display:"flex",gap:12,padding:"8px 0",position:"relative"}},React.createElement("div",{style:{width:10,height:10,borderRadius:"50%",background:a.status==="done"?e:a.status==="active"?"#ffd700":"#333",boxShadow:a.status!=="todo"?`0 0 8px ${a.status==="done"?e:"#ffd700"}`:"none",flexShrink:0,marginTop:4}}),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-muted)"}},a.year),React.createElement("div",{style:{fontSize:12,color:"var(--text-secondary)"}},a.label))))),React.createElement("div",{className:"pc-hint-bottom"},"\u2014 SCROLL PROGRESS \xB7 ",Math.round(o*100),"% \u2014")))}window.ProgressCounter=w;})();
