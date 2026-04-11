import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCart, PROMOS } from '../context/CartContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const [payment, setPayment] = useState('card');
  const [showPromos, setShowPromos] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const {
    total, items, appliedPromo, applyPromo, removePromo,
    discount, finalTotal, createOrder,
    addresses, addAddress, removeAddress, selectedAddress, selectAddress,
  } = useCart();

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const success = Math.random() > 0.2;
    createOrder(success ? 'success' : 'failed');
    router.replace(success ? '../order-success' : '../order-failed');
  };

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newDetail.trim()) return;
    addAddress({ label: newLabel.trim(), detail: newDetail.trim() });
    setNewLabel('');
    setNewDetail('');
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

          {/* Delivery row */}
          <TouchableOpacity style={s.row} onPress={() => setShowAddress(true)}>
            <Text style={s.rowLabel}>Delivery</Text>
            <Text style={s.rowValue} numberOfLines={1}>
              {selectedAddress ? `${selectedAddress.label} — ${selectedAddress.detail}` : 'Select Address'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#aaa" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <Row label="Payment" value={payment === 'card' ? '💳 Card' : '💵 Cash'} onPress={() => setPayment(p => p === 'card' ? 'cash' : 'card')} arrow />

          {/* Promo Code row */}
          <TouchableOpacity style={s.row} onPress={() => setShowPromos(true)}>
            <Text style={s.rowLabel}>Promo Code</Text>
            {appliedPromo ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: '#4CAF6F', fontWeight: '600', fontSize: 13 }}>{appliedPromo.code}</Text>
                <TouchableOpacity onPress={removePromo} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={16} color="#aaa" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={s.rowValue}>Pick discount</Text>
            )}
            <Ionicons name="chevron-forward" size={16} color="#aaa" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {appliedPromo && (
            <View style={s.row}>
              <Text style={[s.rowLabel, { color: '#4CAF6F' }]}>Discount ({appliedPromo.percent}%)</Text>
              <Text style={{ color: '#4CAF6F', fontWeight: '700' }}>-${discount.toFixed(2)}</Text>
            </View>
          )}

          <Row label="Total Cost" value={`$${finalTotal.toFixed(2)}`} />
        </View>

        {appliedPromo && (
          <View style={s.savedBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF6F" />
            <Text style={s.savedText}>You saved ${discount.toFixed(2)} 🎉</Text>
          </View>
        )}

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

      {/* Address Modal */}
      <Modal visible={showAddress} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.promoSheet}>
            <Text style={s.promoSheetTitle}>Địa chỉ giao hàng</Text>

            {addresses.length === 0 && (
              <Text style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>Chưa có địa chỉ nào</Text>
            )}

            {addresses.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[s.promoRow, selectedAddress?.id === a.id && s.promoRowActive]}
                onPress={() => { selectAddress(a); setShowAddress(false); }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: '#1a1a1a' }}>{a.label}</Text>
                  <Text style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{a.detail}</Text>
                </View>
                <TouchableOpacity onPress={() => removeAddress(a.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={18} color="#f44336" />
                </TouchableOpacity>
                {selectedAddress?.id === a.id && (
                  <Ionicons name="checkmark-circle" size={22} color="#4CAF6F" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            ))}

            {/* Thêm địa chỉ mới */}
            <View style={{ marginTop: 12, gap: 8 }}>
              <TextInput
                style={s.input}
                placeholder='Tên địa chỉ (vd: Nhà, Công ty)'
                value={newLabel}
                onChangeText={setNewLabel}
              />
              <TextInput
                style={s.input}
                placeholder='Địa chỉ chi tiết'
                value={newDetail}
                onChangeText={setNewDetail}
              />
              <TouchableOpacity
                style={[s.placeBtn, (!newLabel || !newDetail) && { backgroundColor: '#ccc' }]}
                disabled={!newLabel || !newDetail}
                onPress={handleAddAddress}
              >
                <Text style={s.placeBtnText}>+ Thêm địa chỉ</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={s.closeSheet} onPress={() => setShowAddress(false)}>
              <Text style={{ color: '#aaa', fontWeight: '600', fontSize: 15 }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Promo Modal */}
      <Modal visible={showPromos} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.promoSheet}>
            <Text style={s.promoSheetTitle}>Choose Voucher</Text>
            {PROMOS.map(p => {
              const eligible = total >= p.minOrder;
              const isApplied = appliedPromo?.code === p.code;
              return (
                <TouchableOpacity
                  key={p.code}
                  style={[s.promoRow, !eligible && { opacity: 0.4 }, isApplied && s.promoRowActive]}
                  disabled={!eligible}
                  onPress={() => { applyPromo(p.code); setShowPromos(false); }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', color: '#4CAF6F', fontSize: 16 }}>-{p.percent}%</Text>
                    <Text style={{ fontSize: 13, color: '#1a1a1a', marginTop: 2 }}>{p.label}</Text>
                    {p.minOrder > 0 && (
                      <Text style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Min. order ${p.minOrder}</Text>
                    )}
                    <Text style={{ fontSize: 11, color: '#bbb', marginTop: 4, fontFamily: 'monospace' }}>{p.code}</Text>
                  </View>
                  {isApplied && <Ionicons name="checkmark-circle" size={22} color="#4CAF6F" />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={s.closeSheet} onPress={() => setShowPromos(false)}>
              <Text style={{ color: '#aaa', fontWeight: '600', fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  rowValue: { fontSize: 14, color: '#aaa', maxWidth: '50%' },
  terms: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 18 },
  link: { color: '#4CAF6F' },
  footer: { position: 'absolute', bottom: 32, left: 16, right: 16 },
  placeBtn: { backgroundColor: '#4CAF6F', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  placeBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  savedBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0faf4', borderRadius: 10, padding: 10, marginBottom: 16 },
  savedText: { fontSize: 13, color: '#4CAF6F', fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  promoSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 10 },
  promoSheetTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  promoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 12 },
  promoRowActive: { borderColor: '#4CAF6F', backgroundColor: '#f0faf4' },
  closeSheet: { alignItems: 'center', paddingVertical: 12 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 },
});