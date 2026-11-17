import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { ActionButton, AppScreen, AppText, Card, usePalette } from '../components/ui';
import { useAuth } from '../state/AuthContext';
import { usePreferences } from '../state/PreferencesContext';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, saveProfile } = useAuth();
  const { preferences } = usePreferences();
  const palette = usePalette();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [photoUri, setPhotoUri] = useState<string | null>(user?.photoUri ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [user, navigation]);

  if (!user) return null;
  const progress = user.levelProgress == null ? null : Math.max(0, Math.min(100, user.levelProgress));
  const profilePhoto = photoUri ?? user.photoUri;
  const inputStyle = { color: palette.text, backgroundColor: palette.background, borderColor: palette.accent, borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 16 * preferences.fontScale } as const;

  const submit = async () => {
    if (!displayName.trim() || !nickname.trim()) {
      Alert.alert('Confira os dados', 'Nome e nickname não podem ficar vazios.');
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ displayName: displayName.trim(), nickname: nickname.trim(), photoUri });
      setEditing(false);
      Alert.alert('Perfil atualizado', 'As alterações foram salvas na sua conta.');
    } catch (error) {
      Alert.alert('Não foi possível salvar', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  const choosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (!result.canceled) setPhotoUri(result.assets[0]?.uri ?? null);
    } catch {
      Alert.alert('Não foi possível abrir as fotos', 'Tente novamente ou confira as permissões do dispositivo.');
    }
  };

  return (
    <AppScreen title="Perfil do usuário">
      <Card>
        <Image source={profilePhoto ? { uri: profilePhoto } : require('../assets/img/generic-user.png')} style={{ width: 76, height: 76, alignSelf: 'center', borderRadius: 20 }} accessibilityLabel="Foto do perfil" />
        <AppText style={{ textAlign: 'center', fontWeight: '700' }}>{user.displayName}</AppText>
        <AppText style={{ textAlign: 'center' }}>@{user.nickname}</AppText>
        <AppText style={{ textAlign: 'center', opacity: 0.8 }}>{user.email}</AppText>
        <AppText>{user.currentLevel ? `Nível: ${user.currentLevel}` : 'Nível será carregado pela sua conta.'}</AppText>
        <View accessibilityRole="progressbar" accessibilityValue={progress == null ? undefined : { min: 0, max: 100, now: progress }} accessibilityLabel="Progresso do nível" style={{ height: 16, padding: 3, backgroundColor: palette.background, borderRadius: 12, borderColor: palette.border, borderWidth: 1 }}>
          <View style={{ height: '100%', width: `${progress ?? 0}%`, backgroundColor: palette.accent, borderRadius: 9 }} />
        </View>
        <AppText>{progress == null ? 'Progresso aguardando dados do módulo.' : `${progress}% do nível atual`}</AppText>
      </Card>
      <ActionButton label="Editar perfil" icon="create-outline" onPress={() => { setDisplayName(user.displayName); setNickname(user.nickname); setPhotoUri(user.photoUri ?? null); setEditing(true); }} />
      <Card>
        <AppText style={{ fontWeight: '700' }}>Estatísticas</AppText>
        <AppText>{user.streakDays == null ? 'Dias de sequência: aguardando dados da conta.' : `Dias de sequência: ${user.streakDays}`}</AppText>
        <AppText>{user.totalXp == null ? 'Experiência total: aguardando dados da conta.' : `Experiência: ${user.totalXp} XP`}</AppText>
        <AppText>Sequência semanal de atividades</AppText>
        <View style={{ minHeight: 78, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8 }}>
          {(user.weeklyActivity ?? [null, null, null, null, null, null, null]).map((value, index) => {
            const values = user.weeklyActivity ?? [];
            const maxValue = Math.max(1, ...values);
            const height = value == null ? 5 : Math.max(8, (value / maxValue) * 56);
            return <View key={index} style={{ flex: 1, alignItems: 'center', gap: 4 }}><View accessibilityLabel={value == null ? 'Sem dados' : `${value} atividades`} style={{ height, width: '75%', backgroundColor: value == null ? palette.background : palette.accent, borderRadius: 6 }} /><AppText style={{ fontSize: 12 }}>{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][index]}</AppText></View>;
          })}
        </View>
      </Card>
      <Modal visible={editing} transparent animationType="fade" onRequestClose={() => setEditing(false)}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#000A' }}>
          <Card>
            <AppText style={{ fontWeight: '700' }}>Editar perfil</AppText>
            <Image source={photoUri ? { uri: photoUri } : require('../assets/img/generic-user.png')} style={{ width: 72, height: 72, alignSelf: 'center', borderRadius: 20 }} accessibilityLabel="Prévia da foto de perfil" />
            <ActionButton label="Escolher foto" icon="image-outline" variant="secondary" onPress={choosePhoto} />
            <AppText>Nome de exibição</AppText>
            <TextInput value={displayName} onChangeText={setDisplayName} accessibilityLabel="Nome de exibição" style={inputStyle} />
            <AppText>Nickname</AppText>
            <TextInput value={nickname} onChangeText={setNickname} autoCapitalize="none" accessibilityLabel="Nickname" style={inputStyle} />
            <ActionButton label={saving ? 'Salvando…' : 'Salvar alterações'} disabled={saving} onPress={submit} />
            <ActionButton label="Cancelar" variant="secondary" onPress={() => setEditing(false)} />
          </Card>
        </View>
      </Modal>
    </AppScreen>
  );
}
