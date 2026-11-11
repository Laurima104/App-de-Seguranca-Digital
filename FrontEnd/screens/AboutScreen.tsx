import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { ActionButton, AppScreen, AppText, Card } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;
export default function AboutScreen({ navigation }: Props) {
  return (
    <AppScreen title="Sobre o aplicativo">
      <Card>
        <AppText style={{ fontWeight: '700' }}>Aplicativo Educacional de Segurança Digital</AppText>
        <AppText>Aplicativo educacional voltado à conscientização sobre segurança digital e segurança da informação.</AppText>
      </Card>
      <AppText style={{ fontWeight: '700' }}>Documentos institucionais</AppText>
      <ActionButton label="Termo de consentimento" icon="document-text-outline" onPress={() => navigation.navigate('LegalDocument', { document: 'consent' })} />
      <ActionButton label="Política de privacidade" icon="shield-outline" variant="secondary" onPress={() => navigation.navigate('LegalDocument', { document: 'privacy' })} />
      <AppText style={{ opacity: 0.8 }}>Os documentos são exibidos integralmente conforme os arquivos fornecidos.</AppText>
      <ActionButton label="Voltar" icon="arrow-back-outline" variant="secondary" onPress={() => navigation.goBack()} />
    </AppScreen>
  );
}
