/* ============================================================
 * i18n.js — 中英语言自动切换 + 英文文案 + 去商业化/个人化（零侵入 bundle）
 *  - 自动：navigator.language 以 zh 开头→中文，否则→英文
 *  - 手动：右下角按钮切换（localStorage 记忆，切换后重载以干净还原）
 *  - 中文模式：应用 ZH_REWRITE（去商业化/公司→个人），其余保持中文原文
 *  - 英文模式：应用 EN（英化 + 个人化）
 *  - 动效名：直接用卡片 DOM 已有的英文名(.card-en)
 *  - 长 key 优先替换，避免短词误伤
 * ============================================================ */
(function () {
  'use strict';

  // 英文文案（含去商业化/个人化译法）
  var EN = {
    '首页': 'Home', '产品': 'Projects', '动效库': 'Gallery', '技术栈': 'Tech', '关于': 'About',
    '雕琢每一帧': 'Craft Every Frame', '为数字世界注入呼吸': 'Breathing Life into the Digital World',
    '种手造动效': 'handcrafted effects', '正式发布': 'Official Release',
    '探索产品': 'Explore Projects', '浏览动效库': 'Browse Gallery', '惊喜动效': 'Surprise Me',
    '随机跳转到一个动效': 'Jump to a random effect', '立即体验': 'Try it', '查看详情': 'View details',
    '一百二十种手工调校的可交互': '120 handcrafted interactive', '动效，': 'animations, ',
    '横跨粒子、': 'spanning particles, ', '、物理、光影、自然、视觉、材质七大维度。': 'physics, light, nature, visuals and materials.',
    '全局帧同步调度、视口感知休眠、分级性能自适应——': 'Unified frame sync, viewport-aware sleep, tiered adaptation — ',
    '让极致的视觉表达，与流畅的运行性能共存。': 'extreme visual expression coexists with smooth performance.',
    '动效分类': 'Categories', '风格分类': 'Styles', '手造动效': 'Handcrafted Effects',
    '玻璃材质': 'Glass', '三维空间': '3D Space', '物理模拟': 'Physics', '滚动叙事': 'Scroll',
    '故障艺术': 'Glitch', '体积光束': 'Volumetric Light', '星云宇宙': 'Nebula', '水墨质感': 'Ink', '数据矩阵': 'Data Matrix',
    '专业版': 'Advanced Tools', '高级版': 'Lab', '企业版': 'Lab',
    '产品线阵列': 'Works & Tools',
    '从核心引擎到可视化编辑器，为不同阶段的创作者与团队，提供专业的动效生产力工具。': 'From core engine to visual editor — animation tools I built for myself and fellow creators.',
    '动效陈列馆': 'Motion Gallery',
    '七十件精心打磨的动效作品，每一件皆可交互、可复现、可商用。': '70 meticulously crafted animations — each interactive, reproducible and open source.',
    '视口外自动休眠，让性能始终优雅。': 'Auto-sleep off-screen, keeping performance always elegant.',
    '搜索动效': 'Search effects', '搜索': 'Search', '名称': 'Name', '标签': 'Tags', '分类': 'Category',
    '清除搜索': 'Clear', '全部效果': 'All', '我的收藏': 'Favorites', '个动效': 'effects', '个结果': 'results', '关键词：': 'Keyword: ',
    '没有找到匹配的动效': 'No matching effects', '暂无结果，换个关键词试试？': 'No results — try another keyword?',
    '还没有收藏任何动效，点击卡片右下角开始收藏吧': 'No favorites yet — tap the heart on a card.',
    '这个分类下暂时没有动效': 'No effects in this category.', '查看全部': 'View all',
    '底层引擎': 'Under the Hood', '核心引擎': 'Core Engine',
    '高性能动效核心引擎，内置预设动效，一行代码调用，开箱即用。': 'A high-performance animation core with built-in presets — one line to use, out of the box.',
    '完全基于原生': 'Built entirely on native ', '标准构建，零第三方依赖，轻量、可控、可扩展。': 'web standards, zero third-party deps, lightweight, controllable, extensible.',
    '帧同步调度器': 'Frame Sync', '视口感知休眠': 'Viewport Sleep', '响应式精适配': 'Responsive', '无障碍优先': 'Accessibility First',
    '高品质预设动效': 'Quality presets', '流畅渲染': 'Smooth rendering', '零依赖纯原生实现': 'Zero-dependency native',
    '动效，是界面的呼吸': 'Animation is the breath of the interface',
    '以工匠精度雕琢每一帧。我们不堆砌特效，而是在视觉表达与工程性能之间寻找精确的最优解——全局帧同步、视口感知休眠、分级性能自适应，让每一次互动都轻盈流畅。': 'We craft every frame with artisan precision — not piling on effects, but finding the exact optimum between expression and performance: unified frame sync, viewport-aware sleep, tiered adaptation, so every interaction stays light and smooth.',
    '一百二十种手造动效，为下一代交互界面注入呼吸与生命。': '120 handcrafted animations, breathing life into next-gen interfaces.',
    '雕琢每一帧，让数字世界更有温度。': 'Craft every frame, make the digital world warmer.',
    '启程': 'Launch', '跃迁': 'Leap', '深耕': 'Deepen', '预备': 'Prepare', '焕新': 'Renew',
    '动效，核心引擎成型': 'Core engine takes shape', '款动效，虚拟列表': 'effects, virtual list', '性能调度上线': 'performance scheduler live',
    '错误边界体系': 'error boundaries', '全栈视觉升级': 'full visual upgrade', '质量体系完备，零依赖纯前端': 'complete quality system, zero-dep frontend',
    '资源': 'Resources', '文档中心': 'Docs', '文档': 'Docs', '参考': 'Reference', '示例项目': 'Samples',
    '公司': 'Personal', '关于我们': 'About Me', '加入团队': 'Contact', '联系方式': 'GitHub', '隐私政策': 'License',
    '邮箱': 'GitHub', '即将开放': 'WIP', '招聘信息即将上线': '', '文档中心即将上线': 'Docs (WIP)',
    '参考即将上线': 'Reference (WIP)', '示例项目即将上线': 'Samples (WIP)', '联系方式即将上线': 'See GitHub',
    '主题色彩': 'Theme', '主色调': 'Accent', '布局密度': 'Density', '动效参数': 'Settings', '粒子数量': 'Particles',
    '动效强度': 'Intensity', '减少动效': 'Reduce motion', '跟随系统': 'System', '性能档位': 'Performance', '自动': 'Auto',
    '动效详情': 'Details', '关闭详情': 'Close', '高性能消耗': 'High perf cost', '简介': 'Overview', '技术要点': 'Highlights', '交互说明': 'Interaction',
    '复制链接': 'Copy link', '链接已复制': 'Link copied', '回到顶部': 'Back to top', '正在加载': 'Loading',
    '收藏': 'Favorite', '分享': 'Share', '已复制': 'Copied', '取消收藏': 'Unfavorite', '已收藏': 'Favorited',
    '待机中': 'Standby', '滚入视口后加载': 'Loads on scroll into view', '重新加载': 'Reload', '组件加载异常': 'Component failed to load', '未知错误': 'Unknown error',
    '刷新页面': 'Refresh', '页面遇到了一点小问题': 'Something went wrong',
    '某个组件渲染失败导致整体中断。请刷新页面重试，或通过右下角反馈按钮告知我们。': 'A component failed to render and interrupted the page. Please refresh, or tell us via the feedback button.',
    '关闭菜单': 'Close menu', '打开菜单': 'Open menu', '开始使用': 'Get started',
    '最高画质': 'Ultra', '标准': 'Standard', '省电': 'Saver', '极简': 'Minimal',
    '性能指标': 'Performance', '渲染性能': 'Rendering', '内存效率': 'Memory', '代码覆盖率': 'Coverage', '环形数据': 'Ring Data', '时间线': 'Timeline'
  };
  // 中文模式专用：去商业化 / 公司改个人（中文→个人化中文）
  var ZH_REWRITE = {
    '专业版': '进阶工具', '高级版': '实验室', '企业版': '实验室',
    '产品线阵列': '作品与工具',
    '从核心引擎到可视化编辑器，为不同阶段的创作者与团队，提供专业的动效生产力工具。': '从核心引擎到可视化编辑器——我为自己与同好打造的动效生产力工具。',
    '可商用': '开源',
    '公司': '个人', '关于我们': '关于我', '加入团队': '联系我', '联系方式': 'GitHub', '联系方式即将上线': '见 GitHub',
    '邮箱': 'GitHub', '招聘信息即将上线': '', '隐私政策': '许可协议',
    '文档中心即将上线': '文档整理中', '参考即将上线': '参考整理中', '示例项目即将上线': '示例整理中'
  };

  var keys = Object.keys(EN).sort(function (a, b) { return b.length - a.length; });
  var keys2 = Object.keys(ZH_REWRITE).sort(function (a, b) { return b.length - a.length; });
  // 动效 description 英文化（中文→英文，长句优先）
  var DES = {
    '真实玻璃材质——折射、透光与模糊叠加，悬浮在深空背景上，折射边缘带出彩虹色散。': 'Real glass material — refraction, transmission and blur stacked, floating on a deep-space backdrop with iridescent dispersion at the edges.',
    '万千粒子构成形体，光标掠过如风吹烟尘，沿着运动方向飘散、重组，再重聚成形。': 'Myriad particles form a shape; as the cursor sweeps past they scatter like smoke in wind, drift and reassemble, then regroup.',
    '粒子在虚拟磁场中沿力线流淌，光标成为移动磁极，绘制出可见的引力场线与流线。': 'Particles flow along field lines in a virtual magnetic field; the cursor becomes a moving pole, drawing visible force and stream lines.',
    '字符拆分后各有独立的运动轨迹与节奏——拆解、流动、闪烁，编排成有生命力的文字表演。': 'Each split character follows its own trajectory and rhythm — dismantle, flow, flicker — a living typographic performance.',
    '赛博朋克霓虹光管，多层发光叠加制造真实灯管辉光与周期闪烁，点亮夜色。': 'Cyberpunk neon tube — layered glow fakes real tube bloom and periodic flicker, lighting up the night.',
    '多团色块像液体般缓慢对流与融合，边界不断重新塑形，永不重复的梦幻色彩旋涡。': 'Blobs of color convect and merge like liquid, boundaries constantly reshaping — a never-repeating dreamy swirl.',
    '光标轨迹上绽放的光粒子拖尾，如彗星划过夜空，尾迹层层叠叠、转瞬即逝。': 'A light-particle trail blooming along the cursor path, like a comet crossing the night sky — layered, fleeting.',
    '粒子间自动联结成网络，像神经元般彼此牵连，鼠标靠近时引力拉扯、连线颤动。': 'Particles auto-link into a network, entangled like neurons; the cursor pulls and trembles the connections.',
    '逐字敲击的终端质感，配合光标闪烁与随机停顿节奏，像有人真的在另一端打字。': 'Terminal feel of characters struck one by one, with cursor blink and random pauses — as if someone is truly typing.',
    '按钮如带磁力般吸附光标，距离越近拉力越强，微妙的触感让点击变得可感知。': 'The button magnetically attracts the cursor; the closer, the stronger the pull — a subtle tactility that makes clicks tangible.',
    '卡片跟随鼠标实时倾斜，透视感与表面高光随角度变化，营造触手可及的立体感。': 'The card tilts in real time with the mouse; perspective and surface highlight shift with angle for a tangible 3D feel.',
    '对称镜像分形出万花绽放的图案，每一次鼠标移动都是一次全新的纹样重塑。': 'Symmetric mirrored fractals bloom like a kaleidoscope; every mouse move reshapes an entirely new pattern.',
    '多层卡片错落叠放，鼠标移动时每层以不同速度位移，真实的纵深扑面而来。': 'Layered cards stack offset; each layer shifts at a different speed on mouse move — depth that rushes toward you.',
    '多层背景以不同速度滚动，纵深感随每一次滚动层层展开，叙事节奏由此而生。': 'Multiple background layers scroll at different speeds; depth unfolds with every scroll, setting the narrative pace.',
    '拖拽即可 360° 环视的全景空间，漂浮粒子与网格地面延展至地平线尽头的赛博空间。': 'A drag-to-look 360° panoramic space — floating particles and a grid floor stretching to the horizon in a cyber void.',
    '滚动进度条与数字计数动画组合，数据随视口进入生动浮现，让数字自己讲故事。': 'Scroll progress bar combined with number count-up; data comes alive as it enters the viewport, letting numbers tell the story.',
    '光束斜向划过黑暗空间，照亮悬浮微尘，鼠标触发聚光——丁达尔效应在指尖生成。': 'A light beam rakes across the dark, illuminating suspended dust; the mouse triggers a spotlight — Tyndall effect at your fingertips.',
    '赛博朋克故障美学——RGB 色差分层、扫描线横切、噪点随机喷发，周期性信号失真。': 'Cyberpunk glitch aesthetics — RGB channel split, scanline slices, random noise bursts, periodic signal distortion.',
    '音频波形与环形频谱双视图，平滑条形、峰值保持、圆形频谱同屏呈现，鼠标调节增益。': 'Audio waveform and ring spectrum in dual view — smooth bars, peak hold, circular spectrum, mouse adjusts gain.',
    '粒子从底部聚集凝形成通知卡片，点击后整体粒子化爆炸消散，循环往复、生生不息。': 'Particles gather from the bottom into a notification card, then explode apart on click — an endless cycle of form and dispersal.',
    '多层弥散光斑、丁达尔光柱、漂浮微尘构成的体积光场，鼠标移动驱动光的流向。': 'A volumetric light field of diffuse blobs, Tyndall shafts and floating dust; mouse movement drives the flow of light.',
    '赛博朋克全息流体网格——扫描线、数字雨粒子、流体变形与点阵网格扭曲三重效果融合，鼠标交互触发形变。': 'Cyberpunk holographic fluid grid — scanlines, digital-rain particles, fluid deformation and dot-matrix warp fused; mouse triggers morph.',
    '双面 3D 翻转卡片，hover 时沿 Y 轴 180° 翻折，背面展示镜像信息，透视与阴影全程跟随。': 'A dual-sided 3D flip card; hover folds 180° on the Y axis, the back showing mirrored info with perspective and shadow following.',
    '水面涟漪层层扩散，自动生成的随机涟漪与鼠标点击的大波叠加，SVG 波浪底部持续涌动。': 'Water ripples spread layer by layer — auto random ripples plus mouse-click waves, with SVG waves welling at the bottom.',
    '标准明亮式切割的 3D 钻石，多层切面折射出彩虹色散，光芒随视角流转，晶莹剔透。': 'A standard brilliant-cut 3D diamond; multi-facet refraction casts rainbow dispersion, light shifting with view — crystal clear.',
    '六边形能量护盾，脉冲光波沿表面扩散、电流游走，点击触发受击电弧与冲击波。': 'A hexagonal energy shield; pulse waves spread across the surface, currents roam; click triggers hit arcs and shockwaves.',
    '多层极光飘带在夜空中缓缓流动，色彩渐变交融，星尘粒子轻盈漂浮，静谧壮阔。': 'Aurora ribbons drift slowly in the night sky, colors blending; stardust particles float — serene and grand.',
    '多圈文字沿 3D 环形轨道环绕旋转，近大远小透视分明，自带辉光，拖拽改变视角。': 'Rings of text orbit along 3D circular tracks, near-large-far-small perspective, self-glowing; drag to change the view.',
    '中心黑洞吞噬一切，吸积盘粒子螺旋坠落，两极喷流激射，引力红移与光畸变呼之欲出。': 'A central black hole devours all; accretion-disk particles spiral down, jets erupt from the poles — gravitational redshift and light warp.',
    '彩色星云气体缓缓翻涌，星尘粒子轻舞漂移，明亮恒星绽放十字星芒，浩瀚浪漫。': 'Colorful nebula gas churns slowly, stardust drifts; bright stars bloom four-point glints — vast and romantic.',
    '铁磁流体表面随磁力源起伏出金属尖刺，快速划过撕裂飞溅，离开后缓慢平复。': 'Ferrofluid surface rises into metallic spikes at magnetic sources, tears and splashes when swept fast, slowly settling after.',
    '升腾的火焰粒子系统，内层金黄外层赤红，底部核心明亮，点击催生更多焰苗。': 'A rising flame particle system — golden core, crimson outer, bright base; click to spawn more flames.',
    '细密雨丝从天空坠落，在水面激起层层椭圆涟漪，鼠标点击溅起大水花。': 'Fine rain falls from the sky, raising elliptical ripples on water; mouse clicks splash big droplets.',
    '夜空烟花自动绽放，点击任意位置手动发射，多彩粒子球形爆开，拖尾余晖缓缓消散。': 'Night fireworks auto-bloom; click anywhere to launch manually, colorful particles bursting into spheres with trailing afterglow.',
    '绕极旋转的星轨长曝光效果，星辰划出优雅弧线，北极星在中心永恒闪耀。': 'A circumpolar star-trail long-exposure; stars trace elegant arcs, Polaris shining eternal at the center.',
    '两组线条叠加产生干涉条纹，鼠标改变偏移与角度，制造迷幻的波纹共振。': 'Two sets of lines overlay into interference fringes; mouse shifts offset and angle for hypnotic wave resonance.',
    '三层深度的雪花缓缓飘落，近大远小、随风飘逸，静谧的冬日氛围。': 'Three-depth snowflakes drift down, near-large-far-small, wafting in the wind — a quiet winter mood.',
    '医疗风格心电图波形，PQRST 复合波精准还原，实时心率与网格背景同屏呈现。': 'Medical-style ECG waveform; PQRST complex precisely reproduced, real-time heart rate over a grid background.',
    '玻璃瓶身 + 金属底座的写实熔岩灯，熔岩对流上升冷却下沉，可点击切换五色主题。': 'A realistic lava lamp — glass body + metal base, lava convecting up and cooling down; click to switch five color themes.',
    '旋转的虫洞吸积盘，粒子螺旋坠入事件视界，拖拽倾斜视角，靠近则吸入加速。': 'A rotating wormhole accretion disk; particles spiral into the event horizon; drag to tilt, closer means faster intake.',
    '递归分形树从零生长延伸，枝桠逐级分叉，周期性循环生长与凋零。': 'A recursive fractal tree grows from zero, branches forking level by level, cycling growth and withering.',
    '第一人称光速飞行穿越星野，星线拉长拖尾带速度感色偏，鼠标控制飞行方向。': 'First-person light-speed flight through starfields; star lines stretch with speed-tinted trails, mouse steers.',
    '立体频谱柱群随节奏律动起伏，摄像机环绕穿行，柱体发光投射倒影。': 'A 3D spectrum column cluster pulsing to the beat; the camera orbits and passes through, columns glowing with reflections.',
    '水底气泡缓缓上浮，折射高光与表面张力光泽清晰可见，点击可戳破飞溅。': 'Underwater bubbles slowly rise, refraction highlights and surface-tension sheen visible; click to pop and splash.',
    '多条丝绸般的流线粒子拖尾缓缓流动，鼠标划过带动丝带波动与涟漪。': 'Silky streamline particle trails flowing slowly; the mouse drags ripples and waves through the ribbons.',
    '水墨墨滴入水般缓缓扩散，分形纹理沿边缘蔓延，点击可滴落新墨。': 'An ink drop diffuses in water, fractal textures creeping along the edges; click to drop new ink.',
    '像素块矩阵在多种几何图案间变形过渡，鼠标扫过像素点亮并产生排斥。': 'A pixel-block matrix morphs between geometric patterns; the mouse lights up and repels pixels as it sweeps.',
    '经典数字雨字符坠落，绿色辉光 + 拖尾渐隐，鼠标靠近加速流动并点亮。': 'The classic digital-rain characters falling, green glow with fading trails; the mouse accelerates and lights up nearby.',
    '3D 纸片多段翻折展开，鼠标拖拽可自由旋转视角，阴影与纸张纹理细腻。': '3D paper multi-segment folding unfolds; drag to rotate freely, with fine shadow and paper texture.',
    '多层景观元素随鼠标 3D 视差位移，远近景层次分明，带景深模糊与暗角。': 'Multi-layer landscape elements shift in 3D parallax with the mouse; distinct near/far layers with depth blur and vignette.',
    '粒子帷幕从天空垂落，色彩渐变流动如极光翻涌，鼠标划动掀起光幕波动。': 'A particle curtain falls from the sky, colors gradients flowing like surging aurora; the mouse stirs waves in the light veil.',
    '数百小立方体构成 3D 方阵旋转漂移，鼠标拖拽旋转视角，碰撞弹跳。': 'Hundreds of small cubes form a rotating 3D array; drag to rotate, bouncing on collision.',
    '蜡烛烛火摇曳，火焰三层色阶 + 光晕 + 蜡泪，鼠标靠近火苗摆动。': 'A candle flame sways — three-tier flame color + glow + wax tears; the flame leans as the mouse nears.',
    '沙粒从顶部倾泻成瀑布，堆积成沙丘，鼠标可挖沙/扰动沙流。': 'Sand pours from the top into a waterfall, piling into dunes; the mouse can dig and disturb the flow.',
    '鼠标移动形成液体透镜效果，背景透过透镜折射扭曲放大，色散边缘。': 'Mouse movement forms a liquid-lens effect; the background refracts, distorts and magnifies through it, with dispersion edges.',
    '多齿轮咬合转动，转速联动传递，鼠标悬停加速旋转。': 'Multiple gears mesh and turn, speeds linked and transmitted; hover to accelerate.',
    '文字由粒子构成，鼠标划过文字粒子炸开四散后重新聚合。': 'Text made of particles bursts apart as the mouse sweeps through, then reassembles.',
    '成对粒子纠缠运动，一者受鼠标扰动另者同步反应，闪烁连线。': 'Entangled particle pairs move as one — one disturbed by the mouse, the other reacts in sync, linked by flickering lines.',
    '太阳 + 多行星公转轨道，行星自转与卫星，鼠标靠近引力扰动。': 'Sun + multiple planets on orbits, with rotation and moons; the mouse perturbs gravity when near.',
    '果冻布丁弹性晃动，点击戳一下晃动回弹，高光质感。': 'Jelly pudding jiggles elastically; click to poke and spring back, with highlight texture.',
    '实时生成迷宫并寻路演示，鼠标绘制障碍。': 'Real-time maze generation with pathfinding demo; the mouse draws obstacles.',
    '激光束在平面上雕刻图案线条，火花飞溅，鼠标操控自由雕刻。': 'A laser beam engraves patterns and lines on a surface, sparks flying; the mouse controls free drawing.',
    '彩色泡泡膨胀-破裂-飞溅，点击生成泡泡，鼠标悬停戳破。': 'Colorful bubbles expand, pop and splash; click to spawn, hover to pop.',
    '3D 楼宇群剪影，灯光窗户明灭，鼠标旋转视角。': 'A 3D skyline silhouette with twinkling lit windows; mouse rotates the view.',
    '多摆锤物理摆动，能量传递耦合，点击推动摆锤。': 'Multiple pendulums swing with coupled energy transfer; click to push them.',
    '星尘粒子螺旋旋涡吸入中心，鼠标扰动轨迹，中心发光。': 'Stardust particles spiral into a glowing vortex; the mouse disturbs the trails.',
    '晴/雨/雪/雷四种天气粒子场景切换，一键感受四季变化。': 'Four weather particle scenes — sunny/rain/snow/thunder; one click to feel the seasons.',
    '随节拍律动的彩色丝带波形，鼠标控制振幅与速度。': 'Colorful ribbon waveforms pulsing to the beat; the mouse controls amplitude and speed.',
    '像素块拼成心形跳动，鼠标扫过点亮，小心形漂浮上升。': 'A pixel-block heart beating; the mouse lights up pixels, small hearts float upward.',
    '3D 瀑布水流粒子倾泻，水花飞溅，雾化效果与水潭波纹。': '3D waterfall particles pouring down, splashing, with mist and pool ripples.',
    '旋转全息地球——经纬线网格、大气层辉光、城市灯光点，拖拽旋转视角，WebGL 加速。': 'A rotating holographic Earth — lat/long grid, atmospheric glow, city lights; drag to rotate, WebGL accelerated.',
    '第一人称穿越无限光隧道，环状光带不断向前流动，鼠标控制速度与视角偏移。': 'First-person flight through an infinite light tunnel; ring light-bands flow forward, mouse controls speed and view offset.',
    '旋臂星系粒子旋转，中心核球明亮，旋臂缠绕演化，点击扰动旋臂形态。': 'A spiral-arm galaxy rotating, bright central bulge, arms winding and evolving; click to disturb the arms.',
    '樱花花瓣随风飘落旋转，风场扰动轻盈摇曳，点击扬起漫天花瓣。': 'Cherry petals fall and spin in the wind, swaying lightly; click to swirl a storm of blossoms.',
    '粒子绕轴螺旋上升成龙卷风，底部旋涡明亮，鼠标移动控制风眼位置。': 'Particles spiral up around an axis into a tornado, bright vortex at the base; the mouse moves the eye.',
    '大量弹性小球物理碰撞弹跳，重力与摩擦力模拟，点击注入新球。': 'Many elastic balls collide and bounce with gravity and friction; click to inject new balls.',
    '多道体积光柱阵列穿过空间，尘埃粒子在光柱中漂浮，鼠标移动光柱偏移。': 'Arrays of volumetric light shafts crossing the space, dust floating within; the mouse shifts the shafts.',
    '穿越行星星环飞行，环带粒子环绕流动，色散渐变辉光，鼠标控制视角。': 'Flight through a planet ring — ring particles flow with dispersion-gradient glow; mouse controls the view.',
    '文字在 3D 波浪曲面上起伏，RGB 通道色散分离辉光，鼠标改变波频。': 'Text undulates on a 3D wave surface, RGB channels dispersing with glow; mouse changes wave frequency.',
    '蛛网从中心向外螺旋生长，节点连接成网，鼠标点击处生长新网。': 'A spider web spirals out from the center, nodes linking into a net; click to grow a new web.',
    '3D 双螺旋结构——主链粒子 + 碱基对横档，A-T/G-C 四色配对，鼠标拖拽旋转视角。': 'A 3D double helix — backbone particles + base-pair rungs, A-T/G-C four-color pairing; drag to rotate.',
    'Verlet 积分布料模拟——弹簧约束 + 风力 + 重力，鼠标推开布料、点击释放冲击波。': 'Verlet-integration cloth — spring constraints + wind + gravity; the mouse pushes the cloth, click releases a shockwave.',
    '万千粒子聚合成文字、停留、再爆炸四散，循环切换多个词语，鼠标靠近粒子被推开。': 'Myriad particles gather into text, hold, then explode apart — cycling through words; the mouse repels particles.',
    '多道体积光柱丁达尔阵列——尘埃粒子漂浮在光柱中，光束随风摆动，鼠标控制倾斜。': 'Arrays of volumetric Tyndall shafts — dust floating within, beams swaying in the wind; mouse controls tilt.',
    '多层山峦剪影立体视差——星空/月亮/远山/近山/雾霭，空气透视营造纵深感，昼夜色渐变。': 'Multi-layer mountain silhouettes in 3D parallax — stars/moon/far hills/near hills/mist, aerial perspective, day-night gradient.',
    'WebGL 烟雾流体跟随光标移动——彩色烟团扩散升腾，速度越快喷射越猛，加性混合流光。': 'WebGL smoke fluid following the cursor — colored smoke diffusing and rising, faster means fiercer jets, additive-blend glow.',
    '模拟音频频谱柱状图——节拍律动、峰值回落、底部倒影、渐变辉光，鼠标控制频段增益。': 'Simulated audio spectrum bars — beat pulse, peak fall, bottom reflection, gradient glow; mouse controls band gain.',
    'LED 点阵像素时钟——数字变化时旧像素上升消散、新像素从下方浮入，赛博电子辉光。': 'An LED dot-matrix pixel clock — old pixels rise and dissipate as digits change, new ones float in from below, cyber glow.',
    '电路板线路从中心向外 90° 生长蔓延——节点焊盘辉光、分支延伸、鼠标吸引线路方向。': 'Circuit traces grow from the center at 90° — node pads glowing, branches extending; the mouse attracts trace direction.',
    '六重对称万花筒——旋转几何体+色彩脉冲，三角/菱形/六边/星形多层叠加，鼠标改变旋转方向。': 'A six-fold kaleidoscope — rotating geometry + color pulses, triangle/diamond/hexagon/star layers; mouse reverses rotation.',
    '多层辉光文字配合横向扫描光带穿过——色散分离、粒子飞溅、扫过瞬间色彩斑斓，常驻动态且层次丰富。': 'Multi-layer glowing text with a horizontal scan band sweeping through — dispersion, particle splash, colorful on sweep; always-on and layered.',
    '字符依次 3D 弹性入场——渐变厚度、辉光、落地粒子飞溅、循环重放，视觉冲击力强。': 'Characters enter one by one in 3D spring — gradient thickness, glow, landing particle splash, looping replay; strong visual impact.',
    '粒子在鼠标引力/斥力场中运动，悬停斥力推开粒子，按下拖拽生成引力漩涡，粒子螺旋卷入。': 'Particles move in the mouse gravity/repulsion field; hover repels, press-drag spawns a gravity vortex that spirals them in.',
    '少量正弦波线条交叠流动，极简线条美学，鼠标横向改变波长、纵向改变振幅，流畅且克制。': 'A few sine-wave lines overlapping and flowing — minimalist aesthetics; mouse changes wavelength horizontally, amplitude vertically; smooth and restrained.',
    '星星围绕中心做圆弧轨迹拖尾旋转，像长曝光星轨摄影，鼠标拖动改变旋转中心位置。': 'Stars trace arc-trail rotations around a center, like long-exposure star-trail photography; drag to move the rotation center.',
    '柔和渐变色块缓慢流动混合，screen 混合模式叠出梦幻色彩，鼠标移动吸引色块流向。': 'Soft gradient blobs slowly flow and mix, screen-blend into dreamy color; the mouse attracts the flow.',
    '动态噪点颗粒轻微闪烁漂移，复古胶片质感，偶发划痕点缀，鼠标掠过颗粒加强密度。': 'Dynamic noise grains flicker and drift, retro film texture, occasional scratches; the mouse densifies grains as it passes.',
    '多层光晕缓慢呼吸缩放+透明度脉动，纯 CSS 动画 GPU 加速，鼠标位置即生成新光晕并消散。': 'Multi-layer halos slowly breathe in scale and opacity, pure CSS GPU-accelerated; the mouse position spawns new halos that dissipate.',
    '字符逐个从两侧滑入+弹性落位+发光，循环播放多组文字，鼠标悬停立即触发下一组。': 'Characters slide in from both sides, spring into place and glow, looping through phrases; hover triggers the next immediately.',
    '聚光灯锥光在画面上来回扫描，照亮区域字符粒子浮现，鼠标移动即控制聚光位置与范围。': 'A spotlight cone scans back and forth across the canvas, revealing character particles in the lit area; the mouse moves the spot.',
    '磁流体状粘稠粒子团在鼠标扰动下碰撞变形、拖拽分裂，高光流动感与 metaball 粘稠融合效果。': 'Viscous ferrofluid-like particle clumps collide and deform under the mouse, split on drag, with flowing highlights and metaball fusion.',
    '双色对旋漩涡如科幻传送门，粒子螺旋吸入中心，鼠标移动改变漩涡位置与强度，按下增强吸力。': 'A two-color counter-rotating vortex like a sci-fi portal; particles spiral into the center, mouse moves and press strengthens suction.',
    '经典矩阵数字字符雨，片假名+数字+字母下落拖尾、亮度渐变，鼠标掠过加速坠落，头部白色高亮。': 'The classic matrix character rain — katakana+digits+letters falling with trails and brightness gradient; the mouse accelerates the fall, white head highlight.',
    '3D 折面从中心逐面展开成六边形几何体，鼠标 X 控制展开进度，Y 控制倾斜视角，折痕高光清晰。': '3D folds unfold face by face from the center into a hexahedron; mouse X controls unfold progress, Y controls tilt; crisp crease highlights.',
    '半透明线框球体被扫描线逐层扫过，截面发光，全息投影质感，CRT 噪点与 RGB 色散。': 'A translucent wireframe sphere swept layer by layer by scanlines, cross-sections glowing, holographic projection, CRT noise and RGB dispersion.',
    '磁场流线从 N/S 两极发出，受鼠标位置偏转弯曲，发光流线效果，场强点阵背景。': 'Field lines emit from N/S poles, bending with the mouse position, glowing streamlines over a field-strength dot background.',
    '圆形图案碎成像素方块爆炸飞散+重力反弹，再聚拢重组循环，鼠标点击立即引爆。': 'A circular pattern shatters into pixel blocks that explode and bounce under gravity, then reassemble in a loop; click to detonate.',
    '背景被透镜状玻璃折射扭曲，光斑色散，鼠标拖动透镜，边缘高光与内反射。': 'The background is refracted and distorted through a lens-shaped glass, light-spot dispersion; drag the lens, edge highlights and inner reflections.',
    '行星环绕粒子带，土星环风格，颗粒沿轨道疏密分布、明暗闪烁，鼠标拖拽倾斜视角。': 'A planet surrounding particle band, Saturn-ring style, particles distributed along the orbit with varying density and shimmer; drag to tilt.',
    '同心圆环按 120 BPM 节拍脉冲扩散+呼吸，透明度呼吸，鼠标点击生成新脉冲环。': 'Concentric rings pulse and breathe at 120 BPM; click to spawn new pulse rings.',
    '熔融金属光泽流体表面流动变形，高光随流动游走，鼠标拖拽撕裂与融合。': 'Molten-metal glossy fluid flowing and deforming, highlights roaming with the flow; drag to tear and fuse.',
    '低多边形建筑从地面逐栋生长、灯光逐窗亮起，昼夜交替，鼠标移动改变日照角度。': 'Low-poly buildings grow from the ground one by one, windows lighting up, day-night alternates; mouse changes the sun angle.',
    '神经元节点放电闪烁，脉冲沿连接线传播扩散形成级联反应，鼠标悬停节点增强放电。': 'Neuron nodes fire and flicker, pulses propagate along connections into cascades; hover a node to boost its discharge.',
    '粒子如流沙被鼠标拖拽塑形、堆积成丘，松手后在重力下缓慢流散恢复。': 'Particles like flowing sand are shaped and piled by mouse drag, slowly dispersing under gravity on release.',
    '墨滴落入水中晕开成丝缕墨纹，多层墨滴交叠晕染，鼠标轻点生成新墨滴。': 'An ink drop blooms into silky ink-veils in water, multi-layer drops overlapping; click to add new drops.',
    '画面 RGB 三通道错位 + 水平切片随机抖动，故障爆发后自动复原，赛博朋克质感。': 'The image RGB channels misalign + horizontal slices jitter randomly, glitching out then auto-recovering — cyberpunk texture.',
    '窗帘状极光流体质感多层飘动、交叠明暗起伏，垂向光带与波纹褶皱。': 'Curtain-like aurora fluid layered and swaying, overlapping light and shade, vertical bands and ripple folds.',
    '一串弹簧质点首尾相连构成多节摆，重力 + 弹簧约束物理模拟，鼠标牵引链端。': 'A chain of spring-mass points forms a multi-segment pendulum, gravity + spring-constraint physics; the mouse drags the chain end.',
    '表盘刻度沿涡流旋转扭曲，时分秒针化为流光残影，真实时间与科幻漩涡融合。': 'Clock dial marks twist along a vortex, hands becoming flowing-light afterimages — real time fused with a sci-fi swirl.',
    '大体积尘埃粒子云缓慢自转、明暗起伏呼吸，体积云团感与暗云遮罩，鼠标扰动云团。': 'A large dust particle cloud slowly rotating and breathing in brightness, volumetric cloud feel with dark occluders; the mouse stirs the cloud.'
  };
  var keys3 = Object.keys(DES).sort(function (a, b) { return b.length - a.length; });
  window.__descEN = DES; // 供 card-desc.js 英文模式翻译描述
  var ZH = /[\u4e00-\u9fff]/;

  function detectLang() {
    try { var s = localStorage.getItem('motion-lang'); if (s === 'zh' || s === 'en') return s; } catch (e) {}
    var n = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return n.indexOf('zh') === 0 ? 'zh' : 'en';
  }
  var lang = detectLang();

  function replaceText(text) {
    if (!text || !ZH.test(text)) return text;
    var i, k;
    if (lang === 'en') {
      // 先用 DES 整句替换动效 description，再用 EN 短词替换 UI。
      // 顺序很关键：若先 EN，desc 里的中文子串(如“玻璃材质”)会被提前替换，
      // 导致整句再也匹配不上 DES → desc 变中英混合。
      for (i = 0; i < keys3.length; i++) { k = keys3[i]; if (text.indexOf(k) >= 0) text = text.split(k).join(DES[k]); }
      for (i = 0; i < keys.length; i++) { k = keys[i]; if (text.indexOf(k) >= 0) text = text.split(k).join(EN[k]); }
      text = text.replace(/^\s*[\u4e00-\u9fff]+\s*\/\s*/, ''); // 动效分类 "材质 / Material" → "Material"
    } else {
      for (i = 0; i < keys2.length; i++) { k = keys2[i]; if (text.indexOf(k) >= 0) text = text.split(k).join(ZH_REWRITE[k]); }
    }
    return text;
  }
  function applyTo(root) {
    if (!root) return;
    if (root.nodeType === 3) { var v = replaceText(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; return; }
    if (root.nodeType !== 1) return;
    var nodes = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return (n.nodeValue && ZH.test(n.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; }
    });
    while (w.nextNode()) nodes.push(w.currentNode);
    for (var i = 0; i < nodes.length; i++) { var nv = replaceText(nodes[i].nodeValue); if (nv !== nodes[i].nodeValue) nodes[i].nodeValue = nv; }
    var cards = (root.classList && root.classList.contains('effect-card')) ? [root] : root.querySelectorAll('.effect-card');
    for (var j = 0; j < cards.length; j++) {
      var en = cards[j].querySelector('.card-en'), ti = cards[j].querySelector('.card-title');
      if (lang === 'en' && en && ti && en.textContent.trim()) ti.textContent = en.textContent.trim();
    }
    if (root.querySelectorAll) {
      var els = root.querySelectorAll('[aria-label]');
      for (var a = 0; a < els.length; a++) { var al = els[a].getAttribute('aria-label'); if (al && ZH.test(al)) els[a].setAttribute('aria-label', replaceText(al)); }
    }
  }
  function apply() {
    if (lang === 'en') {
      document.documentElement.lang = 'en';
      document.title = 'MOTION · Web Motion Museum';
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', 'MOTION — 120 handcrafted web animations. Interactive, copyable, open source. Auto-pause off-screen, smart performance scheduling.');
    }
    var si = document.querySelector('.search-input'); if (si && si.placeholder && ZH.test(si.placeholder)) si.placeholder = replaceText(si.placeholder);
    applyTo(document.body);
  }
  function mountButton(cur) {
    var btn = document.createElement('button');
    btn.className = 'lang-toggle';
    btn.textContent = cur === 'en' ? '中文' : 'EN';
    var lbl = cur === 'en' ? '切换到中文' : 'Switch to English';
    btn.setAttribute('aria-label', lbl); btn.title = lbl;
    btn.style.cssText = 'position:fixed;right:20px;bottom:76px;z-index:9998;height:36px;min-width:46px;padding:0 12px;' +
      'border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(10,13,24,.72);backdrop-filter:blur(8px);' +
      'color:#e8ecff;font-family:var(--font-mono,monospace);font-size:12px;letter-spacing:.5px;cursor:pointer;transition:all .25s;';
    btn.addEventListener('mouseenter', function () { btn.style.borderColor = 'rgba(0,229,255,.5)'; btn.style.color = '#fff'; });
    btn.addEventListener('mouseleave', function () { btn.style.borderColor = 'rgba(255,255,255,.14)'; btn.style.color = '#e8ecff'; });
    btn.addEventListener('click', function () {
      try { localStorage.setItem('motion-lang', cur === 'en' ? 'zh' : 'en'); } catch (e) {}
      location.reload();
    });
    document.body.appendChild(btn);
  }
  function init() {
    mountButton(lang);
    var run = function () { apply(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    if ('MutationObserver' in window) {
      var t = null;
      var mo = new MutationObserver(function (muts) {
        if (t) return; t = setTimeout(function () {
          t = null;
          for (var i = 0; i < muts.length; i++) { var an = muts[i].addedNodes; for (var k = 0; k < an.length; k++) if (an[k].nodeType === 1) applyTo(an[k]); }
        }, 250);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }
  init();
})();
