import Constants from 'expo-constants';

/** Lokal: PC-LAN-IP. Android-Emulator: 10.0.2.2:8080 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ||
  'http://192.168.0.215:8080';

export const APP_NAME = 'CanaBoom';
export const LEGAL = {
  founder: 'Inanna Roesner',
  email: 'inannaroesner07@gmail.com',
  address: 'Hauptstraße 40, 88677 Markdorf, Deutschland',
  brand: 'FINIX.AI / CanaBoom',
};
