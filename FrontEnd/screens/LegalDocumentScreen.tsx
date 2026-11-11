import React from 'react';
import { Image, ScrollView, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/StackRoutes';
import { ActionButton, AppScreen, AppText, Card } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'LegalDocument'>;
const consentPages = [
  require('../assets/documents/consent-1.png'), require('../assets/documents/consent-2.png'), require('../assets/documents/consent-3.png'), require('../assets/documents/consent-4.png'), require('../assets/documents/consent-5.png'),
];
const privacyPages = [
  require('../assets/documents/privacy-1.png'), require('../assets/documents/privacy-2.png'), require('../assets/documents/privacy-3.png'), require('../assets/documents/privacy-4.png'), require('../assets/documents/privacy-5.png'), require('../assets/documents/privacy-6.png'), require('../assets/documents/privacy-7.png'), require('../assets/documents/privacy-8.png'), require('../assets/documents/privacy-9.png'),
];

export default function LegalDocumentScreen({ route, navigation }: Props) {
  const { width } = useWindowDimensions();
  const isConsent = route.params.document === 'consent';
  const pages = isConsent ? consentPages : privacyPages;
  const title = isConsent ? 'Termo de consentimento' : 'Política de privacidade';
  const pageWidth = Math.min(width - 36, 540);
  return (
    <AppScreen title={title}>
      <AppText>Documento integral, reproduzido página a página a partir do PDF fornecido.</AppText>
      <Card>
        <ScrollView nestedScrollEnabled style={{ maxHeight: 620 }}>
          {pages.map((source, index) => (
            <Image key={index} source={source} resizeMode="contain" accessibilityLabel={`${title}, página ${index + 1} de ${pages.length}`} style={{ width: pageWidth, height: pageWidth * 1.42, alignSelf: 'center' }} />
          ))}
        </ScrollView>
      </Card>
      <ActionButton label="Voltar" icon="arrow-back-outline" variant="secondary" onPress={() => navigation.goBack()} />
    </AppScreen>
  );
}
