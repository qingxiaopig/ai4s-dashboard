/* 数据快照（双源）
 * A. AtomGit openJiuwen/agent-solution · pub-ai4s · 分支增量（merge-base 12735f553..HEAD）
 *    由 analysis-agent/branch_scope_stats.py 产出结果整理。
 * B. 算力作战体验和验证Lab · 工具清单 v6（18 个 CodeHub 仓库）
 *    来自 算力作战体验和验证Lab_工具清单_v6.xlsx、卡片清单与代码统计.xlsx、作者代码贡献统计.xlsx。
 * 两套口径统计对象不同，不可相加；禁止手工新增未统计的数据。
 */
window.AI4S_DATA = {
  meta: {
    repo: "openJiuwen/agent-solution",
    branch: "pub-ai4s",
    head: "21afec910",
    base: "12735f553",
    syncAt: "2026-11-10 18:05 +08:00",
    range: "2026-10-20 ~ 2026-10-30",
    days: 11
  },

  totals: {
    commits: 7,
    contentCommits: 5,
    mergeCommits: 2,
    files: 47,
    add: 10442,
    del: 0,
    net: 10442,
    cumAdd: 10447,
    cumDel: 5,
    binary: 0
  },

  /* 按内容提交逐日聚合；合并提交不计入文件与行数 */
  daily: [
    { date: "10-20", key: "2026-10-20", commits: 4, files: 17, lines: 7002, skills: 1 },
    { date: "10-21", key: "2026-10-21", commits: 1, files: 0, lines: 0, skills: 0 },
    { date: "10-22", key: "2026-10-22", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-23", key: "2026-10-23", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-24", key: "2026-10-24", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-25", key: "2026-10-25", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-26", key: "2026-10-26", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-27", key: "2026-10-27", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-28", key: "2026-10-28", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-29", key: "2026-10-29", commits: 0, files: 0, lines: 0, skills: 0 },
    { date: "10-30", key: "2026-10-30", commits: 2, files: 30, lines: 3440, skills: 2 }
  ],

  commits: [
    {
      hash: "43be9fb3c", author: "ww0205", date: "2026-10-20 16:53",
      msg: "feat(AI-CHEM): 新增 debateclaw-mcp-ws 辩论与假说生成技能",
      files: 16, add: 6958, del: 0, net: 6958, type: "内容", domain: "AI-CHEM"
    },
    {
      hash: "733a61605", author: "ww0205", date: "2026-10-20 17:00",
      msg: "docs(AI-CHEM): 新增业务域 README，介绍科研五步法资产规划",
      files: 1, add: 44, del: 0, net: 44, type: "内容", domain: "AI-CHEM"
    },
    {
      hash: "cb45d15cd", author: "ww0205", date: "2026-10-20 17:02",
      msg: "docs(AI-CHEM): 修正科研五步法第四/五阶段名称",
      files: 1, add: 3, del: 3, net: 0, type: "内容", domain: "AI-CHEM"
    },
    {
      hash: "939b0f8c9", author: "ww0205", date: "2026-10-20 17:03",
      msg: "docs(AI-CHEM): 修正科研五步法第一阶段名称为知识与数据获取",
      files: 1, add: 2, del: 2, net: 0, type: "内容", domain: "AI-CHEM"
    },
    {
      hash: "cf6309dcb", author: "lbchw", date: "2026-10-21 10:26",
      msg: "!854 merge pub-ai4s into pub-ai4s",
      files: 17, add: 7002, del: 0, net: 0, type: "合并", domain: "AI-CHEM"
    },
    {
      hash: "6f4ad1783", author: "gcw_8EkgHHri", date: "2026-10-30 18:33",
      msg: "feat(ai-bio): 新增生物学业务域（bio-graphrag 服务 + 2 个抗体技能）",
      files: 30, add: 3440, del: 0, net: 3440, type: "内容", domain: "ai-bio"
    },
    {
      hash: "21afec910", author: "lbchw", date: "2026-10-30 18:38",
      msg: "!995 merge pub-ai4s into pub-ai4s",
      files: 30, add: 3440, del: 0, net: 0, type: "合并", domain: "ai-bio"
    }
  ],

  authors: [
    {
      name: "ww0205", email: "zhengjiwang@huawei.com",
      commits: 4, merges: 0, add: 7007, del: 5, net: 7002, files: 17,
      first: "2026-10-20 16:53", last: "2026-10-20 17:03",
      mergeOnly: false, domain: "AI-CHEM"
    },
    {
      name: "gcw_8EkgHHri", email: "larmelave@sina.com",
      commits: 1, merges: 0, add: 3440, del: 0, net: 3440, files: 30,
      first: "2026-10-30 18:33", last: "2026-10-30 18:33",
      mergeOnly: false, domain: "ai-bio"
    },
    {
      name: "lbchw", email: "xjtlbc@163.com",
      commits: 0, merges: 2, add: 0, del: 0, net: 0, files: 0,
      first: "2026-10-21 10:26", last: "2026-10-30 18:38",
      mergeOnly: true, domain: "合并"
    }
  ],

  skills: [
    {
      name: "debateclaw-mcp-ws", domain: "AI-CHEM",
      path: "AI-CHEM/skills/debateclaw-mcp-ws",
      files: 16, lines: 6958,
      py: 5405, md: 1060, config: 172, html: 321, other: 0,
      desc: "辩论与假说生成 Skill，含 MCP WebSocket 服务、脚本与前端资源"
    },
    {
      name: "pdb-gp-np-epitope", domain: "ai-bio",
      path: "ai-bio/skills/pdb-gp-np-epitope",
      files: 4, lines: 831,
      py: 710, md: 121, config: 0, html: 0, other: 0,
      desc: "PDB 糖蛋白 / 纳米颗粒表位分析 Skill"
    },
    {
      name: "antigen-x-nanobody-structure", domain: "ai-bio",
      path: "ai-bio/skills/antigen-x-nanobody-structure",
      files: 1, lines: 113,
      py: 0, md: 113, config: 0, html: 0, other: 0,
      desc: "抗原 × 纳米抗体结构说明 Skill（纯文档）"
    }
  ],

  categories: [
    { name: "Skill 技能资产", files: 21, lines: 7902, pct: 75.7, color: "#1f6f5b" },
    { name: "Service 代码/测试", files: 9, lines: 1488, pct: 14.2, color: "#3d9a7c" },
    { name: "许可证/第三方", files: 3, lines: 376, pct: 3.6, color: "#c47b2b" },
    { name: "补丁 .patch", files: 8, lines: 329, pct: 3.2, color: "#d9b47a" },
    { name: "文档 .md", files: 4, lines: 281, pct: 2.7, color: "#7fa8c9" },
    { name: "配置", files: 2, lines: 66, pct: 0.6, color: "#a8b8ad" }
  ],

  domains: [
    {
      name: "AI-CHEM", files: 17, lines: 7002, pct: 67.1, color: "#1f6f5b",
      children: [
        { name: "AI-CHEM/skills/debateclaw-mcp-ws", files: 16, lines: 6958 },
        { name: "AI-CHEM/README.md", files: 1, lines: 44 }
      ]
    },
    {
      name: "ai-bio", files: 30, lines: 3440, pct: 32.9, color: "#c47b2b",
      children: [
        { name: "ai-bio/services/bio-graphrag", files: 24, lines: 2446 },
        { name: "ai-bio/skills", files: 5, lines: 944 },
        { name: "ai-bio/README.md", files: 1, lines: 50 }
      ]
    }
  ],

  /* 非 skill 文件，合计 26 个文件 / 2,540 行 */
  fileTypes: [
    { name: "Python .py", files: 8, lines: 1432 },
    { name: "补丁 .patch", files: 8, lines: 329 },
    { name: "许可证/第三方声明", files: 3, lines: 376 },
    { name: "文档 .md", files: 4, lines: 281 },
    { name: "脚本 .sh", files: 1, lines: 56 },
    { name: "配置 .txt", files: 1, lines: 55 },
    { name: "配置 .gitignore", files: 1, lines: 11 }
  ],

  /* 3 个新增 skill 的文件类型行数，合计 21 个文件 / 7,902 行 */
  skillTypes: [
    { name: "Python .py", lines: 6115 },
    { name: "文档 .md", lines: 1294 },
    { name: "HTML .html", lines: 321 },
    { name: "Skill 配置", lines: 172 }
  ],

  /* ===== B. 算力作战体验和验证Lab · 工具清单 v6 ===== */
  lab: {
    meta: {
      title: "算力作战体验和验证Lab",
      category: "公共事业",
      version: "v6",
      asOf: "2026-11-12",
      range: "2026-02-04 ~ 2026-10-25",
      cardBase: "https://console.his.huawei.com/discoverypc/app#/preview?fieldId=5320&subtypeId=928859&id=",
      cardSuffix: "&WETITLE=算力作战体验和验证Lab&appId=131737878466280",
      repoBase: "https://codehub-g.huawei.com/ComputingPlatformAdvanceTeam/CPXLab/",
      sources: [
        "算力作战体验和验证Lab_工具清单_v6.xlsx",
        "卡片清单与代码统计.xlsx",
        "作者代码贡献统计.xlsx"
      ],
      contact: "陈义伟 00474392 · 算力平台先遣队 参谋部 · 战略支援部",
      locNote: "代码量为源码文件行数(LOC)；Agent 为 agents/ 目录下定义文件数；Skills 为 SKILL.md 数量（去除 .claude/.trae 镜像）；MCP 为 mcp 相关文件数；Tools 为 tools/ 目录文件数；Builder 为 builder 相关文件数。",
      gitNote: "仓库历史多为初始化提交，同一人存在多种提交名；Git 提交表已按邮箱归一化，提交行数不宜直接当作原创工作量。"
    },

    totals: {
      tools: 18, repos: 18, loc: 219665,
      agents: 13, skills: 127, mcp: 2, toolsCount: 1, builders: 1,
      likes: 77, views: 991,
      authors: 8,
      gitAuthors: 3, gitCommits: 51,
      gitAdd: 1476686, gitDel: 13, gitNet: 1476673,
      gitCodeAdd: 207840, gitCodeDel: 7,
      firstUpdate: "2026-02-04", lastUpdate: "2026-10-25"
    },

    /* 主题按工具卡片名称归并；LOC 合计 219,665 */
    themes: [
      { name: "AI4S 自动实验", tools: 9, loc: 125783, pct: 57.3, color: "#1f6f5b" },
      { name: "文旅 / AI 伴游", tools: 6, loc: 52848, pct: 24.1, color: "#c47b2b" },
      { name: "模型适配 AscendBridge", tools: 1, loc: 39413, pct: 17.9, color: "#3d9a7c" },
      { name: "多模态模型验证", tools: 2, loc: 1621, pct: 0.7, color: "#7fa8c9" }
    ],

    tools: [
      {
        card: "86", name: "AI数智化自动实验-数据处理及反馈Agent",
        author: "关文婷", empNo: "00579872", updated: "2026-10-25",
        likes: 1, views: 13, loc: 10220, agents: 0, skills: 6, mcp: 0, tools: 1, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-digital-intelligent-automated-experiment-data-processing-and-feedback-agent",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22612188",
        desc: "科研五步法包括：文献分析、假说生成、理论计算、实验方案设计与执行、数据处理及反馈。本版将假说生成（调用文献知识图谱）、理论计算（CSP，基于mace-off模型）、数据分析与反馈（CSP场景）进行自主闭环，并多轮迭代。"
      },
      {
        card: "84", name: "AI数智化自动实验-L4科学假说生成系统",
        author: "郑寄望", empNo: "00614212", updated: "2026-10-19",
        likes: 2, views: 11, loc: 48767, agents: 0, skills: 2, mcp: 2, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-digital-intelligent-automated-experiment-l4-scientific-hypothesis-generation-system",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22593896",
        desc: "面向材料化学、能源、催化等计算可验证领域，提供从科学问题到带证据链假说的自动化生成能力。采用「冷启动假说生成器 + 计算驱动修正器」双角色架构，产出带证据链的科研级假说和发现。"
      },
      {
        card: "85", name: "AI数智化自动实验-知识引擎",
        author: "杨鑫", empNo: "00907261", updated: "2026-10-19",
        likes: 2, views: 21, loc: 39084, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 1,
        theme: "AI4S 自动实验",
        repo: "ai-digital-intelligent-automated-experiment-knowledge-engine",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22596003",
        desc: "支撑下一代智能科研Agent的核心知识底座。通过持续吸收和理解科研文献、实验数据与领域知识，构建可计算、可推理、可演化的科研知识图谱，加速从知识发现到科学创新的全过程。"
      },
      {
        card: "83", name: "AI数智化自动实验-辩论与假说生成",
        author: "郑寄望", empNo: "00614212", updated: "2026-08-31",
        likes: 3, views: 29, loc: 5516, agents: 0, skills: 1, mcp: 0, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-digital-intelligent-automated-experiment-debate-and-hypothesis-generation",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22492803",
        desc: "通过多模型并行辩论 + 联网搜索循证 + 协调者仲裁的框架，将分散、异构的领域知识汇聚为结构化的假说结论，为后续实验设计提供高质量的推理起点。"
      },
      {
        card: "82", name: "AI数智化自动实验-LabBridge-工作站Skill Creator工具",
        author: "郑寄望", empNo: "00614212", updated: "2026-08-17",
        likes: 4, views: 58, loc: 12217, agents: 5, skills: 25, mcp: 0, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-digital-intelligent-automated-experiment-labbridge-workstation-skill-creator-tool",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22472429",
        desc: "面向化学实验工作站的智能适配框架，将工作站操作手册自动转换为可执行的自然语言及函数SKILL，支持实验方案设计、仿真验证和格式转换。"
      },
      {
        card: "72", name: "多模态生成大模型测试工作流",
        author: "许亮", empNo: "00616150", updated: "2026-07-07",
        likes: 3, views: 22, loc: 375, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "多模态模型验证",
        repo: "multimodal-generative-large-model-test-workflow",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22399699",
        desc: "基于OpenJiuwen平台的自动化评测工具，专为Vidu与Kling双模型横向对比而生。覆盖文生图、文生视频、图生视频、参考生视频、首尾帧生视频五大生成类型。"
      },
      {
        card: "64", name: "AI伴游Rokid眼镜",
        author: "樊曙", empNo: "00844458", updated: "2026-06-25",
        likes: 3, views: 39, loc: 2790, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "文旅 / AI 伴游",
        repo: "ai-travel-companion-rokid-glasses",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22378941",
        desc: "长安十二时辰Rokid眼镜AI伴游系统，通过MobileNetV3模型实时识别景点点位（准确率≥90%），支持语音问答，SSE流式输出边生成边播报。"
      },
      {
        card: "60", name: "文旅智数",
        author: "周维华", empNo: "00454601", updated: "2026-06-16",
        likes: 4, views: 25, loc: 1358, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "文旅 / AI 伴游",
        repo: "cultural-tourism-smart-data",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22360658",
        desc: "面向文旅行业的数据处理智能体，基于OpenJiuWen平台构建，聚焦OBS数据查询和视频筛选两大核心能力，通过自然语言交互完成文旅多模态数据的检索、筛选与处理。"
      },
      {
        card: "58", name: "多模态大模型验证平台",
        author: "周维华", empNo: "00454601", updated: "2026-06-11",
        likes: 5, views: 68, loc: 1246, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "多模态模型验证",
        repo: "multimodal-llm-validation-platform",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22349202",
        desc: "专注AI模型能力测试的工具，支持文本对话、图片理解、视频理解、语音合成四大核心功能，集成豆包、通义千问等多款主流大模型。"
      },
      {
        card: "56", name: "AI伴游小向导网页端",
        author: "樊曙", empNo: "00844458", updated: "2026-06-08",
        likes: 5, views: 54, loc: 46892, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "文旅 / AI 伴游",
        repo: "ai-travel-guide-web",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22342546",
        desc: "基于大模型与知识库的智能旅行伴游应用，支持文字聊天、语音提问、图片识别、视频分析四种交互方式，SSE流式输出即时响应。"
      },
      {
        card: "24", name: "模型自动适配工具AscendBridge2.0",
        author: "田昆阳", empNo: "00935552", updated: "2026-05-26",
        likes: 10, views: 173, loc: 39413, agents: 6, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "模型适配 AscendBridge",
        repo: "SLAI-AscendBridge2",
        blog: "https://codehub-g.huawei.com/ComputingPlatformAdvanceTeam/CPXLab/SLAI-AscendBridge2/files?ref=master",
        desc: "面向Hugging Face模型迁移至昇腾NPU的推理适配与性能优化工具，通过多智能体协同机制串联全流程。覆盖321个主流模型、142个发布方/组织、30+真实业务数据集。"
      },
      {
        card: "47", name: "AI数智化自动实验-实验方案设计与审核Agent",
        author: "毛明", empNo: "00561253", updated: "2026-05-20",
        likes: 5, views: 89, loc: 5658, agents: 2, skills: 41, mcp: 0, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-smart-digital-auto-experiment-design-review-agent",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22293814",
        desc: "基于LLM和实验设备Skills自动设计和审核方案的多Agent系统，对实验需求校验和补充，自动进行方案审核、再修改和可执行workflow的格式转换。"
      },
      {
        card: "41", name: "AI数智化自动实验-文献分析Agent",
        author: "杨鑫", empNo: "00907261", updated: "2026-05-19",
        likes: 6, views: 65, loc: 506, agents: 0, skills: 1, mcp: 0, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-smart-digital-auto-experiment-literature-analysis-agent",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22293543",
        desc: "对接Web of Science、PubMed、arXiv等全球学术数据库，基于研究主题自动执行多维度文献检索与智能分类，提取摘要与核心观点。"
      },
      {
        card: "43", name: "AI数智化自动实验-计算模拟",
        author: "关文婷", empNo: "00579872", updated: "2026-05-19",
        likes: 5, views: 73, loc: 1702, agents: 0, skills: 3, mcp: 0, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-smart-digital-auto-experiment-computational-simulation",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22293688",
        desc: "将深奥的HPC软件与AI4S工具链打造成智能体的专属技能包（Skills），用户提出科研设想后AI一站式智选Skills，让科研计算开箱即用。"
      },
      {
        card: "44", name: "AI数智化自动实验-机器实验方案生成",
        author: "郑寄望", empNo: "00614212", updated: "2026-05-19",
        likes: 7, views: 35, loc: 2113, agents: 0, skills: 48, mcp: 0, tools: 0, builders: 0,
        theme: "AI4S 自动实验",
        repo: "ai-smart-digital-auto-experiment-scheme-generation",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22300221",
        desc: "可用于自动化实验生成与执行的高质量SKILL资产，基于学校真实实验室物理环境下的工作站类型和能力边界，生成可执行的实验方案。"
      },
      {
        card: "1", name: "文旅非遗场景处理Agent",
        author: "周维华", empNo: "00454601", updated: "2026-02-04",
        likes: 4, views: 107, loc: 741, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "文旅 / AI 伴游",
        repo: "cultural-tourism-intangible-heritage-scene-agent",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22115373",
        desc: "专注非遗数据非结构化痛点，通过「数据预处理+LLM标注」闭环流程，自动完成OBS数据获取、视觉清洗、大模型中英文标注到资产归档的全链路工作。"
      },
      {
        card: "6", name: "文旅图像合成质检闭环助手",
        author: "周维华", empNo: "00454601", updated: "2026-02-04",
        likes: 4, views: 54, loc: 495, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "文旅 / AI 伴游",
        repo: "cultural-tourism-image-synthesis-qc-closed-loop-assistant",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22117270",
        desc: "面向文旅行业的智能化素材生产工具，通过“质检→智能扩写→生成→再质检”的闭环流程，实现从“按张制作”到“批量生产”的跨越。"
      },
      {
        card: "12", name: "文旅图像智能标注工作流",
        author: "许亮", empNo: "00616150", updated: "2026-02-04",
        likes: 4, views: 55, loc: 572, agents: 0, skills: 0, mcp: 0, tools: 0, builders: 0,
        theme: "文旅 / AI 伴游",
        repo: "cultural-tourism-image-intelligent-annotation-workflow",
        blog: "https://3ms.huawei.com/km/groups/3958270/blogs/details/22118531",
        desc: "高效数据工程工具，从OBS平台批量获取原始图片，自动规划标注轮数，持续调用大模型进行精准结构化标注，实现从原始数据到高质量训练集的闭环流转。"
      }
    ],

    /* 8 位工具署名作者；LOC 合计 219,665，与工具表一致 */
    authors: [
      {
        rank: 1, name: "郑寄望", empNo: "00614212", tools: 4, loc: 68613,
        agents: 5, skills: 76, mcp: 2, toolsCount: 0, builders: 0,
        toolNames: [
          "AI数智化自动实验-L4科学假说生成系统",
          "AI数智化自动实验-辩论与假说生成",
          "AI数智化自动实验-LabBridge-工作站Skill Creator工具",
          "AI数智化自动实验-机器实验方案生成"
        ]
      },
      {
        rank: 2, name: "樊曙", empNo: "00844458", tools: 2, loc: 49682,
        agents: 0, skills: 0, mcp: 0, toolsCount: 0, builders: 0,
        toolNames: ["AI伴游Rokid眼镜", "AI伴游小向导网页端"]
      },
      {
        rank: 3, name: "杨鑫", empNo: "00907261", tools: 2, loc: 39590,
        agents: 0, skills: 1, mcp: 0, toolsCount: 0, builders: 1,
        toolNames: ["AI数智化自动实验-知识引擎", "AI数智化自动实验-文献分析Agent"]
      },
      {
        rank: 4, name: "田昆阳", empNo: "00935552", tools: 1, loc: 39413,
        agents: 6, skills: 0, mcp: 0, toolsCount: 0, builders: 0,
        toolNames: ["模型自动适配工具AscendBridge2.0"]
      },
      {
        rank: 5, name: "关文婷", empNo: "00579872", tools: 2, loc: 11922,
        agents: 0, skills: 9, mcp: 0, toolsCount: 1, builders: 0,
        toolNames: ["AI数智化自动实验-数据处理及反馈Agent", "AI数智化自动实验-计算模拟"]
      },
      {
        rank: 6, name: "毛明", empNo: "00561253", tools: 1, loc: 5658,
        agents: 2, skills: 41, mcp: 0, toolsCount: 0, builders: 0,
        toolNames: ["AI数智化自动实验-实验方案设计与审核Agent"]
      },
      {
        rank: 7, name: "周维华", empNo: "00454601", tools: 4, loc: 3840,
        agents: 0, skills: 0, mcp: 0, toolsCount: 0, builders: 0,
        toolNames: ["文旅智数", "多模态大模型验证平台", "文旅非遗场景处理Agent", "文旅图像合成质检闭环助手"]
      },
      {
        rank: 8, name: "许亮", empNo: "00616150", tools: 2, loc: 947,
        agents: 0, skills: 0, mcp: 0, toolsCount: 0, builders: 0,
        toolNames: ["多模态生成大模型测试工作流", "文旅图像智能标注工作流"]
      }
    ],

    /* 3 位 Git 提交作者，按邮箱归一化 */
    gitAuthors: [
      {
        rank: 1, name: "陈义伟", email: "c00474392@huawei.com",
        alias: "chenyiwei@huawei.com",
        repos: 18, commits: 45, add: 1308742, del: 5, net: 1308737,
        codeAdd: 119653, codeDel: 0,
        repoList: [
          "SLAI-AscendBridge2", "ai-digital-intelligent-automated-experiment-data-processing-and-feedback-agent",
          "ai-digital-intelligent-automated-experiment-debate-and-hypothesis-generation",
          "ai-digital-intelligent-automated-experiment-knowledge-engine",
          "ai-digital-intelligent-automated-experiment-l4-scientific-hypothesis-generation-system",
          "ai-digital-intelligent-automated-experiment-labbridge-workstation-skill-creator-tool",
          "ai-smart-digital-auto-experiment-computational-simulation",
          "ai-smart-digital-auto-experiment-design-review-agent",
          "ai-smart-digital-auto-experiment-literature-analysis-agent",
          "ai-smart-digital-auto-experiment-scheme-generation", "ai-travel-companion-rokid-glasses",
          "ai-travel-guide-web", "cultural-tourism-image-intelligent-annotation-workflow",
          "cultural-tourism-image-synthesis-qc-closed-loop-assistant",
          "cultural-tourism-intangible-heritage-scene-agent", "cultural-tourism-smart-data",
          "multimodal-generative-large-model-test-workflow", "multimodal-llm-validation-platform"
        ]
      },
      {
        rank: 2, name: "Giwme", email: "3206425229@qq.com",
        alias: "",
        repos: 3, commits: 3, add: 167937, del: 1, net: 167936,
        codeAdd: 88180, codeDel: 0,
        repoList: ["SLAI-AscendBridge2", "ai-travel-companion-rokid-glasses", "ai-travel-guide-web"]
      },
      {
        rank: 3, name: "周维华", email: "zhouweihua3@huawei.com",
        alias: "",
        repos: 1, commits: 3, add: 7, del: 7, net: 0,
        codeAdd: 7, codeDel: 7,
        repoList: ["ai-travel-companion-rokid-glasses"]
      }
    ],

    /* 跨源对齐：AtomGit 分支增量 ↔ Lab 工具清单 */
    alignment: [
      {
        item: "郑寄望 / ww0205",
        branch: "ww0205 · zhengjiwang@huawei.com · 4 提交 / +7,007 −5",
        lab: "郑寄望 · 00614212 · 4 工具 / 68,613 LOC",
        note: "邮箱拼音一致，按同一人对照；Lab 记工具署名，AtomGit 记提交身份"
      },
      {
        item: "辩论与假说生成",
        branch: "debateclaw-mcp-ws · 6,958 行（分支 diff）",
        lab: "辩论与假说生成 · 5,516 LOC（仓库源码）",
        note: "同一产品的不同快照，diff 与仓库 LOC 口径不同，不相加"
      },
      {
        item: "周维华",
        branch: "未出现在分支增量",
        lab: "4 工具 / 3,840 LOC · Git 3 提交 / +7 −7",
        note: "Lab Git 表邮箱 zhouweihua3@huawei.com，可与署名作者对齐"
      },
      {
        item: "陈义伟",
        branch: "未出现在分支增量",
        lab: "Git 45 提交 / 18 仓库 / +1,308,742 行",
        note: "主要为仓库初始化提交，不在 8 位工具署名作者中"
      },
      {
        item: "gcw_8EkgHHri / ai-bio",
        branch: "3,440 行 · 30 文件 · 2 个抗体技能",
        lab: "无对应工具卡片",
        note: "两个来源覆盖范围不同：AtomGit 有 ai-bio 增量，Lab 清单未收录"
      }
    ]
  }
};
