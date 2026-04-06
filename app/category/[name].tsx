import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALL_PRODUCTS } from "../../constants/products";
import { useCart } from "../../context/CartContext";

const CATEGORY_TITLES: Record<string, string> = {
  beverages: "Beverages",
  fruits: "Fresh Fruits & Vegetable",
  oil: "Cooking Oil & Ghee",
  meat: "Meat & Fish",
  bakery: "Bakery & Snacks",
  dairy: "Dairy & Eggs",
  pulses: "Pulses",
  rice: "Rice",
};

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const products = ALL_PRODUCTS.filter((p) => p.category === name);
  const title = CATEGORY_TITLES[name] ?? name;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.card}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Text style={s.icon}>{item.icon}</Text>
              <Text style={s.volume}>{item.weight}</Text>
              <Text style={s.name} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={s.footer}>
                <Text style={s.price}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={s.addBtn}
                  onPress={() => addItem({ ...item, img: null })}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    minHeight: 180,
    justifyContent: "space-between",
  },
  icon: { fontSize: 52, marginBottom: 8 },
  volume: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    alignSelf: "flex-start",
    height: 36,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  price: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  addBtn: {
    backgroundColor: "#4CAF6F",
    borderRadius: 8,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
