import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQty, total } = useCart();

  return (
    <View style={s.container}>
      <Text style={s.title}>My Cart</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <View key={item.id} style={s.item}>
            <Text style={{ fontSize: 48, marginRight: 12 }}>{item.icon}</Text>
            <View style={s.info}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.weight}>{item.weight}</Text>
              <View style={s.qtyRow}>
                <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                  <Text style={s.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={s.qty}>{item.qty}</Text>
                <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                  <Text style={s.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={s.price}>${(item.price * item.qty).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => updateQty(item.id, -item.qty)} style={s.removeBtn}>
              <Ionicons name="close" size={18} color="#aaa" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.checkoutBtn} onPress={() => router.push('../checkout')}>
          <Text style={s.checkoutText}>Go to Checkout</Text>
          <Text style={s.checkoutPrice}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f5f5f5' },
  img: { width: 60, height: 60, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  weight: { fontSize: 12, color: '#aaa', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 16, color: '#1a1a1a' },
  qty: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  price: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginRight: 8 },
  removeBtn: { padding: 4 },
  footer: { position: 'absolute', bottom: 24, left: 16, right: 16 },
  checkoutBtn: { backgroundColor: '#4CAF6F', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  checkoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  checkoutPrice: { color: '#fff', fontWeight: '700', fontSize: 16 },
});