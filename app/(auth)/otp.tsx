import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function OtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const handleChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) refs[idx + 1].current?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  };

  const filled = otp.every(d => d !== '');

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.back}>
        <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
      </TouchableOpacity>

      <Text style={s.title}>Enter your 4-digit code</Text>
      <Text style={s.sub}>Code</Text>

      <View style={s.otpRow}>
        {otp.map((d, i) => (
          <TextInput
            key={i}
            ref={refs[i]}
            style={s.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={d}
            onChangeText={v => handleChange(v, i)}
            onKeyPress={e => handleKeyPress(e, i)}
          />
        ))}
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={s.resend}>Resend Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, !filled && s.btnDisabled]}
        disabled={!filled}
        onPress={() => router.push('/(auth)/location')}
      >
        <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 60 },
  back: { marginBottom: 32 },
  backText: { fontSize: 22, color: '#1a1a1a' },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', marginBottom: 32 },
  otpRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  otpInput: {
    width: 56, height: 56,
    borderBottomWidth: 2, borderColor: '#4CAF6F',
    textAlign: 'center', fontSize: 22, fontWeight: '700',
  },
  resend: { color: '#4CAF6F', fontSize: 14, marginBottom: 40 },
  btn: {
    backgroundColor: '#4CAF6F',
    borderRadius: 50,
    width: 56, height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontSize: 22, fontWeight: '700' },
});