import Constants from 'expo-constants';

/** Android-Emulator: 10.0.2.2 = Host-PC. iOS-Simulator: 127.0.0.1 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ||
  'http://127.0.0.1:8080';

export const APP_NAME = 'CanaBoom';
export const LEGAL = {
  founder: 'Inanna Roesner',
  email: 'inannaroesner07@gmail.com',
  address: 'Hauptstraße 40, 88677 Markdorf, Deutschland',
  brand: 'FINIX.AI / CanaBoom',
};
