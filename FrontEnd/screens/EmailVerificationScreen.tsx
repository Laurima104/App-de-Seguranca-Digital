import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { AuthShell, AppText, ActionButton, usePalette } from '../components/ui';
import { requestVerificationCode, verifyEmailCode } from '../services/auth';
import { usePreferences } from '../state/PreferencesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailVerification'>;
export default function EmailVerificationScreen({ navigation, route }: Props) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const palette = usePalette();
  const { preferences } = usePreferences();
  const { email, purpose } = route.params;

  const submit = async () => {
    if (!/^\d{6}$/.test(code)) {
      Alert.alert('Código inválido', 'Digite o código de seis números enviado para o seu e-mail.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await verifyEmailCode(email, code, purpose);
      if (purpose === 'signup') navigation.replace('RegistrationComplete', { email });
      else if (result.recoveryToken) navigation.replace('RecoverAccount', { email, recoveryToken: result.recoveryToken });
      else throw new Error('A verificação não retornou o token necessário para redefinir a senha.');
    } catch (error) {
      Alert.alert('Verificação indisponível', error instanceof Error ? error.message : 'Confira o código e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      await requestVerificationCode(email, purpose);
      Alert.alert('Código enviado', `Um novo código foi solicitado para ${email}.`);
    } catch (error) {
      Alert.alert('Não foi possível reenviar', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    }
  };

  return (
    <AuthShell title="Verificação do E-mail" onAccessibility={() => navigation.navigate('Accessibility')} onHelp={() => navigation.navigate('Help')} onBack={() => navigation.goBack()}>
      <AppText style={{ textAlign: 'center', fontSize: 20 * preferences.fontScale }}>Digite o código de segurança enviado para {email}.</AppText>
      <View style={{ gap: 8 }}>
        <AppText>Código de segurança</AppText>
        <TextInput value={code} onChangeText={value => setCode(value.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" maxLength={6} accessibilityLabel="Código de segurança de seis dígitos" placeholder="000000" placeholderTextColor={palette.muted} style={{ color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 2, borderRadius: 14, padding: 16, fontSize: 24 * preferences.fontScale, letterSpacing: 8, textAlign: 'center' }} />
      </View>
      <ActionButton label={submitting ? 'Verificando…' : 'Continuar'} icon="arrow-forward-outline" disabled={submitting} onPress={submit} />
      <ActionButton label="Reenviar código" icon="refresh-outline" variant="secondary" onPress={resend} />
    </AuthShell>
  );
}
