import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/scr-sh/onboarding.png')}
      style={s.bg}
      resizeMode="cover"
    >
      
      <View style={s.overlay} />
      <View style={s.content}>
        <Text style={s.icon}>🥕</Text>
        <Text style={s.title}>Welcome {'\n'} to our store</Text>
        <Text style={s.sub}>Get your groceries in as fast as one hour</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.replace('/(auth)/sign-in')}>
          <Text style={s.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  icon: { fontSize: 55, textAlign: 'center'},
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 8,
  },
  title: { fontSize: 40, fontWeight: '400', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  btn: {
    marginTop: 16,
    backgroundColor: '#4CAF6F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 20 },
});