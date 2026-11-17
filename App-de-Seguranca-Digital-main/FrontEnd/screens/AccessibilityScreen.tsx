import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackRoutes';
import { ActionButton, AppScreen, AppText, Card, usePalette } from '../components/ui';
import { usePreferences } from '../state/PreferencesContext';
import { useAuth } from '../state/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Accessibility'>;
const fontOptions = [0.9, 1, 1.1, 1.2] as const;

export default function AccessibilityScreen({ navigation }: Props) {
  const { preferences, updatePreferences } = usePreferences();
  const palette = usePalette();
  const { user } = useAuth();
  const [leaving, setLeaving] = useState(false);

  const leaveAccessibility = () => {
    setLeaving(true);
    setTimeout(() => {
      const routes = navigation.getState().routes;
      const previousRoute = routes[routes.length - 2]?.name;
      const isLoginFlow = ['Login', 'SignUp', 'ForgotPassword', 'EmailVerification', 'RecoverAccount', 'RegistrationComplete'].includes(previousRoute ?? '');
      if (user || isLoginFlow) navigation.goBack();
      else navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 0);
  };

  usePreventRemove(!user && !leaving, leaveAccessibility);

  const finish = leaveAccessibility;

  return (
    <AppScreen title="Acessibilidade">
      <Card>
        <AppText style={{ fontWeight: '700' }}>Formatação de texto</AppText>
        <AppText>Escolha o tamanho do texto usado nas telas do aplicativo.</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {fontOptions.map(scale => (
            <Pressable key={scale} onPress={() => updatePreferences({ fontScale: scale })} accessibilityRole="radio" accessibilityState={{ selected: preferences.fontScale === scale }} accessibilityLabel={`Tamanho de texto ${Math.round(scale * 100)} por cento`} style={{ minWidth: 64, minHeight: 48, borderRadius: 10, borderWidth: 2, borderColor: preferences.fontScale === scale ? palette.accent : palette.border, backgroundColor: preferences.fontScale === scale ? palette.accent : palette.background, alignItems: 'center', justifyContent: 'center', padding: 8 }}>
              <AppText style={{ fontSize: 14, color: preferences.fontScale === scale ? (preferences.highContrast ? '#000000' : '#FFFFFF') : palette.text }}>{Math.round(scale * 100)}%</AppText>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <AppText style={{ fontWeight: '700' }}>Alto contraste</AppText>
        <AppText>Aumenta o contraste entre fundo, cartões, bordas e textos em todas as telas principais.</AppText>
        <Pressable onPress={() => updatePreferences({ highContrast: !preferences.highContrast })} accessibilityRole="switch" accessibilityState={{ checked: preferences.highContrast }} style={{ minHeight: 52, borderWidth: 2, borderColor: palette.border, backgroundColor: palette.background, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <AppText>{preferences.highContrast ? 'Ativado' : 'Desativado'}</AppText>
        </Pressable>
      </Card>
      <Card>
        <AppText style={{ fontWeight: '700' }}>Leitor de tela</AppText>
        <AppText>O VoiceOver e o TalkBack são controlados pelo próprio dispositivo.</AppText>
        <ActionButton label="Leitor de tela" icon="volume-high-outline" variant="secondary" onPress={() => Alert.alert('Leitor de tela', 'Use as configurações de acessibilidade do dispositivo. O controle do leitor de tela será integrado em uma etapa futura.')} />
      </Card>
      <Card>
        <AppText style={{ fontWeight: '700' }}>Tema visual</AppText>
        <AppText>Alterne entre tema escuro e claro em todo o aplicativo.</AppText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {(['dark', 'light'] as const).map(theme => (
            <Pressable key={theme} onPress={() => updatePreferences({ theme })} accessibilityRole="radio" accessibilityState={{ selected: preferences.theme === theme }} style={{ flex: 1, minHeight: 48, borderWidth: 2, borderColor: preferences.theme === theme ? palette.accent : palette.border, backgroundColor: preferences.theme === theme ? palette.accent : palette.background, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
              <AppText style={{ color: preferences.theme === theme ? (preferences.highContrast ? '#000000' : '#FFFFFF') : palette.text }}>{theme === 'dark' ? 'Escuro' : 'Claro'}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>
      <AppText style={{ opacity: 0.8 }}>As preferências visuais são salvas neste dispositivo e continuam aplicadas após o retorno ao login.</AppText>
      <ActionButton label="Concluir e voltar ao login" icon="arrow-back-outline" onPress={finish} />
    </AppScreen>
  );
}
