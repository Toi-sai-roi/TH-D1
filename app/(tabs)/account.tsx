import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { logoutUser } from '../../services/StorageService'; // Hàm này sẽ xóa thông tin user hiện tại khỏi AsyncStorage để đăng xuất, không xóa data liên quan đến cart, favs, orders,... để khi đăng nhập lại vẫn giữ nguyên

const MENU = [
  { label: "Favourites", icon: "heart-outline", route: "/favourites" },
  { label: "My Details", icon: "person-outline", route: null },
  { label: "Delivery Address", icon: "location-outline", route: null },
  { label: "Payment Methods", icon: "card-outline", route: null },
  { label: 'Promo Card', icon: 'pricetag-outline', route: '/promo' },
  { label: "Rate Us", icon: "star-outline", route: null },
  { label: "Help", icon: "help-circle-outline", route: null },
  { label: "About", icon: "information-circle-outline", route: null },
];


export default function AccountScreen() {
  const router = useRouter();
  const { orders, role, allOrders, clearUserData, currentEmail } = useCart();
  const [showOrders, setShowOrders] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  const [showRate, setShowRate] = useState(false);
  const [rateStars, setRateStars] = useState(0);
  const [rateDone, setRateDone] = useState(false);

  const [name, setName] = useState("Afsar Hossen");
  const [email, setEmail] = useState("Mshuvo97@gmail.com");
  const [showEdit, setShowEdit] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);

  useEffect(() => {
    if (!currentEmail) return;
    (async () => {
      const n = await AsyncStorage.getItem(`profile_name_${currentEmail}`);
      const e = await AsyncStorage.getItem(`profile_email_${currentEmail}`);
      setName(n || currentEmail.split('@')[0]);
      setEmail(e || currentEmail);
    })();
  }, [currentEmail]);

  const openEdit = () => {
    setDraftName(name);
    setDraftEmail(email);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    const newName = draftName.trim() || name;
    const newEmail = draftEmail.trim() || email;
    setName(newName);
    setEmail(newEmail);
    await AsyncStorage.setItem(`profile_name_${currentEmail}`, newName);
    await AsyncStorage.setItem(`profile_email_${currentEmail}`, newEmail);
    setShowEdit(false);
  };

  // --- Revenue stats tính từ orders ---
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Sản phẩm bán chạy nhất
  const itemCount: Record<string, { name: string; icon: string; qty: number }> =
    {};
  allOrders.forEach((o) =>
    o.items.forEach((item) => {
      if (!itemCount[item.id])
        itemCount[item.id] = { name: item.name, icon: item.icon, qty: 0 };
      itemCount[item.id].qty += item.qty;
    }),
  );
  const topItems = Object.values(itemCount)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  return (
    <ScrollView style={s.container}>
      {/* Profile */}
      <View style={s.profile}>
        <View style={s.avatarPlaceholder}>
          <Text style={s.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <View style={s.nameRow}>
            <Text style={s.name}>{name}</Text>
            <TouchableOpacity onPress={openEdit}>
              <Ionicons
                name="pencil-outline"
                size={16}
                color="#4CAF6F"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={s.email}>{email}</Text>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={showEdit} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Edit Profile</Text>
            <Text style={s.fieldLabel}>Name</Text>
            <TextInput
              style={s.fieldInput}
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Your name"
            />
            <Text style={s.fieldLabel}>Email</Text>
            <TextInput
              style={s.fieldInput}
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={s.modalBtns}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setShowEdit(false)}
              >
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={saveEdit}>
                <Text style={s.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Orders History accordion */}
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
                {/* Badge status */}
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
              <Text style={{ fontSize: 11, color: '#4CAF6F' }}>
                Saved ${order.discount.toFixed(2)}
              </Text>
              )}  
              </View>
            ))
          )}
        </View>
      )}

      {/* Revenue Report accordion — chỉ admin thấy */}
      {role === "admin" && (
        <>
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => setShowRevenue((p) => !p)}
          >
            <Ionicons
              name="bar-chart-outline"
              size={20}
              color="#1a1a1a"
              style={{ marginRight: 16 }}
            />
            <Text style={s.menuLabel}>Revenue Report</Text>
            <Ionicons
              name={showRevenue ? "chevron-down" : "chevron-forward"}
              size={18}
              color="#aaa"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {showRevenue && (
            <View style={s.revenueBox}>
              {orders.length === 0 ? (
                <Text style={s.emptyText}>Chưa có dữ liệu doanh thu 📊</Text>
              ) : (
                <>
                  <View style={s.statRow}>
                    <View style={s.statCard}>
                      <Text style={s.statValue}>{totalOrders}</Text>
                      <Text style={s.statLabel}>Tổng đơn</Text>
                    </View>
                    <View style={s.statCard}>
                      <Text style={s.statValue}>
                        ${totalRevenue.toFixed(2)}
                      </Text>
                      <Text style={s.statLabel}>Doanh thu</Text>
                    </View>
                    <View style={s.statCard}>
                      <Text style={s.statValue}>${avgOrder.toFixed(2)}</Text>
                      <Text style={s.statLabel}>TB/đơn</Text>
                    </View>
                  </View>

                  {topItems.length > 0 && (
                    <>
                      <Text style={s.topTitle}>🏆 Bán chạy nhất</Text>
                      {topItems.map((item, i) => (
                        <View key={item.name} style={s.topRow}>
                          <Text style={s.topRank}>#{i + 1}</Text>
                          <Text style={s.topIcon}>{item.icon}</Text>
                          <Text style={s.topName}>{item.name}</Text>
                          <Text style={s.topQty}>{item.qty} sold</Text>
                        </View>
                      ))}
                    </>
                  )}
                </>
              )}
            </View>
          )}
        </>
      )}

      {/* Menu */}
      {/* Rate Us Modal */}
      <Modal visible={showRate} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            {!rateDone ? (
              <>
                <Text style={[s.modalTitle, { textAlign: "center" }]}>
                  Đánh giá app ✨
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#888",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  Bạn thích app? Đánh giá 5 sao để thể hiện sự ủng hộ của bạn!
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity key={i} onPress={() => setRateStars(i)}>
                      <Ionicons
                        name={i <= rateStars ? "star" : "star-outline"}
                        size={36}
                        color="#FFC107"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={s.modalBtns}>
                  <TouchableOpacity
                    style={s.cancelBtn}
                    onPress={() => {
                      setShowRate(false);
                      setRateStars(0);
                    }}
                  >
                    <Text style={s.cancelText}>Để sau</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      s.saveBtn,
                      rateStars === 0 && { backgroundColor: "#ccc" },
                    ]}
                    disabled={rateStars === 0}
                    onPress={() => setRateDone(true)}
                  >
                    <Text style={s.saveText}>Gửi</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 40,
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  🎉
                </Text>
                <Text style={[s.modalTitle, { textAlign: "center" }]}>
                  Cảm ơn bạn!
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#888",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Đánh giá của bạn giúp chúng tôi cải thiện app hơn.
                </Text>
                <TouchableOpacity
                  style={[s.saveBtn, { flex: 0, width: "100%" }]}
                  onPress={() => {
                    setShowRate(false);
                    setRateDone(false);
                    setRateStars(0);
                  }}
                >
                  <Text style={[s.saveText]}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {MENU.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={s.menuItem}
          onPress={() => {
            if (item.label === "Rate Us") {
              setShowRate(true);
            } else if (item.route) {
              router.push(item.route as any);
            }
          }}
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
        // onPress={() => router.replace("/(auth)/login")}
        onPress={async () => { clearUserData(); await logoutUser(); router.replace("/(auth)/login"); }}
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
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeSuccess: { backgroundColor: '#e8f5e9' },
  badgeFailed: { backgroundColor: '#ffebee' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#1a1a1a' },

  orderId: { fontSize: 12, fontWeight: "700", color: "#1a1a1a" },
  orderDate: { fontSize: 12, color: "#aaa" },
  orderTotal: { fontSize: 12, fontWeight: "700", color: "#4CAF6F" },
  orderItem: { fontSize: 13, color: "#555", paddingVertical: 2 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  fieldLabel: { fontSize: 13, color: "#aaa", marginTop: 8 },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1a1a1a",
  },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 15, color: "#aaa", fontWeight: "600" },
  saveBtn: {
    flex: 1,
    backgroundColor: "#4CAF6F",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { fontSize: 15, color: "#fff", fontWeight: "600" },

  // Revenue
  revenueBox: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  statRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statValue: { fontSize: 16, fontWeight: "700", color: "#4CAF6F" },
  statLabel: { fontSize: 11, color: "#aaa", marginTop: 2 },
  topTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  topRank: { fontSize: 13, fontWeight: "700", color: "#aaa", width: 24 },
  topIcon: { fontSize: 18 },
  topName: { fontSize: 13, color: "#1a1a1a", flex: 1 },
  topQty: { fontSize: 12, color: "#4CAF6F", fontWeight: "600" },
});
