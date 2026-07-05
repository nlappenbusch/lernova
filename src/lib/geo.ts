// Geo-Utilities: Haversine-Distanz + Radius-Filter fuer die Umkreissuche.

export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;

/** Distanz zwischen zwei Koordinaten in Kilometern (Haversine). */
export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Filtert & sortiert Items mit Koordinaten nach Distanz zu einem Zentrum.
 * Items ohne Koordinaten werden ans Ende gehaengt (distanceKm = null),
 * damit keine Anfrage "verloren" geht.
 */
export function withinRadius<T extends { lat: number | null; lng: number | null }>(
  items: T[],
  center: LatLng,
  radiusKm: number
): Array<T & { distanceKm: number | null }> {
  const located: Array<T & { distanceKm: number | null }> = [];
  const unlocated: Array<T & { distanceKm: number | null }> = [];
  for (const item of items) {
    if (item.lat == null || item.lng == null) {
      unlocated.push({ ...item, distanceKm: null });
      continue;
    }
    const d = haversineKm(center, { lat: item.lat, lng: item.lng });
    if (d <= radiusKm) located.push({ ...item, distanceKm: Math.round(d * 10) / 10 });
  }
  located.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return [...located, ...unlocated];
}
