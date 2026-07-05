// Schweizer Ortschaften mit PLZ + Koordinaten (kuratierte Auswahl der
// wichtigsten Staedte/Agglomerationen; Koordinaten approximativ, ausreichend
// fuer die Umkreissuche). Fuer den Vollausbau kann hier 1:1 der offizielle
// PLZ-Datensatz der Post (Ortschaftenverzeichnis) eingespielt werden.

export type PlzEntry = {
  plz: string;
  name: string;
  slug: string;
  canton: string;
  lat: number;
  lng: number;
};

export const PLZ_DATA: PlzEntry[] = [
  // --- Zuerich ---
  { plz: "8001", name: "Zürich", slug: "zuerich", canton: "ZH", lat: 47.3769, lng: 8.5417 },
  { plz: "8400", name: "Winterthur", slug: "winterthur", canton: "ZH", lat: 47.4997, lng: 8.7241 },
  { plz: "8610", name: "Uster", slug: "uster", canton: "ZH", lat: 47.347, lng: 8.7208 },
  { plz: "8600", name: "Dübendorf", slug: "duebendorf", canton: "ZH", lat: 47.3971, lng: 8.6183 },
  { plz: "8953", name: "Dietikon", slug: "dietikon", canton: "ZH", lat: 47.4017, lng: 8.4004 },
  { plz: "8620", name: "Wetzikon", slug: "wetzikon", canton: "ZH", lat: 47.3262, lng: 8.7988 },
  { plz: "8820", name: "Wädenswil", slug: "waedenswil", canton: "ZH", lat: 47.2269, lng: 8.6673 },
  { plz: "8810", name: "Horgen", slug: "horgen", canton: "ZH", lat: 47.2598, lng: 8.5974 },
  { plz: "8800", name: "Thalwil", slug: "thalwil", canton: "ZH", lat: 47.2919, lng: 8.5637 },
  { plz: "8302", name: "Kloten", slug: "kloten", canton: "ZH", lat: 47.4515, lng: 8.5849 },
  { plz: "8180", name: "Bülach", slug: "buelach", canton: "ZH", lat: 47.5217, lng: 8.54 },
  { plz: "8952", name: "Schlieren", slug: "schlieren", canton: "ZH", lat: 47.3967, lng: 8.4477 },
  { plz: "8304", name: "Wallisellen", slug: "wallisellen", canton: "ZH", lat: 47.415, lng: 8.5967 },
  { plz: "8105", name: "Regensdorf", slug: "regensdorf", canton: "ZH", lat: 47.434, lng: 8.469 },
  { plz: "8700", name: "Küsnacht", slug: "kuesnacht", canton: "ZH", lat: 47.318, lng: 8.5836 },
  { plz: "8706", name: "Meilen", slug: "meilen", canton: "ZH", lat: 47.2703, lng: 8.6437 },
  { plz: "8712", name: "Stäfa", slug: "staefa", canton: "ZH", lat: 47.2404, lng: 8.7231 },
  { plz: "8307", name: "Effretikon", slug: "effretikon", canton: "ZH", lat: 47.4269, lng: 8.6907 },
  { plz: "8152", name: "Opfikon-Glattbrugg", slug: "opfikon", canton: "ZH", lat: 47.431, lng: 8.576 },
  { plz: "8134", name: "Adliswil", slug: "adliswil", canton: "ZH", lat: 47.311, lng: 8.5246 },
  { plz: "8910", name: "Affoltern am Albis", slug: "affoltern-am-albis", canton: "ZH", lat: 47.281, lng: 8.453 },
  { plz: "8630", name: "Rüti ZH", slug: "rueti-zh", canton: "ZH", lat: 47.259, lng: 8.848 },
  { plz: "8330", name: "Pfäffikon ZH", slug: "pfaeffikon-zh", canton: "ZH", lat: 47.366, lng: 8.786 },
  // --- Bern ---
  { plz: "3011", name: "Bern", slug: "bern", canton: "BE", lat: 46.948, lng: 7.4474 },
  { plz: "3098", name: "Köniz", slug: "koeniz", canton: "BE", lat: 46.9244, lng: 7.4147 },
  { plz: "3072", name: "Ostermundigen", slug: "ostermundigen", canton: "BE", lat: 46.956, lng: 7.487 },
  { plz: "3600", name: "Thun", slug: "thun", canton: "BE", lat: 46.758, lng: 7.628 },
  { plz: "3400", name: "Burgdorf", slug: "burgdorf", canton: "BE", lat: 47.059, lng: 7.628 },
  { plz: "4900", name: "Langenthal", slug: "langenthal", canton: "BE", lat: 47.215, lng: 7.789 },
  { plz: "2502", name: "Biel/Bienne", slug: "biel", canton: "BE", lat: 47.1368, lng: 7.2468 },
  { plz: "3800", name: "Interlaken", slug: "interlaken", canton: "BE", lat: 46.6863, lng: 7.8632 },
  { plz: "3700", name: "Spiez", slug: "spiez", canton: "BE", lat: 46.686, lng: 7.68 },
  { plz: "3110", name: "Münsingen", slug: "muensingen", canton: "BE", lat: 46.873, lng: 7.561 },
  { plz: "3250", name: "Lyss", slug: "lyss", canton: "BE", lat: 47.074, lng: 7.306 },
  { plz: "3612", name: "Steffisburg", slug: "steffisburg", canton: "BE", lat: 46.778, lng: 7.633 },
  // --- Luzern / Zentralschweiz ---
  { plz: "6003", name: "Luzern", slug: "luzern", canton: "LU", lat: 47.0502, lng: 8.3093 },
  { plz: "6020", name: "Emmen", slug: "emmen", canton: "LU", lat: 47.081, lng: 8.301 },
  { plz: "6010", name: "Kriens", slug: "kriens", canton: "LU", lat: 47.035, lng: 8.278 },
  { plz: "6048", name: "Horw", slug: "horw", canton: "LU", lat: 47.017, lng: 8.308 },
  { plz: "6030", name: "Ebikon", slug: "ebikon", canton: "LU", lat: 47.081, lng: 8.34 },
  { plz: "6210", name: "Sursee", slug: "sursee", canton: "LU", lat: 47.171, lng: 8.111 },
  { plz: "6460", name: "Altdorf", slug: "altdorf", canton: "UR", lat: 46.88, lng: 8.644 },
  { plz: "6430", name: "Schwyz", slug: "schwyz", canton: "SZ", lat: 47.0207, lng: 8.653 },
  { plz: "8840", name: "Einsiedeln", slug: "einsiedeln", canton: "SZ", lat: 47.128, lng: 8.743 },
  { plz: "8853", name: "Lachen", slug: "lachen", canton: "SZ", lat: 47.192, lng: 8.853 },
  { plz: "8808", name: "Pfäffikon SZ", slug: "pfaeffikon-sz", canton: "SZ", lat: 47.202, lng: 8.779 },
  { plz: "6403", name: "Küssnacht am Rigi", slug: "kuessnacht-am-rigi", canton: "SZ", lat: 47.085, lng: 8.442 },
  { plz: "6060", name: "Sarnen", slug: "sarnen", canton: "OW", lat: 46.896, lng: 8.245 },
  { plz: "6370", name: "Stans", slug: "stans", canton: "NW", lat: 46.958, lng: 8.366 },
  { plz: "8750", name: "Glarus", slug: "glarus", canton: "GL", lat: 47.04, lng: 9.068 },
  { plz: "6300", name: "Zug", slug: "zug", canton: "ZG", lat: 47.1662, lng: 8.5155 },
  { plz: "6340", name: "Baar", slug: "baar", canton: "ZG", lat: 47.196, lng: 8.529 },
  { plz: "6330", name: "Cham", slug: "cham", canton: "ZG", lat: 47.181, lng: 8.459 },
  { plz: "6343", name: "Rotkreuz", slug: "rotkreuz", canton: "ZG", lat: 47.142, lng: 8.431 },
  { plz: "6312", name: "Steinhausen", slug: "steinhausen", canton: "ZG", lat: 47.195, lng: 8.486 },
  // --- Nordwestschweiz ---
  { plz: "4051", name: "Basel", slug: "basel", canton: "BS", lat: 47.5596, lng: 7.5886 },
  { plz: "4410", name: "Liestal", slug: "liestal", canton: "BL", lat: 47.4842, lng: 7.7346 },
  { plz: "4132", name: "Muttenz", slug: "muttenz", canton: "BL", lat: 47.522, lng: 7.645 },
  { plz: "4133", name: "Pratteln", slug: "pratteln", canton: "BL", lat: 47.52, lng: 7.693 },
  { plz: "4123", name: "Allschwil", slug: "allschwil", canton: "BL", lat: 47.55, lng: 7.536 },
  { plz: "4153", name: "Reinach BL", slug: "reinach-bl", canton: "BL", lat: 47.493, lng: 7.592 },
  { plz: "4102", name: "Binningen", slug: "binningen", canton: "BL", lat: 47.54, lng: 7.569 },
  { plz: "4142", name: "Münchenstein", slug: "muenchenstein", canton: "BL", lat: 47.518, lng: 7.609 },
  { plz: "4310", name: "Rheinfelden", slug: "rheinfelden", canton: "AG", lat: 47.5539, lng: 7.793 },
  { plz: "4500", name: "Solothurn", slug: "solothurn", canton: "SO", lat: 47.2088, lng: 7.5323 },
  { plz: "4600", name: "Olten", slug: "olten", canton: "SO", lat: 47.3499, lng: 7.9038 },
  { plz: "2540", name: "Grenchen", slug: "grenchen", canton: "SO", lat: 47.192, lng: 7.396 },
  // --- Aargau ---
  { plz: "5000", name: "Aarau", slug: "aarau", canton: "AG", lat: 47.3925, lng: 8.0442 },
  { plz: "5400", name: "Baden", slug: "baden", canton: "AG", lat: 47.4734, lng: 8.3063 },
  { plz: "5430", name: "Wettingen", slug: "wettingen", canton: "AG", lat: 47.47, lng: 8.316 },
  { plz: "5200", name: "Brugg", slug: "brugg", canton: "AG", lat: 47.4867, lng: 8.2076 },
  { plz: "5610", name: "Wohlen AG", slug: "wohlen-ag", canton: "AG", lat: 47.351, lng: 8.275 },
  { plz: "5600", name: "Lenzburg", slug: "lenzburg", canton: "AG", lat: 47.388, lng: 8.175 },
  { plz: "4800", name: "Zofingen", slug: "zofingen", canton: "AG", lat: 47.288, lng: 7.945 },
  { plz: "8957", name: "Spreitenbach", slug: "spreitenbach", canton: "AG", lat: 47.422, lng: 8.366 },
  { plz: "4665", name: "Oftringen", slug: "oftringen", canton: "AG", lat: 47.314, lng: 7.925 },
  // --- Ostschweiz ---
  { plz: "8200", name: "Schaffhausen", slug: "schaffhausen", canton: "SH", lat: 47.697, lng: 8.6345 },
  { plz: "8212", name: "Neuhausen am Rheinfall", slug: "neuhausen", canton: "SH", lat: 47.682, lng: 8.613 },
  { plz: "9100", name: "Herisau", slug: "herisau", canton: "AR", lat: 47.386, lng: 9.279 },
  { plz: "9050", name: "Appenzell", slug: "appenzell", canton: "AI", lat: 47.331, lng: 9.409 },
  { plz: "9000", name: "St. Gallen", slug: "st-gallen", canton: "SG", lat: 47.4245, lng: 9.3767 },
  { plz: "9200", name: "Gossau SG", slug: "gossau-sg", canton: "SG", lat: 47.416, lng: 9.247 },
  { plz: "9500", name: "Wil SG", slug: "wil-sg", canton: "SG", lat: 47.461, lng: 9.0454 },
  { plz: "8640", name: "Rapperswil-Jona", slug: "rapperswil-jona", canton: "SG", lat: 47.2266, lng: 8.8184 },
  { plz: "8730", name: "Uznach", slug: "uznach", canton: "SG", lat: 47.224, lng: 8.981 },
  { plz: "9630", name: "Wattwil", slug: "wattwil", canton: "SG", lat: 47.299, lng: 9.087 },
  { plz: "9470", name: "Buchs SG", slug: "buchs-sg", canton: "SG", lat: 47.166, lng: 9.474 },
  { plz: "9450", name: "Altstätten", slug: "altstaetten", canton: "SG", lat: 47.377, lng: 9.541 },
  { plz: "9400", name: "Rorschach", slug: "rorschach", canton: "SG", lat: 47.478, lng: 9.49 },
  { plz: "7000", name: "Chur", slug: "chur", canton: "GR", lat: 46.8503, lng: 9.532 },
  { plz: "7270", name: "Davos", slug: "davos", canton: "GR", lat: 46.801, lng: 9.836 },
  { plz: "7500", name: "St. Moritz", slug: "st-moritz", canton: "GR", lat: 46.498, lng: 9.839 },
  { plz: "7302", name: "Landquart", slug: "landquart", canton: "GR", lat: 46.961, lng: 9.554 },
  { plz: "8500", name: "Frauenfeld", slug: "frauenfeld", canton: "TG", lat: 47.5536, lng: 8.8986 },
  { plz: "8280", name: "Kreuzlingen", slug: "kreuzlingen", canton: "TG", lat: 47.6459, lng: 9.1783 },
  { plz: "8580", name: "Amriswil", slug: "amriswil", canton: "TG", lat: 47.546, lng: 9.296 },
  { plz: "8570", name: "Weinfelden", slug: "weinfelden", canton: "TG", lat: 47.566, lng: 9.107 },
  { plz: "8590", name: "Romanshorn", slug: "romanshorn", canton: "TG", lat: 47.566, lng: 9.379 },
  { plz: "9320", name: "Arbon", slug: "arbon", canton: "TG", lat: 47.514, lng: 9.433 },
  // --- Tessin ---
  { plz: "6900", name: "Lugano", slug: "lugano", canton: "TI", lat: 46.0037, lng: 8.9511 },
  { plz: "6500", name: "Bellinzona", slug: "bellinzona", canton: "TI", lat: 46.195, lng: 9.029 },
  { plz: "6600", name: "Locarno", slug: "locarno", canton: "TI", lat: 46.17, lng: 8.799 },
  { plz: "6850", name: "Mendrisio", slug: "mendrisio", canton: "TI", lat: 45.87, lng: 8.982 },
  { plz: "6830", name: "Chiasso", slug: "chiasso", canton: "TI", lat: 45.832, lng: 9.031 },
  // --- Romandie ---
  { plz: "1003", name: "Lausanne", slug: "lausanne", canton: "VD", lat: 46.5197, lng: 6.6323 },
  { plz: "1400", name: "Yverdon-les-Bains", slug: "yverdon", canton: "VD", lat: 46.7785, lng: 6.6412 },
  { plz: "1820", name: "Montreux", slug: "montreux", canton: "VD", lat: 46.431, lng: 6.911 },
  { plz: "1800", name: "Vevey", slug: "vevey", canton: "VD", lat: 46.46, lng: 6.843 },
  { plz: "1260", name: "Nyon", slug: "nyon", canton: "VD", lat: 46.383, lng: 6.239 },
  { plz: "1110", name: "Morges", slug: "morges", canton: "VD", lat: 46.511, lng: 6.498 },
  { plz: "1020", name: "Renens", slug: "renens", canton: "VD", lat: 46.539, lng: 6.588 },
  { plz: "1009", name: "Pully", slug: "pully", canton: "VD", lat: 46.51, lng: 6.662 },
  { plz: "1950", name: "Sion", slug: "sion", canton: "VS", lat: 46.233, lng: 7.36 },
  { plz: "3960", name: "Sierre", slug: "sierre", canton: "VS", lat: 46.292, lng: 7.532 },
  { plz: "3930", name: "Visp", slug: "visp", canton: "VS", lat: 46.293, lng: 7.881 },
  { plz: "3900", name: "Brig", slug: "brig", canton: "VS", lat: 46.316, lng: 7.988 },
  { plz: "1920", name: "Martigny", slug: "martigny", canton: "VS", lat: 46.103, lng: 7.073 },
  { plz: "1870", name: "Monthey", slug: "monthey", canton: "VS", lat: 46.255, lng: 6.948 },
  { plz: "2000", name: "Neuchâtel", slug: "neuchatel", canton: "NE", lat: 46.99, lng: 6.9293 },
  { plz: "2300", name: "La Chaux-de-Fonds", slug: "la-chaux-de-fonds", canton: "NE", lat: 47.1035, lng: 6.825 },
  { plz: "2400", name: "Le Locle", slug: "le-locle", canton: "NE", lat: 47.056, lng: 6.748 },
  { plz: "1700", name: "Fribourg", slug: "fribourg", canton: "FR", lat: 46.8065, lng: 7.162 },
  { plz: "1630", name: "Bulle", slug: "bulle", canton: "FR", lat: 46.619, lng: 7.057 },
  { plz: "3280", name: "Murten", slug: "murten", canton: "FR", lat: 46.928, lng: 7.117 },
  { plz: "1201", name: "Genève", slug: "genf", canton: "GE", lat: 46.2044, lng: 6.1432 },
  { plz: "1227", name: "Carouge", slug: "carouge", canton: "GE", lat: 46.183, lng: 6.139 },
  { plz: "1214", name: "Vernier", slug: "vernier", canton: "GE", lat: 46.217, lng: 6.085 },
  { plz: "1212", name: "Lancy", slug: "lancy", canton: "GE", lat: 46.19, lng: 6.114 },
  { plz: "1217", name: "Meyrin", slug: "meyrin", canton: "GE", lat: 46.234, lng: 6.08 },
  { plz: "2800", name: "Delémont", slug: "delemont", canton: "JU", lat: 47.365, lng: 7.345 },
  { plz: "2900", name: "Porrentruy", slug: "porrentruy", canton: "JU", lat: 47.415, lng: 7.076 },
];

const byPlz = new Map(PLZ_DATA.map((e) => [e.plz, e]));
const bySlug = new Map(PLZ_DATA.map((e) => [e.slug, e]));

export function findByPlz(plz: string): PlzEntry | undefined {
  return byPlz.get(plz.trim());
}

export function findBySlug(slug: string): PlzEntry | undefined {
  return bySlug.get(slug.trim().toLowerCase());
}

/**
 * Geokodiert eine beliebige Schweizer PLZ. Exakter Treffer, sonst der
 * numerisch naechstliegende Eintrag (Schweizer PLZ sind geografisch
 * geclustert — als Approximation fuer die Umkreissuche ausreichend).
 */
export function geocodePlz(plz: string): { lat: number; lng: number; approx: boolean } | null {
  const clean = plz.trim();
  if (!/^\d{4}$/.test(clean)) return null;
  const exact = byPlz.get(clean);
  if (exact) return { lat: exact.lat, lng: exact.lng, approx: false };
  const target = parseInt(clean, 10);
  let best: PlzEntry | null = null;
  let bestDiff = Infinity;
  for (const e of PLZ_DATA) {
    const diff = Math.abs(parseInt(e.plz, 10) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = e;
    }
  }
  return best ? { lat: best.lat, lng: best.lng, approx: true } : null;
}
