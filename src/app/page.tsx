// Server component — renders the hero in the initial HTML so the LCP image
// preload and structured HTML reach the browser without waiting for client
// hydration. The interactive bits (scroll progress, lazy sections, floating
// CTA, IntersectionObservers) live in <HomeSections />.
import Image from "next/image";
import { LabHero } from "@/components/LabHero";
import { HomeSections } from "@/components/HomeSections";
import { HomeAuthRedirect } from "@/components/HomeAuthRedirect";
import { getTranslations } from "next-intl/server";

const TRUSTED_PILLS_ROW1 = [
  { key: "maths",    icon: "/icons/Maths.webp" },
  { key: "francais", icon: "/icons/Fran%C3%A7ais.webp" },
  { key: "anglais",  icon: "/icons/Anglais.webp" },
  { key: "arabe",    icon: "/icons/Arabe.webp" },
  { key: "philo",    icon: "/icons/Philosophie.webp" },
];

const TRUSTED_PILLS_ROW2 = [
  { key: "pc",        icon: "/icons/Physique-Chimie.webp" },
  { key: "svt",       icon: "/icons/sciences-de-la-vie-et-de-la-terre.webp" },
  { key: "histgeo",   icon: "/icons/Histoire-G%C3%A9o.webp" },
  { key: "islamique", icon: "/icons/%C3%89ducation%20Islamique.webp" },
];

export default async function Home() {
  const t = await getTranslations('Trusted');
  const tSubj = await getTranslations('SubjectCards');

  return (
    <div className="min-h-screen bg-white selection:bg-green/10 selection:text-green">
      <HomeAuthRedirect />
      <div className="absolute top-0 left-0 w-full h-[120vh] bg-gradient-to-b from-green/[0.03] to-transparent pointer-events-none" />

      <main className="flex flex-col pt-0 md:pt-[72px]">
        {/* LabHero: negative margin counteracts navbar top padding so it fills the viewport edge-to-edge */}
        <div className="md:-mt-[72px]"><LabHero /></div>

        {/* Trusted Strip (server-rendered, no JS needed) */}
        <div className="bg-green p-[40px_0_48px] relative z-5 overflow-hidden">
          {/* Decorative leaves — behind content
              Mobile: height = 50% of viewport width; left shifted up, right shifted down.
              Desktop: 70% of section height, centered vertically. */}
          <Image
            src="https://files.udarsy.com/decorations/left-leafs.webp"
            alt=""
            aria-hidden
            width={600}
            height={810}
            unoptimized
            className="pointer-events-none select-none absolute top-1/2 left-0 z-0 h-[50vw] md:h-[70%] w-auto opacity-70 -translate-y-[70%] md:-translate-y-1/2"
          />
          <Image
            src="https://files.udarsy.com/decorations/right-leafs.webp"
            alt=""
            aria-hidden
            width={600}
            height={810}
            unoptimized
            className="pointer-events-none select-none absolute top-1/2 right-0 z-0 h-[50vw] md:h-[70%] w-auto opacity-70 -translate-y-[30%] md:-translate-y-1/2"
          />

          <div className="relative z-10">
          <div className="text-center text-[10.5px] font-semibold tracking-[0.12em] uppercase text-white/80 mb-7">
            {t('text')}
          </div>
          <div className="flex items-center justify-center gap-[clamp(32px,8vw,100px)] mb-8">
            <div className="opacity-[0.65] hover:opacity-100 transition-opacity cursor-default flex items-center">
              <svg height="22" viewBox="0 0 67 28" className="fill-white">
                <path d="M5.6 10.2c0-1 .8-1.4 2.2-1.4 2 0 4.5.6 6.5 1.7V4.2C12 3.1 9.9 2.7 7.8 2.7 3.2 2.7.2 5.1.2 10c0 7.7 10.6 6.4 10.6 9.7 0 1.2-1 1.5-2.4 1.5-2.1 0-4.8-.9-7-2.2v6.3c2.4 1 4.8 1.5 7 1.5 5.3 0 9-2.3 9-7.3-.1-8.3-10.8-6.8-11.8-9.3zM27.8 3.6l-5.5 1.2-.2 16.3 5.7.1V3.6zm7.5 17.3l5.5-16.4H47l-8.5 22.5H32l-8.5-22.5h6.3l5.5 16.4zm12.4-10.4h11.5C59 7.4 56.9 5.8 54.3 5.8c-2.8 0-5.2 2-6.3 4.7h-.3zm12 7.4c-1.2 1.4-3 2.2-5.2 2.2-3 0-5.5-1.7-6.4-4.2H67c.1-.6.1-1.2.1-1.8C67.1 8 62.7 3.5 57 3.5c-6.3 0-10.5 4.5-10.5 10.7 0 6.3 4.2 10.7 10.8 10.7 3.8 0 6.7-1.4 8.7-3.9l-4.3-2.1z" />
              </svg>
            </div>
            <div className="opacity-[0.65] hover:opacity-100 transition-opacity cursor-default flex items-center">
              <svg height="26" viewBox="0 0 100 100" className="fill-white">
                <path d="M6.3 6.3l55.6-4.1c6.8-.6 8.6-.2 12.9 2.9l17.8 12.5c2.9 2.1 3.9 2.7 3.9 5.1v68c0 4.4-1.6 7-7.2 7.4l-64.3 3.9c-4.2.2-6.2-.4-8.4-3.1L4.3 83.2c-2.4-3-3.4-5.2-3.4-7.8V13.3c0-3.6 1.6-6.5 5.4-7zm51.4 5.6L29.9 14c-1.3.1-1.7.8-1.7 2.1v54.4c0 1.4.4 2.1 1.7 2.1 1.2 0 1.6-.4 2.7-1.7l27.2-43.2v39.8l-7.7 1.8c-1.3.3-1.6.9-1.4 2l2.2 7.2c.3 1.3 1 1.7 2.4 1.3l20-5.6c1.3-.4 1.6-1.1 1.3-2.2l-1.8-7c-.3-1.1-1.1-1.5-2.2-1.2L70.4 65V23.4c0-1.4-.7-2.1-1.9-2l-10.8.5z" />
              </svg>
            </div>
            <div className="opacity-[0.65] hover:opacity-100 transition-opacity cursor-default flex items-center">
              <svg height="24" viewBox="0 0 100 100" className="fill-white">
                <path d="M1.9 61.5L38.5 98C17.9 93.5 1.5 77.1 1.9 61.5zM0 47.5L52.5 100c2-.2 4-.5 5.9-.9L.9 41.6C.3 43.5 0 45.5 0 47.5zm8.3-21.1l65.2 65.2c2-.8 3.9-1.7 5.7-2.8L11.1 19.9c-1 1.7-2 3.5-2.8 5.5zm14.1-15L93.6 82.6C95 81 96.3 79.3 97.5 77.5L27.6 7.6C25.7 8.7 24 10 22.4 11.4zm18.7-9.1L97.7 60.9C99.1 57 100 52.8 100 48.5l-1.2-1.2C97.8 21.5 78.3 2 52.6.3L41.1 2.3z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[clamp(32px,8vw,100px)]">
            <div className="opacity-[0.65] hover:opacity-100 transition-opacity cursor-default flex items-center">
              <span
                aria-hidden
                className="block bg-white"
                style={{
                  height: 26,
                  width: 23,
                  WebkitMaskImage: 'url("/brands%20icons/fauna-icon.svg")',
                  maskImage: 'url("/brands%20icons/fauna-icon.svg")',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </div>
            <div className="opacity-[0.65] hover:opacity-100 transition-opacity cursor-default flex items-center">
              <span
                aria-hidden
                className="block bg-white"
                style={{
                  height: 26,
                  width: 26,
                  WebkitMaskImage: 'url("/brands%20icons/hootsuite-icon.svg")',
                  maskImage: 'url("/brands%20icons/hootsuite-icon.svg")',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </div>
            <div className="opacity-[0.65] hover:opacity-100 transition-opacity cursor-default flex items-center">
              <span
                aria-hidden
                className="block bg-white"
                style={{
                  height: 26,
                  width: 22,
                  WebkitMaskImage: 'url("/brands%20icons/planless-icon.svg")',
                  maskImage: 'url("/brands%20icons/planless-icon.svg")',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </div>
          </div>

          {/* Section divider title — bridges institutions and subjects */}
          <div className="mt-12 mb-8 flex items-center justify-center gap-4 px-4">
            <span className="h-px w-10 sm:w-16 bg-white/25" />
            <h2 className="text-center text-white text-[16px] sm:text-[18px] font-semibold tracking-[0.01em]">
              {t('subjectsTitle')}
            </h2>
            <span className="h-px w-10 sm:w-16 bg-white/25" />
          </div>

          {/* Subject pills — 5 short on row 1, 4 long on row 2 */}
          <div className="flex flex-col items-center gap-3 px-4">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {TRUSTED_PILLS_ROW1.map((s) => (
                <span
                  key={s.key}
                  className="inline-flex items-center gap-2 bg-white rounded-full h-9 pl-1 pr-4 text-[12.5px] font-semibold text-[#1f5a36] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.15)]"
                >
                  <span className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-green/10 ring-1 ring-green/15">
                    <Image
                      src={s.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="rounded-full object-cover w-[22px] h-[22px]"
                    />
                  </span>
                  {tSubj(`subjects.${s.key}`)}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {TRUSTED_PILLS_ROW2.map((s) => (
                <span
                  key={s.key}
                  className="inline-flex items-center gap-2 bg-white rounded-full h-9 pl-1 pr-4 text-[12.5px] font-semibold text-[#1f5a36] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.15)]"
                >
                  <span className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-green/10 ring-1 ring-green/15">
                    <Image
                      src={s.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="rounded-full object-cover w-[22px] h-[22px]"
                    />
                  </span>
                  {tSubj(`subjects.${s.key}`)}
                </span>
              ))}
            </div>
          </div>
          </div>
        </div>

        <HomeSections />
      </main>
    </div>
  );
}
