const moroccanCities = [
    "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
    "Safi", "Mohammedia", "Khouribga", "Beni Mellal", "El Jadida", "Taza", "Nador", "Settat", "Larache",
    "Ksar El Kebir", "Khemisset", "Guelmim", "Berrechid", "Oued Zem", "Fquih Ben Salah", "Taourirt",
    "Berkane", "Sidi Slimane", "Sidi Qacem", "Khenifra", "Taroudant", "Essaouira", "Tiznit", "Ouarzazate",
    "Errachidia", "Tan-Tan", "Sidi Ifni", "Dakhla", "Laayouine"
];

function matchMoroccanCity(city: string): string {
    const normalized = city.toLowerCase().trim();
    return moroccanCities.find(c => c.toLowerCase() === normalized) ?? '';
}

export async function fetchAndStoreGoogleProfile(accessToken: string): Promise<void> {
    try {
        const res = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=birthdays,addresses',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!res.ok) return;
        const data = await res.json();

        const profile: { birthday?: string; city?: string } = {};

        const bday = data.birthdays?.[0]?.date;
        if (bday?.year && bday?.month && bday?.day) {
            const m = String(bday.month).padStart(2, '0');
            const d = String(bday.day).padStart(2, '0');
            profile.birthday = `${bday.year}-${m}-${d}`;
        }

        const city = data.addresses?.[0]?.city;
        if (city) {
            const matched = matchMoroccanCity(city);
            if (matched) profile.city = matched;
        }

        if (Object.keys(profile).length > 0) {
            sessionStorage.setItem('googleOnboardingData', JSON.stringify(profile));
        }
    } catch {
        // Pre-fill is best-effort — ignore all errors
    }
}
