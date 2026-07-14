import Constants from 'expo-constants';

/** Android-Emulator: 10.0.2.2 = Host-PC. Production: Render-URL */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ||
  'https://canaboom.onrender.com';

export const APP_NAME = 'CanaBoom';
export const LEGAL = {
  founder: 'Inanna Roesner',
  email: 'inannaroesner07@gmail.com',
  address: 'Hauptstraße 40, 88677 Markdorf, Deutschland',
  brand: 'FINIX.AI / CanaBoom',
};
