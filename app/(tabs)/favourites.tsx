import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";

export default function FavouritesScreen() {
  const router = useRouter();
  const { favs, toggleFav, addItem } = useCart();

  return (
    <View style={s.container}>
      <Text style={s.title}>Favourites</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {favs.length === 0 && <Text style={s.empty}>No favourites yet 🤍</Text>}
        {favs.map((item) => (
          <View key={item.id} style={s.item}>
            <Text style={{ fontSize: 48, marginRight: 12 }}>{item.icon}</Text>
            <View style={s.info}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.volume}>{item.weight}</Text>
              <Text style={s.price}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFav(item)}>
              <Ionicons name="close" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.addAllBtn}
          onPress={() => {
            favs.forEach((item) => addItem({ ...item, img: null }));
            router.push("/(tabs)/cart");
          }}
        >
          <Text style={s.addAllText}>Add All To Cart</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  empty: { textAlign: "center", color: "#aaa", marginTop: 60, fontSize: 14 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  volume: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  footer: { position: "absolute", bottom: 24, left: 16, right: 16 },
  addAllBtn: {
    backgroundColor: "#4CAF6F",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  addAllText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
