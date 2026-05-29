import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CalendarDays, GraduationCap, Sun, Leaf, Snowflake, Flower2, Sparkles, BookOpenCheck } from "lucide-react";
import { getLocale } from "next-intl/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// --- Academic year configuration --------------------------------------------
// Source: Moroccan Ministry of National Education (MEN) 2026-2027 indicative
// calendar, cross-checked against published Moroccan education portals
// (wizaide.com, orientation-chabab.com). Dates remain "sous réserve de
// l'arrêté officiel" — the Ministry typically publishes the final decree in
// late August. Update once the official MEN bulletin is released.
const SCHOOL_YEAR = {
  label: "2026-2027",
  start: "2026-09-07",         // Rentrée des élèves
  teacherStart: "2026-09-01",  // Rentrée des enseignants
  end: "2027-06-30",           // Fin de l'année scolaire (avant les vacances d'été)
  bacExamStart: "2027-06-14",  // Début examens nationaux du Bac (session normale)
  bacExamEnd: "2027-06-19",
  brevetStart: "2027-06-07",   // Examen normalisé du Brevet (3ème APIC)
  brevetEnd: "2027-06-09",
  regionalBacStart: "2027-05-31", // Examens régionaux 1ère Bac
  regionalBacEnd: "2027-06-04",
};

type Holiday = {
  id: string;
  start: string; // ISO date
  end: string;
  fr: { name: string; desc: string };
  ar: { name: string; desc: string };
  en: { name: string; desc: string };
  icon: React.ReactNode;
};

// Morocco operates on a 5-vacation schedule (not 4 like the French system).
// Each break is roughly 1 week, with the longer end-of-semester-1 break
// covering ~2 weeks around year-end. Dates per MEN indicative calendar.
const HOLIDAYS: Holiday[] = [
  {
    id: "mid-semester-1",
    start: "2026-11-08",
    end: "2026-11-15",
    icon: <Leaf size={20} />,
    fr: { name: "Vacances de mi-semestre 1", desc: "Première semaine de vacances de l'année scolaire — milieu du premier semestre." },
    ar: { name: "عطلة منتصف الأسدس الأول", desc: "أول عطلة في السنة الدراسية — منتصف الأسدس الأول." },
    en: { name: "Mid-semester 1 break", desc: "First school break of the year — middle of the first semester." },
  },
  {
    id: "end-semester-1",
    start: "2026-12-19",
    end: "2027-01-04",
    icon: <Snowflake size={20} />,
    fr: { name: "Vacances de fin de semestre 1", desc: "Deux semaines de vacances coïncidant avec les fêtes de fin d'année." },
    ar: { name: "عطلة نهاية الأسدس الأول", desc: "أسبوعان من العطلة يتزامنان مع نهاية السنة الميلادية." },
    en: { name: "End of semester 1 break", desc: "Two-week break coinciding with the year-end festivities." },
  },
  {
    id: "mid-semester-2",
    start: "2027-02-21",
    end: "2027-02-28",
    icon: <Flower2 size={20} />,
    fr: { name: "Vacances de mi-semestre 2", desc: "Semaine de vacances au milieu du second semestre." },
    ar: { name: "عطلة منتصف الأسدس الثاني", desc: "أسبوع عطلة في منتصف الأسدس الثاني." },
    en: { name: "Mid-semester 2 break", desc: "One-week break in the middle of the second semester." },
  },
  {
    id: "spring",
    start: "2027-04-18",
    end: "2027-05-02",
    icon: <Sun size={20} />,
    fr: { name: "Vacances de printemps", desc: "Deux semaines de vacances incluant la Fête du Travail." },
    ar: { name: "عطلة الربيع", desc: "أسبوعان من العطلة بما في ذلك عيد الشغل." },
    en: { name: "Spring break", desc: "Two-week break including Labor Day." },
  },
  {
    id: "summer",
    start: "2027-07-01",
    end: "2027-09-05",
    icon: <Sun size={20} />,
    fr: { name: "Grandes vacances d'été", desc: "Vacances d'été après la fin de l'année scolaire et les examens nationaux." },
    ar: { name: "العطلة الصيفية", desc: "العطلة الصيفية بعد نهاية السنة الدراسية والامتحانات الوطنية." },
    en: { name: "Summer holidays", desc: "Summer break following the end of the school year and the national exams." },
  },
];

type ImportantDate = {
  id: string;
  date: string;
  fr: { name: string; desc: string };
  ar: { name: string; desc: string };
  en: { name: string; desc: string };
  icon: React.ReactNode;
};

const IMPORTANT_DATES: ImportantDate[] = [
  {
    id: "teachers-start",
    date: SCHOOL_YEAR.teacherStart,
    icon: <GraduationCap size={20} />,
    fr: { name: "Rentrée des enseignants", desc: "Reprise administrative et préparation de la rentrée." },
    ar: { name: "الدخول الإداري للمدرسين", desc: "العودة الإدارية وتحضير الدخول المدرسي." },
    en: { name: "Teachers' return", desc: "Administrative return and preparation for the school year." },
  },
  {
    id: "students-start",
    date: SCHOOL_YEAR.start,
    icon: <CalendarDays size={20} />,
    fr: { name: "Rentrée scolaire des élèves", desc: "Premier jour de classe pour tous les élèves au Maroc." },
    ar: { name: "الدخول المدرسي للتلاميذ", desc: "أول يوم دراسي لجميع التلاميذ بالمغرب." },
    en: { name: "Students' first day", desc: "First day of classes for all students in Morocco." },
  },
  {
    id: "independence-day",
    date: "2026-11-18",
    icon: <Sparkles size={20} />,
    fr: { name: "Fête de l'Indépendance", desc: "Fête nationale marocaine — jour férié officiel pour tous les établissements." },
    ar: { name: "عيد الاستقلال", desc: "العيد الوطني المغربي — عطلة رسمية لجميع المؤسسات." },
    en: { name: "Independence Day", desc: "Moroccan national holiday — official day off for all institutions." },
  },
  {
    id: "regional-bac-exam",
    date: SCHOOL_YEAR.regionalBacStart,
    icon: <Sparkles size={20} />,
    fr: { name: "Examens régionaux (1ère Bac)", desc: `Période d'examens : ${SCHOOL_YEAR.regionalBacStart} → ${SCHOOL_YEAR.regionalBacEnd}. Composante de la note du Baccalauréat pour les élèves de 1ère année du Bac.` },
    ar: { name: "الامتحانات الجهوية (الأولى باكالوريا)", desc: `فترة الامتحانات: ${SCHOOL_YEAR.regionalBacStart} → ${SCHOOL_YEAR.regionalBacEnd}. مكون من معدل الباكالوريا لتلاميذ السنة الأولى من الباكالوريا.` },
    en: { name: "Regional exams (1st Bac)", desc: `Exam window: ${SCHOOL_YEAR.regionalBacStart} → ${SCHOOL_YEAR.regionalBacEnd}. Component of the Baccalauréat final grade for 1st-year BAC students.` },
  },
  {
    id: "brevet-exam",
    date: SCHOOL_YEAR.brevetStart,
    icon: <BookOpenCheck size={20} />,
    fr: { name: "Examen normalisé du Brevet (3ème APIC)", desc: `Période d'examens : ${SCHOOL_YEAR.brevetStart} → ${SCHOOL_YEAR.brevetEnd}. Examen de fin de collège ouvrant l'accès au lycée.` },
    ar: { name: "الامتحان الموحد للبروفي (3 إعدادي)", desc: `فترة الامتحانات: ${SCHOOL_YEAR.brevetStart} → ${SCHOOL_YEAR.brevetEnd}. امتحان نهاية الإعدادي يفتح الولوج إلى الثانوي.` },
    en: { name: "Brevet exam (3rd APIC)", desc: `Exam window: ${SCHOOL_YEAR.brevetStart} → ${SCHOOL_YEAR.brevetEnd}. End-of-middle-school exam granting access to high school.` },
  },
  {
    id: "bac-exam",
    date: SCHOOL_YEAR.bacExamStart,
    icon: <Sparkles size={20} />,
    fr: { name: "Examens nationaux du Baccalauréat", desc: `Période d'examens : ${SCHOOL_YEAR.bacExamStart} → ${SCHOOL_YEAR.bacExamEnd} (session normale). Les épreuves varient selon la filière.` },
    ar: { name: "الامتحانات الوطنية للباكالوريا", desc: `فترة الامتحانات: ${SCHOOL_YEAR.bacExamStart} → ${SCHOOL_YEAR.bacExamEnd} (الدورة العادية). تختلف الاختبارات حسب الشعبة.` },
    en: { name: "National BAC exams", desc: `Exam window: ${SCHOOL_YEAR.bacExamStart} → ${SCHOOL_YEAR.bacExamEnd} (normal session). Tests vary by BAC stream.` },
  },
  {
    id: "year-end",
    date: SCHOOL_YEAR.end,
    icon: <Calendar size={20} />,
    fr: { name: "Fin de l'année scolaire", desc: "Dernier jour de classe avant le début des grandes vacances." },
    ar: { name: "نهاية السنة الدراسية", desc: "آخر يوم دراسي قبل بداية العطلة الصيفية." },
    en: { name: "End of school year", desc: "Last day of classes before the summer holidays begin." },
  },
];

// --- Metadata ---------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    fr: `Calendrier scolaire Maroc ${SCHOOL_YEAR.label} — Vacances et dates clés`,
    ar: `التقويم المدرسي بالمغرب ${SCHOOL_YEAR.label} — العطل والمواعيد المهمة`,
    en: `Moroccan School Calendar ${SCHOOL_YEAR.label} — Holidays and Key Dates`,
  };
  const descriptions: Record<string, string> = {
    fr: `Calendrier scolaire officiel Maroc ${SCHOOL_YEAR.label} : rentrée, vacances scolaires (Toussaint, hiver, printemps, été), examens du Bac et dates clés.`,
    ar: `التقويم المدرسي الرسمي بالمغرب ${SCHOOL_YEAR.label}: الدخول المدرسي، العطل المدرسية (الخريف، الشتاء، الربيع، الصيف)، امتحانات الباكالوريا والمواعيد المهمة.`,
    en: `Official Moroccan school calendar ${SCHOOL_YEAR.label}: start of school, vacations (autumn, winter, spring, summer), BAC exams, and key dates.`,
  };

  const title = titles[locale] || titles.fr;
  const description = descriptions[locale] || descriptions.fr;
  const url = `${SITE_URL}/calendrier-scolaire`;

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
      ? ["التقويم المدرسي المغرب", "العطل المدرسية المغرب", "الدخول المدرسي 2026", "امتحانات الباكالوريا 2027"]
      : ["calendrier scolaire maroc", "vacances scolaires maroc", "rentree maroc 2026", "examens bac maroc 2027"],
  };
}

function fmtDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(
      locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-MA",
      { day: "numeric", month: "long", year: "numeric" },
    );
  } catch {
    return iso;
  }
}

function fmtRange(start: string, end: string, locale: string): string {
  return `${fmtDate(start, locale)} → ${fmtDate(end, locale)}`;
}

function getFaq(locale: string): { q: string; a: string }[] {
  if (locale === "ar") {
    return [
      { q: "متى الدخول المدرسي بالمغرب 2026؟", a: `الدخول الإداري للمدرسين: ${fmtDate(SCHOOL_YEAR.teacherStart, "ar")}. الدخول المدرسي للتلاميذ: ${fmtDate(SCHOOL_YEAR.start, "ar")}. التواريخ نهائية بعد نشر مذكرة وزارة التربية الوطنية.` },
      { q: "كم عدد العطل المدرسية في السنة بالمغرب؟", a: "5 عطل رئيسية خلال السنة الدراسية: عطلة منتصف الأسدس الأول (نونبر)، عطلة نهاية الأسدس الأول (دجنبر-يناير)، عطلة منتصف الأسدس الثاني (فبراير)، عطلة الربيع (أبريل-ماي)، والعطلة الصيفية (يوليوز-شتنبر)، بالإضافة إلى الأعياد الوطنية والدينية الرسمية." },
      { q: "متى تبدأ امتحانات الباكالوريا 2027؟", a: `الامتحانات الوطنية للباكالوريا (الدورة العادية): ${fmtRange(SCHOOL_YEAR.bacExamStart, SCHOOL_YEAR.bacExamEnd, "ar")}. الامتحانات الجهوية للأولى باكالوريا: ${fmtRange(SCHOOL_YEAR.regionalBacStart, SCHOOL_YEAR.regionalBacEnd, "ar")}. التواريخ مرتبطة بإصدار المذكرة الوزارية الرسمية.` },
      { q: "متى يجرى امتحان البروفي 2027؟", a: `الامتحان الموحد للبروفي (3 إعدادي): ${fmtRange(SCHOOL_YEAR.brevetStart, SCHOOL_YEAR.brevetEnd, "ar")}.` },
      { q: "هل تختلف تواريخ العطل بين الجهات؟", a: "لا، التقويم المدرسي موحد على المستوى الوطني للمدارس العمومية. المدارس الخاصة قد تعدّل بعض التواريخ مع احترام الإطار العام." },
      { q: "كيف أحضّر للسنة الدراسية مع يودرسي؟", a: "يودرسي توفر دروساً وامتحانات نموذجية لكل المستويات والشعب من الابتدائي إلى الباكالوريا، مع تتبع تقدمك ومراجعات منظمة." },
    ];
  }
  if (locale === "en") {
    return [
      { q: "When does the Moroccan school year 2026 start?", a: `Teachers return: ${fmtDate(SCHOOL_YEAR.teacherStart, "en")}. Students' first day: ${fmtDate(SCHOOL_YEAR.start, "en")}. Final dates after the Ministry of National Education publishes its official memo.` },
      { q: "How many school holidays per year in Morocco?", a: "Five main breaks: mid-semester 1 (November), end of semester 1 (December–January), mid-semester 2 (February), spring (April–May), and summer (July–September), plus national and religious holidays." },
      { q: "When do the BAC 2027 exams start?", a: `National BAC exams (normal session): ${fmtRange(SCHOOL_YEAR.bacExamStart, SCHOOL_YEAR.bacExamEnd, "en")}. Regional 1st-BAC exams: ${fmtRange(SCHOOL_YEAR.regionalBacStart, SCHOOL_YEAR.regionalBacEnd, "en")}. Final dates depend on the official ministerial memo.` },
      { q: "When is the Brevet 2027?", a: `The standardized Brevet exam (3rd APIC): ${fmtRange(SCHOOL_YEAR.brevetStart, SCHOOL_YEAR.brevetEnd, "en")}.` },
      { q: "Do holiday dates vary by region?", a: "No, the school calendar is unified nationally for public schools. Private schools may adjust within the general framework." },
      { q: "How can I prepare for the school year with Udarsy?", a: "Udarsy offers lessons and model exams for all levels and BAC streams, with progress tracking and structured revisions." },
    ];
  }
  return [
    { q: "Quand est la rentrée scolaire au Maroc 2026 ?", a: `Rentrée des enseignants : ${fmtDate(SCHOOL_YEAR.teacherStart, "fr")}. Rentrée des élèves : ${fmtDate(SCHOOL_YEAR.start, "fr")}. Dates définitives après publication de la note ministérielle officielle.` },
    { q: "Combien de vacances scolaires par an au Maroc ?", a: "Cinq vacances principales : mi-semestre 1 (novembre), fin de semestre 1 (décembre–janvier), mi-semestre 2 (février), printemps (avril–mai), et grandes vacances d'été (juillet–septembre), plus les fêtes nationales et religieuses officielles." },
    { q: "Quand commencent les examens du Bac 2027 ?", a: `Examens nationaux (session normale) : ${fmtRange(SCHOOL_YEAR.bacExamStart, SCHOOL_YEAR.bacExamEnd, "fr")}. Examens régionaux 1ère Bac : ${fmtRange(SCHOOL_YEAR.regionalBacStart, SCHOOL_YEAR.regionalBacEnd, "fr")}. Dates définitives selon la note ministérielle officielle.` },
    { q: "Quand a lieu le Brevet 2027 ?", a: `Examen normalisé du Brevet (3ème APIC) : ${fmtRange(SCHOOL_YEAR.brevetStart, SCHOOL_YEAR.brevetEnd, "fr")}.` },
    { q: "Les dates de vacances varient-elles selon les régions ?", a: "Non, le calendrier scolaire est unifié au niveau national pour les écoles publiques. Les écoles privées peuvent ajuster dans le cadre général." },
    { q: "Comment préparer la rentrée avec Udarsy ?", a: "Udarsy propose des leçons et examens corrigés pour tous les niveaux et filières du Bac, avec un suivi de progression et des révisions structurées." },
  ];
}

// --- Page -------------------------------------------------------------------
export default async function CalendrierScolaireHubPage() {
  const locale = await getLocale();

  const faq = getFaq(locale);

  const copy = {
    fr: {
      kicker: `Année scolaire ${SCHOOL_YEAR.label}`,
      h1: `Calendrier scolaire au Maroc ${SCHOOL_YEAR.label}`,
      lead: `Toutes les dates de l'année scolaire ${SCHOOL_YEAR.label} au Maroc : rentrée, 5 périodes de vacances, examens du Bac et du Brevet, et fêtes nationales. Calendrier indicatif basé sur les annonces du Ministère de l'Éducation Nationale (MEN).`,
      stats_year: SCHOOL_YEAR.label,
      stats_holidays: `${HOLIDAYS.length} vacances`,
      stats_lang: "FR · AR",
      indicative: "Dates indicatives — sous réserve de l'arrêté officiel",
      important_h2: "Dates clés de l'année",
      holidays_h2: "Vacances scolaires",
      faq_h2: "Questions fréquentes",
      tool_h2: "Outil calendrier interactif",
      tool_desc: "Suivez votre planning d'études et ajoutez vos propres événements avec le calendrier Udarsy.",
      tool_btn: "Ouvrir mon calendrier",
      tool_link: "/calendar",
      cta_h2: "Préparez votre année avec Udarsy",
      cta_desc: "Cours, examens et révisions alignés au programme marocain.",
      cta_btn: "Voir les cours",
      cta_link: "/courses",
    },
    ar: {
      kicker: `السنة الدراسية ${SCHOOL_YEAR.label}`,
      h1: `التقويم المدرسي بالمغرب ${SCHOOL_YEAR.label}`,
      lead: `جميع تواريخ السنة الدراسية ${SCHOOL_YEAR.label} بالمغرب: الدخول المدرسي، 5 فترات عطل، امتحانات الباكالوريا والبروفي، والأعياد الوطنية. تقويم تقريبي حسب إعلانات وزارة التربية الوطنية.`,
      stats_year: SCHOOL_YEAR.label,
      stats_holidays: `${HOLIDAYS.length} عطل`,
      stats_lang: "AR · FR",
      indicative: "تواريخ تقريبية — في انتظار المذكرة الوزارية الرسمية",
      important_h2: "المواعيد المهمة في السنة",
      holidays_h2: "العطل المدرسية",
      faq_h2: "أسئلة شائعة",
      tool_h2: "تقويم تفاعلي",
      tool_desc: "تتبع برنامج دراستك وأضف أحداثك الخاصة مع تقويم يودرسي.",
      tool_btn: "افتح التقويم",
      tool_link: "/calendar",
      cta_h2: "حضّر سنتك مع يودرسي",
      cta_desc: "دروس وامتحانات ومراجعات وفق المنهج المغربي.",
      cta_btn: "تصفح الدروس",
      cta_link: "/courses",
    },
    en: {
      kicker: `${SCHOOL_YEAR.label} school year`,
      h1: `Moroccan School Calendar ${SCHOOL_YEAR.label}`,
      lead: `All dates for the ${SCHOOL_YEAR.label} school year in Morocco: start of school, 5 vacation periods, BAC and Brevet exams, and national holidays. Indicative calendar based on Ministry of National Education (MEN) announcements.`,
      stats_year: SCHOOL_YEAR.label,
      stats_holidays: `${HOLIDAYS.length} breaks`,
      stats_lang: "FR · AR",
      indicative: "Indicative dates — pending official ministerial decree",
      important_h2: "Key dates of the year",
      holidays_h2: "School holidays",
      faq_h2: "Frequently asked questions",
      tool_h2: "Interactive calendar tool",
      tool_desc: "Track your study plan and add your own events with the Udarsy calendar.",
      tool_btn: "Open my calendar",
      tool_link: "/calendar",
      cta_h2: "Prepare your year with Udarsy",
      cta_desc: "Lessons, exams, and revisions aligned with the Moroccan curriculum.",
      cta_btn: "Browse courses",
      cta_link: "/courses",
    },
  };
  const c = copy[locale as keyof typeof copy] || copy.fr;
  const lp = <T extends { fr: any; ar: any; en: any }>(o: T) => o[locale as "fr" | "ar" | "en"] || o.fr;

  // --- JSON-LD --------------------------------------------------------------
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: c.h1, item: `${SITE_URL}/calendrier-scolaire` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/calendrier-scolaire#webpage`,
    url: `${SITE_URL}/calendrier-scolaire`,
    name: c.h1,
    description: c.lead,
    inLanguage: ["fr", "ar"],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    datePublished: "2026-05-01",
    dateModified: new Date().toISOString().slice(0, 10),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      geographicArea: { "@type": "Country", name: "Morocco" },
    },
  };

  // Each holiday and key date emitted as an Event so it can surface in Google
  // Events / calendar-style rich results when searched.
  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...HOLIDAYS.map((h) => ({
        "@type": "Event",
        "@id": `${SITE_URL}/calendrier-scolaire#${h.id}`,
        name: lp(h).name,
        description: lp(h).desc,
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
      ...IMPORTANT_DATES.map((d) => ({
        "@type": "Event",
        "@id": `${SITE_URL}/calendrier-scolaire#${d.id}`,
        name: lp(d).name,
        description: lp(d).desc,
        startDate: d.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        location: { "@type": "Country", name: "Morocco" },
      })),
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ─── HERO ─── */}
      <section className="px-[clamp(20px,6vw,80px)] pt-24 md:pt-32 pb-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold mb-4" dir="auto">
          <Calendar size={14} />
          {c.kicker}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-dark leading-tight" dir="auto">
          {c.h1}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed" dir="auto">
          {c.lead}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_year}</span>
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_holidays}</span>
          <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_lang}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground italic" dir="auto">
          {c.indicative}
        </p>
      </section>

      {/* ─── KEY DATES ─── */}
      <section className="px-[clamp(20px,6vw,80px)] py-8 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6" dir="auto">{c.important_h2}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {IMPORTANT_DATES.map((d) => {
            const t = lp(d);
            return (
              <div key={d.id} className="rounded-[10px] border border-green/10 bg-white p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-[10px] bg-green/10 text-green flex items-center justify-center shrink-0">
                  {d.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-green mb-1" dir="auto">{fmtDate(d.date, locale)}</p>
                  <h3 className="font-bold text-dark text-base leading-tight" dir="auto">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed" dir="auto">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── HOLIDAYS ─── */}
      <section className="px-[clamp(20px,6vw,80px)] py-8 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6" dir="auto">{c.holidays_h2}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOLIDAYS.map((h) => {
            const t = lp(h);
            return (
              <div key={h.id} className="rounded-[10px] border border-green/10 bg-white p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-[10px] bg-green/10 text-green flex items-center justify-center shrink-0">
                  {h.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-green mb-1" dir="auto">{fmtRange(h.start, h.end, locale)}</p>
                  <h3 className="font-bold text-dark text-base leading-tight" dir="auto">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed" dir="auto">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── INTERACTIVE TOOL CTA ─── */}
      <section className="px-[clamp(20px,6vw,80px)] py-8 max-w-5xl mx-auto">
        <div className="rounded-[10px] border border-green/15 bg-gradient-to-br from-green/[0.04] to-transparent p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-[10px] bg-green text-white flex items-center justify-center shrink-0">
            <CalendarDays size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-dark mb-1" dir="auto">{c.tool_h2}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed" dir="auto">{c.tool_desc}</p>
          </div>
          <Link
            href={c.tool_link}
            className="inline-block px-5 py-2.5 bg-green text-white text-sm font-bold rounded-2xl hover:scale-[1.03] transition-all shrink-0"
          >
            {c.tool_btn}
          </Link>
        </div>
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
