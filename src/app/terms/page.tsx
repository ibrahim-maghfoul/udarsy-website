"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scale, Cookie, Mail, MapPin, Phone, Shield } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { useLocale } from "next-intl";

const LAST_UPDATED = "08/05/2026";

type Section = { title: string; paragraphs: string[]; bullets: string[] | null };

const CONTENT: Record<string, {
  badge: string; title: string; updated: string; intro: string;
  contactTitle: string; alsoRead: string; cookiesLabel: string; privacyLabel: string;
  ctaQ: string; ctaTitle: string; ctaBtn: string;
  sections: Section[];
}> = {
  en: {
    badge: "Legal", title: "Terms of Service", updated: "Last updated:",
    intro: "These Terms of Service outline the rules and regulations for using the Udarsy educational platform. Please read them carefully before creating an account or accessing any content.",
    contactTitle: "Contact Us", alsoRead: "Also read our other legal documents:", cookiesLabel: "Cookie Policy", privacyLabel: "Privacy",
    ctaQ: "Have a question about our terms?", ctaTitle: "We're here to help.", ctaBtn: "Contact Support",
    sections: [
      { title: "Acceptance of Terms", paragraphs: ["By accessing or using the Udarsy platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the service.", "These terms apply to all users including students, teachers, instructors, and visitors. Use of the service by minors under 13 requires verifiable parental or guardian consent."], bullets: null },
      { title: "User Accounts", paragraphs: ["You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access.", "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to other users."], bullets: null },
      { title: "Subscription Plans & Payments", paragraphs: ["Udarsy offers three subscription tiers priced in Moroccan Dirhams (MAD). All prices include applicable taxes."], bullets: ["Free Plan (0 MAD) — basic lessons, 10 offline downloads per month", "Pro Plan — 199 MAD/month or 1,910 MAD/year — premium lessons, ad-free experience, 100 downloads", "Premium Plan — 299 MAD/month or 2,870 MAD/year — full access, unlimited downloads, priority support"] },
      { title: "Refund Policy", paragraphs: ["Subscription fees are generally non-refundable. Exceptions apply where required by Moroccan consumer protection law (Law No. 31-08). If you believe you are entitled to a refund, contact our support team within 7 days of the charge.", "Udarsy reserves the right to issue refunds or credits at its sole discretion for service interruptions or billing errors."], bullets: null },
      { title: "Content & Intellectual Property", paragraphs: ["All platform content — lessons, videos, PDFs, exercises, and exams — is owned by Udarsy or licensed from content partners. Unauthorized reproduction, redistribution, or public display is strictly prohibited.", "User-submitted contributions remain the intellectual property of the contributor. By submitting content you grant Udarsy a worldwide, non-exclusive, royalty-free license to display and distribute that content on the platform."], bullets: null },
      { title: "Acceptable Use", paragraphs: ["By using Udarsy you agree not to:"], bullets: ["Violate any applicable Moroccan law or regulation", "Upload content that is harmful, defamatory, obscene, or infringes third-party rights", "Attempt unauthorized access to any part of the platform or its infrastructure", "Use automated tools to scrape or harvest platform content", "Impersonate another user, teacher, instructor, or Udarsy staff member", "Share or sell account credentials to circumvent subscription restrictions"] },
      { title: "Teacher & Instructor Obligations", paragraphs: ["Teachers and instructors must provide accurate, truthful information during the application and verification process. Submitting false credentials is grounds for immediate termination and may be reported to relevant Moroccan authorities.", "Teachers are solely responsible for the accuracy and appropriateness of educational content shared within their classroom rooms."], bullets: null },
      { title: "Limitation of Liability", paragraphs: ["To the maximum extent permitted by Moroccan law, Udarsy and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.", "Our total liability for any claim arising from these terms shall not exceed the total fees you paid Udarsy during the 12 months preceding the claim."], bullets: null },
      { title: "Changes to These Terms", paragraphs: ["We may update these Terms of Service periodically. We will notify users of significant changes via email or a prominent notice on the platform at least 14 days before they take effect.", "Continued use of the platform after changes take effect constitutes acceptance of the revised terms."], bullets: null },
      { title: "Governing Law", paragraphs: ["These Terms are governed by the laws of the Kingdom of Morocco. Any disputes arising from or relating to these Terms shall be resolved in the competent courts of Rabat, Morocco.", "We encourage users to contact our support team before initiating any legal proceedings — most issues can be resolved quickly and amicably."], bullets: null },
    ],
  },
  fr: {
    badge: "Juridique", title: "Conditions d'utilisation", updated: "Dernière mise à jour :",
    intro: "Ces Conditions d'utilisation décrivent les règles et réglementations applicables à l'utilisation de la plateforme éducative Udarsy. Veuillez les lire attentivement avant de créer un compte ou d'accéder à tout contenu.",
    contactTitle: "Nous contacter", alsoRead: "Consultez également nos autres documents juridiques :", cookiesLabel: "Politique Cookies", privacyLabel: "Confidentialité",
    ctaQ: "Une question sur nos conditions ?", ctaTitle: "Nous sommes là pour vous aider.", ctaBtn: "Contacter le support",
    sections: [
      { title: "Acceptation des conditions", paragraphs: ["En accédant à la plateforme Udarsy ou en l'utilisant, vous acceptez d'être lié par ces Conditions d'utilisation. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne pouvez pas utiliser le service.", "Ces conditions s'appliquent à tous les utilisateurs, y compris les étudiants, les enseignants, les instructeurs et les visiteurs. L'utilisation du service par des mineurs de moins de 13 ans nécessite le consentement vérifiable d'un parent ou tuteur."], bullets: null },
      { title: "Comptes utilisateurs", paragraphs: ["Vous êtes responsable du maintien de la confidentialité de vos identifiants de connexion et de toutes les activités qui se déroulent sous votre compte. Informez-nous immédiatement de tout accès non autorisé.", "Nous nous réservons le droit de suspendre ou de résilier les comptes qui violent ces conditions, s'engagent dans des activités frauduleuses ou présentent un risque pour d'autres utilisateurs."], bullets: null },
      { title: "Plans d'abonnement & paiements", paragraphs: ["Udarsy propose trois niveaux d'abonnement en Dirhams marocains (MAD). Tous les prix incluent les taxes applicables."], bullets: ["Plan Gratuit (0 MAD) — leçons de base, 10 téléchargements hors ligne par mois", "Plan Pro — 199 MAD/mois ou 1 910 MAD/an — leçons premium, expérience sans publicité, 100 téléchargements", "Plan Premium — 299 MAD/mois ou 2 870 MAD/an — accès complet, téléchargements illimités, support prioritaire"] },
      { title: "Politique de remboursement", paragraphs: ["Les frais d'abonnement sont généralement non remboursables. Des exceptions s'appliquent lorsque la loi marocaine sur la protection des consommateurs (Loi n° 31-08) l'exige. Si vous pensez avoir droit à un remboursement, contactez notre équipe d'assistance dans les 7 jours suivant le débit.", "Udarsy se réserve le droit d'accorder des remboursements ou des crédits à sa seule discrétion pour les interruptions de service ou les erreurs de facturation."], bullets: null },
      { title: "Contenu & propriété intellectuelle", paragraphs: ["Tout le contenu de la plateforme — leçons, vidéos, PDF, exercices et examens — est la propriété d'Udarsy ou est sous licence de partenaires de contenu. Toute reproduction, redistribution ou affichage public non autorisé est strictement interdit.", "Les contributions soumises par les utilisateurs restent la propriété intellectuelle du contributeur. En soumettant du contenu, vous accordez à Udarsy une licence mondiale, non exclusive et libre de droits pour afficher et distribuer ce contenu sur la plateforme."], bullets: null },
      { title: "Utilisation acceptable", paragraphs: ["En utilisant Udarsy, vous acceptez de ne pas :"], bullets: ["Violer toute loi ou réglementation marocaine applicable", "Télécharger du contenu nuisible, diffamatoire, obscène ou portant atteinte aux droits de tiers", "Tenter un accès non autorisé à toute partie de la plateforme ou de son infrastructure", "Utiliser des outils automatisés pour scraper ou récolter le contenu de la plateforme", "Usurper l'identité d'un autre utilisateur, enseignant, instructeur ou membre du personnel Udarsy", "Partager ou vendre des identifiants de compte pour contourner les restrictions d'abonnement"] },
      { title: "Obligations des enseignants & instructeurs", paragraphs: ["Les enseignants et instructeurs doivent fournir des informations exactes et véridiques lors du processus de candidature et de vérification. La soumission de fausses informations d'identification constitue un motif de résiliation immédiate et peut être signalée aux autorités marocaines compétentes.", "Les enseignants sont seuls responsables de l'exactitude et du caractère approprié du contenu éducatif partagé dans leurs salles de classe."], bullets: null },
      { title: "Limitation de responsabilité", paragraphs: ["Dans la mesure maximale permise par la loi marocaine, Udarsy et ses affiliés ne seront pas responsables des dommages indirects, accessoires, spéciaux ou consécutifs découlant de votre utilisation de la plateforme.", "Notre responsabilité totale pour toute réclamation découlant de ces conditions ne dépassera pas les frais totaux que vous avez payés à Udarsy au cours des 12 mois précédant la réclamation."], bullets: null },
      { title: "Modifications de ces conditions", paragraphs: ["Nous pouvons mettre à jour ces Conditions d'utilisation périodiquement. Nous informerons les utilisateurs des changements significatifs par e-mail ou via un avis visible sur la plateforme au moins 14 jours avant leur entrée en vigueur.", "L'utilisation continue de la plateforme après l'entrée en vigueur des modifications constitue une acceptation des conditions révisées."], bullets: null },
      { title: "Droit applicable", paragraphs: ["Ces Conditions sont régies par les lois du Royaume du Maroc. Tout litige découlant de ces Conditions ou s'y rapportant sera résolu devant les tribunaux compétents de Rabat, Maroc.", "Nous encourageons les utilisateurs à contacter notre équipe d'assistance avant d'engager toute procédure judiciaire — la plupart des problèmes peuvent être résolus rapidement et à l'amiable."], bullets: null },
    ],
  },
  ar: {
    badge: "قانوني", title: "شروط الاستخدام", updated: "آخر تحديث:",
    intro: "تحدد شروط الاستخدام هذه القواعد والأنظمة المتعلقة باستخدام منصة يودرسي التعليمية. يُرجى قراءتها بعناية قبل إنشاء حساب أو الوصول إلى أي محتوى.",
    contactTitle: "تواصل معنا", alsoRead: "اقرأ أيضاً وثائقنا القانونية الأخرى:", cookiesLabel: "سياسة الكوكيز", privacyLabel: "الخصوصية",
    ctaQ: "هل لديك سؤال حول شروطنا؟", ctaTitle: "نحن هنا للمساعدة.", ctaBtn: "تواصل مع الدعم",
    sections: [
      { title: "قبول الشروط", paragraphs: ["بالوصول إلى منصة يودرسي أو استخدامها، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجوز لك استخدام الخدمة.", "تنطبق هذه الشروط على جميع المستخدمين بما فيهم الطلاب والمعلمون والمحاضرون والزوار. يتطلب استخدام الخدمة من قبل القاصرين دون سن 13 موافقة أحد الوالدين أو الولي القابلة للتحقق."], bullets: null },
      { title: "حسابات المستخدمين", paragraphs: ["أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك وعن جميع الأنشطة التي تجري تحت حسابك. أبلغنا فوراً بأي وصول غير مصرح به.", "نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط أو تنخرط في نشاط احتيالي أو تشكل خطراً على المستخدمين الآخرين."], bullets: null },
      { title: "خطط الاشتراك والمدفوعات", paragraphs: ["تقدم يودرسي ثلاثة مستويات اشتراك بالدرهم المغربي (MAD). تشمل جميع الأسعار الضرائب المعمول بها."], bullets: ["الخطة المجانية (0 MAD) — دروس أساسية، 10 تنزيلات شهرية بدون إنترنت", "خطة Pro — 199 MAD/شهر أو 1,910 MAD/سنة — دروس متميزة، تجربة بدون إعلانات، 100 تنزيل", "خطة Premium — 299 MAD/شهر أو 2,870 MAD/سنة — وصول كامل، تنزيلات غير محدودة، دعم ذو أولوية"] },
      { title: "سياسة الاسترداد", paragraphs: ["رسوم الاشتراك غير قابلة للاسترداد بشكل عام. تُطبق الاستثناءات حيث يقتضي ذلك قانون حماية المستهلك المغربي (القانون رقم 31-08). إذا اعتقدت أن لديك الحق في استرداد المبلغ، تواصل مع فريق الدعم في غضون 7 أيام من الرسوم.", "تحتفظ يودرسي بالحق في إصدار المبالغ المستردة أو الاعتمادات وفق تقديرها المطلق لانقطاعات الخدمة أو أخطاء الفواتير."], bullets: null },
      { title: "المحتوى والملكية الفكرية", paragraphs: ["جميع محتويات المنصة — الدروس والمقاطع المرئية وملفات PDF والتمارين والامتحانات — مملوكة ليودرسي أو مرخصة من شركاء المحتوى. يُحظر صراحةً إعادة الإنتاج أو إعادة التوزيع أو العرض العلني غير المصرح به.", "تبقى المساهمات المقدمة من المستخدمين ملكية فكرية للمساهم. بتقديم المحتوى، تمنح يودرسي ترخيصاً عالمياً غير حصري وخالياً من الرسوم لعرض ذلك المحتوى وتوزيعه على المنصة."], bullets: null },
      { title: "الاستخدام المقبول", paragraphs: ["باستخدام يودرسي، توافق على عدم:"], bullets: ["انتهاك أي قانون أو لائحة مغربية معمول بها", "رفع محتوى ضار أو تشهيري أو فاحش أو ينتهك حقوق أطراف ثالثة", "محاولة الوصول غير المصرح به إلى أي جزء من المنصة أو بنيتها التحتية", "استخدام أدوات آلية لاستخراج محتوى المنصة أو جمعه", "انتحال شخصية مستخدم آخر أو معلم أو محاضر أو عضو في فريق يودرسي", "مشاركة أو بيع بيانات الاعتماد للتحايل على قيود الاشتراك"] },
      { title: "التزامات المعلمين والمحاضرين", paragraphs: ["يجب على المعلمين والمحاضرين تقديم معلومات دقيقة وصادقة خلال عملية التقديم والتحقق. يُعدّ تقديم بيانات اعتماد مزورة سبباً للإنهاء الفوري وقد يُبلَّغ عنه للسلطات المغربية المعنية.", "المعلمون مسؤولون وحدهم عن دقة وملاءمة المحتوى التعليمي المشارك داخل فصولهم الدراسية."], bullets: null },
      { title: "حدود المسؤولية", paragraphs: ["إلى أقصى حد يجيزه القانون المغربي، لن تكون يودرسي وشركاتها التابعة مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناجمة عن استخدامك للمنصة.", "لن تتجاوز مسؤوليتنا الإجمالية عن أي مطالبة ناشئة عن هذه الشروط إجمالي الرسوم التي دفعتها ليودرسي خلال الـ 12 شهراً السابقة للمطالبة."], bullets: null },
      { title: "التغييرات على هذه الشروط", paragraphs: ["قد نحدّث شروط الاستخدام هذه دورياً. سنخطر المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على المنصة قبل 14 يوماً على الأقل من دخولها حيز التنفيذ.", "استمرار استخدام المنصة بعد دخول التغييرات حيز التنفيذ يُعدّ قبولاً للشروط المعدّلة."], bullets: null },
      { title: "القانون المعمول به", paragraphs: ["تخضع هذه الشروط لقوانين المملكة المغربية. ستُحسم أي نزاعات ناشئة عن هذه الشروط أو المتعلقة بها أمام المحاكم المختصة في الرباط، المغرب.", "نشجع المستخدمين على الاتصال بفريق الدعم لدينا قبل بدء أي إجراءات قانونية — يمكن حل معظم المشكلات بسرعة ووداً."], bullets: null },
    ],
  },
};

export default function TermsPage() {
  const locale = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;
  const isRTL = locale === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#e4e8e3] pt-20 md:pt-32 pb-24 px-[clamp(16px,6vw,80px)]">
      <div className="max-w-4xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-14 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3aaa6a]/10 text-[#3aaa6a] text-xs font-black tracking-widest uppercase">
            <Scale size={14} />{c.badge}
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1a3a2a]">{c.title}</h1>
          <p className="text-[#1a3a2a]/50 text-sm">{c.updated} {LAST_UPDATED}</p>
          <div className={`max-w-2xl mx-auto ${isRTL ? "text-right" : "text-left"} p-6 rounded-[24px]`} style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
            <p className="text-sm text-[#1a3a2a]/65 leading-relaxed">{c.intro}</p>
          </div>
        </motion.div>

        <div className="space-y-5">
          {c.sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.025, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
              <div className="relative overflow-hidden rounded-[18px] bg-white group" style={{ border: "1.5px solid rgba(58,170,106,0.11)", boxShadow: "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)", transition: "border-color 0.28s ease, box-shadow 0.28s ease" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(58,170,106,0.35)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(58,170,106,0.14), 0 3px 10px rgba(58,170,106,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(58,170,106,0.11)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)"; }}>
                <div className="absolute top-0 left-0 w-1/2 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms]" style={{ background: "linear-gradient(90deg, #3aaa6a, #5dc98a)", transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)" }} />
                <div className="absolute top-0 right-0 w-1/2 h-[3px] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms]" style={{ background: "linear-gradient(90deg, #5dc98a, #3aaa6a)", transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)" }} />
                <div className="p-7 md:p-8 space-y-4">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-black text-[#3aaa6a]" style={{ background: "rgba(58,170,106,0.10)" }}>{i + 1}</span>
                    <h2 className={`text-lg md:text-xl font-black text-[#1a3a2a] leading-tight mt-1 ${isRTL ? "text-right" : "text-left"}`}>{section.title}</h2>
                  </div>
                  <div className={`${isRTL ? "pr-[52px]" : "pl-[52px]"} space-y-3`}>
                    {section.paragraphs.map((p, pi) => <p key={pi} className={`text-sm text-[#1a3a2a]/65 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>{p}</p>)}
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
          <p className={`text-xs font-black uppercase tracking-widest text-[#3aaa6a] mb-4 ${isRTL ? "text-right" : ""}`}>{c.contactTitle}</p>
          <div className="space-y-3">
            <a href={`mailto:${CONTACT.email}`} className={`flex items-center gap-3 text-sm text-[#1a3a2a]/70 hover:text-[#3aaa6a] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}><Mail size={15} className="shrink-0 text-[#3aaa6a]" />{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phoneTel}`} className={`flex items-center gap-3 text-sm text-[#1a3a2a]/70 hover:text-[#3aaa6a] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}><Phone size={15} className="shrink-0 text-[#3aaa6a]" />{CONTACT.phone}</a>
            <div className={`flex items-center gap-3 text-sm text-[#1a3a2a]/70 ${isRTL ? "flex-row-reverse" : ""}`}><MapPin size={15} className="shrink-0 text-[#3aaa6a]" />{CONTACT.location}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className={`mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[18px] p-6 bg-white ${isRTL ? "sm:flex-row-reverse" : ""}`} style={{ border: "1.5px solid rgba(58,170,106,0.11)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <p className="text-sm text-[#1a3a2a]/60">{c.alsoRead}</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] transition-all hover:bg-[#3aaa6a]/10" style={{ background: "rgba(58,170,106,0.07)", border: "1.5px solid rgba(58,170,106,0.18)" }}><Shield size={14} />{c.privacyLabel}</Link>
            <Link href="/cookies" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] transition-all hover:bg-[#3aaa6a]/10" style={{ background: "rgba(58,170,106,0.07)", border: "1.5px solid rgba(58,170,106,0.18)" }}><Cookie size={14} />{c.cookiesLabel}</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="mt-8 rounded-[24px] p-8 text-center overflow-hidden relative" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px), linear-gradient(135deg, #1e7a46 0%, #0f4428 100%)" }}>
          <p className="text-white/70 text-sm mb-2">{c.ctaQ}</p>
          <h3 className="text-white font-black text-xl mb-5">{c.ctaTitle}</h3>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.04em", color: "#1a6b3a", background: "#ffffff", borderRadius: "999px", padding: "7px 18px", border: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)", textDecoration: "none" }}>{c.ctaBtn}</Link>
        </motion.div>

      </div>
    </div>
  );
}
