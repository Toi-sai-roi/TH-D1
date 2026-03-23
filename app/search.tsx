import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../constants/products';

export default function SearchScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const [query, setQuery] = useState('');

  const results = query.length > 0
    ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color="#aaa" />
          <TextInput
            style={s.input}
            placeholder="Search Store"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push('../filters')}>
          <Ionicons name="options-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {query.length === 0 && (
          <Text style={s.hint}>Start typing to search products...</Text>
        )}
        {query.length > 0 && results.length === 0 && (
          <Text style={s.hint}>No results found for "{query}"</Text>
        )}
        <View style={s.grid}>
          {results.map(item => (
            <TouchableOpacity
              key={item.id}
              style={s.card}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            >
              <Text style={s.icon}>{item.icon}</Text>
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
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  input: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  hint: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16, padding: 12, alignItems: 'center' },
  icon: { fontSize: 52, marginBottom: 8 },
  weight: { fontSize: 11, color: '#aaa', marginBottom: 2, alignSelf: 'flex-start' },
  name: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, alignSelf: 'flex-start' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  price: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  addBtn: { backgroundColor: '#4CAF6F', borderRadius: 8, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
});