/* 数据快照：agent-solution · pub-ai4s · 分支增量（merge-base 12735f553..HEAD）
 * 由 analysis-agent/branch_scope_stats.py 产出结果整理，禁止手工新增未统计的数据。
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
  ]
};
