"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Cookie, Scale, Mail, Phone, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { useLocale } from "next-intl";

const LAST_UPDATED = "08/05/2026";

type Section = { title: string; paragraphs: string[]; bullets: string[] | null };

const CONTENT: Record<string, {
  badge: string; title: string; updated: string; intro: string;
  inquiriesTitle: string; inquiriesDesc: string; inquiriesNote: string;
  alsoRead: string; termsLabel: string; cookiesLabel: string;
  ctaQ: string; ctaTitle: string; ctaBtn: string;
  sections: Section[];
}> = {
  en: {
    badge: "Legal", title: "Privacy Policy", updated: "Last updated:",
    intro: "This Privacy Policy explains how Udarsy collects, uses, and protects your personal information. We are committed to handling your data transparently and in accordance with Moroccan data protection law (Law No. 09-08) and international best practices.",
    inquiriesTitle: "Privacy Inquiries",
    inquiriesDesc: "To exercise any of your rights, request data deletion, or ask questions about how we handle your personal information, contact us at:",
    inquiriesNote: "We aim to respond to all privacy-related inquiries within 5 business days.",
    alsoRead: "Also read our other legal documents:",
    termsLabel: "Terms", cookiesLabel: "Cookies",
    ctaQ: "Have a question about your data?", ctaTitle: "We take privacy seriously.", ctaBtn: "Contact Us",
    sections: [
      { title: "Information We Collect", paragraphs: ["We collect information you provide directly when you create an account: your display name, email address, and profile photo. When you sign in with Google, we receive only the basic profile data you have authorized — your name, email address, and profile picture. We do not access your Google Drive, Gmail, contacts, or any other Google services beyond the profile scope.", "We also collect information about how you use the platform: lessons accessed, time spent learning, quiz results, progress milestones, favorite content, and contributions submitted.", "We may automatically collect technical data such as your IP address, browser type, device type, operating system, and general usage patterns through cookies and similar technologies."], bullets: null },
      { title: "How We Use Your Information", paragraphs: ["We use the information we collect solely to:"], bullets: ["Create and maintain your account and authenticate your identity", "Deliver, operate, and continuously improve the Udarsy learning platform", "Personalize your learning experience, recommendations, and curriculum path", "Track your academic progress, streaks, and completed lessons", "Send important service communications — account confirmations, security alerts, and product updates", "Process and manage your subscription plan (Free, Pro, or Premium)", "Enforce our Terms of Service and protect the safety of all users", "Comply with applicable Moroccan law and legal obligations"] },
      { title: "Google API Services", paragraphs: ["Udarsy uses Google OAuth 2.0 solely for account authentication. When you choose 'Sign in with Google', we request only the minimum scopes necessary: your name, email address, and profile picture.", "We do not use your Google data for any purpose beyond signing you in and populating your profile. We do not share, sell, or transfer any Google user data to third parties. Google user data is not used for advertising, profiling, or any purpose not disclosed in this Privacy Policy.", "Udarsy's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements."], bullets: null },
      { title: "Sharing Your Information", paragraphs: ["We do not sell, rent, or trade your personal information to any third party under any circumstances.", "We may share your data only in the following limited situations:"], bullets: ["With infrastructure service providers (hosting, database) who process data on our behalf and are bound by strict data processing agreements", "With law enforcement or government authorities when required by Moroccan law or a valid legal request", "With your explicit consent, for any purpose you specifically authorize"] },
      { title: "Data Retention", paragraphs: ["We retain your personal data for as long as your account is active or as needed to provide the service. If you delete your account, your personal data will be permanently removed within 30 days, except where retention is required by Moroccan law (e.g., financial transaction records).", "Anonymized and aggregated usage statistics — which cannot be linked back to you — may be retained indefinitely for platform improvement purposes."], bullets: null },
      { title: "Security", paragraphs: ["We implement industry-standard technical and organizational measures to protect your personal information:"], bullets: ["HTTPS/TLS encryption for all data in transit", "bcrypt hashing for password storage — we never store plaintext passwords", "JWT-based access and refresh token authentication with short expiry windows", "Strict role-based access controls limiting who can access user data internally", "Regular security reviews and dependency audits"] },
      { title: "Children's Privacy", paragraphs: ["Udarsy is an educational platform designed for Moroccan students including secondary school and BAC-prep students. We take children's privacy seriously.", "For users under the age of 13, we require verifiable parental or guardian consent before collecting any personal information. If we become aware that we have collected data from a child under 13 without such consent, we will delete it promptly. Parents may contact us at the address below to request deletion."], bullets: null },
      { title: "Your Rights", paragraphs: ["In accordance with Moroccan data protection law (Law No. 09-08) and international best practices, you have the following rights regarding your personal data:"], bullets: ["Access — request a copy of all personal data we hold about you", "Correction — request correction of any inaccurate or incomplete data", "Deletion — request permanent deletion of your account and associated data", "Objection — object to the processing of your data for specific purposes", "Portability — receive your data in a structured, machine-readable format", "Withdraw consent — revoke Google OAuth access at any time via your Google account settings"] },
      { title: "Cookies", paragraphs: ["We use cookies to keep you signed in, remember your language and preferences, and analyze how the platform is used. We do not use advertising or tracking cookies.", "For a full breakdown of every cookie type we use and how to manage them, please read our Cookie Policy."], bullets: null },
      { title: "Changes to This Policy", paragraphs: ["We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the platform at least 14 days before they take effect.", "The 'Last Updated' date at the top of this page always reflects the most recent revision. Continued use of the platform after changes take effect constitutes acceptance of the updated policy."], bullets: null },
    ],
  },
  fr: {
    badge: "Juridique", title: "Politique de confidentialité", updated: "Dernière mise à jour :",
    intro: "Cette politique de confidentialité explique comment Udarsy collecte, utilise et protège vos informations personnelles. Nous nous engageons à traiter vos données de manière transparente, conformément à la loi marocaine sur la protection des données (Loi n° 09-08) et aux meilleures pratiques internationales.",
    inquiriesTitle: "Demandes relatives à la confidentialité",
    inquiriesDesc: "Pour exercer l'un de vos droits, demander la suppression de vos données ou poser des questions sur la façon dont nous traitons vos informations personnelles, contactez-nous à :",
    inquiriesNote: "Nous nous efforçons de répondre à toutes les demandes liées à la confidentialité dans un délai de 5 jours ouvrables.",
    alsoRead: "Consultez également nos autres documents juridiques :",
    termsLabel: "CGU", cookiesLabel: "Cookies",
    ctaQ: "Une question sur vos données ?", ctaTitle: "Nous prenons la vie privée au sérieux.", ctaBtn: "Nous contacter",
    sections: [
      { title: "Informations que nous collectons", paragraphs: ["Nous collectons les informations que vous fournissez directement lors de la création d'un compte : votre nom d'affichage, votre adresse e-mail et votre photo de profil. Lorsque vous vous connectez avec Google, nous ne recevons que les données de profil de base que vous avez autorisées — votre nom, votre adresse e-mail et votre photo de profil. Nous n'accédons pas à votre Google Drive, Gmail, vos contacts ou tout autre service Google au-delà de la portée du profil.", "Nous collectons également des informations sur la façon dont vous utilisez la plateforme : leçons consultées, temps passé à apprendre, résultats de quiz, jalons de progression, contenus favoris et contributions soumises.", "Nous pouvons collecter automatiquement des données techniques telles que votre adresse IP, le type de navigateur, le type d'appareil, le système d'exploitation et les modèles d'utilisation générale via des cookies et des technologies similaires."], bullets: null },
      { title: "Comment nous utilisons vos informations", paragraphs: ["Nous utilisons les informations collectées uniquement pour :"], bullets: ["Créer et maintenir votre compte et authentifier votre identité", "Fournir, exploiter et améliorer continuellement la plateforme d'apprentissage Udarsy", "Personnaliser votre expérience d'apprentissage, vos recommandations et votre parcours pédagogique", "Suivre vos progrès académiques, séries et leçons complétées", "Envoyer des communications importantes sur le service — confirmations de compte, alertes de sécurité et mises à jour produit", "Traiter et gérer votre abonnement (Gratuit, Pro ou Premium)", "Faire respecter nos Conditions d'utilisation et protéger la sécurité de tous les utilisateurs", "Se conformer à la législation marocaine applicable et aux obligations légales"] },
      { title: "Services API Google", paragraphs: ["Udarsy utilise Google OAuth 2.0 uniquement pour l'authentification des comptes. Lorsque vous choisissez « Se connecter avec Google », nous demandons uniquement les autorisations minimales nécessaires : votre nom, votre adresse e-mail et votre photo de profil.", "Nous n'utilisons pas vos données Google à des fins autres que votre connexion et la complétion de votre profil. Nous ne partageons, ne vendons ni ne transférons aucune donnée utilisateur Google à des tiers. Les données utilisateur Google ne sont pas utilisées à des fins publicitaires, de profilage ou à toute fin non divulguée dans cette politique.", "L'utilisation par Udarsy des informations reçues des API Google est conforme à la Politique relative aux données utilisateur des services API Google, y compris les exigences d'utilisation limitée."], bullets: null },
      { title: "Partage de vos informations", paragraphs: ["Nous ne vendons, ne louons ni n'échangeons vos informations personnelles à des tiers en aucune circonstance.", "Nous pouvons partager vos données uniquement dans les situations limitées suivantes :"], bullets: ["Avec des fournisseurs d'infrastructure (hébergement, base de données) qui traitent les données en notre nom et sont liés par des accords stricts de traitement des données", "Avec les forces de l'ordre ou les autorités gouvernementales lorsque la loi marocaine ou une demande légale valide l'exige", "Avec votre consentement explicite, pour tout usage que vous autorisez spécifiquement"] },
      { title: "Conservation des données", paragraphs: ["Nous conservons vos données personnelles aussi longtemps que votre compte est actif ou selon les besoins pour fournir le service. Si vous supprimez votre compte, vos données personnelles seront définitivement supprimées dans les 30 jours, sauf si la conservation est requise par la loi marocaine (ex. : registres de transactions financières).", "Les statistiques d'utilisation anonymisées et agrégées — qui ne peuvent pas être reliées à vous — peuvent être conservées indéfiniment à des fins d'amélioration de la plateforme."], bullets: null },
      { title: "Sécurité", paragraphs: ["Nous mettons en œuvre des mesures techniques et organisationnelles conformes aux standards du secteur pour protéger vos informations personnelles :"], bullets: ["Chiffrement HTTPS/TLS pour toutes les données en transit", "Hachage bcrypt pour le stockage des mots de passe — nous ne stockons jamais les mots de passe en clair", "Authentification par jetons d'accès et de rafraîchissement JWT avec de courtes fenêtres d'expiration", "Contrôles d'accès stricts basés sur les rôles limitant l'accès interne aux données utilisateur", "Révisions de sécurité régulières et audits des dépendances"] },
      { title: "Confidentialité des enfants", paragraphs: ["Udarsy est une plateforme éducative conçue pour les élèves marocains, y compris les élèves du secondaire et les préparationnaires au BAC. Nous prenons très au sérieux la confidentialité des enfants.", "Pour les utilisateurs de moins de 13 ans, nous exigeons le consentement vérifiable d'un parent ou tuteur avant de collecter toute information personnelle. Si nous apprenons que nous avons collecté des données d'un enfant de moins de 13 ans sans ce consentement, nous les supprimerons rapidement. Les parents peuvent nous contacter à l'adresse ci-dessous pour demander la suppression."], bullets: null },
      { title: "Vos droits", paragraphs: ["Conformément à la loi marocaine sur la protection des données (Loi n° 09-08) et aux meilleures pratiques internationales, vous disposez des droits suivants concernant vos données personnelles :"], bullets: ["Accès — demander une copie de toutes les données personnelles que nous détenons sur vous", "Rectification — demander la correction de données inexactes ou incomplètes", "Suppression — demander la suppression définitive de votre compte et des données associées", "Opposition — vous opposer au traitement de vos données à des fins spécifiques", "Portabilité — recevoir vos données dans un format structuré et lisible par machine", "Retrait du consentement — révoquer l'accès Google OAuth à tout moment via les paramètres de votre compte Google"] },
      { title: "Cookies", paragraphs: ["Nous utilisons des cookies pour vous maintenir connecté, mémoriser votre langue et vos préférences, et analyser l'utilisation de la plateforme. Nous n'utilisons pas de cookies publicitaires ou de suivi.", "Pour un aperçu complet de chaque type de cookie que nous utilisons et de la façon de les gérer, veuillez lire notre Politique en matière de cookies."], bullets: null },
      { title: "Modifications de cette politique", paragraphs: ["Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons des changements significatifs par e-mail ou via un avis visible sur la plateforme au moins 14 jours avant leur entrée en vigueur.", "La date de « Dernière mise à jour » en haut de cette page reflète toujours la révision la plus récente. L'utilisation continue de la plateforme après l'entrée en vigueur des modifications constitue une acceptation de la politique mise à jour."], bullets: null },
    ],
  },
  ar: {
    badge: "قانوني", title: "سياسة الخصوصية", updated: "آخر تحديث:",
    intro: "تشرح سياسة الخصوصية هذه كيفية جمع يودرسي لمعلوماتك الشخصية واستخدامها وحمايتها. نحن ملتزمون بالتعامل مع بياناتك بشفافية وفقاً لقانون حماية البيانات المغربي (القانون رقم 09-08) وأفضل الممارسات الدولية.",
    inquiriesTitle: "استفسارات الخصوصية",
    inquiriesDesc: "لممارسة أي من حقوقك، أو طلب حذف البيانات، أو طرح أسئلة حول كيفية تعاملنا مع معلوماتك الشخصية، تواصل معنا على:",
    inquiriesNote: "نهدف إلى الرد على جميع استفسارات الخصوصية في غضون 5 أيام عمل.",
    alsoRead: "اقرأ أيضاً وثائقنا القانونية الأخرى:",
    termsLabel: "شروط الاستخدام", cookiesLabel: "ملفات تعريف الارتباط",
    ctaQ: "هل لديك سؤال حول بياناتك؟", ctaTitle: "نحن نأخذ الخصوصية على محمل الجد.", ctaBtn: "تواصل معنا",
    sections: [
      { title: "المعلومات التي نجمعها", paragraphs: ["نجمع المعلومات التي تقدمها مباشرةً عند إنشاء حساب: اسمك المعروض وعنوان بريدك الإلكتروني وصورة ملفك الشخصي. عند تسجيل الدخول بواسطة Google، نتلقى فقط بيانات الملف الشخصي الأساسية التي أذنت بها — اسمك وعنوان بريدك الإلكتروني وصورتك الشخصية. نحن لا نصل إلى Google Drive أو Gmail أو جهات الاتصال أو أي خدمات Google أخرى خارج نطاق الملف الشخصي.", "نجمع أيضاً معلومات حول كيفية استخدامك للمنصة: الدروس التي تم الوصول إليها، والوقت المستغرق في التعلم، ونتائج الاختبارات، وإنجازات التقدم، والمحتوى المفضل، والمساهمات المقدمة.", "قد نجمع تلقائياً بيانات تقنية مثل عنوان IP الخاص بك، ونوع المتصفح، ونوع الجهاز، ونظام التشغيل، وأنماط الاستخدام العامة من خلال ملفات تعريف الارتباط والتقنيات المماثلة."], bullets: null },
      { title: "كيف نستخدم معلوماتك", paragraphs: ["نستخدم المعلومات التي نجمعها حصراً من أجل:"], bullets: ["إنشاء حسابك والحفاظ عليه وإثبات هويتك", "توفير منصة يودرسي التعليمية وتشغيلها وتحسينها باستمرار", "تخصيص تجربة التعلم والتوصيات والمسار الدراسي الخاص بك", "تتبع تقدمك الأكاديمي وسلاسل التعلم والدروس المكتملة", "إرسال اتصالات مهمة تتعلق بالخدمة — تأكيدات الحساب وتنبيهات الأمان وتحديثات المنتج", "معالجة خطة اشتراكك (المجاني أو Pro أو Premium) وإدارتها", "تطبيق شروط الخدمة وحماية سلامة جميع المستخدمين", "الامتثال للقانون المغربي المعمول به والالتزامات القانونية"] },
      { title: "خدمات API من Google", paragraphs: ["تستخدم يودرسي Google OAuth 2.0 حصراً لمصادقة الحساب. عند اختيار 'تسجيل الدخول بـ Google'، نطلب الحد الأدنى الضروري من الأذونات: اسمك وعنوان بريدك الإلكتروني وصورتك الشخصية.", "لا نستخدم بيانات Google الخاصة بك لأي غرض سوى تسجيل دخولك وتعبئة ملفك الشخصي. نحن لا نشارك أو نبيع أو ننقل أي بيانات مستخدم Google إلى أطراف ثالثة. لا تُستخدم بيانات مستخدم Google للإعلانات أو التنميط أو أي غرض غير مُفصَح عنه في هذه السياسة.", "يلتزم استخدام يودرسي للمعلومات المتلقاة من واجهات برمجة تطبيقات Google بسياسة بيانات مستخدم خدمات API من Google، بما في ذلك متطلبات الاستخدام المحدود."], bullets: null },
      { title: "مشاركة معلوماتك", paragraphs: ["لا نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية لأي طرف ثالث تحت أي ظرف.", "قد نشارك بياناتك فقط في الحالات المحدودة التالية:"], bullets: ["مع مزودي البنية التحتية (الاستضافة، قاعدة البيانات) الذين يعالجون البيانات نيابةً عنا والملتزمين باتفاقيات معالجة بيانات صارمة", "مع جهات إنفاذ القانون أو الجهات الحكومية عندما يقتضي القانون المغربي أو طلب قانوني صحيح ذلك", "بموافقتك الصريحة، لأي غرض تفوض به تحديداً"] },
      { title: "الاحتفاظ بالبيانات", paragraphs: ["نحتفظ ببياناتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمة. إذا حذفت حسابك، ستتم إزالة بياناتك الشخصية بشكل دائم في غضون 30 يوماً، باستثناء حالات الاحتفاظ التي يفرضها القانون المغربي (مثل: سجلات المعاملات المالية).", "يجوز الاحتفاظ بإحصائيات الاستخدام المجهولة والمجمعة — التي لا يمكن ربطها بك — إلى أجل غير مسمى لأغراض تحسين المنصة."], bullets: null },
      { title: "الأمان", paragraphs: ["ننفذ تدابير تقنية وتنظيمية وفقاً لمعايير الصناعة لحماية معلوماتك الشخصية:"], bullets: ["تشفير HTTPS/TLS لجميع البيانات أثناء النقل", "تجزئة bcrypt لتخزين كلمات المرور — لا نخزن كلمات المرور أبداً بنص واضح", "مصادقة رمز الوصول والتحديث المستندة إلى JWT مع فترات انتهاء صلاحية قصيرة", "ضوابط وصول صارمة قائمة على الأدوار تحد من من يمكنه الوصول إلى بيانات المستخدم داخلياً", "مراجعات أمنية منتظمة وتدقيق التبعيات"] },
      { title: "خصوصية الأطفال", paragraphs: ["يودرسي منصة تعليمية مصممة للطلاب المغاربة بما في ذلك طلاب المرحلة الثانوية والمستعدين للبكالوريا. نحن نأخذ خصوصية الأطفال على محمل الجد.", "للمستخدمين دون سن 13 عاماً، نشترط موافقة أحد الوالدين أو الولي القابلة للتحقق قبل جمع أي معلومات شخصية. إذا اكتشفنا أننا جمعنا بيانات طفل دون 13 عاماً بدون هذه الموافقة، سنحذفها فوراً. يجوز للوالدين الاتصال بنا على العنوان أدناه لطلب الحذف."], bullets: null },
      { title: "حقوقك", paragraphs: ["وفقاً لقانون حماية البيانات المغربي (القانون رقم 09-08) وأفضل الممارسات الدولية، لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:"], bullets: ["الوصول — طلب نسخة من جميع البيانات الشخصية التي نحتفظ بها عنك", "التصحيح — طلب تصحيح أي بيانات غير دقيقة أو غير مكتملة", "الحذف — طلب الحذف الدائم لحسابك والبيانات المرتبطة به", "الاعتراض — الاعتراض على معالجة بياناتك لأغراض محددة", "قابلية النقل — استلام بياناتك بتنسيق منظم وقابل للقراءة آلياً", "سحب الموافقة — إلغاء وصول Google OAuth في أي وقت عبر إعدادات حساب Google الخاص بك"] },
      { title: "ملفات تعريف الارتباط", paragraphs: ["نستخدم ملفات تعريف الارتباط لإبقائك مسجلاً للدخول، وتذكر لغتك وتفضيلاتك، وتحليل كيفية استخدام المنصة. لا نستخدم ملفات تعريف الارتباط الإعلانية أو التتبعية.", "للاطلاع على تفصيل كامل لكل نوع من ملفات تعريف الارتباط التي نستخدمها وكيفية إدارتها، يرجى قراءة سياسة ملفات تعريف الارتباط الخاصة بنا."], bullets: null },
      { title: "تغييرات هذه السياسة", paragraphs: ["قد نحدّث سياسة الخصوصية هذه دورياً. سنخطرك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على المنصة قبل 14 يوماً على الأقل من دخولها حيز التنفيذ.", "يعكس تاريخ 'آخر تحديث' في أعلى هذه الصفحة دائماً المراجعة الأخيرة. استمرار استخدام المنصة بعد دخول التغييرات حيز التنفيذ يُعدّ قبولاً للسياسة المحدّثة."], bullets: null },
    ],
  },
};

export default function PrivacyPage() {
  const locale = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;
  const isRTL = locale === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#e4e8e3] pt-20 md:pt-32 pb-24 px-[clamp(16px,6vw,80px)]">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3aaa6a]/10 text-[#3aaa6a] text-xs font-black tracking-widest uppercase">
            <Shield size={14} />
            {c.badge}
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1a3a2a]">
            {c.title}
          </h1>
          <p className="text-[#1a3a2a]/50 text-sm">{c.updated} {LAST_UPDATED}</p>
          <div
            className={`max-w-2xl mx-auto ${isRTL ? "text-right" : "text-left"} p-6 rounded-[24px]`}
            style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
          >
            <p className="text-sm text-[#1a3a2a]/65 leading-relaxed">{c.intro}</p>
          </div>
        </motion.div>

        <div className="space-y-5">
          {c.sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.025, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
              <div
                className="relative overflow-hidden rounded-[18px] bg-white group"
                style={{ border: "1.5px solid rgba(58,170,106,0.11)", boxShadow: "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)", transition: "border-color 0.28s ease, box-shadow 0.28s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(58,170,106,0.35)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(58,170,106,0.14), 0 3px 10px rgba(58,170,106,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(58,170,106,0.11)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)"; }}
              >
                <div className="absolute top-0 left-0 w-1/2 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms]" style={{ background: "linear-gradient(90deg, #3aaa6a, #5dc98a)", transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)" }} />
                <div className="absolute top-0 right-0 w-1/2 h-[3px] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms]" style={{ background: "linear-gradient(90deg, #5dc98a, #3aaa6a)", transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)" }} />
                <div className="p-7 md:p-8 space-y-4">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-black text-[#3aaa6a]" style={{ background: "rgba(58,170,106,0.10)" }}>{i + 1}</span>
                    <h2 className={`text-lg md:text-xl font-black text-[#1a3a2a] leading-tight mt-1 ${isRTL ? "text-right" : "text-left"}`}>{section.title}</h2>
                  </div>
                  <div className={`${isRTL ? "pr-[52px]" : "pl-[52px]"} space-y-3`}>
                    {section.paragraphs.map((p, pi) => (
                      <p key={pi} className={`text-sm text-[#1a3a2a]/65 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>{p}</p>
                    ))}
                    {section.bullets && (
                      <ul className="space-y-2 mt-1">
                        {section.bullets.map((b, bi) => (
                          <li key={bi} className={`flex items-start gap-2.5 text-sm text-[#1a3a2a]/65 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                            <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#3aaa6a" }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="mt-5 rounded-[18px] p-7 md:p-8" style={{ background: "rgba(58,170,106,0.05)", border: "1.5px solid rgba(58,170,106,0.15)" }}>
          <p className={`text-xs font-black uppercase tracking-widest text-[#3aaa6a] mb-4 ${isRTL ? "text-right" : ""}`}>{c.inquiriesTitle}</p>
          <p className={`text-sm text-[#1a3a2a]/60 mb-4 leading-relaxed ${isRTL ? "text-right" : ""}`}>{c.inquiriesDesc}</p>
          <div className="space-y-3">
            <a href={`mailto:${CONTACT.email}`} className={`flex items-center gap-3 text-sm text-[#1a3a2a]/70 hover:text-[#3aaa6a] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}><Mail size={15} className="shrink-0 text-[#3aaa6a]" />{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phoneTel}`} className={`flex items-center gap-3 text-sm text-[#1a3a2a]/70 hover:text-[#3aaa6a] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}><Phone size={15} className="shrink-0 text-[#3aaa6a]" />{CONTACT.phone}</a>
            <div className={`flex items-center gap-3 text-sm text-[#1a3a2a]/70 ${isRTL ? "flex-row-reverse" : ""}`}><MapPin size={15} className="shrink-0 text-[#3aaa6a]" />{CONTACT.location}</div>
          </div>
          <p className={`text-xs text-[#1a3a2a]/40 mt-4 ${isRTL ? "text-right" : ""}`}>{c.inquiriesNote}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className={`mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[18px] p-6 bg-white ${isRTL ? "sm:flex-row-reverse" : ""}`} style={{ border: "1.5px solid rgba(58,170,106,0.11)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <p className="text-sm text-[#1a3a2a]/60">{c.alsoRead}</p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] hover:bg-[#3aaa6a]/10 transition-colors" style={{ background: "rgba(58,170,106,0.07)", border: "1.5px solid rgba(58,170,106,0.18)" }}><Scale size={14} />{c.termsLabel}</Link>
            <Link href="/cookies" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] hover:bg-[#3aaa6a]/10 transition-colors" style={{ background: "rgba(58,170,106,0.07)", border: "1.5px solid rgba(58,170,106,0.18)" }}><Cookie size={14} />{c.cookiesLabel}</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="mt-5 rounded-[24px] p-8 text-center overflow-hidden relative" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px), linear-gradient(135deg, #1e7a46 0%, #0f4428 100%)" }}>
          <p className="text-white/70 text-sm mb-2">{c.ctaQ}</p>
          <h3 className="text-white font-black text-xl mb-5">{c.ctaTitle}</h3>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.04em", color: "#1a6b3a", background: "#ffffff", borderRadius: "999px", padding: "7px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)", textDecoration: "none" }}>
            {c.ctaBtn}
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
