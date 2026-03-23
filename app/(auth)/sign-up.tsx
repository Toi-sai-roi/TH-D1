import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const canSignup = username && email && password;

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Sign Up</Text>
      <Text style={s.sub}>Enter your credentials to continue</Text>

      <Text style={s.label}>Username</Text>
      <TextInput style={s.input} placeholder="e.g. Afsar Hossen" value={username} onChangeText={setUsername} />

      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input} placeholder="mshuvo97@gmail.com"
        keyboardType="email-address" autoCapitalize="none"
        value={email} onChangeText={setEmail}
      />

      <Text style={s.label}>Password</Text>
      <View style={s.passRow}>
        <TextInput
          style={[s.input, { flex: 1, marginBottom: 0 }]}
          placeholder="••••••••"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(p => !p)} style={s.eyeBtn}>
          <Text style={s.eye}>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.terms}>
        By continuing you agree to our{' '}
        <Text style={s.link}>Terms of Service</Text> and{' '}
        <Text style={s.link}>Privacy Policy</Text>
      </Text>

      <TouchableOpacity
        style={[s.btn, !canSignup && s.btnDisabled]}
        disabled={!canSignup}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={s.btnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={s.loginLink}>Already have an account? <Text style={s.loginBold}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', marginBottom: 32 },
  label: { fontSize: 13, color: '#888', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 20,
  },
  passRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  eyeBtn: { position: 'absolute', right: 16 },
  eye: { fontSize: 18 },
  terms: { fontSize: 12, color: '#888', lineHeight: 18, marginBottom: 24 },
  link: { color: '#4CAF6F' },
  btn: {
    backgroundColor: '#4CAF6F', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loginLink: { textAlign: 'center', color: '#888', fontSize: 14 },
  loginBold: { color: '#4CAF6F', fontWeight: '600' },
});