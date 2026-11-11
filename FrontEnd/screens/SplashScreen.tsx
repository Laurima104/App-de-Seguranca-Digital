import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../routes/StackRoutes';
import { MatrixBackground, usePalette } from '../components/ui';
import { useAuth } from '../state/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export default function SplashScreen({ navigation }: Props) {
  const { user, isRestoring } = useAuth();
  const palette = usePalette();

  useEffect(() => {
    if (isRestoring) return undefined;
    const timer = setTimeout(() => navigation.replace(user ? 'Tabs' : 'Login'), 2200);
    return () => clearTimeout(timer);
  }, [isRestoring, navigation, user]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background, paddingHorizontal: 24 }}>
      <MatrixBackground />
      <Ionicons name="shield-outline" size={156} color={palette.accent} />
      <Text style={{ marginTop: 24, color: palette.accent, fontSize: 28, fontWeight: '800', textAlign: 'center' }}>Aplicativo{ '\n' }Educacional</Text>
    </View>
  );
}
