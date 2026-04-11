Lê Văn Tùng - 23810310325

11 - 4 - 2026

## ✅ Chức năng

### 1. Xác thực & Lưu đăng nhập
- Login lưu user vào AsyncStorage
- Tự động đăng nhập lại khi mở app (Auto Login)
- Session tự động hết hạn sau 7 ngày
- Logout xóa session, về màn hình đăng nhập
- Đăng ký tài khoản mới, validate trùng email

### 2. Giỏ hàng
- Thêm sản phẩm vào giỏ
- Tăng/giảm số lượng, xóa sản phẩm
- Lưu giỏ hàng vào AsyncStorage, persist sau reload
- Dữ liệu riêng theo từng tài khoản

### 3. Đơn hàng
- Checkout lưu đơn vào AsyncStorage
- Hiển thị danh sách đơn hàng (sản phẩm, tổng tiền, thời gian)
- Persist sau reload

### Bonus
⭐ Phân quyền Admin / User (role-based access)
⭐ Dữ liệu cart/orders riêng theo từng tài khoản
⭐ Revenue Report toàn hệ thống (chỉ Admin thấy)
⭐ Đăng ký tài khoản mới + validate trùng email
⭐ Thông báo mặc định khi lần đầu đăng nhập
⭐ Tự động hết hạn session sau 30 giây (demo)
⭐ StorageService — custom storage layer (try/catch, JSON tập trung)
---

## 🔑 Tài khoản demo

| tung@shop.com | tung123 | User |
| binh@shop.com | binh123 | User |
| admin@shop.com | admin123 | Admin |

---

## 🛠 Kỹ thuật

- `@react-native-async-storage/async-storage`
- `async/await` + `try/catch`
- `JSON.stringify` / `JSON.parse`
- File riêng: `services/StorageService.ts` 
(Em có tổ chức logic AsyncStorage vào file riêng services/StorageService.ts, đóng vai trò như một custom storage layer, giúp tái sử dụng và không cần viết lặp try/catch, JSON.stringify/parse ở nhiều nơi.
Về bản chất StorageService của em hoạt động tương tự custom hook mà thầy yêu cầu, chỉ khác là em tách thành service file thay vì hook để dùng được cả ngoài component.)
- React Context API (`CartContext`)

---

## 🚀 Hướng dẫn chạy app

```bash
git clone https://github.com/Toi-sai-roi/TH-D1
cd my-app
npm install
npx expo start
```

Quét QR bằng Expo Go trên điện thoại hoặc chạy trên web bằng `npx expo start --web`

---

## Câu hỏi lý thuyết

**1. AsyncStorage hoạt động như thế nào?**  
AsyncStorage là hệ thống lưu trữ key-value bất đồng bộ, lưu dữ liệu dạng string trên thiết bị. Dữ liệu được lưu dưới dạng JSON thông qua `JSON.stringify` và đọc lại bằng `JSON.parse`.

**2. Vì sao dùng AsyncStorage thay vì biến state?**  
Biến state chỉ tồn tại trong bộ nhớ, mất khi app bị tắt. AsyncStorage lưu xuống bộ nhớ thiết bị nên dữ liệu vẫn còn sau khi reload hoặc tắt app.

**3. So sánh với Context API**  
Context API quản lý state trong bộ nhớ RAM, chia sẻ dữ liệu giữa các component nhưng không persist. AsyncStorage lưu xuống ổ đĩa, persist sau reload nhưng không reactive. Trong app này em kết hợp cả hai: Context API để quản lý state realtime, AsyncStorage để persist dữ liệu.

## Demo

![text](assets/scr-sh/28310310325_01_login.png) ![text](assets/scr-sh/28310310325_02_autologin.png) ![text](assets/scr-sh/28310310325_03_logout.png) ![text](assets/scr-sh/28310310325_04_addCart.png) ![text](assets/scr-sh/28310310325_05_cartReload.png) ![text](assets/scr-sh/23810310325_06_updateQty.png) ![text](assets/scr-sh/23810310325_07_orderSuccess.png) ![text](assets/scr-sh/23810310325_08_orderList.png) ![text](<assets/scr-sh/23810310325_09_orderList - Reload.png>)

## 🎥 Video Demo
[▶ Bấm vào đây để xem video demo](https://youtu.be/vqvwiP1lcHo)

10 - 4 - 2026

- 4 screen
 Ngoài ra:
- thêm active cho nút 'see all'
- sửa fail/succes hiện thị rõ trên history
- thêm promo code, có trong checkout và cả account

![alt text](assets/scr-sh/checkout.png) ![alt text](assets/scr-sh/failed.png) ![alt text](assets/scr-sh/success.png) ![alt text](assets/scr-sh/account.png)

6 - 4 - 2026 (không biết làm gì)

- Thêm badge số lượng trên icon cart và notifications ở tab bar
- Thêm tính năng lọc sản phẩm theo danh mục và thương hiệu, sort theo giá tăng/giảm dần.
- Thêm tính năng đánh giá sản phẩm (thật, cái cũ chỉ là text cứng), đánh giá app (Rate Us) trong Account
- Thêm chỉnh sửa tên/email trong Profile

6 - 4 - 2026 (thực hành)

- Em dùng constants/products.ts (làm từ lâu, thay thì sẽ phải mò lại các file khác liên quan nên sẽ rất lâu) thay cho data.js, cấu trúc JSON giống nhau, logic tìm kiếm JS đầy đủ.
- Không thay đổi quá nhiều...
- Sử dụng AsyncStorage để lưu giỏ hàng, danh sách yêu thích và lịch sử đơn hàng trên máy, thoát app vẫn giữ nguyên dữ liệu.

![text](assets/scr-sh/Cart_scr.png) ![text](assets/scr-sh/Explore_scr.png) ![text](assets/scr-sh/Favouriters_scr.png) ![text](assets/scr-sh/Filters_scr.png) ![text](assets/scr-sh/Search_scr.png)

1 - 4 - 2026 (thực hành)

- Notifications tab thay Favourites
- Favourites chuyển vào Account menu
- Order history trong Account
- xoá cart + empty state
- random 20% order fail
- AsyncStorage lưu cart, favs, orders
- fix: qty khi add, checkout không cho order khi cart trống

29 - 3 - 2026 (thực hành)

- fix card height
- fix nút + ở các sản phẩm
- fix qty truyền đúng vào cart khi add
- checkout check cart rỗng → order failed
- clear cart sau khi order success
- thêm order history trong account
