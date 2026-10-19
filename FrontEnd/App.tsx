import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native"
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StackRoutes } from './routes/StackRoutes'
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const App: React.FC = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('sticky-immersive');
    }
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackRoutes />
        <StatusBar style='light'/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
