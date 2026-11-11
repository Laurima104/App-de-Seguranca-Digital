import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { ActionButton, AppScreen, AppText, Card } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;
export default function HelpScreen({ navigation }: Props) {
  return (
    <AppScreen title="Ajuda">
      <Card><AppText>O conteúdo de ajuda ainda não foi disponibilizado pela equipe do projeto.</AppText></Card>
      <ActionButton label="Voltar" icon="arrow-back-outline" onPress={() => navigation.goBack()} />
    </AppScreen>
  );
}
