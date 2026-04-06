import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "fruits",
  "meat",
  "dairy",
  "beverages",
  "bakery",
  "oil",
  "pulses",
  "rice",
];
const CATEGORY_LABELS: Record<string, string> = {
  fruits: "Fresh Fruits & Vegetable",
  meat: "Meat & Fish",
  dairy: "Dairy & Eggs",
  beverages: "Beverages",
  bakery: "Bakery & Snacks",
  oil: "Cooking Oil & Ghee",
  pulses: "Pulses",
  rice: "Rice",
};
const BRANDS = ["Individual Collection", "Cocola", "Ifad", "Kazi Farmas"];

export default function FiltersScreen() {
  const router = useRouter();
  const { filter, setFilter } = useCart();

  const [selCats, setSelCats] = useState<string[]>(filter.cats);
  const [selBrands, setSelBrands] = useState<string[]>(filter.brands);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
  ) => {
    setList(
      list.includes(val) ? list.filter((i) => i !== val) : [...list, val],
    );
  };

  const apply = () => {
    setFilter({ cats: selCats, brands: selBrands });
    router.back();
  };

  const reset = () => {
    setSelCats([]);
    setSelBrands([]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>Filters</Text>
        <TouchableOpacity onPress={reset}>
          <Text style={s.reset}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Categories</Text>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={s.row}
            onPress={() => toggle(selCats, setSelCats, cat)}
          >
            <View style={[s.checkbox, selCats.includes(cat) && s.checked]}>
              {selCats.includes(cat) && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={s.rowLabel}>{CATEGORY_LABELS[cat]}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[s.sectionTitle, { marginTop: 24 }]}>Brand</Text>
        {BRANDS.map((brand) => (
          <TouchableOpacity
            key={brand}
            style={s.row}
            onPress={() => toggle(selBrands, setSelBrands, brand)}
          >
            <View style={[s.checkbox, selBrands.includes(brand) && s.checked]}>
              {selBrands.includes(brand) && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={s.rowLabel}>{brand}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={s.applyBtn} onPress={apply}>
        <Text style={s.applyText}>
          Apply Filter
          {selCats.length + selBrands.length > 0
            ? ` (${selCats.length + selBrands.length})`
            : ""}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  reset: { fontSize: 13, color: "#f44336", fontWeight: "600" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: "#4CAF6F", borderColor: "#4CAF6F" },
  rowLabel: { fontSize: 15, color: "#1a1a1a" },
  applyBtn: {
    backgroundColor: "#4CAF6F",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  applyText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
