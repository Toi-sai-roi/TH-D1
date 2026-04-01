import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { PRODUCTS_MAP } from '../../constants/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const { addItem, toggleFav, isFav } = useCart();

  const product = PRODUCTS_MAP[id] ?? PRODUCTS_MAP['1'];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFav({ id, name: product.name, weight: product.weight, price: product.price, icon: product.icon })}>
          <Ionicons name={isFav(id) ? 'heart' : 'heart-outline'} size={24} color={isFav(id) ? '#f44336' : '#1a1a1a'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.productIcon}>{product.icon}</Text>

        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{product.name}</Text>
            <View style={s.qtyRow}>
              <TouchableOpacity style={s.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Text style={s.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qty}>{qty}</Text>
              <TouchableOpacity style={s.qtyBtn} onPress={() => setQty(q => q + 1)}>
                <Text style={s.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={s.weight}>{product.weight}, Price</Text>
          <Text style={s.price}>${(product.price * qty).toFixed(2)}</Text>

          <TouchableOpacity style={s.sectionRow} onPress={() => setShowDetail(p => !p)}>
            <Text style={s.sectionTitle}>Product Detail</Text>
            <Ionicons name={showDetail ? 'chevron-up' : 'chevron-down'} size={18} color="#aaa" />
          </TouchableOpacity>
          {showDetail && <Text style={s.detailText}>{product.detail}</Text>}

          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Nutritions</Text>
            <View style={s.nutritionBadge}>
              <Text style={s.nutritionText}>{product.nutrition?.calories}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </View>

          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Review</Text>
            <View style={s.stars}>
              {[1,2,3,4,5].map(i => (
                <Ionicons key={i} name={i <= 4 ? 'star' : 'star-outline'} size={14} color="#FFC107" />
              ))}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.addBtn} onPress={() => { addItem({ ...product, id, img: null }, qty); router.push('/(tabs)/cart');}}>
          <Text style={s.addBtnText}>Add To Basket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 8 },
  iconBtn: { padding: 4 },
  productIcon: { fontSize: 120, textAlign: 'center', marginVertical: 16 },
  info: { paddingHorizontal: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, color: '#1a1a1a' },
  qty: { fontSize: 16, fontWeight: '600' },
  weight: { fontSize: 13, color: '#aaa', marginBottom: 8 },
  price: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderColor: '#f5f5f5', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  detailText: { fontSize: 13, color: '#888', lineHeight: 20, marginBottom: 12 },
  nutritionBadge: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  nutritionText: { fontSize: 12, color: '#888' },
  stars: { flexDirection: 'row', gap: 2 },
  footer: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
  addBtn: { backgroundColor: '#4CAF6F', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});