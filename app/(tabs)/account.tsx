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
import { logoutUser } from '../../services/StorageService';

const MENU = [
  { label: "Orders History", icon: "receipt-outline", route: "/orders" }, 
  { label: "Favourites", icon: "heart-outline", route: "/favourites" },
  { label: "Delivery Address", icon: "location-outline", route: null },
  { label: "Payment Methods", icon: "card-outline", route: null },
  { label: 'Promo Card', icon: 'pricetag-outline', route: '/promo' },
  { label: "Rate Us", icon: "star-outline", route: null },
  { label: "Help", icon: "help-circle-outline", route: null },
  { label: "About", icon: "information-circle-outline", route: null },
];

const FAQS = [
  { q: "Làm sao để đặt hàng?", a: "Thêm sản phẩm vào giỏ, vào Cart rồi nhấn Checkout để đặt hàng." },
  { q: "Tôi có thể huỷ đơn không?", a: "Hiện tại app chưa hỗ trợ huỷ đơn sau khi đã đặt." },
  { q: "Thanh toán hỗ trợ những hình thức nào?", a: "App hỗ trợ thanh toán bằng thẻ (Card) hoặc tiền mặt (Cash) khi nhận hàng." },
  { q: "Dữ liệu của tôi có được bảo mật không?", a: "Dữ liệu lưu cục bộ trên thiết bị, không gửi lên server." },
];

export default function AccountScreen() {
  const router = useRouter();
  const { role, allOrders, clearUserData, currentEmail, addresses, addAddress, removeAddress, selectedAddress, selectAddress } = useCart();
  const [showRevenue, setShowRevenue] = useState(false);

  const [showRate, setShowRate] = useState(false);
  const [rateStars, setRateStars] = useState(0);
  const [rateDone, setRateDone] = useState(false);

  const [name, setName] = useState("Afsar Hossen");
  const [email, setEmail] = useState("Mshuvo97@gmail.com");
  const [showEdit, setShowEdit] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);

  const [showAddress, setShowAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const [showPayment, setShowPayment] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newDetail.trim()) return;
    addAddress({ label: newLabel.trim(), detail: newDetail.trim() });
    setNewLabel('');
    setNewDetail('');
  };

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const itemCount: Record<string, { name: string; icon: string; qty: number }> = {};
  allOrders.forEach((o) =>
    o.items.forEach((item) => {
      if (!itemCount[item.id]) itemCount[item.id] = { name: item.name, icon: item.icon, qty: 0 };
      itemCount[item.id].qty += item.qty;
    }),
  );
  const topItems = Object.values(itemCount).sort((a, b) => b.qty - a.qty).slice(0, 3);

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
              <Ionicons name="pencil-outline" size={16} color="#4CAF6F" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
          <Text style={s.email}>{email}</Text>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={showEdit} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Edit Profile</Text>
            <Text style={s.fieldLabel}>Name</Text>
            <TextInput style={s.fieldInput} value={draftName} onChangeText={setDraftName} placeholder="Your name" />
            <Text style={s.fieldLabel}>Email</Text>
            <TextInput style={s.fieldInput} value={draftEmail} onChangeText={setDraftEmail} placeholder="Your email" keyboardType="email-address" autoCapitalize="none" />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowEdit(false)}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={saveEdit}>
                <Text style={s.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Revenue Report — admin only */}
      {role === "admin" && (
        <>
          <TouchableOpacity style={s.menuItem} onPress={() => setShowRevenue((p) => !p)}>
            <Ionicons name="bar-chart-outline" size={20} color="#1a1a1a" style={{ marginRight: 16 }} />
            <Text style={s.menuLabel}>Revenue Report</Text>
            <Ionicons name={showRevenue ? "chevron-down" : "chevron-forward"} size={18} color="#aaa" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          {showRevenue && (
            <View style={s.revenueBox}>
              {allOrders.length === 0 ? (
                <Text style={s.emptyText}>Chưa có dữ liệu doanh thu 📊</Text>
              ) : (
                <>
                  <View style={s.statRow}>
                    <View style={s.statCard}>
                      <Text style={s.statValue}>{totalOrders}</Text>
                      <Text style={s.statLabel}>Tổng đơn</Text>
                    </View>
                    <View style={s.statCard}>
                      <Text style={s.statValue}>${totalRevenue.toFixed(2)}</Text>
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

      {/* Address Modal */}
      <Modal visible={showAddress} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modal, { width: '95%', maxHeight: '80%' }]}>
            <Text style={s.modalTitle}>Delivery Address</Text>
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {addresses.length === 0 && (
                <Text style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>Chưa có địa chỉ nào</Text>
              )}
              {addresses.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[s.fieldInput, {
                    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
                    borderColor: selectedAddress?.id === a.id ? '#4CAF6F' : '#e0e0e0',
                    backgroundColor: selectedAddress?.id === a.id ? '#f0faf4' : '#fff',
                  }]}
                  onPress={() => selectAddress(a)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: '#1a1a1a' }}>{a.label}</Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>{a.detail}</Text>
                  </View>
                  {selectedAddress?.id === a.id && <Ionicons name="checkmark-circle" size={20} color="#4CAF6F" />}
                  <TouchableOpacity onPress={() => removeAddress(a.id)} style={{ marginLeft: 8 }}>
                    <Ionicons name="trash-outline" size={18} color="#f44336" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[s.fieldLabel, { marginTop: 12 }]}>Thêm địa chỉ mới</Text>
            <TextInput style={s.fieldInput} placeholder='Tên (vd: Nhà, Công ty)' value={newLabel} onChangeText={setNewLabel} />
            <TextInput style={[s.fieldInput, { marginTop: 8 }]} placeholder='Địa chỉ chi tiết' value={newDetail} onChangeText={setNewDetail} />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAddress(false)}>
                <Text style={s.cancelText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, (!newLabel || !newDetail) && { backgroundColor: '#ccc' }]}
                disabled={!newLabel || !newDetail}
                onPress={handleAddAddress}
              >
                <Text style={s.saveText}>+ Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal visible={showPayment} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modal, { width: '95%' }]}>
            <Text style={s.modalTitle}>Payment Methods</Text>
            {[
              { icon: '💳', label: 'Visa', detail: '**** **** **** 4242' },
              { icon: '💳', label: 'MasterCard', detail: '**** **** **** 8888' },
              { icon: '💵', label: 'Cash on Delivery', detail: 'Thanh toán khi nhận hàng' },
            ].map((card, i) => (
              <View key={i} style={[s.fieldInput, { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }]}>
                <Text style={{ fontSize: 22, marginRight: 12 }}>{card.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: '#1a1a1a' }}>{card.label}</Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>{card.detail}</Text>
                </View>
                {i === 0 && <View style={{ backgroundColor: '#e8f5e9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 11, color: '#4CAF6F', fontWeight: '700' }}>Default</Text>
                </View>}
              </View>
            ))}
            <TouchableOpacity style={[s.saveBtn, { flex: 0, width: "100%" }]} onPress={() => setShowPayment(false)}>
              <Text style={s.saveText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal visible={showHelp} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modal, { width: '95%', maxHeight: '80%' }]}>
            <Text style={s.modalTitle}>Help & FAQ</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {FAQS.map((faq, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ borderBottomWidth: 1, borderColor: '#f0f0f0', paddingVertical: 12 }}
                  onPress={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontWeight: '600', color: '#1a1a1a', fontSize: 14 }}>{faq.q}</Text>
                    <Ionicons name={openFaq === i ? "chevron-up" : "chevron-down"} size={16} color="#aaa" />
                  </View>
                  {openFaq === i && (
                    <Text style={{ fontSize: 13, color: '#666', marginTop: 8, lineHeight: 20 }}>{faq.a}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[s.saveBtn, { flex: 0, width: "100%" }]} onPress={() => setShowHelp(false)}>
              <Text style={s.saveText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={{ fontSize: 48, textAlign: 'center' }}>🛒</Text>
            <Text style={[s.modalTitle, { textAlign: 'center' }]}>Nectar</Text>
            <Text style={{ fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 4 }}>Version 1.0.0</Text>
            <Text style={{ fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 8 }}>
              Ứng dụng mua sắm tạp hoá trực tuyến, giao hàng nhanh trong vòng 1 giờ.
            </Text>
            <Text style={{ fontSize: 12, color: '#aaa', textAlign: 'center' }}>
              Được phát triển bởi sinh viên{'\n'}Môn Lập trình Di động
            </Text>
            <TouchableOpacity style={[s.saveBtn, { flex: 0, width: "100%" }]} onPress={() => setShowAbout(false)}>
              <Text style={s.saveText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rate Us Modal */}
      <Modal visible={showRate} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            {!rateDone ? (
              <>
                <Text style={[s.modalTitle, { textAlign: "center" }]}>Đánh giá app ✨</Text>
                <Text style={{ fontSize: 13, color: "#888", marginBottom: 16, textAlign: "center" }}>
                  Bạn thích app? Đánh giá 5 sao để thể hiện sự ủng hộ!
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity key={i} onPress={() => setRateStars(i)}>
                      <Ionicons name={i <= rateStars ? "star" : "star-outline"} size={36} color="#FFC107" />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={s.modalBtns}>
                  <TouchableOpacity style={s.cancelBtn} onPress={() => setShowRate(false)}>
                    <Text style={s.cancelText}>Để sau</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.saveBtn, rateStars === 0 && { backgroundColor: "#ccc" }]}
                    disabled={rateStars === 0}
                    onPress={() => setRateDone(true)}
                  >
                    <Text style={s.saveText}>Gửi</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🎉</Text>
                <Text style={[s.modalTitle, { textAlign: "center" }]}>Cảm ơn bạn!</Text>
                <Text style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 20 }}>
                  Đánh giá của bạn giúp chúng tôi cải thiện app hơn.
                </Text>
                <TouchableOpacity style={[s.saveBtn, { flex: 0, width: "100%" }]} onPress={() => { setShowRate(false); setRateDone(false); setRateStars(0); }}>
                  <Text style={s.saveText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Menu */}
      {MENU.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={s.menuItem}
          onPress={() => {
            if (item.label === "Rate Us") setShowRate(true);
            else if (item.label === "Delivery Address") setShowAddress(true);
            else if (item.label === "Payment Methods") setShowPayment(true);
            else if (item.label === "Help") setShowHelp(true);
            else if (item.label === "About") setShowAbout(true);
            else if (item.route) router.push(item.route as any);
          }}
        >
          <Ionicons name={item.icon as any} size={20} color="#1a1a1a" style={{ marginRight: 16 }} />
          <Text style={s.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity
        style={s.logout}
        onPress={async () => { clearUserData(); await logoutUser(); router.replace("/(auth)/login"); }}
      >
        <Ionicons name="log-out-outline" size={20} color="#f44336" style={{ marginRight: 12 }} />
        <Text style={s.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 52 },
  profile: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 32 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#4CAF6F", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  email: { fontSize: 13, color: "#aaa", marginTop: 2 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderColor: "#f5f5f5" },
  menuLabel: { fontSize: 15, color: "#1a1a1a" },
  logout: { flexDirection: "row", alignItems: "center", paddingVertical: 20, marginTop: 8 },
  logoutText: { fontSize: 15, color: "#f44336", fontWeight: "600" },
  orderList: { backgroundColor: "#fafafa", borderRadius: 12, padding: 12, marginBottom: 4 },
  emptyText: { fontSize: 13, color: "#aaa", textAlign: "center", paddingVertical: 8 },
  orderCard: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#f0f0f0" },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeSuccess: { backgroundColor: '#e8f5e9' },
  badgeFailed: { backgroundColor: '#ffebee' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#1a1a1a' },
  orderId: { fontSize: 12, fontWeight: "700", color: "#1a1a1a" },
  orderDate: { fontSize: 12, color: "#aaa" },
  orderTotal: { fontSize: 12, fontWeight: "700", color: "#4CAF6F" },
  orderItem: { fontSize: 13, color: "#555", paddingVertical: 2 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "85%", gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  fieldLabel: { fontSize: 13, color: "#aaa", marginTop: 8 },
  fieldInput: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: "#1a1a1a" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelText: { fontSize: 15, color: "#aaa", fontWeight: "600" },
  saveBtn: { flex: 1, backgroundColor: "#4CAF6F", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  saveText: { fontSize: 15, color: "#fff", fontWeight: "600" },
  revenueBox: { backgroundColor: "#fafafa", borderRadius: 12, padding: 12, marginBottom: 4 },
  statRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#f0f0f0" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#4CAF6F" },
  statLabel: { fontSize: 11, color: "#aaa", marginTop: 2 },
  topTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6, borderTopWidth: 1, borderColor: "#f0f0f0" },
  topRank: { fontSize: 13, fontWeight: "700", color: "#aaa", width: 24 },
  topIcon: { fontSize: 18 },
  topName: { fontSize: 13, color: "#1a1a1a", flex: 1 },
  topQty: { fontSize: 12, color: "#4CAF6F", fontWeight: "600" },
});