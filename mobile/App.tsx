import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AttackPreparationProvider } from './src/context/AttackPreparationContext';
import { ArsenalProvider } from './src/context/ArsenalContext';
import { BaseProvider } from './src/context/BaseContext';
import { ResourceProvider } from './src/context/ResourceContext';
import type { RootStackParamList } from './src/navigation/types';
import GameScreen from './src/screens/GameScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import MainScreen from './src/screens/MainScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#09052d' },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <ResourceProvider>
        <BaseProvider>
          <AttackPreparationProvider>
            <ArsenalProvider>
              <NavigationContainer theme={theme}>
                <StatusBar hidden />
                <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                  <Stack.Screen name="Loading" component={LoadingScreen} />
                  <Stack.Screen name="Main" component={MainScreen} />
                  <Stack.Screen name="Game" component={GameScreen} options={{ animation: 'slide_from_right' }} />
                </Stack.Navigator>
              </NavigationContainer>
            </ArsenalProvider>
          </AttackPreparationProvider>
        </BaseProvider>
      </ResourceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
