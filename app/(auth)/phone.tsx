import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.back}>
        <Text style={s.backText}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={s.title}>Enter your mobile number</Text>

      <View style={s.inputRow}>
        <View style={s.flag}>
          <Text style={s.flagText}>🇻🇳 +84</Text>
        </View>
        <TextInput
          style={s.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity
        style={[s.btn, !phone && s.btnDisabled]}
        disabled={!phone}
        onPress={() => router.push('/(auth)/otp')}
      >
        <Text style={s.btnText}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 60 },
  back: { marginBottom: 32 },
  backText: { fontSize: 22, color: '#1a1a1a' },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 32 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 40 },
  flag: { paddingRight: 12 },
  flagText: { fontSize: 15, color: '#1a1a1a' },
  input: { flex: 1, fontSize: 16, paddingVertical: 10 },
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