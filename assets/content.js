window.PROMO = {
  name: "ISKILL-CROP-QRCODE",
  brand: "#10b981",
  brand2: "#3b82f6",
  repo: "https://github.com/aispin/iskill-crop-qrcode",
  repoLabel: "aispin/iskill-crop-qrcode",
  license: "MIT",

  platform: "macos",

  lang: {
    /* ── 中文 ───────────────────────────────────────────────────────── */
    zh: {
      meta: {
        title: "ISKILL-CROP-QRCODE · 把海报里的码裁成统一正方形",
        description: "输入任意含二维码的图片，零依赖定位码主体，裁成码本体 + 安静区的正方形；支持批量、--dry-run、幂等重跑，纯 macOS sips 实现。"
      },
      a11y: { skip: "跳到主要内容" },
      ui: { copy: "复制", copied: "已复制", failed: "复制失败" },
      nav: { features: "能力", shots: "截图", how: "上手", faq: "问答" },

      hero: {
        badge: "AI 技能",
        titlePre: "一张海报里的码，",
        titleAccent: "裁成统一正方形",
        titlePost: "",
        sub: "输入任意含二维码的图片（收款海报 / 截图 / 宣传图），零依赖定位码主体，裁成「码本体 + 安静区」的正方形，不带周围文案与边框；支持批量、--dry-run、幂等重跑。只定位不解码。",
        ctaPrimary: "复制安装提示词",
        ctaSecondary: "看源码",
        meta1: "零三方依赖",
        meta2: "Node ≥ 18",
        meta3: "仅 macOS（sips）"
      },
      chat: {
        title: "AI Agent · 对话现场",
        status: "在线",
        userLabel: "你",
        agentLabel: "AI",
        messages: [
          { role: "user", text: "把这张收款海报里的二维码裁出来" },
          { role: "agent", text: "按 finder 图案 1:1:3:1:1 行列双向扫描定位边界，再用三个定位角做右三角校验；检不出码或图已经很紧凑的会自动跳过，绝不硬裁。", tag: "finder 校验通过" },
          { role: "user", text: "一整个目录都要裁" },
          { role: "agent", text: "批量跑，输出到独立目录、长边压到 600；幂等可重跑，重跑不会重复处理已裁过的图。" }
        ]
      },


      stats: [
        { value: "1:1:3:1:1", label: "finder 图案游程", note: "行列双向扫描 + 三定位角右三角校验" },
        { value: "0.06", label: "默认安静区留白", note: "外扩 3.5 模块即码包围盒" },
        { value: "≥95%", label: "面积阈值自动跳过", note: "图已紧凑或检不出 → 原样保留，幂等重跑" },
        { value: "800", label: "默认输出长边像素", note: "0 = 不缩放；可选 jpeg / png / tiff" }
      ],

      compare: {
        eyebrow: "对比",
        title: "以前 vs 现在",
        sub: "",
        before: { title: "没有这个技能", items: ["收款海报构图五花八门，放进同一页视觉很乱", "截图里连着文案、按钮、边框一起带进去", "一张张手动抠，批量处理更痛苦"] },
        after: { title: "有了这个技能", items: ["一条命令裁成统一正方形（码本体 + 安静区）", "只定位不解码，不依赖任何 QR 解码库，零三方依赖", "支持批量、--dry-run，重跑幂等不叠副作用"] }
      },

      features: {
        eyebrow: "能力",
        title: "它能做什么",
        sub: "",
        items: [
          { icon: "crop", title: "自动定位", desc: "finder 图案（1:1:3:1:1 游程）行列双向扫描 → 候点聚类 → 三定位角右三角校验。" },
          { icon: "grid", title: "批量处理", desc: "传一个目录即可，--out 指定输出目录，一次裁完整批。" },
          { icon: "shield", title: "自动跳过兜底", desc: "检不出二维码、或图本身已紧凑（裁剪面积 ≥95%）时原样保留并说明原因。" },
          { icon: "refresh", title: "幂等可重跑", desc: "跳过逻辑让重跑不会叠加副作用，安全批处理。" },
          { icon: "gauge", title: "尺寸与格式可控", desc: "--max 长边、--format jpeg|png|tiff、--pad 安静区比例都可调。" },
          { icon: "monitor", title: "平台限制", desc: "依赖 macOS 自带 sips，非 macOS 直接报错退出。" }
        ]
      },

      showcase: {
        eyebrow: "实拍",
        title: "看一眼真东西",
        sub: "",
        items: []
      },

      steps: {
        eyebrow: "上手",
        title: "三步跑起来",
        sub: "命令由 agent 跑，你只说要什么、看结果。",
        items: [
          { title: "交给 AI 装", desc: "把这句话粘进对话框，agent 会自己拉代码、读文档，再告诉你用法。", codeKey: "install" },
          { title: "说清哪张图、放哪", desc: "路径说清就行；检不出码或图已经很紧凑的会自动跳过，不会硬裁。", codeName: "prompt", code: "把 ~/Downloads/收款海报.jpg 里的二维码裁出来，输出到 ~/Downloads/cropped/" },
          { title: "扫一下认不认得出", desc: "裁好的图在输出目录，你拿手机扫一遍；批量跑是幂等的，重跑不会重复处理。" }
        ]
      },


      faq: {
        eyebrow: "问答",
        title: "常见问题",
        items: [
          { q: "Windows / Linux 上能用吗？", a: "不能。核心裁剪走 macOS 自带的 sips（scripts/crop.mjs），非 macOS 直接报错退出，没有回退实现。替代方案：在 macOS 上裁好再把成品图拷到其它系统使用；或自行用跨平台图像库改写裁剪步骤（本 skill 是零依赖的 sips 管道，暂未提供跨平台分支）。" },
          { q: "需要装 QR 解码库吗？", a: "不需要。只定位不解码，不依赖任何 QR 解码库，Node ≥ 18、零三方依赖。" },
          { q: "检不出二维码怎么办？", a: "用 scripts/lib/qrcrop.mjs 的 detectDebug 看中间量（rowCands / verified / clusters / triple）定位问题；对比度极低或码太小时会跳过并说明原因。" },
          { q: "会覆盖原图吗？", a: "默认不覆盖，输出文件加 -qr 后缀；只有显式加 --in-place 才覆盖原图（慎用）。" },
          { q: "重跑会不会重复裁？", a: "幂等。已紧凑的图会被跳过，重复跑不会叠加副作用。" },
          { q: "输出是什么格式？", a: "默认正方形 jpeg、长边压到 800；可用 --format 换成 png / tiff，用 --max 0 关掉缩放。" }
        ]
      },

      cta: { title: "现在就来一发", desc: "把提示词粘给 AI，先 --dry-run 看它会裁哪些。", primary: "去 GitHub 看看", secondary: "复制安装提示词" },
      footer: { license: "MIT 许可", madeWith: "由 iskill-promo-page 生成" }
    },

    /* ── English ────────────────────────────────────────────────────── */
    en: {
      meta: {
        title: "ISKILL-CROP-QRCODE · Crop the code out of any poster, square and uniform",
        description: "Feed it any image with a QR code; it zero-dependently locates the code and crops a square of the code body plus quiet zone. Batch, --dry-run and idempotent, built on macOS sips."
      },
      a11y: { skip: "Skip to content" },
      ui: { copy: "Copy", copied: "Copied", failed: "Copy failed" },
      nav: { features: "Features", shots: "Screens", how: "Get started", faq: "FAQ" },

      hero: {
        badge: "AI skill",
        titlePre: "The code inside a poster, ",
        titleAccent: "cropped to a clean square",
        titlePost: "",
        sub: "Feed it any image containing a QR code (payment poster / screenshot / promo art); it locates the code zero-dependently and crops a square of the code body plus quiet zone, without surrounding copy or borders. Batch, --dry-run and idempotent. Locate only, never decode.",
        ctaPrimary: "Copy install prompt",
        ctaSecondary: "View source",
        meta1: "Zero third-party deps",
        meta2: "Node ≥ 18",
        meta3: "macOS only (sips)"
      },
      chat: {
        title: "AI Agent · live session",
        status: "online",
        userLabel: "You",
        agentLabel: "AI",
        messages: [
          { role: "user", text: "Crop the QR code out of this payment poster" },
          { role: "agent", text: "I scan rows and columns for the 1:1:3:1:1 finder pattern, then verify with the three corner marks. No detectable code — or already tight? Skipped, never force-cropped.", tag: "finder check passed" },
          { role: "user", text: "There's a whole folder of them" },
          { role: "agent", text: "Batch it: separate output dir, long edge capped at 600. It's idempotent, so re-running won't process the same image twice." }
        ]
      },


      stats: [
        { value: "1:1:3:1:1", label: "finder-pattern run", note: "row/column scan plus three-corner right-triangle check" },
        { value: "0.06", label: "default quiet-zone padding", note: "expands 3.5 modules to the code bounding box" },
        { value: "≥95%", label: "area threshold to skip", note: "already tight or undetected → left untouched, idempotent" },
        { value: "800", label: "default output long edge (px)", note: "0 = no resize; jpeg / png / tiff available" }
      ],

      compare: {
        eyebrow: "Comparison",
        title: "Before vs after",
        sub: "",
        before: { title: "Without it", items: ["Payment posters are framed wildly differently and look messy side by side", "Screenshots drag in surrounding copy, buttons and borders", "Cropping them one by one by hand — and batching is worse"] },
        after: { title: "With it", items: ["One command crops a uniform square (code body + quiet zone)", "Locate-only, no QR decoding library, zero third-party deps", "Batch, --dry-run, and idempotent re-runs"] }
      },

      features: {
        eyebrow: "Features",
        title: "What it does",
        sub: "",
        items: [
          { icon: "crop", title: "Auto-locate", desc: "Finder patterns (1:1:3:1:1 run) scanned in both axes → cluster candidate points → three-corner check." },
          { icon: "grid", title: "Batch by default", desc: "Point it at a folder and set --out; the whole batch crops in one run." },
          { icon: "shield", title: "Skip-with-reason fallback", desc: "If no code is found, or the image is already tight (crop ≥95%), it keeps the original and says why." },
          { icon: "refresh", title: "Idempotent", desc: "The skip logic means re-running never stacks side effects — safe for batch use." },
          { icon: "gauge", title: "Size and format control", desc: "--max long edge, --format jpeg|png|tiff and --pad quiet zone are all tunable." },
          { icon: "monitor", title: "Platform limit", desc: "Depends on macOS's bundled sips; on non-macOS it exits with an error." }
        ]
      },

      showcase: {
        eyebrow: "Screens",
        title: "See the real thing",
        sub: "",
        items: []
      },

      steps: {
        eyebrow: "Get started",
        title: "Up and running in three steps",
        sub: "The agent runs the commands. You say what you want and check the result.",
        items: [
          { title: "Let your agent install it", desc: "Paste the line into the chat — it clones the repo, reads the docs, and tells you how to use it.", codeKey: "install" },
          { title: "Say which image, and where", desc: "Just give paths. Images with no detectable code — or already tight — are skipped, never force-cropped.", codeName: "prompt", code: "Crop the QR code out of ~/Downloads/payment-poster.jpg and write it to ~/Downloads/cropped/" },
          { title: "Scan it once", desc: "Cropped files land in the output dir — scan one with your phone. Batch runs are idempotent, so re-runs don't double-process." }
        ]
      },


      faq: {
        eyebrow: "FAQ",
        title: "Frequently asked",
        items: [
          { q: "Does it work on Windows / Linux?", a: "No. The core crop goes through macOS's bundled sips (scripts/crop.mjs); on non-macOS it exits with an error and there is no fallback implementation. Workaround: crop on macOS and copy the finished images elsewhere, or rewrite the crop step with a cross-platform image library (this skill is a zero-dependency sips pipeline with no cross-platform branch yet)." },
          { q: "Do I need a QR decoding library?", a: "No. It locates but never decodes, depends on no QR library, and needs Node ≥ 18 with zero third-party deps." },
          { q: "What if it can't find the code?", a: "Use detectDebug from scripts/lib/qrcrop.mjs to inspect rowCands / verified / clusters / triple. Very low contrast or too-small codes are skipped with a reason." },
          { q: "Will it overwrite my originals?", a: "By default no — outputs get a -qr suffix. Only an explicit --in-place overwrites the original (use with care)." },
          { q: "Does re-running crop twice?", a: "It's idempotent. Already-tight images are skipped, so re-runs never stack side effects." },
          { q: "What's the output format?", a: "Square jpeg with the long edge capped at 800 by default; use --format for png / tiff and --max 0 to disable resizing." }
        ]
      },

      cta: { title: "Give it a spin", desc: "Paste the prompt into your agent and --dry-run first to see what it would crop.", primary: "Open on GitHub", secondary: "Copy install prompt" },
      footer: { license: "MIT licensed", madeWith: "Built with iskill-promo-page" }
    }
  }
};
