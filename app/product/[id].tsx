import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PRODUCTS_MAP } from "../../constants/products";
import { useCart } from "../../context/CartContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [newStars, setNewStars] = useState(5);
  const [newComment, setNewComment] = useState("");
  const { addItem, toggleFav, isFav, addReview, getReviews } = useCart();

  const product = PRODUCTS_MAP[id] ?? PRODUCTS_MAP["1"];
  const productReviews = getReviews(id);
  const avgStars =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.stars, 0) /
        productReviews.length
      : 0;

  const handleAddReview = () => {
    if (!newComment.trim()) return;
    addReview({
      productId: id,
      author: "Bạn",
      stars: newStars,
      comment: newComment.trim(),
    });
    setNewComment("");
    setNewStars(5);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            toggleFav({
              id,
              name: product.name,
              weight: product.weight,
              price: product.price,
              icon: product.icon,
            })
          }
        >
          <Ionicons
            name={isFav(id) ? "heart" : "heart-outline"}
            size={24}
            color={isFav(id) ? "#f44336" : "#1a1a1a"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.productIcon}>{product.icon}</Text>

        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{product.name}</Text>
            <View style={s.qtyRow}>
              <TouchableOpacity
                style={s.qtyBtn}
                onPress={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Text style={s.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qty}>{qty}</Text>
              <TouchableOpacity
                style={s.qtyBtn}
                onPress={() => setQty((q) => q + 1)}
              >
                <Text style={s.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={s.weight}>{product.weight}, Price</Text>
          <Text style={s.price}>${(product.price * qty).toFixed(2)}</Text>

          <TouchableOpacity
            style={s.sectionRow}
            onPress={() => setShowDetail((p) => !p)}
          >
            <Text style={s.sectionTitle}>Product Detail</Text>
            <Ionicons
              name={showDetail ? "chevron-up" : "chevron-down"}
              size={18}
              color="#aaa"
            />
          </TouchableOpacity>
          {showDetail && <Text style={s.detailText}>{product.detail}</Text>}

          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Nutritions</Text>
            <View style={s.nutritionBadge}>
              <Text style={s.nutritionText}>{product.nutrition?.calories}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </View>

          {/* Review row */}
          <TouchableOpacity
            style={s.sectionRow}
            onPress={() => setShowReview((p) => !p)}
          >
            <Text style={s.sectionTitle}>Review</Text>
            <View style={s.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= Math.round(avgStars) ? "star" : "star-outline"}
                  size={14}
                  color="#FFC107"
                />
              ))}
            </View>
            {productReviews.length > 0 && (
              <Text style={s.reviewCount}>({productReviews.length})</Text>
            )}
            <Ionicons
              name={showReview ? "chevron-up" : "chevron-down"}
              size={18}
              color="#aaa"
            />
          </TouchableOpacity>

          {showReview && (
            <View style={s.reviewSection}>
              {/* Danh sách review */}
              {productReviews.length === 0 && (
                <Text style={s.noReview}>Chưa có đánh giá nào.</Text>
              )}
              {productReviews.map((r) => (
                <View key={r.id} style={s.reviewCard}>
                  <View style={s.reviewHeader}>
                    <Text style={s.reviewAuthor}>{r.author}</Text>
                    <View style={s.stars}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons
                          key={i}
                          name={i <= r.stars ? "star" : "star-outline"}
                          size={12}
                          color="#FFC107"
                        />
                      ))}
                    </View>
                    <Text style={s.reviewDate}>{r.date}</Text>
                  </View>
                  <Text style={s.reviewComment}>{r.comment}</Text>
                </View>
              ))}

              {/* Form thêm review */}
              <View style={s.reviewForm}>
                <Text style={s.formTitle}>Viết đánh giá</Text>
                <View style={s.starPicker}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity key={i} onPress={() => setNewStars(i)}>
                      <Ionicons
                        name={i <= newStars ? "star" : "star-outline"}
                        size={28}
                        color="#FFC107"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={s.input}
                  placeholder="Nhận xét của bạn..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity style={s.submitBtn} onPress={handleAddReview}>
                  <Text style={s.submitText}>Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => {
            addItem({ ...product, id, img: null }, qty);
            router.push("/(tabs)/cart");
          }}
        >
          <Text style={s.addBtnText}>Add To Basket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 8,
  },
  iconBtn: { padding: 4 },
  productIcon: { fontSize: 120, textAlign: "center", marginVertical: 16 },
  info: { paddingHorizontal: 16 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 18, color: "#1a1a1a" },
  qty: { fontSize: 16, fontWeight: "600" },
  weight: { fontSize: 13, color: "#aaa", marginBottom: 8 },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#f5f5f5",
    gap: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#1a1a1a", flex: 1 },
  detailText: { fontSize: 13, color: "#888", lineHeight: 20, marginBottom: 12 },
  nutritionBadge: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nutritionText: { fontSize: 12, color: "#888" },
  stars: { flexDirection: "row", gap: 2 },
  reviewCount: { fontSize: 13, color: "#888" },
  footer: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
  addBtn: {
    backgroundColor: "#4CAF6F",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  // Review section
  reviewSection: { marginBottom: 16 },
  noReview: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 12,
  },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  reviewAuthor: { fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
  reviewDate: { fontSize: 11, color: "#aaa", marginLeft: "auto" },
  reviewComment: { fontSize: 13, color: "#555", lineHeight: 18 },
  reviewForm: {
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    paddingTop: 16,
    marginTop: 8,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  starPicker: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: "#1a1a1a",
    minHeight: 70,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: "#4CAF6F",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
