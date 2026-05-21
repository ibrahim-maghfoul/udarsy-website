export interface TextPart {
  text: string;
  href?: string;
}

export interface Block {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'cta' | 'links';
  text?: string;
  parts?: TextPart[];
  items?: string[];
  href?: string;
  label?: string;
  links?: Array<{ text: string; href: string }>;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  coverImage: string;
  keywords: string[];
  blocks: Block[];
}

export const posts: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. Présentation générale
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'qu-est-ce-que-udarsy',
    title: "Qu'est-ce qu'Udarsy ? La plateforme éducative numéro 1 au Maroc",
    description:
      "Udarsy est la plateforme d'apprentissage marocaine qui propose des cours gratuits, des exercices interactifs et des examens nationaux pour les collégiens et lycéens.",
    excerpt:
      "Découvrez comment Udarsy révolutionne l'éducation au Maroc avec des milliers de cours, exercices et examens — entièrement en ligne et gratuits.",
    category: 'Présentation',
    tags: ['udarsy', 'plateforme éducative', 'maroc', 'cours en ligne'],
    date: '2025-09-01',
    readTime: '9 min',
    coverImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'udarsy',
      'يودرسي',
      'plateforme éducative maroc',
      'cours en ligne maroc',
      'éducation numérique maroc',
    ],
    blocks: [
      {
        type: 'p',
        text: "Udarsy est une plateforme éducative numérique conçue spécialement pour les élèves marocains, du collège jusqu'au baccalauréat. Notre mission est simple : rendre l'éducation de qualité accessible à tous, partout au Maroc, gratuitement. Que vous soyez en 3ème collège à Marrakech ou en 2ème Bac scientifique à Oujda, vous méritez les mêmes ressources pédagogiques.",
      },
      {
        type: 'h2',
        text: 'Pourquoi Udarsy a été créé ?',
      },
      {
        type: 'p',
        text: "Le système éducatif marocain forme chaque année des centaines de milliers d'élèves. Pourtant, l'accès à des ressources pédagogiques de qualité reste profondément inégal selon les régions et les milieux socio-économiques. Un lycéen dans une grande ville dispose de librairies, de centres de soutien scolaire et de cours particuliers. Un élève en zone rurale, lui, doit souvent se débrouiller seul avec les seules ressources de sa classe. Udarsy est né pour combler ce fossé structurel. Nous avons rassemblé des enseignants passionnés, des créateurs de contenu et des ingénieurs pour bâtir une bibliothèque pédagogique complète, alignée sur le programme officiel du Ministère de l'Éducation Nationale marocain.",
      },
      {
        type: 'h2',
        text: 'Explorer le programme officiel, matière par matière',
      },
      {
        type: 'p',
        parts: [
          { text: "La fonctionnalité centrale d'Udarsy est la navigation dans le curriculum marocain. Depuis la " },
          { text: "page Explorer", href: '/explore' },
          { text: ", vous sélectionnez votre niveau scolaire (collège ou lycée), votre filière, puis votre matière. Vous accédez aussitôt à toutes les leçons disponibles : cours PDF complets, vidéos explicatives tournées par des enseignants expérimentés, exercices corrigés pas à pas, et examens nationaux des années précédentes avec leurs corrections détaillées. Vous pouvez aussi " },
          { text: "parcourir l'ensemble des cours par filière", href: '/courses' },
          { text: " pour avoir une vue d'ensemble de tout le contenu disponible sur la plateforme." },
        ],
      },
      {
        type: 'h2',
        text: 'Étudier hors ligne grâce aux téléchargements',
      },
      {
        type: 'p',
        parts: [
          { text: "L'accès à internet n'est pas toujours garanti. Udarsy vous permet de télécharger vos cours en PDF pour les consulter hors ligne, dans le transport, en zone rurale, ou la veille d'un examen sans connexion fiable. Le " },
          { text: "hub de téléchargements", href: '/download' },
          { text: " centralise toutes les ressources disponibles et archive vos téléchargements passés. Le plan gratuit inclut 10 téléchargements par mois, le plan Pro 100, et le plan Premium des téléchargements illimités. Pour comparer les offres, consultez la " },
          { text: "page Tarifs", href: '/pricing' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Réviser en groupe grâce aux salles de chat',
      },
      {
        type: 'p',
        parts: [
          { text: "Étudier seul peut être épuisant. Udarsy intègre un système de " },
          { text: "salles de chat en temps réel", href: '/profile/chat' },
          { text: " organisées par niveau et par filière. Vous rejoignez instantanément des camarades du même cursus pour poser vos questions, partager vos méthodes et vous motiver mutuellement. Les enseignants vérifiés sur Udarsy peuvent également créer des salles de classe privées avec des codes d'invitation pour organiser des sessions de révision encadrées. Consultez l'" },
          { text: "annuaire des enseignants", href: '/teacher' },
          { text: " pour trouver un professeur dans votre matière." },
        ],
      },
      {
        type: 'h2',
        text: 'Les actualités éducatives marocaines',
      },
      {
        type: 'p',
        parts: [
          { text: "Udarsy ne se limite pas aux cours. La section " },
          { text: "Actualités", href: '/news' },
          { text: " regroupe les informations les plus importantes pour les élèves marocains : dates d'inscription aux examens, résultats du Brevet et du BAC, annonces du Ministère de l'Éducation, concours nationaux et bourses d'études. Chaque article peut être noté et dispose d'une section Q&A intégrée où les lecteurs posent des questions et reçoivent des réponses de la communauté. Vous pouvez sauvegarder vos articles préférés dans vos " },
          { text: "actualités favorites", href: '/favorites/news' },
          { text: " pour les retrouver facilement." },
        ],
      },
      {
        type: 'h2',
        text: 'La communauté de contributeurs',
      },
      {
        type: 'p',
        parts: [
          { text: "Udarsy est aussi une plateforme participative. Le " },
          { text: "Hub de contributions", href: '/contributions' },
          { text: " permet à chaque élève de partager ses propres fiches de révision, exercices ou liens utiles. Chaque ressource est examinée par l'équipe avant publication. Les meilleurs contributeurs grimpent dans le " },
          { text: "classement général", href: '/rankings' },
          { text: " et reçoivent des badges de reconnaissance. C'est une façon concrète d'aider des milliers d'élèves à travers le Maroc tout en développant votre propre compréhension des matières." },
        ],
      },
      {
        type: 'h2',
        text: 'Le calendrier scolaire intégré',
      },
      {
        type: 'p',
        parts: [
          { text: "La " },
          { text: "page Calendrier", href: '/calendar' },
          { text: " d'Udarsy affiche automatiquement les événements scolaires nationaux marocains : rentrée scolaire, vacances officielles, dates des examens du Brevet et du BAC, proclamation des résultats. Vous pouvez y ajouter vos propres événements personnels — contrôles, révisions, rendez-vous — et créer des todos pour rester organisé tout au long de l'année scolaire. Tout votre agenda scolaire est ainsi centralisé en un seul endroit." },
        ],
      },
      {
        type: 'h2',
        text: 'Des instructeurs certifiés pour approfondir chaque matière',
      },
      {
        type: 'p',
        parts: [
          { text: "Au-delà des cours officiels, Udarsy accueille des " },
          { text: "instructeurs certifiés", href: '/instructors' },
          { text: " qui publient leurs propres cours vidéo et PDF sur leurs spécialités. Ces contenus viennent enrichir la bibliothèque officielle avec des approches pédagogiques variées, des explications alternatives et des méthodes de résolution originales. Vous pouvez noter les cours de chaque instructeur et laisser des avis pour guider les autres élèves." },
        ],
      },
      {
        type: 'h2',
        text: 'Pour qui est fait Udarsy ?',
      },
      {
        type: 'ul',
        items: [
          'Élèves du collège préparant le BEPC ou le Brevet',
          'Lycéens en filière Scientifique, Littéraire ou Technologique',
          'Candidats libres au Baccalauréat cherchant des ressources complètes',
          'Enseignants souhaitant créer des salles de classe virtuelles et partager leurs cours',
          'Instructeurs et créateurs de contenu éducatif qui veulent toucher un large public marocain',
          'Parents qui veulent suivre la progression scolaire de leurs enfants',
        ],
      },
      {
        type: 'cta',
        text: "Commencez à apprendre gratuitement dès aujourd'hui et rejoignez des milliers d'élèves marocains.",
        href: '/signup',
        label: "S'inscrire gratuitement",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Réussir le BAC
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'comment-reussir-son-bac-maroc',
    title: 'Comment réussir son BAC au Maroc — Méthodes et ressources 2025',
    description:
      'Guide pratique pour décrocher le baccalauréat marocain avec mention. Emploi du temps, techniques de révision et ressources Udarsy recommandées.',
    excerpt:
      'Emploi du temps optimal, techniques de mémorisation et ressources Udarsy pour décrocher votre baccalauréat marocain avec mention.',
    category: 'Révisions',
    tags: ['bac maroc', 'revision bac', 'baccalaureat', 'lycee maroc'],
    date: '2025-09-15',
    readTime: '11 min',
    coverImage:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'bac maroc 2025',
      'réussir baccalauréat maroc',
      'révision bac maroc',
      'préparation bac maroc',
      'باكالوريا المغرب',
    ],
    blocks: [
      {
        type: 'p',
        text: "Le Baccalauréat marocain est l'examen qui conditionne l'accès à l'enseignement supérieur et, souvent, l'orientation professionnelle de toute une vie. Pourtant, réussir le BAC avec une bonne note n'est pas réservé aux élèves les plus doués — c'est d'abord une question d'organisation, de méthode et d'accès aux bonnes ressources. Ce guide rassemble les stratégies les plus efficaces, validées par des milliers d'élèves marocains.",
      },
      {
        type: 'h2',
        text: "Construire un planning de révision réaliste",
      },
      {
        type: 'p',
        text: "La première erreur des candidats au BAC est de commencer à réviser trop tard, ou de réviser sans plan. Un planning de révision sérieux doit démarrer au moins quatre mois avant les épreuves. Découpez vos matières selon leur coefficient : en filière scientifique, les Mathématiques, la Physique-Chimie et la SVT méritent la majorité de votre temps. En filière littéraire, concentrez-vous sur la Langue arabe, la Philosophie et la Langue française. Consacrez trois à quatre heures de révision par jour, découpées en sessions de 45 minutes avec des pauses de 15 minutes — un rythme que le cerveau peut soutenir sur plusieurs mois sans s'épuiser.",
      },
      {
        type: 'h2',
        text: "La méthode des examens passés : votre meilleur allié",
      },
      {
        type: 'p',
        parts: [
          { text: "Aucune technique de révision n'est plus efficace que de résoudre des examens nationaux des années précédentes. En vous confrontant aux vraies épreuves, vous apprenez à gérer le temps, à identifier les types de questions récurrents et à comprendre le niveau d'exigence exact du jury. Udarsy met à disposition des centaines d'examens corrigés classés par matière, filière et année depuis la " },
          { text: "page Explorer", href: '/explore' },
          { text: ". Commencez par les examens des trois dernières années pour chaque matière, puis remontez progressivement. Notez vos erreurs dans un carnet dédié : ce sont elles qui vous feront progresser le plus rapidement." },
        ],
      },
      {
        type: 'h2',
        text: "Calculer sa moyenne et anticiper ses résultats",
      },
      {
        type: 'p',
        parts: [
          { text: "Avant les épreuves finales, il est essentiel de connaître votre situation de départ. Le " },
          { text: "calculateur de notes BAC et Brevet", href: '/grades-calculator' },
          { text: " d'Udarsy vous permet de saisir vos notes de contrôle continu et de simuler différents scénarios selon vos coefficients de filière. Vous saurez exactement quelle note vous devez obtenir à chaque épreuve finale pour atteindre votre objectif — que ce soit décrocher le BAC ou l'obtenir avec mention Bien ou Très Bien. Cette transparence vous aide à prioriser vos révisions de façon chirurgicale." },
        ],
      },
      {
        type: 'h2',
        text: "Les fiches de révision : synthétiser pour mieux retenir",
      },
      {
        type: 'p',
        parts: [
          { text: "Après avoir étudié un chapitre, résumez-le en une fiche d'une page maximum. Ce processus de synthèse oblige votre cerveau à sélectionner l'essentiel et à le reformuler dans vos propres mots — une des formes d'apprentissage les plus profondes. Vos fiches deviennent ensuite vos outils de révision express la veille des examens. Si vos fiches sont bien faites, partagez-les avec la communauté depuis le " },
          { text: "hub de contributions", href: '/contributions' },
          { text: " : elles aideront des centaines d'élèves et vous rapporteront des points dans le " },
          { text: "classement des contributeurs", href: '/rankings' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: "Étudier en groupe : l'effet multiplicateur",
      },
      {
        type: 'p',
        parts: [
          { text: "Expliquer un concept à quelqu'un d'autre est la meilleure façon de vérifier si vous l'avez vraiment compris. La dynamique de groupe force également à respecter un rythme et maintient la motivation sur le long terme. Rejoignez les " },
          { text: "salles de chat d'étude Udarsy", href: '/profile/chat' },
          { text: " organisées par filière pour poser vos questions, partager vos méthodes et découvrir des approches de résolution que vous n'auriez pas trouvées seul. Des milliers d'élèves marocains y révisent en ce moment même." },
        ],
      },
      {
        type: 'h2',
        text: "Rester informé des dates et annonces officielles",
      },
      {
        type: 'p',
        parts: [
          { text: "Pendant la période des examens, les informations changent vite. Inscriptions, changements de calendrier, proclamation des résultats — tout est publié en temps réel dans la section " },
          { text: "Actualités d'Udarsy", href: '/news' },
          { text: ". Ajoutez également les dates clés — épreuves du BAC, session de rattrapage, résultats — dans votre " },
          { text: "calendrier Udarsy", href: '/calendar' },
          { text: " pour ne rien rater et planifier vos révisions en conséquence." },
        ],
      },
      {
        type: 'h2',
        text: "Le jour de l'examen : les règles d'or",
      },
      {
        type: 'ul',
        items: [
          "Lisez l'ensemble des questions avant de commencer à rédiger — cela vous donne une vue globale et vous aide à gérer votre temps",
          "Commencez par les questions que vous maîtrisez pour sécuriser les points faciles",
          "Ne bloquez pas plus de 20 % du temps sur une seule question difficile",
          "Montrez toujours votre démarche, même si vous n'atteignez pas le résultat final — les correcteurs valorisent le raisonnement",
          "Relisez votre copie les dix dernières minutes pour corriger les erreurs d'inattention",
          "Dormez au moins huit heures la nuit précédente — la fatigue divise par deux l'efficacité cognitive",
        ],
      },
      {
        type: 'cta',
        text: "Accédez à tous les cours, exercices et examens du BAC gratuitement sur Udarsy.",
        href: '/explore',
        label: "Explorer les cours BAC",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Cours gratuits lycée
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'cours-gratuits-lycee-maroc',
    title: 'Cours gratuits pour lycéens au Maroc — Ce que propose Udarsy',
    description:
      "Mathématiques, Physique, SVT, Histoire-Géo, Arabe... Découvrez les milliers de cours PDF et vidéos gratuits disponibles sur Udarsy pour le lycée marocain.",
    excerpt:
      "Mathématiques, Physique, SVT, Histoire-Géo... Des milliers de cours PDF et vidéos alignés sur le programme officiel marocain, disponibles gratuitement.",
    category: 'Cours',
    tags: ['cours gratuits', 'lycée maroc', 'programme scolaire', 'matières bac'],
    date: '2025-10-01',
    readTime: '9 min',
    coverImage:
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'cours gratuits lycée maroc',
      'cours mathématiques maroc',
      'cours physique chimie maroc',
      'SVT maroc',
      'دروس مجانية المغرب',
    ],
    blocks: [
      {
        type: 'p',
        parts: [
          { text: "Udarsy propose une bibliothèque pédagogique complète pour tous les niveaux du lycée marocain. Chaque cours est conçu en accord avec le programme officiel du Ministère de l'Éducation Nationale et peut être consulté gratuitement depuis n'importe quel appareil. Depuis la " },
          { text: "page Explorer", href: '/explore' },
          { text: ", vous sélectionnez votre niveau (1ère Bac, 2ème Bac), votre filière, puis la matière souhaitée pour accéder à l'ensemble des leçons disponibles. Vous pouvez aussi " },
          { text: "parcourir les cours par filière", href: '/courses' },
          { text: " pour avoir une vue d'ensemble organisée de tout le contenu de votre cursus." },
        ],
      },
      {
        type: 'h2',
        text: 'Matières disponibles sur Udarsy',
      },
      {
        type: 'ul',
        items: [
          'Mathématiques — Analyse, Algèbre, Probabilités et Statistiques',
          'Physique-Chimie — Mécanique, Électricité, Thermodynamique, Chimie organique',
          'Sciences de la Vie et de la Terre (SVT) — Toutes les filières',
          'Langue Arabe et Éducation Islamique',
          'Langue Française — Littérature et Linguistique',
          'Histoire-Géographie — Programme national marocain',
          'Philosophie — Toutes les filières',
          'Sciences Économiques et Sociales (filière SES)',
        ],
      },
      {
        type: 'h2',
        text: 'Cours en PDF : clairs, imprimables, téléchargeables',
      },
      {
        type: 'p',
        parts: [
          { text: "Chaque chapitre est disponible en PDF téléchargeable, rédigé avec des définitions précises, des propriétés illustrées par des exemples résolus et des exercices d'application progressifs. Les PDFs sont optimisés à la fois pour la lecture sur écran mobile et pour l'impression en noir et blanc. Le plan gratuit inclut 10 téléchargements par mois — suffisant pour couvrir les matières essentielles. Pour télécharger plus de ressources, consultez le " },
          { text: "hub de téléchargements", href: '/download' },
          { text: " ou découvrez les " },
          { text: "plans Pro et Premium", href: '/pricing' },
          { text: " qui offrent jusqu'à 100 téléchargements par mois ou des téléchargements illimités." },
        ],
      },
      {
        type: 'h2',
        text: 'Vidéos explicatives : apprendre en regardant',
      },
      {
        type: 'p',
        text: "Des enseignants marocains expérimentés expliquent chaque notion en vidéo, en darija ou en français selon la matière et le niveau. Les vidéos sont volontairement courtes — entre 10 et 20 minutes — pour correspondre à la durée naturelle de concentration d'un élève. Elles sont structurées en trois temps : rappel des prérequis, explication du nouveau concept, application sur un exemple résolu. Vous pouvez mettre en pause, revenir en arrière et re-regarder autant de fois que nécessaire — un avantage impossible en classe.",
      },
      {
        type: 'h2',
        text: 'Exercices corrigés et examens nationaux',
      },
      {
        type: 'p',
        text: "Pour chaque leçon, des séries d'exercices avec corrections détaillées permettent de valider vos acquis à votre propre rythme. Les exercices sont classés par niveau : application directe du cours, exercices intermédiaires et problèmes de type BAC. Au niveau supérieur, les examens régionaux et nationaux des années précédentes — avec leurs corrections complètes — vous préparent au format officiel de l'épreuve. C'est la ressource la plus précieuse en période de révision intensive.",
      },
      {
        type: 'h2',
        text: 'Suivre sa progression matière par matière',
      },
      {
        type: 'p',
        parts: [
          { text: "Chaque leçon que vous consultez est automatiquement enregistrée dans votre tableau de bord personnel. Depuis " },
          { text: "votre profil", href: '/profile' },
          { text: ", vous voyez en un coup d'œil votre taux d'avancement par matière, le temps total passé à étudier et les leçons que vous avez marquées comme complétées. Vous pouvez aussi ajouter vos leçons et vidéos préférées à " },
          { text: "vos favoris", href: '/favorites/courses' },
          { text: " pour les retrouver rapidement sans avoir à naviguer dans le curriculum à chaque fois." },
        ],
      },
      {
        type: 'h2',
        text: 'Enrichir la bibliothèque commune',
      },
      {
        type: 'p',
        parts: [
          { text: "Si vous avez préparé une fiche de révision utile, rédigé un corrigé original ou trouvé une ressource de qualité, partagez-la avec la communauté via le " },
          { text: "hub de contributions", href: '/contributions' },
          { text: ". Chaque ressource approuvée est mise à la disposition de tous les élèves et vous rapporte des points dans le " },
          { text: "classement général des contributeurs", href: '/rankings' },
          { text: ". C'est le moyen le plus concret de rendre à la communauté ce qu'elle vous a donné." },
        ],
      },
      {
        type: 'cta',
        text: "Accédez gratuitement à des milliers de cours PDF, vidéos et exercices pour le lycée marocain.",
        href: '/explore',
        label: "Explorer les cours",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Premiers pas
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'premiers-pas-sur-udarsy',
    title: "Premiers pas sur Udarsy — Guide complet pour bien démarrer",
    description:
      "Comment créer votre compte, configurer votre profil, choisir vos matières et tirer le meilleur d'Udarsy dès votre première connexion.",
    excerpt:
      "Nouveau sur Udarsy ? Ce guide vous explique étape par étape comment configurer votre espace, accéder aux cours et suivre votre progression.",
    category: 'Guide',
    tags: ['guide débutant', 'démarrer udarsy', 'inscription', 'profil udarsy'],
    date: '2025-10-15',
    readTime: '8 min',
    coverImage:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'comment utiliser udarsy',
      'démarrer udarsy',
      'créer compte udarsy',
      'inscription plateforme maroc',
      'تسجيل في يودرسي',
    ],
    blocks: [
      {
        type: 'p',
        text: "Vous venez de découvrir Udarsy et vous ne savez pas par où commencer ? Ce guide vous accompagne pas à pas, de la création de votre compte jusqu'à votre première session de révision productive. Chaque étape est conçue pour que vous exploitiez rapidement l'ensemble des fonctionnalités de la plateforme.",
      },
      {
        type: 'h2',
        text: 'Étape 1 — Créer votre compte en 30 secondes',
      },
      {
        type: 'p',
        parts: [
          { text: "Rendez-vous sur la " },
          { text: "page d'inscription", href: '/signup' },
          { text: " et entrez votre adresse e-mail ainsi qu'un mot de passe sécurisé. Vous pouvez aussi vous connecter directement avec votre compte Google pour aller encore plus vite. Une fois l'e-mail de confirmation reçu, votre compte est activé et vous pouvez accéder à l'ensemble du contenu gratuit. Si vous avez déjà un compte, rendez-vous directement sur la " },
          { text: "page de connexion", href: '/login' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Étape 2 — Compléter votre profil',
      },
      {
        type: 'p',
        parts: [
          { text: "Un profil complet change radicalement votre expérience sur Udarsy. Depuis " },
          { text: "votre profil", href: '/profile' },
          { text: ", ajoutez une photo, renseignez votre niveau scolaire et choisissez votre filière. La plateforme adapte alors ses recommandations et vous affiche en priorité les ressources pertinentes pour votre cursus. Vous pouvez également configurer vos préférences de notifications et de thème d'affichage depuis " },
          { text: "vos paramètres", href: '/settings' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Étape 3 — Explorer les cours',
      },
      {
        type: 'p',
        parts: [
          { text: "Depuis le menu principal, cliquez sur « Explorer » pour naviguer dans le curriculum marocain. Sélectionnez votre niveau, votre filière, puis la matière souhaitée. Vous accédez aussitôt à la liste des leçons disponibles. La " },
          { text: "page Explorer", href: '/explore' },
          { text: " suit la hiérarchie officielle : École → Niveau → Filière → Matière → Leçon. Pour une vue différente, la " },
          { text: "page Cours", href: '/courses' },
          { text: " vous permet de naviguer directement par filière et d'accéder à des matières spécifiques en un ou deux clics." },
        ],
      },
      {
        type: 'h2',
        text: 'Étape 4 — Télécharger pour étudier hors ligne',
      },
      {
        type: 'p',
        parts: [
          { text: "Dès votre première connexion, profitez de vos 10 téléchargements mensuels gratuits pour sauvegarder les cours les plus importants sur votre appareil. Le " },
          { text: "hub de téléchargements", href: '/download' },
          { text: " centralise toutes les ressources disponibles en PDF et archive vos téléchargements passés. Si vous avez besoin de télécharger davantage, les plans " },
          { text: "Pro et Premium", href: '/pricing' },
          { text: " offrent jusqu'à 100 ou des téléchargements illimités chaque mois." },
        ],
      },
      {
        type: 'h2',
        text: 'Étape 5 — Rejoindre la communauté',
      },
      {
        type: 'p',
        parts: [
          { text: "Udarsy est avant tout une communauté d'élèves. Les " },
          { text: "salles de chat", href: '/profile/chat' },
          { text: " vous permettent d'échanger en temps réel avec des camarades du même niveau et de la même filière. Le " },
          { text: "hub de contributions", href: '/contributions' },
          { text: " vous invite à partager vos meilleures fiches de révision pour aider les autres. Plus vous contribuez, plus vous montez dans le " },
          { text: "classement général", href: '/rankings' },
          { text: " et débloquez des badges de reconnaissance." },
        ],
      },
      {
        type: 'h2',
        text: 'Étape 6 — Rester informé tout au long de l\'année',
      },
      {
        type: 'p',
        parts: [
          { text: "Ne ratez aucune information importante grâce à la section " },
          { text: "Actualités", href: '/news' },
          { text: " qui publie en temps réel les annonces du Ministère de l'Éducation : dates d'examen, résultats, concours et bourses. Le " },
          { text: "calendrier scolaire interactif", href: '/calendar' },
          { text: " affiche automatiquement les événements officiels et vous permet d'ajouter vos propres rappels personnels. Activez les notifications dans vos paramètres pour être alerté dès qu'une nouvelle information vous concerne." },
        ],
      },
      {
        type: 'cta',
        text: "Créez votre compte gratuit et commencez à apprendre dès maintenant.",
        href: '/signup',
        label: "Créer mon compte",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. Salles de chat
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'salles-chat-etude-udarsy',
    title: "Salles de chat d'étude — Révisez ensemble sur Udarsy",
    description:
      "Les salles de chat Udarsy permettent aux élèves marocains de collaborer, poser des questions et étudier en groupe par matière et par niveau en temps réel.",
    excerpt:
      "Rejoignez des milliers d'élèves marocains dans les salles de chat d'Udarsy pour poser vos questions et étudier en groupe en temps réel.",
    category: 'Fonctionnalités',
    tags: ['chat étude', 'collaboration', 'groupe étude', 'élèves maroc'],
    date: '2025-11-01',
    readTime: '7 min',
    coverImage:
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'chat étude maroc',
      'groupe révision maroc',
      'udarsy chat',
      'entraide scolaire maroc',
    ],
    blocks: [
      {
        type: 'p',
        text: "Étudier seul peut être décourageant, surtout pendant les longues semaines de révision avant le BAC ou le Brevet. La solitude érode la motivation et laisse les doutes sans réponse. C'est pour cela qu'Udarsy a intégré un système de salles de chat en temps réel : des espaces virtuels où des milliers d'élèves marocains se retrouvent chaque jour pour poser leurs questions, partager leurs méthodes et réviser ensemble.",
      },
      {
        type: 'h2',
        text: 'Comment fonctionnent les salles de chat ?',
      },
      {
        type: 'p',
        parts: [
          { text: "Chaque salle de chat est organisée par niveau scolaire et par filière. Il existe une salle pour les élèves de 2ème Bac Sciences Physiques, une autre pour les 1ère Bac Littéraires, une pour les collégiens en 3ème, etc. Dès que vous avez renseigné votre niveau dans " },
          { text: "votre profil", href: '/profile' },
          { text: ", Udarsy vous suggère automatiquement les salles les plus pertinentes pour vous. Accédez-y directement depuis la section " },
          { text: "Chat de votre profil", href: '/profile/chat' },
          { text: "." },
        ],
      },
      {
        type: 'ul',
        items: [
          "Messagerie instantanée avec d'autres élèves du même niveau et de la même filière",
          "Réactions emoji pour interagir rapidement sans interrompre le fil de conversation",
          "Réponses en thread pour garder les discussions organisées par sujet",
          "Signalement de messages inappropriés pour maintenir un environnement sain et respectueux",
          "Historique des messages conservé pour retrouver une réponse utile donnée plus tôt",
        ],
      },
      {
        type: 'h2',
        text: 'Les salles de classe des enseignants vérifiés',
      },
      {
        type: 'p',
        parts: [
          { text: "Les enseignants vérifiés sur Udarsy peuvent créer des salles de classe privées avec un code d'invitation unique. Un professeur partage ce code avec ses élèves, qui rejoignent la salle en le saisissant sur la " },
          { text: "page de rejoindre une salle", href: '/teacher/join' },
          { text: ". Ces espaces privés sont idéaux pour organiser des sessions de révision encadrées avant les examens, poser des questions à son professeur hors des heures de classe ou partager des ressources ciblées. Pour trouver un enseignant vérifié dans votre matière, consultez l'" },
          { text: "annuaire des enseignants", href: '/teacher' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Pourquoi étudier en groupe fonctionne',
      },
      {
        type: 'p',
        text: "La recherche en sciences cognitives est formelle : expliquer un concept à quelqu'un d'autre est l'une des façons les plus efficaces de le consolider dans sa propre mémoire. Quand vous formulez une explication, vous êtes obligé d'identifier et de combler vos propres lacunes. Les questions des autres élèves vous font aussi réviser des notions que vous pensiez maîtriser mais qui s'avèrent fragiles. De plus, la dynamique de groupe crée une émulation positive qui maintient la motivation sur la durée — un atout précieux lors des longues semaines de préparation.",
      },
      {
        type: 'h2',
        text: 'Contribuer à la communauté et grimper dans le classement',
      },
      {
        type: 'p',
        parts: [
          { text: "Au-delà du chat, vous pouvez renforcer votre contribution à la communauté en partageant vos meilleures ressources dans le " },
          { text: "hub de contributions", href: '/contributions' },
          { text: ". Chaque fiche de révision ou exercice approuvé vous rapporte des points dans le " },
          { text: "classement des contributeurs", href: '/rankings' },
          { text: ". Les élèves les plus actifs y reçoivent des badges et une reconnaissance publique sur la plateforme. C'est une façon de transformer votre travail personnel en aide collective — et d'enrichir votre propre CV de compétences." },
        ],
      },
      {
        type: 'cta',
        text: "Rejoignez votre salle d'étude et connectez-vous avec des milliers de camarades marocains.",
        href: '/profile/chat',
        label: "Accéder aux salles de chat",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. Abonnements
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'abonnements-udarsy-gratuit-pro-premium',
    title: 'Gratuit, Pro ou Premium — Quel abonnement Udarsy choisir en 2025 ?',
    description:
      "Comparatif détaillé des plans Udarsy : contenu inclus, téléchargements, prix et avantages de chaque offre pour les élèves marocains.",
    excerpt:
      "Comparatif complet des plans Udarsy — ce qui est inclus dans chaque offre, le rapport qualité-prix et comment choisir l'abonnement adapté.",
    category: 'Guide',
    tags: ['abonnement udarsy', 'prix udarsy', 'plan pro premium', 'tarif maroc'],
    date: '2025-11-15',
    readTime: '8 min',
    coverImage:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'abonnement udarsy prix',
      'udarsy pro premium',
      'tarif plateforme éducative maroc',
      'cours payants maroc',
    ],
    blocks: [
      {
        type: 'p',
        parts: [
          { text: "Udarsy propose trois niveaux d'accès adaptés à tous les profils et tous les budgets. La grande majorité du contenu est accessible gratuitement, mais les plans payants débloquent des avantages significatifs pour les élèves les plus exigeants. Avant de choisir, consultez la " },
          { text: "page Tarifs complète", href: '/pricing' },
          { text: " pour comparer les offres côte à côte." },
        ],
      },
      {
        type: 'h2',
        text: "Plan Gratuit — L'essentiel, sans débourser un centime",
      },
      {
        type: 'p',
        text: "Le plan gratuit d'Udarsy n'est pas une version bridée destinée à frustrer l'utilisateur — c'est une offre complète qui couvre la grande majorité des besoins quotidiens d'un élève marocain. Des milliers de cours, d'exercices et d'examens sont accessibles sans aucun paiement ni carte bancaire requise.",
      },
      {
        type: 'ul',
        items: [
          "Accès aux cours de base pour toutes les matières et tous les niveaux du programme officiel",
          "10 téléchargements de PDF par mois pour étudier hors ligne",
          "Participation aux salles de chat communautaires par niveau et filière",
          "Calendrier scolaire officiel et accès à toutes les actualités éducatives",
          "Suivi de progression de base — leçons vues, temps d'étude, favoris",
          "2 contributions par jour vers le hub de ressources communautaires",
        ],
      },
      {
        type: 'h2',
        text: 'Plan Pro — 199 MAD/mois ou 900 MAD/an',
      },
      {
        type: 'p',
        parts: [
          { text: "Le plan Pro est idéal pour les lycéens en préparation intensive du BAC ou pour ceux qui ont besoin d'étudier hors ligne fréquemment. Il débloque les cours premium, multiplie par dix le quota de téléchargements et supprime toutes les publicités. L'abonnement annuel à 900 MAD représente une économie de 25% par rapport au mensuel. Consultez le " },
          { text: "hub de téléchargements", href: '/download' },
          { text: " pour voir comment maximiser vos téléchargements mensuels." },
        ],
      },
      {
        type: 'ul',
        items: [
          "Accès à tous les cours premium et examens exclusifs",
          "100 téléchargements par mois — idéal pour une révision intensive du BAC",
          "Expérience sans publicités sur toute la plateforme",
          "Suivi de progression avancé avec statistiques détaillées par matière",
          "5 contributions par jour vers le hub de ressources",
          "Économie de 25% avec l'abonnement annuel (900 MAD au lieu de 2 388 MAD)",
        ],
      },
      {
        type: 'h2',
        text: 'Plan Premium — 299 MAD/mois ou 1 900 MAD/an',
      },
      {
        type: 'p',
        text: "Le plan Premium est conçu pour les élèves qui veulent le meilleur sans compromis. Téléchargements illimités, support prioritaire 24h/7j, accès aux cours exclusifs des instructeurs certifiés et un badge visible sur votre profil communautaire. L'économie sur l'abonnement annuel est particulièrement avantageuse : 1 900 MAD au lieu de 3 588 MAD en paiement mensuel, soit 47% d'économie.",
      },
      {
        type: 'ul',
        items: [
          "Accès illimité à l'intégralité du contenu, y compris les cours d'instructeurs certifiés",
          "Téléchargements illimités pour étudier hors ligne sans aucune restriction",
          "Support prioritaire avec temps de réponse garanti",
          "Badge Premium visible sur votre profil pour la communauté",
          "10 contributions par jour vers le hub de ressources",
        ],
      },
      {
        type: 'h2',
        text: 'Comment choisir et comment changer de plan ?',
      },
      {
        type: 'p',
        parts: [
          { text: "Si vous débutez sur Udarsy, commencez toujours par le plan gratuit. Il couvre largement les besoins de révision quotidienne. Si vous préparez le BAC intensivement, si vous n'avez pas toujours accès à internet ou si les publicités vous déconcentrent, le Pro est le meilleur rapport qualité-prix. Vous pouvez modifier votre abonnement à tout moment depuis " },
          { text: "vos paramètres de compte", href: '/settings' },
          { text: ". Le passage à un plan supérieur est immédiat. Pour tous les détails et pour souscrire, rendez-vous sur la " },
          { text: "page Tarifs", href: '/pricing' },
          { text: "." },
        ],
      },
      {
        type: 'cta',
        text: "Comparez tous les plans et choisissez celui qui correspond à vos besoins.",
        href: '/pricing',
        label: "Voir les tarifs complets",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. Enseignant / Instructeur
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'devenir-enseignant-instructeur-udarsy',
    title: "Devenir enseignant ou instructeur sur Udarsy — Guide complet",
    description:
      "Partagez votre savoir et touchez des milliers d'élèves marocains. Découvrez comment candidater comme enseignant ou instructeur sur Udarsy.",
    excerpt:
      "Professeurs et créateurs de contenu éducatif, rejoignez la communauté Udarsy et partagez votre expertise avec des milliers d'élèves marocains.",
    category: 'Enseignants',
    tags: ['enseignant udarsy', 'instructeur', 'créateur contenu', 'prof maroc'],
    date: '2025-12-01',
    readTime: '9 min',
    coverImage:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'devenir enseignant udarsy',
      'instructeur plateforme maroc',
      'partager cours maroc',
      'professeur en ligne maroc',
    ],
    blocks: [
      {
        type: 'p',
        text: "Udarsy ne serait rien sans ses enseignants et ses créateurs de contenu. La qualité de la plateforme repose sur la diversité et l'expertise de ceux qui partagent leur savoir. Si vous êtes professeur en activité, étudiant avancé ou expert dans une matière scolaire, vous pouvez rejoindre la communauté Udarsy et impacter la trajectoire de milliers d'élèves à travers le Maroc.",
      },
      {
        type: 'h2',
        text: "Enseignant ou Instructeur : quelle est la différence ?",
      },
      {
        type: 'h3',
        text: 'Le rôle Enseignant (Teacher)',
      },
      {
        type: 'p',
        parts: [
          { text: "Un enseignant sur Udarsy est un professeur vérifié qui peut créer des salles de classe privées avec des codes d'invitation, gérer ses élèves et organiser des sessions de révision en ligne. Son profil public est accessible à tous les élèves de la plateforme dans l'" },
          { text: "annuaire des enseignants", href: '/teacher' },
          { text: ". Les élèves peuvent le noter, laisser des avis et lui soumettre des demandes d'accès. Pour devenir enseignant, vous soumettez une candidature incluant une vidéo de démonstration de cinq minutes depuis la " },
          { text: "page de candidature enseignant", href: '/apply-teacher' },
          { text: "." },
        ],
      },
      {
        type: 'h3',
        text: 'Le rôle Instructeur',
      },
      {
        type: 'p',
        parts: [
          { text: "Un instructeur est un créateur de contenu qui publie ses propres cours vidéo et PDFs sur sa spécialité. Ces cours sont accessibles à tous les élèves de la plateforme depuis son profil public, visible dans l'" },
          { text: "annuaire des instructeurs", href: '/instructors' },
          { text: ". Il dispose d'un " },
          { text: "tableau de bord dédié", href: '/instructor-dashboard' },
          { text: " pour suivre ses statistiques (vues, téléchargements, notes reçues) et publier de nouveaux contenus. Pour devenir instructeur, soumettez votre candidature depuis la " },
          { text: "page de candidature instructeur", href: '/apply-instructor' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: "Processus de candidature enseignant, étape par étape",
      },
      {
        type: 'ul',
        items: [
          "Créez un compte Udarsy si ce n'est pas déjà fait",
          "Rendez-vous sur la page de candidature enseignant et remplissez votre profil (matière(s), niveau(x), années d'expérience)",
          "Enregistrez une courte vidéo de démonstration de cinq minutes montrant votre style pédagogique",
          "Soumettez vos documents de vérification (diplômes, attestations d'enseignement)",
          "L'équipe Udarsy examine votre candidature sous 48 heures ouvrées",
          "Une fois validé, vous accédez au tableau de bord enseignant pour gérer vos salles",
        ],
      },
      {
        type: 'h2',
        text: "Processus de candidature instructeur",
      },
      {
        type: 'ul',
        items: [
          "Accédez à la page de candidature instructeur depuis votre compte connecté",
          "Décrivez votre expertise, votre spécialité et le public cible de vos cours",
          "Téléchargez vos premiers cours (vidéo + PDF) pour que l'équipe puisse évaluer la qualité",
          "Après validation, votre profil instructeur devient public et vos cours sont accessibles à tous",
          "Gérez votre catalogue et suivez vos statistiques en temps réel depuis votre tableau de bord",
        ],
      },
      {
        type: 'h2',
        text: "Gérer votre activité après validation",
      },
      {
        type: 'p',
        parts: [
          { text: "Les enseignants accèdent à leur " },
          { text: "tableau de bord dédié", href: '/teacher/dashboard' },
          { text: " pour créer et gérer leurs salles de classe, inviter leurs élèves, organiser des sessions de révision et consulter les statistiques de leurs groupes. Les instructeurs disposent de leur propre " },
          { text: "espace de gestion des cours", href: '/instructor-dashboard' },
          { text: " pour publier de nouveaux contenus, suivre les vues et les téléchargements, et lire les retours de la communauté. Les deux profils sont publics et consultables par tous les élèves de la plateforme." },
        ],
      },
      {
        type: 'cta',
        text: "Rejoignez la communauté des enseignants et instructeurs Udarsy et impactez des milliers d'élèves.",
        href: '/apply-teacher',
        label: "Candidater comme enseignant",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. Étude hors ligne
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'cours-hors-ligne-telechargement',
    title: "Étudier sans connexion — Téléchargez vos cours sur Udarsy",
    description:
      "Comment télécharger vos cours en PDF sur Udarsy pour étudier hors ligne. Idéal pour les zones à faible connexion ou pour réviser en déplacement.",
    excerpt:
      "Plus besoin d'internet pour réviser ! Téléchargez vos cours en PDF et étudiez n'importe où, même sans connexion internet.",
    category: 'Fonctionnalités',
    tags: ['cours hors ligne', 'téléchargement PDF', 'étude offline', 'mobile'],
    date: '2025-12-15',
    readTime: '6 min',
    coverImage:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'cours hors ligne maroc',
      'télécharger cours PDF maroc',
      'udarsy offline',
      'étude sans internet maroc',
    ],
    blocks: [
      {
        type: 'p',
        text: "L'accès à internet n'est pas toujours garanti, surtout en zone rurale, dans les transports ou lors de coupures de réseau. Compter sur une connexion stable pour réviser la veille d'un examen est un risque que vous ne devriez pas prendre. C'est pourquoi Udarsy permet de télécharger tous ses cours en PDF pour les consulter hors ligne, à tout moment, depuis n'importe quel appareil.",
      },
      {
        type: 'h2',
        text: 'Le hub de téléchargements : tout au même endroit',
      },
      {
        type: 'p',
        parts: [
          { text: "Le " },
          { text: "hub de téléchargements", href: '/download' },
          { text: " centralise toutes les ressources disponibles en PDF sur Udarsy. Vous pouvez y naviguer par matière, filtrer par niveau et télécharger directement les fichiers qui vous intéressent sans avoir à ouvrir chaque leçon individuellement. Vos téléchargements passés y sont archivés pour un accès rapide — pratique pour retrouver un cours en quelques secondes sans le rechercher à nouveau." },
        ],
      },
      {
        type: 'h2',
        text: 'Quota de téléchargements selon votre plan',
      },
      {
        type: 'p',
        parts: [
          { text: "Le nombre de téléchargements mensuels dépend de votre abonnement. Le plan gratuit inclut 10 PDF par mois — suffisant pour couvrir les matières essentielles d'une semaine de révision. Le plan Pro monte à 100 téléchargements mensuels, idéal pour une préparation intensive au BAC. Le plan Premium offre des téléchargements illimités sans aucune restriction. Pour passer à un plan supérieur, consultez la " },
          { text: "page Tarifs", href: '/pricing' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Comment télécharger un cours, étape par étape',
      },
      {
        type: 'p',
        parts: [
          { text: "Naviguez vers la leçon qui vous intéresse depuis la " },
          { text: "page Explorer", href: '/explore' },
          { text: " ou depuis la " },
          { text: "page Cours", href: '/courses' },
          { text: ". Sur la page de la leçon, cliquez sur le bouton « Télécharger » à côté du PDF souhaité. Le fichier se sauvegarde immédiatement dans vos téléchargements de l'appareil. Sur mobile, retrouvez-le dans votre application Fichiers. Sur PC, il apparaît dans votre dossier Téléchargements. Vous pouvez ensuite l'ouvrir avec n'importe quel lecteur PDF." },
        ],
      },
      {
        type: 'h2',
        text: 'Organiser ses fichiers pour retrouver ses cours rapidement',
      },
      {
        type: 'p',
        text: "Créez des dossiers par matière sur votre téléphone ou ordinateur : un dossier « Maths BAC », un dossier « Physique », un dossier « SVT », etc. Nommez chaque fichier avec le numéro de chapitre pour le retrouver en quelques secondes le jour de la révision. Cette organisation simple vous fait gagner un temps précieux quand vous révisez sous pression.",
      },
      {
        type: 'h2',
        text: 'Gérer votre quota et vos favoris',
      },
      {
        type: 'p',
        parts: [
          { text: "Votre compteur de téléchargements se réinitialise le premier de chaque mois. Pour optimiser votre quota, téléchargez en priorité les chapitres à fort coefficient et les leçons sur lesquelles vous avez identifié des lacunes. Depuis " },
          { text: "votre profil", href: '/profile' },
          { text: ", vous pouvez suivre votre utilisation mensuelle et consulter les leçons que vous avez ajoutées à " },
          { text: "vos favoris", href: '/favorites/courses' },
          { text: " pour les télécharger directement." },
        ],
      },
      {
        type: 'cta',
        text: "Accédez au hub de téléchargements et préparez-vous à étudier n'importe où.",
        href: '/download',
        label: "Accéder aux téléchargements",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. Hub de contributions
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'hub-contributions-communaute',
    title: "Le Hub de contributions — Partagez vos ressources sur Udarsy",
    description:
      "Soumettez vos fiches de révision, exercices et cours sur Udarsy, grimpez dans le classement et aidez des milliers d'élèves marocains à réussir.",
    excerpt:
      "Rejoignez la communauté Udarsy en soumettant vos ressources de révision, montez dans le classement et faites une vraie différence pour vos camarades.",
    category: 'Communauté',
    tags: ['contributions', 'communauté', 'partage ressources', 'classement udarsy'],
    date: '2026-01-10',
    readTime: '7 min',
    coverImage:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'contributions udarsy',
      'partager fiches révision maroc',
      'classement élèves maroc',
      'communauté éducative maroc',
    ],
    blocks: [
      {
        type: 'p',
        text: "Udarsy n'est pas qu'une plateforme de consommation passive de cours — c'est une communauté vivante où les élèves s'entraident activement. Le Hub de contributions est l'espace où chaque membre peut partager ses ressources pédagogiques personnelles et enrichir la bibliothèque commune pour l'ensemble des élèves marocains. Plus vous contribuez, plus la plateforme devient utile pour tous.",
      },
      {
        type: 'h2',
        text: "Qu'est-ce qu'une contribution ?",
      },
      {
        type: 'p',
        text: "Une contribution est n'importe quelle ressource pédagogique que vous jugez utile pour vos camarades : une fiche de synthèse soigneusement rédigée, un exercice trouvé sur internet, un corrigé que vous avez développé vous-même, ou un lien vers une vidéo ou un site éducatif de qualité. La seule condition est que la ressource soit pertinente pour le programme officiel marocain et utile pour la matière et le niveau renseignés.",
      },
      {
        type: 'h2',
        text: 'Types de ressources acceptées',
      },
      {
        type: 'ul',
        items: [
          "Fiches de révision (PDF, Word, image numérisée propre)",
          "Exercices avec ou sans corrigés détaillés",
          "Résumés de chapitres clairs et bien structurés",
          "Liens vers des vidéos ou sites éducatifs fiables et pertinents",
          "Examens régionaux ou locaux non encore disponibles sur Udarsy",
          "Schémas, tableaux récapitulatifs, cartes mentales",
        ],
      },
      {
        type: 'h2',
        text: 'Comment soumettre votre première contribution',
      },
      {
        type: 'p',
        parts: [
          { text: "Connectez-vous à votre compte et rendez-vous sur le " },
          { text: "hub de contributions", href: '/contributions' },
          { text: ". Cliquez sur « Soumettre une ressource », sélectionnez la matière et le chapitre correspondant, puis téléchargez votre fichier ou collez le lien URL. L'équipe Udarsy examine chaque contribution sous 24 à 48 heures. Si votre ressource est approuvée, elle est publiée immédiatement et accessible à tous les élèves de la plateforme. Si elle est rejetée, vous recevez un motif pour améliorer votre prochaine soumission." },
        ],
      },
      {
        type: 'h2',
        text: 'Limites quotidiennes selon votre abonnement',
      },
      {
        type: 'p',
        parts: [
          { text: "Le plan gratuit permet 2 contributions par jour, le plan Pro 5 et le plan Premium 10. Ces limites existent pour garantir la qualité des ressources soumises et éviter le contenu de faible valeur. Pour contribuer davantage chaque jour, découvrez les " },
          { text: "plans Pro et Premium", href: '/pricing' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Le classement des contributeurs et les badges',
      },
      {
        type: 'p',
        parts: [
          { text: "Chaque contribution approuvée vous rapporte des points qui vous font monter dans le " },
          { text: "classement général des contributeurs", href: '/rankings' },
          { text: ". Les meilleurs contributeurs sont mis en avant sur la page Classement, reçoivent des badges de reconnaissance affichés sur leur profil et bénéficient d'une visibilité accrue dans la communauté. C'est une façon concrète et valorisante de transformer votre travail personnel en aide collective — et de vous distinguer auprès de la communauté éducative marocaine." },
        ],
      },
      {
        type: 'h2',
        text: 'Suivre vos contributions depuis votre profil',
      },
      {
        type: 'p',
        parts: [
          { text: "Depuis " },
          { text: "votre profil", href: '/profile' },
          { text: ", vous accédez à l'historique complet de toutes vos contributions : leur statut (en attente, approuvée, rejetée), le nombre de vues qu'elles ont générées et les retours de l'équipe. Cet historique vous permet de mesurer votre impact réel sur la communauté et d'améliorer progressivement la qualité de vos soumissions." },
        ],
      },
      {
        type: 'cta',
        text: "Partagez vos ressources et contribuez à la réussite de milliers d'élèves marocains.",
        href: '/contributions',
        label: "Accéder au hub de contributions",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. Calendrier scolaire
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'calendrier-scolaire-maroc-2025-2026',
    title: "Calendrier scolaire marocain 2025-2026 — Toutes les dates importantes",
    description:
      "Rentrée scolaire, vacances, examens du Brevet et du BAC au Maroc pour l'année 2025-2026. Consultez le calendrier officiel et synchronisez-le avec Udarsy.",
    excerpt:
      "Toutes les dates officielles du calendrier scolaire marocain 2025-2026 : vacances, examens, rentrée et événements clés — synchronisés sur Udarsy.",
    category: 'Calendrier',
    tags: ['calendrier scolaire', 'maroc 2025', 'vacances scolaires', 'dates bac brevet'],
    date: '2026-01-20',
    readTime: '7 min',
    coverImage:
      'https://images.unsplash.com/photo-1506784926709-22f1ec395907?w=1200&auto=format&fit=crop&q=80',
    keywords: [
      'calendrier scolaire maroc 2025-2026',
      'vacances scolaires maroc',
      'dates bac maroc 2026',
      'rentrée scolaire maroc',
      'الموسم الدراسي المغرب',
    ],
    blocks: [
      {
        type: 'p',
        parts: [
          { text: "Bien organiser son année scolaire commence par connaître toutes les dates importantes. Udarsy centralise le calendrier officiel du Ministère de l'Éducation Nationale marocain directement sur la " },
          { text: "page Calendrier", href: '/calendar' },
          { text: ", enrichi d'un espace personnel où vous ajoutez vos propres rappels, contrôles et todos. Voici un récapitulatif complet de l'année scolaire 2025-2026." },
        ],
      },
      {
        type: 'h2',
        text: "Structure de l'année scolaire 2025-2026",
      },
      {
        type: 'ul',
        items: [
          "Rentrée scolaire : début septembre 2025 pour tous les niveaux",
          "1er semestre : Septembre 2025 – Janvier 2026",
          "Conseils de classe du 1er semestre : Janvier 2026",
          "2ème semestre : Janvier 2026 – Juin 2026",
          "Examens de contrôle et de fin d'année : Mai – Juin 2026",
        ],
      },
      {
        type: 'h2',
        text: 'Vacances scolaires officielles',
      },
      {
        type: 'ul',
        items: [
          "Toussaint : fin octobre – début novembre 2025 (environ 1 semaine)",
          "Hiver : fin décembre 2025 – début janvier 2026 (environ 2 semaines)",
          "Mi-semestre : mi-février 2026 (environ 1 semaine)",
          "Printemps : fin mars – début avril 2026 (environ 2 semaines)",
          "Grandes vacances d'été : à partir de mi-juin 2026",
        ],
      },
      {
        type: 'h2',
        text: 'Examens du Brevet (BEPC) 2026',
      },
      {
        type: 'p',
        parts: [
          { text: "Les épreuves du Brevet se tiennent généralement fin juin. La proclamation des résultats intervient environ deux semaines après les dernières épreuves. Les candidats qui échouent à la session normale peuvent présenter la session de rattrapage en juillet. Suivez les annonces officielles en temps réel dans la section " },
          { text: "Actualités d'Udarsy", href: '/news' },
          { text: " et préparez-vous avec les " },
          { text: "examens passés disponibles sur la plateforme", href: '/explore' },
          { text: "." },
        ],
      },
      {
        type: 'h2',
        text: 'Examens du Baccalauréat 2026',
      },
      {
        type: 'p',
        text: "Le BAC marocain se déroule en deux sessions : la session normale en juin 2026 et la session de rattrapage en juillet 2026. Les résultats de la session normale sont publiés début juillet. Les épreuves de la session normale se tiennent généralement sur une semaine, réparties selon les filières. Notez toutes ces dates dans votre agenda dès maintenant — elles structurent tout votre planning de révision.",
      },
      {
        type: 'h2',
        text: 'Planifier ses révisions à partir du calendrier',
      },
      {
        type: 'p',
        parts: [
          { text: "Connaître les dates d'examen est inutile sans un plan de révision. Comptez à rebours depuis les épreuves et calculez combien de semaines il vous reste par matière. Utilisez le " },
          { text: "calculateur de notes", href: '/grades-calculator' },
          { text: " pour estimer la note à atteindre aux épreuves finales selon vos résultats de contrôle continu. Puis accédez aux " },
          { text: "cours et examens officiels sur Udarsy", href: '/explore' },
          { text: " pour structurer vos sessions de révision. Vous pouvez télécharger vos ressources à l'avance depuis le " },
          { text: "hub de téléchargements", href: '/download' },
          { text: " pour étudier même sans connexion pendant les périodes de révision intensive." },
        ],
      },
      {
        type: 'h2',
        text: 'Votre calendrier personnel sur Udarsy',
      },
      {
        type: 'p',
        parts: [
          { text: "Au-delà des événements officiels, le " },
          { text: "calendrier Udarsy", href: '/calendar' },
          { text: " vous permet d'ajouter vos propres contrôles, rendez-vous, sessions de révision et todos personnels. Tout votre agenda scolaire — événements nationaux et agenda personnel — est centralisé en un seul endroit, accessible depuis n'importe quel appareil. C'est votre outil de pilotage pour ne rater aucune échéance tout au long de l'année." },
        ],
      },
      {
        type: 'cta',
        text: "Consultez le calendrier scolaire interactif et ajoutez vos propres rappels sur Udarsy.",
        href: '/calendar',
        label: "Ouvrir le calendrier",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export const CATEGORY_COLORS: Record<string, string> = {
  Présentation: 'bg-green/10 text-green',
  Révisions: 'bg-amber-50 text-amber-600',
  Cours: 'bg-blue-50 text-blue-600',
  Fonctionnalités: 'bg-purple-50 text-purple-600',
  Guide: 'bg-rose-50 text-rose-600',
  Enseignants: 'bg-cyan-50 text-cyan-600',
  Communauté: 'bg-orange-50 text-orange-600',
  Calendrier: 'bg-teal-50 text-teal-600',
};
