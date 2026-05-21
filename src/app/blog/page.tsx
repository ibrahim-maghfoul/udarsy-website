import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, ChevronRight, Rss } from 'lucide-react';
import { posts as staticPosts, CATEGORY_COLORS, type BlogPost } from './_data';
import { serverFetch } from '@/lib/serverFetch';

export const metadata: Metadata = {
  title: 'Blog — Guides, Conseils et Ressources Éducatives',
  description:
    "Guides de révision, conseils pour réussir le BAC, fonctionnalités Udarsy et actualités de l'éducation marocaine. Tout pour réussir votre année scolaire.",
  keywords: [
    'blog udarsy',
    'guides révision maroc',
    'conseils bac maroc',
    'éducation marocaine',
    'cours en ligne maroc',
  ],
  openGraph: {
    type: 'website',
    title: 'Blog Udarsy — Guides et Conseils Éducatifs',
    description:
      "Tout ce qu'il faut savoir pour réussir au Maroc : BAC, méthodes de révision et fonctionnalités de la plateforme.",
    images: [{ url: staticPosts[0].coverImage, width: 1200, height: 630, alt: 'Blog Udarsy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Udarsy',
    description: "Guides, conseils et ressources pour les élèves marocains.",
  },
  alternates: { canonical: '/blog' },
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const data = await serverFetch<BlogPost[]>('/blog', { revalidate: 3600 });
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fall through to static
  }
  return staticPosts;
}

export default async function BlogPage() {
  const allPosts = await getPosts();
  const [featured, ...rest] = allPosts;

  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Udarsy',
    description: "Guides, conseils et ressources pédagogiques pour les élèves marocains.",
    url: 'https://www.udarsy.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Udarsy',
      logo: { '@type': 'ImageObject', url: 'https://www.udarsy.com/favicon.svg' },
    },
    blogPost: allPosts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `https://www.udarsy.com/blog/${p.slug}`,
      image: p.coverImage,
      author: { '@type': 'Organization', name: 'Udarsy' },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />

      <main className="min-h-screen pt-8 md:pt-24 lg:pt-36 pb-32 px-[clamp(16px,5vw,48px)]">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* ── Header ── */}
          <header className="text-center space-y-5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 text-green text-sm font-bold">
              <Rss size={14} aria-hidden="true" />
              Blog Udarsy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark leading-tight">
              Guides, conseils et{' '}
              <span className="text-green">ressources éducatives</span>
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Tout ce qu&apos;il faut savoir pour réussir son année scolaire au Maroc —
              méthodes de révision, fonctionnalités Udarsy et actualités éducatives.
            </p>
          </header>

          {/* ── Featured article ── */}
          {featured && (
            <article aria-label="Article à la une">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-card hover:shadow-card-active transition-all duration-300 bg-white border border-dark/5"
              >
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[260px] overflow-hidden">
                  <Image
                    src={featured.coverImage ?? '/placeholder-blog.jpg'}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center gap-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[featured.category] ?? 'bg-green/10 text-green'}`}>
                      {featured.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-dark/40 text-xs">
                      <Clock size={12} aria-hidden="true" />
                      {featured.readTime}
                    </span>
                    <time className="text-dark/40 text-xs" dateTime={featured.date}>
                      {new Date(featured.date).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-dark leading-snug group-hover:text-green transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-dark/60 leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-green font-bold text-sm mt-auto">
                    Lire l&apos;article
                    <ChevronRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </article>
          )}

          {/* ── Article grid ── */}
          {rest.length > 0 && (
            <section aria-label="Tous les articles">
              <h2 className="text-2xl font-extrabold text-dark mb-8">Tous les articles</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0" role="list">
                {rest.map((post) => (
                  <li key={post.slug}>
                    <article>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col h-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-active transition-all duration-300 bg-white border border-dark/5"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                          <Image
                            src={post.coverImage ?? '/placeholder-blog.jpg'}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-6 flex flex-col gap-3 flex-grow">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${CATEGORY_COLORS[post.category] ?? 'bg-green/10 text-green'}`}>
                              {post.category}
                            </span>
                            <span className="inline-flex items-center gap-1 text-dark/40 text-xs">
                              <Clock size={11} aria-hidden="true" />
                              {post.readTime}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-dark leading-snug group-hover:text-green transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-dark/55 text-sm leading-relaxed line-clamp-3 flex-grow">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-2 mt-auto border-t border-dark/5">
                            <time className="text-dark/35 text-xs" dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </time>
                            <span className="inline-flex items-center gap-0.5 text-green font-bold text-xs group-hover:gap-1 transition-all">
                              Lire <ChevronRight size={13} aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── CTA strip ── */}
          <aside className="rounded-3xl bg-dark p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-green text-sm font-bold mb-1">
                <BookOpen size={15} aria-hidden="true" />
                Prêt à commencer ?
              </div>
              <p className="text-white text-2xl md:text-3xl font-extrabold leading-snug">
                Accédez à des milliers de cours <br className="hidden md:block" />
                <span className="text-green">gratuitement sur Udarsy</span>
              </p>
            </div>
            <Link
              href="/signup"
              className="flex-shrink-0 px-8 py-4 rounded-2xl bg-green text-white font-bold text-sm hover:bg-green/90 transition-colors shadow-lg shadow-green/30"
            >
              Créer mon compte gratuit
            </Link>
          </aside>

        </div>
      </main>
    </>
  );
}
