// Server component — pure render, no client hooks. Lets the hero HTML +
// preload hints reach the browser in the initial SSR response without
// waiting for hydration.
import Link from "next/link";
import Image from "next/image";
import "../app/design-lab/hero.css";

const R2 = "https://files.udarsy.com/hero-cards";
const CARDS = [
  { src: `${R2}/anglais.webp`, title: "Anglais" },
  { src: `${R2}/arabe.webp`, title: "Arabe" },
  { src: `${R2}/mathematiques.webp`, title: "Mathématiques" },
  { src: `${R2}/physique.webp`, title: "Physique" },
  { src: `${R2}/sciences-de-la-vie-et-de-la-terre.webp`, title: "SVT" },
  { src: `${R2}/philosophie.webp`, title: "Philosophie" },
  { src: `${R2}/education-islamique.webp`, title: "Éducation Islamique" },
];

export function LabHero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Decorative background curves — half the path count of the original.
          contain+content-visibility lets the browser skip recompute work
          and removes this from the LCP candidate set. */}
      <svg
        className="hero__curves"
        aria-hidden="true"
        viewBox="0 0 1600 940"
        preserveAspectRatio="xMidYMid slice"
        style={{ contain: 'strict', contentVisibility: 'auto' }}
      >
        <defs>
          <linearGradient id="lab-curve-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3aaa6a" stopOpacity="0" />
            <stop offset="45%" stopColor="#3aaa6a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3aaa6a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M -120 120 Q 800 -40 1720 120" stroke="#3aaa6a" strokeOpacity="0.26" strokeWidth="1" fill="none" />
        <path d="M -120 260 Q 800 -80 1720 260" stroke="url(#lab-curve-a)" strokeWidth="1.3" fill="none" />
        <path d="M -120 470 Q 800 320 1720 470" stroke="#3aaa6a" strokeOpacity="0.30" strokeWidth="1.1" fill="none" />
        <path d="M -120 600 C 400 900, 1200 120, 1720 600" stroke="url(#lab-curve-a)" strokeWidth="1.1" fill="none" />
        <path d="M -120 820 Q 800 1040 1720 820" stroke="#3aaa6a" strokeOpacity="0.22" strokeWidth="1.1" fill="none" />

        <ellipse cx="1460" cy="780" rx="260" ry="260" stroke="#3aaa6a" strokeOpacity="0.18" strokeWidth="1" fill="none" />

        <circle cx="1180" cy="140" r="6" fill="#3aaa6a" fillOpacity="0.3" />
        <circle cx="140" cy="540" r="4" fill="#3aaa6a" fillOpacity="0.35" />
      </svg>

      <div className="hero__blob hero__blob--a" aria-hidden="true" />

      <div className="hero__inner">
        <h1 id="hero-heading" className="hero__headline">
          <span>Learn</span>
          <span className="hero__headline-accent">Smarter</span>
          <span>Together</span>
        </h1>

        <p className="hero__lead">
          AI-powered learning platform for Moroccan students. Structured courses,
          personalised progress, BAC highschool elementary and secondary school.
        </p>

        <div className="hero__ctas">
          <Link href="/courses" className="hero__cta hero__cta--primary">
            Start learning
          </Link>
        </div>
      </div>

      <div className="hero__deck" aria-hidden="true">
        {CARDS.map((card, i) => (
          <div className={`deck-card deck-card--${i}`} key={card.src}>
            <span className="deck-card__title">{card.title}</span>
            <Image
              src={card.src}
              alt=""
              width={400}
              height={667}
              sizes="(max-width: 768px) 35vw, 220px"
              priority={i === 2}
              loading={i === 2 ? undefined : "lazy"}
              fetchPriority={i === 2 ? "high" : "low"}
              className="deck-card__img"
            />
          </div>
        ))}
      </div>
    </section>
  );
}