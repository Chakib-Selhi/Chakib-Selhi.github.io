/*
 * Applications de ChakibOS.
 * Chaque application déclare : title, size [largeur, hauteur], pos (optionnel),
 * render(arg) qui renvoie le HTML du contenu, et mount(body, api, win) (optionnel)
 * pour brancher les interactions. key(arg) permet plusieurs fenêtres du même type.
 */
(function () {
  "use strict";
  var D = window.PORTFOLIO;
  var I = window.ICONS;
  var esc = window.esc;
  var STATUTS = window.STATUTS;
  var p = D.profil;
  var prenom = p.nom.split(" ")[0];

  var BADGE_CLS = { publie: "ok", reussi: "ok", "en-cours": "wip", conception: "plan", planifie: "plan" };

  function badge(statut) {
    return '<span class="badge badge--' + (BADGE_CLS[statut] || "plan") + '">' + esc(STATUTS[statut] || statut) + "</span>";
  }
  function findProjet(id) {
    for (var i = 0; i < D.projets.length; i++) if (D.projets[i].id === id) return D.projets[i];
    return null;
  }
  function extLink(l, cls) {
    return '<a class="' + (cls || "btn") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
  }

  /* ---------- À propos ---------- */
  var about = {
    title: "À propos de " + prenom,
    size: [560, 440],
    pos: function () { return [128, 14]; },
    render: function () {
      var specs = p.specs.map(function (s) {
        return "<dt>" + esc(s[0]) + "</dt><dd>" + esc(s[1]) + "</dd>";
      }).join("");
      return (
        '<div class="about">' +
        '<div class="about__avatar" aria-hidden="true">' + esc(p.initiales) + "</div>" +
        '<div class="about__main">' +
        '<h3 class="pixel about__name">' + esc(p.nom) + "</h3>" +
        '<p class="about__role">' + esc(p.titre) + " · " + esc(p.programme) + ", " + esc(p.ecoleCourt) + "</p>" +
        "<p>" + esc(p.accroche) + "</p>" +
        '<dl class="specs">' + specs +
        '<dt>Statut</dt><dd class="specs__hot">Cherche un stage · ' + esc(p.disponibiliteCourt) + "</dd></dl>" +
        '<div class="btn-row">' +
        '<button type="button" class="btn" data-open="competences">Compétences…</button>' +
        '<button type="button" class="btn" data-open="cv">CV.pdf</button>' +
        '<button type="button" class="btn btn--primary" data-open="contact">Me contacter</button>' +
        "</div></div></div>"
      );
    }
  };

  /* ---------- Explorateur de projets ---------- */
  function fileButton(kind, item) {
    var icon = kind === "slot" ? I.plus : I[item.icone] || I.folder;
    var tag = kind === "slot" ? "À venir" : STATUTS[item.statut];
    return (
      '<button type="button" class="file' + (kind === "slot" ? " file--slot" : "") + '" data-kind="' + kind + '" data-id="' + esc(item.id) + '" aria-pressed="false">' +
      '<span class="file__icon">' + icon + "</span>" +
      '<span class="file__name">' + esc(kind === "slot" ? item.nom : item.fichier) + "</span>" +
      '<span class="file__tag">' + esc(tag) + "</span>" +
      "</button>"
    );
  }

  function detailHTML(kind, id) {
    if (kind === "slot") {
      var s = D.aVenir.filter(function (x) { return x.id === id; })[0];
      return (
        '<div class="detail">' +
        '<div class="detail__icon">' + I.plus + "</div>" +
        '<div class="detail__main"><h3 class="pixel">' + esc(s.nom) + "</h3><p>" + esc(s.texte) + "</p>" +
        '<div class="btn-row"><button type="button" class="btn btn--primary" data-open="contact">Proposer une idée</button></div></div></div>'
      );
    }
    var pr = findProjet(id);
    var gh = pr.liens[0] ? extLink(pr.liens[0], "btn") : "";
    return (
      '<div class="detail">' +
      '<div class="detail__icon">' + (I[pr.icone] || I.folder) + "</div>" +
      '<div class="detail__main">' +
      '<h3 class="pixel">' + esc(pr.fichier) + "</h3>" +
      "<p>" + esc(pr.resume) + "</p>" +
      '<p class="meta"><b>Type :</b> ' + esc(pr.type) + " · <b>Pile :</b> " + esc(pr.langage) + "</p>" +
      '<p class="meta"><b>État :</b> ' + badge(pr.statut) + " · " + esc(pr.annee) + "</p>" +
      '<div class="btn-row"><button type="button" class="btn btn--primary" data-open="projet" data-arg="' + esc(pr.id) + '">Ouvrir</button>' + gh + "</div>" +
      "</div></div>"
    );
  }

  var projets = {
    title: "Projets",
    size: [640, 540],
    pos: function (r, W) { return [r.width - W - 36, 46]; },
    render: function () {
      var n = D.projets.length + D.aVenir.length;
      return (
        '<div class="explorer">' +
        '<div class="explorer__path">/' + esc(prenom) + "/Projets</div>" +
        '<div class="explorer__grid" role="group" aria-label="Projets">' +
        D.projets.map(function (x) { return fileButton("projet", x); }).join("") +
        D.aVenir.map(function (x) { return fileButton("slot", x); }).join("") +
        "</div>" +
        '<div class="explorer__detail" aria-live="polite"></div>' +
        '<div class="statusbar">' + n + ' éléments · <span class="hint-mouse">double-cliquez pour ouvrir</span><span class="hint-touch">touchez pour ouvrir</span></div>' +
        "</div>"
      );
    },
    mount: function (body, api) {
      var items = Array.prototype.slice.call(body.querySelectorAll(".file"));
      var detail = body.querySelector(".explorer__detail");
      var pointer = "mouse";
      function select(btn) {
        if (btn.classList.contains("is-selected")) return;
        items.forEach(function (b) {
          b.classList.toggle("is-selected", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        detail.innerHTML = detailHTML(btn.dataset.kind, btn.dataset.id);
      }
      function open(btn) {
        if (btn.dataset.kind === "projet") api.openApp("projet", btn.dataset.id);
        else api.openApp("contact");
      }
      items.forEach(function (btn) {
        btn.addEventListener("pointerdown", function (e) { pointer = e.pointerType; });
        btn.addEventListener("focus", function () { select(btn); });
        btn.addEventListener("click", function (e) {
          select(btn);
          if (e.detail === 0 || pointer === "touch") open(btn);
        });
        btn.addEventListener("dblclick", function () { open(btn); });
      });
      if (items[0]) select(items[0]);
    }
  };

  /* ---------- Fiche d'un projet ---------- */
  var projet = {
    key: function (id) { return "projet:" + id; },
    title: function (id) { var pr = findProjet(id); return pr ? pr.fichier : "Projet"; },
    size: [680, 600],
    render: function (id) {
      var pr = findProjet(id);
      if (!pr) return '<div class="doc"><p>Projet introuvable.</p></div>';
      var html = '<article class="doc">';
      html += '<header class="doc__head"><span class="doc__icon">' + (I[pr.icone] || I.folder) + "</span><div>";
      html += '<h3 class="pixel doc__title">' + esc(pr.nom) + "</h3>";
      html += '<p class="meta">' + esc(pr.type) + " · " + esc(pr.annee) + " · " + badge(pr.statut) + "</p></div></header>";
      html += '<p class="doc__lead">' + esc(pr.resume) + "</p>";
      if (pr.images && pr.images.length) {
        html += '<div class="gallery">' + pr.images.map(function (im) {
          return '<figure><img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" loading="lazy"><figcaption>' + esc(im.alt) + "</figcaption></figure>";
        }).join("") + "</div>";
      }
      if (pr.pointsForts.length) {
        html += '<h4 class="doc__h">Points forts</h4><ul class="doc__list">' + pr.pointsForts.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }
      if (pr.appris && pr.appris.length) {
        html += '<h4 class="doc__h">Ce que j\'ai appris</h4><ul class="doc__list">' + pr.appris.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }
      html += '<h4 class="doc__h">Pile technique</h4><ul class="chips">' + pr.pile.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      if (pr.liens.length) {
        html += '<div class="btn-row btn-row--doc">' + pr.liens.map(function (l, i) { return extLink(l, i === 0 ? "btn btn--primary" : "btn"); }).join("") + "</div>";
      } else {
        html += '<p class="meta doc__soon">Code source publié bientôt.</p>';
      }
      return html + "</article>";
    }
  };

  /* ---------- Compétences ---------- */
  var competences = {
    title: "Compétences",
    size: [880, 620],
    render: function () {
      var html = '<div class="skills">';
      D.competences.forEach(function (c) {
        html += '<section class="skill"><h4 class="pixel">' + esc(c.cat) + "</h4>";
        html += '<ul class="chips">' + c.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
        if (c.preuves && c.preuves.length) {
          html += '<p class="skill__proof">Mis en pratique dans : ' + c.preuves.map(function (id) {
            var pr = findProjet(id);
            return pr ? '<button type="button" class="linkbtn" data-open="projet" data-arg="' + esc(id) + '">' + esc(pr.nom) + "</button>" : "";
          }).join(", ") + "</p>";
        } else if (c.source) {
          html += '<p class="skill__proof">Source : ' + esc(c.source) + "</p>";
        }
        html += "</section>";
      });
      return html + "</div>";
    }
  };

  /* ---------- Terminal ---------- */
  var terminal = {
    title: "Terminal",
    className: "win--terminal",
    size: [680, 540],
    render: function () {
      return (
        '<div class="term">' +
        '<div class="term__out" aria-live="polite"></div>' +
        '<form class="term__line" autocomplete="off">' +
        '<label class="term__prompt" for="term-input">chakib@os:~$</label>' +
        '<input id="term-input" class="term__input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Commande">' +
        "</form></div>"
      );
    },
    mount: function (body, api, win) { window.TERMINAL.init(body, api, win); }
  };

  /* ---------- Contact ---------- */
  var contact = {
    title: "Nouveau message",
    size: [540, 520],
    render: function () {
      var liens = '<li><a href="' + esc(p.github) + '" target="_blank" rel="noopener">GitHub · ' + esc(p.github.replace(/^https?:\/\//, "")) + "</a></li>";
      if (p.linkedin) liens += '<li><a href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a></li>';
      return (
        '<div class="contact">' +
        "<p>Une offre de stage, une question sur un projet ? Écrivez-moi.</p>" +
        '<form class="mail">' +
        '<div class="field"><span class="field__label">À</span><span class="field__val">' + esc(p.courriel) + '</span><button type="button" class="btn btn--sm" data-copy>Copier</button></div>' +
        (p.telephone ? '<div class="field"><span class="field__label">Tél.</span><a class="field__val" href="tel:' + esc(p.telephoneLien) + '">' + esc(p.telephone) + "</a></div>" : "") +
        '<label class="field"><span class="field__label">Objet</span><input name="objet" type="text" value="Stage ' + esc(p.disponibiliteCourt) + '"></label>' +
        '<label class="field field--col"><span class="field__label">Message</span><textarea name="message" rows="6" placeholder="Bonjour ' + esc(prenom) + ', …"></textarea></label>' +
        '<div class="btn-row"><span class="contact__note" aria-live="polite"></span><button type="submit" class="btn btn--primary">Envoyer</button></div>' +
        "</form>" +
        '<ul class="contact__links">' + liens + "</ul>" +
        "</div>"
      );
    },
    mount: function (body) {
      var form = body.querySelector(".mail");
      var note = body.querySelector(".contact__note");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var url = "mailto:" + p.courriel + "?subject=" + encodeURIComponent(form.objet.value) + "&body=" + encodeURIComponent(form.message.value);
        window.location.href = url;
        note.textContent = "Ouverture de votre logiciel de courriel…";
      });
      body.querySelector("[data-copy]").addEventListener("click", function () {
        function ok() { note.textContent = "Adresse copiée."; }
        function fallback() {
          var t = document.createElement("textarea");
          t.value = p.courriel; document.body.appendChild(t); t.select();
          try { document.execCommand("copy"); ok(); } catch (err) { note.textContent = p.courriel; }
          t.remove();
        }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(p.courriel).then(ok, fallback);
        else fallback();
      });
    }
  };

  /* ---------- CV ---------- */
  var cv = {
    title: "CV_" + p.nom.replace(/\s+/g, "_") + ".pdf",
    size: [680, 640],
    render: function () {
      var dl = p.cvPdf ? '<a class="btn btn--sm btn--primary" href="' + esc(p.cvPdf) + '" download>Télécharger le PDF</a>' : "";
      return (
        '<div class="cvwin">' +
        '<div class="cvwin__bar"><span>1 page · ' + esc(p.nom) + '</span><span class="cvwin__actions"><a class="btn btn--sm" href="simple.html">Version imprimable</a>' + dl + "</span></div>" +
        '<div class="cvwin__scroll"><article class="paper cv">' + window.renderCV(D) + "</article></div>" +
        "</div>"
      );
    }
  };

  /* ---------- Boîte de dialogue Stage.exe ---------- */
  var stage = {
    title: "Stage.exe",
    dialog: true,
    className: "win--dialog",
    size: [440, 200],
    pos: function (r, W, H) { return [Math.max(16, r.width / 2 - W - 20), r.height - H - 36]; },
    render: function () {
      return (
        '<div class="dlg">' +
        '<div class="dlg__msg">' + I.info +
        "<p>" + esc(prenom) + " est disponible pour un stage en " + esc(window.listeFr(p.recherche)) + " (" + esc(p.disponibiliteCourt) + "). Voulez-vous le contacter ?</p></div>" +
        '<div class="dlg__btns"><button type="button" class="btn" data-close>Plus tard</button>' +
        '<button type="button" class="btn btn--primary btn--default" data-open="contact" data-close>Contacter</button></div>' +
        "</div>"
      );
    }
  };

  /* ---------- Petites fenêtres ---------- */
  var corbeille = {
    title: "Corbeille",
    size: [400, 250],
    render: function () {
      return '<div class="empty">' + I.trash + "<p><b>La corbeille est vide.</b></p><p>Les idées abandonnées ont été recyclées en projets.</p></div>";
    }
  };

  var aide = {
    title: "Comment naviguer",
    size: [500, 420],
    render: function () {
      return (
        '<div class="doc"><ul class="doc__list">' +
        "<li>Double-cliquez sur une icône du bureau pour ouvrir une application (un seul toucher sur mobile).</li>" +
        "<li>Déplacez une fenêtre par sa barre de titre et redimensionnez-la par le coin inférieur droit.</li>" +
        "<li>La barre du bas liste les fenêtres ouvertes : cliquez pour réduire ou rappeler une fenêtre.</li>" +
        "<li>Échap ferme la fenêtre active.</li>" +
        '<li>Le Terminal accepte des commandes : tapez <code>help</code>.</li>' +
        "</ul>" +
        '<p>Pressé ? La <a href="simple.html">version simple</a> présente tout le CV sur une seule page.</p>' +
        '<div class="btn-row"><button type="button" class="btn btn--primary" data-open="terminal" data-close>Ouvrir le Terminal</button></div></div>'
      );
    }
  };

  var aproposOs = {
    title: "À propos de ChakibOS",
    size: [440, 300],
    render: function () {
      return (
        '<div class="empty"><p class="pixel big">◆ ChakibOS 1.0</p>' +
        "<p>Portfolio de " + esc(p.nom) + ".</p>" +
        "<p>Site statique en HTML, CSS et JavaScript, sans framework ni dépendance.</p>" +
        '<p><a href="' + esc(p.github) + '" target="_blank" rel="noopener">Voir mes dépôts sur GitHub</a></p></div>'
      );
    }
  };

  window.APPS = {
    about: about,
    projets: projets,
    projet: projet,
    competences: competences,
    terminal: terminal,
    contact: contact,
    cv: cv,
    stage: stage,
    corbeille: corbeille,
    aide: aide,
    "apropos-os": aproposOs
  };

  /* Icônes du bureau, dans l'ordre d'affichage. */
  window.DESKTOP_ICONS = [
    { app: "projets", label: "Projets", icon: "folder" },
    { app: "about", label: "À propos", icon: "user" },
    { app: "competences", label: "Compétences", icon: "gear" },
    { app: "terminal", label: "Terminal", icon: "terminal" },
    { app: "cv", label: "CV.pdf", icon: "doc" },
    { app: "contact", label: "Contact", icon: "mail" },
    { app: "corbeille", label: "Corbeille", icon: "trash" }
  ];
})();
