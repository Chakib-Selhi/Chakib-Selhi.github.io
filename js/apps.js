/*
 * Applications de ChakibOS.
 * Chaque application déclare : title (fonction, pour suivre la langue), size [largeur, hauteur],
 * pos (optionnel), render(arg) qui renvoie le HTML du contenu, et mount(body, api, win) (optionnel)
 * pour brancher les interactions. key(arg) permet plusieurs fenêtres du même type.
 * render et mount sont rappelés quand la langue change ou quand GitHub répond.
 */
(function () {
  "use strict";
  var I = window.ICONS;
  var I18N = window.I18N;
  var t = I18N.t;
  var L = I18N.L;
  var esc = window.esc;
  var statut = window.statut;

  function D() { return window.PORTFOLIO; }
  function P() { return D().profil; }
  function prenom() { return P().nom.split(" ")[0]; }

  var BADGE_CLS = { publie: "ok", "en-cours": "wip", conception: "plan", archive: "plan" };

  function badge(s) {
    return '<span class="badge badge--' + (BADGE_CLS[s] || "plan") + '">' + esc(statut(s)) + "</span>";
  }
  function findProjet(id) {
    var list = D().projets;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function extLink(l, cls) {
    return '<a class="' + (cls || "btn") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(L(l.label)) + "</a>";
  }
  function listHTML(items) {
    return '<ul class="doc__list">' + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  }
  function specValue(s) { return L(s.valeur); }
  // Étiquette suivie de deux-points, selon la typographie de la langue (« Type : » / « Type: »).
  function lbl(text) { return esc(text) + (I18N.lang === "fr" ? " :" : ":"); }

  /* ---------- À propos ---------- */
  var about = {
    title: function () { return t("about.title", { prenom: prenom() }); },
    size: [600, 610],
    pos: function () { return [128, 14]; },
    render: function () {
      var p = P();
      var specs = p.specs.map(function (s) {
        return "<dt>" + esc(L(s.label)) + "</dt><dd>" + esc(specValue(s)) + "</dd>";
      }).join("");
      return (
        '<div class="about">' +
        '<div class="about__avatar" aria-hidden="true">' + esc(p.initiales) + "</div>" +
        '<div class="about__main">' +
        '<h3 class="pixel about__name">' + esc(p.nom) + "</h3>" +
        '<p class="about__role">' + esc(L(p.titre)) + " · " + esc(L(p.programme)) + ", " + esc(p.ecoleCourt) + "</p>" +
        "<p>" + esc(L(p.accroche)) + "</p>" +
        '<dl class="specs">' + specs +
        "<dt>" + esc(t("about.status")) + '</dt><dd class="specs__hot">' + esc(t("about.statusValue")) + "</dd></dl>" +
        '<div class="btn-row">' +
        '<button type="button" class="btn" data-open="competences">' + esc(t("about.skillsBtn")) + "</button>" +
        '<button type="button" class="btn" data-open="cv">' + esc(t("about.cvBtn")) + "</button>" +
        '<button type="button" class="btn btn--primary" data-open="contact">' + esc(t("about.contactBtn")) + "</button>" +
        "</div></div></div>"
      );
    }
  };

  /* ---------- Explorateur de projets ---------- */
  function fileButton(kind, item) {
    var icon = kind === "slot" ? I.plus : I[item.icone] || I.folder;
    var tag = kind === "slot" ? t("projets.slotTag") : statut(item.statut);
    return (
      '<button type="button" class="file' + (kind === "slot" ? " file--slot" : "") + '" data-kind="' + kind + '" data-id="' + esc(item.id) + '" aria-pressed="false">' +
      '<span class="file__icon">' + icon + "</span>" +
      '<span class="file__name">' + esc(kind === "slot" ? L(item.nom) : item.fichier) + "</span>" +
      '<span class="file__tag">' + esc(tag) + "</span>" +
      "</button>"
    );
  }

  function ghLine(pr) {
    var r = pr.gh;
    if (!r) return "";
    return '<p class="meta"><b>' + lbl("GitHub") + '</b> ★ ' + r.stars + " · " + esc(t("projet.updated", { date: I18N.formatDate(r.pushed) })) + "</p>";
  }

  function detailHTML(kind, id) {
    if (kind === "slot") {
      var s = D().aVenir.filter(function (x) { return x.id === id; })[0];
      return (
        '<div class="detail">' +
        '<div class="detail__icon">' + I.plus + "</div>" +
        '<div class="detail__main"><h3 class="pixel">' + esc(L(s.nom)) + "</h3><p>" + esc(L(s.texte)) + "</p>" +
        '<div class="btn-row"><button type="button" class="btn btn--primary" data-open="contact">' + esc(t("projets.idea")) + "</button></div></div></div>"
      );
    }
    var pr = findProjet(id);
    var gh = pr.liens[0] ? extLink(pr.liens[0], "btn") : "";
    return (
      '<div class="detail">' +
      '<div class="detail__icon">' + (I[pr.icone] || I.folder) + "</div>" +
      '<div class="detail__main">' +
      '<h3 class="pixel">' + esc(pr.fichier) + "</h3>" +
      "<p>" + esc(L(pr.resume)) + "</p>" +
      '<p class="meta"><b>' + lbl(t("projets.type")) + "</b> " + esc(L(pr.type)) + " · <b>" + lbl(t("projets.stack")) + "</b> " + esc(pr.langage) + "</p>" +
      '<p class="meta"><b>' + lbl(t("projets.state")) + "</b> " + badge(pr.statut) + " · " + esc(pr.annee) + "</p>" +
      ghLine(pr) +
      '<div class="btn-row"><button type="button" class="btn btn--primary" data-open="projet" data-arg="' + esc(pr.id) + '">' + esc(t("projets.open")) + "</button>" + gh + "</div>" +
      "</div></div>"
    );
  }

  var projets = {
    title: function () { return t("projets.title"); },
    size: [660, 560],
    pos: function (r, W) { return [r.width - W - 36, 46]; },
    render: function () {
      var n = D().projets.length + D().aVenir.length;
      return (
        '<div class="explorer">' +
        '<div class="explorer__path">' + esc(t("projets.path", { prenom: prenom() })) + "</div>" +
        '<div class="explorer__grid" role="group" aria-label="' + esc(t("projets.title")) + '">' +
        D().projets.map(function (x) { return fileButton("projet", x); }).join("") +
        D().aVenir.map(function (x) { return fileButton("slot", x); }).join("") +
        "</div>" +
        '<div class="explorer__detail" aria-live="polite"></div>' +
        '<div class="statusbar">' + esc(t("projets.count", { n: n })) + ' · <span class="hint-mouse">' + esc(t("projets.hintMouse")) + '</span><span class="hint-touch">' + esc(t("projets.hintTouch")) + "</span></div>" +
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
  function langBar(r) {
    var langs = window.GITHUB ? window.GITHUB.topLangs(r) : [];
    if (!langs.length) return "";
    var shown = langs.filter(function (l) { return l.pct >= 0.5; });
    return (
      '<h4 class="doc__h">' + esc(t("projet.languages")) + "</h4>" +
      '<div class="langbar" aria-hidden="true">' + shown.map(function (l) {
        return '<span style="width:' + l.pct + "%;background:" + esc(l.color) + '"></span>';
      }).join("") + "</div>" +
      '<ul class="langlegend">' + shown.map(function (l) {
        var pct = new Intl.NumberFormat(I18N.locale(), { maximumFractionDigits: 1 }).format(l.pct) + (I18N.lang === "fr" ? " %" : "%");
        return '<li><span class="langdot" style="background:' + esc(l.color) + '"></span>' + esc(l.name) + " <b>" + esc(pct) + "</b></li>";
      }).join("") + "</ul>"
    );
  }

  function ghStats(r) {
    var bits = [
      "★ " + esc(t("projet.stars", { n: r.stars })),
      esc(t("projet.forks", { n: r.forks })),
      esc(t("projet.updated", { date: I18N.formatDate(r.pushed) }))
    ];
    if (r.license) bits.push(esc(t("projet.license", { l: r.license })));
    return '<p class="ghstats">' + bits.join(" · ") + "</p>";
  }

  var projet = {
    key: function (id) { return "projet:" + id; },
    title: function (id) { var pr = findProjet(id); return pr ? pr.fichier : t("projet.notFound"); },
    size: [700, 620],
    render: function (id) {
      var pr = findProjet(id);
      if (!pr) return '<div class="doc"><p>' + esc(t("projet.notFound")) + "</p></div>";
      var r = pr.gh;
      var points = L(pr.pointsForts) || [];
      var appris = L(pr.appris) || [];
      var html = '<article class="doc">';
      html += '<header class="doc__head"><span class="doc__icon">' + (I[pr.icone] || I.folder) + "</span><div>";
      html += '<h3 class="pixel doc__title">' + esc(pr.nom) + "</h3>";
      html += '<p class="meta">' + esc(L(pr.type)) + " · " + esc(pr.annee) + " · " + badge(pr.statut) + "</p></div></header>";
      html += '<p class="doc__lead">' + esc(L(pr.resume)) + "</p>";
      if (r) html += ghStats(r);
      if (pr.auto) html += '<p class="meta doc__auto">' + esc(t("projet.auto")) + "</p>";
      if (pr.images && pr.images.length) {
        html += '<div class="gallery">' + pr.images.map(function (im) {
          return '<figure><img src="' + esc(im.src) + '" alt="' + esc(L(im.alt)) + '" loading="lazy"><figcaption>' + esc(L(im.alt)) + "</figcaption></figure>";
        }).join("") + "</div>";
      }
      if (points.length) html += '<h4 class="doc__h">' + esc(t("projet.highlights")) + "</h4>" + listHTML(points);
      else if (pr.auto) html += '<div data-slot="highlights"></div>';
      if (appris.length) html += '<h4 class="doc__h">' + esc(t("projet.learned")) + "</h4>" + listHTML(appris);
      if (r) html += langBar(r);
      html += '<h4 class="doc__h">' + esc(t("projet.stack")) + '</h4><ul class="chips">' + pr.pile.map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") + "</ul>";
      if (r && r.topics.length) {
        html += '<h4 class="doc__h">' + esc(t("projet.topics")) + '</h4><ul class="chips chips--topics">' + r.topics.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }
      if (pr.liens.length) {
        html += '<div class="btn-row btn-row--doc">' + pr.liens.map(function (l, i) { return extLink(l, i === 0 ? "btn btn--primary" : "btn"); }).join("") + "</div>";
      } else {
        html += '<p class="meta doc__soon">' + esc(t("projet.soon")) + "</p>";
      }
      if (r) {
        html += '<details class="readme"' + (pr.auto ? " open" : "") + "><summary>" + esc(t("projet.readme")) + "</summary>";
        html += '<div class="md" data-slot="readme"><p class="meta">' + esc(t("projet.readmeLoading")) + "</p></div></details>";
      }
      return html + "</article>";
    },
    mount: function (body, api, win) {
      var pr = findProjet(win.arg);
      if (!pr || !pr.gh || !window.GITHUB) return;
      var slot = body.querySelector('[data-slot="readme"]');
      var hl = body.querySelector('[data-slot="highlights"]');
      window.GITHUB.readme(pr).then(function (res) {
        if (!body.isConnected) return;
        slot.innerHTML = res.html || "";
        if (hl && res.highlights.length) hl.innerHTML = '<h4 class="doc__h">' + esc(t("projet.highlights")) + "</h4>" + listHTML(res.highlights);
      }).catch(function () {
        if (!body.isConnected) return;
        slot.innerHTML = '<p class="meta">' + esc(t("projet.readmeError")) + "</p>";
      });
    }
  };

  /* ---------- Compétences ---------- */
  var competences = {
    title: function () { return t("competences.title"); },
    size: [880, 620],
    render: function () {
      var html = '<div class="skills">';
      D().competences.forEach(function (c) {
        if (!c.items.length) return;
        html += '<section class="skill"><h4 class="pixel">' + esc(L(c.cat)) + "</h4>";
        html += '<ul class="chips">' + c.items.map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") + "</ul>";
        var preuves = (c.preuves || []).map(findProjet).filter(Boolean);
        if (preuves.length) {
          html += '<p class="skill__proof">' + esc(t("competences.proof")) + " " + preuves.map(function (pr) {
            return '<button type="button" class="linkbtn" data-open="projet" data-arg="' + esc(pr.id) + '">' + esc(pr.nom) + "</button>";
          }).join(", ") + "</p>";
        }
        html += "</section>";
      });
      return html + "</div>";
    }
  };

  /* ---------- Activités (compétitions et bénévolat) ---------- */
  var activites = {
    title: function () { return t("activites.title"); },
    size: [640, 520],
    render: function () {
      var html = '<div class="skills skills--list">';
      (D().activites || []).forEach(function (a) {
        var meta = [L(a.role), L(a.periode)].filter(Boolean).join(" · ");
        html += '<section class="skill"><h4 class="pixel">' + esc(a.nom) + "</h4>";
        html += '<p class="skill__meta">' + esc(meta) + "</p>";
        html += '<p class="skill__text">' + esc(L(a.texte)) + "</p></section>";
      });
      return html + "</div>";
    }
  };

  /* ---------- Terminal ---------- */
  var terminal = {
    title: function () { return t("terminal.title"); },
    className: "win--terminal",
    size: [680, 540],
    render: function () {
      return (
        '<div class="term">' +
        '<div class="term__out" aria-live="polite"></div>' +
        '<form class="term__line" autocomplete="off">' +
        '<label class="term__prompt" for="term-input">chakib@os:~$</label>' +
        '<input id="term-input" class="term__input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="' + esc(t("terminal.aria")) + '">' +
        "</form></div>"
      );
    },
    mount: function (body, api, win) { window.TERMINAL.init(body, api, win); }
  };

  /* ---------- Contact ---------- */
  var contact = {
    title: function () { return t("contact.title"); },
    size: [540, 520],
    render: function () {
      var p = P();
      var liens = '<li><a href="' + esc(p.github) + '" target="_blank" rel="noopener">GitHub · ' + esc(p.github.replace(/^https?:\/\//, "")) + "</a></li>";
      if (p.linkedin) liens += '<li><a href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a></li>';
      return (
        '<div class="contact">' +
        "<p>" + esc(t("contact.intro")) + "</p>" +
        '<form class="mail">' +
        '<div class="field"><span class="field__label">' + esc(t("contact.to")) + '</span><span class="field__val">' + esc(p.courriel) + '</span><button type="button" class="btn btn--sm" data-copy>' + esc(t("contact.copy")) + "</button></div>" +
        (p.telephone ? '<div class="field"><span class="field__label">' + esc(t("contact.phone")) + '</span><a class="field__val" href="tel:' + esc(p.telephoneLien) + '">' + esc(p.telephone) + "</a></div>" : "") +
        '<label class="field"><span class="field__label">' + esc(t("contact.subject")) + '</span><input name="objet" type="text" value="' + esc(t("contact.subjectValue")) + '"></label>' +
        '<label class="field field--col"><span class="field__label">' + esc(t("contact.message")) + '</span><textarea name="message" rows="6" placeholder="' + esc(t("contact.placeholder", { prenom: prenom() })) + '"></textarea></label>' +
        '<div class="btn-row"><span class="contact__note" aria-live="polite"></span><button type="submit" class="btn btn--primary">' + esc(t("contact.send")) + "</button></div>" +
        "</form>" +
        '<ul class="contact__links">' + liens + "</ul>" +
        "</div>"
      );
    },
    mount: function (body) {
      var p = P();
      var form = body.querySelector(".mail");
      var note = body.querySelector(".contact__note");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        window.location.href = "mailto:" + p.courriel + "?subject=" + encodeURIComponent(form.objet.value) + "&body=" + encodeURIComponent(form.message.value);
        note.textContent = t("contact.opening");
      });
      body.querySelector("[data-copy]").addEventListener("click", function () {
        function ok() { note.textContent = t("contact.copied"); }
        function fallback() {
          var tx = document.createElement("textarea");
          tx.value = p.courriel; document.body.appendChild(tx); tx.select();
          try { document.execCommand("copy"); ok(); } catch (err) { note.textContent = p.courriel; }
          tx.remove();
        }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(p.courriel).then(ok, fallback);
        else fallback();
      });
    }
  };

  /* ---------- CV ---------- */
  var cv = {
    title: function () { return t("cv.title", { nom: P().nom.replace(/\s+/g, "_") }); },
    size: [680, 640],
    render: function () {
      var p = P();
      var dl = p.cvPdf ? '<a class="btn btn--sm btn--primary" href="' + esc(p.cvPdf) + '" download>' + esc(t("cv.download")) + "</a>" : "";
      return (
        '<div class="cvwin">' +
        '<div class="cvwin__bar"><span>' + esc(t("cv.pages", { nom: p.nom })) + '</span><span class="cvwin__actions"><a class="btn btn--sm" href="simple.html">' + esc(t("cv.print")) + "</a>" + dl + "</span></div>" +
        '<div class="cvwin__scroll"><article class="paper cv">' + window.renderCV(D()) + "</article></div>" +
        "</div>"
      );
    }
  };

  /* ---------- Boîte de dialogue Stage.exe ---------- */
  var stage = {
    title: function () { return "Stage.exe"; },
    dialog: true,
    className: "win--dialog",
    size: [440, 200],
    pos: function (r, W, H) { return [Math.max(16, r.width / 2 - W - 20), r.height - H - 36]; },
    render: function () {
      var p = P();
      return (
        '<div class="dlg">' +
        '<div class="dlg__msg">' + I.info +
        "<p>" + esc(t("stage.text", { prenom: prenom(), domaines: I18N.liste(L(p.recherche)) })) + "</p></div>" +
        '<div class="dlg__btns"><button type="button" class="btn" data-close>' + esc(t("stage.later")) + "</button>" +
        '<button type="button" class="btn btn--primary btn--default" data-open="contact" data-close>' + esc(t("stage.contact")) + "</button></div>" +
        "</div>"
      );
    }
  };

  /* ---------- Petites fenêtres ---------- */
  var corbeille = {
    title: function () { return t("corbeille.title"); },
    size: [400, 250],
    render: function () {
      return '<div class="empty">' + I.trash + "<p><b>" + esc(t("corbeille.empty")) + "</b></p><p>" + esc(t("corbeille.joke")) + "</p></div>";
    }
  };

  var aide = {
    title: function () { return t("aide.title"); },
    size: [520, 380],
    render: function () {
      return (
        '<div class="doc"><ul class="doc__list">' +
        ["aide.i1", "aide.i2", "aide.i3", "aide.i4", "aide.i5", "aide.i6"].map(function (k) { return "<li>" + esc(t(k)) + "</li>"; }).join("") +
        "</ul>" +
        "<p>" + esc(t("aide.simpleBefore")) + '<a href="simple.html">' + esc(t("aide.simpleLink")) + "</a>" + esc(t("aide.simpleAfter")) + "</p>" +
        "</div>"
      );
    }
  };

  var aproposOs = {
    title: function () { return t("os.title"); },
    size: [460, 320],
    render: function () {
      var s = window.GITHUB ? window.GITHUB.state : { source: "none", count: 0 };
      return (
        '<div class="empty"><p class="pixel big">◆ ChakibOS 1.0</p>' +
        "<p>" + esc(t("os.by", { nom: P().nom })) + "</p>" +
        "<p>" + esc(t("os.tech")) + "</p>" +
        "<p>" + esc(t("os.sync", { state: t("sync." + s.source, { n: s.count }) })) + "</p>" +
        '<p><a href="' + esc(P().github) + '" target="_blank" rel="noopener">' + esc(t("os.repos")) + "</a></p></div>"
      );
    }
  };

  window.APPS = {
    about: about,
    projets: projets,
    projet: projet,
    competences: competences,
    activites: activites,
    terminal: terminal,
    contact: contact,
    cv: cv,
    stage: stage,
    corbeille: corbeille,
    aide: aide,
    "apropos-os": aproposOs
  };

  /* Icônes du bureau, dans l'ordre d'affichage (libellés traduits par i18n.js). */
  window.DESKTOP_ICONS = [
    { app: "projets", label: "icon.projets", icon: "folder" },
    { app: "about", label: "icon.about", icon: "user" },
    { app: "competences", label: "icon.competences", icon: "gear" },
    { app: "activites", label: "icon.activites", icon: "flag" },
    { app: "terminal", label: "icon.terminal", icon: "terminal" },
    { app: "cv", label: "icon.cv", icon: "doc" },
    { app: "contact", label: "icon.contact", icon: "mail" },
    { app: "corbeille", label: "icon.corbeille", icon: "trash" }
  ];
})();
