const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'messages', 'en.json');
const frPath = path.join(__dirname, 'messages', 'fr.json');
const arPath = path.join(__dirname, 'messages', 'ar.json');

const updateJson = (filePath, lang) => {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.Team.member1_role = lang === 'ar' ? "مدير الموقع" : lang === 'fr' ? "Manager du site" : "Website Manager";
    data.Team.member2_role = lang === 'ar' ? "مسؤول الوسائط" : lang === 'fr' ? "Responsable Multimédia" : "Multimedia Responsable";
    data.Team.member3_role = lang === 'ar' ? "مدير التسويق" : lang === 'fr' ? "Manager Marketing" : "Marketing Manager";
    data.Team.member4_role = lang === 'ar' ? "مطور" : lang === 'fr' ? "Développeur" : "Developer";
    data.Team.member5_role = lang === 'ar' ? "مدير المالية" : lang === 'fr' ? "Manager Finance" : "Finance Manager";
    data.Team.member6_role = lang === 'ar' ? "لوجستيك" : lang === 'fr' ? "Logistique" : "Logistic";

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

updateJson(enPath, 'en');
updateJson(frPath, 'fr');
updateJson(arPath, 'ar');
console.log('JSON Team roles updated');
