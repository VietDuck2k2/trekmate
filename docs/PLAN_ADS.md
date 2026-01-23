# Kế hoạch điều phối: Phân loại Quảng cáo (Ad Categorization)

Kế hoạch này nhằm mục đích phân loại quảng cáo vào các nhóm khoa học (Chỗ ở, Ăn uống, Giải trí) để người dùng dễ dàng tìm kiếm và cải thiện trải nghiệm trên trang Ads.

## Giai đoạn 1: Lập kế hoạch (Hoàn thành)
- Nghiên cứu Model, Route và các trang Frontend liên quan đến Quảng cáo.
- Xác định các nhóm phân loại: `STAY` (Chỗ ở), `EAT` (Ăn uống), `PLAY` (Giải trí).

## Giai đoạn 2: Triển khai (Chờ phê duyệt)

### Thay đổi Database & Model (`database-architect` & `backend-specialist`)
- **Model:** Thêm trường `category` vào `adSchema` trong `be/src/models/ad.model.js`.
    - Kiểu: `String`, enum: `['STAY', 'EAT', 'PLAY', 'OTHER']`.
    - Mặc định: `OTHER`.

### Triển khai Backend API (`backend-specialist`)
- **Route:** `be/src/routes/ad.routes.js`.
- **POST / PUT:** Cập nhật logic tạo và chỉnh sửa quảng cáo để lưu trường `category`.
- **GET /api/ads:** Cập nhật logic liệt kê quảng cáo để hỗ trợ filter theo `category` qua query parameter.

### Tích hợp Frontend (`frontend-specialist`)
- **Service:** Cập nhật `adsAPI` trong `fe/src/services/api.js` để hỗ trợ tham số `category`.
- **Tạo/Chỉnh sửa:** Cập nhật `CreateAdPage.js` và `EditAdPage.js` để thêm dropdown chọn nhóm quảng cáo.
- **Trang Ads chính:** `AdsPage.js`.
    - Thêm các Tabs hoặc nút lọc (Chỗ ăn, Chỗ ở, Giải trí).
    - Tích hợp gọi API với category filter.
    - Duy trì phân trang và tìm kiếm theo server-side đã làm ở bước trước.

### Kiểm tra Bảo mật (`security-auditor`)
- Đảm bảo việc lọc theo `category` không làm lộ các dữ liệu nhạy cảm hoặc gây lỗi NoSQL injection.

## Giai đoạn 3: Xác minh (`test-engineer`)

### Kiểm thử
- Kiểm tra tính năng tạo quảng cáo với category mới.
- Kiểm tra việc lọc quảng cáo trên giao diện xem có hiển thị đúng nhóm hay không.
- Đảm bảo phân trang hoạt động ổn định khi lọc theo từng hạng mục.

---
## Yêu cầu phê duyệt
Vui lòng xem xét kế hoạch trên. Sau khi bạn đồng ý, tôi sẽ bắt đầu giai đoạn triển khai bằng cách điều phối các chuyên gia (agents).
