/* Terminal de ChakibOS : un petit interpréteur de commandes sur le contenu du portfolio. */
(function () {
  "use strict";
  var I18N = window.I18N;
  var t = I18N.t;
  var L = I18N.L;

  var BANNER = [
    "  ____ _   _    _    _  _____ ____  ",
    " / ___| | | |  / \\  | |/ /_ _| __ ) ",
    "| |   | |_| | / _ \\ | ' / | ||  _ \\ ",
    "| |___|  _  |/ ___ \\| . \\ | || |_) |",
    " \\____|_| |_/_/   \\_\\_|\\_\\___|____/ "
  ];

  // Cibles acceptées par « open » (noms français et anglais) → application.
  var TARGETS = {
    projets: "projets", projects: "projets", about: "about", apropos: "about",
    competences: "competences", skills: "competences", cv: "cv", resume: "cv",
    contact: "contact", aide: "aide", help: "aide"
  };

  function D() { return window.PORTFOLIO; }

  function findProjet(q) {
    q = (q || "").toLowerCase().replace(/\/$/, "");
    var list = D().projets;
    for (var i = 0; i < list.length; i++) {
      var pr = list[i];
      var names = [pr.id, pr.nom, pr.fichier, pr.depot || ""].map(function (s) { return String(s).toLowerCase().replace(/\/$/, ""); });
      if (names.indexOf(q) !== -1) return pr;
    }
    return null;
  }

  function pad(s, n) { s = String(s); while (s.length < n) s += " "; return s; }

  window.TERMINAL = {
    init: function (body, api, win) {
      var term = body.querySelector(".term");
      var out = body.querySelector(".term__out");
      var form = body.querySelector(".term__line");
      var input = body.querySelector(".term__input");
      var history = win.termHistory || (win.termHistory = []);
      var hIndex = history.length;
      var p = D().profil;

      // Chaque ligne est créée avec textContent : la saisie n'est jamais interprétée comme du HTML.
      function print(text, cls) {
        var div = document.createElement("div");
        div.className = "term__row" + (cls ? " " + cls : "");
        div.textContent = text;
        out.appendChild(div);
        return div;
      }
      function printLink(label, url) {
        var div = document.createElement("div");
        div.className = "term__row";
        var a = document.createElement("a");
        a.href = url;
        a.textContent = label;
        if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; }
        div.appendChild(a);
        out.appendChild(div);
      }
      function blank() { print(" "); }
      function ids() { return D().projets.map(function (x) { return x.id; }); }
      function targetNames() { return Object.keys(TARGETS).filter(function (k) { return I18N.lang === "fr" ? k !== "projects" && k !== "skills" && k !== "resume" && k !== "help" : k !== "projets" && k !== "competences" && k !== "apropos" && k !== "aide"; }); }

      var commands = {
        help: {
          desc: "term.d.help",
          run: function () {
            print(t("term.available"), "t-accent");
            Object.keys(commands).forEach(function (name) {
              if (commands[name].hidden) return;
              print("  " + pad(name, 13) + t(commands[name].desc));
            });
            print(t("term.tips"), "t-dim");
          }
        },
        whoami: {
          desc: "term.d.whoami",
          run: function () {
            print(p.nom + " · " + L(p.titre), "t-bold");
            print(L(p.programme) + ", " + L(p.ecole));
            print(t("term.lookingFor", { d: I18N.liste(L(p.recherche)) }));
            print(t("term.availability", { v: L(p.disponibilite) }));
          }
        },
        neofetch: {
          desc: "term.d.neofetch",
          run: function () {
            BANNER.forEach(function (l) { print(l, "t-accent t-pre"); });
            blank();
            print("chakib@os", "t-bold");
            print(pad("OS", 16) + "ChakibOS 1.0");
            print(pad(t("term.program"), 16) + L(p.programme));
            print(pad(t("term.school"), 16) + p.ecoleCourt);
            p.specs.forEach(function (s) { print(pad(L(s.label), 16) + L(s.valeur)); });
            print(pad(t("term.status"), 16) + t("term.statusValue", { d: L(p.disponibiliteCourt) }), "t-warn");
          }
        },
        ls: {
          desc: "term.d.ls",
          run: function () {
            print(D().projets.map(function (x) { return x.fichier; }).concat([I18N.lang === "fr" ? "_a-venir/" : "_coming-soon/"]).join("    "), "t-accent");
          }
        },
        cat: {
          desc: "term.d.cat",
          run: function (args) {
            var pr = findProjet(args[0]);
            if (!pr) { print(t("term.usage", { u: "cat <" + ids().join("|") + ">" }), "t-dim"); return; }
            print(pr.nom + "  ·  " + L(pr.type) + "  ·  " + window.statut(pr.statut), "t-bold");
            print(L(pr.resume));
            print(t("term.stackLabel") + pr.pile.map(L).join(", "), "t-dim");
            if (pr.liens[0]) printLink(pr.liens[0].url.replace(/^https?:\/\//, ""), pr.liens[0].url);
          }
        },
        open: {
          desc: "term.d.open",
          run: function (args) {
            var q = (args[0] || "").toLowerCase();
            if (TARGETS[q]) { api.openApp(TARGETS[q]); print(t("term.opening", { x: q }), "t-dim"); return; }
            var pr = findProjet(q);
            if (pr) { api.openApp("projet", pr.id); print(t("term.opening", { x: pr.fichier }), "t-dim"); return; }
            print(t("term.usage", { u: "open <" + targetNames().concat(ids()).join("|") + ">" }), "t-dim");
          }
        },
        skills: {
          desc: "term.d.skills",
          run: function () {
            D().competences.forEach(function (c) {
              if (c.items.length) print(pad(L(c.cat) + (I18N.lang === "fr" ? " :" : ":"), 28) + c.items.map(L).join(", "));
            });
          }
        },
        github: {
          desc: "term.d.github",
          run: function () {
            var s = window.GITHUB ? window.GITHUB.state : { source: "none", count: 0 };
            print(t("term.github", { u: window.GITHUB ? window.GITHUB.user : "", state: t("sync." + s.source, { n: s.count }) }), "t-bold");
            D().projets.filter(function (x) { return x.gh; }).forEach(function (x) {
              var r = x.gh;
              var langs = window.GITHUB.topLangs(r).slice(0, 3).map(function (l) { return l.name; }).join(", ");
              printLink(pad(r.name, 26) + " ★ " + r.stars + "  " + langs, r.url);
            });
          }
        },
        stage: {
          desc: "term.d.stage",
          run: function () {
            print(t("term.ok1", { v: L(p.titre).toLowerCase() }), "t-ok");
            print(t("term.ok2", { v: I18N.liste(L(p.recherche), "and") }), "t-ok");
            print(t("term.ok3", { v: L(p.disponibiliteCourt) }), "t-ok");
            print(t("term.wait"), "t-warn");
          }
        },
        contact: {
          desc: "term.d.contact",
          run: function () {
            printLink(p.courriel, "mailto:" + p.courriel);
            if (p.telephone) printLink(p.telephone, "tel:" + p.telephoneLien);
            printLink(p.github.replace(/^https?:\/\//, ""), p.github);
            if (p.linkedin) printLink("LinkedIn", p.linkedin);
            print(t("term.contactHint"), "t-dim");
          }
        },
        lang: {
          desc: "term.d.lang",
          run: function (args) {
            var next = (args[0] || "").toLowerCase();
            if (next !== "fr" && next !== "en") next = I18N.lang === "fr" ? "en" : "fr";
            I18N.set(next); // Les fenêtres se redessinent dans la nouvelle langue.
          }
        },
        date: { desc: "term.d.date", run: function () { print(new Date().toLocaleString(I18N.locale())); } },
        echo: { desc: "term.d.echo", run: function (args) { print(args.join(" ")); } },
        history: { desc: "term.d.history", run: function () { history.forEach(function (h, i) { print(("   " + (i + 1)).slice(-3) + "  " + h); }); } },
        clear: { desc: "term.d.clear", run: function () { out.textContent = ""; } },
        exit: { desc: "term.d.exit", run: function () { api.close(win); } },
        competences: { hidden: true, run: function () { commands.skills.run(); } },
        sudo: { hidden: true, run: function () { print(t("term.sudo"), "t-err"); } },
        rm: { hidden: true, run: function (args) { print(args.indexOf("-rf") !== -1 ? t("term.rmrf") : t("term.rm"), "t-err"); } },
        cd: { hidden: true, run: function () { print(t("term.cd"), "t-dim"); } },
        pwd: { hidden: true, run: function () { print("/home/chakib"); } }
      };

      function run(line) {
        var trimmed = line.trim();
        var row = print("", "t-cmd");
        var prompt = document.createElement("span");
        prompt.className = "t-prompt";
        prompt.textContent = "chakib@os:~$ ";
        row.appendChild(prompt);
        row.appendChild(document.createTextNode(line));
        if (!trimmed) return;
        history.push(trimmed);
        hIndex = history.length;
        var parts = trimmed.split(/\s+/);
        var name = parts[0].toLowerCase();
        var cmd = Object.prototype.hasOwnProperty.call(commands, name) ? commands[name] : null;
        if (cmd) cmd.run(parts.slice(1));
        else print(t("term.notFound", { c: name }), "t-err");
      }

      function complete() {
        var parts = input.value.split(/\s+/);
        var pool, word;
        if (parts.length <= 1) {
          word = parts[0] || "";
          pool = Object.keys(commands).filter(function (n) { return !commands[n].hidden; });
        } else {
          word = parts[parts.length - 1];
          pool = parts[0] === "cat" ? ids() : parts[0] === "lang" ? ["fr", "en"] : targetNames().concat(ids());
        }
        var hits = pool.filter(function (n) { return n.indexOf(word.toLowerCase()) === 0; });
        if (hits.length === 1) {
          parts[parts.length - 1] = hits[0];
          input.value = parts.join(" ") + " ";
        } else if (hits.length > 1) {
          print(hits.join("    "), "t-dim");
        }
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = input.value;
        input.value = "";
        run(v);
        term.scrollTop = term.scrollHeight;
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Tab") { e.preventDefault(); complete(); }
        else if (e.key === "ArrowUp") { if (hIndex > 0) { hIndex--; input.value = history[hIndex]; } e.preventDefault(); }
        else if (e.key === "ArrowDown") {
          if (hIndex < history.length - 1) { hIndex++; input.value = history[hIndex]; } else { hIndex = history.length; input.value = ""; }
          e.preventDefault();
        }
      });
      term.addEventListener("click", function (e) {
        if (!e.target.closest("a") && !window.getSelection().toString()) input.focus();
      });

      print(t("term.welcome"), "t-dim");
      run("whoami");
      window.setTimeout(function () { if (input.isConnected) input.focus({ preventScroll: true }); }, 0);
    }
  };
})();
