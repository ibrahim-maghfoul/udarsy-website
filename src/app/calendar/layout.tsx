import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./calendar.css";
import "../../styles/pickers.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// --- 2026-2027 academic year dates ------------------------------------------
// Cross-checked against public Moroccan education portals (wizaide.com,
// orientation-chabab.com). Dates remain "sous reserve de l'arrete officiel"
// — the Ministry typically publishes the final decree in late August.
// Refresh annually when MEN releases the new bulletin.
const SCHOOL_YEAR = {
  label: "2026-2027",
  start: "2026-09-07",
  teacherStart: "2026-09-01",
  end: "2027-06-30",
  bacExamStart: "2027-06-14",
  bacExamEnd: "2027-06-19",
  brevetStart: "2027-06-07",
  brevetEnd: "2027-06-09",
  regionalBacStart: "2027-05-31",
  regionalBacEnd: "2027-06-04",
};

// Morocco operates on a 5-vacation schedule (not 4 like the French system).
const HOLIDAYS = [
  { id: "mid-semester-1", start: "2026-11-08", end: "2026-11-15", fr: "Vacances de mi-semestre 1", ar: "عطلة منتصف الأسدس الأول", en: "Mid-semester 1 break" },
  { id: "end-semester-1", start: "2026-12-19", end: "2027-01-04", fr: "Vacances de fin de semestre 1", ar: "عطلة نهاية الأسدس الأول", en: "End of semester 1 break" },
  { id: "mid-semester-2", start: "2027-02-21", end: "2027-02-28", fr: "Vacances de mi-semestre 2", ar: "عطلة منتصف الأسدس الثاني", en: "Mid-semester 2 break" },
  { id: "spring", start: "2027-04-18", end: "2027-05-02", fr: "Vacances de printemps", ar: "عطلة الربيع", en: "Spring break" },
  { id: "summer", start: "2027-07-01", end: "2027-09-05", fr: "Grandes vacances d'été", ar: "العطلة الصيفية", en: "Summer holidays" },
];

const KEY_DATES = [
  { id: "teachers-start", date: SCHOOL_YEAR.teacherStart, fr: "Rentrée des enseignants", ar: "الدخول الإداري للمدرسين", en: "Teachers' return" },
  { id: "students-start", date: SCHOOL_YEAR.start, fr: "Rentrée scolaire des élèves", ar: "الدخول المدرسي للتلاميذ", en: "Students' first day" },
  { id: "independence-day", date: "2026-11-18", fr: "Fête de l'Indépendance", ar: "عيد الاستقلال", en: "Independence Day" },
  { id: "regional-bac", date: SCHOOL_YEAR.regionalBacStart, fr: "Examens régionaux (1ère Bac)", ar: "الامتحانات الجهوية (الأولى باكالوريا)", en: "Regional exams (1st Bac)" },
  { id: "brevet", date: SCHOOL_YEAR.brevetStart, fr: "Examen normalisé du Brevet (3ème APIC)", ar: "الامتحان الموحد للبروفي (3 إعدادي)", en: "Brevet exam (3rd APIC)" },
  { id: "bac-national", date: SCHOOL_YEAR.bacExamStart, fr: "Examens nationaux du Baccalauréat", ar: "الامتحانات الوطنية للباكالوريا", en: "National BAC exams" },
  { id: "year-end", date: SCHOOL_YEAR.end, fr: "Fin de l'année scolaire", ar: "نهاية السنة الدراسية", en: "End of school year" },
];

// --- Metadata ---------------------------------------------------------------
// Repositioned to win the "calendrier scolaire maroc 2026-2027" query cluster
// while still serving the existing interactive calendar tool unchanged.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    fr: `Calendrier scolaire Maroc ${SCHOOL_YEAR.label} — Vacances, examens, calendrier interactif`,
    ar: `التقويم المدرسي بالمغرب ${SCHOOL_YEAR.label} — العطل والامتحانات والتقويم التفاعلي`,
    en: `Moroccan School Calendar ${SCHOOL_YEAR.label} — Holidays, Exams, Interactive Calendar`,
  };
  const descriptions: Record<string, string> = {
    fr: `Calendrier scolaire ${SCHOOL_YEAR.label} au Maroc : 5 périodes de vacances, examens du Bac et du Brevet, fêtes nationales. Outil interactif pour organiser votre année scolaire.`,
    ar: `التقويم المدرسي ${SCHOOL_YEAR.label} بالمغرب: 5 فترات عطل، امتحانات الباكالوريا والبروفي، الأعياد الوطنية. أداة تفاعلية لتنظيم سنتك الدراسية.`,
    en: `Moroccan school calendar ${SCHOOL_YEAR.label}: 5 vacation periods, BAC and Brevet exams, national holidays. Interactive tool to plan your school year.`,
  };

  const title = titles[locale] || titles.fr;
  const description = descriptions[locale] || descriptions.fr;
  const url = `${SITE_URL}/calendar`;

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
      type: "website",
      url,
      siteName: "Udarsy",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
    keywords: locale === "ar"
      ? ["التقويم المدرسي المغرب", "العطل المدرسية المغرب", "الدخول المدرسي 2026", "امتحانات الباكالوريا 2027"]
      : ["calendrier scolaire maroc", "vacances scolaires maroc", "rentree maroc 2026", "examens bac maroc 2027"],
  };
}

// --- JSON-LD ---------------------------------------------------------------
function getFaq(locale: string) {
  if (locale === "ar") return [
    { q: "متى الدخول المدرسي بالمغرب 2026؟", a: `الدخول الإداري للمدرسين: 1 شتنبر 2026. الدخول المدرسي للتلاميذ: 7 شتنبر 2026. التواريخ نهائية بعد نشر مذكرة وزارة التربية الوطنية.` },
    { q: "كم عدد العطل المدرسية في السنة بالمغرب؟", a: "5 عطل رئيسية: عطلة منتصف الأسدس الأول (نونبر)، عطلة نهاية الأسدس الأول (دجنبر-يناير)، عطلة منتصف الأسدس الثاني (فبراير)، عطلة الربيع (أبريل-ماي)، والعطلة الصيفية (يوليوز-شتنبر)، بالإضافة إلى الأعياد الوطنية والدينية." },
    { q: "متى تبدأ امتحانات الباكالوريا 2027؟", a: `الامتحانات الوطنية للباكالوريا: 14-19 يونيو 2027. الامتحانات الجهوية للأولى باكالوريا: 31 ماي - 4 يونيو 2027. التواريخ مرتبطة بإصدار المذكرة الوزارية الرسمية.` },
    { q: "متى يجرى امتحان البروفي 2027؟", a: `الامتحان الموحد للبروفي (3 إعدادي): 7-9 يونيو 2027.` },
    { q: "هل تختلف تواريخ العطل بين الجهات؟", a: "لا، التقويم المدرسي موحد على المستوى الوطني للمدارس العمومية. المدارس الخاصة قد تعدّل بعض التواريخ مع احترام الإطار العام." },
  ];
  if (locale === "en") return [
    { q: "When does the Moroccan school year 2026 start?", a: "Teachers return: September 1, 2026. Students' first day: September 7, 2026. Final dates after the Ministry of National Education publishes its official memo." },
    { q: "How many school holidays per year in Morocco?", a: "Five main breaks: mid-semester 1 (November), end of semester 1 (December–January), mid-semester 2 (February), spring (April–May), and summer (July–September), plus national and religious holidays." },
    { q: "When do the BAC 2027 exams start?", a: "National BAC exams: June 14-19, 2027. Regional 1st-BAC exams: May 31 - June 4, 2027. Final dates depend on the official ministerial memo." },
    { q: "When is the Brevet 2027?", a: "The standardized Brevet exam (3rd APIC): June 7-9, 2027." },
    { q: "Do holiday dates vary by region?", a: "No, the school calendar is unified nationally for public schools. Private schools may adjust within the general framework." },
  ];
  return [
    { q: "Quand est la rentrée scolaire au Maroc 2026 ?", a: "Rentrée des enseignants : 1er septembre 2026. Rentrée des élèves : 7 septembre 2026. Dates définitives après publication de la note ministérielle officielle." },
    { q: "Combien de vacances scolaires par an au Maroc ?", a: "Cinq vacances principales : mi-semestre 1 (novembre), fin de semestre 1 (décembre–janvier), mi-semestre 2 (février), printemps (avril–mai), et grandes vacances d'été (juillet–septembre), plus les fêtes nationales et religieuses." },
    { q: "Quand commencent les examens du Bac 2027 ?", a: "Examens nationaux (session normale) : 14-19 juin 2027. Examens régionaux 1ère Bac : 31 mai - 4 juin 2027. Dates définitives selon la note ministérielle officielle." },
    { q: "Quand a lieu le Brevet 2027 ?", a: "Examen normalisé du Brevet (3ème APIC) : 7-9 juin 2027." },
    { q: "Les dates de vacances varient-elles selon les régions ?", a: "Non, le calendrier scolaire est unifié au niveau national pour les écoles publiques. Les écoles privées peuvent ajuster dans le cadre général." },
  ];
}

function buildSchemas(locale: string) {
  const lang = locale === "ar" ? "ar" : locale === "en" ? "en" : "fr";
  const pageUrl = `${SITE_URL}/calendar`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Calendar", item: pageUrl },
    ],
  };

  // Each holiday + key date becomes a discoverable Event in Google Events /
  // calendar-style rich results. Names are localized to the active locale so
  // the visible page copy and the schema stay consistent.
  const eventsGraph = {
    "@context": "https://schema.org",
    "@graph": [
      ...HOLIDAYS.map(h => ({
        "@type": "Event",
        "@id": `${pageUrl}#${h.id}`,
        name: h[lang],
        startDate: h.start,
        endDate: h.end,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        location: { "@type": "Country", name: "Morocco" },
        organizer: {
          "@type": "GovernmentOrganization",
          name: "Ministère de l'Éducation Nationale (Maroc)",
        },
      })),
      ...KEY_DATES.map(d => ({
        "@type": "Event",
        "@id": `${pageUrl}#${d.id}`,
        name: d[lang],
        startDate: d.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        location: { "@type": "Country", name: "Morocco" },
      })),
    ],
  };

  const faqEntries = getFaq(locale);
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return [breadcrumb, eventsGraph, faq];
}

export default async function CalendarLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const schemas = buildSchemas(locale);
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      {children}
    </>
  );
}
