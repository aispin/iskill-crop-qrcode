---
name: iskill-crop-qrcode
summary: 二维码自动裁剪 CLI——输入任意含二维码的图片（收款海报 / 截图 / 宣传图），零依赖定位二维码主体并裁成统一正方形（码本体 + 安静区），不带海报文案与边框。纯 macOS sips 实现，无三方依赖，支持批量、--dry-run、--in-place。
description: 当用户要裁剪/提取二维码、把收款海报裁成纯码、批量统一多张收款码的视觉、问「把二维码抠出来」「裁一下这个码」时使用。触发词：裁二维码、抠二维码、二维码裁剪、crop qrcode、收款码裁剪、二维码定位。基于 finder 图案（1:1:3:1:1）行列双向扫描 + 三定位角右三角校验定位码边界，sips --cropOffset 裁剪；检不出或图已紧凑时自动跳过，幂等可重跑。
agent_created: true
---

# iskill-crop-qrcode

一张含二维码的图 → 裁出干净的正方形码主体（码本体 + 安静区）。

## 什么时候用

- 收款海报（微信 / 支付宝 / QQ 钱包…）构图五花八门，要放进同一个页面 / 文档时——裁完视觉统一
- 截图里只要二维码本体，不要周围的文案、按钮、边框
- 批量处理一整个目录

## 用法

```bash
# 单张：输出 poster-qr.jpg（与原图同目录）
node scripts/crop.mjs ~/Desktop/poster.jpg

# 整个目录批量，输出到独立目录，长边压到 600
node scripts/crop.mjs ~/收款码/ --out ~/收款码/cropped --max 600

# 先看会做什么，不落盘
node scripts/crop.mjs ~/收款码/ --dry-run

# 直接覆盖原图（慎用）
node scripts/crop.mjs poster.jpg --in-place
```

全部选项：

| 选项 | 说明 |
| --- | --- |
| `--out <目录>` | 输出目录（默认与原图同目录） |
| `--suffix <s>` | 输出文件名后缀（默认 `-qr`；`--in-place` 时忽略） |
| `--in-place` | 直接覆盖原图 |
| `--pad <比例>` | 安静区留白比例（默认 `0.06`） |
| `--max <像素>` | 输出长边上限（默认 `800`；`0` = 不缩放） |
| `--format <fmt>` | 输出格式 `jpeg\|png\|tiff`（默认 `jpeg`） |
| `--dry-run` | 只报告将做什么 |

## 行为与兜底

- **定位**：finder 图案（1:1:3:1:1 游程）行列双向扫描 → 候点聚类 → 三定位角右三角校验 → 外扩 3.5 模块即码包围盒。只定位不解码。
- **跳过**：检不出二维码、图本身已紧凑（裁剪面积 ≥ 95% 原图）时原样保留并说明原因；重跑幂等。
- **产物**：正方形 jpeg（默认），长边默认压到 800。
- **平台**：依赖 macOS 自带 `sips`，非 macOS 直接报错退出。Node ≥ 24，零三方依赖。

## 参数调优

检不出（对比度极低 / 码太小）时可用诊断出口看中间量：

```js
import { detectDebug } from './scripts/lib/qrcrop.mjs';
console.log(detectDebug('图.png'));  // rowCands / verified / clusters / triple
```

经验：`verified` 有值但 `clusters` 空 → 键名不一致类 bug（候选存 `m`，下游读成 `module` 会得 NaN 静默失败）。

## 来源

核心库 `scripts/lib/qrcrop.mjs` 与 [iskill-generate-sponsors](https://github.com/aispin/iskill-generate-sponsors) 内置的裁剪模块同源（该 skill 的 `--skip-crop` 即调用它）；本 skill 把它抽成独立 CLI 供单独使用。

## 共享真源

**本仓库是 `scripts/lib/qrcrop.mjs` 的唯一真源**（文件头带 `@iskill-source` / `@iskill-version`
戳；iskill-generate-sponsors 内的是 vendored 副本，声明见其 `package.json` 的 `iskillDeps`）。

- 改本文件必须同一 commit 升 `@iskill-version`（bug 升 patch、加能力升 minor）
- 升版后用 iskill-utils 同步消费方：
  `node ~/.workbuddy/skills/iskill-utils/scripts/skill-deps.mjs check ~/WorkBuddy/ISkills/*`
  → 对报 `[UPDATE]` 的仓库逐个 `sync`

## 依赖同步

本仓库 `promo-page/assets/{app.js,style.css,icons.js}` 是 [iskill-promo-page](https://github.com/aispin/iskill-promo-page)
模板引擎的 vendored 副本（锁定版本见 `package.json` 的 `iskillDeps`），**不要手改**——
去真源仓库改并升 `@iskill-version`，再用 iskill-utils 同步回来。本机未装该工具时，先安装：对 agent 说「请帮我安装 Skill：aispin/iskill-utils」，或按下方自举命令现场拉取：

```bash
T="$HOME/.workbuddy/skills/iskill-utils/scripts/skill-deps.mjs"
[ -f "$T" ] || { TMP="$(mktemp -d)"; curl -fsSL "https://raw.githubusercontent.com/aispin/iskill-utils/HEAD/scripts/skill-deps.mjs" -o "$TMP/skill-deps.mjs"; T="$TMP/skill-deps.mjs"; }
node "$T" check "$(pwd)"     # 漂移检测；node "$T" sync "$(pwd)" 恢复/升级；node "$T" env "$(pwd)" 冷启动自检
```
