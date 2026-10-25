/* MOTION Service Worker — 缓存系统 v1.2.0
 * 设计：预缓存清单由 index.html 动态提取（src/href 里的同源 .js/.css/.json），
 *      无需手动维护版本号，资源 ?v= 更新后自动同步，彻底避免清单脱节。
 *  - install：抓取 index.html → 提取同源静态资源 → 预缓存(cache:reload 取最新) → skipWaiting
 *  - activate：删除旧 CACHE_VERSION 缓存 + 清理陈旧 ?v= 资源（被新版本取代的旧条目，防膨胀）
 *  - navigate：network-first（保证拿到最新 HTML 引用），离线回退 index.html
 *  - 同源静态资源：stale-while-revalidate（即时返回缓存，后台静默更新）
 *  - 跨域（字体 / React CDN）：cache-first
 *  - message：SKIP_WAITING 可手动立即激活新 SW
 */
const CACHE_VERSION = 'motion-v1.2.0';
const ASSET_RE = /(?:src|href)="([^"]*\.(?:js|css|json|webmanifest)[^"]*)"/g;

function extractSameOrigin(html) {
  const urls = new Set();
  let m;
  ASSET_RE.lastIndex = 0;
  while ((m = ASSET_RE.exec(html))) {
    try {
      const u = new URL(m[1], self.location.origin);
      if (u.origin === self.location.origin) urls.add(u.pathname + u.search);
    } catch (e) { /* ignore */ }
  }
  return urls;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    try {
      const idxRes = await fetch('./index.html', { cache: 'reload' });
      await cache.put('./index.html', idxRes.clone());
      const html = await idxRes.text();
      const urls = extractSameOrigin(html);
      await Promise.all([...urls].map(async (u) => {
        try { const r = await fetch(u, { cache: 'reload' }); if (r.ok) await cache.put(u, r); } catch (e) { /* ignore */ }
      }));
    } catch (e) { /* 离线或抓取失败：跳过预缓存，靠运行时 SWR 兜底 */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    const cache = await caches.open(CACHE_VERSION);
    let current = new Set();
    try {
      const idxRes = await fetch('./index.html', { cache: 'reload' });
      current = extractSameOrigin(await idxRes.text());
    } catch (e) {
      try { const r = await cache.match('./index.html'); if (r) current = extractSameOrigin(await r.text()); } catch (e2) { /* ignore */ }
    }
    const reqs = await cache.keys();
    await Promise.all(reqs.map(async (req) => {
      try {
        const u = new URL(req.url);
        // 清理陈旧 ?v= 资源：同源、带版本查询、但已不在当前 index.html 引用里的旧条目
        if (u.origin === self.location.origin && u.search.indexOf('v=') >= 0 && !current.has(u.pathname + u.search)) {
          await cache.delete(req);
        }
      } catch (e) { /* ignore */ }
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 导航请求：网络优先（拿到最新 HTML 及其资源引用），离线回退缓存
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  const url = new URL(req.url);

  // 同源静态资源：stale-while-revalidate（缓存优先即时返回，后台静默更新）
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); return res; })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 跨域（字体 / React CDN）：缓存优先
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && (res.type === 'basic' || res.type === 'cors' || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
