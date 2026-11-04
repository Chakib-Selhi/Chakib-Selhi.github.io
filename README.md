# ChakibOS · Portfolio de Chakib Selhi

Portfolio en forme de **bureau rétro** : icônes, fenêtres déplaçables, terminal interactif, CV et barre des tâches.
Je suis étudiant au baccalauréat en informatique et génie logiciel à l'UQAM et je cherche un **stage pour l'été 2028**
en cybersécurité, analyse, développement ou TI.

**Site :** [chakib-selhi.github.io](https://chakib-selhi.github.io)

![Bureau de ChakibOS](docs/screenshots/01-bureau.png)

## Fonctionnalités

- **Gestionnaire de fenêtres** écrit à la main : déplacement, redimensionnement, réduction, plein écran, pile de fenêtres et barre des tâches.
- **Applications** : À propos, Projets (explorateur de fichiers + fiche de chaque projet), Compétences, CV.pdf, Contact.
- **Terminal** avec ses commandes (`help`, `whoami`, `neofetch`, `ls`, `cat`, `open`, `stage`, `contact`), complétion par Tab et historique.
- **Version simple** (`simple.html`) : tout le CV sur une seule page, lisible et imprimable, pour les recruteurs pressés.
- **Mobile** : chaque fenêtre devient une application plein écran.
- **Accessible au clavier** : Tab pour parcourir, Entrée pour ouvrir, Échap pour fermer la fenêtre active.
- **Aucune dépendance** : HTML, CSS et JavaScript, sans framework ni étape de compilation.

## Captures d'écran

| Projets | Fiche projet |
|---|---|
| ![Explorateur de projets et fiche WatchDocs](docs/screenshots/02-projet-watchdocs.png) | ![Fiche du projet Homelab](docs/screenshots/03-projet-homelab.png) |
| **Compétences** | **Terminal** |
| ![Fenêtre Compétences](docs/screenshots/04-competences.png) | ![Terminal avec neofetch](docs/screenshots/05-terminal.png) |
| **CV.pdf** | **Contact** |
| ![Fenêtre CV](docs/screenshots/06-cv.png) | ![Fenêtre Contact](docs/screenshots/07-contact.png) |
| **Menu ChakibOS** | **Version simple** |
| ![Menu ChakibOS](docs/screenshots/08-menu.png) | ![Version simple du CV](docs/screenshots/09-version-simple.png) |

**Sur mobile**

![ChakibOS sur mobile](docs/screenshots/10-mobile.png)

## Maquettes préliminaires

Avant de coder, j'ai exploré six concepts sur un canevas de design. Le concept **E · ChakibOS** a été retenu.
Ces maquettes montrent l'état des idées au départ : certaines informations ont changé depuis.

![Les six concepts](docs/concepts/00-planche-concepts.png)

| Concept | Idée |
|---|---|
| [A · Terminal interactif](docs/concepts/A-terminal.png) | Navigation par commandes, avec des puces cliquables pour les recruteurs |
| [B · Éditeur de code](docs/concepts/B-editeur-de-code.png) | Les sections sont des fichiers d'un IDE |
| [C · Git graph](docs/concepts/C-git-graph.png) | Le parcours se lit comme un historique git |
| [D · Tableau de bord SOC](docs/concepts/D-tableau-de-bord-soc.png) | Un centre des opérations de sécurité |
| [E · ChakibOS](docs/concepts/E-chakibos.png) | Un faux système d'exploitation rétro (retenu) |
| [F · Capture the Flag](docs/concepts/F-capture-the-flag.png) | Chaque section est un défi à résoudre |


## Modifier le contenu

Tout le texte vient de **`js/data.js`** : profil, coordonnées, projets, compétences et emplacements « à venir ».
Le bureau, le terminal, la fenêtre CV.pdf et la version simple se mettent à jour automatiquement.

- **Ajouter un projet** : copie un bloc dans `projets` (id, nom, fichier, icône, statut, résumé, points forts, pile, liens).
- **Icônes disponibles** : `folder`, `folderWip`, `watch`, `server`, `doc`, `terminal`, `calendar`, `mail`, `user`, `gear`.
- **Statuts des projets** : `publie`, `en-cours`, `conception`.
- **Compétences** : chaque catégorie peut pointer vers les projets qui la prouvent (`preuves`).
- **À compléter** : `linkedin` et `cvPdf` (dépose le PDF dans `assets/`).

## Structure

```
index.html      Bureau ChakibOS
simple.html     Version simple et imprimable du CV
css/os.css      Styles du bureau et des fenêtres
css/simple.css  Styles de la version simple
js/data.js      Contenu du portfolio
js/icons.js     Icônes pixel (SVG)
js/cv.js        Rendu du CV (partagé par la fenêtre CV.pdf et simple.html)
js/apps.js      Applications : À propos, Projets, Compétences, Contact, CV, etc.
js/terminal.js  Terminal et ses commandes
js/os.js        Gestionnaire de fenêtres, menus, barre des tâches, démarrage
assets/         Favicon et captures d'écran des projets
docs/           Captures d'écran du site et maquettes préliminaires
```

## Mes autres projets

- [WatchDocs](https://github.com/Chakib-Selhi/WatchDocs) : documents de l'iPhone vers l'Apple Watch, lecture hors ligne (Swift, SwiftUI, watchOS).
- [homelab](https://github.com/Chakib-Selhi/homelab) : NAS, services Docker et sécurité opérationnelle, documentés de bout en bout.
