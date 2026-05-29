import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// Single source of truth for /team/[id] metadata + Person JSON-LD.
// Must stay in sync with the visible team grid on /about (src/app/about/page.tsx)
// and the page-level render in /team/[id]/page.tsx — same six members, same
// slugs, same roles.
const teamData: Record<string, {
  name: string;
  role: string;
  bio: string;
  jobTitle: string; // schema.org-friendly job title (English, role-independent)
}> = {
  "ibrahim-maghfoul": {
    name: "Ibrahim Maghfoul",
    role: "Website Manager",
    jobTitle: "Founder & Platform Manager",
    bio: "Ibrahim is the visionary behind Udarsy, leading platform architecture and digital strategy for Morocco's freemium learning platform.",
  },
  "abderrahman-aouinat": {
    name: "Abderrahman Aouinat",
    role: "Multimedia Responsable",
    jobTitle: "Head of Multimedia",
    bio: "Abderrahman directs Udarsy's video production and interactive media, transforming complex Moroccan curriculum topics into engaging learning experiences.",
  },
  "abdelhakim-taouqi": {
    name: "Abdelhakim Taouqi",
    role: "Marketing Manager",
    jobTitle: "Marketing Manager",
    bio: "Abdelhakim drives Udarsy's growth across Morocco through data-driven marketing, brand building, and outreach to students preparing for BAC and Brevet.",
  },
  "mouhamed-el-wardi": {
    name: "Mouhamed El Wardi",
    role: "Developer",
    jobTitle: "Software Engineer",
    bio: "Mouhamed builds and maintains the technical foundations of Udarsy — the lesson platform, mobile apps, and the systems that keep thousands of Moroccan students learning every day.",
  },
  "asmae-monaghim": {
    name: "Asmae Monaghim",
    role: "Finance Manager",
    jobTitle: "Finance Manager",
    bio: "Asmae oversees budgeting, financial planning, and resource allocation at Udarsy, keeping the platform on a sustainable trajectory.",
  },
  "safae-el-oujdi": {
    name: "Safae El Oujdi",
    role: "Logistic",
    jobTitle: "Operations Manager",
    bio: "Safae runs Udarsy's day-to-day operations — coordinating between teams, suppliers, and partners across the Kingdom.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = teamData[id];
  if (!member) {
    return { title: "فريق درسي | Udarsy" };
  }
  return {
    title: `${member.name} — ${member.role} | Udarsy`,
    description: member.bio,
    openGraph: {
      title: `${member.name} | Udarsy`,
      description: member.bio,
      type: "profile",
      url: `/team/${id}`,
      images: [{ url: `${SITE_URL}/team/${id}.webp`, width: 800, height: 800, alt: member.name }],
    },
    twitter: {
      card: "summary",
      title: `${member.name} | Udarsy`,
      description: member.bio,
      images: [`${SITE_URL}/team/${id}.webp`],
    },
    alternates: { canonical: `/team/${id}` },
  };
}

// Person + ProfilePage JSON-LD. ProfilePage tells Google this is an
// authoritative author/team profile (eligible for the Profile rich result).
// The embedded Person is the entity News/Blog articles can reference as
// `author` once per-article authorship lands.
function personJsonLd(id: string) {
  const member = teamData[id];
  if (!member) return null;
  const url = `${SITE_URL}/team/${id}`;
  const image = `${SITE_URL}/team/${id}.webp`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#profilepage`,
        url,
        name: `${member.name} — ${member.role}`,
        mainEntity: { "@id": `${url}#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: ["fr", "ar", "en"],
      },
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: member.name,
        url,
        image: { "@type": "ImageObject", url: image, width: 800, height: 800 },
        jobTitle: member.jobTitle,
        description: member.bio,
        worksFor: { "@id": `${SITE_URL}/#organization` },
        knowsAbout: ["Moroccan curriculum", "BAC preparation", "Brevet preparation", "education technology"],
        nationality: { "@type": "Country", name: "Morocco" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
          { "@type": "ListItem", position: 3, name: member.name, item: url },
        ],
      },
    ],
  };
}

export default async function TeamMemberLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jsonLd = personJsonLd(id);
  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {children}
    </>
  );
}
