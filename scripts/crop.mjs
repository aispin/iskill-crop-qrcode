#!/usr/bin/env node
/**
 * iskill-crop-qrcode · 二维码自动裁剪 CLI（零三方依赖，macOS sips）
 * ---------------------------------------------------------------------------
 * 输入含二维码的图片（收款海报 / 截图 / 宣传图），自动定位二维码主体并
 * 裁成正方形（码本体 + 安静区），不带海报文案、不带边框。
 *
 * 用法：
 *   node crop.mjs <图片或目录>... [选项]
 *
 * 选项：
 *   --out <目录>    输出目录（默认与原图同目录）
 *   --suffix <s>    输出文件名后缀（默认 "-qr"；--in-place 时忽略）
 *   --in-place      直接覆盖原图（危险，默认关）
 *   --pad <比例>    安静区留白比例（默认 0.06）
 *   --max <像素>    输出长边上限（默认 800；0 = 不缩放）
 *   --format <fmt>  输出格式 jpeg|png|tiff（默认 jpeg）
 *   --dry-run       只报告将做什么，不落盘
 *
 * 退出码：0 = 全部处理完（含"未检出"跳过）；1 = 参数/环境错误。
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { cropQr, detectQrBox, hasSips } from './lib/qrcrop.mjs';

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff']);

function usage(code = 0) {
  console.log(`
iskill-crop-qrcode · 二维码自动裁剪（零依赖，macOS sips）

  node crop.mjs <图片或目录>... [选项]

选项
  --out <目录>    输出目录（默认与原图同目录）
  --suffix <s>    输出文件名后缀（默认 "-qr"；--in-place 时忽略）
  --in-place      直接覆盖原图（危险，默认关）
  --pad <比例>    安静区留白比例（默认 0.06）
  --max <像素>    输出长边上限（默认 800；0 = 不缩放）
  --format <fmt>  输出格式 jpeg|png|tiff（默认 jpeg）
  --dry-run       只报告，不落盘

示例
  node crop.mjs ~/Desktop/poster.jpg
  node crop.mjs ~/收款码/ --out ~/收款码/cropped --max 600
`);
  process.exit(code);
}

/* ── 参数 ── */
const inputs = [];
const opt = { suffix: '-qr', pad: 0.06, max: 800, format: 'jpeg' };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--help' || a === '-h') usage(0);
  else if (a === '--out') opt.out = argv[++i];
  else if (a === '--suffix') opt.suffix = argv[++i];
  else if (a === '--in-place') opt.inPlace = true;
  else if (a === '--pad') opt.pad = Number(argv[++i]);
  else if (a === '--max') opt.max = Number(argv[++i]);
  else if (a === '--format') opt.format = argv[++i];
  else if (a === '--dry-run') opt.dryRun = true;
  else if (a.startsWith('--')) { console.error(`未知参数：${a}`); usage(1); }
  else inputs.push(a);
}
if (!inputs.length) usage(1);
if (!hasSips()) {
  console.error('✗ 找不到 sips —— 本工具依赖 macOS 自带的 sips，暂不支持其他平台。');
  process.exit(1);
}

/* ── 收集图片（目录不递归） ── */
const files = [];
for (const p of inputs) {
  const abs = path.resolve(p);
  if (!fs.existsSync(abs)) { console.error(`✗ 路径不存在：${abs}`); process.exit(1); }
  if (fs.statSync(abs).isDirectory()) {
    for (const f of fs.readdirSync(abs)) {
      if (IMG_EXT.has(path.extname(f).toLowerCase())) files.push(path.join(abs, f));
    }
  } else {
    files.push(abs);
  }
}
if (!files.length) { console.error('✗ 没有找到可处理的图片。'); process.exit(1); }

const EXT_FOR = { jpeg: '.jpg', png: '.png', tiff: '.tiff' };
const outExt = EXT_FOR[opt.format] || '.jpg';
let cropped = 0, skipped = 0, failed = 0;

for (const src of files) {
  const base = path.basename(src, path.extname(src));
  const dest = opt.inPlace
    ? src
    : path.join(opt.out ? path.resolve(opt.out) : path.dirname(src), base + opt.suffix + outExt);

  if (opt.dryRun) {
    const r0 = cropQr(src, { padRatio: opt.pad });
    if (!r0) { console.log(`– ${path.basename(src)}：未检出二维码或已紧凑（跳过）`); skipped++; }
    else {
      console.log(`– ${path.basename(src)}：将裁出（裁掉 ${Math.round((1 - r0.ratio) * 100)}%）`);
      fs.unlinkSync(r0.dest);
    }
    continue;
  }

  // 先探测原因，报告更有用
  const hasQr = detectQrBox(src) !== null;
  const r = hasQr ? cropQr(src, { padRatio: opt.pad }) : null;
  if (!r) {
    if (hasQr) { console.log(`– ${path.basename(src)}：图已紧凑，无需裁剪`); }
    else { console.log(`– ${path.basename(src)}：未检出二维码，保持原样`); }
    skipped++;
    continue;
  }

  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    // 裁剪产物在 tmp（可能跨卷），copy + unlink
    fs.copyFileSync(r.dest, dest);
    fs.unlinkSync(r.dest);
    // 长边压缩
    if (opt.max > 0) {
      const dim = sipsDim(dest);
      if (dim && Math.max(dim.w, dim.h) > opt.max) {
        execFileSync('sips', ['-Z', String(opt.max), dest], { stdio: 'ignore' });
      }
    }
    const saved = Math.max(0, Math.round((1 - r.ratio) * 100));
    console.log(`✓ ${path.basename(src)} → ${path.basename(dest)}（裁掉 ${saved}%，二维码区 ${r.box.w}px）`);
    cropped++;
  } catch (e) {
    console.error(`✗ ${path.basename(src)}：${e.message}`);
    failed++;
  }
}

if (!opt.dryRun) {
  console.log(`\n完成：裁剪 ${cropped}，跳过 ${skipped}${failed ? `，失败 ${failed}` : ''}`);
  if (opt.out && cropped) console.log(`输出目录：${path.resolve(opt.out)}`);
}
process.exit(failed ? 1 : 0);

function sipsDim(file) {
  try {
    const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
    const w = /pixelWidth:\s*(\d+)/.exec(out)?.[1];
    const h = /pixelHeight:\s*(\d+)/.exec(out)?.[1];
    return w && h ? { w: +w, h: +h } : null;
  } catch { return null; }
}
