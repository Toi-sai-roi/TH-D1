import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUser = {
  username: string;
  email: string;
  role: "admin" | "user";
  password: string;
};

// ===== KEYS =====
export const authKeys = { // Các key để lưu data liên quan đến auth, tách riêng để dễ quản lý và tránh trùng lặp với data của CartContext
  currentUser: "auth_current_user",
  accounts: "auth_accounts",
};

export const dataKeys = (email: string) => ({ // Thêm email vào key để phân biệt data của từng user, tránh trùng lặp khi nhiều người dùng trên cùng thiết bị
  items: `cart_items_${email}`,
  favs: `cart_favs_${email}`,
  orders: `cart_orders_${email}`,
  notifs: `notifs_${email}`,
  reviews: `reviews_${email}`,
});

// ===== ACCOUNTS CỨNG =====
const HARDCODED: StoredUser[] = [
  { username: "Tung", email: "tung@shop.com", password: "tung123", role: "user" },
  { username: "Binh", email: "binh@shop.com", password: "binh123", role: "user" },
  { username: "Admin", email: "admin@shop.com", password: "admin123", role: "admin" },
];

// ===== LOAD ALL ACCOUNTS (cứng + đã đăng ký) =====
export async function loadAccounts(): Promise<StoredUser[]> { // Hàm này sẽ load cả tài khoản cứng và tài khoản đã đăng ký từ AsyncStorage, ưu tiên tài khoản đã đăng ký nếu có trùng email
  try {
    const raw = await AsyncStorage.getItem(authKeys.accounts); // Load danh sách tài khoản đã đăng ký từ AsyncStorage
    const registered: StoredUser[] = raw ? JSON.parse(raw) : [];
    return [...HARDCODED, ...registered]; 
  } catch {
    return HARDCODED; 
  }
}

// ===== ĐĂNG KÝ =====
export async function registerAccount(user: StoredUser): Promise<{ ok: boolean; msg: string }> { // Hàm này sẽ thêm tài khoản mới vào AsyncStorage nếu email chưa tồn tại, trả về thông báo thành công hoặc lỗi
  try {
    const all = await loadAccounts(); 
    const exists = all.find(a => a.email.toLowerCase() === user.email.toLowerCase()); 
    if (exists) return { ok: false, msg: "Email này đã được đăng ký!" };

    const raw = await AsyncStorage.getItem(authKeys.accounts);
    const registered: StoredUser[] = raw ? JSON.parse(raw) : [];
    registered.push(user);
    await AsyncStorage.setItem(authKeys.accounts, JSON.stringify(registered));
    return { ok: true, msg: "Đăng ký thành công!" };
  } catch {
    return { ok: false, msg: "Lỗi đăng ký, thử lại!" };
  }
}

// ===== LOGIN =====
export async function loginAccount(email: string, password: string): Promise<StoredUser | null> { // Hàm này sẽ kiểm tra thông tin đăng nhập với danh sách tài khoản (cứng + đã đăng ký), nếu hợp lệ sẽ lưu thông tin user vào AsyncStorage để duy trì session, trả về thông tin user hoặc null nếu đăng nhập thất bại
  try {
    const all = await loadAccounts();
    const found = all.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) return null;
    const expiredAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    await AsyncStorage.setItem(authKeys.currentUser, JSON.stringify({ ...found, expiredAt })); // Lưu thông tin user hiện tại vào AsyncStorage để duy trì session
    return found;
  } catch {
    return null;
  }
}

// ===== LOAD CURRENT USER =====
export async function loadCurrentUser(): Promise<StoredUser | null> {
  try {
    const raw = await AsyncStorage.getItem(authKeys.currentUser);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.expiredAt && Date.now() > data.expiredAt) {
      await AsyncStorage.removeItem(authKeys.currentUser);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// ===== LOGOUT (chỉ xóa session, giữ data) =====
export async function logoutUser(): Promise<void> { // Hàm này sẽ xóa thông tin user hiện tại khỏi AsyncStorage để đăng xuất, không xóa data liên quan đến cart, favs, orders,... để khi đăng nhập lại vẫn giữ nguyên
  try {
    await AsyncStorage.removeItem(authKeys.currentUser);
  } catch (e) {
    console.warn("logoutUser error:", e);
  }
}
// ===== DEFAULT NOTIFS =====
export const DEFAULT_NOTIFS = [
  { id: "1", icon: "🛍️", title: "Welcome to Nectar!", body: "Start shopping fresh groceries today.", time: "Just now", read: false },
  { id: "2", icon: "🎉", title: "New promo available", body: "Use code FRESH10 for 10% off your order.", time: "1h ago", read: false },
  { id: "3", icon: "🚚", title: "Free delivery today!", body: "Orders above $20 get free delivery.", time: "3h ago", read: true },
  { id: "4", icon: "⭐", title: "Rate your last order", body: "How was your experience? Let us know!", time: "Yesterday", read: true },
  { id: "5", icon: "🥦", title: "Fresh arrivals", body: "New organic vegetables just arrived.", time: "2 days ago", read: true },
];

// ===== LOAD ALL ORDERS (cho admin) =====
export async function loadAllOrders() {
  try {
    const accountsRaw = await AsyncStorage.getItem(authKeys.accounts);
    const registered = accountsRaw ? JSON.parse(accountsRaw) : [];
    const allAccounts = [...HARDCODED, ...registered];

    const allOrders = await Promise.all(
      allAccounts.map(async (acc) => {
        const raw = await AsyncStorage.getItem(dataKeys(acc.email).orders);
        return raw ? JSON.parse(raw) : [];
      })
    );

    return allOrders.flat();
  } catch {
    return [];
  }
}
