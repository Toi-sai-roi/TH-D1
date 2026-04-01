import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 3000);
    return () => clearTimeout(t);
  },  []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={s.container}>
      <Text style={s.icon}>🥕</Text>
      <Text style={s.title}>nectar</Text>
      <Text style={s.sub}>online groceries</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF6F',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  icon: { fontSize: 64 },
  title: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  sub: { fontSize: 14, color: '#fff', opacity: 0.8 },
});