const CDN = 'https://files.udarsy.com/subjects-cards';

const SUBJECT_IMAGES: Record<string, string> = {
  "Activité scientifique":                                   `${CDN}/Activite-scientifique.webp`,
  "Anglais":                                                 `${CDN}/Anglais.webp`,
  "Arabe":                                                   `${CDN}/Arabe.webp`,
  "Comptabilité et Mathématiques financières":               `${CDN}/Comptabilite-maths-financieres.webp`,
  "Droit":                                                   `${CDN}/Droit.webp`,
  "Education Islamique":                                     `${CDN}/Education-Islamique.webp`,
  "Education artistique":                                    `${CDN}/Education-artistique.webp`,
  "Français":                                                `${CDN}/Francais.webp`,
  "Histoire Géographie":                                     `${CDN}/Histoire-Geo.webp`,
  "Informatique":                                            `${CDN}/Informatique.webp`,
  "Informatique de gestion":                                 `${CDN}/Informatique-de-gestion.webp`,
  "Mathématiques (BIOF)":                                    `${CDN}/Maths-BIOF.webp`,
  "Mathématiques (Fr)":                                      `${CDN}/Maths-Fr.webp`,
  "Mathématiques":                                           `${CDN}/Maths.webp`,
  "Philosophie":                                             `${CDN}/Philosophie.webp`,
  "Physique et Chimie (BIOF)":                               `${CDN}/PC-BIOF.webp`,
  "Physique et Chimie (Fr)":                                 `${CDN}/PC-Fr.webp`,
  "Physique et Chimie":                                      `${CDN}/PC.webp`,
  "Sciences Végétales et Animales (SVA)":                    `${CDN}/SVA.webp`,
  "Sciences de la Vie et de la Terre (SVT BIOF)":            `${CDN}/SVT-BIOF.webp`,
  "Sciences de la vie et de la Terre (SVT BIOF)":            `${CDN}/SVT-BIOF.webp`,
  "Sciences de la Vie et de la Terre (SVT Fr)":              `${CDN}/SVT-Fr.webp`,
  "Sciences de la vie et de la Terre (SVT Fr)":              `${CDN}/SVT-Fr.webp`,
  "Sciences de la Vie et de la Terre (SVT)":                 `${CDN}/SVT.webp`,
  "Sciences de la vie et de la Terre (SVT)":                 `${CDN}/SVT.webp`,
  "Technologie Industrielle":                                `${CDN}/Techno-Industrielle.webp`,
  "Vocabulaire":                                             `${CDN}/Vocabulaire.webp`,
  "Sciences de l'ingénieur":                                 `${CDN}/Sciences-ingenieur.webp`,
  "Économie et Organisation Administrative des Entreprises": `${CDN}/Economie-Org.webp`,
  "Économie générale et Statistiques":                       `${CDN}/Economie-Generale.webp`,
};

// Normalise to NFC and lowercase for case/accent-insensitive lookup
const NORMALISED = Object.fromEntries(
  Object.entries(SUBJECT_IMAGES).map(([k, v]) => [k.normalize('NFC').toLowerCase(), v])
);

export function getSubjectImage(title: string): string | undefined {
  // Exact match first, then normalised fallback
  return SUBJECT_IMAGES[title] ?? NORMALISED[title.normalize('NFC').toLowerCase()];
}
