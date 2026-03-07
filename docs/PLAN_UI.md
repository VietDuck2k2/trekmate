# Kế hoạch Tối ưu UI & Fix Bug (Phase 6)

## Tổng quan
Kế hoạch này nhằm giải quyết các vấn đề về giao diện trên trang xác thực và sửa lỗi treo màn hình khi đăng nhập Google, cũng như địa phương hóa tiền tệ.

## Chi tiết các thay đổi (Implementation Plan)

### 1. Sửa lỗi ảnh nền trang Đăng nhập (`fe/src/pages/LoginPage.js`)
- **Vấn đề:** Link ảnh từ Unsplash hiện tại bị hỏng hoặc hết hạn.
- **Giải pháp:** Thay thế bằng một URL ảnh leo núi/trekking chất lượng cao, ổn định hơn trên Unsplash (ví dụ: `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b` hoặc tương tự).

### 2. Dọn dẹp UI trang Đăng ký (`fe/src/pages/RegisterPage.js`)
- **Vấn đề:** Giao diện hiển thị nút đăng nhập bằng Google và GitHub gây thừa thãi và không đồng nhất với luồng thiết kế hiện tại.
- **Giải pháp:** Loại bỏ hoàn toàn khối mã HTML hiển thị chữ "Or register with" và các nút Google/GitHub ở cuối trang `RegisterPage.js`.

### 3. Khắc phục lỗi treo ở màn hình "Authenticating..." (`fe/src/pages/LoginSuccess.js` & `fe/src/contexts/AuthContext.js`)
- **Vấn đề:** Quá trình chuyển hướng bị kẹt ở vòng lặp vô hạn do cơ chế quản lý state của React. Hàm `login()` trong `AuthContext` được khởi tạo lại ở mỗi lần render, khiến `useEffect` trong `LoginSuccess.js` chạy đi chạy lại liên tục.
- **Giải pháp:**
  - Áp dụng `useCallback` cho các hàm `login`, `logout`, `updateUser` trong `fe/src/contexts/AuthContext.js` để giữ nguyên reference.
  - Tích hợp thêm xử lý an toàn để nếu có lỗi trong `JSON.parse` sẽ chuyển hướng đúng cách thay vì bị kẹt.

### 4. Đổi tiền tệ sang VNĐ trong trang Tạo Trip (`fe/src/pages/CreateTripPage.js`)
- **Vấn đề:** Đang hiển thị ký hiệu `$` và đơn vị tính thập phân không phù hợp với VNĐ.
- **Giải pháp:**
  - Đổi ký hiệu hiển thị ở phần "Live Preview" từ `$` sang `VNĐ` (ở phía sau số lượng).
  - Cập nhật thẻ Input của "Cost Per Person", xóa thuộc tính `step="0.01"` và thay đổi Placeholder thành `1000000` thay vì `0` để phù hợp với mệnh giá Việt Nam. Mệnh giá tối thiểu đổi thành `0`.

## Checklist Đợi Duyệt
- [ ] Giao diện Đăng nhập đẹp mắt hơn
- [ ] Form Đăng ký sạch sẽ hơn
- [ ] Tính năng Đăng nhập Google hoạt động mượt mà
- [ ] Giao diện Tạo Trip chuẩn tiền Việt

---
*Vui lòng phản hồi Y/N để Agent tiến hành thực hiện.*
