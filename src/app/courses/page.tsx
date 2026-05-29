import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { serverFetch } from "@/lib/serverFetch";
import CoursesBrowser from "./_CoursesBrowser";
import GuestOnly from "./GuestOnly";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// --- Curriculum types we touch from the SSR side ----------------------------
type School = { _id: string; title: string };
type Level = { _id: string; levelSlug: string; schoolId: string; schoolSlug: string };
type Subject = { _id: string; slug: string; title: string; guidanceId: string };
type Lesson = { _id: string; slug: string; subjectId: string };

// --- Metadata ---------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    fr: "Cours pour étudiants marocains — Primaire, Collège, Lycée, BAC",
    ar: "دروس للطلاب المغاربة — الابتدائي، الإعدادي، الثانوي، الباكالوريا",
    en: "Moroccan Curriculum Courses — Primary, Middle, High School, BAC",
  };
  const descriptions: Record<string, string> = {
    fr: "Explorez tous les cours, exercices et examens de Udarsy alignés avec le programme officiel marocain. Du primaire à la BAC, en français et en arabe.",
    ar: "اكتشف جميع دروس وتمارين وامتحانات يودرسي وفق المنهج الرسمي المغربي. من الابتدائي إلى الباكالوريا، بالعربية والفرنسية.",
    en: "Browse all Udarsy courses, exercises and exams aligned with the official Moroccan curriculum. From primary school to BAC, in French and Arabic.",
  };

  const title = titles[locale] || titles.fr;
  const description = descriptions[locale] || descriptions.fr;
  const url = `${SITE_URL}/courses`;

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
      creator: "@udarsyschool",
    },
  };
}

function slugify(t: string): string {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9؀-ۿ-]/g, "")
    .replace(/-+/g, "-").replace(/^-|-$/g, "") || "x";
}

function prettify(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// --- Page -------------------------------------------------------------------
export default async function CoursesPage() {
  const locale = await getLocale();

  const [schools, levels, subjects, lessons] = await Promise.all([
    serverFetch<School[]>("/data/schools", { revalidate: 3600 }),
    serverFetch<Level[]>("/data/levels/all", { revalidate: 3600 }),
    serverFetch<Subject[]>("/data/subjects/all", { revalidate: 3600 }),
    serverFetch<Lesson[]>("/data/lessons/all", { revalidate: 3600 }),
  ]);

  const schoolList = Array.isArray(schools) ? schools : [];
  const levelList = Array.isArray(levels) ? levels : [];
  const subjectList = Array.isArray(subjects) ? subjects : [];
  const lessonCount = Array.isArray(lessons) ? lessons.length : 0;

  // --- Localized header copy ------------------------------------------------
  const copy = {
    fr: {
      h1: "Cours marocains — Primaire, Collège, Lycée et BAC",
      lead: "Tout le programme scolaire marocain en un seul endroit : cours, exercices corrigés, examens régionaux et nationaux. Gratuit pour commencer.",
      stats_lessons: `${lessonCount}+ leçons`,
      stats_subjects: `${subjectList.length}+ matières`,
      stats_levels: `${levelList.length}+ niveaux`,
      footer_h2: "Tous les niveaux",
    },
    ar: {
      h1: "الدروس المغربية — الابتدائي، الإعدادي، الثانوي والباكالوريا",
      lead: "كل المنهج الدراسي المغربي في مكان واحد: دروس، تمارين مصححة، امتحانات جهوية ووطنية. مجاني للبدء.",
      stats_lessons: `${lessonCount}+ درس`,
      stats_subjects: `${subjectList.length}+ مادة`,
      stats_levels: `${levelList.length}+ مستوى`,
      footer_h2: "كل المستويات",
    },
    en: {
      h1: "Moroccan Curriculum — Primary, Middle School, High School & BAC",
      lead: "The entire Moroccan curriculum in one place: lessons, graded exercises, regional and national exams. Free to start.",
      stats_lessons: `${lessonCount}+ lessons`,
      stats_subjects: `${subjectList.length}+ subjects`,
      stats_levels: `${levelList.length}+ grade levels`,
      footer_h2: "All grade levels",
    },
  };
  const c = copy[locale as keyof typeof copy] || copy.fr;

  // --- JSON-LD --------------------------------------------------------------
  // (No FAQPage here — FAQ visibly lives on /pricing, and the matching schema
  // is already emitted from /pricing/layout.tsx.)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: c.h1, item: `${SITE_URL}/courses` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/courses#collection`,
    url: `${SITE_URL}/courses`,
    name: c.h1,
    description: c.lead,
    inLanguage: ["fr", "ar"],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    hasPart: schoolList.slice(0, 50).map((s) => ({
      "@type": "EducationalOccupationalProgram",
      name: s.title,
      url: `${SITE_URL}/courses/${slugify(s.title)}`,
      educationalLevel: s.title,
      inLanguage: ["fr", "ar"],
      provider: { "@id": `${SITE_URL}/#organization` },
    })),
  };

  // ItemList drives the crawlable internal link graph. Every school + level URL
  // is enumerated here so Googlebot has explicit URL signals even if the
  // visible footer strip below gets restyled or collapsed later.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/courses#schools`,
    name: c.h1,
    numberOfItems: schoolList.length + levelList.length,
    itemListElement: [
      ...schoolList.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.title,
        url: `${SITE_URL}/courses/${slugify(s.title)}`,
      })),
      ...levelList.map((lv, i) => ({
        "@type": "ListItem",
        position: schoolList.length + i + 1,
        name: prettify(lv.levelSlug),
        url: `${SITE_URL}/courses/${lv.schoolSlug}/${lv.levelSlug}`,
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Compact SEO header — small enough to sit above the existing onboarding
          flow without dominating it. Hidden for logged-in users to restore the
          original /courses look. */}
      <GuestOnly>
        <section className="px-[clamp(20px,6vw,80px)] pt-24 md:pt-32 pb-4 max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-dark leading-tight" dir="auto">
            {c.h1}
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed" dir="auto">
            {c.lead}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_lessons}</span>
            <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_subjects}</span>
            <span className="px-3 py-1 rounded-full bg-green/10 text-green text-xs font-bold" dir="auto">{c.stats_levels}</span>
          </div>
        </section>
      </GuestOnly>

      {/* Existing interactive UX — visible to everyone, original design preserved. */}
      <CoursesBrowser />

      {/* Sitemap-style footer link strip. Provides crawlable internal links to
          every school/level without duplicating the onboarding UI. Visually
          minimal; collapsed text size, low-contrast color. */}
      <GuestOnly>
        <footer
          aria-label={c.footer_h2}
          className="border-t border-green/10 mt-8 px-[clamp(20px,6vw,80px)] py-6 max-w-6xl mx-auto"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3" dir="auto">
            {c.footer_h2}
          </h2>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {levelList.map((lv) => (
              <Link
                key={lv._id}
                href={`/courses/${lv.schoolSlug}/${lv.levelSlug}`}
                className="hover:text-green transition-colors"
                dir="auto"
              >
                {prettify(lv.levelSlug)}
              </Link>
            ))}
          </div>
        </footer>
      </GuestOnly>
    </>
  );
}