import type { Metadata } from "next";

const teamData: Record<string, { name: string; role: string; bio: string }> = {
  "ibrahim-maghfoul": {
    name: "Ibrahim Maghfoul",
    role: "Website Manager",
    bio: "Ibrahim is the visionary behind Udarsy platform, overseeing platform architecture and digital strategy.",
  },
  "abderrahman-aouinat": {
    name: "Abderrahman Aouinat",
    role: "Multimedia Responsable",
    bio: "Abderrahman handles video production and interactive media, transforming complex topics into engaging learning experiences.",
  },
  "mouhamed-demo": {
    name: "Mouhamed Demo",
    role: "Marketing Manager",
    bio: "Mouhamed drives Udarsy's growth through data-driven marketing and brand building.",
  },
  "ayman-nouri": {
    name: "Ayman Nouri",
    role: "Developer",
    bio: "Ayman is the core architect of Udarsy's technical solutions, ensuring the platform is robust, fast, and scalable.",
  },
  "asmae-monaghim": {
    name: "Asmae Monaghim",
    role: "Finance Manager",
    bio: "Asmae oversees budgeting, financial planning, and resource allocation at Udarsy.",
  },
  "safae-el-oujdi": {
    name: "Safae El Oujdi",
    role: "Logistic",
    bio: "Safae ensures smooth operations and streamlines internal processes at Udarsy.",
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
    },
    twitter: {
      card: "summary",
      title: `${member.name} | Udarsy`,
      description: member.bio,
    },
    alternates: { canonical: `/team/${id}` },
  };
}

export default function TeamMemberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}