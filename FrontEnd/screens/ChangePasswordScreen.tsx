import React, { useEffect, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../routes/StackRoutes';
import { ActionButton, AppScreen, AppText, Card, usePalette } from '../components/ui';
import { useAuth } from '../state/AuthContext';
import { usePreferences } from '../state/PreferencesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen({ navigation }: Props) {
  const { user, changePassword } = useAuth();
  const { preferences } = usePreferences();
  const palette = usePalette();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputStyle = { color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 16 * preferences.fontScale } as const;

  useEffect(() => {
    if (!user) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [user, navigation]);

  const submit = async () => {
    if (!currentPassword || newPassword.length < 8 || newPassword !== confirmation) {
      Alert.alert('Confira as senhas', 'Informe sua senha atual, uma nova senha com pelo menos 8 caracteres e confirme a nova senha.');
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Senha alterada', 'Sua senha foi atualizada. Você continuará conectado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Não foi possível alterar a senha', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <AppScreen title="Alterar senha">
      <Card>
        <AppText>Confirme sua senha atual e escolha uma nova senha para sua conta.</AppText>
        <View style={{ gap: 8 }}>
          <AppText>Senha atual</AppText>
          <TextInput value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={!showPasswords} autoComplete="current-password" accessibilityLabel="Senha atual" placeholder="Digite sua senha atual" placeholderTextColor={palette.muted} style={inputStyle} />
        </View>
        <View style={{ gap: 8 }}>
          <AppText>Nova senha</AppText>
          <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry={!showPasswords} autoComplete="new-password" accessibilityLabel="Nova senha" placeholder="Mínimo de 8 caracteres" placeholderTextColor={palette.muted} style={inputStyle} />
        </View>
        <View style={{ gap: 8 }}>
          <AppText>Confirme a nova senha</AppText>
          <TextInput value={confirmation} onChangeText={setConfirmation} secureTextEntry={!showPasswords} autoComplete="new-password" accessibilityLabel="Confirmação da nova senha" placeholder="Repita a nova senha" placeholderTextColor={palette.muted} style={inputStyle} />
        </View>
        <Pressable onPress={() => setShowPasswords(value => !value)} accessibilityRole="button" accessibilityLabel={showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8 }}>
          <Ionicons name={showPasswords ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.accent} />
          <AppText>{showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}</AppText>
        </Pressable>
      </Card>
      <ActionButton label={saving ? 'Salvando…' : 'Salvar nova senha'} icon="lock-closed-outline" disabled={saving} onPress={submit} />
      <ActionButton label="Cancelar" variant="secondary" onPress={() => navigation.goBack()} />
    </AppScreen>
  );
}
