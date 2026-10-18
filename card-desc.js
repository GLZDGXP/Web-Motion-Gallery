/* 卡片描述注入：把每个动效的 description 显示在卡片底部（列表直接可见）。
 * 数据源自 bundle effects（id -> description），共 130 条，中英双语文案。
 * 中文模式显示中文；英文模式显示英文（中文动效经 i18n DES 预翻译，英文动效用原文）。
 * 虚拟列表复用/动态渲染的卡片由 MutationObserver 兜底（childList + data-id 属性）。
 * 未运行时不插入任何节点，不影响原有展示（安全降级）。 */
(function () {
  var CARD_DESC = {
    "voronoi-cells": { "zh": "动态 Voronoi 镶嵌，漂移的种子不断划分出有生命的细胞。", "en": "Dynamic Voronoi tessellation with drifting seeds forming living cells." },
    "boids-flock": { "zh": "经典鸟群聚集模拟，分离、对齐与聚合三法则驱动。", "en": "Classic flocking simulation with separation, alignment and cohesion." },
    "reaction-diffusion": { "zh": "Gray-Scott 反应扩散方程，生成有机生长的图灵斑图。", "en": "Gray-Scott reaction-diffusion producing organic Turing patterns." },
    "harmonograph": { "zh": "衰减谐振摆绘制精细的李萨如曲线。", "en": "Decaying harmonic pendulum drawing intricate Lissajous figures." },
    "strange-attractor": { "zh": "洛伦兹吸引子，将三维相空间投影为流动轨迹。", "en": "Lorenz attractor projected from 3D phase space into motion." },
    "flow-field": { "zh": "旋度噪声矢量场，引导成千上万粒子缓缓漂流。", "en": "Curl-noise vector field guiding thousands of drifting particles." },
    "chladni-plate": { "zh": "沙粒跃向驻波的节线，克拉德尼板的振动之舞。", "en": "Sand particles dancing toward nodal lines of standing waves." },
    "lsystem-tree": { "zh": "递归分形之树，如微风拂过枝头般轻摇。", "en": "Recursive fractal tree swaying gently like wind through branches." },
    "game-of-life": { "zh": "康威生命游戏，渲染成不断变迁的彩色菌落。", "en": "Conway life game rendered as an ever-shifting colored colony." },
    "hilbert-curve": { "zh": "空间填充的希尔伯特曲线，由行进的光点描绘。", "en": "Space-filling Hilbert curve traced by a travelling glow point." },
    "liquid-glass": { "zh": "真实玻璃材质——折射、透光与模糊叠加，悬浮在深空背景上，折射边缘带出彩虹色散。", "en": "Real glass material — refraction, transmission and blur stacked, floating on a deep-space backdrop with iridescent dispersion at the edges." },
    "particle-dissolve": { "zh": "万千粒子构成形体，光标掠过如风吹烟尘，沿着运动方向飘散、重组，再重聚成形。", "en": "Myriad particles form a shape; as the cursor sweeps past they scatter like smoke in wind, drift and reassemble, then regroup." },
    "magnetic-field": { "zh": "粒子在虚拟磁场中沿力线流淌，光标成为移动磁极，绘制出可见的引力场线与流线。", "en": "Particles flow along field lines in a virtual magnetic field; the cursor becomes a moving pole, drawing visible force and stream lines." },
    "text-reveal": { "zh": "字符拆分后各有独立的运动轨迹与节奏——拆解、流动、闪烁，编排成有生命力的文字表演。", "en": "Each split character follows its own trajectory and rhythm — dismantle, flow, flicker — a living typographic performance." },
    "neon-glow": { "zh": "赛博朋克霓虹光管，多层发光叠加制造真实灯管辉光与周期闪烁，点亮夜色。", "en": "Cyberpunk neon tube — layered glow fakes real tube bloom and periodic flicker, lighting up the night." },
    "fluid-gradient": { "zh": "多团色块像液体般缓慢对流与融合，边界不断重新塑形，永不重复的梦幻色彩旋涡。", "en": "Blobs of color convect and merge like liquid, boundaries constantly reshaping — a never-repeating dreamy swirl." },
    "mouse-trail": { "zh": "光标轨迹上绽放的光粒子拖尾，如彗星划过夜空，尾迹层层叠叠、转瞬即逝。", "en": "A light-particle trail blooming along the cursor path, like a comet crossing the night sky — layered, fleeting." },
    "particle-network": { "zh": "粒子间自动联结成网络，像神经元般彼此牵连，鼠标靠近时引力拉扯、连线颤动。", "en": "Particles auto-link into a network, entangled like neurons; the cursor pulls and trembles the connections." },
    "typewriter": { "zh": "逐字敲击的终端质感，配合光标闪烁与随机停顿节奏，像有人真的在另一端打字。", "en": "Terminal feel of characters struck one by one, with cursor blink and random pauses — as if someone is truly typing." },
    "magnetic-button": { "zh": "按钮如带磁力般吸附光标，距离越近拉力越强，微妙的触感让点击变得可感知。", "en": "The button magnetically attracts the cursor; the closer, the stronger the pull — a subtle tactility that makes clicks tangible." },
    "tilt-3d": { "zh": "卡片跟随鼠标实时倾斜，透视感与表面高光随角度变化，营造触手可及的立体感。", "en": "The card tilts in real time with the mouse; perspective and surface highlight shift with angle for a tangible 3D feel." },
    "kaleidoscope": { "zh": "对称镜像分形出万花绽放的图案，每一次鼠标移动都是一次全新的纹样重塑。", "en": "Symmetric mirrored fractals bloom like a kaleidoscope; every mouse move reshapes an entirely new pattern." },
    "parallax-cards": { "zh": "多层卡片错落叠放，鼠标移动时每层以不同速度位移，真实的纵深扑面而来。", "en": "Layered cards stack offset; each layer shifts at a different speed on mouse move — depth that rushes toward you." },
    "scroll-parallax": { "zh": "多层背景以不同速度滚动，纵深感随每一次滚动层层展开，叙事节奏由此而生。", "en": "Multiple background layers scroll at different speeds; depth unfolds with every scroll, setting the narrative pace." },
    "panorama-3d": { "zh": "拖拽即可 360° 环视的全景空间，漂浮粒子与网格地面延展至地平线尽头的赛博空间。", "en": "A drag-to-look 360° panoramic space — floating particles and a grid floor stretching to the horizon in a cyber void." },
    "progress-counter": { "zh": "滚动进度条与数字计数动画组合，数据随视口进入生动浮现，让数字自己讲故事。", "en": "Scroll progress bar combined with number count-up; data comes alive as it enters the viewport, letting numbers tell the story." },
    "light-sweep": { "zh": "光束斜向划过黑暗空间，照亮悬浮微尘，鼠标触发聚光——丁达尔效应在指尖生成。", "en": "A light beam rakes across the dark, illuminating suspended dust; the mouse triggers a spotlight — Tyndall effect at your fingertips." },
    "glitch-text": { "zh": "赛博朋克故障美学——RGB 色差分层、扫描线横切、噪点随机喷发，周期性信号失真。", "en": "Cyberpunk glitch aesthetics — RGB channel split, scanline slices, random noise bursts, periodic signal distortion." },
    "waveform": { "zh": "音频波形与环形频谱双视图，平滑条形、峰值保持、圆形频谱同屏呈现，鼠标调节增益。", "en": "Audio waveform and ring spectrum in dual view — smooth bars, peak hold, circular spectrum, mouse adjusts gain." },
    "harmony-notification": { "zh": "粒子从底部聚集凝形成通知卡片，点击后整体粒子化爆炸消散，循环往复、生生不息。", "en": "Particles gather from the bottom into a notification card, then explode apart on click — an endless cycle of form and dispersal." },
    "immersive-light": { "zh": "多层弥散光斑、丁达尔光柱、漂浮微尘构成的体积光场，鼠标移动驱动光的流向。", "en": "A volumetric light field of diffuse blobs, Tyndall shafts and floating dust; mouse movement drives the flow of light." },
    "hologram": { "zh": "赛博朋克全息流体网格——扫描线、数字雨粒子、流体变形与点阵网格扭曲三重效果融合，鼠标交互触发形变。", "en": "Cyberpunk holographic fluid grid — scanlines, digital-rain particles, fluid deformation and dot-matrix warp fused; mouse triggers morph." },
    "flip-3d": { "zh": "双面 3D 翻转卡片，hover 时沿 Y 轴 180° 翻折，背面展示镜像信息，透视与阴影全程跟随。", "en": "A dual-sided 3D flip card; hover folds 180° on the Y axis, the back showing mirrored info with perspective and shadow following." },
    "liquid-ripple": { "zh": "水面涟漪层层扩散，自动生成的随机涟漪与鼠标点击的大波叠加，SVG 波浪底部持续涌动。", "en": "Water ripples spread layer by layer — auto random ripples plus mouse-click waves, with SVG waves welling at the bottom." },
    "diamond-3d": { "zh": "标准明亮式切割的 3D 钻石，多层切面折射出彩虹色散，光芒随视角流转，晶莹剔透。", "en": "A standard brilliant-cut 3D diamond; multi-facet refraction casts rainbow dispersion, light shifting with view — crystal clear." },
    "energy-shield": { "zh": "六边形能量护盾，脉冲光波沿表面扩散、电流游走，点击触发受击电弧与冲击波。", "en": "A hexagonal energy shield; pulse waves spread across the surface, currents roam; click triggers hit arcs and shockwaves." },
    "aurora-curtain": { "zh": "多层极光飘带在夜空中缓缓流动，色彩渐变交融，星尘粒子轻盈漂浮，静谧壮阔。", "en": "Aurora ribbons drift slowly in the night sky, colors blending; stardust particles float — serene and grand." },
    "text-ring-3d": { "zh": "多圈文字沿 3D 环形轨道环绕旋转，近大远小透视分明，自带辉光，拖拽改变视角。", "en": "Rings of text orbit along 3D circular tracks, near-large-far-small perspective, self-glowing; drag to change the view." },
    "black-hole": { "zh": "中心黑洞吞噬一切，吸积盘粒子螺旋坠落，两极喷流激射，引力红移与光畸变呼之欲出。", "en": "A central black hole devours all; accretion-disk particles spiral down, jets erupt from the poles — gravitational redshift and light warp." },
    "nebula-stardust": { "zh": "彩色星云气体缓缓翻涌，星尘粒子轻舞漂移，明亮恒星绽放十字星芒，浩瀚浪漫。", "en": "Colorful nebula gas churns slowly, stardust drifts; bright stars bloom four-point glints — vast and romantic." },
    "ferrofluid": { "zh": "铁磁流体表面随磁力源起伏出金属尖刺，快速划过撕裂飞溅，离开后缓慢平复。", "en": "Ferrofluid surface rises into metallic spikes at magnetic sources, tears and splashes when swept fast, slowly settling after." },
    "fire-flame": { "zh": "升腾的火焰粒子系统，内层金黄外层赤红，底部核心明亮，点击催生更多焰苗。", "en": "A rising flame particle system — golden core, crimson outer, bright base; click to spawn more flames." },
    "rain-ripple": { "zh": "细密雨丝从天空坠落，在水面激起层层椭圆涟漪，鼠标点击溅起大水花。", "en": "Fine rain falls from the sky, raising elliptical ripples on water; mouse clicks splash big droplets." },
    "fireworks": { "zh": "夜空烟花自动绽放，点击任意位置手动发射，多彩粒子球形爆开，拖尾余晖缓缓消散。", "en": "Night fireworks auto-bloom; click anywhere to launch manually, colorful particles bursting into spheres with trailing afterglow." },
    "star-trails": { "zh": "绕极旋转的星轨长曝光效果，星辰划出优雅弧线，北极星在中心永恒闪耀。", "en": "A circumpolar star-trail long-exposure; stars trace elegant arcs, Polaris shining eternal at the center." },
    "moire-pattern": { "zh": "两组线条叠加产生干涉条纹，鼠标改变偏移与角度，制造迷幻的波纹共振。", "en": "Two sets of lines overlay into interference fringes; mouse shifts offset and angle for hypnotic wave resonance." },
    "snowfall": { "zh": "三层深度的雪花缓缓飘落，近大远小、随风飘逸，静谧的冬日氛围。", "en": "Three-depth snowflakes drift down, near-large-far-small, wafting in the wind — a quiet winter mood." },
    "ecg-pulse": { "zh": "医疗风格心电图波形，PQRST 复合波精准还原，实时心率与网格背景同屏呈现。", "en": "Medical-style ECG waveform; PQRST complex precisely reproduced, real-time heart rate over a grid background." },
    "lava-lamp": { "zh": "玻璃瓶身 + 金属底座的写实熔岩灯，熔岩对流上升冷却下沉，可点击切换五色主题。", "en": "A realistic lava lamp — glass body + metal base, lava convecting up and cooling down; click to switch five color themes." },
    "wormhole": { "zh": "旋转的虫洞吸积盘，粒子螺旋坠入事件视界，拖拽倾斜视角，靠近则吸入加速。", "en": "A rotating wormhole accretion disk; particles spiral into the event horizon; drag to tilt, closer means faster intake." },
    "fractal-growth": { "zh": "递归分形树从零生长延伸，枝桠逐级分叉，周期性循环生长与凋零。", "en": "A recursive fractal tree grows from zero, branches forking level by level, cycling growth and withering." },
    "warp-speed": { "zh": "第一人称光速飞行穿越星野，星线拉长拖尾带速度感色偏，鼠标控制飞行方向。", "en": "First-person light-speed flight through starfields; star lines stretch with speed-tinted trails, mouse steers." },
    "spectrum-3d": { "zh": "立体频谱柱群随节奏律动起伏，摄像机环绕穿行，柱体发光投射倒影。", "en": "A 3D spectrum column cluster pulsing to the beat; the camera orbits and passes through, columns glowing with reflections." },
    "bubbles": { "zh": "水底气泡缓缓上浮，折射高光与表面张力光泽清晰可见，点击可戳破飞溅。", "en": "Underwater bubbles slowly rise, refraction highlights and surface-tension sheen visible; click to pop and splash." },
    "silk-flow": { "zh": "多条丝绸般的流线粒子拖尾缓缓流动，鼠标划过带动丝带波动与涟漪。", "en": "Silky streamline particle trails flowing slowly; the mouse drags ripples and waves through the ribbons." },
    "ink-spread": { "zh": "水墨墨滴入水般缓缓扩散，分形纹理沿边缘蔓延，点击可滴落新墨。", "en": "An ink drop diffuses in water, fractal textures creeping along the edges; click to drop new ink." },
    "pixel-morph": { "zh": "像素块矩阵在多种几何图案间变形过渡，鼠标扫过像素点亮并产生排斥。", "en": "A pixel-block matrix morphs between geometric patterns; the mouse lights up and repels pixels as it sweeps." },
    "matrix-rain": { "zh": "经典数字雨字符坠落，绿色辉光 + 拖尾渐隐，鼠标靠近加速流动并点亮。", "en": "The classic digital-rain characters falling, green glow with fading trails; the mouse accelerates and lights up nearby." },
    "paper-fold": { "zh": "3D 纸片多段翻折展开，鼠标拖拽可自由旋转视角，阴影与纸张纹理细腻。", "en": "3D paper multi-segment folding unfolds; drag to rotate freely, with fine shadow and paper texture." },
    "depth-parallax": { "zh": "多层景观元素随鼠标 3D 视差位移，远近景层次分明，带景深模糊与暗角。", "en": "Multi-layer landscape elements shift in 3D parallax with the mouse; distinct near/far layers with depth blur and vignette." },
    "aurora-curtain-particles": { "zh": "粒子帷幕从天空垂落，色彩渐变流动如极光翻涌，鼠标划动掀起光幕波动。", "en": "A particle curtain falls from the sky, colors gradients flowing like surging aurora; the mouse stirs waves in the light veil." },
    "cube-field-3d": { "zh": "数百小立方体构成 3D 方阵旋转漂移，鼠标拖拽旋转视角，碰撞弹跳。", "en": "Hundreds of small cubes form a rotating 3D array; drag to rotate, bouncing on collision." },
    "candle-flame": { "zh": "蜡烛烛火摇曳，火焰三层色阶 + 光晕 + 蜡泪，鼠标靠近火苗摆动。", "en": "A candle flame sways — three-tier flame color + glow + wax tears; the flame leans as the mouse nears." },
    "sand-fall": { "zh": "沙粒从顶部倾泻成瀑布，堆积成沙丘，鼠标可挖沙/扰动沙流。", "en": "Sand pours from the top into a waterfall, piling into dunes; the mouse can dig and disturb the flow." },
    "liquid-lens": { "zh": "鼠标移动形成液体透镜效果，背景透过透镜折射扭曲放大，色散边缘。", "en": "Mouse movement forms a liquid-lens effect; the background refracts, distorts and magnifies through it, with dispersion edges." },
    "gear-train-3d": { "zh": "多齿轮咬合转动，转速联动传递，鼠标悬停加速旋转。", "en": "Multiple gears mesh and turn, speeds linked and transmitted; hover to accelerate." },
    "text-particle-explosion": { "zh": "文字由粒子构成，鼠标划过文字粒子炸开四散后重新聚合。", "en": "Text made of particles bursts apart as the mouse sweeps through, then reassembles." },
    "quantum-entanglement": { "zh": "成对粒子纠缠运动，一者受鼠标扰动另者同步反应，闪烁连线。", "en": "Entangled particle pairs move as one — one disturbed by the mouse, the other reacts in sync, linked by flickering lines." },
    "planet-orbits": { "zh": "太阳 + 多行星公转轨道，行星自转与卫星，鼠标靠近引力扰动。", "en": "Sun + multiple planets on orbits, with rotation and moons; the mouse perturbs gravity when near." },
    "jelly-pudding": { "zh": "果冻布丁弹性晃动，点击戳一下晃动回弹，高光质感。", "en": "Jelly pudding jiggles elastically; click to poke and spring back, with highlight texture." },
    "maze-generator": { "zh": "实时生成迷宫并寻路演示，鼠标绘制障碍。", "en": "Real-time maze generation with pathfinding demo; the mouse draws obstacles." },
    "laser-engraving": { "zh": "激光束在平面上雕刻图案线条，火花飞溅，鼠标操控自由雕刻。", "en": "A laser beam engraves patterns and lines on a surface, sparks flying; the mouse controls free drawing." },
    "bubble-pop": { "zh": "彩色泡泡膨胀-破裂-飞溅，点击生成泡泡，鼠标悬停戳破。", "en": "Colorful bubbles expand, pop and splash; click to spawn, hover to pop." },
    "city-silhouette-3d": { "zh": "3D 楼宇群剪影，灯光窗户明灭，鼠标旋转视角。", "en": "A 3D skyline silhouette with twinkling lit windows; mouse rotates the view." },
    "pendulum-physics": { "zh": "多摆锤物理摆动，能量传递耦合，点击推动摆锤。", "en": "Multiple pendulums swing with coupled energy transfer; click to push them." },
    "stardust-vortex": { "zh": "星尘粒子螺旋旋涡吸入中心，鼠标扰动轨迹，中心发光。", "en": "Stardust particles spiral into a glowing vortex; the mouse disturbs the trails." },
    "weather-switch": { "zh": "晴/雨/雪/雷四种天气粒子场景切换，一键感受四季变化。", "en": "Four weather particle scenes — sunny/rain/snow/thunder; one click to feel the seasons." },
    "sound-ribbons": { "zh": "随节拍律动的彩色丝带波形，鼠标控制振幅与速度。", "en": "Colorful ribbon waveforms pulsing to the beat; the mouse controls amplitude and speed." },
    "pixel-heart": { "zh": "像素块拼成心形跳动，鼠标扫过点亮，小心形漂浮上升。", "en": "A pixel-block heart beating; the mouse lights up pixels, small hearts float upward." },
    "waterfall-3d": { "zh": "3D 瀑布水流粒子倾泻，水花飞溅，雾化效果与水潭波纹。", "en": "3D waterfall particles pouring down, splashing, with mist and pool ripples." },
    "hologram-earth": { "zh": "旋转全息地球——经纬线网格、大气层辉光、城市灯光点，拖拽旋转视角，WebGL 加速。", "en": "A rotating holographic Earth — lat/long grid, atmospheric glow, city lights; drag to rotate, WebGL accelerated." },
    "tunnel-3d": { "zh": "第一人称穿越无限光隧道，环状光带不断向前流动，鼠标控制速度与视角偏移。", "en": "First-person flight through an infinite light tunnel; ring light-bands flow forward, mouse controls speed and view offset." },
    "spiral-galaxy": { "zh": "旋臂星系粒子旋转，中心核球明亮，旋臂缠绕演化，点击扰动旋臂形态。", "en": "A spiral-arm galaxy rotating, bright central bulge, arms winding and evolving; click to disturb the arms." },
    "sakura-petals": { "zh": "樱花花瓣随风飘落旋转，风场扰动轻盈摇曳，点击扬起漫天花瓣。", "en": "Cherry petals fall and spin in the wind, swaying lightly; click to swirl a storm of blossoms." },
    "particle-tornado": { "zh": "粒子绕轴螺旋上升成龙卷风，底部旋涡明亮，鼠标移动控制风眼位置。", "en": "Particles spiral up around an axis into a tornado, bright vortex at the base; the mouse moves the eye." },
    "bouncing-balls": { "zh": "大量弹性小球物理碰撞弹跳，重力与摩擦力模拟，点击注入新球。", "en": "Many elastic balls collide and bounce with gravity and friction; click to inject new balls." },
    "light-church": { "zh": "多道体积光柱阵列穿过空间，尘埃粒子在光柱中漂浮，鼠标移动光柱偏移。", "en": "Arrays of volumetric light shafts crossing the space, dust floating within; the mouse shifts the shafts." },
    "ring-flight": { "zh": "穿越行星星环飞行，环带粒子环绕流动，色散渐变辉光，鼠标控制视角。", "en": "Flight through a planet ring — ring particles flow with dispersion-gradient glow; mouse controls the view." },
    "wave-text-3d": { "zh": "文字在 3D 波浪曲面上起伏，RGB 通道色散分离辉光，鼠标改变波频。", "en": "Text undulates on a 3D wave surface, RGB channels dispersing with glow; mouse changes wave frequency." },
    "spider-web": { "zh": "蛛网从中心向外螺旋生长，节点连接成网，鼠标点击处生长新网。", "en": "A spider web spirals out from the center, nodes linking into a net; click to grow a new web." },
    "dna-helix": { "zh": "3D 双螺旋结构——主链粒子 + 碱基对横档，A-T/G-C 四色配对，鼠标拖拽旋转视角。", "en": "A 3D double helix — backbone particles + base-pair rungs, A-T/G-C four-color pairing; drag to rotate." },
    "cloth-physics": { "zh": "Verlet 积分布料模拟——弹簧约束 + 风力 + 重力，鼠标推开布料、点击释放冲击波。", "en": "Verlet-integration cloth — spring constraints + wind + gravity; the mouse pushes the cloth, click releases a shockwave." },
    "particle-text-morph": { "zh": "万千粒子聚合成文字、停留、再爆炸四散，循环切换多个词语，鼠标靠近粒子被推开。", "en": "Myriad particles gather into text, hold, then explode apart — cycling through words; the mouse repels particles." },
    "volumetric-rays": { "zh": "多道体积光柱丁达尔阵列——尘埃粒子漂浮在光柱中，光束随风摆动，鼠标控制倾斜。", "en": "Arrays of volumetric Tyndall shafts — dust floating within, beams swaying in the wind; mouse controls tilt." },
    "parallax-scene": { "zh": "多层山峦剪影立体视差——星空/月亮/远山/近山/雾霭，空气透视营造纵深感，昼夜色渐变。", "en": "Multi-layer mountain silhouettes in 3D parallax — stars/moon/far hills/near hills/mist, aerial perspective, day-night gradient." },
    "fluid-smoke-cursor": { "zh": "WebGL 烟雾流体跟随光标移动——彩色烟团扩散升腾，速度越快喷射越猛，加性混合流光。", "en": "WebGL smoke fluid following the cursor — colored smoke diffusing and rising, faster means fiercer jets, additive-blend glow." },
    "waveform-bars": { "zh": "模拟音频频谱柱状图——节拍律动、峰值回落、底部倒影、渐变辉光，鼠标控制频段增益。", "en": "Simulated audio spectrum bars — beat pulse, peak fall, bottom reflection, gradient glow; mouse controls band gain." },
    "pixel-clock": { "zh": "LED 点阵像素时钟——数字变化时旧像素上升消散、新像素从下方浮入，赛博电子辉光。", "en": "An LED dot-matrix pixel clock — old pixels rise and dissipate as digits change, new ones float in from below, cyber glow." },
    "circuit-growth": { "zh": "电路板线路从中心向外 90° 生长蔓延——节点焊盘辉光、分支延伸、鼠标吸引线路方向。", "en": "Circuit traces grow from the center at 90° — node pads glowing, branches extending; the mouse attracts trace direction." },
    "kaleidoscope-3d": { "zh": "六重对称万花筒——旋转几何体+色彩脉冲，三角/菱形/六边/星形多层叠加，鼠标改变旋转方向。", "en": "A six-fold kaleidoscope — rotating geometry + color pulses, triangle/diamond/hexagon/star layers; mouse reverses rotation." },
    "text-light-sweep": { "zh": "多层辉光文字配合横向扫描光带穿过——色散分离、粒子飞溅、扫过瞬间色彩斑斓，常驻动态且层次丰富。", "en": "Multi-layer glowing text with a horizontal scan band sweeping through — dispersion, particle splash, colorful on sweep; always-on and layered." },
    "text-stereo-entry": { "zh": "字符依次 3D 弹性入场——渐变厚度、辉光、落地粒子飞溅、循环重放，视觉冲击力强。", "en": "Characters enter one by one in 3D spring — gradient thickness, glow, landing particle splash, looping replay; strong visual impact." },
    "gravity-field": { "zh": "粒子在鼠标引力/斥力场中运动，悬停斥力推开粒子，按下拖拽生成引力漩涡，粒子螺旋卷入。", "en": "Particles move in the mouse gravity/repulsion field; hover repels, press-drag spawns a gravity vortex that spirals them in." },
    "minimal-wave": { "zh": "少量正弦波线条交叠流动，极简线条美学，鼠标横向改变波长、纵向改变振幅，流畅且克制。", "en": "A few sine-wave lines overlapping and flowing — minimalist aesthetics; mouse changes wavelength horizontally, amplitude vertically; smooth and restrained." },
    "star-trail-orbit": { "zh": "星星围绕中心做圆弧轨迹拖尾旋转，像长曝光星轨摄影，鼠标拖动改变旋转中心位置。", "en": "Stars trace arc-trail rotations around a center, like long-exposure star-trail photography; drag to move the rotation center." },
    "flowing-gradient": { "zh": "柔和渐变色块缓慢流动混合，screen 混合模式叠出梦幻色彩，鼠标移动吸引色块流向。", "en": "Soft gradient blobs slowly flow and mix, screen-blend into dreamy color; the mouse attracts the flow." },
    "film-grain": { "zh": "动态噪点颗粒轻微闪烁漂移，复古胶片质感，偶发划痕点缀，鼠标掠过颗粒加强密度。", "en": "Dynamic noise grains flicker and drift, retro film texture, occasional scratches; the mouse densifies grains as it passes." },
    "breathing-halos": { "zh": "多层光晕缓慢呼吸缩放+透明度脉动，纯 CSS 动画 GPU 加速，鼠标位置即生成新光晕并消散。", "en": "Multi-layer halos slowly breathe in scale and opacity, pure CSS GPU-accelerated; the mouse position spawns new halos that dissipate." },
    "slide-text-sequence": { "zh": "字符逐个从两侧滑入+弹性落位+发光，循环播放多组文字，鼠标悬停立即触发下一组。", "en": "Characters slide in from both sides, spring into place and glow, looping through phrases; hover triggers the next immediately." },
    "spotlight-scan": { "zh": "聚光灯锥光在画面上来回扫描，照亮区域字符粒子浮现，鼠标移动即控制聚光位置与范围。", "en": "A spotlight cone scans back and forth across the canvas, revealing character particles in the lit area; the mouse moves the spot." },
    "ferrofluid-collision": { "zh": "磁流体状粘稠粒子团在鼠标扰动下碰撞变形、拖拽分裂，高光流动感与 metaball 粘稠融合效果。", "en": "Viscous ferrofluid-like particle clumps collide and deform under the mouse, split on drag, with flowing highlights and metaball fusion." },
    "portal-vortex": { "zh": "双色对旋漩涡如科幻传送门，粒子螺旋吸入中心，鼠标移动改变漩涡位置与强度，按下增强吸力。", "en": "A two-color counter-rotating vortex like a sci-fi portal; particles spiral into the center, mouse moves and press strengthens suction." },
    "matrix-rain-code": { "zh": "经典矩阵数字字符雨，片假名+数字+字母下落拖尾、亮度渐变，鼠标掠过加速坠落，头部白色高亮。", "en": "The classic matrix character rain — katakana+digits+letters falling with trails and brightness gradient; the mouse accelerates the fall, white head highlight." },
    "origami-unfold": { "zh": "3D 折面从中心逐面展开成六边形几何体，鼠标 X 控制展开进度，Y 控制倾斜视角，折痕高光清晰。", "en": "3D folds unfold face by face from the center into a hexahedron; mouse X controls unfold progress, Y controls tilt; crisp crease highlights." },
    "hologram-scan": { "zh": "半透明线框球体被扫描线逐层扫过，截面发光，全息投影质感，CRT 噪点与 RGB 色散。", "en": "A translucent wireframe sphere swept layer by layer by scanlines, cross-sections glowing, holographic projection, CRT noise and RGB dispersion." },
    "em-field-lines": { "zh": "磁场流线从 N/S 两极发出，受鼠标位置偏转弯曲，发光流线效果，场强点阵背景。", "en": "Field lines emit from N/S poles, bending with the mouse position, glowing streamlines over a field-strength dot background." },
    "pixel-explosion": { "zh": "圆形图案碎成像素方块爆炸飞散+重力反弹，再聚拢重组循环，鼠标点击立即引爆。", "en": "A circular pattern shatters into pixel blocks that explode and bounce under gravity, then reassemble in a loop; click to detonate." },
    "glass-refraction": { "zh": "背景被透镜状玻璃折射扭曲，光斑色散，鼠标拖动透镜，边缘高光与内反射。", "en": "The background is refracted and distorted through a lens-shaped glass, light-spot dispersion; drag the lens, edge highlights and inner reflections." },
    "star-ring-particles": { "zh": "行星环绕粒子带，土星环风格，颗粒沿轨道疏密分布、明暗闪烁，鼠标拖拽倾斜视角。", "en": "A planet surrounding particle band, Saturn-ring style, particles distributed along the orbit with varying density and shimmer; drag to tilt." },
    "beat-pulse-rings": { "zh": "同心圆环按 120 BPM 节拍脉冲扩散+呼吸，透明度呼吸，鼠标点击生成新脉冲环。", "en": "Concentric rings pulse and breathe at 120 BPM; click to spawn new pulse rings." },
    "liquid-metal": { "zh": "熔融金属光泽流体表面流动变形，高光随流动游走，鼠标拖拽撕裂与融合。", "en": "Molten-metal glossy fluid flowing and deforming, highlights roaming with the flow; drag to tear and fuse." },
    "isometric-city": { "zh": "低多边形建筑从地面逐栋生长、灯光逐窗亮起，昼夜交替，鼠标移动改变日照角度。", "en": "Low-poly buildings grow from the ground one by one, windows lighting up, day-night alternates; mouse changes the sun angle." },
    "neural-pulse": { "zh": "神经元节点放电闪烁，脉冲沿连接线传播扩散形成级联反应，鼠标悬停节点增强放电。", "en": "Neuron nodes fire and flicker, pulses propagate along connections into cascades; hover a node to boost its discharge." },
    "sand-particles": { "zh": "粒子如流沙被鼠标拖拽塑形、堆积成丘，松手后在重力下缓慢流散恢复。", "en": "Particles like flowing sand are shaped and piled by mouse drag, slowly dispersing under gravity on release." },
    "ink-diffusion": { "zh": "墨滴落入水中晕开成丝缕墨纹，多层墨滴交叠晕染，鼠标轻点生成新墨滴。", "en": "An ink drop blooms into silky ink-veils in water, multi-layer drops overlapping; click to add new drops." },
    "rgb-glitch": { "zh": "画面 RGB 三通道错位 + 水平切片随机抖动，故障爆发后自动复原，赛博朋克质感。", "en": "The image RGB channels misalign + horizontal slices jitter randomly, glitching out then auto-recovering — cyberpunk texture." },
    "aurora-curtain-v2": { "zh": "窗帘状极光流体质感多层飘动、交叠明暗起伏，垂向光带与波纹褶皱。", "en": "Curtain-like aurora fluid layered and swaying, overlapping light and shade, vertical bands and ripple folds." },
    "spring-pendulum": { "zh": "一串弹簧质点首尾相连构成多节摆，重力 + 弹簧约束物理模拟，鼠标牵引链端。", "en": "A chain of spring-mass points forms a multi-segment pendulum, gravity + spring-constraint physics; the mouse drags the chain end." },
    "clock-vortex": { "zh": "表盘刻度沿涡流旋转扭曲，时分秒针化为流光残影，真实时间与科幻漩涡融合。", "en": "Clock dial marks twist along a vortex, hands becoming flowing-light afterimages — real time fused with a sci-fi swirl." },
    "cosmic-dust": { "zh": "大体积尘埃粒子云缓慢自转、明暗起伏呼吸，体积云团感与暗云遮罩，鼠标扰动云团。", "en": "A large dust particle cloud slowly rotating and breathing in brightness, volumetric cloud feel with dark occluders; the mouse stirs the cloud." }
  };
  function curLang() {
    try {
      var l = localStorage.getItem('motion-lang');
      if (l === 'zh' || l === 'en') return l;
      return (navigator.language || 'en').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
    } catch (e) { return 'zh'; }
  }
  function descFor(id) {
    var o = CARD_DESC[id];
    if (!o) return '';
    return curLang() === 'en' ? o.en : o.zh;
  }
  function inject(card) {
    if (!card || card.nodeType !== 1) return;
    var id = card.getAttribute && card.getAttribute('data-id');
    if (!id) return;
    if (card._descId === id) return;
    var d = descFor(id);
    if (!d) return;
    var el = card.querySelector('.card-desc');
    if (!el) { el = document.createElement('div'); el.className = 'card-desc'; card.appendChild(el); }
    el.textContent = d;
    card._descId = id;
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
          if (mu.type === 'attributes' && mu.target && mu.target.classList && mu.target.classList.contains('effect-card')) { inject(mu.target); continue; }
          var added = mu.addedNodes;
          for (var j = 0; j < added.length; j++) {
            var n = added[j];
            if (n.nodeType !== 1) continue;
            if (n.classList && n.classList.contains('effect-card')) inject(n);
            else if (n.querySelectorAll) refresh(n);
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-id'] });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
