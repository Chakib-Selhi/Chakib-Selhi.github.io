/* Terminal de ChakibOS : un petit interpréteur de commandes sur le contenu du portfolio. */
(function () {
  "use strict";
  var D = window.PORTFOLIO;
  var p = D.profil;

  var BANNER = [
    "  ____ _   _    _    _  _____ ____  ",
    " / ___| | | |  / \\  | |/ /_ _| __ ) ",
    "| |   | |_| | / _ \\ | ' / | ||  _ \\ ",
    "| |___|  _  |/ ___ \\| . \\ | || |_) |",
    " \\____|_| |_/_/   \\_\\_|\\_\\___|____/ "
  ];

  // Cibles acceptées par « open » : applications et projets.
  var APP_TARGETS = ["projets", "about", "competences", "cv", "contact", "aide"];

  function findProjet(q) {
    q = (q || "").toLowerCase().replace(/\/$/, "");
    for (var i = 0; i < D.projets.length; i++) {
      var pr = D.projets[i];
      var names = [pr.id, pr.nom, pr.fichier].map(function (s) { return s.toLowerCase().replace(/\/$/, ""); });
      if (names.indexOf(q) !== -1) return pr;
    }
    return null;
  }

  window.TERMINAL = {
    init: function (body, api, win) {
      var out = body.querySelector(".term__out");
      var form = body.querySelector(".term__line");
      var input = body.querySelector(".term__input");
      var history = [];
      var hIndex = 0;

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
        a.href = url; a.textContent = label;
        if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; }
        div.appendChild(a);
        out.appendChild(div);
      }
      function blank() { print(" "); }

      var commands = {
        help: {
          desc: "liste des commandes",
          run: function () {
            print("Commandes disponibles :", "t-accent");
            Object.keys(commands).forEach(function (name) {
              if (commands[name].hidden) return;
              print("  " + (name + "            ").slice(0, 13) + commands[name].desc);
            });
            print("Astuces : Tab complète, ↑ ↓ parcourent l'historique.", "t-dim");
          }
        },
        whoami: {
          desc: "qui suis-je",
          run: function () {
            print(p.nom + " · " + p.titre, "t-bold");
            print(p.programme + ", " + p.ecole);
            print("Recherche : stage en " + window.listeFr(p.recherche));
            print("Disponibilité : " + p.disponibilite);
          }
        },
        neofetch: {
          desc: "fiche système",
          run: function () {
            BANNER.forEach(function (l) { print(l, "t-accent t-pre"); });
            blank();
            print("chakib@os", "t-bold");
            print("OS".padEnd(16) + "ChakibOS 1.0");
            print("Programme".padEnd(16) + p.programme);
            print("École".padEnd(16) + p.ecoleCourt);
            p.specs.forEach(function (s) { print(s[0].padEnd(16) + s[1]); });
            print("Statut".padEnd(16) + "cherche un stage · " + p.disponibiliteCourt, "t-warn");
          }
        },
        ls: {
          desc: "liste les projets",
          run: function () {
            print(D.projets.map(function (x) { return x.fichier; }).concat(["_a-venir/"]).join("    "), "t-accent");
          }
        },
        cat: {
          desc: "cat <projet> : résumé d'un projet",
          run: function (args) {
            var pr = findProjet(args[0]);
            if (!pr) { print("usage : cat <" + D.projets.map(function (x) { return x.id; }).join("|") + ">", "t-dim"); return; }
            print(pr.nom + "  ·  " + pr.type + "  ·  " + (window.STATUTS[pr.statut] || pr.statut), "t-bold");
            print(pr.resume);
            print("Pile : " + pr.pile.join(", "), "t-dim");
            if (pr.liens[0]) printLink(pr.liens[0].url.replace(/^https?:\/\//, ""), pr.liens[0].url);
          }
        },
        open: {
          desc: "open <fenêtre|projet>",
          run: function (args) {
            var t = (args[0] || "").toLowerCase();
            if (APP_TARGETS.indexOf(t) !== -1) { api.openApp(t); print("Ouverture de " + t + "…", "t-dim"); return; }
            var pr = findProjet(t);
            if (pr) { api.openApp("projet", pr.id); print("Ouverture de " + pr.fichier + "…", "t-dim"); return; }
            print("usage : open <" + APP_TARGETS.concat(D.projets.map(function (x) { return x.id; })).join("|") + ">", "t-dim");
          }
        },
        competences: {
          desc: "pile technique",
          run: function () {
            D.competences.forEach(function (c) { print((c.cat + " :").padEnd(26) + c.items.join(", ")); });
          }
        },
        stage: {
          desc: "état de ma recherche de stage",
          run: function () {
            print("[ OK ] Profil chargé : " + p.titre.toLowerCase(), "t-ok");
            print("[ OK ] Domaines : " + window.listeFr(p.recherche, "et"), "t-ok");
            print("[ OK ] Disponibilité : " + p.disponibiliteCourt, "t-ok");
            print("[ .. ] En attente de votre offre. Tapez « contact ».", "t-warn");
          }
        },
        contact: {
          desc: "me joindre",
          run: function () {
            printLink(p.courriel, "mailto:" + p.courriel);
            if (p.telephone) printLink(p.telephone, "tel:" + p.telephoneLien);
            printLink(p.github.replace(/^https?:\/\//, ""), p.github);
            if (p.linkedin) printLink("LinkedIn", p.linkedin);
            print("Ou tapez « open contact » pour écrire un message.", "t-dim");
          }
        },
        date: { desc: "date et heure", run: function () { print(new Date().toLocaleString("fr-CA")); } },
        echo: { desc: "affiche un texte", run: function (args) { print(args.join(" ")); } },
        history: { desc: "historique", run: function () { history.forEach(function (h, i) { print(String(i + 1).padStart(3) + "  " + h); }); } },
        clear: { desc: "efface l'écran", run: function () { out.textContent = ""; } },
        exit: { desc: "ferme le terminal", run: function () { api.close(win); } },
        sudo: { hidden: true, run: function () { print("Permission refusée : les droits sudo sont accordés après l'entrevue.", "t-err"); } },
        rm: { hidden: true, run: function (args) { print(args.indexOf("-rf") !== -1 ? "Bien tenté. Ce système est en lecture seule." : "rm : opération non permise", "t-err"); } },
        cd: { hidden: true, run: function () { print("Pas besoin de cd ici : essayez « open projets ».", "t-dim"); } },
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
        var cmd = commands[name];
        if (cmd) cmd.run(parts.slice(1));
        else print(name + " : commande introuvable. Tapez « help ».", "t-err");
      }

      function complete() {
        var v = input.value;
        var parts = v.split(/\s+/);
        var pool, word;
        if (parts.length <= 1) {
          word = parts[0] || "";
          pool = Object.keys(commands).filter(function (n) { return !commands[n].hidden; });
        } else {
          word = parts[parts.length - 1];
          pool = parts[0] === "cat" ? D.projets.map(function (x) { return x.id; }) : APP_TARGETS.concat(D.projets.map(function (x) { return x.id; }));
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
        out.parentNode.scrollTop = out.parentNode.scrollHeight;
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Tab") { e.preventDefault(); complete(); }
        else if (e.key === "ArrowUp") { if (hIndex > 0) { hIndex--; input.value = history[hIndex]; } e.preventDefault(); }
        else if (e.key === "ArrowDown") { if (hIndex < history.length - 1) { hIndex++; input.value = history[hIndex]; } else { hIndex = history.length; input.value = ""; } e.preventDefault(); }
      });
      body.addEventListener("click", function (e) {
        if (!e.target.closest("a") && !window.getSelection().toString()) input.focus();
      });

      print("ChakibOS Terminal 1.0. Tapez « help » pour commencer, ou « neofetch ».", "t-dim");
      run("whoami");
      window.setTimeout(function () { input.focus({ preventScroll: true }); }, 0);
    }
  };
})();
