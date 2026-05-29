import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ExternalLink, GraduationCap, Building2, Heart, Wrench, Compass, BookOpenCheck } from "lucide-react";
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
  readTime?: string;
  category?: string;
  language?: string;
  important_dates?: Array<{ label?: string; date?: string }>;
};

type NewsResponse = { news?: NewsItem[]; total?: number };

// --- Metadata ---------------------------------------------------------------
// FR is the primary acquisition locale for "concours bac maroc" queries.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    fr: "Concours après Bac Maroc 2026-2027 — Écoles, Dates, Inscriptions",
    ar: "مباريات ما بعد الباكالوريا بالمغرب 2026-2027 — المدارس والتواريخ والتسجيل",
    en: "Post-BAC Concours Morocco 2026-2027 — Schools, Dates, Applications",
  };
  const descriptions: Record<string, string> = {
    fr: "Le guide complet des concours après Bac au Maroc 2026-2027 : écoles d'ingénieurs, commerce, médecine, militaires. Dates, conditions et liens officiels d'inscription.",
    ar: "الدليل الكامل لمباريات ما بعد الباكالوريا بالمغرب 2026-2027: مدارس المهندسين، التجارة، الطب، العسكرية. التواريخ والشروط وروابط التسجيل الرسمية.",
    en: "Complete guide to post-BAC concours in Morocco 2026-2027: engineering, business, medical, and military schools. Dates, requirements, and official application links.",
  };

  const title = titles[locale] || titles.fr;
  const description = descriptions[locale] || descriptions.fr;
  const url = `${SITE_URL}/concours`;

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
      ? ["مباراة الباكالوريا", "مباريات ما بعد الباك", "مدارس المهندسين المغرب", "ENSAM", "ENSA", "EHTP", "ENCG"]
      : ["concours bac maroc", "concours apres bac", "ecole ingenieur maroc", "ENSAM", "ENSA", "EHTP", "ENCG"],
  };
}

// --- Category definitions (used by both UI and JSON-LD) ---------------------
type CategoryDef = {
  id: string;
  icon: React.ReactNode;
  fr: { title: string; desc: string; examples: string[] };
  ar: { title: string; desc: string; examples: string[] };
  en: { title: string; desc: string; examples: string[] };
};

const CATEGORIES: CategoryDef[] = [
  {
    id: "engineering",
    icon: <Wrench size={22} />,
    fr: {
      title: "Écoles d'ingénieurs",
      desc: "Concours nationaux et particuliers donnant accès aux écoles d'ingénieurs après Bac scientifique.",
      examples: ["CNC (ENSA, EHTP, ENSAM, INSEA…)", "EMI", "EHTP", "ENSAM", "ENSA Tanger / Marrakech / Tétouan", "INSEA"],
    },
    ar: {
      title: "مدارس المهندسين",
      desc: "المباريات الوطنية والخاصة للولوج إلى مدارس المهندسين بعد الباكالوريا العلمية.",
      examples: ["المباراة المشتركة الوطنية (ENSA، EHTP، ENSAM، INSEA…)", "EMI", "EHTP", "ENSAM", "ENSA", "INSEA"],
    },
    en: {
      title: "Engineering schools",
      desc: "National and private concours for engineering schools after a scientific BAC.",
      examples: ["CNC (ENSA, EHTP, ENSAM, INSEA…)", "EMI", "EHTP", "ENSAM", "ENSA Tangier / Marrakech / Tétouan", "INSEA"],
    },
  },
  {
    id: "business",
    icon: <Building2 size={22} />,
    fr: {
      title: "Écoles de commerce et gestion",
      desc: "Voies privilégiées pour les Bac sciences économiques, sciences mathématiques et BCG.",
      examples: ["ENCG (réseau national)", "ISCAE", "EGE Rabat", "TBS Casablanca"],
    },
    ar: {
      title: "مدارس التجارة والتدبير",
      desc: "المسارات المفضلة لشعب العلوم الاقتصادية والرياضية و BCG.",
      examples: ["ENCG (الشبكة الوطنية)", "ISCAE", "EGE الرباط", "TBS الدار البيضاء"],
    },
    en: {
      title: "Business and management schools",
      desc: "Top pathways for economic, mathematical, and BCG BAC streams.",
      examples: ["ENCG (national network)", "ISCAE", "EGE Rabat", "TBS Casablanca"],
    },
  },
  {
    id: "medical",
    icon: <Heart size={22} />,
    fr: {
      title: "Santé et paramédical",
      desc: "Concours d'accès aux facultés de médecine, pharmacie, dentaire et instituts paramédicaux.",
      examples: ["Médecine (FMP Rabat, Casa, Fès, Marrakech…)", "Pharmacie", "Médecine dentaire", "ISPITS"],
    },
    ar: {
      title: "الطب وشبه الطبي",
      desc: "مباريات الولوج إلى كليات الطب والصيدلة وطب الأسنان والمعاهد شبه الطبية.",
      examples: ["الطب (الرباط، البيضاء، فاس، مراكش…)", "الصيدلة", "طب الأسنان", "ISPITS"],
    },
    en: {
      title: "Medical and paramedical",
      desc: "Concours for medical, pharmacy, dental schools, and paramedical institutes.",
      examples: ["Medicine (FMP Rabat, Casa, Fès, Marrakech…)", "Pharmacy", "Dentistry", "ISPITS"],
    },
  },
  {
    id: "military",
    icon: <GraduationCap size={22} />,
    fr: {
      title: "Écoles militaires et institutions publiques",
      desc: "Concours pour les Forces Armées Royales, la Gendarmerie, les écoles royales et instituts publics.",
      examples: ["ERA (École Royale Air)", "ERN (Marine)", "Académie Royale Militaire de Meknès", "Gendarmerie Royale"],
    },
    ar: {
      title: "المدارس العسكرية والمؤسسات العمومية",
      desc: "مباريات القوات المسلحة الملكية، الدرك الملكي، المدارس الملكية والمعاهد العمومية.",
      examples: ["المدرسة الملكية الجوية", "المدرسة الملكية البحرية", "الأكاديمية الملكية العسكرية بمكناس", "الدرك الملكي"],
    },
    en: {
      title: "Military and public institutions",
      desc: "Concours for the Royal Armed Forces, Gendarmerie, royal academies, and public institutes.",
      examples: ["ERA (Royal Air School)", "ERN (Royal Navy)", "Royal Military Academy of Meknès", "Royal Gendarmerie"],
    },
  },
  {
    id: "vocational",
    icon: <BookOpenCheck size={22} />,
    fr: {
      title: "Instituts spécialisés et formation professionnelle",
      desc: "Instituts OFPPT, ISTA, et écoles spécialisées (architecture, audiovisuel, tourisme).",
      examples: ["OFPPT (ISTA / ITA)", "ENA Architecture", "ESAV Marrakech", "ISITT"],
    },
    ar: {
      title: "المعاهد المتخصصة والتكوين المهني",
      desc: "معاهد OFPPT، ISTA، والمدارس المتخصصة (هندسة معمارية، سمعي بصري، سياحة).",
      examples: ["OFPPT (ISTA / ITA)", "ENA الهندسة المعمارية", "ESAV مراكش", "ISITT"],
    },
    en: {
      title: "Specialized institutes and vocational training",
      desc: "OFPPT and ISTA institutes plus specialized schools (architecture, audiovisual, tourism).",
      examples: ["OFPPT (ISTA / ITA)", "ENA Architecture", "ESAV Marrakech", "ISITT"],
    },
  },
];

// --- Helpers ----------------------------------------------------------------
// Title-keyword filter: news articles that mention concours/orientation/écoles
// after BAC. The backend's categoryInference doesn't have a "concours" bucket
// (only Bac/Etudiant/College/General), so we filter client-side on text match.
const CONCOURS_KEYWORDS = [
  "concours", "concour", "مباراة", "مباريات",
  "post-bac", "après bac", "apres bac", "ما بعد الباك",
  "ensa ", "ensam", "encg", "ehtp", "emi ", "iscae", "ofppt", "ispits",
  "orientation", "توجيه",
  "inscription", "تسجيل",
  "ecole d'ingenieur", "ecole de commerce", "ecole militaire",
  "مدارس المهندسين", "مدارس التجارة", "كلية الطب",
];

function isConcoursArticle(article: NewsItem): boolean {
  const haystack = `${article.title || ""} ${article.description || ""} ${article.summary || ""} ${article.slug || ""}`.toLowerCase();
  return CONCOURS_KEYWORDS.some((kw) => haystack.includes(kw));
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

// --- FAQ (drives both visible UI and FAQPage schema) ------------------------
function getFaq(locale: string): { q: string; a: string }[] {
  if (locale === "ar") {
    return [
      { q: "متى تفتح تسجيلات مباريات ما بعد الباكالوريا 2026؟", a: "تختلف تواريخ التسجيل حسب كل مباراة. عموماً، تنطلق التسجيلات بين فبراير ويونيو 2026، وتُجرى الاختبارات في يونيو-يوليوز. تابع هذه الصفحة والإعلانات الرسمية لكل مدرسة." },
      { q: "ما هو CNC (المباراة المشتركة الوطنية)؟", a: "CNC هي المباراة المشتركة الوطنية للولوج إلى المدارس الوطنية للعلوم التطبيقية (ENSA)، EHTP، ENSAM، INSEA وغيرها. تجمع مباراة واحدة لعدة مدارس." },
      { q: "هل يمكنني تقديم ترشيحي لعدة مدارس؟", a: "نعم، أغلب التلاميذ يقدمون لعدة مباريات (هندسة، تجارة، طب، إلخ) لزيادة فرص القبول. كل مباراة تتطلب تسجيلاً منفصلاً." },
      { q: "ما هي الشروط العامة للمباراة؟", a: "تعتمد على المدرسة والشعبة. عموماً: شهادة الباكالوريا (بمعدل أدنى يختلف)، السن المحدد، الجنسية المغربية لبعض المباريات (العسكرية)، وأحياناً معايير صحية." },
      { q: "هل توفر يودرسي دروس تحضير للمباريات؟", a: "نعم، يودرسي توفر دروس وامتحانات نموذجية ومراجعات لمواد الباكالوريا التي تدخل في اختبارات المباريات (الرياضيات، الفيزياء، اللغات، إلخ)." },
    ];
  }
  if (locale === "en") {
    return [
      { q: "When do post-BAC concours registrations open in 2026?", a: "Registration dates vary by concours. Most open between February and June 2026, with exams held June–July. Check this page and each school's official announcement." },
      { q: "What is the CNC (Concours National Commun)?", a: "The CNC is the joint national concours for ENSA schools, EHTP, ENSAM, INSEA, and others. A single test gives access to multiple engineering schools." },
      { q: "Can I apply to multiple concours?", a: "Yes. Most students apply to several concours (engineering, business, medical, etc.) to maximize their chances. Each concours requires a separate registration." },
      { q: "What are the general requirements?", a: "These depend on the school and BAC stream. Usually: a BAC diploma (minimum average varies), an age limit, Moroccan nationality for some (military), and sometimes health criteria." },
      { q: "Does Udarsy offer prep content for concours?", a: "Yes. Udarsy provides BAC lessons, model exams, and revisions for the subjects tested in concours (math, physics, languages, etc.)." },
    ];
  }
  // French (default)
  return [
    { q: "Quand s'ouvrent les inscriptions aux concours après Bac 2026 ?", a: "Les dates varient selon chaque concours. La plupart ouvrent entre février et juin 2026, avec des épreuves en juin–juillet. Consultez cette page et l'annonce officielle de chaque école." },
    { q: "Qu'est-ce que le CNC (Concours National Commun) ?", a: "Le CNC est le concours national commun donnant accès aux écoles ENSA, EHTP, ENSAM, INSEA et d'autres. Un seul concours pour plusieurs écoles d'ingénieurs." },
    { q: "Puis-je candidater à plusieurs concours ?", a: "Oui. La plupart des étudiants candidatent à plusieurs concours (ingénieur, commerce, médecine, etc.) pour maximiser leurs chances. Chaque concours nécessite une inscription séparée." },
    { q: "Quelles sont les conditions générales d'admission ?", a: "Elles dépendent de l'école et de la filière du Bac. Généralement : diplôme du Bac (moyenne minimum variable), limite d'âge, nationalité marocaine pour certains (militaires), et parfois des critères médicaux." },
    { q: "Udarsy propose-t-elle des cours de préparation aux concours ?", a: "Oui. Udarsy propose des cours, examens nationaux et révisions pour les matières du Bac évaluées aux concours (maths, physique, langues, etc.)." },
  ];
}

// --- Page -------------------------------------------------------------------
export default async function ConcoursHubPage() {
  const locale = await getLocale();

  // Fetch news server-side and filter for concours-related articles.
  // limit=200 caps the payload while still covering ~6 months of fresh
  // concours coverage; revalidate=3600 keeps the page cached for 1h between
  // rebuilds so we don't hammer the backend on every hit.
  const newsResp = await serverFetch<NewsResponse>("/news?limit=200", { revalidate: 3600 });
  const allNews: NewsItem[] = Array.isArray(newsResp?.news) ? newsResp!.news! : [];
  const concoursNews = allNews.filter(isConcoursArticle).slice(0, 12);

  const faq = getFaq(locale);

  // --- Localized copy -------------------------------------------------------
  const copy = {
    fr: {
      kicker: "Concours 2026-2027",
      h1: "Concours après Bac au Maroc 2026-2027",
      lead: "Le guide complet des concours d'accès aux écoles supérieures marocaines après le Baccalauréat. Écoles d'ingénieurs, commerce, médecine, militaires et instituts spécialisés — toutes les dates, conditions et liens officiels.",
      stats_schools: `${CATEGORIES.length} catégories`,
      stats_freshness: "Mis à jour régulièrement",
      stats_lang: "FR · AR",
      categories_h2: "Catégories de concours",
      news_h2: "Actualités des concours",
      news_empty: "Pas encore d'actualités. Revenez plus tard.",
      faq_h2: "Questions fréquentes",
      cta_h2: "Préparez vos concours avec Udarsy",
      cta_desc: "Cours, examens corrigés et exercices alignés au programme marocain.",
      cta_btn: "Voir les cours du Bac",
      cta_link: "/courses",
      includes: "Inclut",
      read_more: "Lire l'article",
    },
    ar: {
      kicker: "مباريات 2026-2027",
      h1: "مباريات ما بعد الباكالوريا بالمغرب 2026-2027",
      lead: "الدليل الكامل لمباريات الولوج إلى المدارس العليا المغربية بعد الباكالوريا. مدارس المهندسين، التجارة، الطب، العسكرية والمعاهد المتخصصة — جميع التواريخ والشروط والروابط الرسمية.",
      stats_schools: `${CATEGORIES.length} فئات`,
      stats_freshness: "تحديث مستمر",
      stats_lang: "AR · FR",
      categories_h2: "فئات المباريات",
      news_h2: "أخبار المباريات",
      news_empty: "لا توجد أخبار حالياً. عد لاحقاً.",
      faq_h2: "أسئلة شائعة",
      cta_h2: "حضّر مبارياتك مع يودرسي",
      cta_desc: "دروس وامتحانات نموذجية وتمارين وفق المنهج المغربي.",
      cta_btn: "دروس الباكالوريا",
      cta_link: "/courses",
      includes: "تشمل",
      read_more: "اقرأ المقال",
    },
    en: {
      kicker: "Concours 2026-2027",
      h1: "Post-BAC Concours in Morocco 2026-2027",
      lead: "The complete guide to admission concours for Moroccan higher education after BAC. Engineering, business, medical, military schools, and specialized institutes — all dates, requirements, and official links.",
      stats_schools: `${CATEGORIES.length} categories`,
      stats_freshness: "Updated regularly",
      stats_lang: "FR · AR",
      categories_h2: "Concours categories",
      news_h2: "Latest concours news",
      news_empty: "No news yet. Check back later.",
      faq_h2: "Frequently asked questions",
      cta_h2: "Prepare for your concours with Udarsy",
      cta_desc: "Lessons, graded exams, and exercises aligned with the Moroccan curriculum.",
      cta_btn: "Browse BAC courses",
      cta_link: "/courses",
      includes: "Includes",
      read_more: "Read article",
    },
  };
  const c = copy[locale as keyof typeof copy] || copy.fr;
  const cat = (def: CategoryDef) => def[locale as "fr" | "ar" | "en"] || def.fr;

  // --- JSON-LD --------------------------------------------------------------
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: c.h1, item: `${SITE_URL}/concours` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/concours#webpage`,
    url: `${SITE_URL}/concours`,
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
    "@id": `${SITE_URL}/concours#categories`,
    name: c.categories_h2,
    numberOfItems: CATEGORIES.length,
    itemListElement: CATEGORIES.map((def, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cat(def).title,
      description: cat(def).desc,
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

      {/* ─── HERO ─── */}
      <section className="px-[clamp(20px,6vw,80px)] pt-24 md:pt-32 pb-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold mb-4" dir="auto">
          <Compass size={14} />
          {c.kicker}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-dark leading-tight" dir="auto">
          {c.h1}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed" dir="auto">
          {c.lead}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_schools}</span>
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_freshness}</span>
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_lang}</span>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="px-[clamp(20px,6vw,80px)] py-8 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6" dir="auto">{c.categories_h2}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATEGORIES.map((def) => {
            const t = cat(def);
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

      {/* ─── NEWS GRID ─── */}
      <section className="px-[clamp(20px,6vw,80px)] py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6" dir="auto">{c.news_h2}</h2>
        {concoursNews.length === 0 ? (
          <div className="py-12 text-center rounded-[10px] border border-dashed border-green/20 bg-green/[0.02]">
            <p className="text-muted-foreground" dir="auto">{c.news_empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {concoursNews.map((article) => {
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
                        alt={article.image_alt || article.title || "Concours"}
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

      {/* ─── FAQ ─── */}
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

      {/* ─── CTA ─── */}
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
