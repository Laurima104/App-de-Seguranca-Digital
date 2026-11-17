import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { AuthShell, AppText, ActionButton, usePalette } from '../components/ui';
import { requestVerificationCode } from '../services/auth';
import { usePreferences } from '../state/PreferencesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const palette = usePalette();
  const { preferences } = usePreferences();

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('E-mail inválido', 'Informe o e-mail associado à sua conta.');
      return;
    }
    setSubmitting(true);
    try {
      await requestVerificationCode(email.trim(), 'recovery');
      navigation.navigate('EmailVerification', { email: email.trim(), purpose: 'recovery' });
    } catch (error) {
      Alert.alert('Recuperação indisponível', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Esqueci minha senha" onAccessibility={() => navigation.navigate('Accessibility')} onHelp={() => navigation.navigate('Help')} onBack={() => navigation.goBack()}>
      <AppText style={{ textAlign: 'center', fontSize: 20 * preferences.fontScale }}>Informe o e-mail associado à sua conta para receber um código de recuperação.</AppText>
      <View style={{ gap: 8 }}>
        <AppText>E-mail:</AppText>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" accessibilityLabel="E-mail da conta" placeholder="email@exemplo.com.br" placeholderTextColor={palette.muted} style={{ color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 1.5, borderRadius: 12, padding: 15, fontSize: 16 * preferences.fontScale }} />
      </View>
      <ActionButton label={submitting ? 'Enviando…' : 'Enviar e-mail'} icon="mail-outline" disabled={submitting} onPress={submit} />
      <PressableLogin onPress={() => navigation.navigate('Login')} />
    </AuthShell>
  );
}

function PressableLogin({ onPress }: { onPress: () => void }) {
  return <ActionButton label="Voltar para tela de acesso" variant="secondary" onPress={onPress} />;
}
