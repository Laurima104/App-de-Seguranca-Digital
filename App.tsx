import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native"
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StackRoutes } from './routes/StackRoutes'

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
