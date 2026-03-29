import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

const EXCLUSIVE = [
  { id: '1', name: 'Natural Red Apple', weight: '1kg', price: 1.99, icon: '🍎' },
  { id: '2', name: 'Organic Bananas', weight: '1kg', price: 2.99, icon: '🍌' },
  { id: '3', name: 'Beef', weight: '1kg', price: 5.99, icon: '🥩' },
  { id: '4', name: 'Broiler Chicken', weight: '1kg', price: 6.99, icon: '🍗' },
];

const BEST_SELLING = [
  { id: '5', name: 'Bell Pepper', weight: '1kg', price: 3.99, icon: '🫑' },
  { id: '6', name: 'Ginger', weight: '250g', price: 2.99, icon: '🫚' },
  { id: '7', name: 'Egg Chicken', weight: '4pcs', price: 1.99, icon: '🥚' },
];

const GROCERIES = [
  { id: 'pulses', name: 'Pulses', icon: '🫘' },
  { id: 'rice', name: 'Rice', icon: '🍚' },
  { id: 'oil', name: 'Cooking Oil', icon: '🫒' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addItem } = useCart();

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>🥕</Text>
        <Text style={s.location}>📍 Dhaka, Banasree</Text>
        
      </View>
      
      {/* Search */}
      <TouchableOpacity style={s.searchBox} onPress={() => router.push('../search')}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <Text style={s.searchPlaceholder}>Search Store</Text>
      </TouchableOpacity>

      {/* Banner */}
      <View style={s.banner}>
        <Text style={s.bannerEmoji}>🥦🥕🍅</Text>
        <View>
          <Text style={s.bannerTitle}>Fresh Vegetables</Text>
          <Text style={s.bannerSub}>Get Up to 40% off</Text>
        </View>
      </View>

      {/* Exclusive Offer */}
      <SectionHeader title="Exclusive Offer" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.row}>
        {EXCLUSIVE.map(p => (
          <ProductCard key={p.id} item={p} onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} onAdd={() => addItem({ ...p, img: null })} />
        ))}
      </ScrollView>

      {/* Best Selling */}
      <SectionHeader title="Best Selling" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.row}>
        {BEST_SELLING.map(p => (
          <ProductCard key={p.id} item={p} onPress={() => router.push(`../product/${p.id}`)} onAdd={() => addItem({ ...p, img: null })} />
        ))}
      </ScrollView>

      {/* Groceries */}
      <SectionHeader title="Groceries" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.row}>
        {GROCERIES.map(g => (
          <TouchableOpacity key={g.id} style={s.groceryCard} onPress={() => router.push(`../category/${g.id}`)}>
            <Text style={s.groceryIcon}>{g.icon}</Text>
            <Text style={s.groceryName}>{g.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      <TouchableOpacity><Text style={s.seeAll}>See all</Text></TouchableOpacity>
    </View>
  );
}

function ProductCard({ item, onPress, onAdd }: { item: any; onPress: () => void; onAdd: () => void }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress}>
      <Text style={s.cardIcon}>{item.icon}</Text>
      <Text style={s.cardWeight}>{item.weight}</Text>
      <Text style={s.cardName}>{item.name}</Text>
      <View style={s.cardFooter}>
        <Text style={s.cardPrice}>${item.price.toFixed(2)}</Text>
        {/* Xoá onAdd() thay bằng onPress gọi luôn onPress của card */}
        <TouchableOpacity style={s.addBtn} onPress={onPress}>
          <Text style={s.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { alignItems: 'center', marginTop: 50, marginBottom: 16 },
  logo: { fontSize: 40, marginBottom: 6},
  location: { fontSize: 14, color: '#777' },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4CAF6F', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8, marginBottom: 16 },
  searchPlaceholder: { fontSize: 14, color: '#aaa' },
  banner: { backgroundColor: '#4CAF6F', borderRadius: 16, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  bannerEmoji: { fontSize: 40 },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  bannerSub: { color: '#fff', opacity: 0.85, fontSize: 13, marginTop: 4 },
  row: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  seeAll: { fontSize: 14, color: '#4CAF6F' },
  card: { width: 150, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0', padding: 12, marginRight: 12, alignItems: 'center' },
  cardIcon: { fontSize: 52, marginBottom: 8 },
  cardWeight: { fontSize: 12, color: '#aaa', marginBottom: 2, alignSelf: 'flex-start' },
  cardName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, alignSelf: 'flex-start', height: 40, },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  addBtn: { backgroundColor: '#4CAF6F', borderRadius: 8, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 20, lineHeight: 22 },
  groceryCard: { width: 100, backgroundColor: '#f9f9f9', borderRadius: 16, padding: 12, marginRight: 12, alignItems: 'center' },
  groceryIcon: { fontSize: 40, marginBottom: 6 },
  groceryName: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', textAlign: 'center' },
});