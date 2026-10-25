/* ============================================================
 * MOTION v1.0.2 Enhancement Script
 * 四类优化：性能 / 可访问性 / 体验细节 / 稳定性
 * 零侵入 bundle，原生 JS 实现，可随时删除回退
 * 加载时机：bundle 之后、首帧渲染完成后运行
 * ============================================================ */

(function () {
  'use strict';

  // ---- 工具函数 ----
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  // ============================================================
  // 一、首屏性能优化
  // ============================================================

  // 壁纸区域延迟激活：进入视口后再加 wp-active
  function deferHeavyComponents() {
    const wallpaperFrame = $('.wallpaper-frame');
    if (wallpaperFrame) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wp-active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '200px' });
      observer.observe(wallpaperFrame);
    }
  }

  // ============================================================
  // 二、可访问性增强
  // ============================================================

  function enhanceAccessibility() {
    // 2.1 补齐 aria-label
    addAriaLabels();

    // 2.2 动效卡片键盘可达：Enter 打开详情
    makeCardsKeyboardAccessible();

    // 2.3 弹窗焦点管理
    setupModalFocusTrap();

    // 2.4 确保搜索结果第一条可键盘导航
    setupSearchKeyboardNav();

    // 2.5 让卡片可键盘聚焦（补全 tabindex，使 2.2/2.4 真正生效）
    enhanceCardFocusability();
  }

  // 共享的 DOM 变更调度器：多个关注者复用同一个 MutationObserver，
  // 避免对 document.body 重复挂载多个 subtree 监听（虚拟列表高频渲染时的性能优化）。
  const domChangeHandlers = [];
  function onDomChange(handler) {
    domChangeHandlers.push(handler);
    ensureSharedObserver();
  }
  let sharedDomObserver = null;
  function ensureSharedObserver() {
    if (sharedDomObserver) return sharedDomObserver;
    sharedDomObserver = new MutationObserver((mutations) => {
      for (let i = 0; i < domChangeHandlers.length; i++) {
        try { domChangeHandlers[i](mutations); } catch (e) { /* 隔离单个 handler 异常，避免影响其他监听者 */ }
      }
    });
    sharedDomObserver.observe(document.body, { childList: true, subtree: true });
    return sharedDomObserver;
  }

  function enhanceCardFocusability() {
    // 给动效卡片补齐 tabindex/role/aria-label，使键盘 Tab + Enter 可操作
    const apply = (root) => {
      $$('.effect-card', root).forEach((card) => {
        if (card.hasAttribute('tabindex')) return;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        if (!card.getAttribute('aria-label')) {
          const title = card.querySelector('.card-title');
          if (title && title.textContent) {
            card.setAttribute('aria-label', '查看动效详情：' + title.textContent);
          }
        }
      });
    };
    apply(document);
    onDomChange((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.classList && n.classList.contains('effect-card')) apply(n);
          else if (n.querySelectorAll) apply(n);
        });
      });
    });
  }

  function addAriaLabels() {
    // 收藏按钮
    $$('.card-action-btn.fav').forEach(btn => {
      if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', '收藏');
      }
    });
    // 复制按钮
    $$('.card-action-btn.copy').forEach(btn => {
      if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', '复制代码');
      }
    });
    // 返回顶部
    const backTop = $('.back-to-top');
    if (backTop && !backTop.getAttribute('aria-label')) {
      backTop.setAttribute('aria-label', '返回顶部');
    }
    // 惊喜动效按钮
    // 寻找搜索栏附近带惊喜/随机图标的按钮（避免 :has 选择器以兼容旧浏览器）
    const searchBar = $('.search-bar');
    if (searchBar) {
      const btns = $$('button', searchBar);
      btns.forEach(btn => {
        if (btn.querySelector('polyline') && !btn.getAttribute('aria-label')) {
          btn.setAttribute('aria-label', '惊喜动效');
        }
      });
    }
    // 弹窗关闭按钮
    const closeBtn = $('.detail-close');
    if (closeBtn && !closeBtn.getAttribute('aria-label')) {
      closeBtn.setAttribute('aria-label', '关闭详情');
    }
    // 搜索框
    const searchInput = $('input[type="text"].search-input, .search-bar input');
    if (searchInput && !searchInput.getAttribute('aria-label')) {
      searchInput.setAttribute('aria-label', '搜索动效');
    }
    // 导航链接 role
    $$('.nav-link').forEach(link => {
      if (!link.getAttribute('role')) {
        link.setAttribute('role', 'link');
      }
    });
  }

  function makeCardsKeyboardAccessible() {
    // 给卡片容器加 tabindex，Enter 触发点击
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const card = e.target.closest('.effect-card');
      if (!card) return;
      // 如果焦点在按钮或链接上，不拦截
      if (e.target.closest('button, a, input, textarea, select')) return;
      // 模拟点击打开详情
      e.preventDefault();
      card.click();
    }, true);
  }

  function setupModalFocusTrap() {
    // 监听弹窗 DOM 变化，打开时把焦点移入（使用共享 observer，避免重复挂载）
    onDomChange((mutations) => {
      mutations.forEach(m => {
        if (m.type !== 'childList') return;
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          // 检测到详情弹窗
          if (node.classList && (node.classList.contains('detail-modal') ||
              node.querySelector('.detail-modal'))) {
            const modal = node.classList.contains('detail-modal')
              ? node
              : node.querySelector('.detail-modal');
            if (modal) {
              // 添加 aria-modal + role
              modal.setAttribute('aria-modal', 'true');
              modal.setAttribute('role', 'dialog');
              modal.setAttribute('aria-label', '动效详情');
              // 焦点移入
              setTimeout(() => {
                const closeBtn = modal.querySelector('.detail-close');
                if (closeBtn) closeBtn.focus();
                // 存当前焦点以便恢复
                modal._prevFocus = document.activeElement;
              }, 50);
            }
          }
        });
        m.removedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          const modal = node.classList && node.classList.contains('detail-modal')
            ? node
            : (node.querySelector ? node.querySelector('.detail-modal') : null);
          if (modal && modal._prevFocus && typeof modal._prevFocus.focus === 'function') {
            modal._prevFocus.focus();
          }
        });
      });
    });
  }

  function setupSearchKeyboardNav() {
    // 搜索时，按向下箭头聚焦第一个结果
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown') return;
      const input = e.target;
      if (!input.classList || !input.classList.contains('search-input')) return;
      if (!input.value) return;
      const firstCard = $('.effect-card');
      if (firstCard) {
        e.preventDefault();
        firstCard.focus();
      }
    });
  }

  // ============================================================
  // 三、体验细节增强
  // ============================================================

  function enhanceExperience() {
    // 3.1 搜索防抖 + 匹配词高亮
    setupDebouncedSearch();

    // 3.2 返回顶部平滑滚动增强
    setupBackToTop();
  }

  // 3.1 搜索防抖（零侵入：仅节流高频输入，不破坏 React 受控输入）
  function setupDebouncedSearch() {
    const searchInput = $('.search-input');
    if (!searchInput) return;

    // 防抖节流：高频输入时合并为一次更新，降低 React 重渲染频率。
    // 关键：中文 / 日文等输入法（IME）合成期间绝对不能拦截 input 事件，
    // 否则候选词提交会被破坏，导致搜索词异常。
    let debounceTimer = null;
    const DEBOUNCE_MS = 150;

    searchInput.addEventListener('input', (e) => {
      // 已是我们自己派发的合并事件，直接放行给 React
      if (e._debounced) return;
      // 输入法合成中：放行给 React 正常处理，保证中文搜索词正确
      if (e.isComposing || e.target.composing) return;

      // 非合成输入：拦截本次 React 更新，延迟合并派发（仅 stopPropagation，不 preventDefault）
      e.stopPropagation();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const event = new Event('input', { bubbles: true });
        event._debounced = true;
        searchInput.dispatchEvent(event);
      }, DEBOUNCE_MS);
    }, true);

    // 输入法结束时补发一次，确保最终确认的词被采用
    searchInput.addEventListener('compositionend', () => {
      clearTimeout(debounceTimer);
      const event = new Event('input', { bubbles: true });
      event._debounced = true;
      searchInput.dispatchEvent(event);
    });

    // Enter 立即触发
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(debounceTimer);
        const event = new Event('input', { bubbles: true });
        event._debounced = true;
        searchInput.dispatchEvent(event);
      }
    });
  }

  // 3.2 返回顶部
  function setupBackToTop() {
    // 已有返回顶部按钮，增强：到达顶部淡出 + 平滑滚动
    const backTop = $('.back-to-top');
    if (!backTop) return;

    // 到达顶部时淡出（由 IntersectionObserver 已控制显示/隐藏）
    // 增强点击时的平滑滚动
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 四、稳定性强化
  // ============================================================

  const errorStats = { errors: 0, warnings: 0 };
  let memoryMonitorTimer = null;
  let memoryHistory = [];
  let downgradeTriggered = false;

  function enhanceStability() {
    // 4.1 全局错误捕获计数
    setupErrorCounters();

    // 4.2 内存监控（performance.memory 可用时）
    setupMemoryMonitor();

    // 4.3 页面可见性切换时暂停非必要轮询
    setupVisibilityHandler();

    // 4.4 卡片级错误自动恢复
    setupCardAutoRecovery();
  }

  function setupErrorCounters() {
    // 仅通过全局错误事件计数，避免包裹 console.* 影响其他脚本并增加调用开销
    window.addEventListener('error', () => {
      errorStats.errors++;
    });
    window.addEventListener('unhandledrejection', () => {
      errorStats.errors++;
    });
  }

  function setupMemoryMonitor() {
    if (!performance.memory) return; // 仅 Chrome 支持
    // 单一监控：采样 + 增长分析 + 降级。visibility 恢复时 restart 同一个，避免重复 interval。
    const start = () => {
      if (memoryMonitorTimer) return;
      memoryMonitorTimer = setInterval(() => {
        const mem = performance.memory;
        const usedMB = Number((mem.usedJSHeapSize / 1048576).toFixed(1));
        memoryHistory.push(usedMB);
        if (memoryHistory.length > 20) memoryHistory.shift();
        // 持续增长检测：最近 10 次样本单调增长 > 30% 且总增长 > 40% → 触发降级
        if (memoryHistory.length >= 10 && !downgradeTriggered) {
          const recent = memoryHistory.slice(-10);
          let increasing = 0;
          for (let i = 1; i < recent.length; i++) if (recent[i] > recent[i - 1] * 1.02) increasing++;
          const totalGrowth = (recent[recent.length - 1] - recent[0]) / recent[0];
          if (increasing >= 8 && totalGrowth > 0.4) triggerDowngrade('memory_growth', usedMB);
        }
      }, 30000);
    };
    const stop = () => { if (memoryMonitorTimer) { clearInterval(memoryMonitorTimer); memoryMonitorTimer = null; } };
    start();
    // 供 visibility 恢复时复用
    window.__memoryMonitor = { start: start, stop: stop };
  }

  function triggerDowngrade(reason, value) {
    if (downgradeTriggered) return;
    downgradeTriggered = true;
    console.warn('[v1.0.2] 触发性能降级，原因:', reason, '当前堆:', value, 'MB');

    // 尝试调用 PerfMonitor 降级（如果存在）
    if (typeof PerfMonitor !== 'undefined' && PerfMonitor.setManualOverride) {
      const current = PerfMonitor.getCurrentTier ? PerfMonitor.getCurrentTier() : 'high';
      const nextTier = current === 'high' ? 'mid' : 'low';
      PerfMonitor.setManualOverride(nextTier);
      showPerfNotice(`检测到性能压力，已自动调整为${nextTier === 'mid' ? '均衡' : '节能'}模式`);
    }
  }

  function showPerfNotice(text) {
    let notice = $('.perf-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'perf-notice';
      document.body.appendChild(notice);
    }
    notice.textContent = text;
    notice.classList.add('show');
    setTimeout(() => notice.classList.remove('show'), 4000);
  }

  function setupVisibilityHandler() {
    // 健壮的待机 / 可见性恢复管理器
    //
    // 真实根因：动效是否运行，由激活调度器(E)根据「卡片是否进入视口」计算 active 决定；
    // useCanvasEffect 在 active=false 时根本不注册任务。而 E 只在 scroll / resize / perf 事件时
    // 才重算 active（i() -> requestAnimationFrame(R)）。页面隐藏时全局 rAF 停止、布局可能异常，
    // 恢复可见后若没有 scroll/resize 这类原生事件，active 会停滞为 false，
    // 于是所有动效永久停止（这正是「待机后不动」的严重问题）。
    //
    // 因此恢复时不能只重设尺寸，必须主动强制激活调度器重算 active：
    //   1) 派发 window 原生 'resize' + 'scroll' —— 触发 E.i() -> R() 重算所有卡片 active
    //   2) EventBus.emit('resize')                     —— 触发 useCanvasEffect 的 E() 重设 canvas 尺寸
    //   3) GlobalRAF 兜底                              —— 若循环已停但仍有任务，强制重启
    const forceRecover = () => {
      try { window.dispatchEvent(new Event('resize')); } catch (e) { /* noop */ }
      try { window.dispatchEvent(new Event('scroll')); } catch (e) { /* noop */ }
      try {
        if (window.EventBus && typeof window.EventBus.emit === 'function') {
          window.EventBus.emit('resize');
        }
      } catch (e) { /* noop */ }
      // 兜底：全局动画循环已停但仍有任务时，强制重启（register 内部会调用 g() 启动循环）
      try {
        const g = window.GlobalRAF;
        if (g && typeof g.isRunning === 'function' && typeof g.taskCount === 'function'
            && typeof g.register === 'function' && typeof g.unregister === 'function') {
          if (!g.isRunning() && g.taskCount() > 0) {
            const probe = '__standby_recover__';
            g.register(probe, function () {});
            g.unregister(probe);
          }
        }
      } catch (e) { /* noop */ }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 页面隐藏：暂停内存监控轮询（全局 rAF 由引擎自身在 visibilitychange 时自动停止，无需此处干预）
        if (window.__memoryMonitor) window.__memoryMonitor.stop();
      } else {
        // 页面恢复：重启同一个内存监控（保持增长分析能力）
        if (window.__memoryMonitor) window.__memoryMonitor.start();
        // 多次延迟恢复：覆盖 rAF 恢复、布局稳定、激活调度器节流标志重置等时序
        [0, 120, 350, 800, 1500, 3000].forEach((delay) => setTimeout(forceRecover, delay));
      }
    });

    // 首屏也强制激活一次（部分环境初始布局尚未稳定，动效可能未启动）
    if (typeof window !== 'undefined') {
      [300, 900].forEach((delay) => setTimeout(forceRecover, delay));
    }
  }

  function setupCardAutoRecovery() {
    // 监听卡片错误：当卡片渲染失败时（显示 placeholder/错误状态），自动重试一次（共享 observer）
    onDomChange((mutations) => {
      mutations.forEach(m => {
        if (m.type !== 'childList') return;
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          // 找到所有卡片
          const cards = node.classList && node.classList.contains('effect-card')
            ? [node]
            : (node.querySelectorAll ? $$('.effect-card', node) : []);
          cards.forEach(card => {
            // 如果卡片有错误状态（card-placeholder + 没有 canvas），自动重试
            const placeholder = $('.card-placeholder', card);
            const hasCanvas = $('canvas', card);
            if (placeholder && !hasCanvas && !card._retryAttempted) {
              card._retryAttempted = true;
              // 显示"正在恢复"提示
              const indicator = document.createElement('div');
              indicator.className = 'card-recovery-indicator';
              indicator.textContent = '自动恢复中…';
              card.appendChild(indicator);

              // 延迟 500ms 后触发重新加载（点击重载按钮）
              setTimeout(() => {
                const reloadBtn = $('.card-reload-btn', card) ||
                  $('button[title*="重载"]', card);
                if (reloadBtn) {
                  reloadBtn.click();
                }
                indicator.remove();
              }, 500);
            }
          });
        });
      });
    });
  }

  // ============================================================
  // 五、运行健壮性（离线 / 资源错误 / WebGL 降级）
  // ============================================================

  function enhanceResilience() {
    setupOfflineNotice();
    setupResourceErrorGuard();
    setupWebGLCheck();
    setupServiceWorker();
  }

  function setupServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (!/^https?:$/.test(location.protocol)) return; // file:// 协议下不注册
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        // 及时检查更新，避免调试/部署后停留在旧缓存
        if (reg && typeof reg.update === 'function') reg.update();
      }).catch(() => {
        /* 注册失败（路径/权限/不支持）不影响主流程 */
      });
    });
  }

  function setupOfflineNotice() {
    let el = null;
    const ensure = () => {
      if (el) return el;
      el = document.createElement('div');
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText =
        'position:fixed;left:50%;top:64px;transform:translateX(-50%) translateY(-16px);' +
        'z-index:9000;padding:8px 16px;border-radius:8px;font-size:12px;font-family:var(--font-body,system-ui);' +
        'background:rgba(10,13,24,.92);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);' +
        'color:#e8ecff;opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;';
      document.body.appendChild(el);
      return el;
    };
    const show = (online) => {
      const n = ensure();
      n.textContent = online ? '已恢复网络连接' : '网络连接已断开，部分内容可能无法加载';
      n.style.borderColor = online ? 'rgba(0,229,255,.4)' : 'rgba(255,170,0,.5)';
      n.style.transform = 'translateX(-50%) translateY(0)';
      n.style.opacity = '1';
      clearTimeout(n._t);
      if (online) n._t = setTimeout(() => {
        n.style.opacity = '0';
        n.style.transform = 'translateX(-50%) translateY(-16px)';
      }, 2500);
    };
    window.addEventListener('online', () => show(true));
    window.addEventListener('offline', () => show(false));
  }

  function setupResourceErrorGuard() {
    // 捕获阶段才能拿到 img/script/link 等资源加载错误（这些错误不冒泡）
    window.addEventListener('error', (e) => {
      const t = e.target;
      if (!t || !t.tagName) return;
      if (t.tagName === 'IMG' || t.tagName === 'SCRIPT' || t.tagName === 'LINK') {
        console.warn('[MOTION] 资源加载失败:', t.src || t.href);
      }
    }, true);
  }

  function setupWebGLCheck() {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) document.documentElement.classList.add('no-webgl');
    } catch (e) {
      document.documentElement.classList.add('no-webgl');
    }
  }

  // ============================================================
  // 启动序列
  // ============================================================

  function init() {
    // 阶段 1：立即执行——不阻塞渲染的轻量增强
    enhanceAccessibility();
    enhanceStability();
    enhanceResilience();

    // 阶段 2：首帧后执行——体验细节
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enhanceExperience();
        deferHeavyComponents();
        setupCardReveal();
      });
    });
  }

  // 检测 bundle 是否加载完成
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  }

  // 动效卡片滚动入场：仅对“视口外”卡片淡入，视口内直接显示；
  // JS 未运行时不会添加 will-reveal，卡片正常显示（安全降级）。
  function setupCardReveal() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { rootMargin: '60px 0px', threshold: 0.05 }) : null;
    var prep = function (card) {
      if (card._revealReady || reduce) return;
      card._revealReady = true;
      var r = card.getBoundingClientRect();
      var inView = r.top < (window.innerHeight + 80) && r.bottom > -80;
      if (inView) { card.classList.add('in-view'); return; }
      card.classList.add('will-reveal');
      if (io) io.observe(card); else card.classList.add('in-view');
    };
    $$('.effect-card').forEach(prep);
    onDomChange(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.classList && n.classList.contains('effect-card')) prep(n);
          else if (n.querySelectorAll) $$('.effect-card', n).forEach(prep);
        });
      });
    });
  }


  // 暴露共享 DOM 变更订阅（供 card-desc.js 等复用同一个 body MutationObserver，避免重复监听）
  window.__motionOnDomChange = onDomChange;

  // 暴露到 window 供调试
  window.__motionEnhancements = {
    version: '2.0',
    getStats: () => ({
      errors: errorStats.errors,
      warnings: errorStats.warnings,
      memory: performance.memory ? {
        usedMB: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
        totalMB: (performance.memory.totalJSHeapSize / 1048576).toFixed(1),
        limitMB: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(0)
      } : null,
      downgraded: downgradeTriggered
    })
  };
})();
