import AsyncStorage from '@react-native-async-storage/async-storage';

const AGE_KEY = 'canaboom_age_verified_18';

export async function isAgeVerified(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(AGE_KEY);
    return v === 'true';
  } catch {
    return false;
  }
}

export async function setAgeVerified(): Promise<void> {
  await AsyncStorage.setItem(AGE_KEY, 'true');
}

export async function clearAgeVerification(): Promise<void> {
  await AsyncStorage.removeItem(AGE_KEY);
}
