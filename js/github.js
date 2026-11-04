/*
 * Synchronisation avec GitHub.
 *
 * À chaque visite, le site lit les dépôts PUBLICS de PORTFOLIO.github.utilisateur
 * avec l'API GitHub (aucun jeton, aucun serveur) :
 *   - un dépôt déjà décrit dans data.js (champ `depot`) garde son texte et reçoit les infos GitHub ;
 *   - un nouveau dépôt devient automatiquement un projet (description, langages, sujets, README) ;
 *   - les langages et les sujets (topics) mettent à jour les compétences et le résumé « À propos » ;
 *   - un dépôt supprimé ou passé en privé disparaît du site (y compris un projet de data.js) ;
 *   - le dépôt du site lui-même (<utilisateur>.github.io) n'est jamais affiché.
 * La dernière liste connue est gardée en localStorage : le bureau s'affiche tout de suite avec elle,
 * puis se met à jour dès que GitHub répond. Les requêtes sont conditionnelles (ETag) et les langages
 * ne sont relus que pour les dépôts modifiés, pour ménager la limite de l'API (60 requêtes/heure).
 * Si GitHub ne répond pas, le site utilise la dernière liste connue ou les données de data.js.
 */
(function () {
  "use strict";
  var D = window.PORTFOLIO;
  var cfg = D.github || {};
  var USER = cfg.utilisateur || "";
  var API = "https://api.github.com";
  var RAW = "https://raw.githubusercontent.com";
  var CACHE_KEY = "chakibos-github-v2";
  var SITE_REPO = (USER + ".github.io").toLowerCase();

  // Copie d'origine de data.js : chaque synchronisation repart de zéro,
  // pour qu'un dépôt retiré de GitHub disparaisse aussi du site.
  var BASE = JSON.stringify({ projets: D.projets, competences: D.competences, specs: D.profil.specs });
  function reset() {
    var b = JSON.parse(BASE);
    D.projets = b.projets;
    D.competences = b.competences;
    D.profil.specs = b.specs;
  }

  var state = { source: "none", count: 0, done: false };
  var syncPromise = null;

  // Couleurs des langages (mêmes teintes que sur GitHub).
  var COLORS = {
    "Swift": "#F05138", "Shell": "#89E051", "JavaScript": "#F1E05A", "TypeScript": "#3178C6",
    "HTML": "#E34C26", "CSS": "#663399", "SCSS": "#C6538C", "Java": "#B07219", "Kotlin": "#A97BFF",
    "Python": "#3572A5", "C": "#555555", "C++": "#F34B7D", "C#": "#178600", "Go": "#00ADD8",
    "Rust": "#DEA584", "PHP": "#4F5D95", "Ruby": "#701516", "Dockerfile": "#384D54",
    "Makefile": "#427819", "PLSQL": "#DAD8D8", "SQL": "#E38C00", "Jupyter Notebook": "#DA5B0B",
    "Vue": "#41B883", "Dart": "#00B4AB", "Objective-C": "#438EFF", "Assembly": "#6E4C13", "PowerShell": "#012456"
  };

  // Langages GitHub → compétence du site. null = ignoré.
  var LANG_MAP = {
    "Shell": ["langages", "Bash / Shell"], "HTML": ["langages", "HTML / CSS"], "CSS": ["langages", "HTML / CSS"],
    "SCSS": ["langages", "HTML / CSS"], "Dockerfile": ["outils", "Docker"], "Makefile": ["outils", "Make"],
    "CMake": ["outils", "CMake"], "PLSQL": ["bd", "PL/SQL"], "PLpgSQL": ["bd", "SQL"], "TSQL": ["bd", "SQL"],
    "Jupyter Notebook": ["langages", "Python"], "Batchfile": null, "Procfile": null, "Roff": null, "Vim Script": null
  };

  var CAT_NAMES = {
    frameworks: { fr: "Frameworks et plateformes", en: "Frameworks and platforms" },
    langages: { fr: "Langages", en: "Languages" },
    outils: { fr: "Outils et DevOps", en: "Tools and DevOps" },
    genie: { fr: "Génie logiciel", en: "Software engineering" },
    systemes: { fr: "Systèmes et réseaux", en: "Systems and networks" },
    bd: { fr: "Bases de données", en: "Databases" },
    securite: { fr: "Sécurité", en: "Security" }
  };

  /* ---------- Stockage ---------- */
  function store(kind) { try { return window[kind]; } catch (e) { return null; } }
  function readJSON(kind, key) {
    try { var v = store(kind).getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function writeJSON(kind, key, value) {
    try { store(kind).setItem(key, JSON.stringify(value)); } catch (e) { /* quota ou stockage indisponible */ }
  }

  /* ---------- API ---------- */
  // cache "no-cache" : le navigateur revalide sa copie avec l'ETag ; une réponse 304 ne compte pas dans la limite.
  function getJSON(url, ms) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 6000);
    return fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-cache", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        clearTimeout(timer);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }, function (err) { clearTimeout(timer); throw err; });
  }

  function slim(r, langs) {
    var homepage = /^https?:\/\//i.test(r.homepage || "") ? r.homepage : "";
    return {
      name: r.name,
      url: r.html_url,
      description: r.description || "",
      language: r.language || "",
      langs: langs || (r.language ? (function () { var o = {}; o[r.language] = 1; return o; })() : {}),
      topics: r.topics || [],
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      created: r.created_at || "",
      pushed: r.pushed_at || r.updated_at || "",
      homepage: homepage,
      license: r.license && r.license.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : "",
      branch: r.default_branch || "main",
      archived: !!r.archived,
      fork: !!r.fork,
      private: !!r.private
    };
  }

  // Seuls les dépôts publics, sans les forks (option), le dépôt de profil, le dépôt du site et les exclusions.
  function visible(r) {
    if (r.private) return false;
    if (r.fork && !cfg.inclureForks) return false;
    var name = r.name.toLowerCase();
    if (name === USER.toLowerCase() || name === SITE_REPO) return false;
    return !(cfg.exclure || []).some(function (n) { return n.toLowerCase() === r.name.toLowerCase(); });
  }

  // previous : dernière liste connue, pour ne relire les langages que des dépôts modifiés.
  function fetchRepos(previous) {
    var prev = {};
    (previous || []).forEach(function (r) { prev[r.name] = r; });
    var url = API + "/users/" + encodeURIComponent(USER) + "/repos?per_page=100&type=owner&sort=pushed";
    return getJSON(url).then(function (list) {
      if (!Array.isArray(list)) throw new Error("Réponse inattendue");
      var keep = list.filter(function (r) { return visible({ name: r.name, private: r.private, fork: r.fork }); });
      return Promise.all(keep.map(function (r) {
        var old = prev[r.name];
        if (old && old.langs && old.pushed === (r.pushed_at || r.updated_at)) return slim(r, old.langs);
        return getJSON(r.languages_url).catch(function () { return null; }).then(function (langs) { return slim(r, langs); });
      }));
    });
  }

  /* ---------- Fusion avec data.js ---------- */
  function topLangs(r) {
    var entries = Object.keys(r.langs || {}).map(function (k) { return [k, r.langs[k]]; });
    var total = entries.reduce(function (s, e) { return s + e[1]; }, 0) || 1;
    return entries.sort(function (a, b) { return b[1] - a[1]; }).map(function (e) {
      return { name: e[0], pct: Math.round((e[1] / total) * 1000) / 10, color: COLORS[e[0]] || "#9A9A9A" };
    });
  }

  function variants(item) {
    if (item && typeof item === "object") return [String(item.fr || "").toLowerCase(), String(item.en || "").toLowerCase()];
    return [String(item).toLowerCase()];
  }
  function sameItem(a, b) {
    var va = variants(a), vb = variants(b);
    return va.some(function (x) { return x && vb.indexOf(x) !== -1; });
  }

  function appendLanguageSpec(item) {
    var spec = (D.profil.specs || []).filter(function (s) { return s.auto === "langages"; })[0];
    if (!spec) return;
    var name = typeof item === "object" ? item.fr : item;
    function add(v) { return v.indexOf(name) === -1 ? v + " · " + name : v; }
    if (typeof spec.valeur === "string") spec.valeur = add(spec.valeur);
    else spec.valeur = { fr: add(spec.valeur.fr), en: add(spec.valeur.en) };
  }

  function addSkill(catId, item, projId) {
    var cat = D.competences.filter(function (c) { return c.id === catId; })[0];
    if (!cat) {
      cat = { id: catId, cat: CAT_NAMES[catId] || { fr: catId, en: catId }, items: [], preuves: [] };
      D.competences.push(cat);
    }
    if (item && !cat.items.some(function (i) { return sameItem(i, item); })) {
      cat.items.push(item);
      if (catId === "langages") appendLanguageSpec(item);
    }
    if (cat.preuves.indexOf(projId) === -1) cat.preuves.push(projId);
  }

  function applySkills(p) {
    var r = p.gh;
    topLangs(r).filter(function (l) { return l.pct >= 5; }).forEach(function (l) {
      var m = Object.prototype.hasOwnProperty.call(LANG_MAP, l.name) ? LANG_MAP[l.name] : ["langages", l.name];
      if (m) addSkill(m[0], m[1], p.id);
    });
    (r.topics || []).forEach(function (t) {
      var m = (cfg.sujets || {})[t];
      if (m) addSkill(m[0], m[1], p.id);
    });
  }

  // Icône d'un dépôt ajouté automatiquement : choix forcé dans data.js (github.icones), sinon déduite.
  function guessIcon(r, main) {
    var forced = (cfg.icones || {})[r.name];
    if (forced) return forced;
    var t = r.topics || [];
    var has = function (x) { return t.indexOf(x) !== -1; };
    var text = (r.name + " " + r.description).toLowerCase();
    if (has("calendar") || has("ics") || has("schedule") || /calendrier|calendar|horaire|schedule|agenda|\.ics\b/.test(text)) return "calendar";
    if (has("ios") || has("watchos") || has("android") || has("swiftui") || main === "Swift" || main === "Kotlin") return "watch";
    if (has("docker") || has("homelab") || has("self-hosted") || has("server") || has("networking") || main === "Shell" || main === "Dockerfile") return "server";
    return "code";
  }

  function autoProject(r) {
    var langs = topLangs(r);
    var main = r.language || (langs[0] && langs[0].name) || "";
    var wip = (r.topics || []).some(function (t) { return /^(wip|en-cours|work-in-progress|in-progress)$/.test(t); });
    var pile = langs.filter(function (l) { return l.pct >= 2; }).map(function (l) { return l.name; });
    (r.topics || []).forEach(function (t) {
      var m = (cfg.sujets || {})[t];
      if (m && m[1] && !pile.some(function (x) { return sameItem(x, m[1]); })) pile.push(m[1]);
    });
    var liens = [{ label: { fr: "Code source", en: "Source code" }, url: r.url }];
    if (r.homepage) liens.push({ label: { fr: "Site du projet", en: "Project website" }, url: r.homepage });
    return {
      id: "gh-" + r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      depot: r.name,
      auto: true,
      gh: r,
      nom: r.name,
      fichier: r.name + "/",
      icone: guessIcon(r, main),
      statut: r.archived ? "archive" : wip ? "en-cours" : "publie",
      annee: (r.created || "").slice(0, 4),
      type: main ? { fr: "Projet " + main, en: main + " project" } : { fr: "Dépôt GitHub", en: "GitHub repository" },
      langage: langs.slice(0, 3).map(function (l) { return l.name; }).join(" · ") || "GitHub",
      resume: r.description || { fr: "Aucune description pour l'instant.", en: "No description yet." },
      pointsForts: [],
      appris: [],
      pile: pile,
      images: [],
      liens: liens
    };
  }

  function merge(repos) {
    reset();
    var list = repos.filter(visible);
    var byName = {};
    list.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
    var used = {};
    var debut = [], fin = [];
    D.projets.forEach(function (p) {
      if (p.depot) {
        var r = byName[p.depot.toLowerCase()];
        if (!r) return; // Dépôt privé, supprimé ou renommé : le projet n'est plus affiché.
        p.gh = r;
        used[r.name.toLowerCase()] = true;
      }
      (p.fin ? fin : debut).push(p);
    });
    var auto = list.filter(function (r) { return !used[r.name.toLowerCase()]; })
      .sort(function (a, b) { return String(b.pushed).localeCompare(String(a.pushed)); })
      .map(autoProject);
    D.projets = debut.concat(auto, fin);
    D.projets.forEach(function (p) { if (p.gh) applySkills(p); });
    // Retire des preuves les projets qui ne sont plus affichés.
    var ids = D.projets.map(function (p) { return p.id; });
    D.competences.forEach(function (c) { c.preuves = c.preuves.filter(function (id) { return ids.indexOf(id) !== -1; }); });
    return list.length;
  }

  function apply(repos, source) {
    state.source = source;
    state.count = merge(repos);
    state.done = true;
    document.dispatchEvent(new CustomEvent("githubsync", { detail: state }));
  }

  /*
   * 1. S'il existe une liste connue, le site l'affiche tout de suite (la promesse est résolue).
   * 2. Dans tous les cas, GitHub est relu : la liste à jour remplace l'ancienne et l'événement
   *    « githubsync » redessine les fenêtres (un dépôt devenu privé disparaît).
   */
  function sync() {
    if (syncPromise) return syncPromise;
    if (!USER || !window.fetch) { state.done = true; syncPromise = Promise.resolve(state); return syncPromise; }
    var cached = readJSON("localStorage", CACHE_KEY);
    if (cached && (cached.user !== USER || !Array.isArray(cached.repos))) cached = null;
    if (cached) apply(cached.repos, "cache");
    var refresh = fetchRepos(cached && cached.repos).then(function (repos) {
      writeJSON("localStorage", CACHE_KEY, { user: USER, at: Date.now(), repos: repos });
      apply(repos, "api");
      return state;
    }).catch(function () {
      if (!cached) { state.source = "none"; state.done = true; }
      return state;
    });
    syncPromise = cached ? Promise.resolve(state) : refresh;
    state.refresh = refresh;
    return syncPromise;
  }

  /* ---------- README : Markdown → HTML filtré ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function inline(s) {
    var stash = [];
    function keep(html) { stash.push(html); return "\u0000" + (stash.length - 1) + "\u0000"; }
    s = s.replace(/`([^`]+)`/g, function (m, c) { return keep("<code>" + esc(c) + "</code>"); });
    s = s.replace(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/g, function (m, alt, src) {
      return '<img src="' + esc(src) + '" alt="' + esc(alt) + '">';
    });
    s = s.replace(/\[((?:[^\[\]]|\[[^\]]*\])*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g, function (m, text, href) {
      return '<a href="' + esc(href) + '">' + text + "</a>";
    });
    s = s.replace(/<(https?:\/\/[^>\s]+)>/g, function (m, u) { return '<a href="' + esc(u) + '">' + esc(u) + "</a>"; });
    s = s.replace(/<\/?[a-zA-Z][^>]*>/g, function (tag) { return keep(tag); }); // protège les balises
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/(^|[^\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    for (var k = 0; k < 3; k++) s = s.replace(/\u0000(\d+)\u0000/g, function (m, n) { return stash[+n]; });
    return s;
  }

  function cells(line) {
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) { return c.trim(); });
  }
  function indentOf(l) { return l.match(/^\s*/)[0].replace(/\t/g, "    ").length; }

  var LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

  function parseList(lines, i) {
    var first = lines[i].match(LIST_RE);
    var base = indentOf(lines[i]);
    var ordered = /\d/.test(first[2]);
    var items = [];
    while (i < lines.length) {
      var l = lines[i];
      if (!l.trim()) {
        var nx = lines[i + 1];
        if (nx !== undefined && nx.trim() && indentOf(nx) >= base && (LIST_RE.test(nx) && indentOf(nx) === base || indentOf(nx) > base)) { i++; continue; }
        break;
      }
      var m = l.match(LIST_RE);
      var ind = indentOf(l);
      if (m && ind === base) { items.push({ text: [m[3]], sub: "" }); i++; continue; }
      if (ind > base && items.length) {
        if (m) { var sub = parseList(lines, i); items[items.length - 1].sub += sub.html; i = sub.next; continue; }
        items[items.length - 1].text.push(l.trim()); i++; continue;
      }
      if (!m && items.length && ind >= base && !/^(#{1,6}\s|\s*\||\s*```|\s*<)/.test(l)) { items[items.length - 1].text.push(l.trim()); i++; continue; }
      break;
    }
    var tag = ordered ? "ol" : "ul";
    var html = "<" + tag + ">" + items.map(function (it) {
      var txt = it.text.join(" ");
      var task = txt.match(/^\[([ xX])\]\s+(.*)$/);
      if (task) txt = (task[1] === " " ? "☐ " : "☑ ") + task[2];
      return "<li>" + inline(txt) + it.sub + "</li>";
    }).join("") + "</" + tag + ">";
    return { html: html, next: i };
  }

  var TABLE_SEP = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;
  var BLOCK_START = /^(#{1,6}\s|\s*(```|~~~)|\s*>|\s*([-*+]|\d+[.)])\s+|\s*<(p|div|table|img|h\d|details|picture|br|ul|ol)\b)/i;

  function markdown(md) {
    var lines = md.replace(/\r\n?/g, "\n").split("\n");
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      var fence = line.match(/^\s*(```|~~~)\s*([\w+#-]*)/);
      if (fence) {
        var code = [];
        i++;
        while (i < lines.length && lines[i].trim().indexOf(fence[1]) !== 0) { code.push(lines[i]); i++; }
        i++;
        out.push("<pre><code" + (fence[2] ? ' class="lang-' + esc(fence[2]) + '"' : "") + ">" + esc(code.join("\n")) + "</code></pre>");
        continue;
      }
      if (!line.trim()) { i++; continue; }
      var h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
      if (h) { out.push("<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">"); i++; continue; }
      if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
      if (/^\s*<\/?[a-zA-Z][^>]*>/.test(line)) {
        var block = [];
        while (i < lines.length && lines[i].trim()) { block.push(lines[i]); i++; }
        out.push(block.join("\n"));
        continue;
      }
      if (/^\s*>/.test(line)) {
        var quote = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) { quote.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
        out.push("<blockquote>" + markdown(quote.join("\n")) + "</blockquote>");
        continue;
      }
      if (line.indexOf("|") !== -1 && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
        var head = cells(line);
        var aligns = cells(lines[i + 1]).map(function (c) {
          return /^:-+:$/.test(c) ? "center" : /-+:$/.test(c) ? "right" : "";
        });
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].indexOf("|") !== -1 && lines[i].trim()) { rows.push(cells(lines[i])); i++; }
        var td = function (tag, c, k) { return "<" + tag + (aligns[k] ? ' align="' + aligns[k] + '"' : "") + ">" + inline(c || "") + "</" + tag + ">"; };
        out.push("<table><thead><tr>" + head.map(function (c, k) { return td("th", c, k); }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) { return "<tr>" + head.map(function (x, k) { return td("td", r[k], k); }).join("") + "</tr>"; }).join("") +
          "</tbody></table>");
        continue;
      }
      if (LIST_RE.test(line)) {
        var list = parseList(lines, i);
        out.push(list.html);
        i = list.next;
        continue;
      }
      var para = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i]) &&
        !(lines[i].indexOf("|") !== -1 && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1]))) { para.push(lines[i]); i++; }
      out.push("<p>" + para.map(function (l, k) {
        var br = k < para.length - 1 && (/ {2,}$/.test(l) || /\\$/.test(l)) ? "<br>" : "";
        return inline(l.trim().replace(/\\$/, "")) + br;
      }).join(" ") + "</p>");
    }
    return out.join("\n");
  }

  // Filtre HTML : liste blanche de balises et d'attributs, liens et images résolus vers GitHub.
  var ALLOWED = {
    A: ["href", "title"], IMG: ["src", "alt", "title", "width", "height", "align"],
    P: ["align"], DIV: ["align"], CENTER: [], H1: ["align"], H2: ["align"], H3: ["align"], H4: [], H5: [], H6: [],
    UL: [], OL: ["start"], LI: [], DL: [], DT: [], DD: [], STRONG: [], B: [], EM: [], I: [], DEL: [], S: [],
    CODE: ["class"], PRE: [], KBD: [], BLOCKQUOTE: [], HR: [], BR: [], SUB: [], SUP: [], SMALL: [], SPAN: [],
    TABLE: [], THEAD: [], TBODY: [], TR: [], TH: ["align", "colspan", "rowspan"], TD: ["align", "colspan", "rowspan"],
    DETAILS: ["open"], SUMMARY: []
  };
  var DROP = /^(SCRIPT|STYLE|IFRAME|FRAME|OBJECT|EMBED|FORM|INPUT|BUTTON|TEXTAREA|SELECT|OPTION|LINK|META|BASE|SVG|MATH|NOSCRIPT|TEMPLATE|VIDEO|AUDIO|SOURCE|TRACK|TITLE|HEAD|CANVAS|DIALOG)$/;

  function resolveUrl(u, base) {
    if (!u) return null;
    u = u.trim();
    if (/^(javascript|data|vbscript|file):/i.test(u)) return null;
    if (u.charAt(0) === "#") return null;
    if (/^(https?:|mailto:)/i.test(u)) return u;
    try { return new URL(u, base).href; } catch (e) { return null; }
  }

  function unwrap(el) {
    while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
    el.remove();
  }

  function clean(node, bases) {
    Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
      if (ch.nodeType === 3) return;
      if (ch.nodeType !== 1) { ch.remove(); return; }
      var tag = ch.tagName;
      if (DROP.test(tag)) { ch.remove(); return; }
      clean(ch, bases);
      if (!ALLOWED[tag]) { unwrap(ch); return; }
      Array.prototype.slice.call(ch.attributes).forEach(function (a) {
        if (ALLOWED[tag].indexOf(a.name.toLowerCase()) === -1) ch.removeAttribute(a.name);
      });
      if (tag === "A") {
        var href = resolveUrl(ch.getAttribute("href"), bases.blob);
        if (!href) { ch.removeAttribute("href"); }
        else { ch.setAttribute("href", href); ch.setAttribute("target", "_blank"); ch.setAttribute("rel", "noopener noreferrer"); }
      } else if (tag === "IMG") {
        var src = resolveUrl(ch.getAttribute("src"), bases.raw);
        if (!src || /^mailto:/i.test(src)) { ch.remove(); return; }
        ch.setAttribute("src", src);
        ch.setAttribute("loading", "lazy");
        ch.setAttribute("referrerpolicy", "no-referrer");
      } else if (tag === "CODE" && ch.getAttribute("class") && !/^lang-[\w+#-]+$/.test(ch.getAttribute("class"))) {
        ch.removeAttribute("class");
      }
    });
  }

  function sanitize(html, bases) {
    var doc = new DOMParser().parseFromString("<!doctype html><html><body>" + html + "</body></html>", "text/html");
    clean(doc.body, bases);
    return doc.body.innerHTML;
  }

  function plain(s) {
    return s.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/`([^`]*)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1")
      .replace(/(^|\s)[*_]([^*_]+)[*_](?=\s|$|[.,;:!?])/g, "$1$2").replace(/<[^>]+>/g, "").trim();
  }

  // Points forts : la liste qui suit un titre « Features », « Fonctionnalités », « Highlights »…
  function highlights(md) {
    var lines = md.replace(/\r\n?/g, "\n").split("\n");
    var start = -1, level = 0, items = [];
    for (var i = 0; i < lines.length; i++) {
      var h = lines[i].match(/^(#{1,4})\s+(.*)$/);
      if (h && /(features?|fonctionnalit|highlights?|points? forts?|caract[ée]ristiques|what it does)/i.test(h[2])) {
        start = i + 1; level = h[1].length; break;
      }
    }
    if (start < 0) return items;
    for (var j = start; j < lines.length && items.length < 8; j++) {
      var hh = lines[j].match(/^(#{1,6})\s/);
      if (hh && hh[1].length <= level) break;
      var m = lines[j].match(/^[-*+]\s+(.*)$/);
      if (m) { var txt = plain(m[1]); if (txt) items.push(txt); }
    }
    return items;
  }

  function readme(p) {
    var r = p && p.gh;
    if (!r) return Promise.reject(new Error("Pas de dépôt"));
    var raw = RAW + "/" + USER + "/" + r.name + "/" + encodeURIComponent(r.branch) + "/";
    var bases = { raw: raw, blob: "https://github.com/" + USER + "/" + r.name + "/blob/" + encodeURIComponent(r.branch) + "/" };
    var key = "chakibos-readme:" + r.name + ":" + r.pushed;
    function build(md) { return { html: sanitize(markdown(md), bases), highlights: highlights(md) }; }
    var cached = readJSON("sessionStorage", key);
    if (typeof cached === "string") return Promise.resolve(build(cached));
    var names = ["README.md", "readme.md", "Readme.md", "README.MD", "README"];
    function attempt(k) {
      if (k >= names.length) return Promise.reject(new Error("README introuvable"));
      return fetch(raw + names[k]).then(function (res) { return res.ok ? res.text() : attempt(k + 1); });
    }
    return attempt(0).then(function (md) { writeJSON("sessionStorage", key, md); return build(md); });
  }

  window.GITHUB = {
    sync: sync,
    readme: readme,
    state: state,
    topLangs: topLangs,
    user: USER,
    // Exposés pour les tests.
    _markdown: function (md, bases) { return sanitize(markdown(md), bases || { raw: RAW + "/", blob: "https://github.com/" }); },
    _highlights: highlights
  };
})();
