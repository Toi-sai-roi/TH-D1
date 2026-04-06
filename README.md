Lê Văn Tùng -23810310325

6 - 4 - 2026

- Em dùng constants/products.ts (làm từ lâu, thay thì sẽ phải mò lại các file khác liên quan nên sẽ rất lâu) thay cho data.js, cấu trúc JSON giống nhau, logic tìm kiếm JS đầy đủ.
- Không thay đổi quá nhiều...
- Sử dụng AsyncStorage để lưu giỏ hàng, danh sách yêu thích và lịch sử đơn hàng trên máy, thoát app vẫn giữ nguyên dữ liệu.

![alt text](assets/scr-sh/Search_scr.png)
![alt text](assets/scr-sh/Explore_scr.png)
![alt text](assets/scr-sh/Cart_scr.png)
![alt text](assets/scr-sh/Filters_scr.png)
![alt text](assets/scr-sh/Favouriters_scr.png)

1 - 4 - 2026

- Notifications tab thay Favourites
- Favourites chuyển vào Account menu
- Order history trong Account
- xoá cart + empty state
- random 20% order fail
- AsyncStorage lưu cart, favs, orders
- fix: qty khi add, checkout không cho order khi cart trống

29 - 3 - 2026

- fix card height
- fix nút + ở các sản phẩm
- fix qty truyền đúng vào cart khi add
- checkout check cart rỗng → order failed
- clear cart sau khi order success
- thêm order history trong account
