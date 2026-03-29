import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCart } from '../context/CartContext'; 

export default function CheckoutScreen() {
  const router = useRouter();
  const [delivery, setDelivery] = useState('');
  const [payment, setPayment] = useState('card');
  const { total, items } = useCart(); 

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      router.replace('../order-failed'); 
    } else {
      router.replace('../order-success');
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.box}>
          <View style={s.boxHeader}>
            <Text style={s.boxTitle}>Checkout</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          <Row label="Delivery" value={delivery || 'Select Method'} onPress={() => setDelivery('Standard')} arrow />
          <Row label="Payment" value={payment === 'card' ? '💳' : '💵'} onPress={() => setPayment(p => p === 'card' ? 'cash' : 'card')} arrow />
          <Row label="Promo Code" value="Pick discount" onPress={() => {}} arrow />
          <Row label="Total Cost" value={`$${total.toFixed(2)}`} /> 
        </View>

        <Text style={s.terms}>
          By placing an order you agree to our{' '}
          <Text style={s.link}>Terms And Conditions</Text>
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.placeBtn} onPress={handlePlaceOrder}> 
          <Text style={s.placeBtnText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({ label, value, onPress, arrow }: { label: string; value: string; onPress?: () => void; arrow?: boolean }) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} disabled={!onPress}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
      {arrow && <Ionicons name="chevron-forward" size={16} color="#aaa" style={{ marginLeft: 4 }} />}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  box: { borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16, padding: 16, marginBottom: 16 },
  boxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  boxTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderColor: '#f5f5f5' },
  rowLabel: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  rowValue: { fontSize: 14, color: '#aaa' },
  terms: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 18 },
  link: { color: '#4CAF6F' },
  footer: { position: 'absolute', bottom: 32, left: 16, right: 16 },
  placeBtn: { backgroundColor: '#4CAF6F', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  placeBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});