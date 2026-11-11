import React from 'react';
import { Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActionButton, AppScreen, AppText, Card } from '../components/ui';
import { usePreferences, type Preferences } from '../state/PreferencesContext';
import { useAuth } from '../state/AuthContext';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { preferences, updatePreferences } = usePreferences();
  const { signOut } = useAuth();
  const notificationOptions: { key: keyof Pick<Preferences, 'notifyStreak' | 'notifyEducation' | 'notifyAchievements'>; label: string }[] = [
    { key: 'notifyStreak', label: 'Lembretes de sequência de estudos' },
    { key: 'notifyEducation', label: 'Dicas educativas de segurança' },
    { key: 'notifyAchievements', label: 'Avisos de progresso e conquistas' },
  ];
  const logout = async () => {
    try {
      await signOut();
      navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      Alert.alert('Não foi possível sair', error instanceof Error ? error.message : 'Tente novamente.');
    }
  };

  return (
    <AppScreen title="Configurações">
      <Card>
        <AppText style={{ fontWeight: '700' }}>Segurança da conta</AppText>
        <AppText>Altere a senha ou encerre a sessão da sua conta.</AppText>
      </Card>
      <ActionButton label="Alterar senha" icon="lock-closed-outline" onPress={() => navigation.getParent()?.navigate('ForgotPassword')} />
      <Card>
        <AppText style={{ fontWeight: '700' }}>Notificações</AppText>
        {notificationOptions.map(option => (
          <Pressable key={option.key} onPress={() => updatePreferences({ [option.key]: !preferences[option.key] })} accessibilityRole="switch" accessibilityState={{ checked: preferences[option.key] }} style={{ minHeight: 52, borderBottomWidth: 1, borderBottomColor: '#9356F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <AppText style={{ flex: 1 }}>{option.label}</AppText>
            <AppText>{preferences[option.key] ? 'Ativada' : 'Desativada'}</AppText>
          </Pressable>
        ))}
        <AppText style={{ opacity: 0.8 }}>As escolhas ficam salvas neste dispositivo. O envio depende da integração do serviço de notificações.</AppText>
      </Card>
      <ActionButton label="Acessibilidade" icon="accessibility-outline" onPress={() => navigation.getParent()?.navigate('Accessibility')} />
      <ActionButton label="Personalizar aplicativo" icon="color-palette-outline" onPress={() => navigation.getParent()?.navigate('Accessibility')} />
      <ActionButton label="Ajuda" icon="help-circle-outline" variant="secondary" onPress={() => navigation.getParent()?.navigate('Help')} />
      <ActionButton label="Informações sobre o aplicativo" icon="information-circle-outline" variant="secondary" onPress={() => navigation.getParent()?.navigate('About')} />
      <ActionButton label="Sair" icon="log-out-outline" variant="secondary" onPress={logout} />
    </AppScreen>
  );
}
