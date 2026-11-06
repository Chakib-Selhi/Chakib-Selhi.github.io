/*
 * Contenu du portfolio, en français et en anglais : { fr: "…", en: "…" }.
 * Un texte identique dans les deux langues peut rester une simple chaîne.
 * Le bureau, le terminal, le CV et la version simple se mettent à jour tout seuls.
 *
 * Les dépôts GitHub publics de `github.utilisateur` sont ajoutés automatiquement
 * aux projets (voir js/github.js). Un projet décrit ci-dessous avec `depot`
 * garde son texte rédigé à la main et reçoit en plus les infos de GitHub.
 * Un dépôt supprimé ou passé en privé disparaît du site à la visite suivante.
 * Le dépôt du site lui-même (Chakib-Selhi.github.io) n'est jamais affiché.
 */
window.PORTFOLIO = {
  profil: {
    nom: "Chakib Selhi",
    initiales: "CS",
    titre: { fr: "Étudiant en génie logiciel", en: "Software engineering student" },
    programme: {
      fr: "Baccalauréat en informatique et génie logiciel",
      en: "Bachelor's degree in Computer Science and Software Engineering"
    },
    ecole: "Université du Québec à Montréal (UQAM)",
    ecoleCourt: "UQAM",
    lieu: { fr: "Région de Montréal, QC", en: "Montréal area, QC" },
    accroche: {
      fr: "J'aime comprendre un système de bout en bout : de l'application sur la montre jusqu'au réseau de la maison. Je cherche un stage pour mettre ces compétences au service d'une équipe.",
      en: "I like understanding a system end to end: from the app on the watch to the home network. I am looking for an internship where I can put these skills to work for a team."
    },
    recherche: {
      fr: ["Cybersécurité", "Analyse", "Développement", "TI"],
      en: ["Cybersecurity", "Analysis", "Development", "IT"]
    },
    disponibilite: { fr: "Stage à l'été 2028", en: "Internship in summer 2028" },
    disponibiliteCourt: { fr: "été 2028", en: "summer 2028" },
    courriel: "chakibselhi@gmail.com",
    telephone: "438 490-3941",
    telephoneLien: "+14384903941",
    github: "https://github.com/Chakib-Selhi",
    linkedin: "", // À compléter, ex. "https://www.linkedin.com/in/..."
    cvPdf: "", // À compléter, ex. "assets/CV_Chakib_Selhi.pdf"
    // Résumé affiché dans « À propos » et dans « neofetch ».
    // auto: "langages" ajoute les nouveaux langages trouvés sur GitHub.
    specs: [
      { label: { fr: "Langages", en: "Languages" }, valeur: "Java · C · C++ · SQL · JavaScript · HTML / CSS · Bash", auto: "langages" },
      { label: { fr: "Génie logiciel", en: "Software engineering" }, valeur: { fr: "UML · POO · patrons de conception · tests JUnit · Agile", en: "UML · OOP · design patterns · JUnit tests · Agile" } },
      { label: { fr: "Outils", en: "Tools" }, valeur: "Git · Linux · Docker · Maven · CI/CD" },
      { label: { fr: "Domaines", en: "Fields" }, valeur: { fr: "Cybersécurité · Analyse · Développement · TI", en: "Cybersecurity · Analysis · Development · IT" } }
    ]
  },

  /* Synchronisation avec GitHub (js/github.js). */
  github: {
    utilisateur: "Chakib-Selhi",
    exclure: [], // Noms de dépôts publics à ne pas afficher, ex. ["test-repo"]
    inclureForks: false,
    // Icône des dépôts ajoutés automatiquement : nom du dépôt → icône de js/icons.js.
    icones: { "HoraireSync": "calendar", "Relaviz": "relalg" },
    // Sujets (topics) GitHub reconnus comme compétences : sujet → [catégorie, compétence].
    // Une compétence null ajoute seulement le projet comme preuve de la catégorie.
    sujets: {
      "docker": ["outils", "Docker"],
      "github-actions": ["outils", "CI/CD (GitHub Actions)"],
      "ci": ["outils", "CI/CD (GitHub Actions)"],
      "ci-cd": ["outils", "CI/CD (GitHub Actions)"],
      "git": ["outils", "Git"],
      "maven": ["outils", "Maven"],
      "gradle": ["outils", "Gradle"],
      "kubernetes": ["outils", "Kubernetes"],
      "xcodegen": ["outils", "Xcode"],
      "github-pages": ["outils", "GitHub Pages"],
      "junit": ["genie", { fr: "Tests unitaires (JUnit)", en: "Unit testing (JUnit)" }],
      "testing": ["genie", { fr: "Tests unitaires (JUnit)", en: "Unit testing (JUnit)" }],
      "tdd": ["genie", "TDD"],
      "uml": ["genie", "UML"],
      "design-patterns": ["genie", { fr: "Patrons de conception", en: "Design patterns" }],
      "oop": ["genie", { fr: "Programmation orientée objet", en: "Object-oriented programming" }],
      "agile": ["genie", "Agile / Scrum"],
      "scrum": ["genie", "Agile / Scrum"],
      "linux": ["systemes", "Linux / Unix"],
      "networking": ["systemes", { fr: "Réseaux TCP/IP", en: "TCP/IP networking" }],
      "self-hosted": ["systemes", { fr: "Auto-hébergement", en: "Self-hosting" }],
      "homelab": ["systemes", { fr: "Auto-hébergement", en: "Self-hosting" }],
      "virtualization": ["systemes", { fr: "Machines virtuelles", en: "Virtual machines" }],
      "sql": ["bd", "SQL"],
      "postgresql": ["bd", "PostgreSQL"],
      "mysql": ["bd", "MySQL"],
      "sqlite": ["bd", "SQLite"],
      "oracle": ["bd", "Oracle"],
      "mongodb": ["bd", "MongoDB"],
      "cybersecurity": ["securite", null],
      "security": ["securite", null],
      "pentest": ["securite", { fr: "Tests d'intrusion", en: "Penetration testing" }],
      "cryptography": ["securite", { fr: "Cryptographie (AES, RSA, SHA)", en: "Cryptography (AES, RSA, SHA)" }],
      "swiftui": ["frameworks", "SwiftUI"],
      "ios": ["frameworks", "iOS"],
      "watchos": ["frameworks", "watchOS"],
      "android": ["frameworks", "Android"],
      "react": ["frameworks", "React"],
      "vue": ["frameworks", "Vue.js"],
      "angular": ["frameworks", "Angular"],
      "nodejs": ["frameworks", "Node.js"],
      "express": ["frameworks", "Express"],
      "spring": ["frameworks", "Spring"],
      "spring-boot": ["frameworks", "Spring Boot"],
      "django": ["frameworks", "Django"],
      "flask": ["frameworks", "Flask"],
      "javafx": ["frameworks", "JavaFX"]
    }
  },

  projets: [
    {
      id: "watchdocs",
      depot: "WatchDocs",
      nom: "WatchDocs",
      fichier: "WatchDocs.app",
      icone: "watch",
      statut: "publie",
      annee: "2026",
      type: { fr: "Application iOS + watchOS", en: "iOS + watchOS app" },
      langage: "Swift",
      resume: {
        fr: "Envoie des PDF, photos, documents Word, Excel et texte de l'iPhone vers l'Apple Watch, puis les lit au poignet, entièrement hors ligne. Aucune limite de pages ni de documents.",
        en: "Sends PDFs, photos, Word, Excel and text files from the iPhone to the Apple Watch, then reads them on the wrist, fully offline. No page or document limit."
      },
      pointsForts: {
        fr: [
          "Conversion sur l'iPhone (PDF, images, Word, Excel, texte), car watchOS n'a ni PDFKit, ni QuickLook, ni WebKit.",
          "Protocole de transfert fiable : un document n'est prêt que si chaque fichier du manifeste est présent et que son empreinte SHA-256 correspond.",
          "Gère les fichiers reçus dans le désordre, en double, corrompus ou avant leur manifeste, et redemande les fichiers manquants.",
          "Au plus trois pages décodées en mémoire : un PDF de 1 000 pages s'ouvre instantanément.",
          "Testable par conception : la connexion montre-téléphone est derrière un protocole, et toute la logique est testée avec un lien en mémoire, y compris sur Linux.",
          "Aucun serveur, aucune analytique : les documents circulent seulement entre l'iPhone et la montre."
        ],
        en: [
          "On-device conversion on the iPhone (PDF, images, Word, Excel, text), since watchOS has no PDFKit, QuickLook or WebKit.",
          "Reliable transfer protocol: a document is ready only when every file in its manifest is present and its SHA-256 hash matches.",
          "Handles files that arrive out of order, twice, corrupted or before their manifest, and asks again for missing files.",
          "At most three decoded pages in memory: a 1,000-page PDF opens instantly.",
          "Testable by design: the watch-phone link sits behind a protocol, and all the logic is tested with an in-memory link, Linux included.",
          "No server and no analytics: documents only travel between the iPhone and the watch."
        ]
      },
      appris: [],
      pile: ["Swift 6", "SwiftUI", "watchOS", "WatchConnectivity", "SwiftData", "PDFKit", "CryptoKit", "XcodeGen", "Swift Testing", "XCUITest", "GitHub Actions"],
      images: [
        { src: "assets/projets/watchdocs/watch-library.png", alt: { fr: "Bibliothèque de documents sur l'Apple Watch", en: "Document library on the Apple Watch" } },
        { src: "assets/projets/watchdocs/watch-page-reader.png", alt: { fr: "Lecteur de pages sur l'Apple Watch, page 2 sur 12", en: "Page reader on the Apple Watch, page 2 of 12" } },
        { src: "assets/projets/watchdocs/iphone-library.png", alt: { fr: "Documents envoyés et état de livraison sur l'iPhone", en: "Sent documents and delivery status on the iPhone" } }
      ],
      liens: [
        { label: { fr: "Code source", en: "Source code" }, url: "https://github.com/Chakib-Selhi/WatchDocs" },
        { label: "Architecture", url: "https://github.com/Chakib-Selhi/WatchDocs/blob/main/docs/ARCHITECTURE.md" }
      ]
    },
    {
      id: "homelab",
      depot: "homelab",
      nom: "Homelab & NAS",
      fichier: "homelab/",
      icone: "server",
      statut: "en-cours",
      annee: "2026",
      type: { fr: "Infrastructure et sécurité", en: "Infrastructure and security" },
      langage: "Shell · Docker",
      resume: {
        fr: "Stockage et services auto-hébergés sur un NAS 4 baies, avec un lien filaire qui passe par le câblage coaxial existant (MoCA). Objectif : un seul stockage redondant, des services conteneurisés et la pratique de la sécurité opérationnelle.",
        en: "Self-hosted storage and services on a 4-bay NAS, with a wired link over the home's existing coaxial cabling (MoCA). Goal: one redundant storage pool, containerized services and hands-on operational security."
      },
      pointsForts: {
        fr: [
          "Réseau : lien MoCA 2.5 sur le coaxial existant, filtre au point d'entrée, switch 2.5GbE au sous-sol.",
          "Services Docker : Immich (photos), Jellyfin (médias), Home Assistant (domotique).",
          "Aucun port entrant ouvert : accès à distance par un réseau privé Tailscale.",
          "Secrets hors de git : analyse gitleaks avant chaque commit et dans la CI à chaque push.",
          "Sauvegardes 3-2-1 : pool redondant local, copie chiffrée hors site et copie à froid.",
          "Quatre décisions d'architecture documentées (ADR)."
        ],
        en: [
          "Network: MoCA 2.5 link over the existing coax, point-of-entry filter, 2.5GbE switch in the basement.",
          "Docker services: Immich (photos), Jellyfin (media), Home Assistant (home automation).",
          "No inbound port open: remote access through a private Tailscale network.",
          "Secrets kept out of git: gitleaks scan before every commit and in CI on every push.",
          "3-2-1 backups: local redundant pool, encrypted offsite copy and cold copy.",
          "Four documented architecture decisions (ADRs)."
        ]
      },
      appris: {
        fr: [
          "La vitesse Internet et la vitesse du réseau local sont deux budgets séparés.",
          "Un lien multi-gigabit n'aide que si les deux bouts et tout le chemin le supportent.",
          "Déboguer une vraie CI : règle markdownlint, indentation YAML, gitleaks cassé par une réécriture d'historique."
        ],
        en: [
          "Internet speed and local network speed are two separate budgets.",
          "A multi-gig link only helps when both ends and the whole path support it.",
          "Debugging a real CI pipeline: a markdownlint rule, YAML indentation, and gitleaks broken by a history rewrite."
        ]
      },
      pile: ["Docker", "Shell", "Tailscale", "gitleaks", "GitHub Actions", "MoCA", "Ethernet 2.5GbE"],
      images: [],
      liens: [
        { label: { fr: "Code source", en: "Source code" }, url: "https://github.com/Chakib-Selhi/homelab" }
      ]
    }
  ],

  // Emplacements réservés aux futurs projets.
  aVenir: [
    {
      id: "prochain",
      nom: { fr: "Nouveau projet…", en: "New project…" },
      texte: {
        fr: "Ce dossier attend mon prochain projet. Chaque nouveau dépôt public sur GitHub apparaît ici automatiquement. Une idée ou un défi à me proposer ? Écrivez-moi.",
        en: "This folder is waiting for my next project. Every new public GitHub repository shows up here automatically. Have an idea or a challenge for me? Write to me."
      }
    }
  ],

  // Compétences du bac en informatique et génie logiciel (UQAM) et des projets.
  // preuves = id des projets où la compétence est mise en pratique.
  competences: [
    {
      id: "langages",
      cat: { fr: "Langages", en: "Languages" },
      items: ["Java", "C", "C++", "SQL", "JavaScript", "HTML / CSS", "Bash / Shell", "Swift"],
      preuves: ["watchdocs", "homelab"]
    },
    {
      id: "genie",
      cat: { fr: "Génie logiciel", en: "Software engineering" },
      items: [
        "UML",
        { fr: "Programmation orientée objet", en: "Object-oriented programming" },
        { fr: "Principes SOLID", en: "SOLID principles" },
        { fr: "Patrons de conception", en: "Design patterns" },
        { fr: "Tests unitaires (JUnit)", en: "Unit testing (JUnit)" },
        "TDD",
        { fr: "Refactorisation", en: "Refactoring" },
        "Agile / Scrum"
      ],
      preuves: ["watchdocs"]
    },
    {
      id: "outils",
      cat: { fr: "Outils et DevOps", en: "Tools and DevOps" },
      items: ["Git", "GitHub / GitLab", "Maven", "Make", "CI/CD (GitHub Actions)", "Docker", "IntelliJ IDEA", "Xcode"],
      preuves: ["watchdocs", "homelab"]
    },
    {
      id: "systemes",
      cat: { fr: "Systèmes et réseaux", en: "Systems and networks" },
      items: [
        "Linux / Unix",
        { fr: "Terminal", en: "Command line" },
        { fr: "Scripts shell", en: "Shell scripting" },
        { fr: "Processus et threads", en: "Processes and threads" },
        { fr: "Réseaux TCP/IP", en: "TCP/IP networking" },
        { fr: "Machines virtuelles", en: "Virtual machines" }
      ],
      preuves: ["homelab"]
    },
    {
      id: "bd",
      cat: { fr: "Bases de données", en: "Databases" },
      items: [
        "SQL",
        "PL/SQL",
        { fr: "Modèle entité-association", en: "Entity-relationship modeling" },
        { fr: "Algèbre relationnelle", en: "Relational algebra" },
        { fr: "Normalisation", en: "Normalization" },
        { fr: "Transactions et index", en: "Transactions and indexes" }
      ],
      preuves: []
    },
    {
      id: "securite",
      cat: { fr: "Sécurité", en: "Security" },
      items: [
        { fr: "Cryptographie (AES, RSA, SHA)", en: "Cryptography (AES, RSA, SHA)" },
        "TLS · SSH · VPN",
        { fr: "Analyse de risques", en: "Risk analysis" },
        { fr: "Gestion des secrets (gitleaks)", en: "Secrets management (gitleaks)" },
        { fr: "Sauvegardes chiffrées 3-2-1", en: "Encrypted 3-2-1 backups" },
        { fr: "Vérification d'intégrité SHA-256", en: "SHA-256 integrity checks" }
      ],
      preuves: ["homelab", "watchdocs"]
    }
  ]
};
