import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ALL_PRODUCTS } from "../constants/products";
import { useCart } from "../context/CartContext";

type SortOption = "default" | "asc" | "desc";

export default function SearchScreen() {
  const router = useRouter();
  const { addItem, filter } = useCart();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const { cats: selCats, brands: selBrands } = filter;
  const hasFilter = selCats.length > 0 || selBrands.length > 0;

  const cycleSort = () => {
    setSort((s) =>
      s === "default" ? "asc" : s === "asc" ? "desc" : "default",
    );
  };

  const sortIcon =
    sort === "asc"
      ? "arrow-up"
      : sort === "desc"
        ? "arrow-down"
        : "swap-vertical";
  const sortLabel =
    sort === "asc"
      ? "Giá tăng dần"
      : sort === "desc"
        ? "Giá giảm dần"
        : "Mặc định";

  const results = ALL_PRODUCTS.filter((p) => {
    const matchQuery =
      query.length === 0 || p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = selCats.length === 0 || selCats.includes(p.category);
    const matchBrand = selBrands.length === 0 || selBrands.includes(p.brand);
    return matchQuery && matchCat && matchBrand;
  }).sort((a, b) =>
    sort === "asc"
      ? a.price - b.price
      : sort === "desc"
        ? b.price - a.price
        : 0,
  );

  const showResults = query.length > 0 || hasFilter;

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
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push("../filters")}>
          <View>
            <Ionicons
              name="options-outline"
              size={24}
              color={hasFilter ? "#4CAF6F" : "#1a1a1a"}
            />
            {hasFilter && <View style={s.filterDot} />}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.sortBtn} onPress={cycleSort}>
        <Ionicons
          name={sortIcon as any}
          size={16}
          color={sort !== "default" ? "#4CAF6F" : "#888"}
        />
        <Text style={[s.sortLabel, sort !== "default" && { color: "#4CAF6F" }]}>
          {sortLabel}
        </Text>
      </TouchableOpacity>

      {hasFilter && (
        <View style={s.filterTags}>
          {selCats.map((c) => (
            <View key={c} style={s.tag}>
              <Text style={s.tagText}>{c}</Text>
            </View>
          ))}
          {selBrands.map((b) => (
            <View key={b} style={s.tag}>
              <Text style={s.tagText}>{b}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!showResults && (
          <Text style={s.hint}>Start typing to search products...</Text>
        )}
        {showResults && results.length === 0 && (
          <Text style={s.hint}>{`No results found for "${query}"`}</Text>
        )}
        <View style={s.grid}>
          {(showResults ? results : []).map((item) => (
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
              <Text style={s.weight}>{item.weight}</Text>
              <Text style={s.name}>{item.name}</Text>
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
    gap: 12,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: "#1a1a1a" },
  filterDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f44336",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sortLabel: { fontSize: 13, color: "#888", fontWeight: "500" },
  filterTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: "#4CAF6F", fontWeight: "600" },
  hint: { textAlign: "center", color: "#aaa", marginTop: 40, fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  icon: { fontSize: 52, marginBottom: 8 },
  weight: {
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
