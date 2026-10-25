# MOTION — Web Motion Gallery

> 130 handcrafted web animations · zero third-party dependencies · viewport-aware auto-pause & adaptive performance.
>
> 130 种手写 Web 动效 · 零第三方依赖 · 视口外自动休眠 · 分级性能自适应 · 中英双语。

一个个人 Web 动效陈列馆。每个动效从零手写，覆盖粒子、物理、流体、3D 变换与视觉错觉。注重性能与可访问性（虚拟列表、视口外休眠、分级性能、Reduced Motion）。

## Run / 运行

```bash
# Windows
serve\serve.bat

# or
node serve/server.js        # 端口自动递增（5173 被占则跳 5174…）
```

然后打开 http://localhost:5174 （若 5173 被其它程序占用会自动递增）。

## Deploy / 部署

纯静态站点，`index.html` 在仓库根，可直接部署到任意静态托管。

**GitHub Pages（自动）**：仓库 `Settings → Pages → Build and deployment → Source` 选 **GitHub Actions**。本仓库已内置 `.github/workflows/pages.yml`，`push` 到 `main` 即自动部署，几分钟后访问 `https://<用户名>.github.io/<仓库名>/`。

**GitHub Pages（手动）**：`Settings → Pages → Source` 选 **Deploy from a branch** → Branch `main`、文件夹 `/(root)`。

**Vercel / Netlify**：Import 该仓库（Framework 选 `Other`），或把项目文件夹直接拖进 Netlify，零配置。

> PWA：`sw.js` + `manifest.json` 提供离线外壳（HTTPS 下生效）。如需自定义安装图标，放一张 `icon-512.png` 到根目录并在 `manifest.json` 的 `icons` 里引用。

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
new-effects.js        # 扩展动效 + 重写组件（独立于 bundle，挂 window；须在 bundle 之后加载）
patches.js            # 覆盖 bundle 内问题组件（Diamond3D / ProgressCounter / 颜色守卫）
enhancements.js       # 零侵入增强层（可访问性 / 待机恢复 / 内存降级 / SW / 卡片描述注入）
enhancements.css      # 增强样式（卡片视觉 / reveal / 响应式）
card-desc.js          # 每张卡片底部的中英双语描述（按 data-id 注入）
i18n.js               # 中英自动切换 + 英文文案 + 去商业化/个人化
bg-decor.css          # 背景装饰（星点 / 网格 / 光晕 / 尘埃）
sw.js                 # Service Worker（离线外壳）
manifest.json         # PWA 清单
serve/server.js       # 本地静态服务器（端口自动递增，根目录指向项目根）
serve/serve.bat       # Windows 一键启动
tools/build.js        # 可选：用 esbuild 从 components/ 重新打包 bundle.min.js
.github/workflows/    # GitHub Pages 自动部署
.gitignore / LICENSE / package.json / README.md
```

## Features / 特性

- 130 interactive animations（含粒子 / 物理 / 流体 / 3D / 视觉错觉）
- Virtual list + viewport-aware activation（视口外自动休眠）
- Smart performance scheduling（PerfMonitor 分级 + 焦点模式 + 待机恢复）
- Bilingual（自动 + 手动切换，卡片描述同步双语）
- Accessibility（keyboard / reduced-motion / aria）

## Build (optional) / 构建（可选）

源码在 `components/`，用 `tools/build.js`（esbuild）重新打包为 `bundle.min.js`。直接运行无需构建（`bundle.min.js` 为提交产物）。

## License / 许可

MIT — see [LICENSE](./LICENSE).
