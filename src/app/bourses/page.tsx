import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ExternalLink, GraduationCap, Globe2, Award, BookOpenCheck, Sparkles } from "lucide-react";
import { getLocale } from "next-intl/server";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// --- Types ------------------------------------------------------------------
type NewsItem = {
  _id?: string;
  slug?: string;
  title?: string;
  description?: string;
  summary?: string;
  imageUrl?: string;
  image_alt?: string;
  date?: string;
  card_date?: string;
  category?: string;
  language?: string;
};

type NewsResponse = { news?: NewsItem[]; total?: number };

// --- Metadata ---------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    fr: "Bourses d'études au Maroc 2026 — Bourses nationales et internationales",
    ar: "منح دراسية بالمغرب 2026 — منح وطنية ودولية للطلبة المغاربة",
    en: "Scholarships in Morocco 2026 — National and International Bursaries",
  };
  const descriptions: Record<string, string> = {
    fr: "Toutes les bourses d'études pour étudiants marocains : bourse Jadara, ENSSUP, AMCI, bourses d'excellence et opportunités internationales. Conditions, dates et inscriptions.",
    ar: "جميع المنح الدراسية للطلبة المغاربة: منحة جدارة، ENSSUP، AMCI، منح التفوق وفرص دراسية بالخارج. الشروط والتواريخ والتسجيل.",
    en: "All scholarships for Moroccan students: Jadara bursary, ENSSUP, AMCI, merit-based grants, and international opportunities. Requirements, dates, and applications.",
  };

  const title = titles[locale] || titles.fr;
  const description = descriptions[locale] || descriptions.fr;
  const url = `${SITE_URL}/bourses`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: url, ar: url, en: url, "x-default": url },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Udarsy",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
      creator: "@UdarsyMa",
    },
    keywords: locale === "ar"
      ? ["منحة جدارة", "منح دراسية المغرب", "ENSSUP", "AMCI", "منح خارجية", "بورصة الطلبة"]
      : ["bourse jadara", "bourse maroc 2026", "ENSSUP", "AMCI", "bourse etudiant maroc", "bourse internationale"],
  };
}

// --- Bourse types (drive UI + JSON-LD) --------------------------------------
type BourseDef = {
  id: string;
  icon: React.ReactNode;
  fr: { title: string; desc: string; examples: string[] };
  ar: { title: string; desc: string; examples: string[] };
  en: { title: string; desc: string; examples: string[] };
};

const BOURSES: BourseDef[] = [
  {
    id: "social",
    icon: <Award size={22} />,
    fr: {
      title: "Bourses sociales (ENSSUP)",
      desc: "Bourses du Ministère de l'Enseignement Supérieur pour étudiants en formation initiale au Maroc, attribuées selon des critères sociaux.",
      examples: ["Bourse mensuelle ENSSUP", "Inscription via le portail minhaty.ma", "Étudiants des universités publiques", "Renouvellement annuel"],
    },
    ar: {
      title: "المنح الاجتماعية (ENSSUP)",
      desc: "منح وزارة التعليم العالي للطلبة في التكوين الأساسي بالمغرب، تُمنح وفق معايير اجتماعية.",
      examples: ["المنحة الشهرية ENSSUP", "التسجيل عبر بوابة minhaty.ma", "طلبة الجامعات العمومية", "تجديد سنوي"],
    },
    en: {
      title: "Social bursaries (ENSSUP)",
      desc: "Ministry of Higher Education bursaries for initial-formation students in Morocco, awarded on social criteria.",
      examples: ["Monthly ENSSUP grant", "Apply via minhaty.ma portal", "Public university students", "Annual renewal"],
    },
  },
  {
    id: "jadara",
    icon: <Sparkles size={22} />,
    fr: {
      title: "Bourse Jadara (excellence)",
      desc: "Bourse d'excellence destinée aux meilleurs bacheliers marocains poursuivant leurs études dans des écoles privées de prestige au Maroc.",
      examples: ["Bourse jusqu'à 35 000 MAD/an", "Mention Très Bien au Bac", "Universités/écoles privées partenaires", "Inscription via jadara.ma"],
    },
    ar: {
      title: "منحة جدارة (التفوق)",
      desc: "منحة التفوق للحاصلين على معدلات عالية في الباكالوريا الذين يتابعون دراستهم في مدارس خاصة مرموقة بالمغرب.",
      examples: ["منحة تصل إلى 35,000 درهم سنوياً", "ميزة حسن جداً في الباكالوريا", "جامعات ومدارس خاصة شريكة", "التسجيل عبر jadara.ma"],
    },
    en: {
      title: "Jadara bursary (excellence)",
      desc: "Merit bursary for top Moroccan BAC graduates studying at partnered prestigious private schools in Morocco.",
      examples: ["Up to 35,000 MAD per year", "BAC honors (Très Bien) required", "Partnered private universities", "Apply via jadara.ma"],
    },
  },
  {
    id: "amci",
    icon: <Globe2 size={22} />,
    fr: {
      title: "AMCI — bourses pour étudiants étrangers",
      desc: "Agence Marocaine de Coopération Internationale : bourses pour étudiants africains et étrangers souhaitant étudier au Maroc.",
      examples: ["Bourse mensuelle + frais d'inscription", "Étudiants des pays partenaires (Afrique surtout)", "Universités publiques marocaines", "Inscription via amci.ma"],
    },
    ar: {
      title: "AMCI — منح للطلبة الأجانب",
      desc: "الوكالة المغربية للتعاون الدولي: منح للطلبة الأفارقة والأجانب الراغبين في الدراسة بالمغرب.",
      examples: ["منحة شهرية + رسوم التسجيل", "طلبة من البلدان الشريكة (إفريقيا أساساً)", "الجامعات العمومية المغربية", "التسجيل عبر amci.ma"],
    },
    en: {
      title: "AMCI — bursaries for foreign students",
      desc: "Moroccan Agency for International Cooperation: bursaries for African and foreign students wishing to study in Morocco.",
      examples: ["Monthly stipend + tuition", "Students from partner countries (mainly Africa)", "Moroccan public universities", "Apply via amci.ma"],
    },
  },
  {
    id: "international",
    icon: <GraduationCap size={22} />,
    fr: {
      title: "Bourses internationales (à l'étranger)",
      desc: "Bourses d'études à l'étranger pour étudiants marocains : France (Eiffel, Campus France), Allemagne (DAAD), Canada, Turquie, etc.",
      examples: ["Bourse Eiffel (France)", "DAAD (Allemagne)", "Campus France", "Türkiye Burslari", "Bourses Erasmus+"],
    },
    ar: {
      title: "منح دولية (الدراسة بالخارج)",
      desc: "منح دراسية بالخارج للطلبة المغاربة: فرنسا (Eiffel، Campus France)، ألمانيا (DAAD)، كندا، تركيا، إلخ.",
      examples: ["منحة Eiffel (فرنسا)", "DAAD (ألمانيا)", "Campus France", "Türkiye Burslari", "منح Erasmus+"],
    },
    en: {
      title: "International scholarships (study abroad)",
      desc: "Study-abroad scholarships for Moroccan students: France (Eiffel, Campus France), Germany (DAAD), Canada, Turkey, etc.",
      examples: ["Eiffel scholarship (France)", "DAAD (Germany)", "Campus France", "Türkiye Burslari", "Erasmus+ grants"],
    },
  },
  {
    id: "specialized",
    icon: <BookOpenCheck size={22} />,
    fr: {
      title: "Bourses sectorielles et de fondations",
      desc: "Bourses de fondations (OCP, BMCE, Akhawayn Endowment) et bourses sectorielles pour filières spécifiques (médecine, ingénierie, doctorat).",
      examples: ["Fondation OCP", "Fondation BMCE Bank", "Akhawayn Endowment Fund", "Bourses CNRST (doctorat)"],
    },
    ar: {
      title: "منح قطاعية ومن المؤسسات",
      desc: "منح المؤسسات (OCP، BMCE، Akhawayn) ومنح قطاعية لشعب محددة (الطب، الهندسة، الدكتوراه).",
      examples: ["مؤسسة OCP", "مؤسسة بنك BMCE", "صندوق الأخوين", "منح CNRST (الدكتوراه)"],
    },
    en: {
      title: "Sectoral and foundation scholarships",
      desc: "Foundation bursaries (OCP, BMCE, Akhawayn Endowment) and sector-specific scholarships (medicine, engineering, doctorate).",
      examples: ["OCP Foundation", "BMCE Bank Foundation", "Akhawayn Endowment Fund", "CNRST grants (doctorate)"],
    },
  },
];

// --- Helpers ----------------------------------------------------------------
const BOURSE_KEYWORDS = [
  "bourse", "bourses", "منحة", "منح",
  "jadara", "جدارة",
  "enssup", "minhaty",
  "amci",
  "scholarship", "bursary",
  "eiffel", "daad", "erasmus", "campus france",
  "tuition", "stipend",
  "ocp", "bmce", "fondation",
];

function isBourseArticle(article: NewsItem): boolean {
  const haystack = `${article.title || ""} ${article.description || ""} ${article.summary || ""} ${article.slug || ""}`.toLowerCase();
  return BOURSE_KEYWORDS.some((kw) => haystack.includes(kw));
}

function fmtDate(d: string | undefined, locale: string): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(
      locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-MA",
      { day: "numeric", month: "long", year: "numeric" },
    );
  } catch {
    return d;
  }
}

function getFaq(locale: string): { q: string; a: string }[] {
  if (locale === "ar") {
    return [
      { q: "كيف أتقدم لمنحة دراسية بالمغرب؟", a: "أغلب المنح الوطنية يتم التقديم لها عبر بوابات رسمية: minhaty.ma لمنحة ENSSUP، jadara.ma لمنحة جدارة، amci.ma لمنح الأجانب. تحقق دائماً من الموقع الرسمي للجهة المانحة." },
      { q: "ما هو معدل الباكالوريا المطلوب للحصول على منحة؟", a: "يختلف من منحة لأخرى. منحة جدارة تتطلب ميزة 'حسن جداً' (16/20 أو أكثر). منح ENSSUP تعتمد على الوضع الاجتماعي أكثر من الدرجات. المنح الدولية تشترط عادة معدلات ممتازة." },
      { q: "متى تفتح التقديمات للمنح 2026؟", a: "ENSSUP: مع بداية السنة الجامعية (سبتمبر-أكتوبر). جدارة: غالباً بعد إعلان نتائج الباكالوريا (يوليوز). المنح الدولية: تختلف حسب البلد، عموماً بين أكتوبر ومارس للسنة المقبلة." },
      { q: "هل يمكن الجمع بين عدة منح؟", a: "في حالات نادرة، نعم. لكن أغلب المنح تشترط عدم الجمع مع منحة أخرى من نفس النوع. اقرأ شروط كل منحة بعناية." },
      { q: "هل توفر يودرسي دعم في طلب المنح؟", a: "يودرسي تشارك أخبار وتنبيهات المنح المتاحة، وتوفر دروس لتحضير الباكالوريا التي تحدد بدورها فرصك في الحصول على منحة." },
    ];
  }
  if (locale === "en") {
    return [
      { q: "How do I apply for a scholarship in Morocco?", a: "Most national scholarships apply through official portals: minhaty.ma for ENSSUP, jadara.ma for Jadara, amci.ma for foreign students. Always verify on the issuing institution's official site." },
      { q: "What BAC average do I need for a scholarship?", a: "It varies. Jadara requires 'Très Bien' honors (16/20 or higher). ENSSUP grants depend more on social criteria than grades. International scholarships usually require excellent averages." },
      { q: "When do 2026 scholarship applications open?", a: "ENSSUP: at the start of the academic year (September–October). Jadara: usually after BAC results (July). International scholarships vary by country, generally October–March for the following year." },
      { q: "Can I combine multiple scholarships?", a: "Rarely. Most scholarships require that you not also hold another grant of the same type. Read each scholarship's terms carefully." },
      { q: "Does Udarsy help with scholarship applications?", a: "Udarsy publishes scholarship news and alerts, and provides BAC prep lessons that strengthen your scholarship-eligible grades." },
    ];
  }
  return [
    { q: "Comment postuler à une bourse au Maroc ?", a: "La plupart des bourses nationales se demandent via des portails officiels : minhaty.ma pour ENSSUP, jadara.ma pour Jadara, amci.ma pour étudiants étrangers. Vérifiez toujours sur le site officiel de l'institution." },
    { q: "Quelle moyenne au Bac faut-il pour une bourse ?", a: "Cela varie. Jadara exige la mention 'Très Bien' (16/20 ou plus). Les bourses ENSSUP dépendent surtout des critères sociaux. Les bourses internationales demandent généralement d'excellentes moyennes." },
    { q: "Quand s'ouvrent les inscriptions aux bourses 2026 ?", a: "ENSSUP : à la rentrée universitaire (septembre–octobre). Jadara : généralement après les résultats du Bac (juillet). Bourses internationales : selon le pays, généralement entre octobre et mars pour l'année suivante." },
    { q: "Peut-on cumuler plusieurs bourses ?", a: "Rarement. La plupart des bourses interdisent le cumul avec une autre bourse du même type. Lisez attentivement les conditions de chaque bourse." },
    { q: "Udarsy aide-t-elle aux candidatures aux bourses ?", a: "Udarsy publie les actualités et alertes sur les bourses disponibles, et propose des cours de préparation du Bac qui déterminent vos chances d'obtenir une bourse." },
  ];
}

// --- Page -------------------------------------------------------------------
export default async function BoursesHubPage() {
  const locale = await getLocale();

  const newsResp = await serverFetch<NewsResponse>("/news?limit=200", { revalidate: 3600 });
  const allNews: NewsItem[] = Array.isArray(newsResp?.news) ? newsResp!.news! : [];
  const bourseNews = allNews.filter(isBourseArticle).slice(0, 12);

  const faq = getFaq(locale);

  const copy = {
    fr: {
      kicker: "Bourses 2026",
      h1: "Bourses d'études au Maroc 2026",
      lead: "Le guide complet des bourses pour étudiants marocains : bourses ENSSUP, Jadara, AMCI, bourses sectorielles et opportunités à l'étranger. Toutes les conditions et liens officiels.",
      stats_categories: `${BOURSES.length} catégories`,
      stats_freshness: "Mis à jour régulièrement",
      stats_lang: "FR · AR",
      categories_h2: "Types de bourses",
      news_h2: "Actualités des bourses",
      news_empty: "Pas encore d'actualités. Revenez plus tard.",
      faq_h2: "Questions fréquentes",
      cta_h2: "Préparez votre dossier avec Udarsy",
      cta_desc: "Cours, examens et exercices pour maximiser votre moyenne au Bac.",
      cta_btn: "Voir les cours du Bac",
      cta_link: "/courses",
      includes: "Inclut",
      read_more: "Lire l'article",
    },
    ar: {
      kicker: "منح 2026",
      h1: "منح دراسية بالمغرب 2026",
      lead: "الدليل الكامل للمنح الدراسية للطلبة المغاربة: منح ENSSUP، جدارة، AMCI، منح قطاعية وفرص دراسية بالخارج. جميع الشروط والروابط الرسمية.",
      stats_categories: `${BOURSES.length} فئات`,
      stats_freshness: "تحديث مستمر",
      stats_lang: "AR · FR",
      categories_h2: "أنواع المنح",
      news_h2: "أخبار المنح",
      news_empty: "لا توجد أخبار حالياً. عد لاحقاً.",
      faq_h2: "أسئلة شائعة",
      cta_h2: "حضّر ملفك مع يودرسي",
      cta_desc: "دروس وامتحانات وتمارين لرفع معدلك في الباكالوريا.",
      cta_btn: "دروس الباكالوريا",
      cta_link: "/courses",
      includes: "تشمل",
      read_more: "اقرأ المقال",
    },
    en: {
      kicker: "Scholarships 2026",
      h1: "Scholarships in Morocco 2026",
      lead: "The complete guide to scholarships for Moroccan students: ENSSUP bursaries, Jadara, AMCI, sector-specific grants, and study-abroad opportunities. All requirements and official links.",
      stats_categories: `${BOURSES.length} categories`,
      stats_freshness: "Updated regularly",
      stats_lang: "FR · AR",
      categories_h2: "Scholarship types",
      news_h2: "Scholarship news",
      news_empty: "No news yet. Check back later.",
      faq_h2: "Frequently asked questions",
      cta_h2: "Prepare your application with Udarsy",
      cta_desc: "Lessons, exams and exercises to maximize your BAC average.",
      cta_btn: "Browse BAC courses",
      cta_link: "/courses",
      includes: "Includes",
      read_more: "Read article",
    },
  };
  const c = copy[locale as keyof typeof copy] || copy.fr;
  const lp = (def: BourseDef) => def[locale as "fr" | "ar" | "en"] || def.fr;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: c.h1, item: `${SITE_URL}/bourses` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/bourses#webpage`,
    url: `${SITE_URL}/bourses`,
    name: c.h1,
    description: c.lead,
    inLanguage: ["fr", "ar"],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      geographicArea: { "@type": "Country", name: "Morocco" },
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/bourses#categories`,
    name: c.categories_h2,
    numberOfItems: BOURSES.length,
    itemListElement: BOURSES.map((def, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: lp(def).title,
      description: lp(def).desc,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="px-[clamp(20px,6vw,80px)] pt-24 md:pt-32 pb-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold mb-4" dir="auto">
          <Sparkles size={14} />
          {c.kicker}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-dark leading-tight" dir="auto">
          {c.h1}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed" dir="auto">
          {c.lead}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_categories}</span>
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_freshness}</span>
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_lang}</span>
        </div>
      </section>

      <section className="px-[clamp(20px,6vw,80px)] py-8 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6" dir="auto">{c.categories_h2}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BOURSES.map((def) => {
            const t = lp(def);
            return (
              <div
                key={def.id}
                className="rounded-[10px] border border-green/10 bg-white p-6 hover:shadow-md hover:shadow-green/5 transition-shadow"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-[10px] bg-green/10 text-green flex items-center justify-center shrink-0">
                    {def.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-dark leading-tight" dir="auto">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed" dir="auto">{t.desc}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2" dir="auto">
                    {c.includes}
                  </p>
                  <ul className="space-y-1 text-sm">
                    {t.examples.map((ex, i) => (
                      <li key={i} className="text-dark/70" dir="auto">• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-[clamp(20px,6vw,80px)] py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6" dir="auto">{c.news_h2}</h2>
        {bourseNews.length === 0 ? (
          <div className="py-12 text-center rounded-[10px] border border-dashed border-green/20 bg-green/[0.02]">
            <p className="text-muted-foreground" dir="auto">{c.news_empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bourseNews.map((article) => {
              const href = `/news/${article.slug || article._id}`;
              const dateStr = fmtDate(article.date || article.card_date, locale);
              const img = typeof article.imageUrl === "string" && article.imageUrl.startsWith("http")
                ? article.imageUrl
                : null;
              return (
                <Link
                  key={article._id}
                  href={href}
                  className="group rounded-[10px] border border-green/10 bg-white overflow-hidden hover:shadow-md hover:shadow-green/5 transition-shadow"
                >
                  {img && (
                    <div className="relative w-full aspect-[4/3] bg-green/5 overflow-hidden">
                      <Image
                        src={img}
                        alt={article.image_alt || article.title || "Bourse"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {dateStr && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2" dir="auto">
                        <Calendar size={12} />
                        <span>{dateStr}</span>
                      </div>
                    )}
                    <h3 className="font-bold text-dark text-sm leading-snug group-hover:text-green transition-colors line-clamp-2" dir="auto">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2" dir="auto">
                        {article.description}
                      </p>
                    )}
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-green" dir="auto">
                      <span>{c.read_more}</span>
                      <ExternalLink size={11} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="px-[clamp(20px,6vw,80px)] py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 text-center" dir="auto">{c.faq_h2}</h2>
        <div className="space-y-3">
          {faq.map((f, i) => (
            <details key={i} className="group rounded-[10px] border border-green/10 bg-white p-4 open:bg-green/[0.02]">
              <summary className="cursor-pointer font-bold text-dark text-sm list-none flex justify-between items-center gap-3" dir="auto">
                <span className="flex-1">{f.q}</span>
                <span className="text-green text-xl group-open:rotate-45 transition-transform shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed" dir="auto">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-[clamp(20px,6vw,80px)] py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3" dir="auto">{c.cta_h2}</h2>
        <p className="text-muted-foreground mb-6" dir="auto">{c.cta_desc}</p>
        <Link
          href={c.cta_link}
          className="inline-block px-7 py-3 bg-green text-white font-bold rounded-2xl hover:scale-[1.03] transition-all"
        >
          {c.cta_btn}
        </Link>
      </section>
    </>
  );
}
