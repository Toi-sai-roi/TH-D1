import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ALL_PRODUCTS } from '../../constants/products';

const CATEGORIES = [
  { id: 'fruits', name: 'Fresh Fruits & Vegetable', bg: '#E8F5E9', icon: '🥦' },
  { id: 'oil', name: 'Cooking Oil & Ghee', bg: '#FFF8E1', icon: '🫒' },
  { id: 'meat', name: 'Meat & Fish', bg: '#FCE4EC', icon: '🥩' },
  { id: 'bakery', name: 'Bakery & Snacks', bg: '#FFF3E0', icon: '🍞' },
  { id: 'dairy', name: 'Dairy & Eggs', bg: '#E3F2FD', icon: '🥚' },
  { id: 'beverages', name: 'Beverages', bg: '#F3E5F5', icon: '🧃' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const [query, setQuery] = useState('');

  const results = ALL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const showCategories = query.length === 0;

  return (
    <View style={s.container}>
      <Text style={s.title}>Find Products</Text>

      <View style={s.searchBox}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <TextInput
          style={s.searchInput}
          placeholder="Search Store"
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showCategories ? (
          <View style={s.grid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catCard, { backgroundColor: cat.bg }]}
                onPress={() => router.push({ pathname: '/category/[name]', params: { name: cat.id } })}
              >
                <Text style={s.catIcon}>{cat.icon}</Text>
                <Text style={s.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            {results.length === 0 && (
              <Text style={s.hint}>{`No results found for "${query}"`}</Text>
            )}
            <View style={s.grid}>
              {results.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={s.productCard}
                  onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
                >
                  <Text style={s.productIcon}>{item.icon}</Text>
                  <Text style={s.weight}>{item.weight}</Text>
                  <Text style={s.name}>{item.name}</Text>
                  <View style={s.footer}>
                    <Text style={s.price}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity style={s.addBtn} onPress={() => addItem({ ...item, img: null })}>
                      <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  hint: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 24 },
  catCard: { width: '47%', borderRadius: 16, padding: 16, alignItems: 'center' },
  catIcon: { fontSize: 48, marginBottom: 8 },
  catName: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', textAlign: 'center', height: 40 },
  productCard: { width: '47%', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16, padding: 12, alignItems: 'center' },
  productIcon: { fontSize: 52, marginBottom: 8 },
  weight: { fontSize: 11, color: '#aaa', marginBottom: 2, alignSelf: 'flex-start' },
  name: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, alignSelf: 'flex-start' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  price: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  addBtn: { backgroundColor: '#4CAF6F', borderRadius: 8, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
});