(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  let _defaultReduceMotion = "system";
  try {
    const saved = localStorage.getItem("mg_reduce_motion_override");
    if (saved === "system" || saved === "off")
      _defaultReduceMotion = saved;
  } catch (e) {
  }
  let _defaultMotionLevel = "rich";
  try {
    if (_defaultReduceMotion === "system" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      _defaultMotionLevel = "subtle";
    }
    const savedML = localStorage.getItem("mg_motion_level");
    if (savedML === "subtle" || savedML === "rich" || savedML === "intense") {
      _defaultMotionLevel = savedML;
    }
  } catch (e) {
  }
  const TWEAK_DEFAULTS = {
    "accentColor": "#00e5ff",
    "density": "compact",
    "particleAmount": "medium",
    "motionLevel": _defaultMotionLevel,
    "perfTier": "auto",
    "reduceMotion": _defaultReduceMotion
  };
  const EFFECTS = [
    { id: "liquid-glass", index: "01", name: "\u6DB2\u6001\u73BB\u7483", enName: "Liquid Glass", category: "\u6750\u8D28 / Material", description: "\u771F\u5B9E\u73BB\u7483\u6750\u8D28\u2014\u2014\u6298\u5C04\u3001\u900F\u5149\u4E0E\u6A21\u7CCA\u53E0\u52A0\uFF0C\u60AC\u6D6E\u5728\u6DF1\u7A7A\u80CC\u666F\u4E0A\uFF0C\u6298\u5C04\u8FB9\u7F18\u5E26\u51FA\u5F69\u8679\u8272\u6563\u3002", tags: ["Glassmorphism", "Backdrop-filter", "3D Transform"], component: "LiquidGlass" },
    { id: "particle-dissolve", index: "02", name: "\u7C92\u5B50\u6D88\u6563", enName: "Particle Dissolve", category: "\u7C92\u5B50 / Particle", description: "\u4E07\u5343\u7C92\u5B50\u6784\u6210\u5F62\u4F53\uFF0C\u5149\u6807\u63A0\u8FC7\u5982\u98CE\u5439\u70DF\u5C18\uFF0C\u6CBF\u7740\u8FD0\u52A8\u65B9\u5411\u98D8\u6563\u3001\u91CD\u7EC4\uFF0C\u518D\u91CD\u805A\u6210\u5F62\u3002", tags: ["Canvas", "Particle System", "Mouse Interaction"], component: "ParticleDissolve" },
    { id: "magnetic-field", index: "03", name: "\u78C1\u573A\u7C92\u5B50", enName: "Magnetic Field", category: "\u7269\u7406 / Physics", description: "\u7C92\u5B50\u5728\u865A\u62DF\u78C1\u573A\u4E2D\u6CBF\u529B\u7EBF\u6D41\u6DCC\uFF0C\u5149\u6807\u6210\u4E3A\u79FB\u52A8\u78C1\u6781\uFF0C\u7ED8\u5236\u51FA\u53EF\u89C1\u7684\u5F15\u529B\u573A\u7EBF\u4E0E\u6D41\u7EBF\u3002", tags: ["Perlin Noise", "Vector Field", "Physics"], component: "MagneticField", heavy: true },
    { id: "text-reveal", index: "04", name: "\u6587\u5B57\u52A8\u6548", enName: "Kinetic Typography", category: "\u6392\u7248 / Typography", description: "\u5B57\u7B26\u62C6\u5206\u540E\u5404\u6709\u72EC\u7ACB\u7684\u8FD0\u52A8\u8F68\u8FF9\u4E0E\u8282\u594F\u2014\u2014\u62C6\u89E3\u3001\u6D41\u52A8\u3001\u95EA\u70C1\uFF0C\u7F16\u6392\u6210\u6709\u751F\u547D\u529B\u7684\u6587\u5B57\u8868\u6F14\u3002", tags: ["Character Animation", "Split Text", "Easing"], component: "TextReveal" },
    { id: "neon-glow", index: "05", name: "\u9713\u8679\u53D1\u5149", enName: "Neon Glow", category: "\u5149\u6548 / Lighting", description: "\u8D5B\u535A\u670B\u514B\u9713\u8679\u5149\u7BA1\uFF0C\u591A\u5C42\u53D1\u5149\u53E0\u52A0\u5236\u9020\u771F\u5B9E\u706F\u7BA1\u8F89\u5149\u4E0E\u5468\u671F\u95EA\u70C1\uFF0C\u70B9\u4EAE\u591C\u8272\u3002", tags: ["Text-shadow", "Glow Animation", "Cyberpunk"], component: "NeonGlow" },
    { id: "fluid-gradient", index: "06", name: "\u6D41\u4F53\u6E10\u53D8", enName: "Fluid Gradient", category: "\u8272\u5F69 / Color", description: "\u591A\u56E2\u8272\u5757\u50CF\u6DB2\u4F53\u822C\u7F13\u6162\u5BF9\u6D41\u4E0E\u878D\u5408\uFF0C\u8FB9\u754C\u4E0D\u65AD\u91CD\u65B0\u5851\u5F62\uFF0C\u6C38\u4E0D\u91CD\u590D\u7684\u68A6\u5E7B\u8272\u5F69\u65CB\u6DA1\u3002", tags: ["CSS Animation", "Gradient", "Blob"], component: "FluidGradient", heavy: true },
    { id: "mouse-trail", index: "07", name: "\u9F20\u6807\u62D6\u5C3E", enName: "Mouse Trail", category: "\u4EA4\u4E92 / Interaction", description: "\u5149\u6807\u8F68\u8FF9\u4E0A\u7EFD\u653E\u7684\u5149\u7C92\u5B50\u62D6\u5C3E\uFF0C\u5982\u5F57\u661F\u5212\u8FC7\u591C\u7A7A\uFF0C\u5C3E\u8FF9\u5C42\u5C42\u53E0\u53E0\u3001\u8F6C\u77AC\u5373\u901D\u3002", tags: ["Cursor Tracking", "Particle Emitter", "Glow"], component: "MouseTrail" },
    { id: "particle-network", index: "08", name: "\u7C92\u5B50\u7F51\u7EDC", enName: "Particle Network", category: "\u7C92\u5B50 / Particle", description: "\u7C92\u5B50\u95F4\u81EA\u52A8\u8054\u7ED3\u6210\u7F51\u7EDC\uFF0C\u50CF\u795E\u7ECF\u5143\u822C\u5F7C\u6B64\u7275\u8FDE\uFF0C\u9F20\u6807\u9760\u8FD1\u65F6\u5F15\u529B\u62C9\u626F\u3001\u8FDE\u7EBF\u98A4\u52A8\u3002", tags: ["Network", "Connection Lines", "Repulsion"], component: "ParticleNetwork", heavy: true },
    { id: "typewriter", index: "09", name: "\u6253\u5B57\u673A", enName: "Typewriter", category: "\u6392\u7248 / Typography", description: "\u9010\u5B57\u6572\u51FB\u7684\u7EC8\u7AEF\u8D28\u611F\uFF0C\u914D\u5408\u5149\u6807\u95EA\u70C1\u4E0E\u968F\u673A\u505C\u987F\u8282\u594F\uFF0C\u50CF\u6709\u4EBA\u771F\u7684\u5728\u53E6\u4E00\u7AEF\u6253\u5B57\u3002", tags: ["Character-by-character", "Terminal", "Cursor Blink"], component: "Typewriter" },
    { id: "magnetic-button", index: "10", name: "\u78C1\u6027\u6309\u94AE", enName: "Magnetic Button", category: "\u4EA4\u4E92 / Interaction", description: "\u6309\u94AE\u5982\u5E26\u78C1\u529B\u822C\u5438\u9644\u5149\u6807\uFF0C\u8DDD\u79BB\u8D8A\u8FD1\u62C9\u529B\u8D8A\u5F3A\uFF0C\u5FAE\u5999\u7684\u89E6\u611F\u8BA9\u70B9\u51FB\u53D8\u5F97\u53EF\u611F\u77E5\u3002", tags: ["Magnetic Hover", "Button Micro-interaction"], component: "MagneticButton" },
    { id: "tilt-3d", index: "11", name: "3D \u503E\u659C", enName: "3D Tilt Card", category: "\u7A7A\u95F4 / 3D", description: "\u5361\u7247\u8DDF\u968F\u9F20\u6807\u5B9E\u65F6\u503E\u659C\uFF0C\u900F\u89C6\u611F\u4E0E\u8868\u9762\u9AD8\u5149\u968F\u89D2\u5EA6\u53D8\u5316\uFF0C\u8425\u9020\u89E6\u624B\u53EF\u53CA\u7684\u7ACB\u4F53\u611F\u3002", tags: ["Mouse Track", "Perspective Tilt", "Specular Glare"], component: "Tilt3DCard" },
    { id: "kaleidoscope", index: "12", name: "\u4E07\u82B1\u7B52", enName: "Kaleidoscope", category: "\u89C6\u89C9 / Visual", description: "\u5BF9\u79F0\u955C\u50CF\u5206\u5F62\u51FA\u4E07\u82B1\u7EFD\u653E\u7684\u56FE\u6848\uFF0C\u6BCF\u4E00\u6B21\u9F20\u6807\u79FB\u52A8\u90FD\u662F\u4E00\u6B21\u5168\u65B0\u7684\u7EB9\u6837\u91CD\u5851\u3002", tags: ["Fractal", "Symmetry", "Radial Mirror"], component: "Kaleidoscope", heavy: true },
    { id: "parallax-cards", index: "13", name: "\u53E0\u5C42\u89C6\u5DEE", enName: "Layer Parallax", category: "\u7A7A\u95F4 / 3D", description: "\u591A\u5C42\u5361\u7247\u9519\u843D\u53E0\u653E\uFF0C\u9F20\u6807\u79FB\u52A8\u65F6\u6BCF\u5C42\u4EE5\u4E0D\u540C\u901F\u5EA6\u4F4D\u79FB\uFF0C\u771F\u5B9E\u7684\u7EB5\u6DF1\u6251\u9762\u800C\u6765\u3002", tags: ["Stacked Cards", "Depth Layers", "3D Stack"], component: "ParallaxCards" },
    { id: "scroll-parallax", index: "14", name: "\u6EDA\u52A8\u89C6\u5DEE", enName: "Scroll Parallax", category: "\u6EDA\u52A8 / Scroll", description: "\u591A\u5C42\u80CC\u666F\u4EE5\u4E0D\u540C\u901F\u5EA6\u6EDA\u52A8\uFF0C\u7EB5\u6DF1\u611F\u968F\u6BCF\u4E00\u6B21\u6EDA\u52A8\u5C42\u5C42\u5C55\u5F00\uFF0C\u53D9\u4E8B\u8282\u594F\u7531\u6B64\u800C\u751F\u3002", tags: ["Parallax Scrolling", "Layered Background", "Depth"], component: "ScrollParallax" },
    { id: "panorama-3d", index: "15", name: "3D \u5168\u666F", enName: "3D Panorama", category: "\u7A7A\u95F4 / 3D", description: "\u62D6\u62FD\u5373\u53EF 360\xB0 \u73AF\u89C6\u7684\u5168\u666F\u7A7A\u95F4\uFF0C\u6F02\u6D6E\u7C92\u5B50\u4E0E\u7F51\u683C\u5730\u9762\u5EF6\u5C55\u81F3\u5730\u5E73\u7EBF\u5C3D\u5934\u7684\u8D5B\u535A\u7A7A\u95F4\u3002", tags: ["3D Rotation", "Panoramic View", "Drag to Rotate"], component: "Panorama3D", heavy: true },
    { id: "progress-counter", index: "16", name: "\u6EDA\u52A8\u6570\u636E", enName: "Scroll & Counter", category: "\u6EDA\u52A8 / Scroll", description: "\u6EDA\u52A8\u8FDB\u5EA6\u6761\u4E0E\u6570\u5B57\u8BA1\u6570\u52A8\u753B\u7EC4\u5408\uFF0C\u6570\u636E\u968F\u89C6\u53E3\u8FDB\u5165\u751F\u52A8\u6D6E\u73B0\uFF0C\u8BA9\u6570\u5B57\u81EA\u5DF1\u8BB2\u6545\u4E8B\u3002", tags: ["Scroll Progress", "Number Counting", "Data Viz"], component: "ProgressCounter" },
    { id: "light-sweep", index: "17", name: "\u5149\u5F71\u626B\u63CF", enName: "Light Sweep", category: "\u5149\u6548 / Lighting", description: "\u5149\u675F\u659C\u5411\u5212\u8FC7\u9ED1\u6697\u7A7A\u95F4\uFF0C\u7167\u4EAE\u60AC\u6D6E\u5FAE\u5C18\uFF0C\u9F20\u6807\u89E6\u53D1\u805A\u5149\u2014\u2014\u4E01\u8FBE\u5C14\u6548\u5E94\u5728\u6307\u5C16\u751F\u6210\u3002", tags: ["Light Ray", "Dust Particles", "Volumetric"], component: "LightSweep" },
    { id: "glitch-text", index: "18", name: "\u6545\u969C\u6587\u5B57", enName: "Glitch Text", category: "\u89C6\u89C9 / Visual", description: "\u8D5B\u535A\u670B\u514B\u6545\u969C\u7F8E\u5B66\u2014\u2014RGB \u8272\u5DEE\u5206\u5C42\u3001\u626B\u63CF\u7EBF\u6A2A\u5207\u3001\u566A\u70B9\u968F\u673A\u55B7\u53D1\uFF0C\u5468\u671F\u6027\u4FE1\u53F7\u5931\u771F\u3002", tags: ["RGB Split", "Scanlines", "Cyberpunk"], component: "GlitchText" },
    { id: "waveform", index: "19", name: "\u58F0\u6CE2\u53EF\u89C6\u5316", enName: "Audio Waveform", category: "\u6570\u636E / Data", description: "\u97F3\u9891\u6CE2\u5F62\u4E0E\u73AF\u5F62\u9891\u8C31\u53CC\u89C6\u56FE\uFF0C\u5E73\u6ED1\u6761\u5F62\u3001\u5CF0\u503C\u4FDD\u6301\u3001\u5706\u5F62\u9891\u8C31\u540C\u5C4F\u5448\u73B0\uFF0C\u9F20\u6807\u8C03\u8282\u589E\u76CA\u3002", tags: ["Audio Viz", "Spectrum", "Bar Graph"], component: "Waveform" },
    { id: "harmony-notification", index: "20", name: "\u9E3F\u8499\u7C92\u5B50\u901A\u77E5", enName: "Harmony Notification", category: "\u7C92\u5B50 / Particle", description: "\u7C92\u5B50\u4ECE\u5E95\u90E8\u805A\u96C6\u51DD\u5F62\u6210\u901A\u77E5\u5361\u7247\uFF0C\u70B9\u51FB\u540E\u6574\u4F53\u7C92\u5B50\u5316\u7206\u70B8\u6D88\u6563\uFF0C\u5FAA\u73AF\u5F80\u590D\u3001\u751F\u751F\u4E0D\u606F\u3002", tags: ["Particle Morphing", "Explosion Effect", "HarmonyOS Style"], component: "HarmonyNotification" },
    { id: "immersive-light", index: "21", name: "\u6C89\u6D78\u5149\u6548", enName: "Immersive Light", category: "\u5149\u6548 / Lighting", description: "\u591A\u5C42\u5F25\u6563\u5149\u6591\u3001\u4E01\u8FBE\u5C14\u5149\u67F1\u3001\u6F02\u6D6E\u5FAE\u5C18\u6784\u6210\u7684\u4F53\u79EF\u5149\u573A\uFF0C\u9F20\u6807\u79FB\u52A8\u9A71\u52A8\u5149\u7684\u6D41\u5411\u3002", tags: ["Volumetric Light", "Tyndall Effect", "Atmospheric"], component: "ImmersiveLight" },
    { id: "hologram", index: "22", name: "\u5168\u606F\u6D41\u4F53\u7F51\u683C", enName: "Hologram Fluid Grid", category: "\u89C6\u89C9 / Visual", description: "\u8D5B\u535A\u670B\u514B\u5168\u606F\u6D41\u4F53\u7F51\u683C\u2014\u2014\u626B\u63CF\u7EBF\u3001\u6570\u5B57\u96E8\u7C92\u5B50\u3001\u6D41\u4F53\u53D8\u5F62\u4E0E\u70B9\u9635\u7F51\u683C\u626D\u66F2\u4E09\u91CD\u6548\u679C\u878D\u5408\uFF0C\u9F20\u6807\u4EA4\u4E92\u89E6\u53D1\u5F62\u53D8\u3002", tags: ["Hologram", "Fluid Morph", "Grid Warp", "Cyberpunk"], component: "Hologram", heavy: true },
    { id: "flip-3d", index: "23", name: "3D \u7FFB\u8F6C\u5361", enName: "Flip 3D Card", category: "\u7A7A\u95F4 / 3D", description: "\u53CC\u9762 3D \u7FFB\u8F6C\u5361\u7247\uFF0Chover \u65F6\u6CBF Y \u8F74 180\xB0 \u7FFB\u6298\uFF0C\u80CC\u9762\u5C55\u793A\u955C\u50CF\u4FE1\u606F\uFF0C\u900F\u89C6\u4E0E\u9634\u5F71\u5168\u7A0B\u8DDF\u968F\u3002", tags: ["3D Flip", "Backface", "Perspective", "Card Transform"], component: "Flip3D" },
    { id: "liquid-ripple", index: "24", name: "\u6DB2\u6001\u6D9F\u6F2A", enName: "Liquid Ripple", category: "\u81EA\u7136 / Nature", description: "\u6C34\u9762\u6D9F\u6F2A\u5C42\u5C42\u6269\u6563\uFF0C\u81EA\u52A8\u751F\u6210\u7684\u968F\u673A\u6D9F\u6F2A\u4E0E\u9F20\u6807\u70B9\u51FB\u7684\u5927\u6CE2\u53E0\u52A0\uFF0CSVG \u6CE2\u6D6A\u5E95\u90E8\u6301\u7EED\u6D8C\u52A8\u3002", tags: ["Ripple Effect", "Water Surface", "SVG Wave", "Click Interaction"], component: "LiquidRipple" },
    { id: "diamond-3d", index: "25", name: "3D \u8D85\u900F\u5149\u94BB\u77F3", enName: "Brilliant Diamond", category: "\u7A7A\u95F4 / 3D", description: "\u6807\u51C6\u660E\u4EAE\u5F0F\u5207\u5272\u7684 3D \u94BB\u77F3\uFF0C\u591A\u5C42\u5207\u9762\u6298\u5C04\u51FA\u5F69\u8679\u8272\u6563\uFF0C\u5149\u8292\u968F\u89C6\u89D2\u6D41\u8F6C\uFF0C\u6676\u83B9\u5254\u900F\u3002", tags: ["Faceted Gem", "Dispersion", "Specular Sparkle", "Drag to Rotate"], component: "Diamond3D", heavy: true },
    { id: "energy-shield", index: "26", name: "\u80FD\u91CF\u8109\u51B2\u62A4\u76FE", enName: "Energy Shield", category: "\u5149\u6548 / Lighting", description: "\u516D\u8FB9\u5F62\u80FD\u91CF\u62A4\u76FE\uFF0C\u8109\u51B2\u5149\u6CE2\u6CBF\u8868\u9762\u6269\u6563\u3001\u7535\u6D41\u6E38\u8D70\uFF0C\u70B9\u51FB\u89E6\u53D1\u53D7\u51FB\u7535\u5F27\u4E0E\u51B2\u51FB\u6CE2\u3002", tags: ["Hex Shield", "Pulse Wave", "Lightning Arc", "Impact Effect"], component: "EnergyShield" },
    { id: "aurora-curtain", index: "27", name: "\u6781\u5149\u5E37\u5E55", enName: "Aurora Curtain", category: "\u89C6\u89C9 / Visual", description: "\u591A\u5C42\u6781\u5149\u98D8\u5E26\u5728\u591C\u7A7A\u4E2D\u7F13\u7F13\u6D41\u52A8\uFF0C\u8272\u5F69\u6E10\u53D8\u4EA4\u878D\uFF0C\u661F\u5C18\u7C92\u5B50\u8F7B\u76C8\u6F02\u6D6E\uFF0C\u9759\u8C27\u58EE\u9614\u3002", tags: ["Aurora Borealis", "Light Curtain", "Atmospheric", "Starry Night"], component: "AuroraCurtain" },
    { id: "text-ring-3d", index: "28", name: "3D \u73AF\u7ED5\u6587\u5B57\u73AF", enName: "3D Text Ring", category: "\u7A7A\u95F4 / 3D", description: "\u591A\u5708\u6587\u5B57\u6CBF 3D \u73AF\u5F62\u8F68\u9053\u73AF\u7ED5\u65CB\u8F6C\uFF0C\u8FD1\u5927\u8FDC\u5C0F\u900F\u89C6\u5206\u660E\uFF0C\u81EA\u5E26\u8F89\u5149\uFF0C\u62D6\u62FD\u6539\u53D8\u89C6\u89D2\u3002", tags: ["Orbital Text", "3D Typography", "Glow", "Drag to Rotate"], component: "TextRing3D" },
    { id: "black-hole", index: "29", name: "\u9ED1\u6D1E\u5438\u79EF\u76D8", enName: "Black Hole", category: "\u7C92\u5B50 / Particle", description: "\u4E2D\u5FC3\u9ED1\u6D1E\u541E\u566C\u4E00\u5207\uFF0C\u5438\u79EF\u76D8\u7C92\u5B50\u87BA\u65CB\u5760\u843D\uFF0C\u4E24\u6781\u55B7\u6D41\u6FC0\u5C04\uFF0C\u5F15\u529B\u7EA2\u79FB\u4E0E\u5149\u7578\u53D8\u547C\u4E4B\u6B32\u51FA\u3002", tags: ["Accretion Disk", "Gravitational Lens", "Relativistic Jet", "Event Horizon"], component: "BlackHole", heavy: true },
    { id: "nebula-stardust", index: "30", name: "\u661F\u4E91\u661F\u5C18", enName: "Nebula Stardust", category: "\u89C6\u89C9 / Visual", description: "\u5F69\u8272\u661F\u4E91\u6C14\u4F53\u7F13\u7F13\u7FFB\u6D8C\uFF0C\u661F\u5C18\u7C92\u5B50\u8F7B\u821E\u6F02\u79FB\uFF0C\u660E\u4EAE\u6052\u661F\u7EFD\u653E\u5341\u5B57\u661F\u8292\uFF0C\u6D69\u701A\u6D6A\u6F2B\u3002", tags: ["Cosmic Nebula", "Stardust", "Diffraction Spikes", "Starfield"], component: "NebulaStardust" },
    { id: "ferrofluid", index: "31", name: "\u78C1\u6D41\u4F53", enName: "Ferrofluid", category: "\u7269\u7406 / Physics", description: "\u94C1\u78C1\u6D41\u4F53\u8868\u9762\u968F\u78C1\u529B\u6E90\u8D77\u4F0F\u51FA\u91D1\u5C5E\u5C16\u523A\uFF0C\u5FEB\u901F\u5212\u8FC7\u6495\u88C2\u98DE\u6E85\uFF0C\u79BB\u5F00\u540E\u7F13\u6162\u5E73\u590D\u3002", tags: ["Magnetic Fluid", "Spike Surface", "Metaball", "Fluid Dynamics"], component: "Ferrofluid" },
    { id: "fire-flame", index: "32", name: "\u706B\u7130\u7C92\u5B50", enName: "Fire Flame", category: "\u7C92\u5B50 / Particle", description: "\u5347\u817E\u7684\u706B\u7130\u7C92\u5B50\u7CFB\u7EDF\uFF0C\u5185\u5C42\u91D1\u9EC4\u5916\u5C42\u8D64\u7EA2\uFF0C\u5E95\u90E8\u6838\u5FC3\u660E\u4EAE\uFF0C\u70B9\u51FB\u50AC\u751F\u66F4\u591A\u7130\u82D7\u3002", tags: ["Combustion", "Particle Emitter", "Fire", "Glow"], component: "FireFlame" },
    { id: "rain-ripple", index: "33", name: "\u96E8\u6EF4\u6D9F\u6F2A", enName: "Rain & Ripple", category: "\u81EA\u7136 / Nature", description: "\u7EC6\u5BC6\u96E8\u4E1D\u4ECE\u5929\u7A7A\u5760\u843D\uFF0C\u5728\u6C34\u9762\u6FC0\u8D77\u5C42\u5C42\u692D\u5706\u6D9F\u6F2A\uFF0C\u9F20\u6807\u70B9\u51FB\u6E85\u8D77\u5927\u6C34\u82B1\u3002", tags: ["Rain", "Ripple", "Water Surface", "Atmospheric"], component: "RainRipple" },
    { id: "fireworks", index: "34", name: "\u70DF\u82B1\u7EFD\u653E", enName: "Fireworks", category: "\u7C92\u5B50 / Particle", description: "\u591C\u7A7A\u70DF\u82B1\u81EA\u52A8\u7EFD\u653E\uFF0C\u70B9\u51FB\u4EFB\u610F\u4F4D\u7F6E\u624B\u52A8\u53D1\u5C04\uFF0C\u591A\u5F69\u7C92\u5B50\u7403\u5F62\u7206\u5F00\uFF0C\u62D6\u5C3E\u4F59\u6656\u7F13\u7F13\u6D88\u6563\u3002", tags: ["Fireworks", "Explosion", "Burst", "Celebration"], component: "Fireworks" },
    { id: "star-trails", index: "35", name: "\u661F\u8F68\u957F\u66DD\u5149", enName: "Star Trails", category: "\u89C6\u89C9 / Visual", description: "\u7ED5\u6781\u65CB\u8F6C\u7684\u661F\u8F68\u957F\u66DD\u5149\u6548\u679C\uFF0C\u661F\u8FB0\u5212\u51FA\u4F18\u96C5\u5F27\u7EBF\uFF0C\u5317\u6781\u661F\u5728\u4E2D\u5FC3\u6C38\u6052\u95EA\u8000\u3002", tags: ["Astrophotography", "Star Trail", "Long Exposure", "Celestial"], component: "StarTrails" },
    { id: "moire-pattern", index: "36", name: "\u83AB\u5C14\u6761\u7EB9", enName: "Moir\xE9 Pattern", category: "\u89C6\u89C9 / Visual", description: "\u4E24\u7EC4\u7EBF\u6761\u53E0\u52A0\u4EA7\u751F\u5E72\u6D89\u6761\u7EB9\uFF0C\u9F20\u6807\u6539\u53D8\u504F\u79FB\u4E0E\u89D2\u5EA6\uFF0C\u5236\u9020\u8FF7\u5E7B\u7684\u6CE2\u7EB9\u5171\u632F\u3002", tags: ["Interference", "Optical Illusion", "Line Pattern", "Moire"], component: "MoirePattern" },
    { id: "snowfall", index: "37", name: "\u96EA\u82B1\u98D8\u843D", enName: "Snowfall", category: "\u81EA\u7136 / Nature", description: "\u4E09\u5C42\u6DF1\u5EA6\u7684\u96EA\u82B1\u7F13\u7F13\u98D8\u843D\uFF0C\u8FD1\u5927\u8FDC\u5C0F\u3001\u968F\u98CE\u98D8\u9038\uFF0C\u9759\u8C27\u7684\u51AC\u65E5\u6C1B\u56F4\u3002", tags: ["Snow", "Parallax Depth", "Atmospheric", "Winter"], component: "Snowfall" },
    { id: "ecg-pulse", index: "38", name: "\u5FC3\u7535\u56FE\u8109\u51B2", enName: "ECG Pulse", category: "\u6570\u636E / Data", description: "\u533B\u7597\u98CE\u683C\u5FC3\u7535\u56FE\u6CE2\u5F62\uFF0CPQRST \u590D\u5408\u6CE2\u7CBE\u51C6\u8FD8\u539F\uFF0C\u5B9E\u65F6\u5FC3\u7387\u4E0E\u7F51\u683C\u80CC\u666F\u540C\u5C4F\u5448\u73B0\u3002", tags: ["ECG", "Heartbeat", "Medical", "Waveform"], component: "ECGPulse" },
    { id: "lava-lamp", index: "39", name: "\u7194\u5CA9\u706F", enName: "Lava Lamp", category: "\u6750\u8D28 / Material", description: "\u73BB\u7483\u74F6\u8EAB + \u91D1\u5C5E\u5E95\u5EA7\u7684\u5199\u5B9E\u7194\u5CA9\u706F\uFF0C\u7194\u5CA9\u5BF9\u6D41\u4E0A\u5347\u51B7\u5374\u4E0B\u6C89\uFF0C\u53EF\u70B9\u51FB\u5207\u6362\u4E94\u8272\u4E3B\u9898\u3002", tags: ["Lava Lamp", "Metaball", "Convection", "Glass Material"], component: "LavaLamp" },
    { id: "wormhole", index: "40", name: "\u4F20\u9001\u866B\u6D1E", enName: "Wormhole", category: "\u89C6\u89C9 / Visual", description: "\u65CB\u8F6C\u7684\u866B\u6D1E\u5438\u79EF\u76D8\uFF0C\u7C92\u5B50\u87BA\u65CB\u5760\u5165\u4E8B\u4EF6\u89C6\u754C\uFF0C\u62D6\u62FD\u503E\u659C\u89C6\u89D2\uFF0C\u9760\u8FD1\u5219\u5438\u5165\u52A0\u901F\u3002", tags: ["Wormhole", "Event Horizon", "Accretion Disk", "Sci-fi"], component: "Wormhole", heavy: true },
    { id: "fractal-growth", index: "41", name: "\u51E0\u4F55\u5206\u5F62\u751F\u957F", enName: "Fractal Growth", category: "\u89C6\u89C9 / Visual", description: "\u9012\u5F52\u5206\u5F62\u6811\u4ECE\u96F6\u751F\u957F\u5EF6\u4F38\uFF0C\u679D\u6860\u9010\u7EA7\u5206\u53C9\uFF0C\u5468\u671F\u6027\u5FAA\u73AF\u751F\u957F\u4E0E\u51CB\u96F6\u3002", tags: ["Fractal", "Recursion", "L-System", "Growth"], component: "FractalGrowth" },
    { id: "warp-speed", index: "42", name: "\u661F\u9645\u7A7F\u8D8A", enName: "Warp Speed", category: "\u7A7A\u95F4 / 3D", description: "\u7B2C\u4E00\u4EBA\u79F0\u5149\u901F\u98DE\u884C\u7A7F\u8D8A\u661F\u91CE\uFF0C\u661F\u7EBF\u62C9\u957F\u62D6\u5C3E\u5E26\u901F\u5EA6\u611F\u8272\u504F\uFF0C\u9F20\u6807\u63A7\u5236\u98DE\u884C\u65B9\u5411\u3002", tags: ["Hyperspace", "Starfield", "First Person", "Warp Drive"], component: "WarpSpeed" },
    { id: "spectrum-3d", index: "43", name: "3D \u9891\u8C31\u67F1", enName: "3D Spectrum", category: "\u6570\u636E / Data", description: "\u7ACB\u4F53\u9891\u8C31\u67F1\u7FA4\u968F\u8282\u594F\u5F8B\u52A8\u8D77\u4F0F\uFF0C\u6444\u50CF\u673A\u73AF\u7ED5\u7A7F\u884C\uFF0C\u67F1\u4F53\u53D1\u5149\u6295\u5C04\u5012\u5F71\u3002", tags: ["3D Bar Chart", "Audio Viz", "Data Sculpture", "Orbit Camera"], component: "Spectrum3D" },
    { id: "bubbles", index: "44", name: "\u6C14\u6CE1\u4E0A\u5347", enName: "Bubbles", category: "\u81EA\u7136 / Nature", description: "\u6C34\u5E95\u6C14\u6CE1\u7F13\u7F13\u4E0A\u6D6E\uFF0C\u6298\u5C04\u9AD8\u5149\u4E0E\u8868\u9762\u5F20\u529B\u5149\u6CFD\u6E05\u6670\u53EF\u89C1\uFF0C\u70B9\u51FB\u53EF\u6233\u7834\u98DE\u6E85\u3002", tags: ["Underwater", "Bubble Pop", "Refraction", "Buoyancy"], component: "Bubbles" },
    { id: "silk-flow", index: "45", name: "\u4E1D\u7EF8\u6D41\u7EBF", enName: "Silk Flow", category: "\u89C6\u89C9 / Visual", description: "\u591A\u6761\u4E1D\u7EF8\u822C\u7684\u6D41\u7EBF\u7C92\u5B50\u62D6\u5C3E\u7F13\u7F13\u6D41\u52A8\uFF0C\u9F20\u6807\u5212\u8FC7\u5E26\u52A8\u4E1D\u5E26\u6CE2\u52A8\u4E0E\u6D9F\u6F2A\u3002", tags: ["Ribbon Trail", "Flowing Particle", "Smooth Curve", "Organic"], component: "SilkFlow" },
    { id: "ink-spread", index: "46", name: "\u58A8\u8FF9\u6269\u6563", enName: "Ink Spread", category: "\u6750\u8D28 / Material", description: "\u6C34\u58A8\u58A8\u6EF4\u5165\u6C34\u822C\u7F13\u7F13\u6269\u6563\uFF0C\u5206\u5F62\u7EB9\u7406\u6CBF\u8FB9\u7F18\u8513\u5EF6\uFF0C\u70B9\u51FB\u53EF\u6EF4\u843D\u65B0\u58A8\u3002", tags: ["Ink Wash", "Diffusion", "Fractal Texture", "Sumie"], component: "InkSpread" },
    { id: "pixel-morph", index: "47", name: "\u50CF\u7D20\u53D8\u5F62", enName: "Pixel Morph", category: "\u89C6\u89C9 / Visual", description: "\u50CF\u7D20\u5757\u77E9\u9635\u5728\u591A\u79CD\u51E0\u4F55\u56FE\u6848\u95F4\u53D8\u5F62\u8FC7\u6E21\uFF0C\u9F20\u6807\u626B\u8FC7\u50CF\u7D20\u70B9\u4EAE\u5E76\u4EA7\u751F\u6392\u65A5\u3002", tags: ["Morphing", "Pixel Grid", "Shape Transition", "Glow"], component: "PixelMorph" },
    { id: "matrix-rain", index: "48", name: "\u6570\u636E\u77E9\u9635\u96E8", enName: "Matrix Rain", category: "\u89C6\u89C9 / Visual", description: "\u7ECF\u5178\u6570\u5B57\u96E8\u5B57\u7B26\u5760\u843D\uFF0C\u7EFF\u8272\u8F89\u5149 + \u62D6\u5C3E\u6E10\u9690\uFF0C\u9F20\u6807\u9760\u8FD1\u52A0\u901F\u6D41\u52A8\u5E76\u70B9\u4EAE\u3002", tags: ["Digital Rain", "Code Rain", "Cyberpunk", "Glow"], component: "MatrixRain" },
    { id: "paper-fold", index: "49", name: "\u7EB8\u7247 3D \u6298\u53E0", enName: "Paper Fold", category: "\u7A7A\u95F4 / 3D", description: "3D \u7EB8\u7247\u591A\u6BB5\u7FFB\u6298\u5C55\u5F00\uFF0C\u9F20\u6807\u62D6\u62FD\u53EF\u81EA\u7531\u65CB\u8F6C\u89C6\u89D2\uFF0C\u9634\u5F71\u4E0E\u7EB8\u5F20\u7EB9\u7406\u7EC6\u817B\u3002", tags: ["Origami", "3D Transform", "Drag Rotate", "Paper Texture"], component: "PaperFold" },
    { id: "depth-parallax", index: "50", name: "3D \u89C6\u5DEE\u666F\u6DF1", enName: "Depth Parallax", category: "\u7A7A\u95F4 / 3D", description: "\u591A\u5C42\u666F\u89C2\u5143\u7D20\u968F\u9F20\u6807 3D \u89C6\u5DEE\u4F4D\u79FB\uFF0C\u8FDC\u8FD1\u666F\u5C42\u6B21\u5206\u660E\uFF0C\u5E26\u666F\u6DF1\u6A21\u7CCA\u4E0E\u6697\u89D2\u3002", tags: ["Parallax", "Depth of Field", "Multi-layer", "Diorama"], component: "DepthParallax" },
    { id: "aurora-curtain-particles", index: "51", name: "\u6781\u5149\u7C92\u5B50\u5149\u5E55", enName: "Aurora Curtain Particles", category: "\u7C92\u5B50 / Particle", description: "\u7C92\u5B50\u5E37\u5E55\u4ECE\u5929\u7A7A\u5782\u843D\uFF0C\u8272\u5F69\u6E10\u53D8\u6D41\u52A8\u5982\u6781\u5149\u7FFB\u6D8C\uFF0C\u9F20\u6807\u5212\u52A8\u6380\u8D77\u5149\u5E55\u6CE2\u52A8\u3002", tags: ["Particle Curtain", "Aurora Flow", "Mouse Ripple", "Gravity"], component: "AuroraCurtainParticles" },
    { id: "cube-field-3d", index: "52", name: "3D \u7ACB\u65B9\u4F53\u7FA4", enName: "3D Cube Field", category: "\u7A7A\u95F4 / 3D", description: "\u6570\u767E\u5C0F\u7ACB\u65B9\u4F53\u6784\u6210 3D \u65B9\u9635\u65CB\u8F6C\u6F02\u79FB\uFF0C\u9F20\u6807\u62D6\u62FD\u65CB\u8F6C\u89C6\u89D2\uFF0C\u78B0\u649E\u5F39\u8DF3\u3002", tags: ["3D Cubes", "Isometric Field", "Drag Rotate", "Floating"], component: "CubeField3D", heavy: true },
    { id: "candle-flame", index: "53", name: "\u70DB\u5149\u706B\u7130", enName: "Candle Flame", category: "\u81EA\u7136 / Nature", description: "\u8721\u70DB\u70DB\u706B\u6447\u66F3\uFF0C\u706B\u7130\u4E09\u5C42\u8272\u9636 + \u5149\u6655 + \u8721\u6CEA\uFF0C\u9F20\u6807\u9760\u8FD1\u706B\u82D7\u6446\u52A8\u3002", tags: ["Candle", "Flame Particle", "Fire Glow", "Wax Drip"], component: "CandleFlame" },
    { id: "sand-fall", index: "54", name: "\u6D41\u6C99\u7011\u5E03", enName: "Sand Fall", category: "\u81EA\u7136 / Nature", description: "\u6C99\u7C92\u4ECE\u9876\u90E8\u503E\u6CFB\u6210\u7011\u5E03\uFF0C\u5806\u79EF\u6210\u6C99\u4E18\uFF0C\u9F20\u6807\u53EF\u6316\u6C99/\u6270\u52A8\u6C99\u6D41\u3002", tags: ["Sand Grains", "Heap Accumulation", "Physics", "Dig Interaction"], component: "SandFall" },
    { id: "liquid-lens", index: "55", name: "\u6DB2\u4F53\u900F\u955C", enName: "Liquid Lens", category: "\u4EA4\u4E92 / Interaction", description: "\u9F20\u6807\u79FB\u52A8\u5F62\u6210\u6DB2\u4F53\u900F\u955C\u6548\u679C\uFF0C\u80CC\u666F\u900F\u8FC7\u900F\u955C\u6298\u5C04\u626D\u66F2\u653E\u5927\uFF0C\u8272\u6563\u8FB9\u7F18\u3002", tags: ["Refraction", "Magnifier", "Distortion", "Dispersion"], component: "LiquidLens" },
    { id: "gear-train-3d", index: "56", name: "3D \u9F7F\u8F6E\u4F20\u52A8", enName: "3D Gear Train", category: "\u7A7A\u95F4 / 3D", description: "\u591A\u9F7F\u8F6E\u54AC\u5408\u8F6C\u52A8\uFF0C\u8F6C\u901F\u8054\u52A8\u4F20\u9012\uFF0C\u9F20\u6807\u60AC\u505C\u52A0\u901F\u65CB\u8F6C\u3002", tags: ["Gear Mechanism", "Rotating Gears", "Speed Linkage", "Mechanical"], component: "GearTrain3D" },
    { id: "text-particle-explosion", index: "57", name: "\u6587\u5B57\u7C92\u5B50\u7206\u70B8", enName: "Text Particle Explosion", category: "\u6392\u7248 / Typography", description: "\u6587\u5B57\u7531\u7C92\u5B50\u6784\u6210\uFF0C\u9F20\u6807\u5212\u8FC7\u6587\u5B57\u7C92\u5B50\u70B8\u5F00\u56DB\u6563\u540E\u91CD\u65B0\u805A\u5408\u3002", tags: ["Text Particles", "Explosion", "Reassembly", "Typography"], component: "TextParticleExplosion" },
    { id: "quantum-entanglement", index: "58", name: "\u91CF\u5B50\u7EA0\u7F20\u7C92\u5B50", enName: "Quantum Entanglement", category: "\u7C92\u5B50 / Particle", description: "\u6210\u5BF9\u7C92\u5B50\u7EA0\u7F20\u8FD0\u52A8\uFF0C\u4E00\u8005\u53D7\u9F20\u6807\u6270\u52A8\u53E6\u8005\u540C\u6B65\u53CD\u5E94\uFF0C\u95EA\u70C1\u8FDE\u7EBF\u3002", tags: ["Entangled Pairs", "Quantum Effect", "Synced Motion", "Glowing Lines"], component: "QuantumEntanglement" },
    { id: "planet-orbits", index: "59", name: "\u884C\u661F\u8F68\u9053", enName: "Planet Orbits", category: "\u7A7A\u95F4 / 3D", description: "\u592A\u9633 + \u591A\u884C\u661F\u516C\u8F6C\u8F68\u9053\uFF0C\u884C\u661F\u81EA\u8F6C\u4E0E\u536B\u661F\uFF0C\u9F20\u6807\u9760\u8FD1\u5F15\u529B\u6270\u52A8\u3002", tags: ["Solar System", "Orbit Simulation", "Gravity", "Planets"], component: "PlanetOrbits" },
    { id: "jelly-pudding", index: "60", name: "\u5E03\u4E01\u6643\u52A8", enName: "Jelly Pudding", category: "\u4EA4\u4E92 / Interaction", description: "\u679C\u51BB\u5E03\u4E01\u5F39\u6027\u6643\u52A8\uFF0C\u70B9\u51FB\u6233\u4E00\u4E0B\u6643\u52A8\u56DE\u5F39\uFF0C\u9AD8\u5149\u8D28\u611F\u3002", tags: ["Jelly Physics", "Wobble", "Squish", "Click Interaction"], component: "JellyPudding" },
    { id: "maze-generator", index: "61", name: "\u8FF7\u5BAB\u751F\u6210", enName: "Maze Generator", category: "\u4EA4\u4E92 / Interaction", description: "\u5B9E\u65F6\u751F\u6210\u8FF7\u5BAB\u5E76\u5BFB\u8DEF\u6F14\u793A\uFF0C\u9F20\u6807\u7ED8\u5236\u969C\u788D\u3002", tags: ["Maze Generation", "Pathfinding", "DFS Algorithm", "Draw Walls"], component: "MazeGenerator" },
    { id: "laser-engraving", index: "62", name: "\u6FC0\u5149\u96D5\u523B", enName: "Laser Engraving", category: "\u5149\u6548 / Lighting", description: "\u6FC0\u5149\u675F\u5728\u5E73\u9762\u4E0A\u96D5\u523B\u56FE\u6848\u7EBF\u6761\uFF0C\u706B\u82B1\u98DE\u6E85\uFF0C\u9F20\u6807\u64CD\u63A7\u81EA\u7531\u96D5\u523B\u3002", tags: ["Laser Beam", "Engraving", "Sparks", "Path Tracing"], component: "LaserEngraving" },
    { id: "bubble-pop", index: "63", name: "\u6CE1\u6CE1\u7CD6\u7206\u88C2", enName: "Bubble Pop", category: "\u4EA4\u4E92 / Interaction", description: "\u5F69\u8272\u6CE1\u6CE1\u81A8\u80C0-\u7834\u88C2-\u98DE\u6E85\uFF0C\u70B9\u51FB\u751F\u6210\u6CE1\u6CE1\uFF0C\u9F20\u6807\u60AC\u505C\u6233\u7834\u3002", tags: ["Soap Bubbles", "Burst Effect", "Pop Particles", "Click to Spawn"], component: "BubblePop" },
    { id: "city-silhouette-3d", index: "64", name: "3D \u57CE\u5E02\u526A\u5F71", enName: "3D City Silhouette", category: "\u7A7A\u95F4 / 3D", description: "3D \u697C\u5B87\u7FA4\u526A\u5F71\uFF0C\u706F\u5149\u7A97\u6237\u660E\u706D\uFF0C\u9F20\u6807\u65CB\u8F6C\u89C6\u89D2\u3002", tags: ["Skyline", "Building Lights", "Night City", "Parallax Rotate"], component: "CitySilhouette3D" },
    { id: "pendulum-physics", index: "65", name: "\u7269\u7406\u949F\u6446", enName: "Pendulum Physics", category: "\u7269\u7406 / Physics", description: "\u591A\u6446\u9524\u7269\u7406\u6446\u52A8\uFF0C\u80FD\u91CF\u4F20\u9012\u8026\u5408\uFF0C\u70B9\u51FB\u63A8\u52A8\u6446\u9524\u3002", tags: ["Pendulum", "Physics Simulation", "Energy Transfer", "Coupled Oscillation"], component: "PendulumPhysics" },
    { id: "stardust-vortex", index: "66", name: "\u661F\u5C18\u65CB\u6DA1", enName: "Stardust Vortex", category: "\u7C92\u5B50 / Particle", description: "\u661F\u5C18\u7C92\u5B50\u87BA\u65CB\u65CB\u6DA1\u5438\u5165\u4E2D\u5FC3\uFF0C\u9F20\u6807\u6270\u52A8\u8F68\u8FF9\uFF0C\u4E2D\u5FC3\u53D1\u5149\u3002", tags: ["Spiral Vortex", "Stardust", "Black Hole", "Swirl"], component: "StardustVortex", heavy: true },
    { id: "weather-switch", index: "67", name: "\u5929\u6C14\u5207\u6362", enName: "Weather Switch", category: "\u81EA\u7136 / Nature", description: "\u6674/\u96E8/\u96EA/\u96F7\u56DB\u79CD\u5929\u6C14\u7C92\u5B50\u573A\u666F\u5207\u6362\uFF0C\u4E00\u952E\u611F\u53D7\u56DB\u5B63\u53D8\u5316\u3002", tags: ["Weather Simulation", "Rain", "Snow", "Sunlight", "Lightning"], component: "WeatherSwitch" },
    { id: "sound-ribbons", index: "68", name: "\u97F3\u5F8B\u5F69\u5E26", enName: "Sound Ribbons", category: "\u89C6\u89C9 / Visual", description: "\u968F\u8282\u62CD\u5F8B\u52A8\u7684\u5F69\u8272\u4E1D\u5E26\u6CE2\u5F62\uFF0C\u9F20\u6807\u63A7\u5236\u632F\u5E45\u4E0E\u901F\u5EA6\u3002", tags: ["Audio Visualization", "Ribbon Wave", "Beat Rhythm", "Colorful"], component: "SoundRibbons" },
    { id: "pixel-heart", index: "69", name: "\u50CF\u7D20\u5FC3\u5F62", enName: "Pixel Heart", category: "\u4EA4\u4E92 / Interaction", description: "\u50CF\u7D20\u5757\u62FC\u6210\u5FC3\u5F62\u8DF3\u52A8\uFF0C\u9F20\u6807\u626B\u8FC7\u70B9\u4EAE\uFF0C\u5C0F\u5FC3\u5F62\u6F02\u6D6E\u4E0A\u5347\u3002", tags: ["Pixel Art", "Heart Beat", "Glow On Hover", "Floating Hearts"], component: "PixelHeart" },
    { id: "waterfall-3d", index: "70", name: "\u7011\u5E03\u6D41\u6C34", enName: "Waterfall 3D", category: "\u81EA\u7136 / Nature", description: "3D \u7011\u5E03\u6C34\u6D41\u7C92\u5B50\u503E\u6CFB\uFF0C\u6C34\u82B1\u98DE\u6E85\uFF0C\u96FE\u5316\u6548\u679C\u4E0E\u6C34\u6F6D\u6CE2\u7EB9\u3002", tags: ["Waterfall", "Splash Particles", "Water Mist", "Ripple"], component: "Waterfall3D" },
    { id: "hologram-earth", index: "71", name: "\u5168\u606F\u5730\u7403", enName: "Hologram Earth", category: "\u7A7A\u95F4 / 3D", description: "\u65CB\u8F6C\u5168\u606F\u5730\u7403\u2014\u2014\u7ECF\u7EAC\u7EBF\u7F51\u683C\u3001\u5927\u6C14\u5C42\u8F89\u5149\u3001\u57CE\u5E02\u706F\u5149\u70B9\uFF0C\u62D6\u62FD\u65CB\u8F6C\u89C6\u89D2\uFF0CWebGL \u52A0\u901F\u3002", tags: ["Hologram", "Globe", "Atmosphere Glow", "WebGL", "Drag to Rotate"], component: "HologramEarth", heavy: true },
    { id: "tunnel-3d", index: "72", name: "3D \u65E0\u9650\u96A7\u9053", enName: "Infinite Tunnel", category: "\u7A7A\u95F4 / 3D", description: "\u7B2C\u4E00\u4EBA\u79F0\u7A7F\u8D8A\u65E0\u9650\u5149\u96A7\u9053\uFF0C\u73AF\u72B6\u5149\u5E26\u4E0D\u65AD\u5411\u524D\u6D41\u52A8\uFF0C\u9F20\u6807\u63A7\u5236\u901F\u5EA6\u4E0E\u89C6\u89D2\u504F\u79FB\u3002", tags: ["Tunnel", "Light Beams", "First Person", "WebGL", "Mouse Control"], component: "Tunnel3D", heavy: true },
    { id: "spiral-galaxy", index: "73", name: "\u87BA\u65CB\u661F\u7CFB", enName: "Spiral Galaxy", category: "\u7C92\u5B50 / Particle", description: "\u65CB\u81C2\u661F\u7CFB\u7C92\u5B50\u65CB\u8F6C\uFF0C\u4E2D\u5FC3\u6838\u7403\u660E\u4EAE\uFF0C\u65CB\u81C2\u7F20\u7ED5\u6F14\u5316\uFF0C\u70B9\u51FB\u6270\u52A8\u65CB\u81C2\u5F62\u6001\u3002", tags: ["Galaxy", "Spiral Arms", "Nucleus Bulge", "WebGL", "Star Particles"], component: "SpiralGalaxy", heavy: true },
    { id: "sakura-petals", index: "74", name: "\u6A31\u82B1\u98D8\u843D", enName: "Sakura Petals", category: "\u81EA\u7136 / Nature", description: "\u6A31\u82B1\u82B1\u74E3\u968F\u98CE\u98D8\u843D\u65CB\u8F6C\uFF0C\u98CE\u573A\u6270\u52A8\u8F7B\u76C8\u6447\u66F3\uFF0C\u70B9\u51FB\u626C\u8D77\u6F2B\u5929\u82B1\u74E3\u3002", tags: ["Cherry Blossom", "Wind Field", "Petal Physics", "Click Interaction"], component: "SakuraPetals" },
    { id: "particle-tornado", index: "75", name: "\u7C92\u5B50\u9F99\u5377\u98CE", enName: "Particle Tornado", category: "\u7C92\u5B50 / Particle", description: "\u7C92\u5B50\u7ED5\u8F74\u87BA\u65CB\u4E0A\u5347\u6210\u9F99\u5377\u98CE\uFF0C\u5E95\u90E8\u65CB\u6DA1\u660E\u4EAE\uFF0C\u9F20\u6807\u79FB\u52A8\u63A7\u5236\u98CE\u773C\u4F4D\u7F6E\u3002", tags: ["Tornado", "Spiral Particles", "Vortex", "Mouse Control"], component: "ParticleTornado" },
    { id: "bouncing-balls", index: "76", name: "\u5F39\u8DF3\u7403\u7269\u7406\u7FA4", enName: "Bouncing Balls", category: "\u7269\u7406 / Physics", description: "\u5927\u91CF\u5F39\u6027\u5C0F\u7403\u7269\u7406\u78B0\u649E\u5F39\u8DF3\uFF0C\u91CD\u529B\u4E0E\u6469\u64E6\u529B\u6A21\u62DF\uFF0C\u70B9\u51FB\u6CE8\u5165\u65B0\u7403\u3002", tags: ["Elastic Collision", "Gravity", "Friction", "Ball Physics"], component: "BouncingBalls" },
    { id: "light-church", index: "77", name: "\u5149\u4E4B\u6559\u5802", enName: "Light Church", category: "\u5149\u6548 / Lighting", description: "\u591A\u9053\u4F53\u79EF\u5149\u67F1\u9635\u5217\u7A7F\u8FC7\u7A7A\u95F4\uFF0C\u5C18\u57C3\u7C92\u5B50\u5728\u5149\u67F1\u4E2D\u6F02\u6D6E\uFF0C\u9F20\u6807\u79FB\u52A8\u5149\u67F1\u504F\u79FB\u3002", tags: ["Volumetric Light", "Dust Particles", "Light Rays", "Atmospheric"], component: "LightChurch" },
    { id: "ring-flight", index: "78", name: "\u661F\u73AF\u98DE\u884C", enName: "Ring Flight", category: "\u7A7A\u95F4 / 3D", description: "\u7A7F\u8D8A\u884C\u661F\u661F\u73AF\u98DE\u884C\uFF0C\u73AF\u5E26\u7C92\u5B50\u73AF\u7ED5\u6D41\u52A8\uFF0C\u8272\u6563\u6E10\u53D8\u8F89\u5149\uFF0C\u9F20\u6807\u63A7\u5236\u89C6\u89D2\u3002", tags: ["Planetary Ring", "Flight View", "Chromatic Dispersion", "WebGL"], component: "RingFlight", heavy: true },
    { id: "wave-text-3d", index: "79", name: "\u6CE2\u6D6A\u6587\u5B57 3D", enName: "Wave Text 3D", category: "\u6392\u7248 / Typography", description: "\u6587\u5B57\u5728 3D \u6CE2\u6D6A\u66F2\u9762\u4E0A\u8D77\u4F0F\uFF0CRGB \u901A\u9053\u8272\u6563\u5206\u79BB\u8F89\u5149\uFF0C\u9F20\u6807\u6539\u53D8\u6CE2\u9891\u3002", tags: ["Text Wave", "Chromatic Aberration", "3D Typography", "Glow"], component: "WaveText3D" },
    { id: "spider-web", index: "80", name: "\u7EC7\u7F51\u86DB\u4E1D", enName: "Spider Web", category: "\u89C6\u89C9 / Visual", description: "\u86DB\u7F51\u4ECE\u4E2D\u5FC3\u5411\u5916\u87BA\u65CB\u751F\u957F\uFF0C\u8282\u70B9\u8FDE\u63A5\u6210\u7F51\uFF0C\u9F20\u6807\u70B9\u51FB\u5904\u751F\u957F\u65B0\u7F51\u3002", tags: ["Spider Web", "Radial Growth", "Spiral Pattern", "Click to Grow"], component: "SpiderWeb" },
    { id: "dna-helix", index: "81", name: "DNA \u53CC\u87BA\u65CB", enName: "DNA Helix", category: "\u7A7A\u95F4 / 3D", description: "3D \u53CC\u87BA\u65CB\u7ED3\u6784\u2014\u2014\u4E3B\u94FE\u7C92\u5B50 + \u78B1\u57FA\u5BF9\u6A2A\u6863\uFF0CA-T/G-C \u56DB\u8272\u914D\u5BF9\uFF0C\u9F20\u6807\u62D6\u62FD\u65CB\u8F6C\u89C6\u89D2\u3002", tags: ["DNA", "Double Helix", "Base Pairs", "WebGL", "Drag to Rotate"], component: "DNAHelix", heavy: true },
    { id: "cloth-physics", index: "82", name: "\u5E03\u6599\u7269\u7406", enName: "Cloth Physics", category: "\u7269\u7406 / Physics", description: "Verlet \u79EF\u5206\u5E03\u6599\u6A21\u62DF\u2014\u2014\u5F39\u7C27\u7EA6\u675F + \u98CE\u529B + \u91CD\u529B\uFF0C\u9F20\u6807\u63A8\u5F00\u5E03\u6599\u3001\u70B9\u51FB\u91CA\u653E\u51B2\u51FB\u6CE2\u3002", tags: ["Verlet Integration", "Cloth Simulation", "Spring Constraints", "Wind Physics"], component: "ClothPhysics", heavy: true },
    { id: "particle-text-morph", index: "83", name: "\u7C92\u5B50\u5F62\u6001\u6587\u5B57", enName: "Particle Text Morph", category: "\u6392\u7248 / Typography", description: "\u4E07\u5343\u7C92\u5B50\u805A\u5408\u6210\u6587\u5B57\u3001\u505C\u7559\u3001\u518D\u7206\u70B8\u56DB\u6563\uFF0C\u5FAA\u73AF\u5207\u6362\u591A\u4E2A\u8BCD\u8BED\uFF0C\u9F20\u6807\u9760\u8FD1\u7C92\u5B50\u88AB\u63A8\u5F00\u3002", tags: ["Text Particles", "Morphing", "Word Cycle", "Mouse Repulsion"], component: "ParticleTextMorph", heavy: true },
    { id: "volumetric-rays", index: "84", name: "\u4F53\u79EF\u5149\u67F1\u9635\u5217", enName: "Volumetric Rays", category: "\u5149\u6548 / Lighting", description: "\u591A\u9053\u4F53\u79EF\u5149\u67F1\u4E01\u8FBE\u5C14\u9635\u5217\u2014\u2014\u5C18\u57C3\u7C92\u5B50\u6F02\u6D6E\u5728\u5149\u67F1\u4E2D\uFF0C\u5149\u675F\u968F\u98CE\u6446\u52A8\uFF0C\u9F20\u6807\u63A7\u5236\u503E\u659C\u3002", tags: ["God Rays", "Volumetric Light", "Dust Particles", "WebGL", "Atmospheric"], component: "VolumetricRays", heavy: true },
    { id: "parallax-scene", index: "85", name: "3D \u89C6\u5DEE\u573A\u666F", enName: "Parallax Scene", category: "\u7A7A\u95F4 / 3D", description: "\u591A\u5C42\u5C71\u5CE6\u526A\u5F71\u7ACB\u4F53\u89C6\u5DEE\u2014\u2014\u661F\u7A7A/\u6708\u4EAE/\u8FDC\u5C71/\u8FD1\u5C71/\u96FE\u972D\uFF0C\u7A7A\u6C14\u900F\u89C6\u8425\u9020\u7EB5\u6DF1\u611F\uFF0C\u663C\u591C\u8272\u6E10\u53D8\u3002", tags: ["Mountain Layers", "Depth Parallax", "Atmospheric Perspective", "Day-night Cycle"], component: "ParallaxScene" },
    { id: "fluid-smoke-cursor", index: "86", name: "\u6D41\u4F53\u70DF\u96FE\u5149\u6807", enName: "Fluid Smoke Cursor", category: "\u4EA4\u4E92 / Interaction", description: "WebGL \u70DF\u96FE\u6D41\u4F53\u8DDF\u968F\u5149\u6807\u79FB\u52A8\u2014\u2014\u5F69\u8272\u70DF\u56E2\u6269\u6563\u5347\u817E\uFF0C\u901F\u5EA6\u8D8A\u5FEB\u55B7\u5C04\u8D8A\u731B\uFF0C\u52A0\u6027\u6DF7\u5408\u6D41\u5149\u3002", tags: ["Smoke Fluid", "Cursor Trail", "WebGL POINTS", "Additive Blending"], component: "FluidSmokeCursor", heavy: true },
    { id: "waveform-bars", index: "87", name: "\u9891\u8C31\u6CE2\u5F62\u67F1\u72B6\u56FE", enName: "Waveform Bars", category: "\u89C6\u89C9 / Visual", description: "\u6A21\u62DF\u97F3\u9891\u9891\u8C31\u67F1\u72B6\u56FE\u2014\u2014\u8282\u62CD\u5F8B\u52A8\u3001\u5CF0\u503C\u56DE\u843D\u3001\u5E95\u90E8\u5012\u5F71\u3001\u6E10\u53D8\u8F89\u5149\uFF0C\u9F20\u6807\u63A7\u5236\u9891\u6BB5\u589E\u76CA\u3002", tags: ["Audio Visualizer", "Spectrum Bars", "Beat Pulse", "Peak Indicator"], component: "WaveformBars" },
    { id: "pixel-clock", index: "88", name: "\u50CF\u7D20\u6570\u5B57\u65F6\u949F", enName: "Pixel Clock", category: "\u6392\u7248 / Typography", description: "LED \u70B9\u9635\u50CF\u7D20\u65F6\u949F\u2014\u2014\u6570\u5B57\u53D8\u5316\u65F6\u65E7\u50CF\u7D20\u4E0A\u5347\u6D88\u6563\u3001\u65B0\u50CF\u7D20\u4ECE\u4E0B\u65B9\u6D6E\u5165\uFF0C\u8D5B\u535A\u7535\u5B50\u8F89\u5149\u3002", tags: ["LED Dot Matrix", "Flip Clock", "Pixel Transition", "Cyber Electronics"], component: "PixelClock" },
    { id: "circuit-growth", index: "89", name: "\u7535\u8DEF\u751F\u957F", enName: "Circuit Growth", category: "\u89C6\u89C9 / Visual", description: "\u7535\u8DEF\u677F\u7EBF\u8DEF\u4ECE\u4E2D\u5FC3\u5411\u5916 90\xB0 \u751F\u957F\u8513\u5EF6\u2014\u2014\u8282\u70B9\u710A\u76D8\u8F89\u5149\u3001\u5206\u652F\u5EF6\u4F38\u3001\u9F20\u6807\u5438\u5F15\u7EBF\u8DEF\u65B9\u5411\u3002", tags: ["PCB Circuit", "Growth Animation", "Node Branches", "Glow Traces"], component: "CircuitGrowth" },
    { id: "kaleidoscope-3d", index: "90", name: "3D \u4E07\u82B1\u7B52", enName: "Kaleidoscope 3D", category: "\u89C6\u89C9 / Visual", description: "\u516D\u91CD\u5BF9\u79F0\u4E07\u82B1\u7B52\u2014\u2014\u65CB\u8F6C\u51E0\u4F55\u4F53+\u8272\u5F69\u8109\u51B2\uFF0C\u4E09\u89D2/\u83F1\u5F62/\u516D\u8FB9/\u661F\u5F62\u591A\u5C42\u53E0\u52A0\uFF0C\u9F20\u6807\u6539\u53D8\u65CB\u8F6C\u65B9\u5411\u3002", tags: ["Kaleidoscope", "Hexagonal Symmetry", "Shape Rotation", "Color Pulse"], component: "Kaleidoscope3D", heavy: true },
    { id: "text-light-sweep", index: "91", name: "\u6587\u5B57\u6D41\u5149\u626B\u63CF", enName: "Text Light Sweep", category: "\u6392\u7248 / Typography", description: "\u591A\u5C42\u8F89\u5149\u6587\u5B57\u914D\u5408\u6A2A\u5411\u626B\u63CF\u5149\u5E26\u7A7F\u8FC7\u2014\u2014\u8272\u6563\u5206\u79BB\u3001\u7C92\u5B50\u98DE\u6E85\u3001\u626B\u8FC7\u77AC\u95F4\u8272\u5F69\u6591\u6593\uFF0C\u5E38\u9A7B\u52A8\u6001\u4E14\u5C42\u6B21\u4E30\u5BCC\u3002", tags: ["Light Sweep", "Glow Text", "Chromatic Aberration", "Sweep Particles"], component: "TextLightSweep" },
    { id: "text-stereo-entry", index: "92", name: "\u9010\u5B57\u7ACB\u4F53\u5165\u573A", enName: "Stereo Text Entry", category: "\u6392\u7248 / Typography", description: "\u5B57\u7B26\u4F9D\u6B21 3D \u5F39\u6027\u5165\u573A\u2014\u2014\u6E10\u53D8\u539A\u5EA6\u3001\u8F89\u5149\u3001\u843D\u5730\u7C92\u5B50\u98DE\u6E85\u3001\u5FAA\u73AF\u91CD\u653E\uFF0C\u89C6\u89C9\u51B2\u51FB\u529B\u5F3A\u3002", tags: ["3D Typography", "Staggered Entry", "Elastic Easing", "Bounce Particles"], component: "TextStereoEntry" },
    { id: "gravity-field", index: "93", name: "\u91CD\u529B\u5438\u5F15\u573A", enName: "Gravity Field", category: "\u7269\u7406 / Physics", description: "\u7C92\u5B50\u5728\u9F20\u6807\u5F15\u529B/\u65A5\u529B\u573A\u4E2D\u8FD0\u52A8\uFF0C\u60AC\u505C\u65A5\u529B\u63A8\u5F00\u7C92\u5B50\uFF0C\u6309\u4E0B\u62D6\u62FD\u751F\u6210\u5F15\u529B\u6F29\u6DA1\uFF0C\u7C92\u5B50\u87BA\u65CB\u5377\u5165\u3002", tags: ["Gravity Well", "Attraction Field", "Particle Physics", "Mouse Interaction"], component: "GravityField" },
    { id: "minimal-wave", index: "94", name: "\u6781\u7B80\u7EBF\u6761\u6CE2", enName: "Minimal Wave", category: "\u89C6\u89C9 / Visual", description: "\u5C11\u91CF\u6B63\u5F26\u6CE2\u7EBF\u6761\u4EA4\u53E0\u6D41\u52A8\uFF0C\u6781\u7B80\u7EBF\u6761\u7F8E\u5B66\uFF0C\u9F20\u6807\u6A2A\u5411\u6539\u53D8\u6CE2\u957F\u3001\u7EB5\u5411\u6539\u53D8\u632F\u5E45\uFF0C\u6D41\u7545\u4E14\u514B\u5236\u3002", tags: ["Sine Wave", "Minimalist", "Line Art", "Mouse Modulation"], component: "MinimalWave" },
    { id: "star-trail-orbit", index: "95", name: "\u661F\u8F68\u5EF6\u65F6", enName: "Star Trail Orbit", category: "\u89C6\u89C9 / Visual", description: "\u661F\u661F\u56F4\u7ED5\u4E2D\u5FC3\u505A\u5706\u5F27\u8F68\u8FF9\u62D6\u5C3E\u65CB\u8F6C\uFF0C\u50CF\u957F\u66DD\u5149\u661F\u8F68\u6444\u5F71\uFF0C\u9F20\u6807\u62D6\u52A8\u6539\u53D8\u65CB\u8F6C\u4E2D\u5FC3\u4F4D\u7F6E\u3002", tags: ["Long Exposure", "Orbit Trail", "Starfield", "Circular Motion"], component: "StarTrailOrbit" },
    { id: "flowing-gradient", index: "96", name: "\u6D41\u52A8\u6E10\u53D8", enName: "Flowing Gradient", category: "\u8272\u5F69 / Color", description: "\u67D4\u548C\u6E10\u53D8\u8272\u5757\u7F13\u6162\u6D41\u52A8\u6DF7\u5408\uFF0Cscreen \u6DF7\u5408\u6A21\u5F0F\u53E0\u51FA\u68A6\u5E7B\u8272\u5F69\uFF0C\u9F20\u6807\u79FB\u52A8\u5438\u5F15\u8272\u5757\u6D41\u5411\u3002", tags: ["Radial Gradient", "Blend Mode", "Color Flow", "Soft Ambient"], component: "FlowingGradient" },
    { id: "film-grain", index: "97", name: "\u566A\u70B9\u80F6\u7247", enName: "Film Grain", category: "\u8D28\u611F / Texture", description: "\u52A8\u6001\u566A\u70B9\u9897\u7C92\u8F7B\u5FAE\u95EA\u70C1\u6F02\u79FB\uFF0C\u590D\u53E4\u80F6\u7247\u8D28\u611F\uFF0C\u5076\u53D1\u5212\u75D5\u70B9\u7F00\uFF0C\u9F20\u6807\u63A0\u8FC7\u9897\u7C92\u52A0\u5F3A\u5BC6\u5EA6\u3002", tags: ["Film Texture", "Grain Noise", "Vintage", "Flicker Effect"], component: "FilmGrain" },
    { id: "breathing-halos", index: "98", name: "\u547C\u5438\u5149\u6655", enName: "Breathing Halos", category: "\u5149\u6548 / Lighting", description: "\u591A\u5C42\u5149\u6655\u7F13\u6162\u547C\u5438\u7F29\u653E+\u900F\u660E\u5EA6\u8109\u52A8\uFF0C\u7EAF CSS \u52A8\u753B GPU \u52A0\u901F\uFF0C\u9F20\u6807\u4F4D\u7F6E\u5373\u751F\u6210\u65B0\u5149\u6655\u5E76\u6D88\u6563\u3002", tags: ["Radial Glow", "CSS Animation", "Breathing Pulse", "Soft Light"], component: "BreathingHalos" },
    { id: "slide-text-sequence", index: "99", name: "\u6587\u5B57\u6ED1\u52A8\u5E8F\u5217", enName: "Slide Text Sequence", category: "\u6392\u7248 / Typography", description: "\u5B57\u7B26\u9010\u4E2A\u4ECE\u4E24\u4FA7\u6ED1\u5165+\u5F39\u6027\u843D\u4F4D+\u53D1\u5149\uFF0C\u5FAA\u73AF\u64AD\u653E\u591A\u7EC4\u6587\u5B57\uFF0C\u9F20\u6807\u60AC\u505C\u7ACB\u5373\u89E6\u53D1\u4E0B\u4E00\u7EC4\u3002", tags: ["Character Slide", "Elastic Easing", "Text Sequence", "Loop Animation"], component: "SlideTextSequence" },
    { id: "spotlight-scan", index: "100", name: "\u805A\u5149\u626B\u63CF", enName: "Spotlight Scan", category: "\u5149\u6548 / Lighting", description: "\u805A\u5149\u706F\u9525\u5149\u5728\u753B\u9762\u4E0A\u6765\u56DE\u626B\u63CF\uFF0C\u7167\u4EAE\u533A\u57DF\u5B57\u7B26\u7C92\u5B50\u6D6E\u73B0\uFF0C\u9F20\u6807\u79FB\u52A8\u5373\u63A7\u5236\u805A\u5149\u4F4D\u7F6E\u4E0E\u8303\u56F4\u3002", tags: ["Spotlight", "Reveal Effect", "Scan Animation", "Cursor Light"], component: "SpotlightScan" },
    { id: "ferrofluid-collision", index: "101", name: "\u78C1\u6D41\u4F53\u78B0\u649E", enName: "Ferrofluid Collision", category: "\u7269\u7406 / Physics", description: "\u78C1\u6D41\u4F53\u72B6\u7C98\u7A20\u7C92\u5B50\u56E2\u5728\u9F20\u6807\u6270\u52A8\u4E0B\u78B0\u649E\u53D8\u5F62\u3001\u62D6\u62FD\u5206\u88C2\uFF0C\u9AD8\u5149\u6D41\u52A8\u611F\u4E0E metaball \u7C98\u7A20\u878D\u5408\u6548\u679C\u3002", tags: ["Metaball", "Magnetic Fluid", "Viscous", "Mouse Interaction"], component: "FerrofluidCollision", heavy: true },
    { id: "portal-vortex", index: "102", name: "\u4F20\u9001\u95E8\u6F29\u6DA1", enName: "Portal Vortex", category: "\u89C6\u89C9 / Visual", description: "\u53CC\u8272\u5BF9\u65CB\u6F29\u6DA1\u5982\u79D1\u5E7B\u4F20\u9001\u95E8\uFF0C\u7C92\u5B50\u87BA\u65CB\u5438\u5165\u4E2D\u5FC3\uFF0C\u9F20\u6807\u79FB\u52A8\u6539\u53D8\u6F29\u6DA1\u4F4D\u7F6E\u4E0E\u5F3A\u5EA6\uFF0C\u6309\u4E0B\u589E\u5F3A\u5438\u529B\u3002", tags: ["Vortex", "Portal", "Spiral Particles", "Sci-fi"], component: "PortalVortex", heavy: true },
    { id: "matrix-rain-code", index: "103", name: "\u6570\u5B57\u96E8\u77E9\u9635", enName: "Matrix Rain", category: "\u89C6\u89C9 / Visual", description: "\u7ECF\u5178\u77E9\u9635\u6570\u5B57\u5B57\u7B26\u96E8\uFF0C\u7247\u5047\u540D+\u6570\u5B57+\u5B57\u6BCD\u4E0B\u843D\u62D6\u5C3E\u3001\u4EAE\u5EA6\u6E10\u53D8\uFF0C\u9F20\u6807\u63A0\u8FC7\u52A0\u901F\u5760\u843D\uFF0C\u5934\u90E8\u767D\u8272\u9AD8\u4EAE\u3002", tags: ["Matrix", "Digital Rain", "Code Rain", "Cyberpunk"], component: "MatrixRain" },
    { id: "origami-unfold", index: "104", name: "\u6298\u7EB8\u5C55\u5F00", enName: "Origami Unfold", category: "\u89C6\u89C9 / Visual", description: "3D \u6298\u9762\u4ECE\u4E2D\u5FC3\u9010\u9762\u5C55\u5F00\u6210\u516D\u8FB9\u5F62\u51E0\u4F55\u4F53\uFF0C\u9F20\u6807 X \u63A7\u5236\u5C55\u5F00\u8FDB\u5EA6\uFF0CY \u63A7\u5236\u503E\u659C\u89C6\u89D2\uFF0C\u6298\u75D5\u9AD8\u5149\u6E05\u6670\u3002", tags: ["Origami", "3D Transform", "Fold Animation", "Geometry"], component: "OrigamiUnfold" },
    { id: "hologram-scan", index: "105", name: "\u5168\u606F\u626B\u63CF\u7EBF", enName: "Hologram Scan", category: "\u5149\u6548 / Lighting", description: "\u534A\u900F\u660E\u7EBF\u6846\u7403\u4F53\u88AB\u626B\u63CF\u7EBF\u9010\u5C42\u626B\u8FC7\uFF0C\u622A\u9762\u53D1\u5149\uFF0C\u5168\u606F\u6295\u5F71\u8D28\u611F\uFF0CCRT \u566A\u70B9\u4E0E RGB \u8272\u6563\u3002", tags: ["Hologram", "Scan Line", "Wireframe", "Futuristic"], component: "HologramScan" },
    { id: "em-field-lines", index: "106", name: "\u7535\u78C1\u573A\u7EBF", enName: "EM Field Lines", category: "\u7269\u7406 / Physics", description: "\u78C1\u573A\u6D41\u7EBF\u4ECE N/S \u4E24\u6781\u53D1\u51FA\uFF0C\u53D7\u9F20\u6807\u4F4D\u7F6E\u504F\u8F6C\u5F2F\u66F2\uFF0C\u53D1\u5149\u6D41\u7EBF\u6548\u679C\uFF0C\u573A\u5F3A\u70B9\u9635\u80CC\u666F\u3002", tags: ["Magnetic Field", "Field Lines", "Flux Lines", "Physics"], component: "EMFieldLines" },
    { id: "pixel-explosion", index: "107", name: "\u50CF\u7D20\u7206\u70B8", enName: "Pixel Explosion", category: "\u7C92\u5B50 / Particle", description: "\u5706\u5F62\u56FE\u6848\u788E\u6210\u50CF\u7D20\u65B9\u5757\u7206\u70B8\u98DE\u6563+\u91CD\u529B\u53CD\u5F39\uFF0C\u518D\u805A\u62E2\u91CD\u7EC4\u5FAA\u73AF\uFF0C\u9F20\u6807\u70B9\u51FB\u7ACB\u5373\u5F15\u7206\u3002", tags: ["Pixel Art", "Explosion", "Reassemble", "Click Interaction"], component: "PixelExplosion", heavy: true },
    { id: "glass-refraction", index: "108", name: "\u73BB\u7483\u6298\u5C04", enName: "Glass Refraction", category: "\u6750\u8D28 / Material", description: "\u80CC\u666F\u88AB\u900F\u955C\u72B6\u73BB\u7483\u6298\u5C04\u626D\u66F2\uFF0C\u5149\u6591\u8272\u6563\uFF0C\u9F20\u6807\u62D6\u52A8\u900F\u955C\uFF0C\u8FB9\u7F18\u9AD8\u5149\u4E0E\u5185\u53CD\u5C04\u3002", tags: ["Refraction", "Glass", "Lens Effect", "Displacement"], component: "GlassRefraction" },
    { id: "star-ring-particles", index: "109", name: "\u661F\u73AF\u7C92\u5B50\u5E26", enName: "Star Ring Particles", category: "\u7C92\u5B50 / Particle", description: "\u884C\u661F\u73AF\u7ED5\u7C92\u5B50\u5E26\uFF0C\u571F\u661F\u73AF\u98CE\u683C\uFF0C\u9897\u7C92\u6CBF\u8F68\u9053\u758F\u5BC6\u5206\u5E03\u3001\u660E\u6697\u95EA\u70C1\uFF0C\u9F20\u6807\u62D6\u62FD\u503E\u659C\u89C6\u89D2\u3002", tags: ["Saturn Ring", "Orbit Particles", "Space", "3D Rotation"], component: "StarRingParticles", heavy: true },
    { id: "beat-pulse-rings", index: "110", name: "\u8282\u62CD\u8109\u51B2\u73AF", enName: "Beat Pulse Rings", category: "\u89C6\u89C9 / Visual", description: "\u540C\u5FC3\u5706\u73AF\u6309 120 BPM \u8282\u62CD\u8109\u51B2\u6269\u6563+\u547C\u5438\uFF0C\u900F\u660E\u5EA6\u547C\u5438\uFF0C\u9F20\u6807\u70B9\u51FB\u751F\u6210\u65B0\u8109\u51B2\u73AF\u3002", tags: ["Beat Pulse", "Ripple", "Rhythm", "Click Interaction"], component: "BeatPulseRings" },
    { id: "liquid-metal", index: "111", name: "\u6DB2\u6001\u91D1\u5C5E", enName: "Liquid Metal", category: "\u6750\u8D28 / Material", description: "\u7194\u878D\u91D1\u5C5E\u5149\u6CFD\u6D41\u4F53\u8868\u9762\u6D41\u52A8\u53D8\u5F62\uFF0C\u9AD8\u5149\u968F\u6D41\u52A8\u6E38\u8D70\uFF0C\u9F20\u6807\u62D6\u62FD\u6495\u88C2\u4E0E\u878D\u5408\u3002", tags: ["Metal", "Fluid", "Metaball", "Drag Interaction"], component: "LiquidMetal", heavy: true },
    { id: "isometric-city", index: "112", name: "\u7B49\u8DDD\u57CE\u5E02\u751F\u957F", enName: "Isometric City", category: "\u89C6\u89C9 / Visual", description: "\u4F4E\u591A\u8FB9\u5F62\u5EFA\u7B51\u4ECE\u5730\u9762\u9010\u680B\u751F\u957F\u3001\u706F\u5149\u9010\u7A97\u4EAE\u8D77\uFF0C\u663C\u591C\u4EA4\u66FF\uFF0C\u9F20\u6807\u79FB\u52A8\u6539\u53D8\u65E5\u7167\u89D2\u5EA6\u3002", tags: ["Isometric", "City Growth", "Low Poly", "Day Night Cycle"], component: "IsometricCity" },
    { id: "neural-pulse", index: "113", name: "\u795E\u7ECF\u8109\u51B2\u7F51\u7EDC", enName: "Neural Pulse", category: "\u7C92\u5B50 / Particle", description: "\u795E\u7ECF\u5143\u8282\u70B9\u653E\u7535\u95EA\u70C1\uFF0C\u8109\u51B2\u6CBF\u8FDE\u63A5\u7EBF\u4F20\u64AD\u6269\u6563\u5F62\u6210\u7EA7\u8054\u53CD\u5E94\uFF0C\u9F20\u6807\u60AC\u505C\u8282\u70B9\u589E\u5F3A\u653E\u7535\u3002", tags: ["Neural Network", "Pulse Propagation", "Bio-visualization", "Node Graph"], component: "NeuralPulse" },
    { id: "sand-particles", index: "114", name: "\u6C99\u753B\u7C92\u5B50\u6D41", enName: "Sand Particles", category: "\u7C92\u5B50 / Particle", description: "\u7C92\u5B50\u5982\u6D41\u6C99\u88AB\u9F20\u6807\u62D6\u62FD\u5851\u5F62\u3001\u5806\u79EF\u6210\u4E18\uFF0C\u677E\u624B\u540E\u5728\u91CD\u529B\u4E0B\u7F13\u6162\u6D41\u6563\u6062\u590D\u3002", tags: ["Sand Flow", "Granular Material", "Physics", "Drag Interaction"], component: "SandParticles" },
    { id: "ink-diffusion", index: "115", name: "\u58A8\u6EF4\u6269\u6563", enName: "Ink Diffusion", category: "\u81EA\u7136 / Nature", description: "\u58A8\u6EF4\u843D\u5165\u6C34\u4E2D\u6655\u5F00\u6210\u4E1D\u7F15\u58A8\u7EB9\uFF0C\u591A\u5C42\u58A8\u6EF4\u4EA4\u53E0\u6655\u67D3\uFF0C\u9F20\u6807\u8F7B\u70B9\u751F\u6210\u65B0\u58A8\u6EF4\u3002", tags: ["Ink Wash", "Diffusion", "Chinese Art", "Fluid"], component: "InkDiffusion" },
    { id: "rgb-glitch", index: "116", name: "RGB \u6545\u969C\u5207\u7247", enName: "RGB Glitch", category: "\u89C6\u89C9 / Visual", description: "\u753B\u9762 RGB \u4E09\u901A\u9053\u9519\u4F4D + \u6C34\u5E73\u5207\u7247\u968F\u673A\u6296\u52A8\uFF0C\u6545\u969C\u7206\u53D1\u540E\u81EA\u52A8\u590D\u539F\uFF0C\u8D5B\u535A\u670B\u514B\u8D28\u611F\u3002", tags: ["Glitch Art", "RGB Split", "Cyberpunk", "Signal Error"], component: "RGBGlitch" },
    { id: "aurora-curtain-v2", index: "117", name: "\u6781\u5149\u7A97\u5E18", enName: "Aurora Curtain", category: "\u81EA\u7136 / Nature", description: "\u7A97\u5E18\u72B6\u6781\u5149\u6D41\u4F53\u8D28\u611F\u591A\u5C42\u98D8\u52A8\u3001\u4EA4\u53E0\u660E\u6697\u8D77\u4F0F\uFF0C\u5782\u5411\u5149\u5E26\u4E0E\u6CE2\u7EB9\u8936\u76B1\u3002", tags: ["Aurora", "Curtain Flow", "Volume Light", "Atmospheric"], component: "AuroraCurtainV2" },
    { id: "spring-pendulum", index: "118", name: "\u5F39\u7C27\u7269\u7406\u6446", enName: "Spring Pendulum", category: "\u7269\u7406 / Physics", description: "\u4E00\u4E32\u5F39\u7C27\u8D28\u70B9\u9996\u5C3E\u76F8\u8FDE\u6784\u6210\u591A\u8282\u6446\uFF0C\u91CD\u529B + \u5F39\u7C27\u7EA6\u675F\u7269\u7406\u6A21\u62DF\uFF0C\u9F20\u6807\u7275\u5F15\u94FE\u7AEF\u3002", tags: ["Spring Physics", "Verlet Integration", "Pendulum", "Drag Interaction"], component: "SpringPendulum" },
    { id: "clock-vortex", index: "119", name: "\u65F6\u949F\u6DA1\u6D41", enName: "Clock Vortex", category: "\u89C6\u89C9 / Visual", description: "\u8868\u76D8\u523B\u5EA6\u6CBF\u6DA1\u6D41\u65CB\u8F6C\u626D\u66F2\uFF0C\u65F6\u5206\u79D2\u9488\u5316\u4E3A\u6D41\u5149\u6B8B\u5F71\uFF0C\u771F\u5B9E\u65F6\u95F4\u4E0E\u79D1\u5E7B\u6F29\u6DA1\u878D\u5408\u3002", tags: ["Clock", "Vortex", "Time Distortion", "Light Trail"], component: "ClockVortex" },
    { id: "cosmic-dust", index: "120", name: "\u661F\u9645\u5C18\u57C3\u4E91", enName: "Cosmic Dust", category: "\u7C92\u5B50 / Particle", description: "\u5927\u4F53\u79EF\u5C18\u57C3\u7C92\u5B50\u4E91\u7F13\u6162\u81EA\u8F6C\u3001\u660E\u6697\u8D77\u4F0F\u547C\u5438\uFF0C\u4F53\u79EF\u4E91\u56E2\u611F\u4E0E\u6697\u4E91\u906E\u7F69\uFF0C\u9F20\u6807\u6270\u52A8\u4E91\u56E2\u3002", tags: ["Dust Cloud", "Nebula", "Volume Rendering", "Breathing"], component: "CosmicDust", heavy: true }
  ];
  const PRODUCTS = [
    {
      name: "Motion Core",
      tag: "\u6838\u5FC3\u5F15\u64CE",
      tagType: "pro",
      price: "\xA5199",
      desc: "\u9AD8\u6027\u80FD Web \u52A8\u6548\u6838\u5FC3\u5F15\u64CE\uFF0C\u5185\u7F6E 50+ \u9884\u8BBE\u52A8\u6548\uFF0C\u4E00\u884C\u4EE3\u7801\u8C03\u7528\uFF0C\u5F00\u7BB1\u5373\u7528\u3002",
      features: [
        "50+ \u9AD8\u54C1\u8D28\u9884\u8BBE\u52A8\u6548",
        "60fps \u6D41\u7545\u6E32\u67D3",
        "\u96F6\u4F9D\u8D56\u7EAF\u539F\u751F\u5B9E\u73B0",
        "\u5B8C\u6574 TypeScript \u652F\u6301"
      ],
      preview: /* @__PURE__ */ React.createElement("div", { style: {
        width: "80%",
        height: "60%",
        borderRadius: 12,
        background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(177,77,255,0.2))",
        border: "1px solid rgba(0,229,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 30px rgba(0,229,255,0.2)",
        position: "relative",
        overflow: "hidden"
      } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.6), transparent 70%)", top: "20%", left: "20%", animation: "float 4s ease-in-out infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(177,77,255,0.6), transparent 70%)", bottom: "20%", right: "25%", animation: "float 4s ease-in-out infinite", animationDelay: "-2s" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "#fff", textShadow: "0 0 20px rgba(0,229,255,0.5)", letterSpacing: 1 } }, "CORE"))
    },
    {
      name: "Particle Studio",
      tag: "\u4E13\u4E1A\u7248",
      tagType: "new",
      price: "\xA5299",
      desc: "\u53EF\u89C6\u5316\u7C92\u5B50\u7F16\u8F91\u5668\uFF0C\u62D6\u62FD\u8C03\u53C2\u3001\u6240\u89C1\u5373\u6240\u5F97\uFF0C\u4E00\u952E\u5BFC\u51FA\u751F\u4EA7\u7EA7\u7C92\u5B50\u7CFB\u7EDF\u4EE3\u7801\u3002",
      features: [
        "\u53EF\u89C6\u5316\u7C92\u5B50\u7F16\u8F91\u5668",
        "200+ \u7C92\u5B50\u9884\u8BBE\u6A21\u677F",
        "\u5B9E\u65F6\u9884\u89C8\u4E0E\u8C03\u8BD5",
        "\u4E00\u952E\u5BFC\u51FA React/Vue \u4EE3\u7801"
      ],
      preview: /* @__PURE__ */ React.createElement("div", { style: {
        width: "80%",
        height: "60%",
        borderRadius: 12,
        background: "linear-gradient(145deg, rgba(20,25,45,0.8), rgba(10,15,30,0.9))",
        border: "1px solid rgba(177,77,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      } }, [...Array(20)].map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
        position: "absolute",
        width: 3 + Math.random() * 3,
        height: 3 + Math.random() * 3,
        borderRadius: "50%",
        background: `hsl(${270 + Math.random() * 60}, 100%, 70%)`,
        boxShadow: `0 0 8px hsl(${270 + Math.random() * 60}, 100%, 60%)`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
        animationDelay: `${-Math.random() * 3}s`
      } })), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#b14dff", textShadow: "0 0 20px rgba(177,77,255,0.5)", zIndex: 2 } }, "STUDIO"))
    },
    {
      name: "Scroll Magic",
      tag: "\u65B0\u53D1\u5E03",
      tagType: "beta",
      price: "\xA5149",
      desc: "\u6EDA\u52A8\u9A71\u52A8\u7684\u52A8\u6548\u7F16\u6392\u5DE5\u5177\uFF0C\u65F6\u95F4\u8F74\u5F0F\u7BA1\u7406\u6EDA\u52A8\u89E6\u53D1\u7684\u52A8\u753B\u5E8F\u5217\u3002",
      features: [
        "\u65F6\u95F4\u8F74\u53EF\u89C6\u5316\u7F16\u8F91",
        "\u6EDA\u52A8\u89E6\u53D1\u4E0E\u8FDB\u5EA6\u7ED1\u5B9A",
        "\u89C6\u5DEE\u4E0E\u8FDB\u573A\u52A8\u753B",
        "ScrollTrigger API"
      ],
      preview: /* @__PURE__ */ React.createElement("div", { style: {
        width: "80%",
        height: "60%",
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(255,77,157,0.1), rgba(20,15,35,0.8))",
        border: "1px solid rgba(255,77,157,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: "50%", top: "15%", transform: "translateX(-50%)", width: 2, height: "70%", background: "linear-gradient(180deg, #ff4d9d, #b14dff, transparent)", borderRadius: 1 } }), [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
        position: "absolute",
        left: "50%",
        top: `${20 + i * 18}%`,
        transform: "translateX(-50%)",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: i < 2 ? "#ff4d9d" : "#333",
        boxShadow: i < 2 ? "0 0 10px #ff4d9d" : "none"
      } })), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#ff4d9d", textShadow: "0 0 15px rgba(255,77,157,0.5)", zIndex: 2, position: "absolute", bottom: "15%" } }, "SCROLL"))
    },
    {
      name: "3D Transform Kit",
      tag: "\u9AD8\u7EA7\u7248",
      tagType: "pro",
      price: "\xA5399",
      desc: "3D \u53D8\u6362\u4E0E\u900F\u89C6\u6548\u679C\u5DE5\u5177\u5305\uFF0C\u5305\u542B\u503E\u659C\u3001\u7FFB\u8F6C\u3001\u5168\u666F\u7B49\u591A\u79CD 3D \u52A8\u6548\u3002",
      features: [
        "12 \u79CD 3D \u53D8\u6362\u6548\u679C",
        "\u9F20\u6807\u8DDF\u968F\u503E\u659C",
        "\u5168\u666F 360\xB0 \u65CB\u8F6C",
        "\u6DF1\u5EA6\u611F\u77E5\u9634\u5F71"
      ],
      preview: /* @__PURE__ */ React.createElement("div", { style: {
        width: "80%",
        height: "60%",
        borderRadius: 12,
        background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(10,15,30,0.9))",
        border: "1px solid rgba(255,215,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        perspective: "400px"
      } }, /* @__PURE__ */ React.createElement("div", { style: {
        width: 60,
        height: 80,
        borderRadius: 8,
        background: "linear-gradient(145deg, rgba(255,215,0,0.3), rgba(255,107,53,0.2))",
        border: "1px solid rgba(255,215,0,0.5)",
        transform: "rotateY(-15deg) rotateX(10deg)",
        boxShadow: "0 10px 30px rgba(255,215,0,0.2)",
        animation: "tilt-float 5s ease-in-out infinite"
      } }), /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        bottom: "20%",
        width: 80,
        height: 15,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,215,0,0.2), transparent 70%)"
      } }))
    }
  ];
  const TECH_STACK = [
    { name: "Canvas 2D", desc: "\u9AD8\u6027\u80FD\u9010\u5E27\u6E32\u67D3\u5F15\u64CE", level: 98 },
    { name: "\u7C92\u5B50\u7CFB\u7EDF", desc: "\u767E\u4E07\u7EA7\u7C92\u5B50\u5B9E\u65F6\u6A21\u62DF", level: 95 },
    { name: "CSS Animation", desc: "\u539F\u751F\u7EA7\u6D41\u7545\u8FC7\u6E21", level: 92 },
    { name: "\u7269\u7406\u5F15\u64CE", desc: "\u5F39\u7C27 / \u7EA6\u675F / Verlet \u79EF\u5206", level: 88 },
    { name: "SVG Morph", desc: "\u77E2\u91CF\u8DEF\u5F84\u5F62\u53D8", level: 85 },
    { name: "\u6587\u5B57\u7F16\u6392", desc: "\u6392\u7248\u52A8\u6548\u4E0E\u6587\u5B57\u7C92\u5B50", level: 82 },
    { name: "\u97F3\u9891\u53EF\u89C6\u5316", desc: "\u9891\u7387 / \u6CE2\u5F62\u5B9E\u65F6\u9A71\u52A8", level: 78 },
    { name: "WebGL Ready", desc: "\u4E3A\u4F53\u79EF\u6E32\u67D3\u9884\u7559", level: 70 },
    { name: "React 18", desc: "\u73B0\u4EE3\u5316\u7EC4\u4EF6\u67B6\u6784", level: 100 }
  ];
  class SilentErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
      console.error("[MOTION] Component render error:", (error == null ? void 0 : error.message) || error);
      if (errorInfo == null ? void 0 : errorInfo.componentStack) {
        console.error("Component stack:", errorInfo.componentStack);
      }
    }
    render() {
      if (this.state.hasError) {
        return React.createElement(
          "div",
          {
            style: {
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a0d18",
              color: "#fff",
              zIndex: 9999,
              fontFamily: "system-ui, sans-serif",
              flexDirection: "column",
              gap: "16px",
              padding: "32px",
              textAlign: "center"
            }
          },
          React.createElement("div", { style: { fontSize: 48 } }, "\u26A0"),
          React.createElement("div", { style: { fontSize: 18, fontWeight: 600 } }, "\u9875\u9762\u9047\u5230\u4E86\u4E00\u70B9\u5C0F\u95EE\u9898"),
          React.createElement(
            "div",
            { style: { fontSize: 13, color: "#888", maxWidth: 400 } },
            "\u67D0\u4E2A\u7EC4\u4EF6\u6E32\u67D3\u5931\u8D25\u5BFC\u81F4\u6574\u4F53\u4E2D\u65AD\u3002\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5\uFF0C\u6216\u901A\u8FC7\u53F3\u4E0B\u89D2\u53CD\u9988\u6309\u94AE\u544A\u77E5\u6211\u4EEC\u3002"
          ),
          React.createElement("button", {
            onClick: () => location.reload(),
            style: {
              marginTop: 8,
              padding: "10px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #00e5ff, #b14dff)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600
            }
          }, "\u5237\u65B0\u9875\u9762")
        );
      }
      return this.props.children;
    }
  }
  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [activeFilter, setActiveFilter] = React.useState("all");
    const [scrolled, setScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [showBackTop, setShowBackTop] = React.useState(false);
    const [showNavDots, setShowNavDots] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState("hero");
    const [effectStats, setEffectStats] = React.useState({ total: EFFECTS.length, visible: 0, categories: 0 });
    const [favorites, setFavorites] = React.useState(() => {
      try {
        return JSON.parse(localStorage.getItem("mg_favorites") || "[]");
      } catch (e) {
        return [];
      }
    });
    const [searchQuery, setSearchQuery] = React.useState("");
    const [detailEffect, setDetailEffect] = React.useState(null);
    const [immerseMode, setImmerseMode] = React.useState(false);
    const [wallpaperPreset, setWallpaperPreset] = React.useState("aurora");
    const [wallpaperRandom, setWallpaperRandom] = React.useState(false);
    const wallpaperPresetIds = ["aurora", "sunset", "forest", "cyber", "ocean", "lava", "stardust", "neonCity", "deepspace", "dreamland"];
    const randomizeWallpaper = React.useCallback(() => {
      const currentIdx = wallpaperPresetIds.indexOf(wallpaperPreset);
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * wallpaperPresetIds.length);
      } while (nextIdx === currentIdx && wallpaperPresetIds.length > 1);
      setWallpaperPreset(wallpaperPresetIds[nextIdx]);
      setWallpaperRandom(true);
      setTimeout(() => setWallpaperRandom(false), 600);
    }, [wallpaperPreset, wallpaperPresetIds]);
    const categories = ["all", ...Array.from(new Set(EFFECTS.map((e) => e.category))), "favorites"];
    const filtered = React.useMemo(() => {
      let list = activeFilter === "all" ? EFFECTS : activeFilter === "favorites" ? EFFECTS.filter((e) => favorites.includes(e.id)) : EFFECTS.filter((e) => e.category === activeFilter);
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        list = list.filter(
          (e) => e.name.toLowerCase().includes(q) || e.enName.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some((t2) => t2.toLowerCase().includes(q))
        );
      }
      return list;
    }, [activeFilter, favorites, searchQuery]);
    const [viewportWidth, setViewportWidth] = React.useState(
      typeof window !== "undefined" ? window.innerWidth : 1200
    );
    React.useEffect(() => {
      const onResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);
    const isMobile = viewportWidth <= 768;
    const isTablet = viewportWidth <= 1024 && viewportWidth > 768;
    let gridCols;
    if (isMobile)
      gridCols = 1;
    else if (isTablet)
      gridCols = 2;
    else
      gridCols = t.density === "compact" ? 3 : t.density === "comfortable" ? 2 : 1;
    let cardHeight;
    if (isMobile)
      cardHeight = 360;
    else if (isTablet)
      cardHeight = 400;
    else
      cardHeight = t.density === "spacious" ? 480 : t.density === "comfortable" ? 430 : 400;
    const listRef = React.useRef(null);
    React.useEffect(() => {
      const galleryEl = document.getElementById("gallery");
      if (!galleryEl)
        return;
      const rowHeight = cardHeight + 24;
      const totalRows = Math.ceil(filtered.length / gridCols);
      const totalHeight = totalRows > 0 ? totalRows * rowHeight - 24 : 0;
      const galleryTop = galleryEl.getBoundingClientRect().top + window.scrollY;
      const headerEl = galleryEl.querySelector(".section-header");
      const filtersEl = galleryEl.querySelector(".filters");
      let headerHeight = 200;
      if (headerEl)
        headerHeight = headerEl.offsetHeight + (filtersEl ? filtersEl.offsetHeight + 20 : 0);
      const listTop = galleryTop + headerHeight;
      const scrollBottom = window.scrollY + window.innerHeight;
      const listBottom = listTop + totalHeight;
      if (filtered.length === 0 || scrollBottom > listBottom + 200) {
        const target = Math.max(0, listTop - 60);
        window.scrollTo({ top: target, behavior: "auto" });
      }
    }, [filtered.length, gridCols, cardHeight]);
    React.useEffect(() => {
      setEffectStats({
        total: EFFECTS.length,
        visible: filtered.length,
        categories: categories.length - 1
        // 去掉 all
      });
    }, [activeFilter]);
    React.useEffect(() => {
      try {
        localStorage.setItem("mg_favorites", JSON.stringify(favorites));
      } catch (e) {
      }
    }, [favorites]);
    const [toast, setToast] = React.useState({ msg: "", visible: false });
    const showToast = React.useCallback((msg) => {
      setToast({ msg, visible: true });
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => setToast((t2) => __spreadProps(__spreadValues({}, t2), { visible: false })), 2e3);
    }, []);
    const toggleFavorite = React.useCallback((id) => {
      setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }, []);
    React.useEffect(() => {
      if (!detailEffect)
        return;
      const onKey = (e) => {
        const target = e.target;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) {
          return;
        }
        if (e.key === "Escape") {
          setDetailEffect(null);
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          const idx = filtered.findIndex((e2) => e2.id === detailEffect.id);
          if (idx < 0)
            return;
          const nextIdx = e.key === "ArrowRight" ? (idx + 1) % filtered.length : (idx - 1 + filtered.length) % filtered.length;
          setDetailEffect(filtered[nextIdx]);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [detailEffect, filtered]);
    const openDetail = React.useCallback((effect) => {
      setDetailEffect(effect);
      document.body.style.overflow = "hidden";
    }, []);
    const closeDetail = React.useCallback(() => {
      setDetailEffect(null);
      document.body.style.overflow = "";
    }, []);
    const surpriseMe = React.useCallback(() => {
      const rand = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
      scrollToEffect(rand.id);
    }, []);
    const scrollToEffect = React.useCallback((effectId) => {
      const index = EFFECTS.findIndex((e) => e.id === effectId);
      if (index < 0)
        return;
      const filterJustSwitched = activeFilter !== "all";
      if (filterJustSwitched) {
        setActiveFilter("all");
      }
      const row = Math.floor(index / gridCols);
      const rowHeight = cardHeight + 24;
      const galleryEl = document.getElementById("gallery");
      if (!galleryEl)
        return;
      const galleryTop = galleryEl.getBoundingClientRect().top + window.scrollY;
      const headerEl = galleryEl.querySelector(".section-header");
      const filtersEl = galleryEl.querySelector(".filters");
      let headerHeight = 200;
      if (headerEl)
        headerHeight = headerEl.offsetHeight + (filtersEl ? filtersEl.offsetHeight + 20 : 0);
      const listTop = galleryTop + headerHeight;
      const targetTop = listTop + row * rowHeight - 80;
      if (filterJustSwitched) {
        window.scrollTo({ top: Math.max(0, targetTop - 200), behavior: "auto" });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
          });
        });
      } else {
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      }
      const tryHighlight = (attempts = 0) => {
        if (attempts > 40)
          return;
        const card = document.getElementById(effectId);
        if (card) {
          card.style.transition = "box-shadow 0.35s ease, border-color 0.35s ease";
          card.style.boxShadow = `0 0 0 2px ${t.accentColor}, 0 0 40px ${t.accentColor}40`;
          card.style.borderColor = t.accentColor;
          setTimeout(() => {
            card.style.boxShadow = "";
            card.style.borderColor = "";
          }, 1800);
        } else {
          setTimeout(() => tryHighlight(attempts + 1), 80);
        }
      };
      setTimeout(() => tryHighlight(0), filterJustSwitched ? 500 : 300);
    }, [gridCols, cardHeight, t.accentColor, activeFilter]);
    const toggleImmerse = React.useCallback(() => {
      setImmerseMode((prev) => !prev);
    }, []);
    React.useEffect(() => {
      if (typeof document === "undefined")
        return;
      if (immerseMode) {
        document.body.classList.add("immerse-mode");
        window.scrollTo({ top: 0 });
      } else {
        document.body.classList.remove("immerse-mode");
      }
      return () => document.body.classList.remove("immerse-mode");
    }, [immerseMode]);
    React.useEffect(() => {
      let topObserver = null;
      const topSentinel = document.getElementById("hero");
      if (topSentinel) {
        topObserver = new IntersectionObserver(
          ([entry]) => {
            const scrolled2 = entry.boundingClientRect.top < -50 || entry.intersectionRatio < 0.85;
            setScrolled(scrolled2);
            setShowNavDots(scrolled2);
            setShowBackTop(entry.boundingClientRect.top < -350);
          },
          { threshold: [0, 0.5, 0.85, 1], rootMargin: "-50px 0px 0px 0px" }
        );
        topObserver.observe(topSentinel);
      }
      const sectionIds = ["hero", "products", "gallery", "wallpaper", "tech", "about"];
      const visibleSections = /* @__PURE__ */ new Map();
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }
          });
          let bestId = "hero";
          let bestRatio = 0;
          visibleSections.forEach((ratio, id) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          });
          if (bestRatio > 0)
            setActiveSection(bestId);
        },
        {
          // 以视口中上方 ~1/3 处为判定线，接近人的视觉焦点
          rootMargin: "-15% 0px -60% 0px",
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
        }
      );
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el)
          sectionObserver.observe(el);
      });
      return () => {
        sectionObserver.disconnect();
        if (topObserver)
          topObserver.disconnect();
      };
    }, []);
    React.useEffect(() => {
      if (typeof IntersectionObserver === "undefined")
        return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      const targets = document.querySelectorAll(".reveal-item, .reveal-header, .product-card");
      targets.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);
    const navLinks = [
      { label: "\u9996\u9875", href: "#hero" },
      { label: "\u4EA7\u54C1", href: "#products" },
      { label: "\u52A8\u6548\u5E93", href: "#gallery" },
      { label: "\u6280\u672F\u6808", href: "#tech" },
      { label: "\u5173\u4E8E", href: "#about" }
    ];
    React.useEffect(() => {
      if (typeof PerfMonitor === "undefined")
        return;
      if (t.perfTier === "auto") {
        PerfMonitor.setManualOverride(null);
      } else {
        PerfMonitor.setManualOverride(t.perfTier);
      }
    }, [t.perfTier]);
    const scrollTo = (href) => {
      setMobileMenuOpen(false);
      if (href.startsWith("#") && href.length > 1) {
        const id = href.slice(1);
        const effect = EFFECTS.find((e) => e.id === id);
        if (effect) {
          scrollToEffect(id);
          return;
        }
      }
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "app" }, /* @__PURE__ */ React.createElement("style", null, `
          .app { min-height: 100vh; position: relative; --accent: ${t.accentColor}; overflow-x: hidden; }
          html { scroll-behavior: smooth; }
          body { overflow-x: hidden; }
         .app::before {
           content: '';
           position: fixed;
           top: 0; left: 0; right: 0; bottom: 0;
           pointer-events: none;
           z-index: 0;
           background:
             radial-gradient(circle at 20% 30%, ${hexToRgba(t.accentColor, 0.05)} 0%, transparent 40%),
             radial-gradient(circle at 80% 70%, rgba(177, 77, 255, 0.04) 0%, transparent 40%);
         }

         /* Effect Card (global, uses --accent CSS var) */
         .effect-card {
           position: relative;
           border-radius: 16px;
           overflow: hidden;
           background: linear-gradient(145deg,
             rgba(18, 22, 38, 0.7) 0%,
             rgba(10, 13, 24, 0.85) 100%);
           border: 1px solid rgba(120, 150, 255, 0.08);
           transition: border-color 0.3s ease, transform 0.3s ease;
           scroll-margin-top: 100px;
         }
          .effect-card:focus-within {
            outline: 2px solid color-mix(in srgb, var(--accent) 40%, transparent);
            outline-offset: 1px;
          }
          .effect-card { touch-action: manipulation; }
         .effect-card:hover {
           transform: translateY(-2px);
           border-color: color-mix(in srgb, var(--accent) 20%, transparent);
         }
         .card-demo {
           position: relative;
           height: 280px;
           overflow: hidden;
           border-bottom: 1px solid rgba(120, 150, 255, 0.06);
           background: #080a14;
         }
         .card-index {
           position: absolute;
           top: 16px; left: 20px;
           z-index: 5;
           font-family: var(--font-mono);
           font-size: 11px;
           color: color-mix(in srgb, var(--accent) 70%, white);
           letter-spacing: 2px;
         }
         .card-category {
           position: absolute;
           top: 16px; right: 20px;
           z-index: 5;
           font-family: var(--font-mono);
           font-size: 9px;
           padding: 3px 8px;
           border-radius: 4px;
           background: rgba(0, 0, 0, 0.5);
           color: var(--text-muted);
           letter-spacing: 0.5px;
           text-transform: uppercase;
         }
         .card-skeleton {
           position: absolute; inset: 0;
           display: flex; align-items: center; justify-content: center;
           background:
             radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 70%),
             #080a14;
         }
         .card-skeleton-content { text-align: center; }
         .card-skeleton-icon {
           width: 48px; height: 48px;
           border-radius: 12px;
           background: color-mix(in srgb, var(--accent) 10%, transparent);
           border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
           display: flex; align-items: center; justify-content: center;
           margin: 0 auto 10px;
           color: var(--accent);
         }
         .card-skeleton-text {
           font-family: var(--font-mono);
           font-size: 10px;
           color: var(--text-muted);
           letter-spacing: 1px;
         }
         @keyframes sk-pulse {
           0%, 100% { opacity: 1; }
           50% { opacity: 0.4; }
         }
         .card-info { padding: 20px; position: relative; z-index: 2; }
         .card-actions {
           position: absolute; top: 12px; right: 12px;
           display: flex; gap: 6px;
           z-index: 10;
           opacity: 0;
           transition: opacity 0.25s;
         }
         .effect-card:hover .card-actions,
         .effect-card:focus-within .card-actions { opacity: 1; }
         .card-action-btn {
           width: 30px; height: 30px;
           border-radius: 50%;
           border: 1px solid rgba(255,255,255,0.1);
           background: rgba(0,0,0,0.4);
           backdrop-filter: blur(8px);
           color: rgba(255,255,255,0.7);
           cursor: pointer;
           display: flex; align-items: center; justify-content: center;
           transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
         }
         .card-action-btn:hover {
           background: rgba(0,0,0,0.6);
           color: #fff;
           transform: scale(1.1);
         }
         .card-action-btn.fav.active { color: #ff6b6b; }
         .card-action-btn.fav.active:hover { color: #ff8787; }
         .card-action-btn.copied { color: #33ff99; }
         .card-title-row {
           display: flex; align-items: baseline;
           justify-content: space-between;
           margin-bottom: 6px;
         }
         .card-title {
           font-family: var(--font-display);
           font-size: 18px; font-weight: 600;
           color: var(--text-primary);
         }
         .card-title-en {
           font-family: var(--font-mono);
           font-size: 10px;
           color: var(--text-muted);
           letter-spacing: 0.5px;
           text-transform: uppercase;
         }
         .card-desc {
           font-size: 12px;
           color: var(--text-secondary);
           line-height: 1.6;
           margin-bottom: 12px;
         }
          .card-tags { display: flex; flex-wrap: wrap; gap: 5px; }
          .card-tag {
            font-family: var(--font-mono);
            font-size: 9px;
            padding: 3px 7px;
            border-radius: 3px;
            background: color-mix(in srgb, var(--accent) 6%, transparent);
            color: color-mix(in srgb, var(--accent) 70%, white);
            border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
            letter-spacing: 0.3px;
          }
          .card-placeholder {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center;
            background:
              radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 70%),
              #080a14;
          }
          .placeholder-text {
            display: flex; align-items: center; gap: 8px;
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-muted);
            letter-spacing: 1px;
          }
          .placeholder-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: color-mix(in srgb, var(--accent) 60%, white);
            animation: sk-pulse 1.8s ease-in-out infinite;
          }
          .placeholder-text.standby {
            opacity: 0.6;
          }
          .standby-dot {
            background: var(--text-muted);
            animation: none;
          }
         @media (max-width: 768px) {
           .card-demo { height: 240px; }
         }

         /* Nav */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${scrolled ? "12px 40px" : "20px 40px"};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: ${scrolled ? "rgba(5, 6, 10, 0.75)" : "rgba(5, 6, 10, 0.35)"};
          border-bottom: 1px solid ${scrolled ? hexToRgba(t.accentColor, 0.12) : "rgba(120, 150, 255, 0.05)"};
          transition: padding 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          letter-spacing: 0.5px;
          cursor: pointer;
        }
        .nav-logo-mark {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, ${t.accentColor}, #b14dff);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px ${hexToRgba(t.accentColor, 0.3)}, inset 0 1px 0 rgba(255,255,255,0.2);
          transition: transform 0.35s cubic-bezier(.2,.9,.3,1.2), box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .nav-logo-mark::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%);
          animation: logo-shine 3.5s ease-in-out infinite;
        }
        @keyframes logo-shine {
          0%, 100% { transform: translateX(-30%) translateY(-30%) rotate(45deg); }
          50% { transform: translateX(30%) translateY(30%) rotate(45deg); }
        }
        .nav-logo:hover .nav-logo-mark { transform: rotate(-8deg) scale(1.06); box-shadow: 0 0 28px ${hexToRgba(t.accentColor, 0.45)}; }
        .nav-logo-svg { position: relative; z-index: 1; }
        .nav-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .nav-logo-sub {
          font-size: 11px;
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        .nav-link {
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link:hover { color: var(--text-primary); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: ${t.accentColor};
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s ease;
          border-radius: 1px;
        }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-link.active {
          color: var(--text-primary);
        }
        .nav-link.active::after {
          transform: scaleX(1);
        }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-cta-btn {
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: var(--font-display);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .nav-cta-btn.primary {
          background: linear-gradient(135deg, ${t.accentColor}, #b14dff);
          color: #0a0d18;
          font-weight: 600;
        }
        .nav-cta-btn.primary:hover {
          box-shadow: 0 4px 16px ${hexToRgba(t.accentColor, 0.35)};
          transform: translateY(-1px);
        }
        .nav-cta-btn.ghost {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(120, 150, 255, 0.15);
        }
        .nav-cta-btn.ghost:hover {
          color: var(--text-primary);
          border-color: ${hexToRgba(t.accentColor, 0.35)};
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
        }
        .hamburger span {
          width: 22px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 1px;
          transition: transform 0.3s ease, background 0.3s ease, opacity 0.3s ease;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0; right: 0;
          background: rgba(5, 6, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(120, 150, 255, 0.1);
          padding: 20px;
          z-index: 99;
          transform: translateY(-100%);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
          pointer-events: none;
        }
        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-menu-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-menu-link {
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .mobile-menu-link:hover {
          background: ${hexToRgba(t.accentColor, 0.1)};
          color: var(--text-primary);
        }

        /* Scroll progress bar */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, ${t.accentColor}, #b14dff, #ff4d9d);
          z-index: 101;
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.05s linear;
          will-change: transform;
        }

        /* Hero */
         #hero {
           position: relative;
           z-index: 1;
           padding: 120px 40px 60px;
           max-width: 1400px;
           margin: 0 auto;
           min-height: 92vh;
           display: flex;
           flex-direction: column;
           justify-content: center;
         }
        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: ${t.accentColor};
          padding: 6px 14px;
          border: 1px solid ${hexToRgba(t.accentColor, 0.3)};
          border-radius: 100px;
          background: ${hexToRgba(t.accentColor, 0.05)};
          margin-bottom: 28px;
          letter-spacing: 1px;
          width: fit-content;
        }
        .hero-label-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${t.accentColor};
          box-shadow: 0 0 8px ${t.accentColor};
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 7vw, 84px);
          font-weight: 700;
          line-height: 1.02;
          letter-spacing: -2px;
          margin-bottom: 28px;
          max-width: 900px;
          text-wrap: balance;
        }
        .hero-title .gradient-text {
          background: linear-gradient(135deg, ${t.accentColor} 0%, #b14dff 45%, #ff4d9d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
          font-weight: 800;
          will-change: background-position;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .hero-desc {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 560px;
          line-height: 1.8;
          margin-bottom: 40px;
          text-wrap: pretty;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 56px;
        }
        .hero-btn {
          padding: 13px 26px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: var(--font-display);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .hero-btn.primary {
          background: linear-gradient(135deg, ${t.accentColor}, #b14dff);
          color: #0a0d18;
          font-weight: 600;
          box-shadow: 0 4px 16px ${hexToRgba(t.accentColor, 0.25)};
        }
        .hero-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${hexToRgba(t.accentColor, 0.35)};
        }
        .hero-btn.ghost {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          border: 1px solid rgba(120, 150, 255, 0.15);
        }
        .hero-btn.ghost:hover {
          border-color: ${hexToRgba(t.accentColor, 0.35)};
          background: ${hexToRgba(t.accentColor, 0.05)};
        }
        .hero-btn.surprise {
          background: rgba(177, 77, 255, 0.1);
          color: #b14dff;
          border: 1px solid rgba(177, 77, 255, 0.3);
          position: relative;
        }
        .hero-btn.surprise::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: transparent;
          box-shadow: 0 0 0 4px rgba(177, 77, 255, 0.25);
          opacity: 0;
          transform: scale(0.9);
          animation: surprise-pulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-btn.surprise:hover {
          background: rgba(177, 77, 255, 0.2);
          transform: translateY(-2px);
        }
        @keyframes surprise-pulse {
          0%, 100% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .hero-stats {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .hero-stat { display: flex; flex-direction: column; gap: 4px; }
        .hero-stat-num {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: ${t.accentColor};
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .hero-effect-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 36px;
          max-width: 600px;
        }
        .hero-effect-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 4px;
          background: rgba(120, 150, 255, 0.06);
          border: 1px solid rgba(120, 150, 255, 0.08);
          color: var(--text-secondary);
          letter-spacing: 0.5px;
          cursor: default;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .hero-effect-tag:hover {
          background: ${hexToRgba(t.accentColor, 0.08)};
          border-color: ${hexToRgba(t.accentColor, 0.25)};
          color: ${t.accentColor};
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: scroll-bounce 2s ease-in-out infinite;
        }
        .scroll-indicator-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, ${t.accentColor}, transparent);
        }
        .scroll-indicator-text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 2px;
          writing-mode: vertical-rl;
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        /* Section base */
        section {
          position: relative;
          z-index: 1;
          scroll-margin-top: 80px;
        }
         .section-header {
           max-width: 1400px;
           margin: 0 auto;
           padding: 0 40px;
           margin-bottom: 36px;
         }
        .section-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          color: ${t.accentColor};
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 14px;
          font-weight: 500;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 700;
          letter-spacing: -0.8px;
          margin-bottom: 14px;
          text-wrap: balance;
        }
        .section-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 580px;
          line-height: 1.7;
          text-wrap: pretty;
        }

         /* Products */
         #products {
           padding: 72px 0 40px;
         }
        .products-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

         /* Gallery */
         #gallery {
           padding: 64px 0;
         }
        .filters {
          max-width: 1400px;
          margin: 0 auto 32px;
          padding: 0 40px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-chip {
          padding: 7px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-family: var(--font-mono);
          color: var(--text-secondary);
          background: rgba(120, 150, 255, 0.05);
          border: 1px solid rgba(120, 150, 255, 0.08);
          cursor: pointer;
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .filter-chip:hover {
          color: var(--text-primary);
          border-color: ${hexToRgba(t.accentColor, 0.35)};
        }
        .filter-chip.active {
          color: ${t.accentColor};
          background: ${hexToRgba(t.accentColor, 0.1)};
          border-color: ${hexToRgba(t.accentColor, 0.35)};
        }
        .gallery {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          /* \u865A\u62DF\u5217\u8868\u5185\u90E8 canvas \u5141\u8BB8\u89E6\u6478\u5192\u6CE1\u6EDA\u52A8 */
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
        .gallery-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          color: var(--text-secondary);
        }
        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${hexToRgba(t.accentColor, 0.6)};
          margin-bottom: 20px;
        }
        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-display);
          margin-bottom: 8px;
        }
        .empty-desc {
          font-size: 14px;
          max-width: 360px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .empty-btn {
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 13px;
          font-family: var(--font-mono);
          color: ${t.accentColor};
          background: ${hexToRgba(t.accentColor, 0.1)};
          border: 1px solid ${hexToRgba(t.accentColor, 0.35)};
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .empty-btn:hover {
          background: ${hexToRgba(t.accentColor, 0.18)};
          border-color: ${hexToRgba(t.accentColor, 0.5)};
        }

         #tech {
           padding: 72px 0;
         }
        .tech-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }
        .tech-item {
          padding: 22px;
          border-radius: 14px;
          background: rgba(18, 22, 38, 0.5);
          border: 1px solid rgba(120, 150, 255, 0.08);
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .tech-item:hover {
          border-color: ${hexToRgba(t.accentColor, 0.2)};
          transform: translateY(-2px);
        }
        .tech-item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }
        .tech-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .tech-level {
          font-family: var(--font-mono);
          font-size: 13px;
          color: ${t.accentColor};
          font-weight: 600;
        }
        .tech-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 14px;
          line-height: 1.5;
        }
        .tech-bar {
          height: 4px;
          border-radius: 2px;
          background: rgba(120, 150, 255, 0.08);
          overflow: hidden;
        }
        .tech-bar-fill {
          height: 100%;
          width: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, ${t.accentColor}, #b14dff);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Fusion Wallpaper */
        .wallpaper-section {
          padding: 80px 0 40px;
        }
        .wallpaper-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 0 40px;
        }
        .wallpaper-presets {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .wallpaper-preset {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: var(--text-secondary);
          font-size: 12px;
          font-family: var(--font-display);
          cursor: pointer;
          transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .wallpaper-preset:hover {
          border-color: rgba(255,255,255,0.2);
          color: var(--text-primary);
        }
        .wallpaper-preset.active {
          border-color: ${hexToRgba(t.accentColor, 0.5)};
          background: ${hexToRgba(t.accentColor, 0.1)};
          color: var(--text-primary);
        }
        .wp-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }
        .wallpaper-random {
          border-style: dashed;
          color: ${hexToRgba(t.accentColor, 0.8)};
          border-color: ${hexToRgba(t.accentColor, 0.3)};
        }
        .wallpaper-random:hover {
          border-color: ${hexToRgba(t.accentColor, 0.6)};
          color: ${t.accentColor};
          transform: scale(1.05);
        }
        .wallpaper-random.spinning svg {
          animation: spin-dice 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes spin-dice {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .wallpaper-frame {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          aspect-ratio: 16 / 9;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${hexToRgba(t.accentColor, 0.1)};
          border: 1px solid rgba(255,255,255,0.06);
        }
        .wallpaper-frame > div:first-of-type {
          position: absolute !important;
          inset: 0 !important;
        }
        .wallpaper-hint {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
          pointer-events: none;
          z-index: 5;
        }
        .wallpaper-immerse-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.3);
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          font-family: var(--font-display);
          cursor: pointer;
          backdrop-filter: blur(10px);
          z-index: 10;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        .wallpaper-immerse-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        /* \u6C89\u6D78\u6A21\u5F0F */
        body.immerse-mode .nav-wrap,
        body.immerse-mode .footer,
        body.immerse-mode #hero,
        body.immerse-mode #gallery,
        body.immerse-mode #products,
        body.immerse-mode #tech,
        body.immerse-mode #about,
        body.immerse-mode .back-top,
        body.immerse-mode .wallpaper-header {
          display: none !important;
        }
        body.immerse-mode .wallpaper-section {
          padding: 0;
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0a0d18;
        }
        body.immerse-mode .wallpaper-frame {
          max-width: none;
          padding: 0;
          aspect-ratio: unset;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          border: none;
          box-shadow: none;
        }

        /* About */
         #about {
           padding: 80px 0 72px;
         }
        .about-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .about-content p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 18px;
        }
        .about-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 28px;
        }
        .about-feature {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .about-feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: ${hexToRgba(t.accentColor, 0.1)};
          color: ${t.accentColor};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .about-feature-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .about-feature-text strong {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 2px;
          font-family: var(--font-display);
          font-size: 14px;
        }

        .about-visual {
          position: relative;
          aspect-ratio: 1;
          border-radius: 20px;
          background:
            radial-gradient(ellipse at 30% 30%, ${hexToRgba(t.accentColor, 0.12)}, transparent 60%),
            radial-gradient(ellipse at 70% 70%, rgba(177, 77, 255, 0.08), transparent 60%),
            rgba(18, 22, 38, 0.5);
          border: 1px solid rgba(120, 150, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .about-orbit {
          position: absolute;
          border: 1px solid ${hexToRgba(t.accentColor, 0.12)};
          border-radius: 50%;
        }
        .about-orbit.o1 { width: 70%; height: 70%; animation: orbit-spin 25s linear infinite; }
        .about-orbit.o2 { width: 50%; height: 50%; animation: orbit-spin 18s linear infinite reverse; }
        .about-orbit.o3 { width: 30%; height: 30%; animation: orbit-spin 12s linear infinite; }
        @keyframes orbit-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .about-orbit-planet {
          position: absolute;
          width: 10px; height: 10px;
          border-radius: 50%;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          background: ${t.accentColor};
          box-shadow: 0 0 12px ${t.accentColor};
        }
        .about-core {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${t.accentColor}, #b14dff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 22px;
          color: #0a0d18;
          box-shadow: 0 0 30px ${hexToRgba(t.accentColor, 0.35)};
          animation: core-pulse 3s ease-in-out infinite;
        }
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Global keyframes */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes tilt-float {
          0%, 100% { transform: rotateY(-15deg) rotateX(10deg) translateY(0); }
          50% { transform: rotateY(-10deg) rotateX(5deg) translateY(-8px); }
        }

        /* Footer */
        .footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(120, 150, 255, 0.08);
          background: rgba(8, 10, 18, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .footer-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 50px 40px calc(32px + env(safe-area-inset-bottom));
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .footer-brand-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 14px 0 18px;
          max-width: 300px;
        }
        .footer-social {
          display: flex;
          gap: 10px;
        }
        .footer-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(120, 150, 255, 0.05);
          border: 1px solid rgba(120, 150, 255, 0.08);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .footer-social-btn:hover {
          color: ${t.accentColor};
          border-color: ${hexToRgba(t.accentColor, 0.25)};
          background: ${hexToRgba(t.accentColor, 0.06)};
        }
        .footer-col-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 14px;
        }
        .footer-col-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
         .footer-col-item {
           font-size: 13px;
           color: var(--text-secondary);
           cursor: pointer;
           transition: color 0.2s ease;
         }
         .footer-col-item:hover { color: ${t.accentColor}; }
         .footer-col-item.disabled {
           cursor: default;
           color: var(--text-muted);
         }
         .footer-col-item.disabled:hover { color: var(--text-muted); }
        .footer-bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 40px;
          border-top: 1px solid rgba(120, 150, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }
        .footer-copy .accent { color: ${t.accentColor}; }

        /* Perf badge */
        .perf-badge {
          position: fixed;
          bottom: 16px;
          left: 16px;
          z-index: 200;
          padding: 4px 10px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          background: rgba(0,0,0,0.5);
          color: var(--text-muted);
          letter-spacing: 1px;
          pointer-events: none;
          opacity: 0.6;
        }

        /* Back to top */
        .back-top {
          position: fixed;
          bottom: calc(24px + env(safe-area-inset-bottom));
          right: 24px;
          z-index: 90;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(10, 13, 24, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid ${hexToRgba(t.accentColor, 0.2)};
          color: ${t.accentColor};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .back-top.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
         .back-top:hover {
           background: ${hexToRgba(t.accentColor, 0.12)};
           border-color: ${hexToRgba(t.accentColor, 0.4)};
           transform: translateY(-2px);
           box-shadow: 0 6px 20px ${hexToRgba(t.accentColor, 0.2)};
         }
         .back-top:active {
           animation: back-top-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
         }
          @keyframes back-top-bounce {
            0% { transform: scale(1); }
            30% { transform: scale(0.9); }
            60% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }

          /* ===== Section Navigation Dots ===== */
          .section-nav-dots {
             position: fixed;
             right: 10px;
             top: 50%;
             transform: translateY(-50%);
             z-index: 9999 !important;
             display: flex !important;
             flex-direction: column;
             gap: 14px;
             padding: 12px 8px;
             border-radius: 24px;
             background: rgba(10, 13, 24, 0.85);
             backdrop-filter: blur(12px);
             -webkit-backdrop-filter: blur(12px);
             border: 1px solid ${hexToRgba(t.accentColor, 0.3)};
             box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
             transition: none;
             opacity: 1 !important;
             pointer-events: auto !important;
             visibility: visible !important;
          }
          .section-nav-dots.show {
             opacity: 1 !important;
             pointer-events: auto !important;
          }
          .section-nav-dot {
            position: relative;
            width: 28px;
            height: 20px;
            border: none;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0;
            outline: none;
            opacity: 0;
            transform: translateX(10px);
            transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .section-nav-dots.show .section-nav-dot {
            opacity: 1;
            transform: translateX(0);
          }
          .section-nav-dot-pill {
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.25);
            transition: width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                        height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                        background 0.3s ease,
                        box-shadow 0.3s ease;
          }
          .section-nav-dot:hover .section-nav-dot-pill {
            background: rgba(255, 255, 255, 0.55);
            transform: scale(1.2);
          }
          .section-nav-dot.active .section-nav-dot-pill {
            width: 20px;
            height: 8px;
            border-radius: 4px;
            background: var(--accent, ${t.accentColor});
            box-shadow: 0 0 12px ${hexToRgba(t.accentColor, 0.7)},
                        0 0 24px ${hexToRgba(t.accentColor, 0.3)};
          }
          .section-nav-dot-label {
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%) translateX(8px);
            padding: 4px 10px;
            border-radius: 8px;
            background: rgba(10, 13, 24, 0.95);
            border: 1px solid ${hexToRgba(t.accentColor, 0.2)};
            color: #fff;
            font-size: 12px;
            font-family: var(--font-mono);
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            margin-right: 6px;
            transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(8px);
          }
          .section-nav-dot:hover .section-nav-dot-label {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
          .section-nav-dot-label::after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border: 4px solid transparent;
            border-left-color: rgba(10, 13, 24, 0.95);
          }
          .section-nav-dot:focus-visible .section-nav-dot-pill {
            outline: 2px solid var(--accent, ${t.accentColor});
            outline-offset: 2px;
          }

         /* ===== UI \u5165\u573A\u52A8\u753B ===== */
         .reveal-item {
           opacity: 0;
           transform: translateY(24px);
           transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                       transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
         }
         .reveal-item.in-view {
           opacity: 1;
           transform: translateY(0);
         }

         /* tech-item \u4EA4\u9519\u5EF6\u8FDF */
         .tech-grid .tech-item:nth-child(1) { transition-delay: 0.05s; }
         .tech-grid .tech-item:nth-child(2) { transition-delay: 0.1s; }
         .tech-grid .tech-item:nth-child(3) { transition-delay: 0.15s; }
         .tech-grid .tech-item:nth-child(4) { transition-delay: 0.2s; }
         .tech-grid .tech-item:nth-child(5) { transition-delay: 0.25s; }
         .tech-grid .tech-item:nth-child(6) { transition-delay: 0.3s; }

         /* products \u4EA4\u9519\u5EF6\u8FDF */
         .products-grid > *:nth-child(1) .reveal-item { transition-delay: 0.05s; }
         .products-grid > *:nth-child(2) .reveal-item { transition-delay: 0.1s; }
         .products-grid > *:nth-child(3) .reveal-item { transition-delay: 0.15s; }
         .products-grid > *:nth-child(4) .reveal-item { transition-delay: 0.2s; }

         /* about features \u4EA4\u9519 */
         .about-feature:nth-child(1) { transition-delay: 0.1s; }
         .about-feature:nth-child(2) { transition-delay: 0.2s; }
         .about-feature:nth-child(3) { transition-delay: 0.3s; }
         .about-feature:nth-child(4) { transition-delay: 0.4s; }

         /* \u533A\u5757\u6807\u9898\u5165\u573A */
         .section-header .section-eyebrow,
         .section-header .section-title,
         .section-header .section-subtitle {
           opacity: 0;
           transform: translateY(20px);
           transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                       transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
         }
         .section-header.in-view .section-eyebrow { opacity: 1; transform: translateY(0); transition-delay: 0.1s; }
         .section-header.in-view .section-title { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
         .section-header.in-view .section-subtitle { opacity: 1; transform: translateY(0); transition-delay: 0.35s; }

         /* Hero \u6807\u9898\u5165\u573A */
         .hero-label { animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
         .hero-title { animation: hero-fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both; }
         .hero-desc { animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both; }
         .hero-actions { animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both; }
         .hero-effect-tags { animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.95s both; }
         .hero-stats { animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both; }
         .scroll-indicator { animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.3s both, scroll-bounce 2s ease-in-out 2s infinite; }
         @keyframes hero-fade-up {
           from { opacity: 0; transform: translateY(30px); }
           to   { opacity: 1; transform: translateY(0); }
         }

         /* \u7EDF\u8BA1\u6570\u5B57\u6EDA\u52A8 */
         .hero-stat-num {
           font-variant-numeric: tabular-nums;
         }

         /* \u753B\u5ECA\u7B5B\u9009\u5207\u6362\u6DE1\u5165 */
         .gallery > * {
           animation: gallery-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
         }
         @keyframes gallery-fade-in {
           from { opacity: 0; transform: translateY(10px); }
           to   { opacity: 1; transform: translateY(0); }
         }

         /* \u94FE\u63A5\u4E0B\u5212\u7EBF\u6ED1\u52A8 */
         .footer-col-item {
           position: relative;
           transition: color 0.25s ease;
         }
         .footer-col-item:hover {
           color: var(--text-primary);
         }

         /* Global Toast */
         .global-toast {
           position: fixed;
           bottom: 36px;
           left: 50%;
           transform: translateX(-50%) translateY(20px);
           background: rgba(20, 22, 35, 0.95);
           backdrop-filter: blur(16px);
           -webkit-backdrop-filter: blur(16px);
           border: 1px solid ${hexToRgba(t.accentColor, 0.15)};
           color: var(--text-primary);
           padding: 12px 22px;
           border-radius: 10px;
           font-size: 13px;
           font-family: var(--font-body);
           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${hexToRgba(t.accentColor, 0.1)};
           opacity: 0;
           pointer-events: none;
           transition: opacity 0.25s ease, transform 0.25s ease;
           z-index: 10000;
           max-width: 80vw;
           text-align: center;
         }
         .global-toast.show {
           opacity: 1;
           transform: translateX(-50%) translateY(0);
         }

         /* ====== v5.6 \u65B0\u589E\u6837\u5F0F ====== */

         /* Initial Loader */
         .initial-loader {
           position: fixed;
           inset: 0;
           z-index: 9999;
           background: #05050a;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: opacity 0.4s ease;
         }
         .initial-loader-inner {
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 18px;
         }
         .initial-loader-logo {
           font-size: 22px;
           font-weight: 800;
           letter-spacing: 3px;
           color: #fff;
         }
         .initial-loader-bar {
           width: 240px;
           height: 2px;
           background: rgba(255, 255, 255, 0.1);
           border-radius: 2px;
           overflow: hidden;
         }
         .initial-loader-fill {
           height: 100%;
           border-radius: 2px;
           transition: width 0.15s ease-out;
         }
         .initial-loader-text {
           font-size: 11px;
           color: rgba(255, 255, 255, 0.4);
           letter-spacing: 1px;
           font-family: monospace;
         }

         /* Hero \u52A8\u6001\u80CC\u666F */
         .hero-visual-bg {
           position: absolute;
           inset: 0;
           z-index: 0;
           opacity: 0.6;
           pointer-events: none;
           mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
           -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
         }
         #hero { position: relative; overflow: hidden; }
         #hero > *:not(.hero-visual-bg) { position: relative; z-index: 1; }

         /* Nav \u641C\u7D22\u6309\u94AE */
         .nav-search-btn {
           width: 36px;
           height: 36px;
           border-radius: 10px;
           border: 1px solid rgba(255, 255, 255, 0.1);
           background: rgba(255, 255, 255, 0.04);
           color: rgba(255, 255, 255, 0.7);
           display: inline-flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: all 0.2s ease;
           margin-right: 8px;
         }
         .nav-search-btn:hover {
           border-color: rgba(255, 255, 255, 0.2);
           color: ${t.accentColor};
           background: rgba(255, 255, 255, 0.06);
         }

         /* Gallery \u641C\u7D22\u6846 */
         .gallery-search-wrap {
           max-width: 560px;
           margin: 0 auto 28px;
         }
         .gallery-search {
           position: relative;
           display: flex;
           align-items: center;
           height: 48px;
           padding: 0 16px 0 44px;
           background: rgba(255, 255, 255, 0.04);
           border: 1px solid rgba(255, 255, 255, 0.08);
           border-radius: 14px;
           backdrop-filter: blur(10px);
           -webkit-backdrop-filter: blur(10px);
           transition: all 0.25s ease;
         }
         .gallery-search:focus-within {
           border-color: ${t.accentColor};
           box-shadow: 0 0 0 3px ${t.accentColor}20;
           background: rgba(255, 255, 255, 0.06);
         }
         .search-icon {
           position: absolute;
           left: 14px;
           top: 50%;
           transform: translateY(-50%);
           color: rgba(255, 255, 255, 0.4);
         }
         .search-input {
           flex: 1;
           height: 100%;
           background: transparent;
           border: none;
           outline: none;
           color: #fff;
           font-size: 15px;
           font-family: inherit;
         }
         .search-input::placeholder {
           color: rgba(255, 255, 255, 0.3);
         }
         .search-clear {
           width: 24px;
           height: 24px;
           border-radius: 50%;
           border: none;
           background: rgba(255, 255, 255, 0.1);
           color: rgba(255, 255, 255, 0.6);
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: all 0.2s ease;
         }
         .search-clear:hover {
           background: rgba(255, 255, 255, 0.2);
           color: #fff;
         }
         .search-stats {
           margin-top: 8px;
           font-size: 12px;
           color: rgba(255, 255, 255, 0.35);
           text-align: center;
         }
         .search-count {
           color: ${t.accentColor};
           font-weight: 600;
         }
         .search-keyword {
           margin-left: 4px;
           color: rgba(255, 255, 255, 0.5);
         }

         /* \u7A7A\u72B6\u6001\u589E\u5F3A */
         .empty-visual {
           width: 72px;
           height: 72px;
           margin: 0 auto 16px;
           color: ${t.accentColor};
         }
         .empty-actions {
           display: flex;
           gap: 10px;
           justify-content: center;
           flex-wrap: wrap;
         }
         .empty-btn.primary {
           background: ${t.accentColor};
           color: #0a0a12;
           border: 1px solid ${t.accentColor};
         }
         .empty-btn.primary:hover {
           background: ${t.accentColor}cc;
         }

         /* \u8BE6\u60C5\u5F39\u7A97 */
         .detail-modal {
           position: fixed;
           inset: 0;
           z-index: 1000;
           background: rgba(5, 5, 10, 0.8);
           backdrop-filter: blur(8px);
           -webkit-backdrop-filter: blur(8px);
           display: flex;
           align-items: center;
           justify-content: center;
           animation: detail-fade-in 0.25s ease;
           padding: 20px;
         }
         @keyframes detail-fade-in {
           from { opacity: 0; }
           to { opacity: 1; }
         }
         .detail-modal-card {
           background: linear-gradient(145deg, #12121a 0%, #0a0a10 100%);
           border: 1px solid rgba(255, 255, 255, 0.1);
           border-radius: 20px;
           width: 100%;
           max-width: 560px;
           max-height: 85vh;
           overflow: hidden;
           display: flex;
           flex-direction: column;
           position: relative;
           animation: detail-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
           box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
         }
         @keyframes detail-scale-in {
           from { opacity: 0; transform: scale(0.92) translateY(10px); }
           to { opacity: 1; transform: scale(1) translateY(0); }
         }
         .detail-modal-close {
           position: absolute;
           top: 14px;
           right: 14px;
           z-index: 10;
           width: 32px;
           height: 32px;
           border-radius: 10px;
           border: 1px solid rgba(255, 255, 255, 0.1);
           background: rgba(255, 255, 255, 0.05);
           color: rgba(255, 255, 255, 0.7);
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: all 0.2s ease;
         }
         .detail-modal-close:hover {
           background: rgba(255, 255, 255, 0.12);
           color: #fff;
         }
         .detail-modal-header {
           padding: 28px 28px 0;
           display: flex;
           gap: 16px;
           align-items: flex-start;
         }
         .detail-index {
           font-family: monospace;
           font-size: 13px;
           font-weight: 700;
           color: ${t.accentColor};
           letter-spacing: 1px;
           padding: 6px 10px;
           background: ${t.accentColor}12;
           border: 1px solid ${t.accentColor}30;
           border-radius: 8px;
           flex-shrink: 0;
         }
         .detail-titles {
           flex: 1;
           display: flex;
           flex-direction: column;
           gap: 4px;
         }
         .detail-name {
           font-size: 24px;
           font-weight: 700;
           color: #fff;
           margin: 0;
           line-height: 1.2;
         }
         .detail-en-name {
           font-size: 13px;
           color: rgba(255, 255, 255, 0.4);
           letter-spacing: 0.5px;
         }
         .detail-category-row {
           display: flex;
           gap: 8px;
           padding: 12px 28px 0;
           flex-wrap: wrap;
         }
         .detail-category-tag,
         .detail-fav-tag,
         .detail-heavy-tag {
           font-size: 11px;
           padding: 4px 10px;
           border-radius: 20px;
           font-weight: 500;
         }
         .detail-category-tag {
           background: rgba(255, 255, 255, 0.06);
           color: rgba(255, 255, 255, 0.6);
           border: 1px solid rgba(255, 255, 255, 0.08);
         }
         .detail-fav-tag {
           background: #ff4d6d15;
           color: #ff6b8a;
           border: 1px solid #ff4d6d30;
         }
         .detail-heavy-tag {
           background: #ffaa0015;
           color: #ffbb33;
           border: 1px solid #ffaa0030;
         }
         .detail-preview {
           margin: 20px 28px 0;
           height: 220px;
           border-radius: 14px;
           overflow: hidden;
           border: 1px solid rgba(255, 255, 255, 0.08);
           background: #05050a;
           position: relative;
         }
         .detail-body {
           padding: 24px 28px 0;
           overflow-y: auto;
           flex: 1;
         }
         .detail-section {
           margin-bottom: 20px;
         }
         .detail-section:last-child { margin-bottom: 0; }
         .detail-section-label {
           font-size: 11px;
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 1.2px;
           color: ${t.accentColor};
           margin-bottom: 8px;
         }
         .detail-desc {
           margin: 0;
           font-size: 14px;
           line-height: 1.7;
           color: rgba(255, 255, 255, 0.75);
         }
         .detail-tags {
           display: flex;
           flex-wrap: wrap;
           gap: 6px;
         }
         .detail-tag {
           font-size: 11px;
           padding: 4px 10px;
           border-radius: 6px;
           background: rgba(255, 255, 255, 0.05);
           color: rgba(255, 255, 255, 0.6);
           border: 1px solid rgba(255, 255, 255, 0.06);
         }
         .detail-interactions {
           margin: 0;
           padding: 0;
           list-style: none;
           display: flex;
           flex-direction: column;
           gap: 6px;
         }
         .detail-interactions li {
           font-size: 13px;
           color: rgba(255, 255, 255, 0.65);
           padding-left: 18px;
           position: relative;
           line-height: 1.5;
         }
         .detail-interactions li::before {
           content: '';
           position: absolute;
           left: 0;
           top: 7px;
           width: 8px;
           height: 8px;
           border-radius: 50%;
           background: ${t.accentColor};
         }
         .detail-footer {
           padding: 20px 28px 24px;
           display: flex;
           gap: 10px;
           border-top: 1px solid rgba(255, 255, 255, 0.06);
           background: linear-gradient(180deg, transparent, rgba(0,0,0,0.3));
         }
         .detail-footer-btn {
           flex: 1;
           height: 40px;
           border-radius: 10px;
           border: 1px solid rgba(255, 255, 255, 0.1);
           background: rgba(255, 255, 255, 0.04);
           color: rgba(255, 255, 255, 0.8);
           font-size: 14px;
           font-weight: 500;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 6px;
           transition: all 0.2s ease;
           font-family: inherit;
         }
         .detail-footer-btn:hover {
           border-color: rgba(255, 255, 255, 0.2);
           background: rgba(255, 255, 255, 0.08);
         }
         .detail-footer-btn.primary {
           background: ${t.accentColor};
           border-color: ${t.accentColor};
           color: #0a0a12;
         }
         .detail-footer-btn.primary:hover {
           background: ${t.accentColor}dd;
         }
         .detail-nav-hint {
           text-align: center;
           font-size: 11px;
           color: rgba(255, 255, 255, 0.3);
           padding: 0 28px 18px;
           letter-spacing: 0.5px;
         }

         /* About \u65F6\u95F4\u7EBF */
         .about-timeline {
           margin: 28px 0;
           display: flex;
           flex-direction: column;
           gap: 18px;
           position: relative;
           padding-left: 4px;
         }
         .about-timeline::before {
           content: '';
           position: absolute;
           left: 5px;
           top: 6px;
           bottom: 6px;
           width: 1px;
           background: linear-gradient(to bottom, ${t.accentColor}60, transparent);
         }
         .timeline-item {
           position: relative;
           padding-left: 24px;
         }
         .timeline-dot {
           position: absolute;
           left: 0;
           top: 5px;
           width: 11px;
           height: 11px;
           border-radius: 50%;
           background: ${t.accentColor};
           box-shadow: 0 0 10px ${t.accentColor}80;
         }
         .timeline-head {
           display: flex;
           align-items: center;
           gap: 10px;
           margin-bottom: 4px;
         }
         .timeline-ver {
           font-family: monospace;
           font-size: 12px;
           font-weight: 700;
           color: ${t.accentColor};
           letter-spacing: 0.5px;
         }
         .timeline-date {
           font-size: 11px;
           color: rgba(255, 255, 255, 0.35);
         }
         .timeline-title {
           font-size: 14px;
           font-weight: 600;
           color: #fff;
           margin-bottom: 2px;
         }
         .timeline-desc {
           font-size: 12px;
           line-height: 1.6;
           color: rgba(255, 255, 255, 0.55);
         }

         /* Footer \u7248\u672C\u53F7 */
         .footer-version {
           font-family: monospace;
           color: rgba(255, 255, 255, 0.4);
         }

         /* Nav \u6BDB\u73BB\u7483\u589E\u5F3A */
         .nav.scrolled {
           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
           box-shadow: 0 1px 0 ${t.accentColor}20, 0 8px 32px rgba(0, 0, 0, 0.3);
         }

         /* Tech grid \u9002\u914D 9 \u9879 */
         .tech-grid {
           grid-template-columns: repeat(3, 1fr);
         }
         @media (max-width: 1024px) {
           .tech-grid { grid-template-columns: repeat(2, 1fr); }
         }

         :focus-visible {
           outline: 2px solid ${t.accentColor};
           outline-offset: 2px;
           border-radius: 4px;
         }

        @media (max-width: 1024px) {
          .footer-main { grid-template-columns: 1fr 1fr; }
          .about-container { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .nav { padding: 12px 20px; }
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: flex; }
          .mobile-menu { display: block; }
          #hero { padding: 100px 20px 60px; min-height: auto; }
          .hero-stats { gap: 24px; }
          .hero-stat-num { font-size: 26px; }
          .scroll-indicator { display: none; }
          .section-header { padding: 0 20px; margin-bottom: 28px; }
          #products, #gallery, #tech, #about { padding: 50px 0; }
          .products-grid, .gallery, .tech-grid, .about-container { padding: 0 20px; }
          .filters { padding: 0 20px; margin-bottom: 24px; }
          .footer-main { grid-template-columns: 1fr; padding: 36px 20px 28px; gap: 28px; }
          .footer-bottom { padding: 14px 20px; flex-direction: column; text-align: center; }
           .about-features { grid-template-columns: 1fr; }
           /* \u79FB\u52A8\u7AEF\u5361\u7247\uFF1A\u64CD\u4F5C\u6309\u94AE\u59CB\u7EC8\u53EF\u89C1\uFF0C\u4FBF\u4E8E\u89E6\u6478 */
           .card-actions { opacity: 1 !important; }
           .effect-card { cursor: default; }
           /* \u7AE0\u8282\u5BFC\u822A\u6ED1\u5757\uFF1A\u79FB\u52A8\u7AEF\u7F29\u5C0F\u8D34\u8FB9 */
           .section-nav-dots {
             right: 6px;
             gap: 10px;
             padding: 8px 4px;
             border-radius: 16px;
             background: rgba(10, 13, 24, 0.4);
             backdrop-filter: blur(8px);
             -webkit-backdrop-filter: blur(8px);
           }
           .section-nav-dot {
             width: 22px;
             height: 16px;
           }
           .section-nav-dot-pill {
             width: 5px;
             height: 5px;
           }
           .section-nav-dot.active .section-nav-dot-pill {
             width: 16px;
             height: 6px;
             border-radius: 3px;
           }
           .section-nav-dot-label {
             display: none;
           }
            /* \u79FB\u52A8\u7AEF touch-action \u4F18\u5316\u6EDA\u52A8 */
            .section-nav-dots { touch-action: pan-y; }

            /* \u79FB\u52A8\u7AEF\u641C\u7D22\u6846 */
            .gallery-search-wrap { padding: 0 20px; margin-bottom: 20px; }
            .gallery-search { height: 44px; }
            .search-input { font-size: 14px; }
            .search-stats { font-size: 11px; }

            /* \u79FB\u52A8\u7AEF\u8BE6\u60C5\u5F39\u7A97 */
            .detail-modal-card { width: 92vw; max-height: 88vh; margin: 5vh auto; }
            .detail-preview { height: 180px; }
            .detail-name { font-size: 20px; }
            .detail-titles { gap: 2px; }
            .detail-body { padding: 20px 20px 0; }
            .detail-footer { padding: 16px 20px 20px; }
            .detail-nav-hint { font-size: 11px; padding: 10px 20px 16px; }

            /* \u79FB\u52A8\u7AEF\u65F6\u95F4\u7EBF */
            .about-timeline { gap: 16px; }
            .timeline-item { padding-left: 20px; }
            .timeline-ver { font-size: 11px; }
            .timeline-date { font-size: 10px; }
            .timeline-title { font-size: 13px; }
            .timeline-desc { font-size: 11px; }

            /* \u79FB\u52A8\u7AEF hero \u80CC\u666F */
            .hero-visual-bg { opacity: 0.4; }

            /* \u79FB\u52A8\u7AEF tech-grid */
            .tech-grid { grid-template-columns: 1fr; }
          }
       `), /* @__PURE__ */ React.createElement(ScrollProgressBar, { accentColor: t.accentColor }), /* @__PURE__ */ React.createElement(InitialLoader, { accentColor: t.accentColor }), /* @__PURE__ */ React.createElement("nav", { className: "nav", role: "navigation", "aria-label": "\u4E3B\u5BFC\u822A" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "nav-logo",
        onClick: () => scrollTo("#hero"),
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => e.key === "Enter" && scrollTo("#hero")
      },
      /* @__PURE__ */ React.createElement("div", { className: "nav-logo-mark" }, /* @__PURE__ */ React.createElement("svg", { className: "nav-logo-svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.95" }, /* @__PURE__ */ React.createElement("path", { d: "M4 18 L9 6 L12 14 L15 8 L20 18" }))),
      /* @__PURE__ */ React.createElement("div", { className: "nav-logo-text" }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, letterSpacing: "2px" } }, "MOTION"), /* @__PURE__ */ React.createElement("span", { className: "nav-logo-sub" }, "Web Effects Library"))
    ), /* @__PURE__ */ React.createElement("ul", { className: "nav-links" }, navLinks.map((link) => {
      const sectionId = link.href.replace("#", "");
      const isActive = activeSection === sectionId;
      return /* @__PURE__ */ React.createElement("li", { key: link.href }, /* @__PURE__ */ React.createElement(
        "a",
        {
          className: `nav-link ${isActive ? "active" : ""}`,
          onClick: (e) => {
            e.preventDefault();
            scrollTo(link.href);
          },
          href: link.href,
          tabIndex: 0
        },
        link.label
      ));
    })), /* @__PURE__ */ React.createElement("div", { className: "nav-cta" }, /* @__PURE__ */ React.createElement("button", { className: "nav-search-btn", onClick: () => scrollTo("#gallery"), "aria-label": "\u641C\u7D22\u52A8\u6548", title: "\u641C\u7D22\u52A8\u6548" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }))), /* @__PURE__ */ React.createElement("button", { className: "nav-cta-btn ghost" }, "\u6587\u6863"), /* @__PURE__ */ React.createElement("button", { className: "nav-cta-btn primary" }, "\u5F00\u59CB\u4F7F\u7528")), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "hamburger",
        onClick: () => setMobileMenuOpen(!mobileMenuOpen),
        "aria-label": mobileMenuOpen ? "\u5173\u95ED\u83DC\u5355" : "\u6253\u5F00\u83DC\u5355",
        "aria-expanded": mobileMenuOpen
      },
      /* @__PURE__ */ React.createElement("span", { style: { transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" } }),
      /* @__PURE__ */ React.createElement("span", { style: { opacity: mobileMenuOpen ? 0 : 1 } }),
      /* @__PURE__ */ React.createElement("span", { style: { transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" } })
    )), /* @__PURE__ */ React.createElement("div", { className: `mobile-menu ${mobileMenuOpen ? "open" : ""}` }, /* @__PURE__ */ React.createElement("ul", { className: "mobile-menu-list" }, navLinks.map((link) => /* @__PURE__ */ React.createElement("li", { key: link.href }, /* @__PURE__ */ React.createElement(
      "a",
      {
        className: "mobile-menu-link",
        onClick: (e) => {
          e.preventDefault();
          scrollTo(link.href);
        },
        href: link.href
      },
      link.label
    ))))), /* @__PURE__ */ React.createElement("section", { id: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-visual-bg", "aria-hidden": "true" }, window.ParticleNetwork && /* @__PURE__ */ React.createElement(ParticleNetwork, { accentColor: t.accentColor, particleAmount: "low", motionLevel: "subtle" })), /* @__PURE__ */ React.createElement("div", { className: "hero-label" }, /* @__PURE__ */ React.createElement("span", { className: "hero-label-dot" }), "v1.0.0 \xB7 120 \u79CD\u624B\u9020\u52A8\u6548 \xB7 \u6B63\u5F0F\u53D1\u5E03"), /* @__PURE__ */ React.createElement("h1", { className: "hero-title" }, "\u96D5\u7422\u6BCF\u4E00\u5E27", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "\u4E3A\u6570\u5B57\u4E16\u754C\u6CE8\u5165\u547C\u5438")), /* @__PURE__ */ React.createElement("p", { className: "hero-desc" }, "\u4E00\u767E\u4E8C\u5341\u79CD\u624B\u5DE5\u8C03\u6821\u7684\u53EF\u4EA4\u4E92 Web \u52A8\u6548\uFF0C \u6A2A\u8DE8\u7C92\u5B50\u30013D\u3001\u7269\u7406\u3001\u5149\u5F71\u3001\u81EA\u7136\u3001\u89C6\u89C9\u3001\u6750\u8D28\u4E03\u5927\u7EF4\u5EA6\u3002 \u5168\u5C40\u5E27\u540C\u6B65\u8C03\u5EA6\u3001\u89C6\u53E3\u611F\u77E5\u4F11\u7720\u3001\u5206\u7EA7\u6027\u80FD\u81EA\u9002\u5E94\u2014\u2014 \u8BA9\u6781\u81F4\u7684\u89C6\u89C9\u8868\u8FBE\uFF0C\u4E0E\u6D41\u7545\u7684\u8FD0\u884C\u6027\u80FD\u5171\u5B58\u3002"), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("button", { className: "hero-btn primary", onClick: () => scrollTo("#products") }, "\u63A2\u7D22\u4EA7\u54C1", /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), /* @__PURE__ */ React.createElement("polyline", { points: "12 5 19 12 12 19" }))), /* @__PURE__ */ React.createElement("button", { className: "hero-btn ghost", onClick: () => scrollTo("#gallery") }, "\u6D4F\u89C8\u52A8\u6548\u5E93"), /* @__PURE__ */ React.createElement("button", { className: "hero-btn surprise", onClick: surpriseMe, title: "\u968F\u673A\u8DF3\u8F6C\u5230\u4E00\u4E2A\u52A8\u6548" }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })), "\u60CA\u559C\u52A8\u6548")), /* @__PURE__ */ React.createElement("div", { className: "hero-effect-tags", "aria-label": "\u52A8\u6548\u5206\u7C7B" }, ["\u73BB\u7483\u6750\u8D28", "\u7C92\u5B50\u7CFB\u7EDF", "\u4E09\u7EF4\u7A7A\u95F4", "\u7269\u7406\u6A21\u62DF", "\u6EDA\u52A8\u53D9\u4E8B", "\u6545\u969C\u827A\u672F", "\u97F3\u9891\u53EF\u89C6\u5316", "\u4F53\u79EF\u5149\u675F", "\u6587\u5B57\u7F16\u6392", "\u661F\u4E91\u5B87\u5B99", "\u6C34\u58A8\u8D28\u611F", "\u6570\u636E\u77E9\u9635"].map((tag, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "hero-effect-tag" }, tag))), /* @__PURE__ */ React.createElement("div", { className: "hero-stats" }, /* @__PURE__ */ React.createElement("div", { className: "hero-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero-stat-num" }, EFFECTS.length), /* @__PURE__ */ React.createElement("span", { className: "hero-stat-label" }, "\u624B\u9020\u52A8\u6548")), /* @__PURE__ */ React.createElement("div", { className: "hero-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero-stat-num" }, categories.length - 2), /* @__PURE__ */ React.createElement("span", { className: "hero-stat-label" }, "\u98CE\u683C\u5206\u7C7B")), /* @__PURE__ */ React.createElement("div", { className: "hero-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero-stat-num" }, "60"), /* @__PURE__ */ React.createElement("span", { className: "hero-stat-label" }, "\u5E27\u7387\u76EE\u6807")), /* @__PURE__ */ React.createElement("div", { className: "hero-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero-stat-num" }, "0"), /* @__PURE__ */ React.createElement("span", { className: "hero-stat-label" }, "\u7B2C\u4E09\u65B9\u5E93")), /* @__PURE__ */ React.createElement("div", { className: "hero-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero-stat-num" }, "\u221E"), /* @__PURE__ */ React.createElement("span", { className: "hero-stat-label" }, "\u53EF\u5546\u7528")), /* @__PURE__ */ React.createElement("div", { className: "hero-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero-stat-num" }, "100%"), /* @__PURE__ */ React.createElement("span", { className: "hero-stat-label" }, "\u54CD\u5E94\u5F0F\u9002\u914D"))), /* @__PURE__ */ React.createElement("div", { className: "scroll-indicator", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "scroll-indicator-line" }), /* @__PURE__ */ React.createElement("span", { className: "scroll-indicator-text" }, "SCROLL"))), /* @__PURE__ */ React.createElement("section", { id: "products" }, /* @__PURE__ */ React.createElement("div", { className: "section-header reveal-header" }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "PRODUCT LINE"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "\u4EA7\u54C1\u7EBF\u9635\u5217"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "\u4ECE\u6838\u5FC3\u5F15\u64CE\u5230\u53EF\u89C6\u5316\u7F16\u8F91\u5668\uFF0C\u4E3A\u4E0D\u540C\u9636\u6BB5\u7684\u521B\u4F5C\u8005\u4E0E\u56E2\u961F\uFF0C\u63D0\u4F9B\u4E13\u4E1A\u7684\u52A8\u6548\u751F\u4EA7\u529B\u5DE5\u5177\u3002")), /* @__PURE__ */ React.createElement("div", { className: "products-grid" }, PRODUCTS.map((product, idx) => /* @__PURE__ */ React.createElement(ProductCard, { key: idx, product, accentColor: t.accentColor })))), /* @__PURE__ */ React.createElement("section", { id: "gallery" }, /* @__PURE__ */ React.createElement("div", { className: "section-header reveal-header" }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "THE COLLECTION"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "\u52A8\u6548\u9648\u5217\u9986"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "\u4E03\u5341\u4EF6\u7CBE\u5FC3\u6253\u78E8\u7684\u52A8\u6548\u4F5C\u54C1\uFF0C\u6BCF\u4E00\u4EF6\u7686\u53EF\u4EA4\u4E92\u3001\u53EF\u590D\u73B0\u3001\u53EF\u5546\u7528\u3002 \u89C6\u53E3\u5916\u81EA\u52A8\u4F11\u7720\uFF0C\u8BA9\u6027\u80FD\u59CB\u7EC8\u4F18\u96C5\u3002")), /* @__PURE__ */ React.createElement("div", { className: "gallery-search-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "gallery-search" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "search-icon" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "search-input",
        placeholder: `\u641C\u7D22 ${EFFECTS.length} \u4E2A\u52A8\u6548 \xB7 \u540D\u79F0 / \u6807\u7B7E / \u5206\u7C7B`,
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        "aria-label": "\u641C\u7D22\u52A8\u6548"
      }
    ), searchQuery && /* @__PURE__ */ React.createElement("button", { className: "search-clear", onClick: () => setSearchQuery(""), "aria-label": "\u6E05\u9664\u641C\u7D22" }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })))), /* @__PURE__ */ React.createElement("div", { className: "search-stats" }, /* @__PURE__ */ React.createElement("span", { className: "search-count" }, filtered.length), " \u4E2A\u7ED3\u679C", searchQuery && /* @__PURE__ */ React.createElement("span", { className: "search-keyword" }, "\xB7 \u5173\u952E\u8BCD\uFF1A", searchQuery))), /* @__PURE__ */ React.createElement("div", { className: "filters", role: "tablist", "aria-label": "\u52A8\u6548\u5206\u7C7B" }, categories.map((cat) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: cat,
        className: `filter-chip ${activeFilter === cat ? "active" : ""}`,
        onClick: () => setActiveFilter(cat),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveFilter(cat);
          }
        },
        role: "tab",
        "aria-selected": activeFilter === cat,
        tabIndex: 0
      },
      cat === "all" ? "\u5168\u90E8\u6548\u679C" : cat === "favorites" ? "\u6211\u7684\u6536\u85CF" : cat
    ))), /* @__PURE__ */ React.createElement("div", { className: "gallery" }, filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "gallery-empty" }, /* @__PURE__ */ React.createElement("div", { className: "empty-visual" }, /* @__PURE__ */ React.createElement("svg", { width: "72", height: "72", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.5" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }), /* @__PURE__ */ React.createElement("path", { d: "M8 11h6" }))), /* @__PURE__ */ React.createElement("div", { className: "empty-title" }, "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u52A8\u6548"), /* @__PURE__ */ React.createElement("div", { className: "empty-desc" }, searchQuery ? `"${searchQuery}" \u6682\u65E0\u7ED3\u679C\uFF0C\u6362\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5\uFF1F` : activeFilter === "favorites" ? "\u8FD8\u6CA1\u6709\u6536\u85CF\u4EFB\u4F55\u52A8\u6548\uFF0C\u70B9\u51FB\u5361\u7247\u53F3\u4E0B\u89D2 \u2665 \u5F00\u59CB\u6536\u85CF\u5427" : "\u8FD9\u4E2A\u5206\u7C7B\u4E0B\u6682\u65F6\u6CA1\u6709\u52A8\u6548"), /* @__PURE__ */ React.createElement("div", { className: "empty-actions" }, searchQuery && /* @__PURE__ */ React.createElement("button", { className: "empty-btn primary", onClick: () => setSearchQuery("") }, "\u6E05\u9664\u641C\u7D22"), /* @__PURE__ */ React.createElement("button", { className: "empty-btn", onClick: () => {
      setActiveFilter("all");
      setSearchQuery("");
    } }, "\u67E5\u770B\u5168\u90E8 ", EFFECTS.length, " \u4E2A\u52A8\u6548"))) : /* @__PURE__ */ React.createElement(
      VirtualizedList,
      {
        ref: listRef,
        items: filtered,
        columns: gridCols,
        itemHeight: cardHeight,
        gap: 24,
        overscan: 2,
        renderItem: (effect, index) => {
          const Comp = window[effect.component];
          return /* @__PURE__ */ React.createElement(
            EffectCard,
            {
              effect,
              accentColor: t.accentColor,
              favorite: favorites.includes(effect.id),
              onFavorite: toggleFavorite,
              onClick: () => openDetail(effect)
            },
            Comp ? /* @__PURE__ */ React.createElement(
              Comp,
              {
                accentColor: t.accentColor,
                particleAmount: t.particleAmount,
                motionLevel: t.motionLevel
              }
            ) : null
          );
        }
      }
    ))), /* @__PURE__ */ React.createElement("section", { id: "tech" }, /* @__PURE__ */ React.createElement("div", { className: "section-header reveal-header" }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "UNDER THE HOOD"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "\u5E95\u5C42\u5F15\u64CE"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "\u5B8C\u5168\u57FA\u4E8E\u539F\u751F Web \u6807\u51C6\u6784\u5EFA\uFF0C\u96F6\u7B2C\u4E09\u65B9\u4F9D\u8D56\uFF0C\u8F7B\u91CF\u3001\u53EF\u63A7\u3001\u53EF\u6269\u5C55\u3002")), /* @__PURE__ */ React.createElement("div", { className: "tech-grid" }, TECH_STACK.map((tech, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "tech-item reveal-item" }, /* @__PURE__ */ React.createElement("div", { className: "tech-item-header" }, /* @__PURE__ */ React.createElement("span", { className: "tech-name" }, tech.name), /* @__PURE__ */ React.createElement("span", { className: "tech-level" }, tech.level, "%")), /* @__PURE__ */ React.createElement("p", { className: "tech-desc" }, tech.desc), /* @__PURE__ */ React.createElement("div", { className: "tech-bar" }, /* @__PURE__ */ React.createElement("div", { className: "tech-bar-fill", style: { transform: `scaleX(${tech.level / 100})` } })))))), /* @__PURE__ */ React.createElement("section", { id: "wallpaper", className: "wallpaper-section" }, /* @__PURE__ */ React.createElement("div", { className: "wallpaper-header" }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "GRAND FINALE"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "\u6C89\u6D78\u878D\u5408\u58C1\u7EB8"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "\u7C92\u5B50\u7F51\u7EDC\u4E0E\u6D41\u5149\u5728\u591C\u5E55\u4E2D\u5171\u821E\uFF0C\u5149\u96FE\u4E0E\u62D6\u5C3E\u5728\u6307\u5C16\u6D41\u6DCC\u3002\u79FB\u52A8\u5149\u6807\uFF0C\u4EB2\u624B\u4E66\u5199\u4E00\u5E45\u6D41\u52A8\u7684\u753B\u3002"), /* @__PURE__ */ React.createElement("div", { className: "wallpaper-presets" }, [
      { id: "aurora", name: "\u6781\u5149", color: "#00e5ff" },
      { id: "sunset", name: "\u65E5\u843D", color: "#ff6b6b" },
      { id: "forest", name: "\u68EE\u6797", color: "#33ff99" },
      { id: "cyber", name: "\u8D5B\u535A", color: "#ff33ff" },
      { id: "ocean", name: "\u6D77\u6D0B", color: "#00bbff" },
      { id: "lava", name: "\u7194\u5CA9", color: "#ff4422" },
      { id: "stardust", name: "\u661F\u7A7A", color: "#88aaff" },
      { id: "neonCity", name: "\u9713\u8679\u90FD\u5E02", color: "#ff0088" },
      { id: "deepspace", name: "\u6DF1\u7A7A", color: "#5566ff" },
      { id: "dreamland", name: "\u68A6\u5883", color: "#cc66ff" },
      { id: "nebulaDeep", name: "\u661F\u4E91", color: "#ff77aa" },
      { id: "underWater", name: "\u6DF1\u6D77", color: "#00ddff" }
    ].map((p) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: p.id,
        className: `wallpaper-preset ${wallpaperPreset === p.id ? "active" : ""}`,
        onClick: () => setWallpaperPreset(p.id),
        role: "button",
        "aria-pressed": wallpaperPreset === p.id,
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setWallpaperPreset(p.id);
          }
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "wp-dot", style: { background: p.color } }),
      p.name
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `wallpaper-preset wallpaper-random ${wallpaperRandom ? "spinning" : ""}`,
        onClick: randomizeWallpaper,
        title: "\u968F\u673A\u6DF7\u642D",
        "aria-label": "\u968F\u673A\u6DF7\u642D\u58C1\u7EB8"
      },
      /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "16 3 21 3 21 8" }), /* @__PURE__ */ React.createElement("line", { x1: "4", y1: "20", x2: "21", y2: "3" }), /* @__PURE__ */ React.createElement("polyline", { points: "21 16 21 21 16 21" }), /* @__PURE__ */ React.createElement("line", { x1: "15", y1: "15", x2: "21", y2: "21" }), /* @__PURE__ */ React.createElement("line", { x1: "4", y1: "4", x2: "9", y2: "9" })),
      "\u968F\u673A"
    ))), /* @__PURE__ */ React.createElement("div", { className: "wallpaper-frame" }, React.createElement(window.FusionWallpaper, {
      key: wallpaperPreset,
      accentColor: t.accentColor,
      motionLevel: t.motionLevel,
      preset: wallpaperPreset
    }), /* @__PURE__ */ React.createElement("div", { className: "wallpaper-hint" }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("polyline", { points: "12 6 12 12 16 14" })), "\u79FB\u52A8\u9F20\u6807\u4E0E\u753B\u5E03\u4EA4\u4E92"), /* @__PURE__ */ React.createElement("button", { className: "wallpaper-immerse-btn", onClick: toggleImmerse, title: "\u6C89\u6D78\u6A21\u5F0F" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, immerseMode ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M8 3v3a2 2 0 0 1-2 2H3" }), /* @__PURE__ */ React.createElement("path", { d: "M21 8h-3a2 2 0 0 1-2-2V3" }), /* @__PURE__ */ React.createElement("path", { d: "M3 16h3a2 2 0 0 1 2 2v3" }), /* @__PURE__ */ React.createElement("path", { d: "M16 21v-3a2 2 0 0 1 2-2h3" })) : /* @__PURE__ */ React.createElement("path", { d: "M8 3H5a2 2 0 0 0-2 2v3" })), immerseMode ? "\u9000\u51FA\u6C89\u6D78" : "\u6C89\u6D78\u6A21\u5F0F"))), /* @__PURE__ */ React.createElement("section", { id: "about" }, /* @__PURE__ */ React.createElement("div", { className: "about-container" }, /* @__PURE__ */ React.createElement("div", { className: "about-content" }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "PHILOSOPHY & MILESTONES"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "\u52A8\u6548\uFF0C\u662F\u754C\u9762\u7684\u547C\u5438"), /* @__PURE__ */ React.createElement("p", null, "\u5B83\u5F15\u5BFC\u89C6\u7EBF\u3001\u4F20\u8FBE\u53CD\u9988\u3001\u8D4B\u4E88\u4EA7\u54C1\u6027\u683C\u3002\u5728\u7528\u6237\u4E0E\u6570\u5B57\u4E16\u754C\u4E4B\u95F4\uFF0C \u52A8\u6548\u662F\u4E00\u5EA7\u6709\u6E29\u5EA6\u7684\u6865\u6881\u2014\u2014\u8BA9\u51B0\u51B7\u7684\u50CF\u7D20\uFF0C\u62E5\u6709\u4E86\u8282\u594F\u4E0E\u751F\u547D\u3002"), /* @__PURE__ */ React.createElement("p", null, "MOTION \u4EE5\u5DE5\u5320\u7CBE\u5EA6\u96D5\u7422\u6BCF\u4E00\u5E27\u3002\u6211\u4EEC\u4E0D\u5806\u780C\u7279\u6548\uFF0C \u800C\u662F\u5728\u89C6\u89C9\u8868\u8FBE\u4E0E\u5DE5\u7A0B\u6027\u80FD\u4E4B\u95F4\u5BFB\u627E\u7CBE\u786E\u7684\u6700\u4F18\u89E3\u2014\u2014 \u5168\u5C40\u5E27\u540C\u6B65\u3001\u89C6\u53E3\u611F\u77E5\u4F11\u7720\u3001\u5206\u7EA7\u6027\u80FD\u81EA\u9002\u5E94\uFF0C\u8BA9\u6BCF\u4E00\u6B21\u4E92\u52A8\u90FD\u8F7B\u76C8\u6D41\u7545\u3002"), /* @__PURE__ */ React.createElement("div", { className: "about-timeline" }, [
      { ver: "v1.0", date: "2023 Q1", title: "\u542F\u7A0B", desc: "30 \u6B3E Canvas \u52A8\u6548\uFF0C\u6838\u5FC3\u5F15\u64CE\u6210\u578B" },
      { ver: "v3.0", date: "2023 Q4", title: "\u8DC3\u8FC1", desc: "60 \u6B3E\u52A8\u6548\uFF0C\u865A\u62DF\u5217\u8868 + \u6027\u80FD\u8C03\u5EA6\u4E0A\u7EBF" },
      { ver: "v5.0", date: "2024 Q3", title: "\u6DF1\u8015", desc: "100 \u6B3E\u52A8\u6548\uFF0CWebGL \u9884\u5907 + \u9519\u8BEF\u8FB9\u754C\u4F53\u7CFB" },
      { ver: "v5.6", date: "2025 Q4", title: "\u7115\u65B0", desc: "120 \u6B3E\u52A8\u6548\uFF0C\u641C\u7D22 / \u8BE6\u60C5 / \u5168\u6808\u89C6\u89C9\u5347\u7EA7" },
      { ver: "v1.0", date: "2026 Q3", title: "\u6B63\u5F0F\u53D1\u5E03", desc: "MOTION v1.0 GA\uFF0C120 \u624B\u9020\u52A8\u6548\uFF0C\u6027\u80FD\u4F53\u7CFB + \u8D28\u91CF\u4F53\u7CFB\u5B8C\u5907\uFF0C\u96F6\u4F9D\u8D56\u7EAF\u524D\u7AEF" }
    ].map((m, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "timeline-item reveal-item" }, /* @__PURE__ */ React.createElement("div", { className: "timeline-dot" }), /* @__PURE__ */ React.createElement("div", { className: "timeline-body" }, /* @__PURE__ */ React.createElement("div", { className: "timeline-head" }, /* @__PURE__ */ React.createElement("span", { className: "timeline-ver" }, m.ver), /* @__PURE__ */ React.createElement("span", { className: "timeline-date" }, m.date)), /* @__PURE__ */ React.createElement("div", { className: "timeline-title" }, m.title), /* @__PURE__ */ React.createElement("div", { className: "timeline-desc" }, m.desc))))), /* @__PURE__ */ React.createElement("div", { className: "about-features" }, [
      { icon: "zap", title: "\u5E27\u540C\u6B65\u8C03\u5EA6\u5668", desc: "\u5168\u5C40\u7EDF\u4E00 rAF \u65F6\u5E8F" },
      { icon: "recycle", title: "\u89C6\u53E3\u611F\u77E5\u4F11\u7720", desc: "\u79BB\u5C4F\u81EA\u52A8\u6682\u505C\u91CA\u653E" },
      { icon: "device", title: "\u54CD\u5E94\u5F0F\u7CBE\u9002\u914D", desc: "\u5168\u5C3A\u5BF8\u65E0\u7F1D\u5448\u73B0" },
      { icon: "info", title: "\u65E0\u969C\u788D\u4F18\u5148", desc: "\u5C0A\u91CD\u7528\u6237\u52A8\u6548\u504F\u597D" }
    ].map((f, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "about-feature reveal-item" }, /* @__PURE__ */ React.createElement("div", { className: "about-feature-icon" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, f.icon === "zap" && /* @__PURE__ */ React.createElement("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }), f.icon === "recycle" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("polyline", { points: "23 4 23 10 17 10" }), /* @__PURE__ */ React.createElement("polyline", { points: "1 20 1 14 7 14" }), /* @__PURE__ */ React.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })), f.icon === "device" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "21", x2: "16", y2: "21" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "17", x2: "12", y2: "21" })), f.icon === "info" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })))), /* @__PURE__ */ React.createElement("div", { className: "about-feature-text" }, /* @__PURE__ */ React.createElement("strong", null, f.title), f.desc))))), /* @__PURE__ */ React.createElement("div", { className: "about-visual", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "about-orbit o1" }, /* @__PURE__ */ React.createElement("div", { className: "about-orbit-planet" })), /* @__PURE__ */ React.createElement("div", { className: "about-orbit o2" }, /* @__PURE__ */ React.createElement("div", { className: "about-orbit-planet", style: { background: "#b14dff", boxShadow: "0 0 12px #b14dff" } })), /* @__PURE__ */ React.createElement("div", { className: "about-orbit o3" }, /* @__PURE__ */ React.createElement("div", { className: "about-orbit-planet", style: { background: "#ff4d9d", boxShadow: "0 0 12px #ff4d9d", width: 7, height: 7, top: -3.5 } })), /* @__PURE__ */ React.createElement("div", { className: "about-core" }, "MG")))), /* @__PURE__ */ React.createElement("footer", { className: "footer" }, /* @__PURE__ */ React.createElement("div", { className: "footer-main" }, /* @__PURE__ */ React.createElement("div", { className: "footer-brand" }, /* @__PURE__ */ React.createElement("div", { className: "nav-logo" }, /* @__PURE__ */ React.createElement("div", { className: "nav-logo-mark" }, /* @__PURE__ */ React.createElement("svg", { className: "nav-logo-svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.95" }, /* @__PURE__ */ React.createElement("path", { d: "M4 18 L9 6 L12 14 L15 8 L20 18" }))), /* @__PURE__ */ React.createElement("div", { className: "nav-logo-text" }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, letterSpacing: "2px" } }, "MOTION"), /* @__PURE__ */ React.createElement("span", { className: "nav-logo-sub" }, "Web Effects Library"))), /* @__PURE__ */ React.createElement("p", { className: "footer-brand-desc" }, "\u4E00\u767E\u4E8C\u5341\u79CD\u624B\u9020 Web \u52A8\u6548\uFF0C\u4E3A\u4E0B\u4E00\u4EE3\u4EA4\u4E92\u754C\u9762\u6CE8\u5165\u547C\u5438\u4E0E\u751F\u547D\u3002 \u96D5\u7422\u6BCF\u4E00\u5E27\uFF0C\u8BA9\u6570\u5B57\u4E16\u754C\u66F4\u6709\u6E29\u5EA6\u3002"), /* @__PURE__ */ React.createElement("div", { className: "footer-social" }, [
      { id: "github", label: "GitHub" },
      { id: "twitter", label: "Twitter / X" },
      { id: "dribbble", label: "Dribbble" },
      { id: "mail", label: "\u90AE\u7BB1" }
    ].map((s, i) => /* @__PURE__ */ React.createElement("button", { key: i, className: "footer-social-btn", "aria-label": s.label, onClick: () => showToast(s.label + " \u5373\u5C06\u5F00\u653E") }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, s === "github" && /* @__PURE__ */ React.createElement("path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" }), s === "twitter" && /* @__PURE__ */ React.createElement("path", { d: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" }), s === "dribbble" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" })), s === "mail" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ React.createElement("polyline", { points: "22,6 12,13 2,6" }))))))), /* @__PURE__ */ React.createElement("div", { className: "footer-col" }, /* @__PURE__ */ React.createElement("h4", { className: "footer-col-title" }, "\u4EA7\u54C1"), /* @__PURE__ */ React.createElement("ul", { className: "footer-col-list" }, /* @__PURE__ */ React.createElement("li", { className: "footer-col-item", onClick: () => scrollTo("#products") }, "Motion Core"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item", onClick: () => scrollTo("#products") }, "Particle Studio"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item", onClick: () => scrollTo("#products") }, "Scroll Magic"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item", onClick: () => scrollTo("#products") }, "3D Transform Kit"))), /* @__PURE__ */ React.createElement("div", { className: "footer-col" }, /* @__PURE__ */ React.createElement("h4", { className: "footer-col-title" }, "\u8D44\u6E90"), /* @__PURE__ */ React.createElement("ul", { className: "footer-col-list" }, /* @__PURE__ */ React.createElement("li", { className: "footer-col-item", onClick: () => scrollTo("#gallery") }, "\u52A8\u6548\u5E93"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item disabled", onClick: () => showToast("\u6587\u6863\u4E2D\u5FC3\u5373\u5C06\u4E0A\u7EBF") }, "\u6587\u6863\u4E2D\u5FC3"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item disabled", onClick: () => showToast("API \u53C2\u8003\u5373\u5C06\u4E0A\u7EBF") }, "API \u53C2\u8003"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item disabled", onClick: () => showToast("\u793A\u4F8B\u9879\u76EE\u5373\u5C06\u4E0A\u7EBF") }, "\u793A\u4F8B\u9879\u76EE"))), /* @__PURE__ */ React.createElement("div", { className: "footer-col" }, /* @__PURE__ */ React.createElement("h4", { className: "footer-col-title" }, "\u516C\u53F8"), /* @__PURE__ */ React.createElement("ul", { className: "footer-col-list" }, /* @__PURE__ */ React.createElement("li", { className: "footer-col-item", onClick: () => scrollTo("#about") }, "\u5173\u4E8E\u6211\u4EEC"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item disabled", onClick: () => showToast("\u62DB\u8058\u4FE1\u606F\u5373\u5C06\u4E0A\u7EBF") }, "\u52A0\u5165\u56E2\u961F"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item disabled", onClick: () => showToast("\u8054\u7CFB\u65B9\u5F0F\u5373\u5C06\u4E0A\u7EBF") }, "\u8054\u7CFB\u65B9\u5F0F"), /* @__PURE__ */ React.createElement("li", { className: "footer-col-item disabled", onClick: () => showToast("\u9690\u79C1\u653F\u7B56\u5373\u5C06\u4E0A\u7EBF") }, "\u9690\u79C1\u653F\u7B56")))), /* @__PURE__ */ React.createElement("div", { className: "footer-bottom" }, /* @__PURE__ */ React.createElement("span", { className: "footer-copy" }, "\xA9 2025 MOTION. Crafted with ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\u25C8"), " Pure Frontend."), /* @__PURE__ */ React.createElement("span", { className: "footer-copy footer-version" }, "v1.0.3 \xB7 120 Hand-Crafted Effects \xB7 Release"))), /* @__PURE__ */ React.createElement("div", { className: `global-toast ${toast.visible ? "show" : ""}`, role: "status", "aria-live": "polite" }, toast.msg), /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "\u4E3B\u9898\u8272\u5F69" }), /* @__PURE__ */ React.createElement(
      TweakColor,
      {
        label: "\u4E3B\u8272\u8C03",
        value: t.accentColor,
        options: ["#00e5ff", "#b14dff", "#ff4d9d", "#ffd700", "#00ff88", "#ff6b35"],
        onChange: (v) => setTweak("accentColor", v)
      }
    ), /* @__PURE__ */ React.createElement(TweakSection, { label: "\u5E03\u5C40\u5BC6\u5EA6" }), /* @__PURE__ */ React.createElement(
      TweakRadio,
      {
        label: "\u5361\u7247\u5217\u6570",
        value: t.density,
        options: ["compact", "comfortable", "spacious"],
        onChange: (v) => setTweak("density", v)
      }
    ), /* @__PURE__ */ React.createElement(TweakSection, { label: "\u52A8\u6548\u53C2\u6570" }), /* @__PURE__ */ React.createElement(
      TweakRadio,
      {
        label: "\u7C92\u5B50\u6570\u91CF",
        value: t.particleAmount,
        options: ["low", "medium", "high"],
        onChange: (v) => setTweak("particleAmount", v)
      }
    ), /* @__PURE__ */ React.createElement(
      TweakRadio,
      {
        label: "\u52A8\u6548\u5F3A\u5EA6",
        value: t.motionLevel,
        options: ["subtle", "rich", "intense"],
        onChange: (v) => setTweak("motionLevel", v)
      }
    ), /* @__PURE__ */ React.createElement(TweakSection, { label: "\u51CF\u5C11\u52A8\u6548" }), /* @__PURE__ */ React.createElement(
      TweakRadio,
      {
        label: "\u51CF\u5C11\u52A8\u6548",
        value: t.reduceMotion,
        options: [
          { value: "system", label: "\u8DDF\u968F\u7CFB\u7EDF" },
          { value: "off", label: "\u5173\u95ED\u964D\u7EA7" }
        ],
        onChange: (v) => {
          setTweak("reduceMotion", v);
          if (typeof setReduceMotionPreference === "function") {
            setReduceMotionPreference(v);
          }
          if (typeof PerfMonitor !== "undefined" && PerfMonitor.setReduceMotionPref) {
            PerfMonitor.setReduceMotionPref(v);
          }
        }
      }
    ), /* @__PURE__ */ React.createElement(TweakSection, { label: "\u6027\u80FD\u6863\u4F4D" }), /* @__PURE__ */ React.createElement(
      TweakRadio,
      {
        label: "\u6027\u80FD\u6863\u4F4D",
        value: t.perfTier,
        options: [
          { value: "auto", label: "\u81EA\u52A8" },
          { value: "high", label: "\u9AD8" },
          { value: "mid", label: "\u4E2D" },
          { value: "low", label: "\u4F4E" }
        ],
        onChange: (v) => setTweak("perfTier", v)
      }
    )), detailEffect && /* @__PURE__ */ React.createElement("div", { className: "detail-modal", onClick: closeDetail, role: "dialog", "aria-modal": "true", "aria-label": "\u52A8\u6548\u8BE6\u60C5" }, /* @__PURE__ */ React.createElement("div", { className: "detail-modal-card", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { className: "detail-modal-close", onClick: closeDetail, "aria-label": "\u5173\u95ED\u8BE6\u60C5" }, /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }))), /* @__PURE__ */ React.createElement("div", { className: "detail-modal-header" }, /* @__PURE__ */ React.createElement("div", { className: "detail-index" }, "NO.", detailEffect.index), /* @__PURE__ */ React.createElement("div", { className: "detail-titles" }, /* @__PURE__ */ React.createElement("h3", { className: "detail-name" }, detailEffect.name), /* @__PURE__ */ React.createElement("div", { className: "detail-en-name" }, detailEffect.enName))), /* @__PURE__ */ React.createElement("div", { className: "detail-category-row" }, /* @__PURE__ */ React.createElement("span", { className: "detail-category-tag" }, detailEffect.category), favorites.includes(detailEffect.id) && /* @__PURE__ */ React.createElement("span", { className: "detail-fav-tag" }, "\u5DF2\u6536\u85CF"), detailEffect.heavy && /* @__PURE__ */ React.createElement("span", { className: "detail-heavy-tag" }, "\u9AD8\u6027\u80FD\u6D88\u8017")), /* @__PURE__ */ React.createElement("div", { className: "detail-preview" }, (() => {
      const Comp = window[detailEffect.component];
      return Comp ? /* @__PURE__ */ React.createElement(Comp, { accentColor: t.accentColor, particleAmount: t.particleAmount, motionLevel: t.motionLevel }) : null;
    })()), /* @__PURE__ */ React.createElement("div", { className: "detail-body" }, /* @__PURE__ */ React.createElement("div", { className: "detail-section" }, /* @__PURE__ */ React.createElement("div", { className: "detail-section-label" }, "\u7B80\u4ECB"), /* @__PURE__ */ React.createElement("p", { className: "detail-desc" }, detailEffect.description)), /* @__PURE__ */ React.createElement("div", { className: "detail-section" }, /* @__PURE__ */ React.createElement("div", { className: "detail-section-label" }, "\u6280\u672F\u8981\u70B9"), /* @__PURE__ */ React.createElement("div", { className: "detail-tags" }, detailEffect.tags.map((tag, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "detail-tag" }, tag)))), /* @__PURE__ */ React.createElement("div", { className: "detail-section" }, /* @__PURE__ */ React.createElement("div", { className: "detail-section-label" }, "\u4EA4\u4E92\u8BF4\u660E"), /* @__PURE__ */ React.createElement("ul", { className: "detail-interactions" }, /* @__PURE__ */ React.createElement("li", null, "\u79FB\u52A8\u9F20\u6807 / \u89E6\u6478\u6ED1\u52A8\uFF0C\u89E6\u53D1\u5B9E\u65F6\u4EA4\u4E92\u53CD\u9988"), /* @__PURE__ */ React.createElement("li", null, "\u70B9\u51FB\u5361\u7247\u67E5\u770B\u8BE6\u60C5\uFF0CESC \u6216\u70B9\u51FB\u80CC\u666F\u5173\u95ED"), /* @__PURE__ */ React.createElement("li", null, "\u65B9\u5411\u952E \u2190 \u2192 \u5207\u6362\u76F8\u90BB\u52A8\u6548"), /* @__PURE__ */ React.createElement("li", null, "\u53F3\u4E0B\u89D2 \u2665 \u53EF\u52A0\u5165\u6536\u85CF")))), /* @__PURE__ */ React.createElement("div", { className: "detail-footer" }, /* @__PURE__ */ React.createElement("button", { className: "detail-footer-btn primary", onClick: () => {
      toggleFavorite(detailEffect.id);
    } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: favorites.includes(detailEffect.id) ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })), favorites.includes(detailEffect.id) ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF"), /* @__PURE__ */ React.createElement("button", { className: "detail-footer-btn", onClick: () => {
      var _a, _b;
      (_b = (_a = navigator.clipboard) == null ? void 0 : _a.writeText) == null ? void 0 : _b.call(_a, window.location.href.split("#")[0] + "#" + detailEffect.id);
      showToast("\u94FE\u63A5\u5DF2\u590D\u5236");
    } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })), "\u590D\u5236\u94FE\u63A5")), filtered.length > 1 && /* @__PURE__ */ React.createElement("div", { className: "detail-nav-hint" }, "\u2190 \u2192 \u5207\u6362 \xB7 ", filtered.findIndex((e) => e.id === detailEffect.id) + 1, " / ", filtered.length))), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `back-top ${showBackTop ? "show" : ""}`,
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        "aria-label": "\u56DE\u5230\u9876\u90E8",
        title: "\u56DE\u5230\u9876\u90E8"
      },
      /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "18 15 12 9 6 15" }))
    ), /* @__PURE__ */ React.createElement(
      "nav",
      {
        className: `section-nav-dots ${showNavDots ? "show" : ""}`,
        "aria-label": "\u7AE0\u8282\u5BFC\u822A"
      },
      [
        { id: "hero", label: "\u9996\u9875" },
        { id: "products", label: "\u4EA7\u54C1" },
        { id: "gallery", label: "\u52A8\u6548\u5E93" },
        { id: "wallpaper", label: "\u58C1\u7EB8" },
        { id: "tech", label: "\u6280\u672F\u6808" },
        { id: "about", label: "\u5173\u4E8E" }
      ].map((s, i) => {
        const isActive = activeSection === s.id;
        return /* @__PURE__ */ React.createElement(
          "button",
          {
            key: s.id,
            className: `section-nav-dot ${isActive ? "active" : ""}`,
            onClick: () => scrollTo("#" + s.id),
            "aria-label": `\u8DF3\u8F6C\u5230${s.label}`,
            "aria-current": isActive ? "true" : "false",
            style: { transitionDelay: `${i * 40}ms` }
          },
          /* @__PURE__ */ React.createElement("span", { className: "section-nav-dot-pill" }),
          /* @__PURE__ */ React.createElement("span", { className: "section-nav-dot-label" }, s.label)
        );
      })
    ));
  }
  function InitialLoader({ accentColor }) {
    const [progress, setProgress] = React.useState(0);
    const [visible, setVisible] = React.useState(true);
    React.useEffect(() => {
      let p = 0;
      let raf;
      const tick = () => {
        const speed = p < 70 ? 1.5 : p < 90 ? 0.6 : 0.2;
        p = Math.min(98, p + speed + Math.random() * 0.8);
        setProgress(p);
        if (p < 98) {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
      const onLoad = () => {
        cancelAnimationFrame(raf);
        setProgress(100);
        setTimeout(() => setVisible(false), 400);
      };
      if (document.readyState === "complete") {
        setTimeout(onLoad, 300);
      } else {
        window.addEventListener("load", onLoad);
      }
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("load", onLoad);
      };
    }, []);
    if (!visible)
      return null;
    return /* @__PURE__ */ React.createElement("div", { className: "initial-loader", style: { opacity: progress >= 100 ? 0 : 1, transition: "opacity 0.4s ease" } }, /* @__PURE__ */ React.createElement("div", { className: "initial-loader-inner" }, /* @__PURE__ */ React.createElement("div", { className: "initial-loader-logo" }, "M", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\u25C8"), "TIONS"), /* @__PURE__ */ React.createElement("div", { className: "initial-loader-bar" }, /* @__PURE__ */ React.createElement("div", { className: "initial-loader-fill", style: { width: `${progress}%`, background: `linear-gradient(90deg, ${accentColor}, #b14dff)` } })), /* @__PURE__ */ React.createElement("div", { className: "initial-loader-text" }, "\u6B63\u5728\u52A0\u8F7D ", Math.floor(progress), "%")));
  }
  function ScrollProgressBar({ accentColor }) {
    const barRef = React.useRef(null);
    React.useEffect(() => {
      const bar = barRef.current;
      if (!bar)
        return;
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollTop / docHeight : 0;
        bar.style.transform = `scaleX(${pct})`;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: barRef,
        className: "scroll-progress",
        "aria-hidden": "true"
      }
    );
  }
  const rootEl = document.getElementById("root");
  const root = ReactDOM.createRoot(rootEl);
  root.render(/* @__PURE__ */ React.createElement(SilentErrorBoundary, null, /* @__PURE__ */ React.createElement(App, null)));
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var loading = document.getElementById("loading");
      if (loading && loading.parentNode) {
        loading.classList.add("hidden");
        setTimeout(function() {
          if (loading.parentNode)
            loading.parentNode.removeChild(loading);
        }, 600);
      }
    });
  });
})();
