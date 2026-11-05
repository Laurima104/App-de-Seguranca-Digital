import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StackRoutes } from './routes/StackRoutes'
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';

const App: React.FC = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setHidden(false);
      //NavigationBar.setStyle('');
    }
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackRoutes />
        <StatusBar style='light'/>
        <NavigationBar style='inverted'/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
