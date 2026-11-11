import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScren';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { usePalette } from '../components/ui';

export type TabParamList = { Home: undefined; Profile: undefined; Settings: undefined };
const Tab = createBottomTabNavigator<TabParamList>();

export function TabRoutes() {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { height: 62 + insets.bottom, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 6), backgroundColor: palette.background, borderTopColor: palette.accent },
      tabBarActiveTintColor: palette.accent,
      tabBarInactiveTintColor: palette.text,
      tabBarLabelStyle: { fontSize: 11 },
      tabBarIcon: ({ color, size }) => {
        const icons = { Home: 'home-outline', Profile: 'person-outline', Settings: 'settings-outline' } as const;
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Tab.Navigator>
  );
}
