import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight, BookOpen, ArrowLeft, Tag, ExternalLink } from 'lucide-react';
import { posts as staticPosts, getPost, CATEGORY_COLORS, type BlogPost, type Block } from '../_data';
import { serverFetch } from '@/lib/serverFetch';

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await serverFetch<BlogPost>(`/blog/${slug}`, { revalidate: 3600 });
    if (data && data.slug) return data;
  } catch {
    // fall through
  }
  return getPost(slug) ?? null;
}

async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const data = await serverFetch<BlogPost[]>('/blog', { revalidate: 3600 });
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fall through
  }
  return staticPosts;
}

export async function generateStaticParams() {
  try {
    const data = await serverFetch<BlogPost[]>('/blog', { revalidate: 3600 });
    if (Array.isArray(data) && data.length > 0) {
      return data.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // fall through
  }
  return staticPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: 'Udarsy' }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage ?? '', width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      authors: ['Udarsy'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage ?? ''],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-xl md:text-2xl font-extrabold text-dark mt-10 mb-4 leading-snug">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="text-lg font-bold text-dark mt-6 mb-3 leading-snug">
          {block.text}
        </h3>
      );
    case 'p':
      if (block.parts && block.parts.length > 0) {
        return (
          <p className="text-dark/70 leading-relaxed mb-4">
            {block.parts.map((part, i) =>
              part.href ? (
                <Link
                  key={i}
                  href={part.href}
                  className="text-green font-medium hover:underline underline-offset-2"
                >
                  {part.text}
                </Link>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </p>
        );
      }
      return (
        <p className="text-dark/70 leading-relaxed mb-4">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul className="space-y-2 mb-6 pl-0 list-none">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-dark/70 leading-relaxed">
              <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'cta':
      return (
        <div className="my-8 rounded-2xl bg-green/5 border border-green/15 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-dark/70 flex-grow text-sm leading-relaxed">{block.text}</p>
          <Link
            href={block.href ?? '/'}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-green text-white font-bold text-sm hover:bg-green/90 transition-colors whitespace-nowrap"
          >
            {block.label}
          </Link>
        </div>
      );
    case 'links':
      return (
        <div className="my-5 flex flex-wrap gap-2">
          {block.links?.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-dark/5 text-dark/70 font-medium text-sm hover:bg-green/10 hover:text-green transition-colors border border-dark/8"
            >
              <ExternalLink size={12} aria-hidden="true" />
              {link.text}
            </Link>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([fetchPost(slug), fetchAllPosts()]);
  if (!post) notFound();

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);
  const relatedPosts = related.length >= 2
    ? related
    : allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Udarsy', url: 'https://www.udarsy.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Udarsy',
      logo: { '@type': 'ImageObject', url: 'https://www.udarsy.com/favicon.svg' },
    },
    image: { '@type': 'ImageObject', url: post.coverImage, width: 1200, height: 630 },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.udarsy.com/blog/${post.slug}`,
    },
    keywords: post.keywords?.join(', '),
    inLanguage: 'fr-MA',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.udarsy.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.udarsy.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.udarsy.com/blog/${post.slug}` },
    ],
  };

  const formattedDate = new Date(post.date).toLocaleDateString('fr-MA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="min-h-screen pt-8 md:pt-24 lg:pt-32 pb-32 px-[clamp(16px,5vw,48px)]">
        <div className="max-w-4xl mx-auto">

          {/* ── Breadcrumb ── */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-dark/40 mb-8 flex-wrap">
            <Link href="/" className="hover:text-green transition-colors">Accueil</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/blog" className="hover:text-green transition-colors">Blog</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="text-dark/60 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* ── Article header ── */}
          <header className="space-y-5 mb-10">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[post.category] ?? 'bg-green/10 text-green'}`}>
                {post.category}
              </span>
              {post.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-dark/40 text-xs">
                  <Tag size={10} aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark leading-tight">
              {post.title}
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-dark/40 pt-1 border-t border-dark/5 flex-wrap">
              <span className="font-semibold text-dark/60">Udarsy</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formattedDate}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} aria-hidden="true" />
                {post.readTime} de lecture
              </span>
            </div>
          </header>

          {/* ── Cover image ── */}
          {post.coverImage && (
            <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-card">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* ── Article content ── */}
          <article>
            {post.blocks?.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </article>

          {/* ── Tags ── */}
          {post.tags && post.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-dark/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-dark/40 mr-1">Mots-clés :</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-dark/5 text-dark/60 text-xs font-medium">
                    #{tag.replace(/\s+/g, '-')}
                  </span>
                ))}
              </div>
            </footer>
          )}

          {/* ── CTA ── */}
          <div className="mt-12 rounded-3xl bg-dark p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-green text-sm font-bold">
                <BookOpen size={14} aria-hidden="true" />
                Commencer à apprendre
              </div>
              <p className="text-white text-xl md:text-2xl font-extrabold leading-snug">
                Rejoignez des milliers d&apos;élèves sur <span className="text-green">Udarsy</span> — gratuitement
              </p>
            </div>
            <Link
              href="/signup"
              className="flex-shrink-0 px-7 py-3.5 rounded-2xl bg-green text-white font-bold text-sm hover:bg-green/90 transition-colors shadow-lg shadow-green/30"
            >
              Créer mon compte
            </Link>
          </div>

          {/* ── Related articles ── */}
          {relatedPosts.length > 0 && (
            <section className="mt-16" aria-label="Articles similaires">
              <h2 className="text-xl font-extrabold text-dark mb-6">Articles similaires</h2>
              <ul className="grid sm:grid-cols-2 gap-5 list-none p-0" role="list">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <article>
                      <Link
                        href={`/blog/${related.slug}`}
                        className="group flex flex-col h-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-active transition-all duration-300 bg-white border border-dark/5"
                      >
                        {related.coverImage && (
                          <div className="relative h-36 overflow-hidden flex-shrink-0">
                            <Image
                              src={related.coverImage}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        <div className="p-5 flex flex-col gap-2">
                          <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-bold ${CATEGORY_COLORS[related.category] ?? 'bg-green/10 text-green'}`}>
                            {related.category}
                          </span>
                          <h3 className="font-bold text-dark text-sm leading-snug group-hover:text-green transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <span className="inline-flex items-center gap-0.5 text-green font-bold text-xs mt-1">
                            Lire <ChevronRight size={12} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Back to blog ── */}
          <div className="mt-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-dark/50 hover:text-green transition-colors font-medium">
              <ArrowLeft size={15} aria-hidden="true" />
              Retour au blog
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
