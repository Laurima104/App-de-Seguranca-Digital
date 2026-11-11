import { useEffect } from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabRoutes } from './TabRoutes';
import LoginScreen from '../screens/Login';
import SplashScreen from '../screens/SplashScreen';
import AccessibilityScreen from '../screens/AccessibilityScreen';
import AboutScreen from '../screens/AboutScreen';
import LegalDocumentScreen from '../screens/LegalDocumentScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import RecoverAccountScreen from '../screens/RecoverAccountScreen';
import RegistrationCompleteScreen from '../screens/RegistrationCompleteScreen';
import HelpScreen from '../screens/HelpScreen';
import LevelsScreen from '../screens/LevelsScreen';
import { useAuth } from '../state/AuthContext';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  EmailVerification: { email: string; purpose: 'signup' | 'recovery' };
  RecoverAccount: { email: string; recoveryToken: string };
  RegistrationComplete: { email: string };
  Help: undefined;
  Tabs: undefined;
  Levels: { focusCurrent: boolean };
  Accessibility: undefined;
  About: undefined;
  LegalDocument: { document: 'privacy' | 'consent' };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function ProtectedTabs({ navigation }: NativeStackScreenProps<RootStackParamList, 'Tabs'>) {
  const { user, isRestoring } = useAuth();
  useEffect(() => {
    if (!user && !isRestoring) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [user, isRestoring, navigation]);
  return user ? <TabRoutes /> : null;
}

export function StackRoutes() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="RecoverAccount" component={RecoverAccountScreen} />
      <Stack.Screen name="RegistrationComplete" component={RegistrationCompleteScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Tabs" component={ProtectedTabs} />
      <Stack.Screen name="Levels" component={LevelsScreen} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="LegalDocument" component={LegalDocumentScreen} />
    </Stack.Navigator>
  );
}
