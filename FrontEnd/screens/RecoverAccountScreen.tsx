import React, { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../routes/StackRoutes';
import { AuthShell, AppText, ActionButton, usePalette } from '../components/ui';
import { resetPassword } from '../services/auth';
import { usePreferences } from '../state/PreferencesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RecoverAccount'>;
export default function RecoverAccountScreen({ navigation, route }: Props) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const palette = usePalette();
  const { preferences } = usePreferences();
  const inputStyle = { color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 1.5, borderRadius: 12, padding: 15, fontSize: 16 * preferences.fontScale } as const;

  const submit = async () => {
    if (!password || password !== confirmation) {
      Alert.alert('Confira a senha', 'Informe a nova senha e repita a mesma senha no campo de confirmação.');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(route.params.email, route.params.recoveryToken, password);
      Alert.alert('Senha alterada', 'Agora você pode entrar com a nova senha.');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      Alert.alert('Não foi possível alterar a senha', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Recuperar conta" onAccessibility={() => navigation.navigate('Accessibility')} onHelp={() => navigation.navigate('Help')} onBack={() => navigation.goBack()}>
      <AppText style={{ textAlign: 'center' }}>Defina uma nova senha para {route.params.email}.</AppText>
      <View style={{ gap: 7 }}>
        <AppText>Nova senha:</AppText>
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoComplete="new-password" accessibilityLabel="Nova senha" placeholder="Nova senha" placeholderTextColor={palette.muted} style={[inputStyle, { paddingRight: 56 }]} />
          <Pressable onPress={() => setShowPassword(current => !current)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} style={{ position: 'absolute', right: 14, padding: 6 }}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color={palette.accent} /></Pressable>
        </View>
      </View>
      <View style={{ gap: 7 }}>
        <AppText>Confirme a nova senha:</AppText>
        <TextInput value={confirmation} onChangeText={setConfirmation} secureTextEntry={!showPassword} autoComplete="new-password" accessibilityLabel="Confirmação da nova senha" placeholder="Repita a nova senha" placeholderTextColor={palette.muted} style={inputStyle} />
      </View>
      <ActionButton label={submitting ? 'Salvando…' : 'Salvar nova senha'} icon="save-outline" disabled={submitting} onPress={submit} />
    </AuthShell>
  );
}
