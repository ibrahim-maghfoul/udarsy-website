// ── Server Component — fetches from MongoDB via the backend API ──────────────

import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { Tag } from 'lucide-react';
import NewsGrid from '@/components/NewsGrid';
import NewsletterCTA from '@/components/NewsletterCTA';
import { serverFetch } from '@/lib/serverFetch';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export const metadata: Metadata = {
    title: "أخبار التعليم في المغرب",
    description: "آخر أخبار التعليم والتوجيه في المغرب — باكالوريا، بريفي، مستجدات وزارة التربية الوطنية وجداول الامتحانات.",
    alternates: { canonical: `${SITE_URL}/news` },
    openGraph: {
        title: "أخبار التعليم في المغرب | Udarsy",
        description: "آخر أخبار التعليم والتوجيه في المغرب — باكالوريا، بريفي، مستجدات وزارة التربية الوطنية وجداول الامتحانات.",
        url: `${SITE_URL}/news`,
        type: "website",
        siteName: "Udarsy",
        locale: "ar_MA",
        alternateLocale: ["fr_MA", "en_US"],
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "أخبار التعليم في المغرب — Udarsy" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "أخبار التعليم في المغرب | Udarsy",
        description: "آخر أخبار التعليم والتوجيه في المغرب — باكالوريا، بريفي، مستجدات وزارة التربية الوطنية وجداول الامتحانات.",
        images: [`${SITE_URL}/og-image.png`],
        creator: "@udarsyschool",
    },
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60';

async function getNewsItems() {
    try {
        const data = await serverFetch<any>('/news?limit=500', { cache: 'no-store' });
        const articles = Array.isArray(data) ? data : (data?.news || []);

        return articles.map((art: any) => {
            const imageFromBlocks = art.content_blocks?.find((b: any) => b.type === 'image')?.src;
            const image =
                art.imageUrl && !art.imageUrl.includes('unsplash') ? art.imageUrl
                    : art.images?.[0]?.src
                    || imageFromBlocks
                    || FALLBACK_IMAGE;

            // Nearest upcoming deadline from important_dates
            const today = new Date().toISOString().slice(0, 10);
            const upcomingDeadline = (art.important_dates || [])
                .filter((d: any) => ['deadline', 'registration', 'exam'].includes(d.label) && d.date >= today)
                .sort((a: any, b: any) => a.date.localeCompare(b.date))[0]?.date || '';

            return {
                id: art._id?.toString(),
                slug: art.slug || '',
                title: art.title || 'Untitled',
                subtitle: art.type || art.category || '',
                category: art.category || 'General',
                date: art.card_date || (art.createdAt ? new Date(art.createdAt).toLocaleDateString() : ''),
                readTime: art.readTime || '',
                rating: typeof art.rating === 'object' ? (art.rating?.average ?? 0) : (art.rating ?? 0),
                viewCount: art.viewCount ?? 0,
                image,
                status: art.status || 'unknown',
                language: art.language || 'mixed',
                deadline: upcomingDeadline,
            };
        });
    } catch (e) {
        console.warn('[NewsPage] Failed to fetch from API, returning empty list:', e);
        return [];
    }
}

export default async function NewsPage() {
    const [t, ft, newsItems] = await Promise.all([
        getTranslations('News'),
        getTranslations('Footer'),
        getNewsItems(),
    ]);

    // CollectionPage + ItemList for the news listing. Item @ids resolve to
    // the NewsArticle nodes /news/[id]/layout.tsx emits, so the listing
    // surface and individual article nodes describe one shared entity graph.
    const newsListJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${SITE_URL}/news#collection`,
                url: `${SITE_URL}/news`,
                name: 'Udarsy — Actualités éducation Maroc',
                description: 'Dernières actualités sur l\'éducation, les concours, les bourses et les examens au Maroc.',
                inLanguage: ['ar', 'fr'],
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: { '@id': `${SITE_URL}/#organization` },
            },
            {
                '@type': 'ItemList',
                '@id': `${SITE_URL}/news#list`,
                name: 'Latest Udarsy education news',
                numberOfItems: newsItems.length,
                itemListElement: newsItems.slice(0, 50).map((n: any, i: number) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    url: `${SITE_URL}/news/${n.slug || n.id}`,
                    name: n.title,
                })),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Udarsy', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen pt-8 md:pt-24 lg:pt-36 pb-32 px-[clamp(16px,5vw,48px)]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsListJsonLd) }}
            />
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Pill */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 text-green text-sm font-bold">
                        <Tag size={14} />
                        Udarsy {t('title')}
                    </div>
                </div>

                {/* Interactive paginated grid */}
                {newsItems.length === 0 ? (
                    <div className="text-center py-20 text-dark/40">
                        <p className="text-xl font-bold">{t('no_articles')}</p>
                        <p className="text-sm mt-2">{t('no_articles_desc')}</p>
                    </div>
                ) : (
                    <NewsGrid items={newsItems} />
                )}

                {/* Newsletter CTA */}
                <NewsletterCTA ft={{
                    loop: ft('loop'),
                    loop_desc: ft('loop_desc'),
                    subscribe_placeholder: ft('subscribe_placeholder'),
                    newsletter: ft('newsletter')
                }} />

            </div>
        </div>
    );
}
