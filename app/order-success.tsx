import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function OrderSuccessScreen() {
  const router = useRouter();

  

  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Ionicons name="checkmark-circle" size={100} color="#4CAF6F" />
      </View>

      <Text style={s.title}>Your Order has been{'\n'}accepted</Text>
      <Text style={s.sub}>Your items has been placed and is on its way to being processed.</Text>

      <TouchableOpacity style={s.trackBtn} onPress={() => router.push('/(tabs)/account')}>
        <Text style={s.trackText}>View Order History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('/(tabs)')}>
        <Text style={s.homeText}>Back to home</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconWrap: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: 12, lineHeight: 32 },
  sub: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 20, marginBottom: 40 },
  trackBtn: { width: '100%', backgroundColor: '#4CAF6F', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  trackText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  homeBtn: { width: '100%', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  homeText: { color: '#1a1a1a', fontWeight: '600', fontSize: 16 },
});