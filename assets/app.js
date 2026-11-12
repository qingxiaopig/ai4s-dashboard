/* Agent Store AI4S 看板 · 交互与图表渲染
 * 纯静态：无依赖、无后端，数据来自 assets/data.js
 * 数据源：AtomGit pub-ai4s 分支增量 + 算力作战体验和验证Lab 工具清单 v6
 */
(function () {
  "use strict";

  var S = window.AI4S_DATA;
  var T = S.totals;
  var L = S.lab;
  var LT = S.lab.totals;

  var state = { source: "combined", tab: "combined" };

  var TABS = {
    combined: [],
    branch: [
      ["overview", "总览"], ["commits", "提交统计"], ["authors", "作者统计"],
      ["skills", "skills统计"], ["dirs", "目录统计"], ["code", "代码量统计"]
    ],
    lab: [
      ["lab-overview", "工具总览"], ["lab-tools", "工具明细"],
      ["lab-authors", "作者统计"], ["lab-git", "Git 提交"]
    ]
  };
  var DEFAULT_TAB = { combined: "combined", branch: "overview", lab: "lab-overview" };

  /* 作者名 → 邮箱映射，用于把提交明细里的 author 名字换成邮箱 */
  var authorEmail = {};
  S.authors.forEach(function (a) { authorEmail[a.name] = a.email; });
  function authorMail(name) { return authorEmail[name] || name; }

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 通用工具 ---------- */
  function fmt(n) {
    if (n === null || n === undefined) return "—";
    return Number(n).toLocaleString("en-US");
  }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function pct(part, total) {
    if (!total) return "0%";
    return (part / total * 100).toFixed(1) + "%";
  }
  function cumulative(arr) {
    var out = [], sum = 0;
    arr.forEach(function (v) { sum += v; out.push(sum); });
    return out;
  }
  function axisFor(max, isCount) {
    if (isCount || max <= 100) {
      var unit = Math.max(1, Math.ceil(max / 4));
      return { max: unit * 4, ticks: [0, unit, unit * 2, unit * 3, unit * 4] };
    }
    var step = max / 4;
    return { max: max, ticks: [0, step, step * 2, step * 3, max] };
  }
  function fmtAxis(v, isCount) {
    if (!v) return "0";
    if (isCount) return fmt(Math.round(v));
    if (v >= 1000000) return (v / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    if (v >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return fmt(Math.round(v));
  }

  /* ---------- 双轴组合图（每日柱 + 累计线） ---------- */
  function comboChart(cfg, idx) {
    var W = 720, H = 220, padL = 40, padR = 44, padT = 18, padB = 32;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var n = cfg.labels.length;
    var step = plotW / n;
    var bw = Math.min(24, Math.max(3, step * 0.56));
    var base = padT + plotH;
    var axL = axisFor(Math.max.apply(null, cfg.daily.concat([1])), cfg.isCount);
    var cum = cumulative(cfg.daily);
    var axR = axisFor(Math.max.apply(null, cum.concat([1])), cfg.isCount);
    var yR = function (v) { return base - (v / axR.max) * plotH; };
    var cx = function (i) { return padL + step * (i + 0.5); };

    var grid = "";
    for (var k = 0; k < 5; k++) {
      var y = base - (k / 4) * plotH;
      grid += '<line x1="' + padL + '" x2="' + (padL + plotW) + '" y1="' + y.toFixed(1) +
        '" y2="' + y.toFixed(1) + '" stroke="#e8eef2" stroke-width="1"></line>';
      grid += '<text x="34" y="' + (y + 3).toFixed(1) +
        '" text-anchor="end" class="axis-text axis-left">' + fmtAxis(axL.ticks[k], cfg.isCount) + "</text>";
      grid += '<text x="682" y="' + (y + 3).toFixed(1) +
        '" text-anchor="start" class="axis-text axis-right">' + fmtAxis(axR.ticks[k], cfg.isCount) + "</text>";
    }

    var bars = cfg.daily.map(function (v, i) {
      var h = (v / axL.max) * plotH;
      var x = cx(i) - bw / 2;
      return '<rect x="' + x.toFixed(1) + '" y="' + (base - h).toFixed(1) +
        '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) +
        '" rx="2.5" fill="url(#barGrad' + idx + ')"><title>' + esc(cfg.labels[i]) +
        "\n" + cfg.dailyLabel + ": " + fmt(v) + cfg.unit +
        "\n" + cfg.cumLabel + ": " + fmt(cum[i]) + cfg.unit + "</title></rect>";
    }).join("");

    var pts = cum.map(function (v, i) { return [cx(i), yR(v)]; });
    var d = pts.map(function (p, i) {
      return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
    }).join(" ");
    var dots = pts.map(function (p, i) {
      return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) +
        '" r="3.2" fill="#fff" stroke="#c47b2b" stroke-width="2"><title>' + esc(cfg.labels[i]) +
        "\n" + cfg.dailyLabel + ": " + fmt(cfg.daily[i]) + cfg.unit +
        "\n" + cfg.cumLabel + ": " + fmt(cum[i]) + cfg.unit + "</title></circle>";
    }).join("");

    var first = cfg.labels[0], last = cfg.labels[n - 1];

    return '' +
      '<div class="combo-chart">' +
        '<div class="chart-legend">' +
          '<span class="legend-item"><i class="swatch bar"></i> ' + cfg.dailyLabel + "（左轴）</span>" +
          '<span class="legend-item"><i class="swatch line"></i> ' + cfg.cumLabel + "（右轴）</span>" +
        "</div>" +
        '<svg viewBox="0 0 720 220" class="bar-svg" role="img" aria-label="' + esc(cfg.title) + ' 每日与累计">' +
          '<defs><linearGradient id="barGrad' + idx + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#3d9a7c" stop-opacity="0.95"></stop>' +
            '<stop offset="100%" stop-color="#2a7a64" stop-opacity="0.75"></stop>' +
          "</linearGradient></defs>" +
          grid + bars +
          '<path d="' + d + '" fill="none" stroke="#c47b2b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>' +
          dots +
          '<text x="40" y="212" class="axis-text">' + esc(first) + "</text>" +
          '<text x="676" y="212" text-anchor="end" class="axis-text">' + esc(last) + "</text>" +
          '<text x="40" y="12" class="axis-label axis-left">' + cfg.dailyLabel + "</text>" +
          '<text x="676" y="12" text-anchor="end" class="axis-label axis-right">' + cfg.cumLabel + "</text>" +
        "</svg>" +
        '<div class="chart-foot muted">' + cfg.foot + "</div>" +
      "</div>";
  }

  /* ---------- 面板与图表块 ---------- */
  function panel(title, meta, body, extraClass) {
    return '<section class="panel ' + (extraClass || "") + '">' +
      '<div class="section-head"><h2>' + title + "</h2>" +
      (meta ? '<span class="muted">' + meta + "</span>" : "") +
      "</div>" + body + "</section>";
  }

  function rankList(items) {
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    var rows = items.map(function (it, i) {
      var w = it.value > 0 ? (it.value / max * 100) : 0;
      return '<div class="approver-rank-row">' +
        '<div class="approver-rank-meta">' +
          '<div class="approver-rank-name">' + (i + 1) + ". " + it.name + (it.tag || "") + "</div>" +
          '<div class="approver-rank-sub">' + (it.sub || "") + "</div>" +
        "</div>" +
        '<div class="approver-rank-bar-wrap">' +
          '<div class="approver-rank-bar ' + (it.tone || "") + '" style="width:' + w.toFixed(2) + '%"></div>' +
        "</div>" +
        '<div class="approver-rank-count">' + it.display + "</div>" +
      "</div>";
    }).join("");
    return '<div class="approver-rank">' + rows + "</div>";
  }

  function compositionBar(items, total) {
    var segs = items.map(function (it) {
      var share = it.pct != null ? it.pct.toFixed(1) + "%" : pct(it.value, total);
      return '<span style="width:' + (it.value / total * 100).toFixed(2) + "%;background:" + it.color +
        '" title="' + esc(it.name) + " " + fmt(it.value) + " 行 · " + share + '"></span>';
    }).join("");
    var legends = items.map(function (it) {
      var share = it.pct != null ? it.pct.toFixed(1) + "%" : pct(it.value, total);
      return '<div class="composition-item">' +
        '<i class="composition-dot" style="background:' + it.color + '"></i>' +
        '<span class="composition-name">' + esc(it.name) + "</span>" +
        '<span class="composition-value">' + fmt(it.value) + "</span>" +
        '<span class="composition-pct">' + share + "</span>" +
      "</div>";
    }).join("");
    return '<div class="stacked-bar">' + segs + '</div><div class="composition-list">' + legends + "</div>";
  }

  function tableWrap(head, rows, foot) {
    return '<div class="table-wrap"><table>' +
      "<thead><tr>" + head + "</tr></thead><tbody>" + rows + (foot || "") + "</tbody></table></div>";
  }
  function th(label, alignNum) {
    return "<th" + (alignNum ? ' class="num"' : "") + ">" + label + "</th>";
  }
  function td(v, alignNum, cls) {
    var c = [];
    if (alignNum) c.push("num");
    if (cls) c.push(cls);
    return "<td" + (c.length ? ' class="' + c.join(" ") + '"' : "") + ">" + v + "</td>";
  }

  /* ---------- 顶栏 / 指标卡 / 横幅 ---------- */
  function renderScopeLine() {
    var html;
    if (state.source === "branch") {
      html = '<span class="tag">分支增量，不含 main 历史</span>' +
        '<span class="tag warn">合并提交只计提交数</span>' +
        '<span class="tag gray">0 个二进制文件</span>';
    } else if (state.source === "lab") {
      html = '<span class="tag">工具清单 v6 · 仓库全量</span>' +
        '<span class="tag warn">代码量为源码 LOC</span>' +
        '<span class="tag gray">18 个工具 / 8 位署名作者</span>';
    } else {
      html = '<span class="tag">双源口径独立</span>' +
        '<span class="tag warn">不可跨源相加</span>' +
        '<span class="tag gray">AtomGit 7 提交 · Lab 18 工具</span>';
    }
    $("scope-line").innerHTML = html;
  }

  function renderSummary() {
    var cards;
    if (state.source === "branch") {
      cards = [
        { label: "提交", value: String(T.commits), unit: "内容 5 · 合并 2", tab: "commits" },
        { label: "文件", value: String(T.files), unit: "分支变更文件", tab: "dirs" },
        { label: "新增行", value: fmt(T.add), unit: "删除 " + T.del + " 行", tab: "code" },
        { label: "Skills", value: String(S.skills.length), unit: "新增技能目录", tab: "skills" },
        { label: "作者", value: "2", unit: "另有 1 人仅合并", tab: "authors" },
        { label: "业务域", value: String(S.domains.length), unit: "AI-CHEM · ai-bio", tab: "dirs" },
        { label: "代码量", value: fmt(T.add), unit: "行 · 增删合计", tab: "code", total: true }
      ];
    } else if (state.source === "lab") {
      cards = [
        { label: "工具", value: String(LT.tools), unit: "18 个 CodeHub 仓库", tab: "lab-tools" },
        { label: "代码量", value: fmt(LT.loc), unit: "LOC · 源码行数", tab: "lab-tools", total: true },
        { label: "Skills", value: String(LT.skills), unit: "SKILL.md 数", tab: "lab-overview" },
        { label: "Agent", value: String(LT.agents), unit: "agents/ 定义文件", tab: "lab-overview" },
        { label: "作者", value: String(LT.authors), unit: "署名作者 · 3 位 Git 作者", tab: "lab-authors" },
        { label: "浏览", value: fmt(LT.views), unit: "点赞 " + LT.likes, tab: "lab-tools" }
      ];
    } else {
      cards = [
        { label: "AtomGit 提交", value: String(T.commits), unit: "5 内容 + 2 合并", tab: "commits" },
        { label: "AtomGit 新增行", value: fmt(T.add), unit: "分支 diff · 47 文件", tab: "code" },
        { label: "AtomGit Skills", value: String(S.skills.length), unit: "新增技能目录", tab: "skills" },
        { label: "Lab 工具", value: String(LT.tools), unit: "18 个 CodeHub 仓库", tab: "lab-tools" },
        { label: "Lab 代码量", value: fmt(LT.loc), unit: "LOC · 源码行数", tab: "lab-tools", total: true },
        { label: "Lab 作者", value: String(LT.authors), unit: "署名作者 · 3 位 Git 作者", tab: "lab-authors" }
      ];
    }
    $("summary-strip").innerHTML = cards.map(function (c) {
      var active = c.tab === state.tab ? " active" : "";
      return '<button type="button" class="summary-card' + (c.total ? " summary-total" : "") + active + '"' +
        (c.tab ? ' data-card-tab="' + c.tab + '"' : "") + '>' +
        '<span class="summary-label">' + c.label + "</span>" +
        '<span class="summary-value">' + c.value + "</span>" +
        '<span class="summary-unit">' + c.unit + "</span>" +
      "</button>";
    }).join("");
  }

  function renderBanner() {
    if (state.source === "branch") {
      $("banner").innerHTML = '<div class="banner scope">' +
        '<span class="tag">分支增量，不含 main 历史</span>' +
        "<span><strong>统计范围</strong> merge-base <code>12735f553..HEAD</code> · " + S.meta.range +
        "（" + S.meta.days + " 天）· 7 个提交（5 内容 + 2 合并）· " + T.files +
        " 个文件 · <code>+" + fmt(T.add) + " / −" + T.del + "</code></span>" +
        "</div>";
      return;
    }
    if (state.source === "lab") {
      $("banner").innerHTML = '<div class="banner scope">' +
        '<span class="tag">工具清单 v6 · 仓库全量</span>' +
        "<span><strong>" + esc(L.meta.title) + "（" + esc(L.meta.category) + "）</strong> · " +
        LT.tools + " 个 CodeHub 仓库 · " + LT.authors + " 位署名作者 · " + fmt(LT.loc) +
        " LOC · 更新 " + L.meta.range + " · 代码量为源码行数，与 AtomGit 分支 diff 口径不同</span>" +
        "</div>";
      return;
    }
    $("banner").innerHTML = '<div class="banner scope">' +
      '<span class="tag">双源口径独立</span>' +
      "<span><strong>AtomGit</strong> <code>pub-ai4s</code> 分支增量 " + T.commits + " 提交 / " + T.files +
      " 文件 / <code>+" + fmt(T.add) + "</code> 行 · <strong>Lab</strong> 工具清单 v6 " + LT.tools +
      " 个工具 / " + fmt(LT.loc) + " LOC / " + LT.authors +
      " 位署名作者 — 统计对象不同，<strong>不可相加</strong></span>" +
      "</div>";
  }

  /* ---------- 综合总览 ---------- */
  function labThemeItems() {
    return L.themes.map(function (t) {
      return { name: t.name + "（" + t.tools + " 个工具）", value: t.loc, color: t.color, pct: t.pct };
    });
  }

  function scopeTable() {
    var rows = [
      ["统计对象", "单个代码仓相对 <code>main</code> 的增量", "18 个 CodeHub 工具仓库的全量快照"],
      ["提交 / 工具", T.commits + " 个提交（5 内容 + 2 合并）", LT.tools + " 个工具卡片"],
      ["文件 / 仓库", T.files + " 个变更文件", LT.repos + " 个仓库"],
      ["代码量", "最终树 diff <code>+" + fmt(T.add) + " / −" + T.del + "</code> 行", "源码 <code>" + fmt(LT.loc) + "</code> LOC"],
      ["作者", "3 位（2 内容 + 1 仅合并）", LT.authors + " 位署名作者 + " + LT.gitAuthors + " 位 Git 作者"],
      ["Skills", S.skills.length + " 个新增（7,902 行）", LT.skills + " 个（SKILL.md）"],
      ["Agent", "未统计", LT.agents + " 个（agents/ 定义文件）"],
      ["时间", S.meta.range + "（" + S.meta.days + " 天）", L.meta.range + "（更新时间跨度）"]
    ].map(function (r) {
      return "<tr><td><strong>" + r[0] + "</strong></td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>";
    }).join("");
    return tableWrap("<th>维度</th><th>AtomGit · pub-ai4s 分支增量</th><th>Lab · 工具清单 v6</th>", rows);
  }

  function alignmentTable() {
    var rows = L.alignment.map(function (a) {
      return "<tr><td><strong>" + esc(a.item) + "</strong></td>" +
        td(esc(a.branch), false, "commit-msg") +
        td(esc(a.lab), false, "commit-msg") +
        td(esc(a.note), false, "commit-msg") + "</tr>";
    }).join("");
    return tableWrap(
      "<th>对齐项</th><th>AtomGit</th><th>Lab 工具清单</th><th>说明</th>", rows);
  }

  function renderCombined() {
    var scope = panel("双源对照", "统计对象与口径", scopeTable(),
      "") +
      '<p class="panel-note">AtomGit 记的是「相对 main 的分支增量」，Lab 记的是「18 个工具仓库的源码全量」；两者量纲不同（diff 行 vs LOC），任何合计相加都会失真，因此本页只做并列与对齐。</p>';

    var align = panel("跨源对齐", "同一人 / 同一产品的对应关系", alignmentTable(),
      "") +
      '<p class="panel-note">对齐只做身份与产品映射，不改写任一来源的原始数字；唯一可直接对齐的是邮箱，姓名（工号）与 Git 提交名需人工确认。</p>';

    var branchDomains = panel("AtomGit 业务域", "按分支新增行 · 合计 " + fmt(T.add) + " 行",
      compositionBar(S.domains.map(function (d) {
        return { name: d.name + "（" + d.files + " 文件）", value: d.lines, color: d.color, pct: d.pct };
      }), T.add));

    var labThemes = panel("Lab 工具主题", "按工具卡片归并 · 合计 " + fmt(LT.loc) + " LOC",
      compositionBar(labThemeItems(), LT.loc));

    var branchRank = panel("AtomGit 作者", "按净增行",
      rankList(S.authors.map(function (a) {
        return {
          name: esc(a.email) + (a.mergeOnly ? ' <span class="tag warn">仅合并</span>' : ""),
          sub: a.commits + " 内容提交 · " + a.files + " 文件",
          value: a.net,
          display: "+" + fmt(a.net),
          tone: a.mergeOnly ? "zero" : ""
        };
      })));

    var labRank = panel("Lab 作者", "按代码量 LOC",
      rankList(L.authors.map(function (a) {
        return {
          name: esc(a.name) + ' <span class="tag gray">' + a.empNo + "</span>",
          sub: a.tools + " 个工具 · " + a.skills + " skills · " + a.agents + " agents",
          value: a.loc,
          display: fmt(a.loc),
          tone: ""
        };
      })));

    $("tab-body").innerHTML =
      scope + align +
      '<div class="split">' + branchDomains + labThemes + "</div>" +
      '<div class="split">' + branchRank + labRank + "</div>";
  }

  /* ---------- AtomGit · 总览 ---------- */
  function renderOverview() {
    var labels = S.daily.map(function (d) { return d.date; });
    var series = [
      {
        key: "commits", title: "提交",
        meta: "最新累计 " + T.commits + "个",
        daily: S.daily.map(function (d) { return d.commits; }),
        dailyLabel: "每日提交", cumLabel: "累计提交",
        unit: "个", isCount: true,
        foot: "共 " + S.meta.days + " 天 · 当日峰值 4 个 · 累计 7 个（内容 5 + 合并 2）"
      },
      {
        key: "files", title: "文件",
        meta: "最新累计 " + T.files + "个",
        daily: S.daily.map(function (d) { return d.files; }),
        dailyLabel: "每日新增", cumLabel: "累计文件",
        unit: "个", isCount: true,
        foot: "共 " + S.meta.days + " 天 · 当日峰值 30 个 · 累计 47 个（按内容提交去重）"
      },
      {
        key: "lines", title: "新增行",
        meta: "最新累计 " + fmt(T.add) + "行",
        daily: S.daily.map(function (d) { return d.lines; }),
        dailyLabel: "每日净增", cumLabel: "累计净增",
        unit: "行", isCount: false,
        foot: "共 " + S.meta.days + " 天 · 当日峰值 7,002 行 · 累计 10,442 行 · 逐提交毛量 +10,447 / −5"
      },
      {
        key: "skills", title: "Skills",
        meta: "最新累计 " + S.skills.length + "个",
        daily: S.daily.map(function (d) { return d.skills; }),
        dailyLabel: "每日新增", cumLabel: "累计技能",
        unit: "个", isCount: true,
        foot: "共 " + S.meta.days + " 天 · 当日峰值 2 个 · 累计 3 个（新增 skill 目录）"
      }
    ];

    var charts = series.map(function (cfg, i) {
      cfg.labels = labels;
      return panel(cfg.title, cfg.meta, comboChart(cfg, i), "overview-section");
    }).join("");

    var domains = panel("业务域占比", "按新增行 · 合计 " + fmt(T.add) + " 行",
      compositionBar(S.domains.map(function (d) {
        return { name: d.name + "（" + d.files + " 文件）", value: d.lines, color: d.color, pct: d.pct };
      }), T.add) +
      '<p class="panel-note">AI-CHEM 的 67.1%（7,002 行）中，debateclaw-mcp-ws 占 6,958 行（域内 99.4%）；ai-bio 的 32.9%（3,440 行）以 bio-graphrag 服务（2,446 行）和 2 个抗体技能（944 行）为主。</p>'
    );

    var cats = panel("代码类别", "按新增行 · Skill 占 75.7%",
      compositionBar(S.categories.map(function (c) {
        return { name: c.name + "（" + c.files + " 文件）", value: c.lines, color: c.color, pct: c.pct };
      }), T.add) +
      '<p class="panel-note">21 个 skill 文件贡献 7,902 行；其余 26 个文件（服务代码、补丁、许可证、文档、配置）合计 2,540 行。</p>'
    );

    $("tab-body").innerHTML = '<div class="overview">' + charts + domains + cats + "</div>";
  }

  /* ---------- AtomGit · 提交统计 ---------- */
  function renderCommits() {
    var rows = S.commits.map(function (c, i) {
      var isMerge = c.type === "合并";
      return '<tr class="' + (isMerge ? "row-merge" : "") + '">' +
        "<td>" + (i + 1) + "</td>" +
        td('<span class="commit-hash">' + c.hash + "</span>") +
        td(esc(authorMail(c.author)) + (isMerge ? ' <span class="tag warn">合并</span>' : "")) +
        td(esc(c.date.slice(5)), true) +
        td(esc(c.msg), false, "commit-msg") +
        td(c.files, true) +
        td("+" + fmt(c.add), true) +
        td("−" + fmt(c.del), true) +
      "</tr>";
    }).join("");

    var table = tableWrap(
      th("#") + th("提交号") + th("邮箱") + th("日期", true) + th("提交信息") +
      th("文件数", true) + th("+行", true) + th("−行", true),
      rows,
      '<tr class="row-total"><td colspan="5">合计（最终树 diff，合并提交不重复计入）</td>' +
      '<td class="num">47</td><td class="num">+10,442</td><td class="num">−0</td></tr>'
    );

    var contentCommits = S.commits.filter(function (c) { return c.type === "内容"; });
    var rank = rankList(contentCommits.map(function (c) {
      return {
        name: '<code>' + c.hash + "</code>",
        sub: c.date.slice(5) + " · " + c.files + " 文件",
        value: c.add,
        display: "+" + fmt(c.add),
        tone: c.add < 100 ? "amber" : ""
      };
    }));

    $("tab-body").innerHTML =
      panel("提交明细", "7 个提交 · 5 内容 + 2 合并", table) +
      panel("提交规模（内容提交）", "按新增行 · 合并提交不计入",
        rank +
        '<p class="panel-note">lbchw 的 2 个提交均为合并提交（!854 / !995），只增加提交数，行数按首父差异不重复计入；ww0205 的两次 README 改写合计产生 5 行删除，因此逐提交毛量为 +10,447 / −5，最终树净增仍为 10,442。</p>'
      );
  }

  /* ---------- AtomGit · 作者统计 ---------- */
  function renderAuthors() {
    var rows = S.authors.map(function (a) {
      return '<tr class="' + (a.mergeOnly ? "row-merge" : "") + '">' +
        "<td><strong>" + esc(a.email) + "</strong>" +
        (a.mergeOnly ? ' <span class="tag warn">仅合并</span>' : "") + "</td>" +
        td(a.commits, true) + td(a.merges, true) +
        td("+" + fmt(a.add), true) + td("−" + fmt(a.del), true) + td("+" + fmt(a.net), true) +
        td(a.files, true) +
        td(esc(a.first.slice(5)), true) + td(esc(a.last.slice(5)), true) +
      "</tr>";
    }).join("");

    var table = tableWrap(
      th("邮箱") + th("内容提交", true) + th("合并提交", true) + th("+行", true) +
      th("−行", true) + th("净增", true) + th("文件数", true) +
      th("首次提交", true) + th("最近提交", true),
      rows,
      '<tr class="row-total"><td>合计（内容提交）</td><td class="num">5</td>' +
      '<td class="num">0</td><td class="num">+10,447</td><td class="num">−5</td>' +
      '<td class="num">+10,442</td><td class="num">47</td><td class="num">—</td>' +
      '<td class="num">—</td></tr>'
    );

    var rank = rankList(S.authors.map(function (a) {
      return {
        name: esc(a.email) + (a.mergeOnly ? ' <span class="tag warn">仅合并</span>' : ""),
        sub: a.commits + " 内容提交 · " + a.files + " 文件",
        value: a.net,
        display: "+" + fmt(a.net),
        tone: a.mergeOnly ? "zero" : ""
      };
    }));

    $("tab-body").innerHTML =
      panel("按作者", "3 位作者 · 2 位内容贡献 + 1 位仅合并", table) +
      panel("作者贡献", "按净增行", rank +
        '<p class="panel-note">作者表按逐提交毛量统计：ww0205 +7,007 / −5（净增 7,002），gcw_8EkgHHri +3,440 / −0；最终树 diff 为 +10,442 / −0，5 行差异来自 <code>AI-CHEM/README.md</code> 在分支内被两次改写。</p>'
      );
  }

  /* ---------- AtomGit · Skills 统计 ---------- */
  function renderSkills() {
    var cards = S.skills.map(function (s) {
      return '<article class="asset-card">' +
        '<p class="asset-folder">' + esc(s.domain) + " · " + s.files + " 文件</p>" +
        '<h3 class="asset-name">' + esc(s.name) + "</h3>" +
        '<p class="asset-desc">' + esc(s.desc) + "</p>" +
        '<div class="asset-metrics">' +
          '<div class="asset-metric"><span>行数</span><b>' + fmt(s.lines) + "</b></div>" +
          '<div class="asset-metric"><span>Python</span><b>' + fmt(s.py) + "</b></div>" +
          '<div class="asset-metric"><span>文档</span><b>' + fmt(s.md) + "</b></div>" +
        "</div>" +
        '<p class="asset-path" title="' + esc(s.path) + '">' + esc(s.path) + "</p>" +
      "</article>";
    }).join("");

    var rows = S.skills.map(function (s, i) {
      return "<tr><td>" + (i + 1) + "</td>" +
        "<td><strong>" + esc(s.name) + "</strong></td>" +
        "<td>" + esc(s.domain) + "</td>" +
        td(s.files, true) + td(fmt(s.lines), true) + td(fmt(s.py), true) + td(fmt(s.md), true) +
        td(fmt(s.config), true) + td(fmt(s.html), true) + td(fmt(s.other), true) +
      "</tr>";
    }).join("");

    var table = tableWrap(
      th("#") + th("Skill") + th("业务域") + th("文件", true) + th("行数", true) +
      th("py", true) + th("md", true) + th("config", true) + th("html", true) + th("其他", true),
      rows,
      '<tr class="row-total"><td colspan="3">合计（3 个新增 skill）</td>' +
      '<td class="num">21</td><td class="num">7,902</td><td class="num">6,115</td>' +
      '<td class="num">1,294</td><td class="num">172</td><td class="num">321</td>' +
      '<td class="num">0</td></tr>'
    );

    var typeItems = S.skillTypes.map(function (t, i) {
      var colors = ["#1f6f5b", "#3d9a7c", "#c47b2b", "#a8b8ad"];
      return { name: t.name, value: t.lines, color: colors[i] };
    });

    $("tab-body").innerHTML =
      panel("新增 Skills（3）", "技能目录 · 21 个文件 / 7,902 行",
        '<div class="asset-grid">' + cards + "</div>") +
      panel("Skill 行数明细", "py / md / config / html 分列", table) +
      panel("Skill 内文件类型", "按行 · 合计 7,902 行",
        compositionBar(typeItems, 7902) +
        '<p class="panel-note">debateclaw-mcp-ws 一个技能占 6,958 行，相当于 skills 总量的 88.1%，其中 Python 5,405 行、文档 1,060 行、HTML 321 行、配置 172 行；pdb-gp-np-epitope 831 行、antigen-x-nanobody-structure 113 行。</p>'
      );
  }

  /* ---------- AtomGit · 目录统计 ---------- */
  function renderDirs() {
    var domainRows = S.domains.map(function (d) {
      return "<tr><td><strong>" + d.name + "</strong></td>" +
        td(d.files, true) + td(fmt(d.lines), true) + td(d.pct.toFixed(1) + "%", true) + "</tr>";
    }).join("");
    var domainTable = tableWrap(
      th("顶层目录") + th("文件数", true) + th("新增行", true) + th("占比", true),
      domainRows,
      '<tr class="row-total"><td>合计</td><td class="num">47</td><td class="num">10,442</td>' +
      '<td class="num">100.0%</td></tr>'
    );

    var childRows = S.domains.map(function (d) {
      return d.children.map(function (c, i) {
        return "<tr>" +
          (i === 0 ? '<td class="team-merged" rowspan="' + d.children.length + '">' + d.name + "</td>" : "") +
          td(esc(c.name), false, "commit-msg") +
          td(c.files, true) + td(fmt(c.lines), true) + td(pct(c.lines, d.lines), true) + "</tr>";
      }).join("");
    }).join("");
    var childTable = tableWrap(
      th("业务域") + th("路径") + th("文件数", true) + th("新增行", true) + th("域内占比", true),
      childRows
    );

    var typeRows = S.fileTypes.map(function (t) {
      return "<tr><td>" + esc(t.name) + "</td>" + td(t.files, true) + td(fmt(t.lines), true) + "</tr>";
    }).join("");
    var typeTable = tableWrap(
      th("类型") + th("文件", true) + th("行数", true),
      typeRows,
      '<tr class="row-total"><td>合计（非 skill）</td><td class="num">26</td><td class="num">2,540</td></tr>'
    );

    var skillTypeRows = S.skillTypes.map(function (t) {
      return "<tr><td>" + esc(t.name) + "</td>" + td(fmt(t.lines), true) + td(pct(t.lines, 7902), true) + "</tr>";
    }).join("");
    var skillTypeTable = tableWrap(
      th("Skill 文件类型") + th("行数", true) + th("占比", true),
      skillTypeRows,
      '<tr class="row-total"><td>合计</td><td class="num">7,902</td><td class="num">100.0%</td></tr>'
    );

    $("tab-body").innerHTML =
      panel("顶层目录", "2 个业务域 · 其他顶层路径 0 个",
        compositionBar(S.domains.map(function (d) {
          return { name: d.name + "（" + d.files + " 文件）", value: d.lines, color: d.color };
        }), T.add) + domainTable) +
      panel("目录细分", "业务域 → 子目录", childTable) +
      panel("文件类型", "非 skill 26 个文件 / 2,540 行 · skill 21 个文件 / 7,902 行",
        '<div class="split"><div>' + typeTable + "</div><div>" + skillTypeTable + "</div></div>"
      );
  }

  /* ---------- AtomGit · 代码量统计 ---------- */
  function renderCode() {
    var summary = '<div class="table-wrap"><table class="intro-stats-table code-summary-table">' +
      '<thead><tr><th>业务域</th><th class="num">业务域净增</th><th>贡献人</th>' +
      '<th class="num">个人净增</th></tr></thead><tbody>' +
      '<tr><td class="team-merged">AI-CHEM<span class="sub">17 文件 · 67.1%</span></td>' +
        '<td class="num">7,002</td><td>ww0205 <span class="tag">内容</span></td>' +
        '<td class="num">7,002</td></tr>' +
      '<tr><td class="team-merged">ai-bio<span class="sub">30 文件 · 32.9%</span></td>' +
        '<td class="num">3,440</td><td>gcw_8EkgHHri <span class="tag">内容</span></td>' +
        '<td class="num">3,440</td></tr>' +
      '<tr class="row-merge"><td class="team-merged">合并提交<span class="sub">不计入行数</span></td>' +
        '<td class="num">0</td><td>lbchw <span class="tag warn">仅合并</span></td>' +
        '<td class="num">0</td></tr>' +
      '<tr class="row-total"><td colspan="3">分支增量合计（净增）</td>' +
        '<td class="num">10,442</td></tr>' +
      "</tbody></table></div>";

    var detail = '<div class="table-wrap"><table>' +
      '<thead><tr><th>#</th><th>业务域</th><th>贡献人</th><th class="num">代码量（净增）</th>' +
      '<th class="num">+行</th><th class="num">−行</th><th class="num">提交数</th>' +
      "</tr></thead><tbody>" +
      '<tr><td>1</td><td>AI-CHEM</td><td>ww0205</td><td class="num">7,002</td>' +
        '<td class="num">7,007</td><td class="num">5</td><td class="num">4</td></tr>' +
      '<tr><td>2</td><td>ai-bio</td><td>gcw_8EkgHHri</td><td class="num">3,440</td>' +
        '<td class="num">3,440</td><td class="num">0</td><td class="num">1</td></tr>' +
      '<tr class="row-merge"><td>3</td><td>合并</td><td>lbchw</td><td class="num">0</td>' +
        '<td class="num">0</td><td class="num">0</td><td class="num">2</td></tr>' +
      '<tr class="row-total"><td colspan="3">合计</td><td class="num">10,442</td>' +
        '<td class="num">10,447</td><td class="num">5</td><td class="num">5</td></tr>' +
      "</tbody></table></div>";

    var contentCommits = S.commits.filter(function (c) { return c.type === "内容"; });
    var rank = rankList(contentCommits.map(function (c) {
      return {
        name: '<code>' + c.hash + "</code>",
        sub: authorMail(c.author) + " · " + c.date.slice(5),
        value: c.add,
        display: "+" + fmt(c.add),
        tone: c.add < 100 ? "amber" : ""
      };
    }));

    var checks = '<div class="table-wrap"><table><tbody>' +
      '<tr><td>最终树 diff</td><td class="num">+10,442 / −0</td></tr>' +
      '<tr><td>逐内容提交毛量</td><td class="num">+10,447 / −5</td></tr>' +
      '<tr><td>差值来源</td><td>AI-CHEM/README.md 两次改写（+3/−3、+2/−2）</td></tr>' +
      '<tr><td>合并提交</td><td>2 个 · 只计提交数，行数不重复计入</td></tr>' +
      '<tr><td>二进制文件</td><td>0 个</td></tr>' +
      '<tr><td>统计区间</td><td>12735f553..21afec910 · 11 天</td></tr>' +
      "</tbody></table></div>";

    $("tab-body").innerHTML =
      panel("代码量汇总", "指标 = 净增行 · 合并提交不重复计入", summary) +
      panel("代码量明细", "含增删行与提交数", detail) +
      '<div class="split">' +
        panel("提交规模（内容提交）", "按新增行", rank) +
        panel("范围校验", "口径自校验", checks) +
      "</div>";
  }

  /* ---------- Lab · 工具卡 ---------- */
  function labCard(t) {
    return '<article class="asset-card">' +
      '<p class="asset-folder">' + esc(t.theme) + " · 卡片 " + t.card + "</p>" +
      '<h3 class="asset-name">' + esc(t.name) + "</h3>" +
      '<p class="asset-desc clamp" title="' + esc(t.desc) + '">' + esc(t.desc) + "</p>" +
      '<div class="asset-meta"><span class="meta-label">作者</span> ' + esc(t.author) +
        ' <span class="tag gray">' + t.empNo + "</span></div>" +
      '<div class="asset-metrics">' +
        '<div class="asset-metric"><span>代码量</span><b>' + fmt(t.loc) + "</b></div>" +
        '<div class="asset-metric"><span>Skills</span><b>' + t.skills + "</b></div>" +
        '<div class="asset-metric"><span>Agent</span><b>' + t.agents + "</b></div>" +
      "</div>" +
      '<p class="asset-path" title="' + esc(t.repo) + '">' + esc(t.repo) + "</p>" +
      '<div class="asset-links">' +
        '<a class="text-link" href="' + L.meta.cardBase + t.card + L.meta.cardSuffix + '" target="_blank" rel="noopener">卡片</a>' +
        '<a class="text-link" href="' + L.meta.repoBase + t.repo + '/files?ref=master" target="_blank" rel="noopener">代码仓</a>' +
        (t.blog ? '<a class="text-link" href="' + t.blog + '" target="_blank" rel="noopener">3MS</a>' : "") +
      "</div>" +
    "</article>";
  }

  /* ---------- Lab · 工具总览 ---------- */
  function renderLabOverview() {
    var themes = panel("主题构成", "按工具卡片归并 · 合计 " + fmt(LT.loc) + " LOC",
      compositionBar(labThemeItems(), LT.loc) +
      '<p class="panel-note">AI4S 自动实验 9 个工具占 57.3%（125,783 LOC）；文旅 / AI 伴游 6 个工具占 24.1%（52,848 LOC）；AscendBridge 单工具 39,413 LOC（17.9%）；多模态模型验证 2 个工具合计 1,621 LOC（0.7%）。</p>'
    );

    var cards = panel("工具资产卡", "18 个工具 · 作者 / 规模 / 描述",
      '<div class="asset-grid">' + L.tools.map(labCard).join("") + "</div>");

    var rank = panel("工具代码量排名", "18 个工具 · 按 LOC",
      rankList(L.tools.map(function (t) {
        return {
          name: esc(t.name),
          sub: t.author + " · " + esc(t.updated) + " 更新",
          value: t.loc,
          display: fmt(t.loc),
          tone: t.loc < 1000 ? "amber" : ""
        };
      }))
    );

    $("tab-body").innerHTML = themes + cards + rank;
  }

  /* ---------- Lab · 工具明细 ---------- */
  function renderLabTools() {
    var rowsA = L.tools.map(function (t, i) {
      return "<tr><td>" + (i + 1) + "</td>" +
        td(esc(t.name), false, "tool-name") +
        td(esc(t.author)) +
        td(esc(t.updated.slice(5)), true) +
        td(fmt(t.loc), true) + td(t.agents, true) + td(t.skills, true) +
        td(t.mcp, true) + td(t.tools, true) + td(t.builders, true) +
      "</tr>";
    }).join("");
    var tableA = tableWrap(
      th("#") + th("工具名称") + th("作者") + th("更新", true) + th("代码量", true) +
      th("Agent", true) + th("Skills", true) + th("MCP", true) + th("Tools", true) + th("Builder", true),
      rowsA,
      '<tr class="row-total"><td colspan="4">合计（18 个工具）</td>' +
      '<td class="num">219,665</td><td class="num">13</td><td class="num">127</td>' +
      '<td class="num">2</td><td class="num">1</td><td class="num">1</td></tr>'
    );

    var rowsB = L.tools.map(function (t, i) {
      return "<tr><td>" + (i + 1) + "</td>" +
        td(t.card, true) + td(esc(t.name), false, "tool-name") +
        td(t.likes, true) + td(t.views, true) +
        td('<a class="repo-link" href="' + L.meta.repoBase + t.repo + '/files?ref=master" target="_blank" rel="noopener" title="' + esc(t.repo) + '">' + esc(t.repo) + "</a>") +
      "</tr>";
    }).join("");
    var tableB = tableWrap(
      th("#") + th("卡片ID", true) + th("工具名称") + th("点赞", true) + th("浏览", true) + th("CodeHub 仓库"),
      rowsB,
      '<tr class="row-total"><td colspan="3">合计（互动）</td><td class="num">77</td>' +
      '<td class="num">991</td><td>18 个仓库</td></tr>'
    );

    $("tab-body").innerHTML =
      panel("工具规模明细", "按代码量降序", tableA) +
      panel("互动与代码仓", "点赞 / 浏览 · CPXLab 仓库", tableB) +
      panel("统计口径", "来源与交叉核对", '<div class="table-wrap"><table><tbody>' +
        '<tr><td>代码量</td><td>' + esc(L.meta.locNote) + "</td></tr>" +
        '<tr><td>Git 提交</td><td>' + esc(L.meta.gitNote) + "</td></tr>" +
        '<tr><td>数据来源</td><td>' + L.meta.sources.map(function (s) { return "<code>" + esc(s) + "</code>"; }).join(" · ") + "</td></tr>" +
        '<tr><td>业务联系</td><td>' + esc(L.meta.contact) + "</td></tr>" +
        "</tbody></table></div>" +
        '<p class="panel-note">三份表格交叉核对一致：工具清单 v6 与卡片清单的 18 条工具、代码量、点赞 / 浏览完全相同；两张「作者贡献汇总」除列名（工具数 / 卡片数）外数值一致（LOC 合计 219,665、Agent 13、Skills 127、MCP 2、Tools 1、Builder 1）；「Git 提交贡献」在两张表中仅邮箱别名写法不同（c00474392@huawei.com / chenyiwei@huawei.com）。</p>'
      );
  }

  /* ---------- Lab · 作者统计 ---------- */
  function renderLabAuthors() {
    var rows = L.authors.map(function (a) {
      return "<tr><td>" + a.rank + "</td>" +
        "<td><strong>" + esc(a.name) + "</strong></td>" +
        td(a.empNo, true) +
        td(a.tools, true) + td(fmt(a.loc), true) +
        td(a.agents, true) + td(a.skills, true) + td(a.mcp, true) +
        td(a.toolsCount, true) + td(a.builders, true) +
      "</tr>";
    }).join("");
    var table = tableWrap(
      th("#") + th("作者") + th("工号", true) + th("工具数", true) + th("代码量", true) +
      th("Agent", true) + th("Skills", true) + th("MCP", true) + th("Tools", true) + th("Builder", true),
      rows,
      '<tr class="row-total"><td colspan="3">合计（8 位署名作者）</td>' +
      '<td class="num">18</td><td class="num">219,665</td><td class="num">13</td>' +
      '<td class="num">127</td><td class="num">2</td><td class="num">1</td><td class="num">1</td></tr>'
    );

    var rank = rankList(L.authors.map(function (a) {
      return {
        name: esc(a.name) + ' <span class="tag gray">' + a.empNo + "</span>",
        sub: a.tools + " 个工具 · " + a.skills + " skills · " + a.agents + " agents",
        value: a.loc,
        display: fmt(a.loc),
        tone: ""
      };
    }));

    var ownerRows = L.authors.map(function (a) {
      return "<tr><td><strong>" + esc(a.name) + "</strong></td>" +
        '<td class="tool-list">' + a.toolNames.map(function (n) {
          return '<span class="chip">' + esc(n) + "</span>";
        }).join("") + "</td></tr>";
    }).join("");
    var ownerTable = tableWrap(th("作者") + th("负责工具"), ownerRows);

    $("tab-body").innerHTML =
      panel("署名作者", "8 位 · 按代码量降序", table) +
      panel("作者贡献", "按代码量 LOC", rank +
        '<p class="panel-note">LOC 合计 219,665 与工具表一致。郑寄望（00614212）的四件工具中，「L4科学假说生成系统」48,767 LOC 与「LabBridge」12,217 LOC（5 agents / 25 skills）为主要体量；关文婷的两件工具合计 11,922 LOC，含唯一的 Tools 目录资产。</p>'
      ) +
      panel("署名作者负责工具", "按作者归属", ownerTable +
        '<p class="panel-note">署名作者是工具卡片的申报人，不等同于 Git 提交作者；Git 侧见「Git 提交」页签。</p>'
      );
  }

  /* ---------- Lab · Git 提交统计 ---------- */
  function renderLabGit() {
    var rows = L.gitAuthors.map(function (g) {
      return "<tr><td>" + g.rank + "</td>" +
        "<td><strong>" + esc(g.name) + "</strong></td>" +
        td(esc(g.email), false, "email-cell") +
        td(g.repos, true) + td(g.commits, true) +
        td("+" + fmt(g.add), true) + td("−" + fmt(g.del), true) +
        td(g.net > 0 ? "+" + fmt(g.net) : fmt(g.net), true) + td(fmt(g.codeAdd), true) +
      "</tr>";
    }).join("");
    var table = tableWrap(
      th("#") + th("Git 作者") + th("邮箱") + th("仓库数", true) + th("提交数", true) +
      th("+行", true) + th("−行", true) + th("净增", true) + th("代码新增", true),
      rows,
      '<tr class="row-total"><td colspan="3">合计</td><td class="num">22 次</td>' +
      '<td class="num">51</td><td class="num">+1,476,686</td><td class="num">−13</td>' +
      '<td class="num">+1,476,673</td><td class="num">207,840</td></tr>'
    );

    var rank = rankList(L.gitAuthors.map(function (g) {
      return {
        name: esc(g.name) + ' <span class="tag gray">' + esc(g.email) + "</span>",
        sub: g.repos + " 个仓库 · " + g.commits + " 个提交" + (g.alias ? " · 别名 " + esc(g.alias) : ""),
        value: g.codeAdd,
        display: fmt(g.codeAdd),
        tone: g.codeAdd < 100 ? "amber" : ""
      };
    }));

    $("tab-body").innerHTML =
      panel("Git 提交作者", "3 位 · 按邮箱归一化", table) +
      panel("代码新增", "按代码新增行", rank +
        '<p class="panel-note">仓库数合计 22 次，是因为同一仓库被多人提交；唯一仓库仍为 18 个（陈义伟覆盖全部 18 个）。'+ esc(L.meta.gitNote) + '</p>'
      ) +
      panel("口径提示", "与署名作者、AtomGit 的关系", '<div class="table-wrap"><table><tbody>' +
        '<tr><td>陈义伟</td><td>18 个仓库 / 45 提交 / +1,308,742 行，主要是仓库初始化提交；不在 8 位工具署名作者中，也不在 AtomGit 分支增量中</td></tr>' +
        '<tr><td>周维华</td><td>署名 4 个工具 / 3,840 LOC；Git 3 提交 / +7 −7，仓库为 ai-travel-companion-rokid-glasses</td></tr>' +
        '<tr><td>Giwme</td><td>3 个仓库 / 3 提交 / 代码新增 88,180 行，集中在 AscendBridge2、AI伴游 Rokid 眼镜与 AI伴游小向导</td></tr>' +
        '<tr><td>与 AtomGit</td><td>AtomGit 分支增量为 7 提交 / +10,442 行，统计对象是 agent-solution 单个仓库，与 Lab 的 18 仓库全量不可相加</td></tr>' +
        "</tbody></table></div>"
      );
  }

  /* ---------- 渲染调度 ---------- */
  function buildTabs() {
    var nav = $("main-tabs");
    var list = TABS[state.source];
    if (!list.length) {
      nav.innerHTML = "";
      nav.hidden = true;
      return;
    }
    nav.hidden = false;
    nav.innerHTML = list.map(function (t) {
      return '<button class="tab' + (t[0] === state.tab ? " active" : "") +
        '" type="button" data-tab="' + t[0] + '">' + t[1] + "</button>";
    }).join("");
  }

  function render() {
    renderScopeLine();
    renderBanner();
    renderSummary();
    buildTabs();
    Array.prototype.forEach.call($("source-tabs").querySelectorAll(".tab"), function (b) {
      b.classList.toggle("active", b.dataset.source === state.source);
    });

    if (state.tab === "combined") renderCombined();
    else if (state.tab === "overview") renderOverview();
    else if (state.tab === "commits") renderCommits();
    else if (state.tab === "authors") renderAuthors();
    else if (state.tab === "skills") renderSkills();
    else if (state.tab === "dirs") renderDirs();
    else if (state.tab === "code") renderCode();
    else if (state.tab === "lab-overview") renderLabOverview();
    else if (state.tab === "lab-tools") renderLabTools();
    else if (state.tab === "lab-authors") renderLabAuthors();
    else if (state.tab === "lab-git") renderLabGit();
    else renderCombined();

    syncHash();
  }

  function sourceOfTab(tab) {
    if (tab === "combined") return "combined";
    if (tab.indexOf("lab-") === 0) return "lab";
    return "branch";
  }

  function switchSource(src) {
    state.source = src;
    state.tab = DEFAULT_TAB[src];
    render();
  }

  function switchTab(tab, scroll) {
    state.source = sourceOfTab(tab);
    state.tab = tab;
    render();
    if (scroll) {
      var nav = $("main-tabs");
      var anchor = nav.hidden ? $("banner") : nav;
      var top = anchor.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    }
  }

  function syncHash() {
    var h = "#" + state.tab;
    try { history.replaceState(null, "", h); } catch (e) { /* file:// 下部分浏览器限制，忽略 */ }
  }

  /* ---------- CSV 导出 ---------- */
  function csvCell(v) {
    var s = String(v == null ? "" : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function branchCsv(lines) {
    lines.push(["# AtomGit · pub-ai4s 分支增量（不含 main 历史）", "merge-base 12735f553..HEAD", S.meta.range].map(csvCell).join(","));
    lines.push("");
    lines.push(["提交号", "邮箱", "日期", "提交信息", "文件数", "新增", "删除", "净增", "类型"].map(csvCell).join(","));
    S.commits.forEach(function (c) {
      lines.push([c.hash, authorMail(c.author), c.date, c.msg, c.files, c.add, c.del, c.net, c.type].map(csvCell).join(","));
    });
    lines.push("");
    lines.push(["邮箱", "内容提交", "合并提交", "新增", "删除", "净增", "文件数", "首次", "最近"].map(csvCell).join(","));
    S.authors.forEach(function (a) {
      lines.push([a.email, a.commits, a.merges, a.add, a.del, a.net, a.files, a.first, a.last].map(csvCell).join(","));
    });
    lines.push("");
    lines.push(["业务域", "文件数", "新增行", "占比"].map(csvCell).join(","));
    S.domains.forEach(function (d) { lines.push([d.name, d.files, d.lines, d.pct + "%"].map(csvCell).join(",")); });
    lines.push("");
    lines.push(["Skill", "业务域", "路径", "文件数", "行数", "py", "md", "config", "html"].map(csvCell).join(","));
    S.skills.forEach(function (s) {
      lines.push([s.name, s.domain, s.path, s.files, s.lines, s.py, s.md, s.config, s.html].map(csvCell).join(","));
    });
  }

  function labCsv(lines) {
    lines.push(["# Lab · " + L.meta.title + " 工具清单 " + L.meta.version,
      "代码量口径 LOC", L.meta.range].map(csvCell).join(","));
    lines.push("");
    lines.push(["卡片ID", "工具名称", "主题", "作者", "工号", "更新", "点赞", "浏览",
      "代码量", "Agent", "Skills", "MCP", "Tools", "Builder", "代码仓"].map(csvCell).join(","));
    L.tools.forEach(function (t) {
      lines.push([t.card, t.name, t.theme, t.author, t.empNo, t.updated, t.likes, t.views,
        t.loc, t.agents, t.skills, t.mcp, t.tools, t.builders, t.repo].map(csvCell).join(","));
    });
    lines.push("");
    lines.push(["排名", "署名作者", "工号", "工具数", "代码量", "Agent", "Skills", "MCP", "Tools", "Builder"]
      .map(csvCell).join(","));
    L.authors.forEach(function (a) {
      lines.push([a.rank, a.name, a.empNo, a.tools, a.loc, a.agents, a.skills, a.mcp,
        a.toolsCount, a.builders].map(csvCell).join(","));
    });
    lines.push("");
    lines.push(["排名", "Git 作者", "邮箱", "仓库数", "提交数", "新增", "删除", "净增", "代码新增"]
      .map(csvCell).join(","));
    L.gitAuthors.forEach(function (g) {
      lines.push([g.rank, g.name, g.email, g.repos, g.commits, g.add, g.del, g.net,
        g.codeAdd].map(csvCell).join(","));
    });
  }

  function exportCsv() {
    var lines = [];
    var name;
    if (state.source === "lab") {
      labCsv(lines);
      name = "ai4s-lab-tools-v6-20261112.csv";
    } else if (state.source === "branch") {
      branchCsv(lines);
      name = "ai4s-pub-branch-increment-20261110.csv";
    } else {
      lines.push(["AI4S 双源快照：AtomGit 分支增量 + Lab 工具清单 v6",
        "两套口径统计对象不同，不可相加", "2026-11-12"].map(csvCell).join(","));
      lines.push("");
      branchCsv(lines);
      lines.push("");
      lines.push("");
      labCsv(lines);
      name = "ai4s-combined-20261112.csv";
    }
    var blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
    showToast("已按当前数据源导出 CSV");
  }

  /* ---------- 弹层 / Toast ---------- */
  function modalHtml() {
    return '<div class="table-wrap"><table><tbody>' +
      "<tr><td>数据源 ①</td><td>AtomGit <code>openJiuwen/agent-solution</code> · <code>pub-ai4s</code> 相对 <code>main</code> 的分支增量，merge-base <code>12735f553..HEAD</code>；" + S.meta.range + "（" + S.meta.days + " 天）</td></tr>" +
      "<tr><td>提交 / 文件 / 行</td><td>7 个提交（内容 5 + 合并 2）；47 个文件；最终树 diff +10,442 / −0，逐提交毛量 +10,447 / −5；0 个二进制文件</td></tr>" +
      "<tr><td>合并提交</td><td>lbchw 的 !854 / !995 两个合并提交只计提交数，文件与行数不重复计入</td></tr>" +
      "<tr><td>数据源 ②</td><td>" + esc(L.meta.title) + "（" + esc(L.meta.category) + "）· 工具清单 " + L.meta.version + " · " + LT.tools + " 个 CodeHub 仓库；代码量 " + fmt(LT.loc) + " LOC；" + LT.authors + " 位署名作者 + " + LT.gitAuthors + " 位 Git 作者</td></tr>" +
      "<tr><td>Lab 计数口径</td><td>" + esc(L.meta.locNote) + "</td></tr>" +
      "<tr><td>Lab Git 口径</td><td>" + esc(L.meta.gitNote) + "</td></tr>" +
      "<tr><td>跨源关系</td><td>分支 diff 与仓库 LOC 统计对象不同，<strong>不可相加</strong>；综合总览只做并列与身份 / 产品对齐</td></tr>" +
      "<tr><td>文件来源</td><td>" + L.meta.sources.map(function (s) { return "<code>" + esc(s) + "</code>"; }).join("<br>") + "</td></tr>" +
      "<tr><td>业务联系</td><td>" + esc(L.meta.contact) + "</td></tr>" +
      "<tr><td>离线说明</td><td>无后端。「立即同步」仅提示，「配置」打开本弹层；字体已本地化，双击即可浏览</td></tr>" +
      "</tbody></table></div>" +
      "<ul>" +
      "<li>参考页为金融看板，本次只复刻其结构、视觉与交互，数据全部替换为 ai4s 与 Lab 工具清单。</li>" +
      "<li>每日 / 累计双轴图按天保留零值日期，避免伪造中间数据。</li>" +
      "<li>页签、指标卡、导出与响应式断点均与参考页保持同一套组件语言。</li>" +
      "</ul>";
  }
  var toastTimer = null;
  function showToast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function openModal() {
    $("modal-body").innerHTML = modalHtml();
    $("modal").hidden = false;
  }
  function closeModal() { $("modal").hidden = true; }

  /* ---------- 事件绑定 ---------- */
  $("source-tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab");
    if (!b) return;
    switchSource(b.dataset.source);
  });

  $("main-tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab");
    if (!b) return;
    switchTab(b.dataset.tab, false);
  });

  $("summary-strip").addEventListener("click", function (e) {
    var b = e.target.closest("[data-card-tab]");
    if (!b) return;
    switchTab(b.dataset.cardTab, true);
  });

  $("btn-refresh").addEventListener("click", function () { location.reload(); });
  $("btn-export").addEventListener("click", exportCsv);
  $("btn-sync").addEventListener("click", function () {
    showToast("静态离线快照：AtomGit 统计于 2026-11-10 18:05，Lab 工具清单 v6 同步于 2026-11-12，无同步后端。");
  });
  $("btn-config").addEventListener("click", openModal);
  $("modal-close").addEventListener("click", closeModal);
  $("modal").addEventListener("click", function (e) {
    if (e.target === $("modal")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- 初始化 ---------- */
  var hash = (location.hash || "").replace("#", "");
  var found = null;
  Object.keys(TABS).forEach(function (src) {
    TABS[src].forEach(function (t) { if (t[0] === hash) found = src; });
  });
  if (found) {
    state.source = found;
    state.tab = hash;
  }
  render();
})();
