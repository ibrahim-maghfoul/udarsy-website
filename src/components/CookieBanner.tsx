'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const COOKIE_KEY = 'udarsy_consent';
const CONSENT_DAYS = 15;

function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function saveVisitorMeta(accepted: boolean) {
    try {
        localStorage.setItem('udarsy_visitor_meta', JSON.stringify({
            consent: accepted ? 'accepted' : 'declined',
            timestamp: new Date().toISOString(),
            locale: navigator.language,
            referrer: document.referrer || 'direct',
            path: window.location.pathname,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }));
    } catch { /* unavailable */ }
}

export default function CookieBanner() {
    const t = useTranslations('CookieBanner');
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (!getCookie(COOKIE_KEY)) {
            const timer = setTimeout(() => {
                setMounted(true);
                // double-rAF so the initial off-screen styles paint before transitioning in
                requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
            }, 900);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setVisible(false);
        // unmount after the transition finishes
        setTimeout(() => setMounted(false), 320);
    };
    const accept = () => {
        setCookie(COOKIE_KEY, 'accepted', CONSENT_DAYS);
        saveVisitorMeta(true);
        dismiss();
    };
    const decline = () => {
        setCookie(COOKIE_KEY, 'declined', CONSENT_DAYS);
        saveVisitorMeta(false);
        dismiss();
    };

    if (!mounted) return null;

    return (
        <div
            className="cookie-banner fixed bottom-6 right-6 z-[9999] w-[calc(100%-2rem)] sm:w-auto max-w-[320px] rounded-2xl bg-white [box-shadow:rgba(60,64,67,0.3)_0_1px_2px_0,rgba(60,64,67,0.15)_0_2px_6px_2px]"
            data-visible={visible ? 'true' : 'false'}
            role="dialog"
            aria-live="polite"
            aria-label={t('title')}
        >
                    <div className="flex flex-col items-center justify-between pt-9 px-6 pb-6 relative">
                        <span className="relative mx-auto -mt-16 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="46" width="65" aria-hidden="true">
                                <path stroke="#000" fill="#EAB789" d="M49.157 15.69L44.58.655l-12.422 1.96L21.044.654l-8.499 2.615-6.538 5.23-4.576 9.153v11.114l4.576 8.5 7.846 5.23 10.46 1.96 7.845-2.614 9.153 2.615 11.768-2.615 7.846-7.846 1.96-5.884.655-7.191-7.846-1.308-6.537-3.922z" />
                                <path fill="#9C6750" d="M32.286 3.749c-6.94 3.65-11.69 11.053-11.69 19.591 0 8.137 4.313 15.242 10.724 19.052a20.513 20.513 0 01-8.723 1.937c-11.598 0-21-9.626-21-21.5 0-11.875 9.402-21.5 21-21.5 3.495 0 6.79.874 9.689 2.42z" clipRule="evenodd" fillRule="evenodd" />
                                <path fill="#634647" d="M64.472 20.305a.954.954 0 00-1.172-.824 4.508 4.508 0 01-3.958-.934.953.953 0 00-1.076-.11c-.46.252-.977.383-1.502.382a3.154 3.154 0 01-2.97-2.11.954.954 0 00-.833-.634 4.54 4.54 0 01-4.205-4.507c.002-.23.022-.46.06-.687a.952.952 0 00-.213-.767 3.497 3.497 0 01-.614-3.5.953.953 0 00-.382-1.138 3.522 3.522 0 01-1.5-3.992.951.951 0 00-.762-1.227A22.611 22.611 0 0032.3 2.16 22.41 22.41 0 0022.657.001a22.654 22.654 0 109.648 43.15 22.644 22.644 0 0032.167-22.847zM22.657 43.4a20.746 20.746 0 110-41.493c2.566-.004 5.11.473 7.501 1.407a22.64 22.64 0 00.003 38.682 20.6 20.6 0 01-7.504 1.404zm19.286 0a20.746 20.746 0 112.131-41.384 5.417 5.417 0 001.918 4.635 5.346 5.346 0 00-.133 1.182A5.441 5.441 0 0046.879 11a5.804 5.804 0 00-.028.568 6.456 6.456 0 005.38 6.345 5.053 5.053 0 006.378 2.472 6.412 6.412 0 004.05 1.12 20.768 20.768 0 01-20.716 21.897z" />
                                <path fill="#644647" d="M54.962 34.3a17.719 17.719 0 01-2.602 2.378.954.954 0 001.14 1.53 19.637 19.637 0 002.884-2.634.955.955 0 00-1.422-1.274z" />
                                <path fill="#634647" d="M15.027 15.605a.954.954 0 00-1.553 1.108l1.332 1.863a.955.955 0 001.705-.77.955.955 0 00-.153-.34l-1.331-1.861z" />
                                <path fill="#644647" d="M43.31 23.21a.954.954 0 101.553-1.11l-1.266-1.772a.954.954 0 10-1.552 1.11l1.266 1.772z" />
                                <path fill="#634647" d="M19.672 35.374a.954.954 0 00-.954.953v2.363a.954.954 0 001.907 0v-2.362a.954.954 0 00-.953-.954z" />
                                <path fill="#644647" d="M33.129 29.18l-2.803 1.065a.953.953 0 00-.053 1.764.957.957 0 00.73.022l2.803-1.065a.953.953 0 00-.677-1.783v-.003zm24.373-3.628l-2.167.823a.956.956 0 00-.054 1.764.954.954 0 00.73.021l2.169-.823a.954.954 0 10-.678-1.784v-.001z" />
                            </svg>
                        </span>

                        <h2 className="text-sm font-semibold mb-2 text-left mr-auto text-zinc-700">
                            {t('title')}
                        </h2>

                        <p className="w-full mb-3 text-sm text-zinc-600 leading-snug">
                            {t('desc', { days: CONSENT_DAYS })}{' '}
                            <Link
                                href="/privacy"
                                className="text-sm cursor-pointer font-semibold text-green transition-colors hover:text-[#634647] underline underline-offset-2"
                            >
                                {t('privacy')}
                            </Link>
                        </p>

                        <div
                            className="cookie-details-row w-full mb-3 overflow-hidden"
                            data-open={showDetails ? 'true' : 'false'}
                        >
                            <div className="grid grid-cols-2 gap-2 pt-px">
                                <div className="rounded-lg bg-green/5 border border-green/15 p-2.5">
                                    <p className="text-[11px] font-bold text-zinc-700">{t('essential')}</p>
                                    <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{t('essential_desc')}</p>
                                </div>
                                <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5">
                                    <p className="text-[11px] font-bold text-zinc-700">{t('analytics')}</p>
                                    <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{t('analytics_desc')}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="mr-auto mb-3 text-xs text-zinc-500 cursor-pointer font-semibold transition-colors hover:text-dark hover:underline underline-offset-2"
                            type="button"
                            aria-expanded={showDetails}
                        >
                            <span className="inline-block transition-transform duration-200" style={{ transform: showDetails ? 'rotate(90deg)' : 'none' }}>›</span>{' '}
                            {t('details')}
                        </button>

                        <div className="flex w-full items-center justify-end gap-2">
                            <button
                                onClick={decline}
                                className="text-sm py-2 px-4 text-zinc-600 cursor-pointer font-semibold rounded-lg transition-colors hover:bg-zinc-100 hover:text-dark"
                                type="button"
                            >
                                {t('decline')}
                            </button>
                            <button
                                onClick={accept}
                                className="font-semibold cursor-pointer py-2 px-6 w-max break-keep text-sm rounded-lg transition-colors text-white hover:text-white bg-green-deep hover:bg-dark"
                                type="button"
                            >
                                {t('accept')}
                            </button>
                        </div>
                    </div>
                </div>
    );
}
