import React, { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../routes/StackRoutes';
import { AuthShell, AppText, ActionButton, usePalette } from '../components/ui';
import { SignUpPayload, signUp } from '../services/auth';
import { usePreferences } from '../state/PreferencesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
export default function SignUpScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const palette = usePalette();
  const { preferences } = usePreferences();
  const inputStyle = { color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 * preferences.fontScale } as const;

  const submit = async () => {
    if (!displayName.trim() || !nickname.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !password || password !== confirmation || !acceptedTerms) {
      Alert.alert('Confira o cadastro', 'Preencha nome, nickname, e-mail válido e senhas iguais. Leia e aceite o Termo e a Política.');
      return;
    }
    setSubmitting(true);
    try {
      const payload: SignUpPayload = { displayName: displayName.trim(), nickname: nickname.trim(), email: email.trim(), password, acceptedTerms: true };
      await signUp(payload);
      navigation.navigate('EmailVerification', { email: email.trim(), purpose: 'signup' });
    } catch (error) {
      Alert.alert('Cadastro indisponível', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label: string, value: string, onChangeText: (text: string) => void, options: { placeholder: string; secure?: boolean; email?: boolean; password?: boolean }) => (
    <View style={{ gap: 6 }}>
      <AppText>{label}</AppText>
      <TextInput value={value} onChangeText={onChangeText} placeholder={options.placeholder} placeholderTextColor={palette.muted} secureTextEntry={options.secure && !showPassword} autoCapitalize={options.email ? 'none' : 'sentences'} keyboardType={options.email ? 'email-address' : options.password ? 'default' : 'default'} autoComplete={options.email ? 'email' : options.password ? 'new-password' : 'off'} style={[inputStyle, options.secure ? { paddingRight: 56 } : undefined]} />
    </View>
  );

  return (
    <AuthShell title="Faça o seu cadastro para começar" onAccessibility={() => navigation.navigate('Accessibility')} onHelp={() => navigation.navigate('Help')} onBack={() => navigation.goBack()}>
      {field('Nome de exibição:', displayName, setDisplayName, { placeholder: 'Seu nome' })}
      {field('Nickname:', nickname, setNickname, { placeholder: 'Como aparecerá no app' })}
      {field('E-mail:', email, setEmail, { placeholder: 'email@exemplo.com.br', email: true })}
      <View style={{ gap: 6 }}>
        <AppText>Senha:</AppText>
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          {field('', password, setPassword, { placeholder: 'Senha', secure: true, password: true })}
          <Pressable onPress={() => setShowPassword(current => !current)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} style={{ position: 'absolute', right: 12, bottom: 12, padding: 6 }}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color={palette.accent} /></Pressable>
        </View>
      </View>
      {field('Confirme a sua senha:', confirmation, setConfirmation, { placeholder: 'Repita a senha', secure: true, password: true })}
      <Pressable onPress={() => setAcceptedTerms(current => !current)} accessibilityRole="checkbox" accessibilityState={{ checked: acceptedTerms }} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 }}>
        <Ionicons name={acceptedTerms ? 'checkbox' : 'square-outline'} size={24} color={palette.accent} />
        <AppText style={{ flex: 1 }}>Li e aceito o <AppText onPress={() => navigation.navigate('LegalDocument', { document: 'consent' })} style={{ textDecorationLine: 'underline' }}>Termo de consentimento</AppText> e a <AppText onPress={() => navigation.navigate('LegalDocument', { document: 'privacy' })} style={{ textDecorationLine: 'underline' }}>Política de Privacidade</AppText>.</AppText>
      </Pressable>
      <ActionButton label={submitting ? 'Aguarde…' : 'Cadastrar'} icon="log-in-outline" disabled={submitting} onPress={submit} />
      <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button"><AppText style={{ textAlign: 'center', textDecorationLine: 'underline' }}>Voltar para tela de login</AppText></Pressable>
    </AuthShell>
  );
}
