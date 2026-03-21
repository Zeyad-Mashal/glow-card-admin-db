/**
 * استخراج [lat, lng] من روابط Google Maps الشائعة.
 * @param {string} url
 * @returns {[number, number]|null}
 */
export function parseLatLngFromGoogleMapsUrl(url) {
  if (!url || typeof url !== "string") return null;
  const decoded = decodeURIComponent(url.trim());

  // /@lat,lng أو /@lat,lng,15z
  const atMatch = decoded.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)(?:,|\?|\/|$|&)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
  }

  // ?q=lat,lng أو &q=lat,lng
  const qMatch = decoded.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)(?:&|$)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
  }

  // نمط !3dlat!4dlng (مشاركة / تضمين)
  const dMatch = decoded.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) {
    const lat = parseFloat(dMatch[1]);
    const lng = parseFloat(dMatch[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
  }

  // ll=lat,lng
  const llMatch = decoded.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)(?:&|$)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lng = parseFloat(llMatch[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
  }

  return null;
}

/**
 * يأخذ أول إحداثيات صالحة من العناوين: من الحقل coordinates أو من رابط الخريطة.
 * @param {Array<{ map?: string, coordinates?: number[] }>} addressList
 * @returns {[number, number]|null}
 */
export function getCoordinatesFromAddresses(addressList) {
  if (!Array.isArray(addressList)) return null;
  for (const addr of addressList) {
    if (!addr) continue;
    const c = addr.coordinates;
    if (
      Array.isArray(c) &&
      c.length >= 2 &&
      !Number.isNaN(Number(c[0])) &&
      !Number.isNaN(Number(c[1]))
    ) {
      return [Number(c[0]), Number(c[1])];
    }
    const parsed = parseLatLngFromGoogleMapsUrl(addr.map || "");
    if (parsed) return parsed;
  }
  return null;
}
