import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ALL_PRODUCTS } from "../../constants/products";
import { useCart } from "../../context/CartContext";

const TITLES: Record<string, string> = {
  exclusive: "Exclusive Offer",
  bestselling: "Best Selling",
};

export default function SectionScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const products = ALL_PRODUCTS.filter((p) => p.tags?.includes(tag as any));
  const title = TITLES[tag] ?? "Products";

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>{title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {products.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={s.card}
              onPress={() => router.push({ pathname: "/product/[id]", params: { id: p.id } })}
            >
              <Text style={s.cardIcon}>{p.icon}</Text>
              <Text style={s.cardWeight}>{p.weight}</Text>
              <Text style={s.cardName} numberOfLines={2}>{p.name}</Text>
              <View style={s.cardFooter}>
                <Text style={s.cardPrice}>${p.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={s.addBtn}
                  onPress={() => addItem({ ...p, img: null })}
                >
                  <Text style={s.addBtnText}>+</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  backBtn: { width: 32 },
  title: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 12,
    alignItems: "center",
  },
  cardIcon: { fontSize: 52, marginBottom: 8 },
  cardWeight: { fontSize: 12, color: "#aaa", marginBottom: 2, alignSelf: "flex-start" },
  cardName: { fontSize: 14, fontWeight: "600", color: "#1a1a1a", marginBottom: 8, alignSelf: "flex-start", height: 40 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  cardPrice: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  addBtn: { backgroundColor: "#4CAF6F", borderRadius: 8, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 20, lineHeight: 22 },
});
