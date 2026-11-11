import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { ActionButton, AppScreen, AppText, Card, usePalette } from '../components/ui';
import { useAuth } from '../state/AuthContext';
import { LearningLevel, hasLearningApi, listLevels } from '../services/learning';
import { readSessionTokens } from '../services/sessionStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Levels'>;
export default function LevelsScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const palette = usePalette();
  const focusCurrent = route.params.focusCurrent;
  const [levels, setLevels] = useState<LearningLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    const load = async () => {
      if (!user) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }
      if (!hasLearningApi()) {
        setError('Os níveis serão carregados quando a API de aprendizagem estiver conectada.');
        setLoading(false);
        return;
      }
      try {
        const { accessToken } = await readSessionTokens();
        if (!accessToken) throw new Error('Sua sessão expirou. Entre novamente.');
        const result = await listLevels(user.id, accessToken);
        if (active) {
          setLevels(result);
          setSelectedId(focusCurrent ? result.find(level => level.current)?.id ?? null : null);
          setError(null);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os níveis.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [focusCurrent, navigation, user]));

  const selected = levels.find(level => level.id === selectedId);

  return (
    <AppScreen title={focusCurrent ? 'Continuar nível atual' : 'Níveis'}>
      {loading ? <ActivityIndicator accessibilityLabel="Carregando níveis" color={palette.accent} /> : null}
      {error ? <Card><AppText>{error}</AppText></Card> : null}
      {!loading && !error && levels.length === 0 ? <Card><AppText>Nenhum nível foi retornado para esta conta.</AppText></Card> : null}
      {levels.map(level => {
        const progress = Math.max(0, Math.min(100, level.progressPercent));
        return (
          <Pressable key={level.id} onPress={() => level.locked ? Alert.alert('Nível bloqueado', 'Conclua os requisitos dos níveis anteriores para acessá-lo.') : setSelectedId(level.id)} accessibilityRole="button" accessibilityState={{ disabled: level.locked, selected: selectedId === level.id }}>
            <Card>
              <AppText style={{ fontWeight: '700' }}>{level.title}{level.current ? ' • Atual' : ''}{level.locked ? ' • Bloqueado' : ''}</AppText>
              <AppText>{level.description}</AppText>
              <View style={{ height: 12, padding: 2, backgroundColor: palette.background, borderRadius: 10, borderWidth: 1, borderColor: palette.border }}><View style={{ height: '100%', width: `${progress}%`, backgroundColor: palette.accent, borderRadius: 8 }} /></View>
              <AppText>{progress}% concluído</AppText>
            </Card>
          </Pressable>
        );
      })}
      {selected ? <Card><AppText style={{ fontWeight: '700' }}>{selected.title}</AppText><AppText>{selected.description}</AppText><AppText>O conteúdo didático do nível será aberto pela integração da área de aprendizagem.</AppText></Card> : null}
      <ActionButton label="Voltar" icon="arrow-back-outline" variant="secondary" onPress={() => navigation.goBack()} />
    </AppScreen>
  );
}
