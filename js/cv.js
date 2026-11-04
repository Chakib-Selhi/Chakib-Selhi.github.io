/* Rendu du CV, partagé par la fenêtre CV.pdf et par la version simple (simple.html). */
(function () {
  "use strict";
  var t = window.I18N.t;
  var L = window.I18N.L;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function statut(s) { return t("status." + s); }
  function short(url) { return String(url).replace(/^https?:\/\//, ""); }

  window.esc = esc;
  window.statut = statut;

  /*
   * opts.detail : true pour la version simple (points forts des projets inclus).
   */
  window.renderCV = function (D, opts) {
    opts = opts || {};
    var p = D.profil;
    var contact = [
      '<a href="mailto:' + esc(p.courriel) + '">' + esc(p.courriel) + "</a>",
      p.telephone ? '<a href="tel:' + esc(p.telephoneLien) + '">' + esc(p.telephone) + "</a>" : "",
      '<a href="' + esc(p.github) + '" target="_blank" rel="noopener">' + esc(short(p.github)) + "</a>",
      p.linkedin ? '<a href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>' : "",
      esc(L(p.lieu))
    ].filter(Boolean);

    var html = "";
    html += '<header class="cv__head">';
    html += '<h1 class="cv__name">' + esc(p.nom) + "</h1>";
    html += '<p class="cv__title">' + esc(L(p.titre)) + " · " + esc(L(p.programme)) + ", " + esc(p.ecoleCourt) + "</p>";
    html += '<p class="cv__contact">' + contact.join(" · ") + "</p>";
    html += "</header>";

    html += '<section class="cv__sec"><h2>' + esc(t("cv.objective")) + "</h2>";
    html += "<p><strong>" + esc(L(p.disponibilite)) + "</strong> " + esc(t("cv.objectiveIn")) + " " + esc(window.I18N.liste(L(p.recherche))) + ".</p>";
    html += "<p>" + esc(L(p.accroche)) + "</p></section>";

    html += '<section class="cv__sec"><h2>' + esc(t("cv.education")) + "</h2>";
    html += "<p><strong>" + esc(L(p.programme)) + "</strong> · " + esc(t("cv.inProgress")) + "<br>" + esc(L(p.ecole)) + "</p></section>";

    html += '<section class="cv__sec"><h2>' + esc(t("cv.projects")) + "</h2>";
    D.projets.forEach(function (pr) {
      var lien = pr.liens && pr.liens[0] ? ' · <a href="' + esc(pr.liens[0].url) + '" target="_blank" rel="noopener">' + esc(short(pr.liens[0].url)) + "</a>" : "";
      var points = L(pr.pointsForts) || [];
      html += '<div class="cv__proj">';
      html += "<h3>" + esc(pr.nom) + ' <span class="cv__meta">' + esc(L(pr.type)) + " · " + esc(pr.annee) + " · " + esc(statut(pr.statut)) + "</span></h3>";
      html += "<p>" + esc(L(pr.resume)) + "</p>";
      if (opts.detail && points.length) {
        html += "<ul>" + points.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }
      html += '<p class="cv__meta">' + esc(pr.pile.map(L).join(" · ")) + lien + "</p>";
      html += "</div>";
    });
    html += "</section>";

    html += '<section class="cv__sec"><h2>' + esc(t("cv.skills")) + '</h2><dl class="cv__skills">';
    D.competences.forEach(function (c) {
      if (!c.items.length) return;
      html += "<dt>" + esc(L(c.cat)) + "</dt><dd>" + esc(c.items.map(L).join(", ")) + "</dd>";
    });
    html += "</dl></section>";
    return html;
  };
})();
