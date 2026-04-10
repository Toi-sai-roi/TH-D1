import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, PROMOS } from '../context/CartContext';

export default function PromoScreen() {
  const router = useRouter();
  const { appliedPromo, applyPromo, removePromo, total } = useCart();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>Promo Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sub}>Tap a voucher to apply it at checkout</Text>

        {PROMOS.map(p => {
          const isApplied = appliedPromo?.code === p.code;
          const eligible = total >= p.minOrder;
          return (
            <TouchableOpacity
              key={p.code}
              style={[s.card, isApplied && s.cardActive, !eligible && { opacity: 0.5 }]}
              onPress={() => isApplied ? removePromo() : applyPromo(p.code)}
            >
              {/* Left dashed separator */}
              <View style={s.circle} />

              <View style={s.cardLeft}>
                <Text style={s.percent}>-{p.percent}%</Text>
                <Text style={s.label}>{p.label}</Text>
                {p.minOrder > 0 && (
                  <Text style={s.min}>Min. order ${p.minOrder}</Text>
                )}
                <Text style={s.code}>{p.code}</Text>
              </View>

              <View style={[s.badge, isApplied && s.badgeActive]}>
                <Text style={[s.badgeText, isApplied && s.badgeTextActive]}>
                  {isApplied ? '✓ Applied' : 'Use'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 16, paddingTop: 52 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  sub: { fontSize: 13, color: '#aaa', marginBottom: 20, marginTop: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#ececec', borderRadius: 16,
    padding: 16, marginBottom: 12,
    gap: 12,
  },
  cardActive: { borderColor: '#4CAF6F', backgroundColor: '#f0faf4' },
  circle: {
    width: 1, height: '100%',
    borderWidth: 1, borderColor: '#e0e0e0', borderStyle: 'dashed',
    marginRight: 4,
  },
  cardLeft: { flex: 1 },
  percent: { fontSize: 24, fontWeight: '800', color: '#4CAF6F', marginBottom: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  min: { fontSize: 12, color: '#aaa', marginBottom: 4 },
  code: { fontSize: 12, color: '#bbb', fontFamily: 'monospace', letterSpacing: 1 },
  badge: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  badgeActive: { backgroundColor: '#4CAF6F', borderColor: '#4CAF6F' },
  badgeText: { fontSize: 13, fontWeight: '600', color: '#aaa' },
  badgeTextActive: { color: '#fff' },
});
