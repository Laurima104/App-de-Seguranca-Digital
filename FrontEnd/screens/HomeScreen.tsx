import React from 'react';
import { Image, View } from 'react-native';
import { AppScreen, AppText, ActionButton, Card, usePalette } from '../components/ui';
import { useAuth } from '../state/AuthContext';
import { RootStackParamList } from '../routes/StackRoutes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const palette = usePalette();
  const progress = user?.levelProgress == null ? null : Math.max(0, Math.min(100, user.levelProgress));
  return (
    <AppScreen title="Início">
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Image source={user?.photoUri ? { uri: user.photoUri } : require('../assets/img/generic-user.png')} style={{ width: 54, height: 54, borderRadius: 14 }} accessibilityLabel="Foto de perfil" />
          <View style={{ flex: 1, gap: 4 }}>
            <AppText style={{ fontWeight: '700' }}>Bem-vindo, {user?.nickname ?? user?.displayName}!</AppText>
            <AppText style={{ opacity: 0.8 }}>Continue aprendendo sobre segurança digital.</AppText>
          </View>
        </View>
      </Card>
      <Card>
        <AppText style={{ fontWeight: '700' }}>Progresso atual{user?.currentLevel ? ` • ${user.currentLevel}` : ''}</AppText>
        <View accessibilityRole="progressbar" accessibilityValue={progress == null ? undefined : { min: 0, max: 100, now: progress }} accessibilityLabel="Progresso atual" style={{ height: 18, padding: 3, backgroundColor: palette.background, borderRadius: 12, borderColor: palette.border, borderWidth: 1 }}>
          <View style={{ height: '100%', width: `${progress ?? 0}%`, backgroundColor: palette.accent, borderRadius: 9 }} />
        </View>
        <AppText>{progress == null ? 'O progresso do seu módulo aparecerá aqui.' : `${progress}% concluído`}</AppText>
        {user?.levelDescription ? <AppText>{user.levelDescription}</AppText> : <AppText style={{ opacity: 0.8 }}>A descrição do nível será carregada com os dados da sua conta.</AppText>}
      </Card>
      <ActionButton label="Continuar nível atual" icon="play-outline" onPress={() => navigation.navigate('Levels', { focusCurrent: true })} />
      <ActionButton label="Níveis" icon="layers-outline" variant="secondary" onPress={() => navigation.navigate('Levels', { focusCurrent: false })} />
    </AppScreen>
  );
};

export default HomeScreen;
