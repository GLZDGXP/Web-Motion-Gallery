# MOTION — Web Motion Gallery

> 120 handcrafted web animations · zero third-party dependencies · viewport-aware auto-pause & adaptive performance.
>
> 120 种手造 Web 动效 · 零第三方依赖 · 视口外自动休眠 · 分级性能自适应。

## About / 关于

A personal web motion gallery. Every effect is hand-written from scratch, spanning particle systems, physics, fluids, 3D transforms and visual illusion. Built with performance and accessibility in mind (virtual list, viewport-aware sleep, tiered performance, Reduced Motion).

一个个人 Web 动效陈列馆。每个动效从零手写，覆盖粒子、物理、流体、3D 变换与视觉错觉。注重性能与可访问性。

## Run / 运行

```bash
# Windows
serve\serve.bat

# or
node serve/server.js
```

Then open http://localhost:5174 (if 5173 is taken it auto-increments).

## Tech / 技术栈

- React 18 (CDN) + Canvas 2D + WebGL + CSS Transforms
- **Zero** third-party animation libraries
- Global frame scheduler (`GlobalRAF`), viewport-aware sleep, tiered performance (`PerfMonitor`)
- Bilingual: auto zh/en by browser language + manual toggle (localStorage)

## Structure / 结构

```
index.html            # 入口（加载屏 / meta / CDN / 版本号）
bundle.min.js         # 生产构建产物（全部组件 + app 预编译合并）
components/           # 源码（engine 基建 + 动效组件 + app）
enhancements.js       # 零侵入增强层（可访问性 / 待机恢复 / 内存降级 / SW）
enhancements.css      # 增强样式（卡片视觉 / reveal / 响应式）
new-effects.js        # 10 个扩展动效（独立于 bundle，挂 window）
patches.js            # 覆盖 bundle 内问题组件（Diamond3D / ProgressCounter / 颜色守卫）
i18n.js               # 中英自动切换 + 英文文案 + 去商业化/个人化
bg-decor.css          # 背景装饰（星点 / 网格 / 光晕 / 尘埃）
serve/server.js / serve/serve.bat # 本地静态服务器（端口自动递增，根目录指向项目根）
sw.js                 # Service Worker（离线外壳）
```

## Features / 特性

- 120 interactive, reproducible animations
- Virtual list + viewport-aware activation（视口外自动休眠）
- Smart performance scheduling（PerfMonitor 四档 + 焦点模式）
- Bilingual（自动 + 手动切换）
- Accessibility（keyboard / reduced-motion / aria）

## Build (optional) / 构建（可选）

源码在 `components/`，用 `tools/build.js`（esbuild）重新打包为 `bundle.min.js`。直接运行无需构建。

## License / 许可

MIT — see [LICENSE](./LICENSE).
