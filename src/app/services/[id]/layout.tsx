import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const services = await serverFetch<{ _id: string; title: string; description: string }[]>(
      '/data/school-services',
      { revalidate: 3600 }
    );
    if (!services) throw new Error("Not found");
    const service = services.find((s) => s._id === id);
    if (!service) throw new Error("Not found");
    return {
      title: service.title,
      description: service.description
        ? service.description.slice(0, 160)
        : `اكتشف خدمة "${service.title}" على منصة درسي.`,
      openGraph: {
        title: `${service.title} | Udarsy`,
        description: service.description || `خدمة "${service.title}" على منصة درسي.`,
        type: "website",
        url: `/services/${id}`,
      },
      alternates: { canonical: `/services/${id}` },
    };
  } catch {
    return {
      title: "خدمة مدرسية",
      description: "اكتشف الخدمات المدرسية على منصة درسي.",
    };
  }
}

export default function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
