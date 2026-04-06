import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  { id: "fruits", name: "Fresh Fruits & Vegetable", bg: "#E8F5E9", icon: "🥦" },
  { id: "oil", name: "Cooking Oil & Ghee", bg: "#FFF8E1", icon: "🫒" },
  { id: "meat", name: "Meat & Fish", bg: "#FCE4EC", icon: "🥩" },
  { id: "bakery", name: "Bakery & Snacks", bg: "#FFF3E0", icon: "🍞" },
  { id: "dairy", name: "Dairy & Eggs", bg: "#E3F2FD", icon: "🥚" },
  { id: "beverages", name: "Beverages", bg: "#F3E5F5", icon: "🧃" },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Text style={s.title}>Find Products</Text>

      <TouchableOpacity
        style={s.searchBox}
        onPress={() => router.push("/search")}
      >
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <Text style={s.searchPlaceholder}>Search Store</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[s.catCard, { backgroundColor: cat.bg }]}
              onPress={() =>
                router.push({
                  pathname: "/category/[name]",
                  params: { name: cat.id },
                })
              }
            >
              <Text style={s.catIcon}>{cat.icon}</Text>
              <Text style={s.catName}>{cat.name}</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 16,
  },
  searchPlaceholder: { fontSize: 14, color: "#aaa" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 24 },
  catCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  catIcon: { fontSize: 48, marginBottom: 8 },
  catName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    height: 40,
  },
});
