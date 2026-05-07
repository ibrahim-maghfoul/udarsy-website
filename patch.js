const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'messages', 'en.json');
const frPath = path.join(__dirname, 'messages', 'fr.json');
const arPath = path.join(__dirname, 'messages', 'ar.json');

const updateJson = (filePath, lang) => {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Hero title
    if (lang === 'en') {
        data.Hero.badge = "Morocco's Education Platform Powered With AI";
    } else if (lang === 'fr') {
        data.Hero.badge = "Plateforme Éducative du Maroc Propulsée par l'IA";
    } else if (lang === 'ar') {
        data.Hero.badge = "منصة التعليم المغربية المدعومة بالذكاء الاصطناعي";
    }

    // Pricing
    data.Pricing.ai_free = lang === 'ar' ? "استخدام شرح الذكاء الاصطناعي مرة واحدة يوميا" : lang === 'fr' ? "Explication IA 1 fois par jour" : "1 AI explanation / day";
    data.Pricing.ai_pro = lang === 'ar' ? "استخدام شرح الذكاء الاصطناعي 30 مرة يوميا" : lang === 'fr' ? "Explication IA 30 fois par jour" : "30 AI explanations / day";
    data.Pricing.ai_premium = lang === 'ar' ? "استخدام شرح الذكاء الاصطناعي 70 مرة يوميا" : lang === 'fr' ? "Explication IA 70 fois par jour" : "70 AI explanations / day";

    data.Pricing.free_f1 = lang === 'ar' ? "ملفات PDF ووثائق مجانية للتحميل والتصفح" : lang === 'fr' ? "PDFs et fichiers gratuits à télécharger et naviguer" : "PDFs and files free to download and navigate";
    data.Pricing.free_f2 = lang === 'ar' ? "متابعة التقدم" : lang === 'fr' ? "Suivre la progression" : "Follow the progress";
    data.Pricing.free_f3 = lang === 'ar' ? "الحصول على الأخبار ومعلومات المنح الدراسية" : lang === 'fr' ? "Recevoir les actualités et infos sur les bourses" : "Get the news and scholarships infos";
    data.Pricing.free_f4 = lang === 'ar' ? "مشاركة المستندات بشكل محدود" : lang === 'fr' ? "Partager des documents de manière limitée" : "Share docs but limited";
    data.Pricing.free_f5 = lang === 'ar' ? "عرض 100 مستند فقط يوميا" : lang === 'fr' ? "Voir seulement 100 documents par jour" : "View only 100 doc per day";
    data.Pricing.free_f6 = lang === 'ar' ? "دردشة" : lang === 'fr' ? "Chat" : "Chat";
    data.Pricing.free_f7 = lang === 'ar' ? "بدون شارة" : lang === 'fr' ? "Pas de badge" : "No badge";
    data.Pricing.free_f8 = lang === 'ar' ? "بدون دعم" : lang === 'fr' ? "Pas de support" : "No support";

    data.Pricing.pro_f1 = lang === 'ar' ? "كل ما في الباقة المجانية" : lang === 'fr' ? "Tout ce qui est dans le gratuit" : "Everything in Free";
    data.Pricing.pro_f2 = lang === 'ar' ? "عرض ملفات غير محدودة" : lang === 'fr' ? "Voir des fichiers illimités" : "View unlimited files";
    data.Pricing.pro_f3 = lang === 'ar' ? "شارة مميزة" : lang === 'fr' ? "Badge Premium" : "Premium badge";
    data.Pricing.pro_f4 = lang === 'ar' ? "دعم الفريق عبر البريد الإلكتروني" : lang === 'fr' ? "Support d'équipe par email" : "Team support per email";
    data.Pricing.pro_f5 = lang === 'ar' ? "دورات مميزة" : lang === 'fr' ? "Cours premium" : "Premium courses";
    data.Pricing.pro_f6 = lang === 'ar' ? "الحصول على الأخبار عبر البريد الإلكتروني" : lang === 'fr' ? "Recevoir les actualités par email" : "Get news per email";

    data.Pricing.prem_f1 = lang === 'ar' ? "كل ما في باقة البرو" : lang === 'fr' ? "Tout ce qui est dans le Pro" : "Everything in Pro";
    data.Pricing.prem_f2 = lang === 'ar' ? "ساعتان وجها لوجه مع المدرب في الدورة المختارة" : lang === 'fr' ? "2 Heures en face à face avec un instructeur dans le cours choisi" : "2 Hours face to face with instructor call in chosen course";

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

updateJson(enPath, 'en');
updateJson(frPath, 'fr');
updateJson(arPath, 'ar');
console.log('JSON files updated');
