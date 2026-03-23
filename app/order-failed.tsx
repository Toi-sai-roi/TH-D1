import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OrderFailedScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Ionicons name="close-circle" size={100} color="#f44336" />
      </View>

      <Text style={s.title}>Oops! Order Failed</Text>
      <Text style={s.sub}>Something went terribly wrong.</Text>

      <TouchableOpacity style={s.retryBtn} onPress={() => router.replace('../checkout')}>
        <Text style={s.retryText}>Please Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('../(tabs)')}>
        <Text style={s.homeText}>Back to home</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconWrap: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: 12 },
  sub: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  retryBtn: { width: '100%', backgroundColor: '#4CAF6F', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  retryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  homeBtn: { width: '100%', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  homeText: { color: '#1a1a1a', fontWeight: '600', fontSize: 16 },
});