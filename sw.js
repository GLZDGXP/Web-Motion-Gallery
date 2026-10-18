/* MOTION 动效平台 Service Worker
 * 静态资源缓存策略：
 *  - 安装时预缓存核心外壳（HTML/CSS/JS/manifest）
 *  - 导航请求：network-first，失败回退缓存 HTML（保证内容最新、离线可用）
 *  - 同源静态资源（含 bundle.min.js）：stale-while-revalidate（缓存优先，后台静默更新）
 *  - 跨域（字体 / React CDN）：cache-first
 * 版本号随 app-version 同步，更新时自动清理旧缓存。
 */
const CACHE_VERSION = 'motion-v1.0.4';
const CORE_ASSETS = [
  './index.html',
  './enhancements.css',
  './bg-decor.css',
  './enhancements.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 导航请求：网络优先，失败回退缓存
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  const url = new URL(req.url);

  // 同源静态资源：stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
            return res;
          })
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
