/* Agent Store AI4S 看板 · 交互与图表渲染
 * 纯静态：无依赖、无后端，数据来自 assets/data.js
 */
(function () {
  "use strict";

  var S = window.AI4S_DATA;
  var T = S.totals;
  var state = { tab: "overview" };

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

  /* ---------- 顶栏 / 指标卡 / 横幅 ---------- */
  function renderSummary() {
    var cards = [
      { label: "提交", value: String(T.commits), unit: "内容 5 · 合并 2", tab: "commits" },
      { label: "文件", value: String(T.files), unit: "分支变更文件", tab: "dirs" },
      { label: "新增行", value: fmt(T.add), unit: "删除 " + T.del + " 行", tab: "code" },
      { label: "Skills", value: String(S.skills.length), unit: "新增技能目录", tab: "skills" },
      { label: "作者", value: "2", unit: "另有 1 人仅合并", tab: "authors" },
      { label: "业务域", value: String(S.domains.length), unit: "AI-CHEM · ai-bio", tab: "dirs" },
      { label: "代码量", value: fmt(T.add), unit: "行 · 增删合计", tab: "code", total: true }
    ];
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
    $("banner").innerHTML = '<div class="banner scope">' +
      '<span class="tag">分支增量，不含 main 历史</span>' +
      "<span><strong>统计范围</strong> merge-base <code>12735f553..HEAD</code> · " + S.meta.range +
      "（" + S.meta.days + " 天）· 7 个提交（5 内容 + 2 合并）· " + T.files +
      " 个文件 · <code>+" + fmt(T.add) + " / −" + T.del + "</code></span>" +
      "</div>";
  }

  /* ---------- 总览 ---------- */
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

    var domainItems = S.domains.map(function (d) {
      return { name: d.name + "（" + d.files + " 文件）", value: d.lines, color: d.color, pct: d.pct };
    });
    var domains = panel("业务域占比", "按新增行 · 合计 " + fmt(T.add) + " 行",
      compositionBar(domainItems, T.add) +
      '<p class="panel-note">AI-CHEM 的 67.1%（7,002 行）中，debateclaw-mcp-ws 占 6,958 行（域内 99.4%）；ai-bio 的 32.9%（3,440 行）以 bio-graphrag 服务（2,446 行）和 2 个抗体技能（944 行）为主。</p>'
    );

    var catItems = S.categories.map(function (c) {
      return { name: c.name + "（" + c.files + " 文件）", value: c.lines, color: c.color, pct: c.pct };
    });
    var cats = panel("代码类别", "按新增行 · Skill 占 75.7%",
      compositionBar(catItems, T.add) +
      '<p class="panel-note">21 个 skill 文件贡献 7,902 行；其余 26 个文件（服务代码、补丁、许可证、文档、配置）合计 2,540 行。</p>'
    );

    $("tab-body").innerHTML = '<div class="overview">' + charts + domains + cats + "</div>";
  }

  /* ---------- 提交统计 ---------- */
  function renderCommits() {
    var rows = S.commits.map(function (c, i) {
      var isMerge = c.type === "合并";
      return '<tr class="' + (isMerge ? "row-merge" : "") + '">' +
        "<td>" + (i + 1) + "</td>" +
        '<td><span class="commit-hash">' + c.hash + "</span></td>" +
        "<td>" + esc(authorMail(c.author)) +
        (isMerge ? ' <span class="tag warn">合并</span>' : "") + "</td>" +
        '<td class="num">' + esc(c.date.slice(5)) + "</td>" +
        '<td class="commit-msg">' + esc(c.msg) + "</td>" +
        '<td class="num">' + c.files + "</td>" +
        '<td class="num">+' + fmt(c.add) + "</td>" +
        '<td class="num">−' + fmt(c.del) + "</td>" +
      "</tr>";
    }).join("");

    var table = '<div class="table-wrap"><table>' +
      "<thead><tr><th>#</th><th>提交号</th><th>邮箱</th><th class=\"num\">日期</th>" +
      "<th>提交信息</th><th class=\"num\">文件数</th><th class=\"num\">+行</th>" +
      "<th class=\"num\">−行</th></tr></thead>" +
      "<tbody>" + rows +
      '<tr class="row-total"><td colspan="5">合计（最终树 diff，合并提交不重复计入）</td>' +
      '<td class="num">47</td><td class="num">+10,442</td><td class="num">−0</td></tr>' +
      "</tbody></table></div>";

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
      panel("提交明细", "7 个提交 · 5 内容 + 2 合并", table,
        "") +
      panel("提交规模（内容提交）", "按新增行 · 合并提交不计入",
        rank +
        '<p class="panel-note">lbchw 的 2 个提交均为合并提交（!854 / !995），只增加提交数，行数按首父差异不重复计入；ww0205 的两次 README 改写合计产生 5 行删除，因此逐提交毛量为 +10,447 / −5，最终树净增仍为 10,442。</p>'
      );
  }

  /* ---------- 作者统计 ---------- */
  function renderAuthors() {
    var rows = S.authors.map(function (a) {
      return '<tr class="' + (a.mergeOnly ? "row-merge" : "") + '">' +
        "<td><strong>" + esc(a.email) + "</strong>" +
        (a.mergeOnly ? ' <span class="tag warn">仅合并</span>' : "") + "</td>" +
        '<td class="num">' + a.commits + "</td>" +
        '<td class="num">' + a.merges + "</td>" +
        '<td class="num">+' + fmt(a.add) + "</td>" +
        '<td class="num">−' + fmt(a.del) + "</td>" +
        '<td class="num">+' + fmt(a.net) + "</td>" +
        '<td class="num">' + a.files + "</td>" +
        '<td class="num">' + esc(a.first.slice(5)) + "</td>" +
        '<td class="num">' + esc(a.last.slice(5)) + "</td>" +
      "</tr>";
    }).join("");

    var table = '<div class="table-wrap"><table>' +
      "<thead><tr><th>邮箱</th><th class=\"num\">内容提交</th>" +
      "<th class=\"num\">合并提交</th><th class=\"num\">+行</th><th class=\"num\">−行</th>" +
      "<th class=\"num\">净增</th><th class=\"num\">文件数</th><th class=\"num\">首次提交</th>" +
      "<th class=\"num\">最近提交</th></tr></thead><tbody>" + rows +
      '<tr class="row-total"><td colspan="1">合计（内容提交）</td><td class="num">5</td>' +
      '<td class="num">0</td><td class="num">+10,447</td><td class="num">−5</td>' +
      '<td class="num">+10,442</td><td class="num">47</td><td class="num">—</td>' +
      '<td class="num">—</td></tr></tbody></table></div>';

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

  /* ---------- Skills 统计 ---------- */
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
        '<td class="num">' + s.files + "</td>" +
        '<td class="num">' + fmt(s.lines) + "</td>" +
        '<td class="num">' + fmt(s.py) + "</td>" +
        '<td class="num">' + fmt(s.md) + "</td>" +
        '<td class="num">' + fmt(s.config) + "</td>" +
        '<td class="num">' + fmt(s.html) + "</td>" +
        '<td class="num">' + fmt(s.other) + "</td></tr>";
    }).join("");

    var table = '<div class="table-wrap"><table>' +
      "<thead><tr><th>#</th><th>Skill</th><th>业务域</th><th class=\"num\">文件</th>" +
      "<th class=\"num\">行数</th><th class=\"num\">py</th><th class=\"num\">md</th>" +
      "<th class=\"num\">config</th><th class=\"num\">html</th><th class=\"num\">其他</th>" +
      "</tr></thead><tbody>" + rows +
      '<tr class="row-total"><td colspan="3">合计（3 个新增 skill）</td>' +
      '<td class="num">21</td><td class="num">7,902</td><td class="num">6,115</td>' +
      '<td class="num">1,294</td><td class="num">172</td><td class="num">321</td>' +
      '<td class="num">0</td></tr></tbody></table></div>';

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

  /* ---------- 目录统计 ---------- */
  function renderDirs() {
    var domainRows = S.domains.map(function (d) {
      return "<tr><td><strong>" + d.name + "</strong></td>" +
        '<td class="num">' + d.files + "</td>" +
        '<td class="num">' + fmt(d.lines) + "</td>" +
        '<td class="num">' + d.pct.toFixed(1) + "%</td></tr>";
    }).join("");
    var domainTable = '<div class="table-wrap"><table>' +
      '<thead><tr><th>顶层目录</th><th class="num">文件数</th><th class="num">新增行</th>' +
      '<th class="num">占比</th></tr></thead><tbody>' + domainRows +
      '<tr class="row-total"><td>合计</td><td class="num">47</td><td class="num">10,442</td>' +
      '<td class="num">100.0%</td></tr></tbody></table></div>';

    var childRows = S.domains.map(function (d) {
      return d.children.map(function (c, i) {
        return "<tr>" +
          (i === 0 ? '<td class="team-merged" rowspan="' + d.children.length + '">' + d.name + "</td>" : "") +
          '<td class="commit-msg">' + esc(c.name) + "</td>" +
          '<td class="num">' + c.files + "</td>" +
          '<td class="num">' + fmt(c.lines) + "</td>" +
          '<td class="num">' + pct(c.lines, d.lines) + "</td></tr>";
      }).join("");
    }).join("");
    var childTable = '<div class="table-wrap"><table>' +
      '<thead><tr><th>业务域</th><th>路径</th><th class="num">文件数</th>' +
      '<th class="num">新增行</th><th class="num">域内占比</th></tr></thead><tbody>' + childRows +
      "</tbody></table></div>";

    var typeRows = S.fileTypes.map(function (t) {
      return "<tr><td>" + esc(t.name) + "</td>" +
        '<td class="num">' + t.files + "</td>" +
        '<td class="num">' + fmt(t.lines) + "</td></tr>";
    }).join("");
    var typeTable = '<div class="table-wrap"><table>' +
      '<thead><tr><th>类型</th><th class="num">文件</th><th class="num">行数</th>' +
      "</tr></thead><tbody>" + typeRows +
      '<tr class="row-total"><td>合计（非 skill）</td><td class="num">26</td>' +
      '<td class="num">2,540</td></tr></tbody></table></div>';

    var skillTypeRows = S.skillTypes.map(function (t) {
      return "<tr><td>" + esc(t.name) + "</td>" +
        '<td class="num">' + fmt(t.lines) + "</td>" +
        '<td class="num">' + pct(t.lines, 7902) + "</td></tr>";
    }).join("");
    var skillTypeTable = '<div class="table-wrap"><table>' +
      '<thead><tr><th>Skill 文件类型</th><th class="num">行数</th><th class="num">占比</th>' +
      "</tr></thead><tbody>" + skillTypeRows +
      '<tr class="row-total"><td>合计</td><td class="num">7,902</td>' +
      '<td class="num">100.0%</td></tr></tbody></table></div>';

    $("tab-body").innerHTML =
      panel("顶层目录", "2 个业务域 · 其他顶层路径 0 个",
        compositionBar(S.domains.map(function (d) {
          return { name: d.name + "（" + d.files + " 文件）", value: d.lines, color: d.color };
        }), T.add) + domainTable) +
      panel("目录细分", "业务域 → 子目录", childTable,
        "") +
      panel("文件类型", "非 skill 26 个文件 / 2,540 行 · skill 21 个文件 / 7,902 行",
        '<div class="split">' +
          '<div>' + typeTable + "</div>" +
          '<div>' + skillTypeTable + "</div>" +
        "</div>"
      );
  }

  /* ---------- 代码量统计 ---------- */
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

    var checks = '<div class="table-wrap"><table>' +
      "<tbody>" +
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

  /* ---------- 渲染调度 ---------- */
  function render() {
    renderBanner();
    renderSummary();
    Array.prototype.forEach.call($("main-tabs").querySelectorAll(".tab"), function (b) {
      b.classList.toggle("active", b.dataset.tab === state.tab);
    });
    if (state.tab === "commits") renderCommits();
    else if (state.tab === "authors") renderAuthors();
    else if (state.tab === "skills") renderSkills();
    else if (state.tab === "dirs") renderDirs();
    else if (state.tab === "code") renderCode();
    else renderOverview();
    syncHash();
  }

  function switchTab(tab, scroll) {
    state.tab = tab;
    render();
    if (scroll) {
      var top = $("main-tabs").getBoundingClientRect().top + window.pageYOffset - 12;
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
  function exportCsv() {
    var lines = [];
    lines.push(["分支增量，不含 main 历史", "merge-base 12735f553..HEAD", S.meta.range].map(csvCell).join(","));
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
    var blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "ai4s-pub-branch-increment-20261110.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
    showToast("已按当前口径导出 CSV");
  }

  /* ---------- 弹层 / Toast ---------- */
  function modalHtml() {
    return '<div class="table-wrap"><table><tbody>' +
      "<tr><td>统计范围</td><td><code>pub-ai4s</code> 相对 <code>main</code> 的分支增量，merge-base <code>12735f553..HEAD</code>；" + S.meta.range + "（" + S.meta.days + " 天）</td></tr>" +
      "<tr><td>提交数</td><td>7 个（内容 5 + 合并 2）</td></tr>" +
      "<tr><td>文件 / 行</td><td>47 个文件；最终树 diff +10,442 / −0，净增 10,442 行；0 个二进制文件</td></tr>" +
      "<tr><td>逐提交毛量</td><td>+10,447 / −5；差 5 行来自 <code>AI-CHEM/README.md</code> 两次改写，净增不变</td></tr>" +
      "<tr><td>合并提交</td><td>lbchw 的 !854 / !995 两个合并提交只计提交数，文件与行数不重复计入</td></tr>" +
      "<tr><td>数据来源</td><td>AtomGit <code>openJiuwen/agent-solution</code>；脚本 <code>analysis-agent/branch_scope_stats.py</code></td></tr>" +
      "<tr><td>离线说明</td><td>无后端。「立即同步」仅提示，「配置」打开本弹层；字体已本地化，双击即可浏览</td></tr>" +
      "</tbody></table></div>" +
      "<ul>" +
      "<li>参考页为金融看板，本次只复刻其结构、视觉与交互，数据全部替换为 ai4s。</li>" +
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
    showToast("静态离线快照：数据统计于 2026-11-10 18:05 +08:00，无同步后端。");
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
  if (["overview", "commits", "authors", "skills", "dirs", "code"].indexOf(hash) >= 0) {
    state.tab = hash;
  }
  render();
})();
