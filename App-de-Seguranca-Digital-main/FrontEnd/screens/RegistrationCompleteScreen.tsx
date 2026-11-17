import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { AuthShell, AppText, ActionButton } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrationComplete'>;
export default function RegistrationCompleteScreen({ navigation, route }: Props) {
  return (
    <AuthShell title="Cadastro concluído" onAccessibility={() => navigation.navigate('Accessibility')} onHelp={() => navigation.navigate('Help')}>
      <AppText style={{ textAlign: 'center' }}>O endereço {route.params.email} foi verificado. Agora você pode entrar na sua conta.</AppText>
      <ActionButton label="Ir para o login" icon="log-in-outline" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} />
    </AuthShell>
  );
}
