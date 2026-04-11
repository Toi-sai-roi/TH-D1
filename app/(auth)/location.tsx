import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function LocationScreen() {
  const router = useRouter();
  const [zone, setZone] = useState('');
  const [area, setArea] = useState('');
  const isValid = zone.trim().length > 0 && area.trim().length > 0;

  return (
    <View style={s.container}>
      <Image source={require("../../assets/scr-sh/location.png")} style={s.img} resizeMode="contain" />

      <Text style={s.title}>Select Your Location</Text>
      <Text style={s.sub}>Switch on your location to stay in tune with what`s happening in your area.</Text>

      <Text style={s.label}>Your Zone</Text>
      <TextInput style={s.input} placeholder="e.g. Banasee" value={zone} onChangeText={setZone} />

      <Text style={s.label}>Your Area</Text>
      <TextInput style={s.input} placeholder="Type of your area" value={area} onChangeText={setArea} />

      <TouchableOpacity
        style={[s.btn, !isValid && s.btnDisabled]}
        disabled={!isValid}
        onPress={() => {
          if (!isValid) return; 
          router.replace('/(auth)/login');
        }}
      >
        <Text style={s.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 48, alignItems: 'center' },
  img: { width: 180, height: 180, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  label: { alignSelf: 'flex-start', fontSize: 13, color: '#888', marginBottom: 4 },
  input: {
    width: '100%', borderWidth: 1, borderColor: '#eee',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, marginBottom: 16,
  },
  btn: {
    marginTop: 8, width: '100%', backgroundColor: '#4CAF6F',
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});