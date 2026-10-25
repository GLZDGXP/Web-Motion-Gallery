#!/usr/bin/env node
/**
 * MOTION 构建脚本（零依赖，ESM）
 * 把 engine + webgl-utils + 所有 components + app.js 顺序拼接成 bundle.min.js，
 * 并向 app.js 的 EFFECTS 数组注入新增动效条目。
 *
 * 用法： node tools/build.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ---- 新增的 10 个动效注册信息（component 名需与 components/*.js 中的 window.X 一致）----
const NEW = [
  { id: 'aether-waves', index: '121', name: '以太波', enName: 'Aether Waves', category: '粒子 / Particle', description: '多层正弦波叠加起伏，如以太涟漪般呼吸明灭。', tags: ['Wave', 'Canvas', 'Ambient'], component: 'AetherWaves' },
  { id: 'neon-grid-pulse', index: '122', name: '霓虹网格脉冲', enName: 'Neon Grid Pulse', category: '图形 / Graphics', description: '网格节点按相位依次呼吸发光，形成扫描脉冲。', tags: ['Grid', 'Neon', 'Pulse'], component: 'NeonGridPulse' },
  { id: 'plasma-blobs', index: '123', name: '等离子球', enName: 'Plasma Blobs', category: '材质 / Material', description: '多枚发光球体以叠加混合流动，呈现等离子质感。', tags: ['Plasma', 'Glow', 'Blend'], component: 'PlasmaBlobs' },
  { id: 'cosmic-drift', index: '124', name: '宇宙漂流', enName: 'Cosmic Drift', category: '背景 / Background', description: '星云辉光与星点视差漂移，宁静而深邃。', tags: ['Space', 'Stars', 'Parallax'], component: 'CosmicDrift' },
  { id: 'ember-fountain', index: '125', name: '余烬喷泉', enName: 'Ember Fountain', category: '粒子 / Particle', description: '暖色粒子向上喷射后受重力回落，如余烬飞舞。', tags: ['Particles', 'Physics', 'Ember'], component: 'EmberFountain' },
  { id: 'honeycomb-pulse', index: '126', name: '蜂巢脉冲', enName: 'Honeycomb Pulse', category: '图形 / Graphics', description: '六边形蜂巢由中心向外扩散光波，节律呼吸。', tags: ['Hexagon', 'Pulse', 'Grid'], component: 'HoneycombPulse' },
  { id: 'ripple-interference', index: '127', name: '涟漪干涉', enName: 'Ripple Interference', category: '物理 / Physics', description: '双源同心波叠加产生干涉条纹，演示波的性质。', tags: ['Wave', 'Interference', 'Canvas'], component: 'RippleInterference' },
  { id: 'firefly-meadow', index: '128', name: '萤火虫草甸', enName: 'Firefly Meadow', category: '场景 / Scene', description: '暖色光点在草丛间漂浮闪烁，静谧夏夜。', tags: ['Firefly', 'Scene', 'Glow'], component: 'FireflyMeadow' },
  { id: 'data-stream', index: '129', name: '数据瀑布', enName: 'Data Stream', category: '文本 / Text', description: '竖直字符流如数字雨倾泻，头部高亮流动。', tags: ['Matrix', 'Text', 'Rain'], component: 'DataStream' },
  { id: 'orbital-rings', index: '130', name: '轨道光环', enName: 'Orbital Rings', category: '3D / 3D', description: '多圈倾斜轨道环绕中心核旋转，卫星沿轨运行。', tags: ['Orbit', 'Rings', '3D'], component: 'OrbitalRings' }
];

function injectEffects(appCode) {
  const marker = 'const EFFECTS';
  const mi = appCode.indexOf(marker);
  if (mi < 0) throw new Error('EFFECTS marker not found in app.js');
  const br = appCode.indexOf('[', mi);
  let depth = 1, end = -1;
  for (let i = br + 1; i < appCode.length; i++) {
    const ch = appCode[i];
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) throw new Error('EFFECTS array end not found');
  const injected = NEW.map((e) => JSON.stringify(e)).join(',\n');
  return appCode.slice(0, end) + ',\n' + injected + appCode.slice(end);
}

const wrap = (code) => ';(function(){\n' + code + '\n})();\n';

const engine = read('components/engine.js');
const webgl = read('components/webgl-utils.js');
let app = read('app.js');

app = injectEffects(app);
app = app.replace('120 种手造动效', '130 种手造动效');

const compDir = path.join(ROOT, 'components');
const compFiles = fs.readdirSync(compDir)
  .filter((f) => f.endsWith('.js') && f !== 'engine.js' && f !== 'webgl-utils.js')
  .sort();

const parts = [wrap(engine), wrap(webgl)];
for (const f of compFiles) parts.push(wrap(read('components/' + f)));
parts.push(wrap(app));

const out = parts.join('\n');
fs.writeFileSync(path.join(ROOT, 'bundle.min.js'), out, 'utf8');

console.log('BUILD OK. components bundled:', compFiles.length, '| total effects:', 120 + NEW.length);
console.log('bundle.min.js size:', (out.length / 1024).toFixed(1), 'KB');
