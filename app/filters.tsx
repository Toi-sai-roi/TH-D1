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

const CATEGORIES = ["Eggs", "Noodles & Pasta", "Chips & Crisps", "Fast Food"];
const BRANDS = ["Individual Collection", "Cocola", "Ifad", "Kazi Farmas"];

export default function FiltersScreen() {
  const router = useRouter();
  const [selCats, setSelCats] = useState<string[]>(["Eggs"]);
  const [selBrands, setSelBrands] = useState<string[]>(["Cocola"]);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
  ) => {
    setList(
      list.includes(val) ? list.filter((i) => i !== val) : [...list, val],
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>Filters</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
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
            <Text style={s.rowLabel}>{cat}</Text>
          </TouchableOpacity>
        ))}

        {/* Brands */}
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

      <TouchableOpacity style={s.applyBtn} onPress={() => router.back()}>
        <Text style={s.applyText}>Apply Filter</Text>
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
