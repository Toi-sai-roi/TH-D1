import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useCart();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.title}>Orders History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>🛒</Text>
            <Text style={s.emptyText}>Chưa có đơn hàng nào</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={s.orderCard}>
              <View style={s.orderHeader}>
                <Text style={s.orderId}>#{order.id.slice(-5)}</Text>
                <Text style={s.orderDate}>{order.date}</Text>
                <View style={[s.statusBadge, order.status === 'failed' ? s.badgeFailed : s.badgeSuccess]}>
                  <Text style={s.statusText}>
                    {order.status === 'failed' ? '✗ Failed' : '✓ Success'}
                  </Text>
                </View>
                <Text style={s.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>

              {order.items.map((item) => (
                <Text key={item.id} style={s.orderItem}>
                  {item.icon} {item.name} × {item.qty}
                </Text>
              ))}

              {order.discount > 0 && (
                <Text style={s.savedText}>Saved ${order.discount.toFixed(2)}</Text>
              )}

              {order.address && (
                <Text style={s.addressText}>
                  📍 {order.address.label} — {order.address.detail}
                </Text>
              )}
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  empty: { alignItems: "center", marginTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: "#aaa" },
  orderCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#f0f0f0" },
  orderHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  orderId: { fontSize: 12, fontWeight: "700", color: "#1a1a1a" },
  orderDate: { fontSize: 12, color: "#aaa" },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeSuccess: { backgroundColor: '#e8f5e9' },
  badgeFailed: { backgroundColor: '#ffebee' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#1a1a1a' },
  orderTotal: { fontSize: 12, fontWeight: "700", color: "#4CAF6F" },
  orderItem: { fontSize: 13, color: "#555", paddingVertical: 2 },
  savedText: { fontSize: 11, color: '#4CAF6F', marginTop: 4 },
  addressText: { fontSize: 11, color: '#888', marginTop: 4 },
});