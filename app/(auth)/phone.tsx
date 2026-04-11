import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const isValid = /^(03|05|07|08|09)\d{8}$/.test(phone.trim());

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
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
          onChangeText={(text) => {
            // ✅ chỉ cho nhập số
            const cleaned = text.replace(/[^0-9]/g, '');
            setPhone(cleaned);
          }}
          maxLength={10}
        />
      </View>

      <TouchableOpacity
        style={[s.btn, !isValid && s.btnDisabled]} 
        disabled={!isValid} 
        onPress={() => router.push('/(auth)/otp')}
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