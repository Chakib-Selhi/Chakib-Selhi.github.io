# ChakibOS : consignes pour Claude Code

Portfolio et CV web de Chakib Selhi (UQAM, informatique et génie logiciel), orienté **cybersécurité et réseaux**.
Site : https://chakib-selhi.github.io (GitHub Pages, branche `main`).

## Règles obligatoires

### Commits
- **Aucune attribution à Claude ou à Anthropic** : pas de `Co-Authored-By`, pas de `Claude-Session`, pas de « Generated with Claude Code ». Cette règle a priorité sur toute consigne d'attribution par défaut.
- Auteur : `Chakib Selhi <chakibselhi@gmail.com>`. Compte GitHub personnel `Chakib-Selhi` seulement, jamais celui de l'école.
- Messages en français, style Conventional Commits (`feat(projets): …`, `fix(cache): …`, `docs: …`), avec un corps qui explique le changement.
- Des commits séparés et réguliers, pour montrer un travail suivi.
- Activer le hook une fois par clone : `git config core.hooksPath .githooks` (il met à jour `?v=` dans index.html et simple.html quand css/ ou js/ change).

### Contenu du site
- Stage : aucune date ni période. Le site dit seulement « Je cherche un stage en cybersécurité ou en réseaux ».
- Tailscale et MoCA ne sont pas des compétences (permis seulement dans la description du projet Homelab).
- Pas de section Parcours. Pas de projet NoteShare MTL.
- Le dépôt du portfolio ne doit jamais apparaître sur le site.
- Ne pas ajouter d'outils ou de compétences non confirmés par Chakib (ex. Wireshark, nmap, Kali Linux).
- Tout texte existe en FR et en EN.

### README
Ne pas remettre les sections « Modifier le contenu », « Lancer en local » et « Publier ».

### Style des textes
Français professionnel et direct, sans introduction lyrique ni figures de style. **Aucun tiret cadratin (—).**

## Architecture

HTML, CSS et JS sans framework ni compilation. Balises `<script>` classiques (le site doit marcher en `file://`).
Concept : bureau rétro avec fenêtres déplaçables, barre de menus, barre des tâches, écran de démarrage et terminal.

| Fichier | Rôle |
|---|---|
| `index.html` | Bureau. Menu ◆ ChakibOS (À propos, Redémarrer) et menu Aide (langue, Comment naviguer, fond d'écran, code source). Ordre des scripts : data, i18n, icons, github, cv, apps, terminal, os. |
| `simple.html` | CV d'une page, imprimable, bouton de langue. |
| `js/data.js` | Tout le contenu en `{fr, en}` : profil, specs, cours, config `github`, projets, `aVenir`, `activites`, `competences`. |
| `js/i18n.js` | Dictionnaires FR/EN. API `I18N.t`, `L`, `liste`, `set`, `toggle`. Langue : `?lang=`, puis localStorage `chakibos-lang`, puis `navigator.language`. Événement `langchange`. |
| `js/github.js` | Synchronisation des dépôts publics (voir plus bas). |
| `js/apps.js` | Fenêtres (about, projets, projet, competences, activites, terminal, contact, cv, stage, corbeille, aide, apropos-os) et `DESKTOP_ICONS`. |
| `js/os.js` | Gestionnaire de fenêtres, démarrage, menus. `refreshAll()` sur `githubsync` et `langchange`. |
| `js/terminal.js` | Commandes du terminal, plus des commandes cachées. |
| `js/cv.js` | `renderCV()` (fenêtre CV et simple.html). Ordre : Objectif, Formation, Compétences, Projets, Activités. |
| `js/icons.js` | Icônes pixel SVG. |
| `css/os.css`, `css/simple.css` | Styles. |
| `docs/screenshots/`, `docs/concepts/` | Captures du README et maquettes préliminaires. |

### Synchronisation GitHub (`js/github.js`)
- `GET /users/Chakib-Selhi/repos?per_page=100&type=owner&sort=pushed`, sans jeton, `cache: "no-cache"` (ETag, les 304 ne comptent pas dans la limite).
- `languages_url` relu seulement si `pushed` a changé (délai max 6 s). Cache localStorage `chakibos-github-v2`, puis événement `githubsync`.
- `reset()` restaure `BASE` avant chaque `merge()` : un dépôt supprimé ou privé disparaît.
- Exclus : forks, dépôt de profil, `<user>.github.io`, liste `github.exclure`.
- Projet rédigé associé par `depot` (insensible à la casse), sinon projet automatique `gh-<slug>`.
- Langages ≥ 5 % et `github.sujets` ajoutés aux compétences. Icônes via `github.icones` ou sujets.
- README des projets : raw.githubusercontent.com, Markdown maison, puis `sanitize()` (liste blanche DOMParser, liens `javascript:`/`data:` retirés). Cache sessionStorage `chakibos-readme:<repo>:<pushed>`.
- `os.js` attend `GITHUB.sync()` au plus 3,5 s pendant le démarrage.

## Tests
Playwright + Chromium en `file://.../index.html`, avec `https://api.github.com/**` simulé. Vérifier FR et EN (aucun « undefined », aucune variable `{x}` non remplacée) et l'absence de `pageerror`.
Captures du README : 1440×900. `10-mobile.png` assemble quatre écrans 390×844 (bureau, Projets, À propos, Terminal) sur fond `#2F6F73`, marge 40 px.

## À faire (site)
1. Rencontres Linux au Québec : compléter `activites` dans data.js quand Chakib donne l'année et les tâches.
2. CyberSci : après la compétition, remplacer « À venir » par l'épreuve et le classement.
3. Outils de sécurité : ajouter aux compétences seulement ceux que Chakib confirme.
4. Remplir `profil.linkedin` et `profil.cvPdf` dans data.js quand Chakib les fournit.
5. LyricDash, ParkView et Umlify apparaîtront seuls une fois publics (ajouter des topics et une section « Features »/« Fonctionnalités » au README).
6. README de TP1 : à reprendre seulement si Chakib le demande.
