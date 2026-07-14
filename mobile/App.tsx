import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AgeGateScreen from './src/screens/AgeGateScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import LegalScreen from './src/screens/LegalScreen';
import { isAgeVerified } from './src/storage/ageGate';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#050810', card: '#0a0f1a', primary: '#7c3aed' },
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    isAgeVerified().then((v) => {
      setVerified(v);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050810', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'fade' }}
          initialRouteName={verified ? 'Home' : 'AgeGate'}
        >
          <Stack.Screen name="AgeGate" component={AgeGateScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} options={{ orientation: 'landscape' as const }} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="Legal" component={LegalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
