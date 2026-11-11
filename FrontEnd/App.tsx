import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { NavigationBar } from 'expo-navigation-bar';
import { StackRoutes } from './routes/StackRoutes';
import { PreferencesProvider, usePreferences } from './state/PreferencesContext';
import { AuthProvider } from './state/AuthContext';

function AppNavigation() {
  const { preferences } = usePreferences();
  return (
    <NavigationContainer>
      <StackRoutes />
      <StatusBar style={preferences.theme === 'light' ? 'dark' : 'light'} />
    </NavigationContainer>
  );
}

const App: React.FC = () => {
  useEffect(() => {
    if (Platform.OS === 'android') NavigationBar.setHidden(false);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PreferencesProvider>
          <AppNavigation />
        </PreferencesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
