import React, { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../routes/StackRoutes';
import { AuthShell, AppText, ActionButton, usePalette } from '../components/ui';
import { useAuth } from '../state/AuthContext';
import { usePreferences } from '../state/PreferencesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const { preferences } = usePreferences();
  const palette = usePalette();

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim()) || !password) {
      Alert.alert('Confira seus dados', 'Informe um e-mail válido e a sua senha.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch (error) {
      Alert.alert('Não foi possível entrar', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 15, fontSize: 16 * preferences.fontScale } as const;

  return (
    <AuthShell title="Seja Bem-Vindo!" onAccessibility={() => navigation.navigate('Accessibility')} onHelp={() => navigation.navigate('Help')}>
      <View style={{ gap: 8 }}>
        <AppText>E-mail:</AppText>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" accessibilityLabel="E-mail" placeholder="email@exemplo.com.br" placeholderTextColor={palette.muted} style={inputStyle} />
      </View>
      <View style={{ gap: 8 }}>
        <AppText>Senha:</AppText>
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoComplete="password" textContentType="password" accessibilityLabel="Senha" placeholder="Senha" placeholderTextColor={palette.muted} style={[inputStyle, { paddingRight: 54 }]} />
          <Pressable onPress={() => setShowPassword(current => !current)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} style={{ position: 'absolute', right: 14, padding: 6 }}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color={palette.accent} />
          </Pressable>
        </View>
      </View>
      <Pressable onPress={() => navigation.navigate('ForgotPassword')} accessibilityRole="button"><AppText style={{ textDecorationLine: 'underline' }}>Esqueci minha senha</AppText></Pressable>
      <View style={{ flex: 1, minHeight: 8 }} />
      <ActionButton label={submitting ? 'Aguarde…' : 'Entrar'} icon="log-in-outline" disabled={submitting} onPress={submit} />
      <ActionButton label="Realizar cadastro" variant="secondary" onPress={() => navigation.navigate('SignUp')} />
      <ActionButton label="Sobre o aplicativo" icon="information-circle-outline" variant="secondary" onPress={() => navigation.navigate('About')} />
      <AppText style={{ textAlign: 'center', opacity: 0.85 }}>As contas serão autenticadas pelo serviço do projeto quando a API estiver conectada.</AppText>
    </AuthShell>
  );
}
