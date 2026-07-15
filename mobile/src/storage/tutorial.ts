import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_COMPLETE_KEY = '@canaboom/tutorial_complete_v1';

export async function isTutorialComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(TUTORIAL_COMPLETE_KEY)) === 'true';
}

export async function setTutorialComplete(): Promise<void> {
  await AsyncStorage.setItem(TUTORIAL_COMPLETE_KEY, 'true');
}
