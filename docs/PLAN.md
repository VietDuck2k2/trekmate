# Kế hoạch điều phối: Tìm kiếm Quảng cáo phía Server-side

Kế hoạch này phác thảo việc chuyển đổi logic tìm kiếm và lọc Quảng cáo từ phía client (trình duyệt) sang phía server để cải thiện hiệu suất và khả năng mở rộng.

## Giai đoạn 1: Lập kế hoạch (Hoàn thành)
- Phân tích logic lọc dữ liệu hiện tại trong `AdsPage.js`.
- Phân tích Model `Ad` và API danh sách quảng cáo hiện có ở Backend.

## Giai đoạn 2: Triển khai (Chờ phê duyệt)

### Triển khai Backend (`backend-specialist`)
- **Chỉnh sửa Route:** `GET /api/ads` trong `be/src/routes/ad.routes.js`.
- **Logic:**
    - Chấp nhận tham số truy vấn `q` hoặc `search`.
    - Triển khai bộ lọc MongoDB tìm kiếm trên các trường:
        - `title` (Tiêu đề)
        - `description` (Mô tả)
    - **Tối ưu hóa:** Đề xuất sử dụng regex (không phân biệt hoa thường) hoặc Text Index.

### Tích hợp Frontend (`frontend-specialist`)
- **Cập nhật Service:** Cập nhật `adsAPI.getAds` trong `fe/src/services/api.js` để gửi tham số tìm kiếm.
- **Cập nhật Trang:** `fe/src/pages/AdsPage.js`.
    - Thay thế logic `ads.filter` cục bộ bằng việc gọi API mỗi khi từ khóa tìm kiếm thay đổi.
    - Triển khai **debouncing** (trễ lệnh) để tránh gọi API quá nhiều lần khi người dùng đang gõ phím.
    - Cập nhật trạng thái `loading` khi đang tìm kiếm.

### Bảo mật & Cơ sở dữ liệu (`security-auditor` & `database-architect`)
- **Bảo mật:** Đảm bảo từ khóa tìm kiếm được làm sạch để tránh các kiểu tấn công injection hoặc ReDoS.
- **Cơ sở dữ liệu:** Khởi tạo Text Index trên `title` và `description` để tìm kiếm hiệu quả hơn.

## Giai đoạn 3: Xác minh (`test-engineer`)

### Kiểm thử tự động
- Tạo các bài kiểm tra tích hợp (integration tests) để xác nhận `GET /api/ads?search=xxx` chỉ trả về kết quả khớp.
- Kiểm tra tính năng phân trang vẫn hoạt động đúng khi có kết quả tìm kiếm.

### Xác minh thủ công
- Thử nghiệm các từ khóa khác nhau trên giao diện và kiểm tra Network tab để đảm bảo API được gọi đúng và trả về kết quả chính xác.

---
## Yêu cầu phê duyệt
Vui lòng xem xét kế hoạch trên. Sau khi bạn đồng ý, tôi sẽ bắt đầu giai đoạn triển khai bằng cách điều phối các chuyên gia (agents).
