/*
 * Langues de ChakibOS (français / anglais).
 * - t("clé", { variables }) traduit un texte de l'interface.
 * - L(valeur) choisit la bonne langue d'un contenu de data.js : { fr: "…", en: "…" }.
 * - set("en") change la langue sans recharger la page (événement « langchange »).
 * Langue choisie : ?lang=fr|en dans l'adresse, sinon le dernier choix, sinon la langue du navigateur.
 */
(function () {
  "use strict";
  var KEY = "chakibos-lang";

  var S = {
    fr: {
      "meta.title": "ChakibOS · Portfolio de Chakib Selhi",
      "meta.titleSimple": "CV · Chakib Selhi, étudiant en génie logiciel",
      "meta.description": "Portfolio de Chakib Selhi, étudiant en génie logiciel à l'UQAM orienté cybersécurité et réseaux, à la recherche d'un stage.",
      "skip": "Aller à la version simple du CV",
      "h1": "Chakib Selhi, étudiant en génie logiciel à l'UQAM : portfolio",
      "noscript": "ChakibOS a besoin de JavaScript.",
      "noscript.link": "Voir la version simple du CV",
      "list.or": "ou",
      "list.and": "et",

      "menu.system": "Menu ChakibOS",
      "menu.aboutOs": "À propos de ChakibOS",
      "menu.wallpaper": "Changer le fond d'écran",
      "menu.simple": "Version simple (CV)",
      "menu.reboot": "Redémarrer",
      "menu.help": "Aide",
      "menu.howto": "Comment naviguer",
      "menu.github": "Mes dépôts GitHub",
      "menu.lang": "English version",
      "menu.simpleLink": "Version simple",
      "desk.aria": "Icônes du bureau",
      "task.aria": "Fenêtres ouvertes",
      "boot.hint": "Cliquez ou appuyez sur une touche pour passer",

      "win.close": "Fermer {title}",
      "win.min": "Réduire",
      "win.max": "Agrandir",
      "win.restore": "Restaurer",

      "icon.projets": "Projets",
      "icon.about": "À propos",
      "icon.competences": "Compétences",
      "icon.activites": "Activités",
      "icon.terminal": "Terminal",
      "icon.cv": "CV.pdf",
      "icon.contact": "Contact",
      "icon.corbeille": "Corbeille",

      "boot.l1": "ChakibOS 1.0 · BIOS (c) {year} {name}",
      "boot.l2": "Mémoire vive .......... {value}",
      "boot.l3": "Synchronisation GitHub  {n} dépôts publics",
      "boot.l3off": "Synchronisation GitHub  hors ligne, données locales",
      "boot.l4": "Compétences ........... {n} modules chargés",
      "boot.l5": "Chargement du bureau .. [ OK ]",

      "status.publie": "Publié",
      "status.en-cours": "En cours",
      "status.conception": "En conception",
      "status.archive": "Archivé",

      "about.title": "À propos de {prenom}",
      "about.status": "Statut",
      "about.statusValue": "Cherche un stage",
      "about.skillsBtn": "Compétences…",
      "about.cvBtn": "CV.pdf",
      "about.contactBtn": "Me contacter",

      "projets.title": "Projets",
      "projets.path": "/{prenom}/Projets",
      "projets.count": "{n} éléments",
      "projets.hintMouse": "double-cliquez pour ouvrir",
      "projets.hintTouch": "touchez pour ouvrir",
      "projets.slotTag": "À venir",
      "projets.open": "Ouvrir",
      "projets.idea": "Proposer une idée",
      "projets.type": "Type",
      "projets.stack": "Pile",
      "projets.state": "État",

      "projet.notFound": "Projet introuvable.",
      "projet.highlights": "Points forts",
      "projet.learned": "Ce que j'ai appris",
      "projet.stack": "Pile technique",
      "projet.topics": "Sujets",
      "projet.languages": "Langages",
      "projet.soon": "Code source publié bientôt.",
      "projet.readme": "Documentation (README)",
      "projet.readmeLoading": "Chargement du README…",
      "projet.readmeError": "Impossible de charger le README pour l'instant. Consultez-le sur GitHub.",
      "projet.stars": "{n} étoile(s)",
      "projet.forks": "{n} fork(s)",
      "projet.updated": "Mis à jour le {date}",
      "projet.license": "Licence {l}",
      "projet.auto": "Fiche générée automatiquement à partir de GitHub.",
      "projet.source": "Code source",
      "projet.homepage": "Site du projet",
      "projet.noDesc": "Aucune description pour l'instant.",
      "projet.typeAuto": "Projet {lang}",
      "projet.typeRepo": "Dépôt GitHub",

      "competences.title": "Compétences",
      "activites.title": "Activités",
      "competences.proof": "Mis en pratique dans :",
      "competences.frameworks": "Frameworks et plateformes",

      "terminal.title": "Terminal",
      "terminal.aria": "Commande",

      "contact.title": "Nouveau message",
      "contact.intro": "Une offre de stage, une question sur un projet ? Écrivez-moi.",
      "contact.to": "À",
      "contact.copy": "Copier",
      "contact.phone": "Tél.",
      "contact.subject": "Objet",
      "contact.subjectValue": "Offre de stage",
      "contact.message": "Message",
      "contact.placeholder": "Bonjour {prenom}, …",
      "contact.send": "Envoyer",
      "contact.opening": "Ouverture de votre logiciel de courriel…",
      "contact.copied": "Adresse copiée.",

      "cv.title": "CV_{nom}.pdf",
      "cv.pages": "1 page · {nom}",
      "cv.print": "Version imprimable",
      "cv.download": "Télécharger le PDF",
      "cv.objective": "Objectif",
      "cv.objectiveText": "Je cherche un stage en {domaines}.",
      "cv.education": "Formation",
      "cv.inProgress": "en cours",
      "cv.projects": "Projets",
      "cv.skills": "Compétences",
      "cv.courses": "Cours en lien :",
      "cv.activities": "Activités",

      "stage.text": "{prenom} est à la recherche d'un stage en {domaines}. Voulez-vous le contacter ?",
      "stage.later": "Plus tard",
      "stage.contact": "Contacter",

      "corbeille.title": "Corbeille",
      "corbeille.empty": "La corbeille est vide.",
      "corbeille.joke": "Les idées abandonnées ont été recyclées en projets.",

      "aide.title": "Comment naviguer",
      "aide.i1": "Double-cliquez sur une icône du bureau pour ouvrir une application (un seul toucher sur mobile).",
      "aide.i2": "Déplacez une fenêtre par sa barre de titre et redimensionnez-la par le coin inférieur droit.",
      "aide.i3": "La barre du bas liste les fenêtres ouvertes : cliquez pour réduire ou rappeler une fenêtre.",
      "aide.i4": "Le bouton rouge ou la touche Échap ferme la fenêtre active.",
      "aide.i5": "Le Terminal accepte des commandes : tapez help.",
      "aide.i6": "Les projets sont synchronisés automatiquement avec mes dépôts GitHub publics.",
      "aide.simpleBefore": "Pressé ? La ",
      "aide.simpleLink": "version simple",
      "aide.simpleAfter": " présente tout le CV sur une seule page.",

      "os.title": "À propos de ChakibOS",
      "os.by": "Portfolio de {nom}.",
      "os.tech": "Site statique en HTML, CSS et JavaScript, sans framework ni dépendance.",
      "os.sync": "Projets GitHub : {state}",
      "os.repos": "Voir mes dépôts sur GitHub",
      "sync.api": "à jour ({n} dépôts publics)",
      "sync.cache": "copie récente en cache ({n} dépôts publics)",
      "sync.none": "hors ligne, données locales",

      "simple.back": "← Retour à ChakibOS",
      "simple.print": "Imprimer / PDF",
      "simple.lang": "English",

      "term.welcome": "ChakibOS Terminal 1.0. Tapez « help » pour commencer, ou « neofetch ».",
      "term.available": "Commandes disponibles :",
      "term.tips": "Astuces : Tab complète, ↑ ↓ parcourent l'historique.",
      "term.d.help": "liste des commandes",
      "term.d.whoami": "qui suis-je",
      "term.d.neofetch": "fiche système",
      "term.d.ls": "liste les projets",
      "term.d.cat": "cat <projet> : résumé d'un projet",
      "term.d.open": "open <fenêtre|projet>",
      "term.d.skills": "pile technique",
      "term.d.activites": "compétitions et bénévolat",
      "term.d.github": "dépôts GitHub synchronisés",
      "term.d.stage": "état de ma recherche de stage",
      "term.d.contact": "me joindre",
      "term.d.lang": "lang <fr|en> : change la langue",
      "term.d.date": "date et heure",
      "term.d.echo": "affiche un texte",
      "term.d.history": "historique",
      "term.d.clear": "efface l'écran",
      "term.d.exit": "ferme le terminal",
      "term.lookingFor": "Recherche : stage en {d}",
      "term.program": "Programme",
      "term.school": "École",
      "term.status": "Statut",
      "term.statusValue": "cherche un stage",
      "term.usage": "usage : {u}",
      "term.stackLabel": "Pile : ",
      "term.opening": "Ouverture de {x}…",
      "term.ok1": "[ OK ] Profil chargé : {v}",
      "term.ok2": "[ OK ] Domaines : {v}",
      "term.ok3": "[ OK ] Statut : ouvert aux offres de stage",
      "term.wait": "[ .. ] En attente de votre offre. Tapez « contact ».",
      "term.contactHint": "Ou tapez « open contact » pour écrire un message.",
      "term.notFound": "{c} : commande introuvable. Tapez « help ».",
      "term.sudo": "Permission refusée : les droits sudo sont accordés après l'entrevue.",
      "term.rmrf": "Bien tenté. Ce système est en lecture seule.",
      "term.rm": "rm : opération non permise",
      "term.cd": "Pas besoin de cd ici : essayez « open projets ».",
      "term.lang": "Langue : français",
      "term.github": "Dépôts GitHub publics de {u} : {state}"
    },

    en: {
      "meta.title": "ChakibOS · Chakib Selhi's portfolio",
      "meta.titleSimple": "Résumé · Chakib Selhi, software engineering student",
      "meta.description": "Portfolio of Chakib Selhi, software engineering student at UQAM focused on cybersecurity and networking, looking for an internship.",
      "skip": "Skip to the simple résumé",
      "h1": "Chakib Selhi, software engineering student at UQAM: portfolio",
      "noscript": "ChakibOS needs JavaScript.",
      "noscript.link": "See the simple résumé",
      "list.or": "or",
      "list.and": "and",

      "menu.system": "ChakibOS menu",
      "menu.aboutOs": "About ChakibOS",
      "menu.wallpaper": "Change wallpaper",
      "menu.simple": "Simple version (résumé)",
      "menu.reboot": "Restart",
      "menu.help": "Help",
      "menu.howto": "How to navigate",
      "menu.github": "My GitHub repositories",
      "menu.lang": "Version française",
      "menu.simpleLink": "Simple version",
      "desk.aria": "Desktop icons",
      "task.aria": "Open windows",
      "boot.hint": "Click or press any key to skip",

      "win.close": "Close {title}",
      "win.min": "Minimize",
      "win.max": "Maximize",
      "win.restore": "Restore",

      "icon.projets": "Projects",
      "icon.about": "About",
      "icon.competences": "Skills",
      "icon.activites": "Activities",
      "icon.terminal": "Terminal",
      "icon.cv": "Resume.pdf",
      "icon.contact": "Contact",
      "icon.corbeille": "Trash",

      "boot.l1": "ChakibOS 1.0 · BIOS (c) {year} {name}",
      "boot.l2": "Memory ................ {value}",
      "boot.l3": "GitHub sync ........... {n} public repositories",
      "boot.l3off": "GitHub sync ........... offline, local data",
      "boot.l4": "Skills ................ {n} modules loaded",
      "boot.l5": "Loading desktop ....... [ OK ]",

      "status.publie": "Released",
      "status.en-cours": "In progress",
      "status.conception": "In design",
      "status.archive": "Archived",

      "about.title": "About {prenom}",
      "about.status": "Status",
      "about.statusValue": "Looking for an internship",
      "about.skillsBtn": "Skills…",
      "about.cvBtn": "Resume.pdf",
      "about.contactBtn": "Contact me",

      "projets.title": "Projects",
      "projets.path": "/{prenom}/Projects",
      "projets.count": "{n} items",
      "projets.hintMouse": "double-click to open",
      "projets.hintTouch": "tap to open",
      "projets.slotTag": "Coming soon",
      "projets.open": "Open",
      "projets.idea": "Suggest an idea",
      "projets.type": "Type",
      "projets.stack": "Stack",
      "projets.state": "Status",

      "projet.notFound": "Project not found.",
      "projet.highlights": "Highlights",
      "projet.learned": "What I learned",
      "projet.stack": "Tech stack",
      "projet.topics": "Topics",
      "projet.languages": "Languages",
      "projet.soon": "Source code coming soon.",
      "projet.readme": "Documentation (README)",
      "projet.readmeLoading": "Loading README…",
      "projet.readmeError": "Could not load the README right now. See it on GitHub.",
      "projet.stars": "{n} star(s)",
      "projet.forks": "{n} fork(s)",
      "projet.updated": "Updated {date}",
      "projet.license": "{l} license",
      "projet.auto": "Generated automatically from GitHub.",
      "projet.source": "Source code",
      "projet.homepage": "Project website",
      "projet.noDesc": "No description yet.",
      "projet.typeAuto": "{lang} project",
      "projet.typeRepo": "GitHub repository",

      "competences.title": "Skills",
      "activites.title": "Activities",
      "competences.proof": "Applied in:",
      "competences.frameworks": "Frameworks and platforms",

      "terminal.title": "Terminal",
      "terminal.aria": "Command",

      "contact.title": "New message",
      "contact.intro": "An internship offer or a question about a project? Write to me.",
      "contact.to": "To",
      "contact.copy": "Copy",
      "contact.phone": "Phone",
      "contact.subject": "Subject",
      "contact.subjectValue": "Internship opportunity",
      "contact.message": "Message",
      "contact.placeholder": "Hello {prenom}, …",
      "contact.send": "Send",
      "contact.opening": "Opening your email app…",
      "contact.copied": "Address copied.",

      "cv.title": "Resume_{nom}.pdf",
      "cv.pages": "1 page · {nom}",
      "cv.print": "Printable version",
      "cv.download": "Download PDF",
      "cv.objective": "Objective",
      "cv.objectiveText": "Looking for an internship in {domaines}.",
      "cv.education": "Education",
      "cv.inProgress": "in progress",
      "cv.projects": "Projects",
      "cv.skills": "Skills",
      "cv.courses": "Relevant coursework:",
      "cv.activities": "Activities",

      "stage.text": "{prenom} is looking for an internship in {domaines}. Would you like to contact him?",
      "stage.later": "Later",
      "stage.contact": "Contact",

      "corbeille.title": "Trash",
      "corbeille.empty": "The trash is empty.",
      "corbeille.joke": "Abandoned ideas were recycled into projects.",

      "aide.title": "How to navigate",
      "aide.i1": "Double-click a desktop icon to open an app (a single tap on mobile).",
      "aide.i2": "Drag a window by its title bar and resize it from the bottom-right corner.",
      "aide.i3": "The bottom bar lists open windows: click to minimize or bring back a window.",
      "aide.i4": "The red button or the Escape key closes the active window.",
      "aide.i5": "The Terminal accepts commands: type help.",
      "aide.i6": "Projects are synced automatically with my public GitHub repositories.",
      "aide.simpleBefore": "In a hurry? The ",
      "aide.simpleLink": "simple version",
      "aide.simpleAfter": " shows the whole résumé on a single page.",

      "os.title": "About ChakibOS",
      "os.by": "{nom}'s portfolio.",
      "os.tech": "Static site in HTML, CSS and JavaScript, with no framework or dependency.",
      "os.sync": "GitHub projects: {state}",
      "os.repos": "See my repositories on GitHub",
      "sync.api": "up to date ({n} public repositories)",
      "sync.cache": "recent cached copy ({n} public repositories)",
      "sync.none": "offline, local data",

      "simple.back": "← Back to ChakibOS",
      "simple.print": "Print / PDF",
      "simple.lang": "Français",

      "term.welcome": "ChakibOS Terminal 1.0. Type \"help\" to start, or \"neofetch\".",
      "term.available": "Available commands:",
      "term.tips": "Tips: Tab completes, ↑ ↓ browse the history.",
      "term.d.help": "list commands",
      "term.d.whoami": "who am I",
      "term.d.neofetch": "system info",
      "term.d.ls": "list projects",
      "term.d.cat": "cat <project>: project summary",
      "term.d.open": "open <window|project>",
      "term.d.skills": "tech stack",
      "term.d.activites": "competitions and volunteering",
      "term.d.github": "synced GitHub repositories",
      "term.d.stage": "my internship search status",
      "term.d.contact": "reach me",
      "term.d.lang": "lang <fr|en>: change language",
      "term.d.date": "date and time",
      "term.d.echo": "print text",
      "term.d.history": "command history",
      "term.d.clear": "clear the screen",
      "term.d.exit": "close the terminal",
      "term.lookingFor": "Looking for: internship in {d}",
      "term.program": "Program",
      "term.school": "School",
      "term.status": "Status",
      "term.statusValue": "looking for an internship",
      "term.usage": "usage: {u}",
      "term.stackLabel": "Stack: ",
      "term.opening": "Opening {x}…",
      "term.ok1": "[ OK ] Profile loaded: {v}",
      "term.ok2": "[ OK ] Fields: {v}",
      "term.ok3": "[ OK ] Status: open to internship offers",
      "term.wait": "[ .. ] Waiting for your offer. Type \"contact\".",
      "term.contactHint": "Or type \"open contact\" to write a message.",
      "term.notFound": "{c}: command not found. Type \"help\".",
      "term.sudo": "Permission denied: sudo rights are granted after the interview.",
      "term.rmrf": "Nice try. This system is read-only.",
      "term.rm": "rm: operation not permitted",
      "term.cd": "No need for cd here: try \"open projects\".",
      "term.lang": "Language: English",
      "term.github": "{u}'s public GitHub repositories: {state}"
    }
  };

  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }

  function detect() {
    var q = (window.location.search.match(/[?&]lang=(fr|en)\b/) || [])[1];
    if (q) return q;
    var saved = safeGet(KEY);
    if (saved === "fr" || saved === "en") return saved;
    return /^fr\b/i.test(navigator.language || "") ? "fr" : "en";
  }

  var lang = detect();

  function t(key, vars) {
    var s = (S[lang] && S[lang][key]) || S.fr[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }

  // Contenu bilingue de data.js : { fr: …, en: … } → valeur dans la langue active.
  function L(v) {
    if (v && typeof v === "object" && !Array.isArray(v) && ("fr" in v || "en" in v)) {
      return v[lang] != null ? v[lang] : v.fr;
    }
    return v;
  }

  // ["Cybersécurité", "Analyse", "TI"] → "cybersécurité, analyse ou TI" (les sigles gardent leurs majuscules).
  function liste(arr, conj) {
    var mots = arr.map(L).map(function (x) { return x === x.toUpperCase() ? x : x.toLowerCase(); });
    if (mots.length < 2) return mots.join("");
    return mots.slice(0, -1).join(", ") + " " + t(conj === "and" ? "list.and" : "list.or") + " " + mots[mots.length - 1];
  }

  function locale() { return lang === "fr" ? "fr-CA" : "en-CA"; }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
    } catch (e) { return String(iso).slice(0, 10); }
  }

  // Traduit le HTML statique : data-i18n (texte), data-i18n-aria (aria-label).
  function apply(root, titleKey) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.documentElement.lang = lang;
    if (titleKey) document.title = t(titleKey);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));
  }

  function set(next) {
    if (next !== "fr" && next !== "en" || next === lang) return;
    lang = next;
    safeSet(KEY, lang);
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  window.I18N = {
    get lang() { return lang; },
    t: t,
    L: L,
    liste: liste,
    locale: locale,
    formatDate: formatDate,
    apply: apply,
    set: set,
    toggle: function () { set(lang === "fr" ? "en" : "fr"); }
  };
  document.documentElement.lang = lang;
})();
