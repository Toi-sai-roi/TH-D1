import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

const CATEGORY_PRODUCTS: Record<string, any[]> = {
  beverages: [
    { id: 'b1', name: 'Diet Coke', weight: '335ml', price: 1.99, icon: '🥤' },
    { id: 'b2', name: 'Sprite Can', weight: '325ml', price: 1.50, icon: '🧃' },
    { id: 'b3', name: 'Apple & Grape Juice', weight: '2L', price: 15.99, icon: '🍹' },
    { id: 'b4', name: 'Orange Juice', weight: '2L', price: 15.99, icon: '🍊' },
    { id: 'b5', name: 'Coca Cola Can', weight: '325ml', price: 4.99, icon: '🥤' },
    { id: 'b6', name: 'Pepsi Can', weight: '330ml', price: 4.99, icon: '🥤' },
  ],
  fruits: [
    { id: 'f1', name: 'Red Apple', weight: '1kg', price: 1.99, icon: '🍎' },
    { id: 'f3', name: 'Organic Bananas', weight: '5kg', price: 3.00, icon: '🍌' },
    { id: '1', name: 'Natural Red Apple', weight: '1kg', price: 4.99, icon: '🍎' },
    { id: '2', name: 'Organic Bananas', weight: '7pcs', price: 4.99, icon: '🍌' },
    { id: '5', name: 'Bell Pepper', weight: '1kg', price: 3.99, icon: '🫑' },
    { id: '6', name: 'Ginger', weight: '250g', price: 2.99, icon: '🫚' },
  ],
  oil: [
    { id: 'o1', name: 'Olive Oil', weight: '1L', price: 8.99, icon: '🫒' },
    { id: 'o2', name: 'Sunflower Oil', weight: '2L', price: 5.99, icon: '🌻' },
  ],
  meat: [
    { id: 'm1', name: 'Beef Bone', weight: '1kg', price: 4.99, icon: '🥩' },
    { id: 'm2', name: 'Broiler Chicken', weight: '1kg', price: 4.99, icon: '🍗' },
  ],
  bakery: [
    { id: 'bk1', name: 'White Bread', weight: '400g', price: 2.50, icon: '🍞' },
    { id: 'bk2', name: 'Croissant', weight: '200g', price: 3.99, icon: '🥐' },
  ],
  dairy: [
    { id: 'd1', name: 'Fresh Milk', weight: '1L', price: 1.99, icon: '🥛' },
    { id: 'd2', name: 'Butter', weight: '250g', price: 3.50, icon: '🧈' },
    { id: 'd3', name: 'Egg Duck', weight: '12pcs', price: 2.99, icon: '🥚' },
    { id: 'f2', name: 'Egg Chicken White', weight: '180g', price: 1.50, icon: '🥚' },
    { id: '7', name: 'Egg Chicken', weight: '4pcs', price: 1.99, icon: '🥚' },
  ],
  pulses: [
    { id: 'p1', name: 'Red Lentils', weight: '1kg', price: 2.99, icon: '🫘' },
    { id: 'p2', name: 'Chickpeas', weight: '1kg', price: 3.49, icon: '🫘' },
  ],
  rice: [
    { id: 'r1', name: 'Basmati Rice', weight: '2kg', price: 5.99, icon: '🍚' },
    { id: 'r2', name: 'Jasmine Rice', weight: '2kg', price: 4.99, icon: '🍚' },
  ],
};

const CATEGORY_TITLES: Record<string, string> = {
  beverages: 'Beverages',
  fruits: 'Fresh Fruits & Vegetable',
  oil: 'Cooking Oil & Ghee',
  meat: 'Meat & Fish',
  bakery: 'Bakery & Snacks',
  dairy: 'Dairy & Eggs',
  pulses: 'Pulses',
  rice: 'Rice',
};

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const products = CATEGORY_PRODUCTS[name] ?? CATEGORY_PRODUCTS['beverages'];
  const title = CATEGORY_TITLES[name] ?? name;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>{title}</Text>
        <TouchableOpacity onPress={() => router.push('/filters')}>
          <Ionicons name="options-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {products.map(item => (
            <TouchableOpacity
              key={item.id}
              style={s.card}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            >
              <Text style={s.icon}>{item.icon}</Text>
              <Text style={s.volume}>{item.weight}</Text>
              {/* fix 1: numberOfLines={2} */}
              <Text style={s.name} numberOfLines={2}>{item.name}</Text>
              <View style={s.footer}>
                <Text style={s.price}>${item.price.toFixed(2)}</Text>
                {/* fix 2: nút + navigate giống bấm card */}
                <TouchableOpacity
                  style={s.addBtn}
                  onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
                >
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16, padding: 12, alignItems: 'center', minHeight: 180, justifyContent: 'space-between' },
  icon: { fontSize: 52, marginBottom: 8 },
  volume: { fontSize: 11, color: '#aaa', marginBottom: 2, alignSelf: 'flex-start' },
  name: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, alignSelf: 'flex-start', height: 36 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  price: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  addBtn: { backgroundColor: '#4CAF6F', borderRadius: 8, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
});