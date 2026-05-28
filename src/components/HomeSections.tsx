"use client";

import { HeroSection } from "@/components/HeroSection";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const SubjectCardsSection = dynamic(() => import("@/components/SubjectCardsSection").then(m => ({ default: m.SubjectCardsSection })), { ssr: false, loading: () => <div style={{ minHeight: 700 }} /> });
const BelieveSection      = dynamic(() => import("@/components/BelieveSection").then(m => ({ default: m.BelieveSection })), { ssr: false, loading: () => <div style={{ minHeight: 600 }} /> });
const ChatFeatureSection  = dynamic(() => import("@/components/ChatFeatureSection").then(m => ({ default: m.ChatFeatureSection })), { ssr: false, loading: () => <div style={{ minHeight: 500 }} /> });
const CoursesSection      = dynamic(() => import("@/components/CoursesSection").then(m => ({ default: m.CoursesSection })), { ssr: false, loading: () => <div style={{ minHeight: 600 }} /> });
const WorksSection        = dynamic(() => import("@/components/WorksSection").then(m => ({ default: m.WorksSection })), { ssr: false, loading: () => <div style={{ minHeight: 500 }} /> });
const PlatformFeatures    = dynamic(() => import("@/components/PlatformFeatures").then(m => ({ default: m.PlatformFeatures })), { ssr: false, loading: () => <div style={{ minHeight: 700 }} /> });
const PricingSection      = dynamic(() => import("@/components/PricingSection").then(m => ({ default: m.PricingSection })), { ssr: false, loading: () => <div style={{ minHeight: 500 }} /> });
const TeamSection         = dynamic(() => import("@/components/TeamSection").then(m => ({ default: m.TeamSection })), { ssr: false, loading: () => <div style={{ minHeight: 400 }} /> });

function LazySection({ children, minHeight = 400, rootMargin = "800px" }: { children: React.ReactNode; minHeight?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMounted(true); io.disconnect(); } },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return (
    <div ref={ref} style={mounted ? undefined : { minHeight }}>
      {mounted ? children : null}
    </div>
  );
}

export function HomeSections() {
  const commonT = useTranslations('Common');
  const [showButton, setShowButton] = useState(false);
  const [coursesEl, setCoursesEl] = useState<HTMLDivElement | null>(null);
  const [teamsEl, setTeamsEl] = useState<HTMLDivElement | null>(null);
  const [teamsVisible, setTeamsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(check, 150); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!coursesEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowButton(true);
        } else if (entry.boundingClientRect.top > 0) {
          setShowButton(false);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(coursesEl);
    return () => observer.disconnect();
  }, [coursesEl]);

  useEffect(() => {
    if (!teamsEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setTeamsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(teamsEl);
    return () => observer.disconnect();
  }, [teamsEl]);

  useEffect(() => {
    if (!teamsEl) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const bar = progressBarRef.current;
      if (!bar) return;
      const end = teamsEl.offsetTop + teamsEl.offsetHeight - window.innerHeight;
      const progress = end > 0 ? Math.min(Math.max(window.scrollY / end, 0), 1) : 1;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [teamsEl]);

  return (
    <>
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 w-full h-[3px] bg-green origin-left z-[300] pointer-events-none"
        style={{ transform: 'scaleX(0)', transition: 'transform 0.1s ease-out' }}
      />

      <HeroSection />

      <LazySection minHeight={700} rootMargin="2000px"><SubjectCardsSection /></LazySection>
      <div className="hidden sm:block"><LazySection minHeight={600}><BelieveSection /></LazySection></div>
      <LazySection minHeight={500}><ChatFeatureSection /></LazySection>
      <LazySection minHeight={600}>
        <div ref={setCoursesEl}><CoursesSection /></div>
      </LazySection>
      <div className="hidden sm:block"><LazySection minHeight={500}><WorksSection /></LazySection></div>
      <LazySection minHeight={700}><PlatformFeatures /></LazySection>
      <LazySection minHeight={500}><PricingSection /></LazySection>
      <div ref={setTeamsEl}><LazySection minHeight={400}><TeamSection /></LazySection></div>

      <Link
        href="/courses"
        aria-hidden={!(showButton && !(isMobile && teamsVisible))}
        tabIndex={showButton && !(isMobile && teamsVisible) ? 0 : -1}
        onClick={() => trackEvent({ event: 'cta_click', category: 'Conversion', label: 'floating_start_learning' })}
        className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-dark text-white font-semibold text-sm p-[14px_26px] rounded-full shadow-[0_6px_28px_rgba(0,0,0,0.28)] z-[100] transition-[opacity,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(0,0,0,0.35)] ${
          showButton && !(isMobile && teamsVisible) ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-[0.8] translate-y-5 pointer-events-none'
        }`}
      >
        {commonT('start_learning')} →
      </Link>
    </>
  );
}
