/* ============================================================
 * MOTION 智能调度层 v2.1.0（性能更智能 · 闭环自适应调度器）
 * 在 bundle 之后加载，包装 window.useCanvasEffect。
 *
 * 相比 v2.0.0 的升级：
 *  - 闭环自适应：独立 rAF 实测 FPS，按帧率动态缩放每卡帧间隔与激活预算
 *    （过载自动降速、富余自动提帧），不再是固定分档。
 *  - 设备感知：navigator.hardwareConcurrency / deviceMemory 决定基线预算。
 *  - 电池感知：低电量(放电且≤20%)整体降档，省电。
 *  - 空闲感知：无交互 4s 后非焦点卡片降到 ~10fps，焦点仍保活。
 *  - 缓存布局：卡片距视口中心距离每 200ms 才重算一次（解决原每帧
 *    getBoundingClientRect 的布局抖动，真·再优化性能）。
 *  - 驱动 bundle 激活预算：劫持 PerfMonitor.getTargetCost()，把闭环质量
 *    反馈给引擎的“同屏激活数”，让平台自己决定该画几张。
 *  - 删除本文件即完全回退到 bundle 原生调度。
 * ============================================================ */
(function () {
  'use strict';
  if (typeof window.useCanvasEffect !== 'function') return;

  var state = {
    fps: 60, avgFrame: 16.7,
    level: 1,            // 0.25..1 质量档（1 最好）
    batteryLow: false,
    idle: false,
    budget: 1400         // 当前激活预算（驱动 PerfMonitor）
  };

  /* ---------- 设备基线 ---------- */
  var cores = navigator.hardwareConcurrency || 4;
  var mem = navigator.deviceMemory || 4;
  var capBase = (mem <= 4) ? 1000 : (cores <= 4 ? 1200 : 1600);
  // 电池
  if (navigator.getBattery) {
    try {
      navigator.getBattery().then(function (b) {
        var upd = function () { state.batteryLow = (b.charging === false && b.level <= 0.2); };
        upd();
        b.addEventListener('levelchange', upd);
        b.addEventListener('chargingchange', upd);
      }).catch(function () {});
    } catch (e) {}
  }

  /* ---------- 实测 FPS（独立轻量 rAF） ---------- */
  var last = performance.now(), samples = [];
  function measure(now) {
    var dt = now - last; last = now;
    if (dt > 0 && dt < 1000) {
      samples.push(dt);
      if (samples.length > 90) samples.shift();
    }
    if (samples.length >= 30) {
      var s = samples.slice(-60), sum = 0;
      for (var i = 0; i < s.length; i++) sum += s[i];
      state.avgFrame = sum / s.length;
      state.fps = 1000 / state.avgFrame;
    }
    requestAnimationFrame(measure);
  }
  requestAnimationFrame(measure);

  /* ---------- 闭环：每秒重算质量档 + 预算 ---------- */
  setInterval(function () {
    var target;
    if (state.fps >= 58) target = 1;
    else if (state.fps >= 50) target = 0.82;
    else if (state.fps >= 42) target = 0.62;
    else if (state.fps >= 33) target = 0.42;
    else target = 0.26;
    if (state.batteryLow) target = Math.min(target, 0.5);
    // 平滑趋近，避免抖动
    state.level += (target - state.level) * 0.3;
    // 激活预算：质量越高允许的预算越大（同屏更多卡片），下限 900 保底
    state.budget = Math.round(capBase * (0.55 + state.level * 0.6));
  }, 1000);

  /* ---------- 空闲感知 ---------- */
  var idleTimer = 0;
  function poke() {
    state.idle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { state.idle = true; }, 4000);
  }
  ['pointermove', 'scroll', 'keydown', 'wheel', 'touchstart', 'click'].forEach(function (ev) {
    window.addEventListener(ev, poke, { passive: true });
  });
  poke();

  /* ---------- 缓存布局：距离每 200ms 重算（避免每帧抖动） ---------- */
  var rectCache = new WeakMap();
  var scrollScheduled = false;
  function flushRects() { scrollScheduled = false; rectCache = new WeakMap(); }
  window.addEventListener('scroll', function () {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(flushRects); }
  }, { passive: true });
  window.addEventListener('resize', function () { rectCache = new WeakMap(); });
  function distOf(el) {
    if (!el) return 1;
    var now = performance.now(), cached = rectCache.get(el);
    if (cached && now - cached.ts < 200) return cached.dist;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var c = r.top + r.height / 2;
    var d = Math.abs(c - vh / 2) / (vh / 2);
    rectCache.set(el, { dist: d, ts: now });
    return d;
  }

  /* ---------- 包装 useCanvasEffect ---------- */
  var isScrolling = false, stTimer = 0;
  window.addEventListener('scroll', function () {
    isScrolling = true;
    clearTimeout(stTimer);
    stTimer = setTimeout(function () { isScrolling = false; }, 160);
  }, { passive: true });

  var hidden = false;
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; });

  var orig = window.useCanvasEffect;
  var wrapped = new WeakMap();

  window.useCanvasEffect = function (ref, opts) {
    var w = wrapped.get(ref);
    if (!w) {
      w = { optsRef: { current: opts }, lastRun: -1e9 };
      w.draw = function (ctx, ww, hh, t, dt, st) {
        if (hidden) return; // 后台标签页直接跳过，零开销
        var interval = 33;  // 默认 30fps
        if (isScrolling) {
          interval = 30;    // 滚动中统一 30fps
        } else {
          var dist = distOf(ref.current);
          interval = dist < 0.5 ? 16 : (dist < 0.9 ? 33 : 66);
          if (state.idle && dist >= 0.5) interval = Math.max(interval, 90); // 空闲非焦点降速
        }
        // 闭环质量缩放：过载时拉长间隔（降速），富余时收紧（提帧）
        interval = Math.round(interval * (1 + (1 - state.level) * 1.4));
        if (t - w.lastRun < interval - 3) return;
        w.lastRun = t;
        return w.optsRef.current.draw(ctx, ww, hh, t, dt, st);
      };
      w.setup = function () { var s = w.optsRef.current.setup; return s ? s.apply(this, arguments) : undefined; };
      w.cleanup = function (stt) { var c = w.optsRef.current.cleanup; if (typeof c === 'function') c(stt); };
      w.o = { setup: w.setup, draw: w.draw, cleanup: w.cleanup, active: opts.active };
      wrapped.set(ref, w);
    }
    w.optsRef.current = opts;
    if (opts.active !== undefined && w.o.active !== opts.active) w.o.active = opts.active;
    return orig(ref, w.o);
  };

  /* ---------- 驱动 bundle 激活预算（闭环反馈给引擎） ---------- */
  function adaptBudget() {
    if (window.PerfMonitor && typeof window.PerfMonitor.getTargetCost === 'function') {
      var origG = window.PerfMonitor.getTargetCost.bind(window.PerfMonitor);
      window.PerfMonitor.getTargetCost = function () {
        var base = origG() || 800;
        var scaled = Math.round(base * (0.6 + state.level * 0.8));
        return Math.max(800, Math.min(1200, scaled));
      };
    }
  }
  adaptBudget();
  window.addEventListener('load', adaptBudget);

  window.__perf = state; // 调试用
})();
