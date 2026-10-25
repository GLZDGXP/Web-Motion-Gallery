# Deploy / 部署清单

纯静态站点，`index.html` 在仓库根。**不需要构建、不需要 Node 服务端**，克隆后按下面清单部署即可（不使用 GitHub Pages 也完全适用）。

## ✅ 需要部署的文件（最小集，缺一不可）

```
index.html            # 入口（引用下列所有资源）
bundle.min.js         # 全部动效 + app（生产产物）
new-effects.js        # 扩展动效 + 重写组件（须在 bundle 之后加载，已由 index.html 保证）
patches.js            # 覆盖 bundle 内问题组件
enhancements.js       # 增强层（可访问性/待机恢复/SW/极光氛围层/卡片描述注入）
enhancements.css      # 增强样式（卡片视觉/导航/reveal/hero 动效）
bg-decor.css          # 背景装饰
i18n.js               # 中英切换 + 去商业化
card-desc.js          # 每张卡片底部的中英双语描述
sw.js                 # Service Worker（离线外壳；部署后 HTTPS 才生效）
manifest.json         # PWA 清单
```

> 上面 11 个就是**完整可运行的站点**。把它们（保持相对路径同级）丢到任何静态托管即可。

## ❌ 不需要部署（本地/开发用，已在 .gitignore 忽略）

```
serve/                # 本地 Node 静态服务器（部署用不到，本地预览才用）
components/           # 组件源码（只有想改代码重新构建才需要）
tools/build.js        # esbuild 构建脚本（重新打包 bundle.min.js 用）
.github/              # CI（不使用 GitHub Pages 可删）
*.bak / *.log / node_modules / .DS_Store / Thumbs.db / .idea / .vscode / .spark
```

## 🚀 部署方式（任选其一，都不用 GitHub Pages）

**Vercel**（推荐，最快）
```bash
npm i -g vercel
vercel --prod        # 在项目根运行，按提示选 Framework: Other
```
或在 vercel.com 导入 Git 仓库（Framework 选 `Other`，Output 留空，根目录即站点根）。

**Netlify**
- 拖拽：app.netlify.com → Add new site → Deploy manually，把**含 index.html 的这 11 个文件所在文件夹**拖进去。
- 或 CLI：`npm i -g netlify-cli && netlify deploy --prod --dir .`

**自有服务器 / Nginx**
把 11 个文件放到 Nginx 站点根，关键配置（SW + 路由回退 + 缓存）：
```nginx
location / {
  try_files $uri $uri/ /index.html;      # 单页回退
}
location ~* \.(js|css|png|jpg|svg|woff2?)$ {
  expires 7d;                            # 静态资源缓存（文件名带 ?v=，更新即失效）
  add_header Cache-Control "public";
}
```

**对象存储（阿里云 OSS / 腾讯云 COS / S3）**
上传这 11 个文件到 Bucket 根，开启**静态网站托管**，索引文档设 `index.html`，错误文档也设 `index.html`。

## ⚠️ 注意
- **保持文件同级 + 相对路径**：index.html 用 `bundle.min.js?v=...` 这类相对引用，别把 JS 挪到子目录。
- **HTTPS**：Service Worker（sw.js 离线外壳）只在 HTTPS 或 localhost 生效；纯 HTTP 部署时站点照常运行，只是无离线缓存。
- **缓存**：所有资源都带 `?v=` 版本号，更新文件后改版本号即可让客户端拿到新版；SW 会自动清理旧版本缓存。
- **PWA 图标**：当前 manifest 无 icons（添加到主屏用默认图标）。想要自定义图标，放 `icon-512.png` 到根目录并在 `manifest.json` 加回 `icons` 字段。
