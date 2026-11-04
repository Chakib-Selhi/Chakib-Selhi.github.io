/* Rendu du CV, partagé par la fenêtre CV.pdf et par la version simple (simple.html). */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var STATUTS = {
    publie: "Publié",
    "en-cours": "En cours",
    conception: "En conception",
    planifie: "Planifié",
    reussi: "Réussi"
  };

  /* ["Cybersécurité", "Analyse", "TI"] → "cybersécurité, analyse ou TI" (les sigles gardent leurs majuscules). */
  function listeFr(arr, conj) {
    var mots = arr.map(function (x) { return x === x.toUpperCase() ? x : x.toLowerCase(); });
    if (mots.length < 2) return mots.join("");
    return mots.slice(0, -1).join(", ") + " " + (conj || "ou") + " " + mots[mots.length - 1];
  }

  window.STATUTS = STATUTS;
  window.esc = esc;
  window.listeFr = listeFr;

  /*
   * opts.detail : true pour la version simple (points forts des projets inclus).
   */
  window.renderCV = function (D, opts) {
    opts = opts || {};
    var p = D.profil;
    var contact = [
      '<a href="mailto:' + esc(p.courriel) + '">' + esc(p.courriel) + "</a>",
      p.telephone ? '<a href="tel:' + esc(p.telephoneLien) + '">' + esc(p.telephone) + "</a>" : "",
      '<a href="' + esc(p.github) + '" target="_blank" rel="noopener">' + esc(p.github.replace(/^https?:\/\//, "")) + "</a>"
    ];
    if (p.linkedin) contact.push('<a href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    contact.push(esc(p.lieu));
    contact = contact.filter(Boolean);

    var html = "";
    html += '<header class="cv__head">';
    html += '<h1 class="cv__name">' + esc(p.nom) + "</h1>";
    html += '<p class="cv__title">' + esc(p.titre) + " · " + esc(p.programme) + ", " + esc(p.ecoleCourt) + "</p>";
    html += '<p class="cv__contact">' + contact.join(" · ") + "</p>";
    html += "</header>";

    html += '<section class="cv__sec"><h2>Objectif</h2>';
    html += "<p><strong>" + esc(p.disponibilite) + "</strong> en " + esc(listeFr(p.recherche)) + ".</p>";
    html += "<p>" + esc(p.accroche) + "</p></section>";

    html += '<section class="cv__sec"><h2>Formation</h2>';
    html += '<p><strong>' + esc(p.programme) + "</strong> · en cours<br>" + esc(p.ecole) + "</p></section>";

    html += '<section class="cv__sec"><h2>Projets</h2>';
    D.projets.forEach(function (pr) {
      var lien = pr.liens && pr.liens[0] ? ' · <a href="' + esc(pr.liens[0].url) + '" target="_blank" rel="noopener">' + esc(pr.liens[0].url.replace(/^https?:\/\//, "")) + "</a>" : "";
      html += '<div class="cv__proj">';
      html += "<h3>" + esc(pr.nom) + ' <span class="cv__meta">' + esc(pr.type) + " · " + esc(pr.annee) + " · " + esc(STATUTS[pr.statut] || pr.statut) + "</span></h3>";
      html += "<p>" + esc(pr.resume) + "</p>";
      if (opts.detail && pr.pointsForts.length) {
        html += "<ul>" + pr.pointsForts.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }
      html += '<p class="cv__meta">' + esc(pr.pile.join(" · ")) + lien + "</p>";
      html += "</div>";
    });
    html += "</section>";

    html += '<section class="cv__sec"><h2>Compétences</h2><dl class="cv__skills">';
    D.competences.forEach(function (c) {
      html += "<dt>" + esc(c.cat) + "</dt><dd>" + esc(c.items.join(", ")) + "</dd>";
    });
    html += "</dl></section>";
    return html;
  };
})();
