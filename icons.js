/* ============================================================
 * MOTION 图标大升级 · icons.js v1.0.0
 * 为每张动效卡片注入主题化 SVG 图标（按 effect id 关键词归类，
 *   覆盖全部 130 个动效，未命中则用 spark 默认图标）。
 * 零侵入 bundle：用 MutationObserver 在卡片渲染后注入 .card-icon。
 * 颜色随主题色相（hue）变化，让整片画廊更有生命力。
 * ============================================================ */
(function () {
  'use strict';

  // 线条风图标（24x24，stroke=currentColor），简洁、统一、可随色相着色
  var S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    spark: `<g ${S}><path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/></g>`,
    particles: `<g ${S}><circle cx="6" cy="7" r="1.6"/><circle cx="17" cy="6" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="8" cy="17" r="1.6"/><circle cx="18" cy="16" r="1.6"/><circle cx="14" cy="18.5" r="1.2"/></g>`,
    flame: `<g ${S}><path d="M12 3c1.5 3-1.5 4.5-1.5 7A3.5 3.5 0 0018 11c0-1.5-.7-2.7-1.3-3.5C18 9 19 11 19 13a7 7 0 11-14 0c0-3.5 3-5.5 4.5-7.5C10.8 4.3 11.4 3.6 12 3z"/></g>`,
    drop: `<g ${S}><path d="M12 3.5c3 3.5 5 6 5 9a5 5 0 11-10 0c0-3 2-5.5 5-9z"/><path d="M9.5 13.5a2.5 2.5 0 002.5 2.5" opacity=".6"/></g>`,
    wave: `<g ${S}><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></g>`,
    cube: `<g ${S}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v9m0 0l8-4.5M12 12L4 7.5M12 12v9"/></g>`,
    orbit: `<g ${S}><circle cx="12" cy="12" r="3.2"/><ellipse cx="12" cy="12" rx="9" ry="4.2"/><circle cx="21" cy="12" r="1.4" fill="currentColor" stroke="none"/></g>`,
    type: `<g ${S}><path d="M5 6v12M5 6h5M5 12h4M14 6v12M19 6l-3 4 3 4"/></g>`,
    bolt: `<g ${S}><path d="M13 2L5 13h6l-1 9 8-11h-6z"/></g>`,
    grid: `<g ${S}><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 10h16M4 15h16M10 4v16M15 4v16"/></g>`,
    helix: `<g ${S}><path d="M8 3c0 4 8 5 8 9s-8 5-8 9M16 3c0 4-8 5-8 9s8 5 8 9"/><path d="M9 7h6M9 17h6M8.5 12h7"/></g>`,
    clock: `<g ${S}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></g>`,
    tree: `<g ${S}><path d="M12 21V12M12 12l-4-4M12 12l4-4M12 8l-2.5-2.5M12 8l2.5-2.5"/></g>`,
    star: `<g ${S}><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/></g>`,
    vortex: `<g ${S}><path d="M12 12c0-2 2-4 4.5-4S20 10 20 12s-2 4-4.5 4S8 14 8 12"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></g>`,
    globe: `<g ${S}><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17"/></g>`,
    city: `<g ${S}><path d="M4 21V8l5-3v16M11 21V4l4 2v15M16 21v-7l4 2v5"/><path d="M6 10h1M6 13h1M6 16h1M13 8h1M13 11h1M13 14h1M18 13h1M18 16h1"/></g>`,
    snow: `<g ${S}><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><path d="M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2"/></g>`,
    burst: `<g ${S}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/><circle cx="12" cy="12" r="2.2"/></g>`,
    bubble: `<g ${S}><circle cx="12" cy="12" r="8"/><path d="M9 10.5a2.4 2.4 0 002.2 2.2" opacity=".7"/></g>`,
    smoke: `<g ${S}><path d="M8 20c0-3 3-3 3-6s-3-3-3-6M14 20c0-3 3-3 3-6s-3-3-3-6" opacity=".85"/><path d="M11 20c0-2 2-2 2-4" opacity=".5"/></g>`,
    ink: `<g ${S}><path d="M12 4c4 3 6 6 6 9a6 6 0 11-12 0c0-3 2-6 6-9z"/><path d="M9.5 14c1 1 2.5 1 3.5 0" opacity=".6"/></g>`,
    pixel: `<g ${S}><rect x="5" y="5" width="4" height="4"/><rect x="11" y="5" width="4" height="4"/><rect x="15" y="9" width="4" height="4"/><rect x="9" y="11" width="4" height="4"/><rect x="5" y="15" width="4" height="4"/><rect x="13" y="15" width="4" height="4"/></g>`,
    fold: `<g ${S}><path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/></g>`,
    gear: `<g ${S}><circle cx="12" cy="12" r="3.4"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9L18 18M18 6l-2.1 2.1M8.1 15.9L6 18"/></g>`,
    magnet: `<g ${S}><path d="M6 4v8a6 6 0 0012 0V4M6 8h4M14 8h4"/><path d="M6 4h4v4H6zM14 4h4v4h-4z" fill="currentColor" stroke="none" opacity=".25"/></g>`,
    neural: `<g ${S}><circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="M7.5 8.5l3.5 6M16.5 8.5l-3.5 6M7 7h10"/></g>`,
    ring: `<g ${S}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></g>`,
    lens: `<g ${S}><circle cx="12" cy="12" r="8"/><path d="M9 9a4 4 0 015.5 5.5" opacity=".7"/><circle cx="14.5" cy="9.5" r="1.2" fill="currentColor" stroke="none"/></g>`,
    sun: `<g ${S}><circle cx="12" cy="12" r="4.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/></g>`,
    kaleido: `<g ${S}><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17"/></g>`,
    scan: `<g ${S}><path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2"/><path d="M4 12h16" opacity=".7"/></g>`,
    circuit: `<g ${S}><path d="M5 5h5v5H5zM14 14h5v5h-5zM10 7h4v4M7 10v4h4M14 10h-4v4M17 7v-2M17 17v-3"/></g>`,
    heart: `<g ${S}><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0112 6a3.5 3.5 0 017 4.5C19 15.5 12 20 12 20z"/></g>`,
    ribbon: `<g ${S}><path d="M12 3c3 3-3 5-3 8s1 5 3 9c2-4 1-6 3-9s-6-5-3-8z"/><path d="M4 9c3 2 5 0 7 2M20 9c-3 2-5 0-7 2" opacity=".6"/></g>`,
    tunnel: `<g ${S}><path d="M12 3a9 9 0 019 9 9 9 0 01-18 0 9 9 0 019-9z" opacity=".5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2.2"/></g>`,
    pulse: `<g ${S}><path d="M3 12h4l2-6 4 12 2-6h6"/></g>`,
    meteor: `<g ${S}><path d="M5 5l9 9M14 5l-9 9"/><path d="M16 4l3 1-1 3-3-1z" fill="currentColor" stroke="none" opacity=".5"/><circle cx="6" cy="18" r="1.4" fill="currentColor" stroke="none"/></g>`,
    portal: `<g ${S}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5" opacity=".7"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></g>`,
    holo: `<g ${S}><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18" opacity=".7"/><path d="M6 8c4 0 4 8 0 8M18 8c-4 0-4 8 0 8" opacity=".6"/></g>`,
    aurora: `<g ${S}><path d="M3 16c3-6 6-6 9 0s6 6 9 0" opacity=".9"/><path d="M3 11c3-5 6-5 9 0s6 5 9 0" opacity=".55"/></g>`,
    bars: `<g ${S}><path d="M5 19V11M10 19V7M15 19V13M20 19V9"/></g>`,
    moire: `<g ${S}><path d="M3 12c3-5 6-5 9 0s6 5 9 0" opacity=".7"/><path d="M3 12c3 5 6 5 9 0s6-5 9 0" opacity=".7"/></g>`,
    lava: `<g ${S}><path d="M4 15c2-1 3 1 5 0s3-3 5-2 3 2 5 1M4 19c2-1 3 1 5 0s3-3 5-2 3 2 5 1" opacity=".8"/><circle cx="9" cy="9" r="1.6"/><circle cx="16" cy="7" r="1.6"/></g>`,
    sand: `<g ${S}><path d="M6 5h12l-2 5h-8zM12 10v9M9 19h6" opacity=".8"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="16" r="1"/></g>`,
    cloth: `<g ${S}><path d="M5 5c4 1 6-1 10 1s4 2 4 4-2 3-2 6 2 2 2 4M5 5v14"/></g>`,
    jelly: `<g ${S}><path d="M5 10c0-4 14-4 14 0v6c0 3-3 4-7 4s-7-1-7-4z" opacity=".9"/><path d="M8 13c1 2 7 2 8 0" opacity=".5"/></g>`,
    maze: `<g ${S}><path d="M5 5h14v14H5z"/><path d="M9 5v6h6M9 11v6M15 9h-2" opacity=".8"/></g>`,
    ball: `<g ${S}><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16M5.5 5.5c4 3 9 3 13 0M5.5 18.5c4-3 9-3 13 0" opacity=".6"/></g>`,
    spring: `<g ${S}><path d="M12 3c-3 1-3 3 0 4s3 3 0 4-3 3 0 4 3 3 0 4" opacity=".9"/><circle cx="12" cy="20" r="1.6"/></g>`,
    metal: `<g ${S}><path d="M4 14c2-5 14-5 16 0M6 14v3h12v-3" opacity=".85"/><path d="M8 17l1.5 3M16 17l-1.5 3" opacity=".6"/></g>`,
    iso: `<g ${S}><path d="M12 3l8 4.5-8 4.5-8-4.5z"/><path d="M4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" opacity=".6"/></g>`,
    plasma: `<g ${S}><path d="M12 4c2 3-2 4-1 7s4 2 3 5-3 2-3 4" opacity=".9"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></g>`,
    firefly: `<g ${S}><circle cx="9" cy="9" r="1.6" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none"/><path d="M9 9l3 4M16 13l-4 4" opacity=".4"/></g>`,
    weather: `<g ${S}><circle cx="9" cy="9" r="3"/><path d="M5 19h10a3 3 0 000-6 4 4 0 00-7.5-.5A3.5 3.5 0 005 19z"/><path d="M17 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="currentColor" stroke="none" opacity=".5"/></g>`,
    waterfall: `<g ${S}><path d="M6 3v15M10 3v15M14 3v15M18 3v15" opacity=".8"/><path d="M4 19h16" opacity=".5"/></g>`,
    rays: `<g ${S}><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" opacity=".7"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity=".4"/></g>`,
    startrail: `<g ${S}><path d="M12 12L4 8a8 8 0 018-5 8 8 0 018 5z" opacity=".8"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></g>`,
    gradient: `<g ${S}><rect x="4" y="4" width="16" height="16" rx="3" opacity=".4"/><path d="M4 14c4-6 12-6 16 0" opacity=".8"/></g>`,
    film: `<g ${S}><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 9h16M8 5v3M16 5v3M8 16v3M16 16v3" opacity=".6"/></g>`,
    metaball: `<g ${S}><circle cx="9" cy="12" r="4"/><circle cx="15" cy="12" r="4"/><path d="M11 9.5c1 1.5 1 3.5 0 5M13 9.5c-1 1.5-1 3.5 0 5" opacity=".5"/></g>`,
    origami: `<g ${S}><path d="M12 3l9 9-9 9z"/><path d="M12 3l-9 9 9 9M12 3v18" opacity=".6"/></g>`,
    candle: `<g ${S}><path d="M12 4c1 2-1 3-1 5a1.6 1.6 0 003 0c0-1.2-1-1.8-1-3z" fill="currentColor" stroke="none" opacity=".55"/><path d="M10 11h4v9H10zM12 20v1"/></g>`,
    cloud: `<g ${S}><path d="M7 18a4 4 0 010-8 5 5 0 019.5-1A3.5 3.5 0 0117 18z"/></g>`,
    yin: `<g ${S}><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 010 17c-4.7 0-8.5-3.8-8.5-8.5S7.3 3.5 12 3.5z" opacity=".7"/><circle cx="12" cy="7.8" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="16.2" r="1.4"/></g>`
  };

  // id 关键词 → 图标（顺序即优先级）
  var RULES = [
    [/flame|candle|fire/, 'flame'], [/lava|magma/, 'lava'],
    [/plasma/, 'plasma'], [/neon|glitch|rgb/, 'bolt'], [/bolt|lightning|spark/, 'bolt'],
    [/snow|sakura/, 'snow'], [/rain|ripple|drop|liquid|fluid|ink|smoke|wave|water/, 'drop'],
    [/bubble/, 'bubble'], [/vortex|wormhole|black[-_]?hole|portal|tunnel|tornado|stardust/, 'vortex'],
    [/orbit|planet|ring|star|nebula|galaxy|cosmic|warp|star[-_]?trail/, 'orbit'],
    [/earth|globe|city|isometric/, 'globe'], [/globe/, 'globe'],
    [/meteor|fireworks|burst|spark/, 'burst'], [/firefly|fireworks/, 'firefly'],
    [/particle|dust|boids|flock|cloud|network/, 'particles'], [/sand|cloth/, 'sand'],
    [/magnetic|em[-_]?field|field/, 'magnet'], [/gravity|attract/, 'magnet'],
    [/dna|helix/, 'helix'], [/neural|brain/, 'neural'],
    [/text|type|typo|letter/, 'type'], [/wave|waveform|audio|spectrum|pulse|ecg|beat/, 'wave'],
    [/3d|cube|sphere|diamond|pyramid|prism/, 'cube'], [/fractal|tree|growth|maze|fold|origami|paper/, 'tree'],
    [/grid|matrix|pixel|circuit/, 'grid'], [/circuit/, 'circuit'],
    [/clock|time|spring|pendulum/, 'clock'], [/gear|machine/, 'gear'],
    [/hologram|holo|scan|laser/, 'holo'], [/kaleido|moire|mirror|symmetr/, 'kaleido'],
    [/glass|lens|refract|metal|liquid[-_]?glass/, 'lens'], [/metaball|blob/, 'metaball'],
    [/aurora|glow|halo|breath|light|ray|church|immersive|volumetric/, 'aurora'],
    [/heart/, 'heart'], [/ribbon/, 'ribbon'], [/weather/, 'weather'],
    [/neural|neuron/, 'neural'], [/isometric|iso/, 'iso'], [/jelly|pudding/, 'jelly'],
    [/ball|ball/, 'ball'], [/waterfall/, 'waterfall'], [/film|grain/, 'film'],
    [/gradient|flow|color|mesh/, 'gradient'], [/silk|ribbon|flow/, 'ribbon'],
    [/yin|taiji/, 'yin'], [/cloud/, 'cloud'], [/sun|star/, 'star']
  ];

  // 主题色相：按大类别给每个图标一个 hue，整片画廊色彩流动
  var HUE = {
    flame: 18, lava: 24, plasma: 300, bolt: 48, spark: 200,
    drop: 195, bubble: 190, vortex: 270, orbit: 265, globe: 210, burst: 40,
    firefly: 145, particles: 200, sand: 38, magnet: 280, helix: 320, neural: 210,
    type: 330, wave: 185, cube: 220, tree: 140, grid: 205, circuit: 160, clock: 30,
    gear: 210, holo: 175, kaleido: 310, lens: 195, metaball: 190, aurora: 260,
    heart: 340, ribbon: 330, weather: 200, iso: 215, jelly: 320, ball: 200,
    waterfall: 195, film: 260, gradient: 280, cloud: 205, star: 250, yin: 0, spring: 150, metal: 200, smoke: 200, ink: 220, pixel: 200, fold: 30, maze: 30, fireflies: 145, rays: 45, startrail: 250, bars: 280, moire: 300, sand2: 38, cloth: 30, city: 210, snow: 195, pulse: 330, meteor: 30, portal: 275
  };

  function pickIcon(id) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(id)) return RULES[i][1];
    }
    return 'spark';
  }
  function hueFor(icon) {
    return (HUE[icon] !== undefined) ? HUE[icon] : 205;
  }

  function svgFor(icon, hue) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="color:hsl(' +
      hue + ' 90% 62%)">' + (ICONS[icon] || ICONS.spark) + '</svg>';
  }

  function inject(card) {
    if (!card || card.nodeType !== 1) return;
    if (card._iconDone) return;
    var id = card.getAttribute && card.getAttribute('data-id');
    if (!id) return;
    var header = card.querySelector('.card-header');
    if (!header) return;
    if (header.querySelector('.card-icon')) return;
    var icon = pickIcon(id);
    var hue = hueFor(icon);
    var el = document.createElement('div');
    el.className = 'card-icon';
    el.setAttribute('data-icon', icon);
    el.style.setProperty('--ic', hue);
    el.setAttribute('title', id);
    el.innerHTML = svgFor(icon, hue);
    // 作为头部首个元素前置（图标徽章）
    header.insertBefore(el, header.firstChild);
    card._iconDone = true;
  }

  function refresh(root) {
    var cards = (root || document).querySelectorAll('.effect-card');
    for (var i = 0; i < cards.length; i++) inject(cards[i]);
  }

  function boot() {
    refresh(document);
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var mu = muts[i];
          var t = mu.target;
          // React 重渲染会重建 header 子节点（清空我注入的图标），在 header 自身变动时补回
          if (t && t.nodeType === 1 && t.classList && t.classList.contains('card-header')) {
            if (t.parentElement) inject(t.parentElement);
            continue;
          }
          if (mu.type === 'attributes' && t && t.classList && t.classList.contains('effect-card')) { inject(t); continue; }
          var added = mu.addedNodes;
          for (var j = 0; j < added.length; j++) {
            var n = added[j];
            if (n.nodeType !== 1) continue;
            if (n.classList && n.classList.contains('effect-card')) inject(n);
            else if (n.querySelectorAll) refresh(n);
          }
        }
      });
      // inject() 内部以 header 是否已有 .card-icon 做幂等保护，重入不会重复插入、不会死循环
      mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-id', 'class'] });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.__icons = { pickIcon: pickIcon, hueFor: hueFor, ICONS: ICONS };
})();
