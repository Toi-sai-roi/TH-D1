import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Image source={require('../../assets/scr-sh/onboarding.png')} style={s.bg} resizeMode="cover" />
      <View style={s.content}>
        <Text style={s.title}>Welcome{'\n'}to our store</Text>
        <Text style={s.sub}>Get your groceries in as fast as one hour.</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.replace('/(auth)/sign-in')}>
          <Text style={s.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bg: { width: '100%', height: '60%' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sub: {
    fontSize: 15,
    color: '#888',
    lineHeight: 22,
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#4CAF6F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});