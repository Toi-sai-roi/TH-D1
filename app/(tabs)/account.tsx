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
import { useCart } from "../../context/CartContext";

const MENU = [
  { label: "Favourites", icon: "heart-outline", route: "/favourites" },
  { label: "My Details", icon: "person-outline", route: null },
  { label: "Delivery Address", icon: "location-outline", route: null },
  { label: "Payment Methods", icon: "card-outline", route: null },
  { label: "Promo Card", icon: "pricetag-outline", route: null },
  { label: "Help", icon: "help-circle-outline", route: null },
  { label: "About", icon: "information-circle-outline", route: null },
];

export default function AccountScreen() {
  const router = useRouter();
  const { orders } = useCart();
  const [showOrders, setShowOrders] = useState(false);

  return (
    <ScrollView style={s.container}>
      {/* Profile */}
      <View style={s.profile}>
        <View style={s.avatarPlaceholder}>
          <Text style={s.avatarText}>A</Text>
        </View>
        <View>
          <View style={s.nameRow}>
            <Text style={s.name}>Afsar Hossen</Text>
            <Ionicons
              name="pencil-outline"
              size={16}
              color="#4CAF6F"
              style={{ marginLeft: 6 }}
            />
          </View>
          <Text style={s.email}>Mshuvo97@gmail.com</Text>
        </View>
      </View>

      {/* Orders accordion */}
      <TouchableOpacity
        style={s.menuItem}
        onPress={() => setShowOrders((p) => !p)}
      >
        <Ionicons
          name="receipt-outline"
          size={20}
          color="#1a1a1a"
          style={{ marginRight: 16 }}
        />
        <Text style={s.menuLabel}>Orders History</Text>
        <Ionicons
          name={showOrders ? "chevron-down" : "chevron-forward"}
          size={18}
          color="#aaa"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      {showOrders && (
        <View style={s.orderList}>
          {orders.length === 0 ? (
            <Text style={s.emptyText}>Chưa có đơn hàng nào 🛒</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={s.orderCard}>
                <View style={s.orderHeader}>
                  <Text style={s.orderId}>#{order.id.slice(-5)}</Text>
                  <Text style={s.orderDate}>{order.date}</Text>
                  <Text style={s.orderTotal}>${order.total.toFixed(2)}</Text>
                </View>
                {order.items.map((item) => (
                  <Text key={item.id} style={s.orderItem}>
                    {item.icon} {item.name} × {item.qty}
                  </Text>
                ))}
              </View>
            ))
          )}
        </View>
      )}

      {/* Menu */}
      {MENU.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={s.menuItem}
          onPress={() => item.route && router.push(item.route as any)}
        >
          <Ionicons
            name={item.icon as any}
            size={20}
            color="#1a1a1a"
            style={{ marginRight: 16 }}
          />
          <Text style={s.menuLabel}>{item.label}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#aaa"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity
        style={s.logout}
        onPress={() => router.replace("/(auth)/login")}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#f44336"
          style={{ marginRight: 12 }}
        />
        <Text style={s.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF6F",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  email: { fontSize: 13, color: "#aaa", marginTop: 2 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  menuLabel: { fontSize: 15, color: "#1a1a1a" },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 8,
  },
  logoutText: { fontSize: 15, color: "#f44336", fontWeight: "600" },
  orderList: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 8,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  orderId: { fontSize: 12, fontWeight: "700", color: "#1a1a1a" },
  orderDate: { fontSize: 12, color: "#aaa" },
  orderTotal: { fontSize: 12, fontWeight: "700", color: "#4CAF6F" },
  orderItem: { fontSize: 13, color: "#555", paddingVertical: 2 },
});
