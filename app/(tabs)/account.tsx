import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MENU = [
  { label: 'Orders', icon: 'receipt-outline' },
  { label: 'My Details', icon: 'person-outline' },
  { label: 'Delivery Address', icon: 'location-outline' },
  { label: 'Payment Methods', icon: 'card-outline' },
  { label: 'Promo Card', icon: 'pricetag-outline' },
  { label: 'Notifications', icon: 'notifications-outline' },
  { label: 'Help', icon: 'help-circle-outline' },
  { label: 'About', icon: 'information-circle-outline' },
];

export default function AccountScreen() {
  const router = useRouter();

  return (
    <ScrollView style={s.container}>
      {/* Profile */}
      <View style={s.profile}>
        <View style={s.avatarPlaceholder}>
          <Text style={s.avatarText}>A</Text>
        </View>
        <View>
          <View style={s.nameRow}>
            <Text style={s.name}>Afsar Hossen</Text>
            <Ionicons name="pencil-outline" size={16} color="#4CAF6F" style={{ marginLeft: 6 }} />
          </View>
          <Text style={s.email}>Mshuvo97@gmail.com</Text>
        </View>
      </View>

      {/* Menu */}
      {MENU.map(item => (
        <TouchableOpacity key={item.label} style={s.menuItem}>
          <Ionicons name={item.icon as any} size={20} color="#1a1a1a" style={{ marginRight: 16 }} />
          <Text style={s.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity style={s.logout} onPress={() => router.replace('/(auth)/login')}>
        <Ionicons name="log-out-outline" size={20} color="#f44336" style={{ marginRight: 12 }} />
        <Text style={s.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4CAF6F', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  email: { fontSize: 13, color: '#aaa', marginTop: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#f5f5f5' },
  menuLabel: { fontSize: 15, color: '#1a1a1a' },
  logout: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, marginTop: 8 },
  logoutText: { fontSize: 15, color: '#f44336', fontWeight: '600' },
});