import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences } from '../state/PreferencesContext';

export const colors = {
  background: '#110122', surface: '#4A3989', accent: '#9356F1', text: '#EDE9F8', muted: '#C9BEDD',
  border: '#9356F1', highBackground: '#000000', highSurface: '#111111', highText: '#FFFFFF',
};

export function usePalette() {
  const { preferences } = usePreferences();
  if (preferences.highContrast) return { background: colors.highBackground, surface: colors.highSurface, text: colors.highText, muted: colors.highText, accent: '#FFFFFF', border: '#FFFFFF' };
  if (preferences.theme === 'light') return { background: '#F5F0FC', surface: '#FFFFFF', text: '#24133A', muted: '#514263', accent: '#7138C8', border: '#7138C8' };
  return { background: colors.background, surface: colors.surface, text: colors.text, muted: colors.muted, accent: colors.accent, border: colors.border };
}

export function AppScreen({ title, children, scroll = true }: React.PropsWithChildren<{ title: string; scroll?: boolean }>) {
  const insets = useSafeAreaInsets();
  const { preferences } = usePreferences();
  const palette = usePalette();
  const background = palette.background;
  const content = (
    <View style={[styles.content, { paddingTop: Math.max(insets.top, 16) + 8, paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
      <Text accessibilityRole="header" style={[styles.title, { color: palette.text, fontSize: 26 * preferences.fontScale }]}>{title}</Text>
      {children}
    </View>
  );
  return scroll
    ? <ScrollView style={[styles.screen, { backgroundColor: background }]} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">{content}</ScrollView>
    : <View style={[styles.screen, { backgroundColor: background }]}>{content}</View>;
}

export function AppText({ children, style, ...props }: React.ComponentProps<typeof Text>) {
  const { preferences } = usePreferences();
  const palette = usePalette();
  return <Text {...props} style={[styles.text, { color: palette.text, fontSize: 16 * preferences.fontScale }, style]}>{children}</Text>;
}

export function ActionButton({ label, icon, onPress, variant = 'primary', accessibilityLabel, disabled }: {
  label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void;
  variant?: 'primary' | 'secondary'; accessibilityLabel?: string; disabled?: boolean;
}) {
  const { preferences } = usePreferences();
  const palette = usePalette();
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.button, { backgroundColor: variant === 'secondary' ? palette.background : palette.surface, borderColor: palette.border }, pressed && styles.pressed, disabled && { opacity: 0.55 }]}>
      {icon ? <Ionicons name={icon} size={20} color={palette.text} /> : null}
      <Text style={[styles.buttonText, { color: palette.text, fontSize: 15 * preferences.fontScale }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children }: React.PropsWithChildren) {
  const palette = usePalette();
  return <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>{children}</View>;
}

export function AuthShell({ title, children, onAccessibility, onHelp, onBack }: React.PropsWithChildren<{
  title: string; onAccessibility: () => void; onHelp: () => void; onBack?: () => void;
}>) {
  const insets = useSafeAreaInsets();
  const { preferences } = usePreferences();
  const palette = usePalette();
  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <MatrixBackground />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.authScroll, { paddingTop: Math.max(24, insets.top + 12), paddingBottom: 112 + insets.bottom }]}>
        {onBack ? <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar" style={[styles.backButton, { backgroundColor: palette.accent }]}><Ionicons name="arrow-back" size={22} color={palette.background} /></Pressable> : null}
        <Text accessibilityRole="header" style={[styles.authTitle, { color: palette.accent, fontSize: 34 * preferences.fontScale }]}>{title}</Text>
        <View style={styles.authBody}>{children}</View>
      </ScrollView>
      <View style={[styles.authFooter, { bottom: Math.max(insets.bottom, 18) }]}>
        <Pressable onPress={onAccessibility} accessibilityRole="button" accessibilityLabel="Acessibilidade" style={[styles.roundButton, { backgroundColor: palette.accent }]}><Ionicons name="accessibility" size={28} color={palette.background} /></Pressable>
        <Pressable onPress={onHelp} accessibilityRole="button" accessibilityLabel="Ajuda" style={[styles.roundButton, { backgroundColor: palette.accent }]}><Ionicons name="help" size={28} color={palette.background} /></Pressable>
      </View>
    </View>
  );
}

export function MatrixBackground() {
  const streams = [
    { left: '3%', top: -70, text: '0\n1\n0\n0\n1\n0\n1\n0\n1\n0' },
    { left: '18%', top: 20, text: '1\n0\n0\n1\n0\n1\n0\n0\n1' },
    { left: '40%', top: -120, text: '0\n0\n1\n0\n1\n0\n0\n1\n0\n1' },
    { left: '62%', top: -10, text: '1\n0\n1\n0\n0\n1\n0\n1\n0' },
    { left: '82%', top: -110, text: '0\n1\n0\n1\n0\n0\n1\n0\n1\n0' },
  ];
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {streams.map((stream, index) => (
        <Text key={index} style={{ position: 'absolute', left: stream.left as `${number}%`, top: stream.top, color: '#6929A5', opacity: 0.2, fontSize: 38, lineHeight: 54, fontFamily: 'monospace' }}>{stream.text}</Text>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1 }, scrollContent: { flexGrow: 1 }, content: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 20, gap: 16 },
  title: { fontWeight: '700', textAlign: 'center', marginBottom: 8 }, text: { lineHeight: 25 },
  button: { minHeight: 54, width: '100%', paddingHorizontal: 16, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 2, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  secondary: { backgroundColor: colors.background }, highButton: { backgroundColor: '#000', borderColor: '#FFF' }, buttonText: { fontWeight: '600', textAlign: 'center' }, pressed: { opacity: 0.7 },
  card: { width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, gap: 12 }, highCard: { backgroundColor: colors.highSurface, borderColor: '#FFF' },
  authScroll: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 18, gap: 16 },
  authBody: { flex: 1, gap: 14 }, authTitle: { fontWeight: '800', textAlign: 'center', marginVertical: 18, letterSpacing: 0.5 },
  authFooter: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  roundButton: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  backButton: { width: 54, height: 54, borderRadius: 14, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center' },
});
