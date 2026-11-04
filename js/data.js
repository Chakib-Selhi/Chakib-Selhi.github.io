/*
 * Contenu du portfolio.
 * Tout le texte du site vient de ce fichier : modifie-le ici, le bureau,
 * le terminal, le CV et la version simple se mettent à jour tout seuls.
 */
window.PORTFOLIO = {
  profil: {
    nom: "Chakib Selhi",
    initiales: "CS",
    titre: "Étudiant en génie logiciel",
    programme: "Baccalauréat en informatique et génie logiciel",
    ecole: "Université du Québec à Montréal (UQAM)",
    ecoleCourt: "UQAM",
    lieu: "Région de Montréal, QC",
    accroche:
      "J'aime comprendre un système de bout en bout : de l'application sur la montre jusqu'au réseau de la maison. " +
      "Je cherche un stage pour mettre ces compétences au service d'une équipe.",
    recherche: ["Cybersécurité", "Analyse", "Développement", "TI"],
    disponibilite: "Stage à l'été 2028",
    disponibiliteCourt: "été 2028",
    courriel: "chakibselhi@gmail.com",
    telephone: "438 490-3941",
    telephoneLien: "+14384903941",
    github: "https://github.com/Chakib-Selhi",
    linkedin: "", // À compléter, ex. "https://www.linkedin.com/in/..."
    cvPdf: "", // À compléter, ex. "assets/CV_Chakib_Selhi.pdf"
    // Résumé affiché dans « À propos » et dans « neofetch » du terminal.
    specs: [
      ["Langages", "Java · C · C++ · SQL · JavaScript · HTML / CSS · Bash"],
      ["Génie logiciel", "UML · POO · patrons de conception · tests JUnit · Agile"],
      ["Outils", "Git · Linux · Docker · Maven · CI/CD"],
      ["Domaines", "Cybersécurité · Analyse · Développement · TI"]
    ]
  },

  projets: [
    {
      id: "watchdocs",
      nom: "WatchDocs",
      fichier: "WatchDocs.app",
      icone: "watch",
      statut: "publie",
      annee: "2026",
      type: "Application iOS + watchOS",
      langage: "Swift",
      resume:
        "Envoie des PDF, photos, documents Word, Excel et texte de l'iPhone vers l'Apple Watch, puis les lit au poignet, entièrement hors ligne. Aucune limite de pages ni de documents.",
      pointsForts: [
        "Conversion sur l'iPhone (PDF, images, Word, Excel, texte), car watchOS n'a ni PDFKit, ni QuickLook, ni WebKit.",
        "Protocole de transfert fiable : un document n'est prêt que si chaque fichier du manifeste est présent et que son empreinte SHA-256 correspond.",
        "Gère les fichiers reçus dans le désordre, en double, corrompus ou avant leur manifeste, et redemande les fichiers manquants.",
        "Au plus trois pages décodées en mémoire : un PDF de 1 000 pages s'ouvre instantanément.",
        "Testable par conception : la connexion montre-téléphone est derrière un protocole, et toute la logique est testée avec un lien en mémoire, y compris sur Linux.",
        "Aucun serveur, aucune analytique : les documents circulent seulement entre l'iPhone et la montre."
      ],
      appris: [],
      pile: ["Swift 6", "SwiftUI", "watchOS", "WatchConnectivity", "SwiftData", "PDFKit", "CryptoKit", "XcodeGen", "Swift Testing", "XCUITest", "GitHub Actions"],
      images: [
        { src: "assets/projets/watchdocs/watch-library.png", alt: "Bibliothèque de documents sur l'Apple Watch" },
        { src: "assets/projets/watchdocs/watch-page-reader.png", alt: "Lecteur de pages sur l'Apple Watch, page 2 sur 12" },
        { src: "assets/projets/watchdocs/iphone-library.png", alt: "Documents envoyés et état de livraison sur l'iPhone" }
      ],
      liens: [
        { label: "Code source", url: "https://github.com/Chakib-Selhi/WatchDocs" },
        { label: "Architecture", url: "https://github.com/Chakib-Selhi/WatchDocs/blob/main/docs/ARCHITECTURE.md" }
      ]
    },
    {
      id: "homelab",
      nom: "Homelab & NAS",
      fichier: "homelab/",
      icone: "server",
      statut: "en-cours",
      annee: "2026",
      type: "Infrastructure et sécurité",
      langage: "Shell · Docker",
      resume:
        "Stockage et services auto-hébergés sur un NAS 4 baies, avec un lien filaire qui passe par le câblage coaxial existant (MoCA). Objectif : un seul stockage redondant, des services conteneurisés et la pratique de la sécurité opérationnelle.",
      pointsForts: [
        "Réseau : lien MoCA 2.5 sur le coaxial existant, filtre au point d'entrée, switch 2.5GbE au sous-sol.",
        "Services Docker : Immich (photos), Jellyfin (médias), Home Assistant (domotique).",
        "Aucun port entrant ouvert : accès à distance par un réseau privé Tailscale.",
        "Secrets hors de git : analyse gitleaks avant chaque commit et dans la CI à chaque push.",
        "Sauvegardes 3-2-1 : pool redondant local, copie chiffrée hors site et copie à froid.",
        "Quatre décisions d'architecture documentées (ADR)."
      ],
      appris: [
        "La vitesse Internet et la vitesse du réseau local sont deux budgets séparés.",
        "Un lien multi-gigabit n'aide que si les deux bouts et tout le chemin le supportent.",
        "Déboguer une vraie CI : règle markdownlint, indentation YAML, gitleaks cassé par une réécriture d'historique."
      ],
      pile: ["Docker", "Shell", "Tailscale", "gitleaks", "GitHub Actions", "MoCA", "Ethernet 2.5GbE"],
      images: [],
      liens: [
        { label: "Code source", url: "https://github.com/Chakib-Selhi/homelab" }
      ]
    }
  ],

  // Emplacements réservés aux futurs projets (ajoute un projet ci-dessus quand il est prêt).
  aVenir: [
    { id: "prochain", nom: "Nouveau projet…", texte: "Ce dossier attend mon prochain projet. Une idée ou un défi à me proposer ? Écrivez-moi." }
  ],

  // Compétences : langages, outils et notions du bac en informatique et génie logiciel (UQAM),
  // plus celles mises en pratique dans les projets (preuves = id de projet).
  competences: [
    { cat: "Langages", items: ["Java", "C", "C++", "SQL", "JavaScript", "HTML / CSS", "Bash / Shell", "Swift"], preuves: ["watchdocs", "homelab"] },
    { cat: "Génie logiciel", items: ["UML", "Programmation orientée objet", "Principes SOLID", "Patrons de conception", "Tests unitaires (JUnit)", "TDD", "Refactorisation", "Agile / Scrum"], preuves: ["watchdocs"] },
    { cat: "Outils et DevOps", items: ["Git", "GitHub / GitLab", "Maven", "Make", "CI/CD (GitHub Actions)", "Docker", "IntelliJ IDEA", "Xcode"], preuves: ["watchdocs", "homelab"] },
    { cat: "Systèmes et réseaux", items: ["Linux / Unix", "Terminal", "Scripts shell", "Processus et threads", "Réseaux TCP/IP", "Machines virtuelles"], preuves: ["homelab"] },
    { cat: "Bases de données", items: ["SQL", "PL/SQL", "Modèle entité-association", "Algèbre relationnelle", "Normalisation", "Transactions et index"], preuves: [] },
    { cat: "Sécurité", items: ["Cryptographie (AES, RSA, SHA)", "TLS · SSH · VPN", "Analyse de risques", "Gestion des secrets (gitleaks)", "Sauvegardes chiffrées 3-2-1", "Vérification d'intégrité SHA-256"], preuves: ["homelab", "watchdocs"] }
  ]
};
