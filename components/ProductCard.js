(()=>{function d({product:t,accentColor:e="#00e5ff",index:p=0}){const[a,i]=React.useState({x:0,y:0});return React.createElement("div",{className:"product-card",onMouseMove:r=>{const o=r.currentTarget.getBoundingClientRect(),n=(r.clientX-o.left)/o.width-.5,s=(r.clientY-o.top)/o.height-.5;i({x:n*6,y:-s*6})},onMouseLeave:()=>i({x:0,y:0}),style:{transform:`perspective(1000px) rotateY(${a.x}deg) rotateX(${a.y}deg)`}},React.createElement("style",null,`
        .product-card {
          position: relative;
          border-radius: 20px;
          background: linear-gradient(145deg,
            rgba(22, 26, 44, 0.9) 0%,
            rgba(12, 15, 28, 0.95) 100%);
          border: 1px solid rgba(120, 150, 255, 0.1);
          overflow: hidden;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease;
          backdrop-filter: blur(10px);
          transform-style: preserve-3d;
        }
        .product-card:hover {
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.4),
            0 0 60px ${hexToRgba(e,.1)};
        }

        .product-preview {
          position: relative;
          height: 200px;
          border-bottom: 1px solid rgba(120, 150, 255, 0.08);
          overflow: hidden;
        }

        .product-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 4px 10px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          z-index: 5;
        }
        .product-tag.new {
          background: ${hexToRgba(e,.15)};
          color: ${e};
          border: 1px solid ${hexToRgba(e,.3)};
        }
        .product-tag.pro {
          background: rgba(255, 215, 0, 0.1);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        .product-tag.beta {
          background: rgba(177, 77, 255, 0.1);
          color: #b14dff;
          border: 1px solid rgba(177, 77, 255, 0.3);
        }

        .product-price {
          position: absolute;
          top: 16px;
          right: 16px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 20px;
          color: #fff;
          z-index: 5;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .product-price span {
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.6);
        }

        .product-body {
          padding: 24px;
          transform: translateZ(20px);
        }

        .product-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .product-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .product-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .product-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }
        .product-feature-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${hexToRgba(e,.15)};
          color: ${e};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .product-actions {
          display: flex;
          gap: 10px;
        }
        .product-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-family: var(--font-display);
        }
        .product-btn.primary {
          background: linear-gradient(135deg, ${e}, #b14dff);
          color: #0a0d18;
          font-weight: 600;
        }
        .product-btn.primary:hover {
          box-shadow: 0 4px 20px ${hexToRgba(e,.4)};
          transform: translateY(-1px);
        }
        .product-btn.ghost {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(120, 150, 255, 0.2);
        }
        .product-btn.ghost:hover {
          color: var(--text-primary);
          border-color: ${hexToRgba(e,.4)};
        }

        .product-preview-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `),React.createElement("div",{className:"product-preview"},React.createElement("span",{className:`product-tag ${t.tagType||"new"}`},t.tag),React.createElement("span",{className:"product-price"},t.price,React.createElement("span",null,"/\u6708")),React.createElement("div",{className:"product-preview-inner"},t.preview)),React.createElement("div",{className:"product-body"},React.createElement("h3",{className:"product-name"},t.name),React.createElement("p",{className:"product-desc"},t.desc),React.createElement("div",{className:"product-features"},t.features.map((r,o)=>React.createElement("div",{key:o,className:"product-feature"},React.createElement("div",{className:"product-feature-icon"},React.createElement("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("polyline",{points:"20 6 9 17 4 12"}))),React.createElement("span",null,r)))),React.createElement("div",{className:"product-actions"},React.createElement("button",{className:"product-btn primary"},"\u7ACB\u5373\u4F53\u9A8C"),React.createElement("button",{className:"product-btn ghost"},"\u67E5\u770B\u8BE6\u60C5"))))}window.ProductCard=d;})();
