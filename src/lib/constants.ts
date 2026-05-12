// ─── Udarsy — Static Links & Contact Info ─────────────────────────────────────
// Single source of truth for all public URLs, social links, and contact details.
// Import from '@/lib/constants' wherever needed.

// ── Website Social Media ─────────────────────────────────────────────────────
export const SOCIALS = {
    twitter: 'https://twitter.com/udarsyschool',
    instagram: 'https://instagram.com/udarsy',
    facebook: 'https://facebook.com/udarsy',
    youtube: 'https://youtube.com/@udarsyschool',
    website: 'https://udarsy.com',
    tiktok: 'https://tiktok.com/@udarsyschool',
    linkedin: '',     // add when ready
    github: '',       // add when ready
} as const;

// ── Contact Info ─────────────────────────────────────────────────────────────
export const CONTACT = {
    email: 'contact@udarsy.com',
    privacyEmail: 'contact@udarsy.com',
    phone: '+212642094671',
    phoneTel: '+212642094671',
    location: 'Morocco/Rabat',
} as const;

// ── Team Members ─────────────────────────────────────────────────────────────
// Each member has optional social links — leave empty string if not available.
export const TEAM = [
    {
        id: 1,
        name: 'Ibrahim Maghfoul',
        roleKey: 'member1_role',
        descKey: 'member1_desc',
        img: '/team/ibrahim-maghfoul.png',
        color: 'bg-[#9ef0b8]',
        rot: '-2.3deg',
        pattern: 'diagonal' as const,
        socials: { facebook: '', twitter: '', linkedin: '' },
    },
    {
        id: 2,
        name: 'Abderrahman Aouinat',
        roleKey: 'member2_role',
        descKey: 'member2_desc',
        img: '/team/abderrahman-aouinat.png',
        color: 'bg-[#52d4a0]',
        rot: '1.5deg',
        pattern: 'diagonal' as const,
        socials: { facebook: '', twitter: '', linkedin: '' },
    },
    {
        id: 3,
        name: 'Mouhamed El Wardi',
        roleKey: 'member3_role',
        descKey: 'member3_desc',
        img: '/team/mouhamed-el-wardi.png',
        color: 'bg-white',
        rot: '-1.0deg',
        pattern: 'coral' as const,
        socials: { facebook: '', twitter: '', linkedin: '' },
    },
    {
        id: 4,
        name: 'Ayman Nouri',
        roleKey: 'member4_role',
        descKey: 'member4_desc',
        img: '/team/ayman-nouri.png',
        color: 'bg-[#c8eeda]',
        rot: '2.9deg',
        pattern: 'diagonal' as const,
        socials: { facebook: '', twitter: '', linkedin: '' },
    },
    {
        id: 5,
        name: 'Asmae Monaghim',
        roleKey: 'member5_role',
        descKey: 'member5_desc',
        img: '/team/asmae-monaghim.png',
        color: 'bg-[#4a7a5a]',
        rot: '-0.8deg',
        darkInfo: true,
        pattern: 'dots' as const,
        socials: { facebook: '', twitter: '', linkedin: '' },
    },
    {
        id: 6,
        name: 'Safae El Oujdi',
        roleKey: 'member6_role',
        descKey: 'member6_desc',
        img: '/team/safae-el-oujdi.png',
        color: 'bg-[#d8ead2]',
        rot: '1.2deg',
        pattern: 'coral' as const,
        socials: { facebook: '', twitter: '', linkedin: '' },
    },
] as const;

// ── External Links ───────────────────────────────────────────────────────────
export const LINKS = {
    appStoreIos: '',      // add App Store link when ready
    appStoreAndroid: '',  // add Play Store link when ready
    appApk: '',           // add direct APK download link
} as const;
