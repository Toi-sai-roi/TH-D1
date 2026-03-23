import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Image source={require('../../assets/scr-sh/raucu_signin.png')} style={s.bg} resizeMode="cover" />

      <View style={s.content}>
        <Text style={s.title}>Get your groceries{'\n'}with nectar</Text>

        <TouchableOpacity style={[s.btn, s.google]} onPress={() => {}}>
          <Text style={s.btnText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, s.facebook]} onPress={() => {}}>
          <Text style={[s.btnText, { color: '#fff' }]}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/phone')}>
          <Text style={s.phoneLink}>Or connect with phone number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bg: { width: '100%', height: '45%' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  google: { backgroundColor: '#fff' },
  facebook: { backgroundColor: '#4267B2', borderColor: '#4267B2' },
  btnText: { fontWeight: '600', fontSize: 15, color: '#1a1a1a' },
  phoneLink: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
});