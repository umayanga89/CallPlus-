import { LocationInfo } from '../types';

export const SRI_LANKA_PRESET_LOCATIONS: { name: string; lat: number; lng: number }[] = [
  { name: 'Colombo 01 - Fort / World Trade Center', lat: 6.9338, lng: 79.8437 },
  { name: 'Colombo 03 - Kollupitiya', lat: 6.9064, lng: 79.8519 },
  { name: 'Rajagiriya - Corporate Hub, Colombo', lat: 6.9092, lng: 79.8953 },
  { name: 'Kandy - City Center (Dalada Veediya)', lat: 7.2906, lng: 80.6337 },
  { name: 'Negombo - Commercial Beach Road', lat: 7.2083, lng: 79.8358 },
  { name: 'Galle - Fort Historic Center', lat: 6.0329, lng: 80.2168 },
  { name: 'Gampaha - Town Center', lat: 7.0917, lng: 79.9999 },
  { name: 'Kurunegala - Clock Tower Junction', lat: 7.4863, lng: 80.3623 },
  { name: 'Matara - Beach Road Junction', lat: 5.9496, lng: 80.5469 },
];

export async function getCurrentDeviceLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser or device'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 10);

        let address = `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        // Attempt reverse geocoding via OpenStreetMap Nominatim for human address (non-blocking)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`, {
            headers: { 'Accept-Language': 'en' },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              const parts = data.display_name.split(',');
              address = parts.slice(0, 3).join(',').trim();
            }
          }
        } catch {
          // fallback to coordinate label
        }

        resolve({
          latitude: lat,
          longitude: lng,
          address,
          accuracyMeters: accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
