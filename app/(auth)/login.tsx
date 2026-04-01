import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const canLogin = email && password;

  return (
    <View style={s.container}>
      <Text style={s.title}>Login</Text>
      <Text style={s.sub}>Enter your emails and password</Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={s.passRow}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(p => !p)} style={s.eyeBtn}>
          <Text style={s.eye}>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.forgot}>
        <Text style={s.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, !canLogin && s.btnDisabled]}
        disabled={!canLogin}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={s.btnText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={s.signupLink}>Don`t have an account? <Text style={s.signupBold}>Sign up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 16,
  },
  passRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  eyeBtn: { position: 'absolute', right: 16, top: 14 },
  eye: { fontSize: 18 },
  forgot: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotText: { color: '#4CAF6F', fontSize: 13 },
  btn: {
    backgroundColor: '#4CAF6F', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  signupLink: { textAlign: 'center', color: '#888', fontSize: 14 },
  signupBold: { color: '#4CAF6F', fontWeight: '600' },
});