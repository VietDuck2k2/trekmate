# Kế hoạch điều phối: Tích hợp Google Maps (Hiển thị Vị trí)

Kế hoạch này nhằm mục đích tích hợp Google Maps vào nền tảng để hiển thị vị trí điểm họp (`meetingPoint`) và điểm đến (`location`) của các chuyến đi, giúp người dùng dễ dàng định vị và lên kế hoạch.

## Giai đoạn 1: Lập kế hoạch (Đang thực hiện)
- Nghiên cứu cơ sở dữ liệu và schema hiện tại của Trip.
- Tìm hiểu thư viện `@react-google-maps/api` để tích hợp vào React.
- Đề xuất giải pháp lưu trữ tọa độ (latitude/longitude) thay vì chỉ dùng chuỗi văn bản để tăng độ chính xác.

## Giai đoạn 2: Triển khai (Chờ phê duyệt)

### 1. Cấu hình & Hạ tầng (`backend-specialist` & `devops-engineer`)
- **API Key:** Thiết lập Google Maps API Key trong tệp `.env` (cả Backend và Frontend).
- **Hạn chế API:** Cấu hình hạn chế API Key chỉ cho tên miền/ứng dụng cụ thể trong Google Cloud Console để bảo mật.

### 2. Thay đổi Database & Backend API (`database-architect` & `backend-specialist`)
- **Trip Model:** Cập nhật `be/src/models/trip.model.js`.
    - Thêm trường `locationCoords`: `{ lat: Number, lng: Number }`.
    - Thêm trường `meetingPointCoords`: `{ lat: Number, lng: Number }`.
- **Routes:** Cập nhật `be/src/routes/trip.routes.js` để xử lý tọa độ khi tạo/cập nhật chuyến đi.

### 3. Tích hợp Frontend (`frontend-specialist`)
- **Thư viện:** Cài đặt `@react-google-maps/api`.
- **Trang Chi tiết (TripDetailPage):**
    - Hiển thị bản đồ nhỏ tại khu vực thông tin địa điểm.
    - Đánh dấu (`Marker`) vị trí điểm họp và điểm đến.
- **Trang Tạo/Sửa (CreateTripPage, EditTripPage):**
    - Tích hợp `Autocomplete` hoặc `Map Picker` để người dùng chọn địa điểm trực quan hơn.
    - Tự động lấy tọa độ khi người dùng chọn địa điểm.

### 4. Bảo mật & Tối ưu (`security-auditor` & `performance-optimizer`)
- **Bảo mật:** Đảm bảo API Key không bị lộ trong mã nguồn công khai (Sử dụng biến môi trường).
- **Tối ưu:** Load bản đồ theo kiểu "lazy-load" để không ảnh hưởng đến tốc độ tải trang ban đầu.

## Giai đoạn 3: Xác minh (`test-engineer`)
- Kiểm tra hiển thị bản đồ trên các trình duyệt khác nhau.
- Kiểm tra tính chính xác của tọa độ khi lấy từ chuỗi địa chỉ (Geocoding).
- Đảm bảo bản đồ hoạt động bình thường trên thiết bị di động.

---
## Yêu cầu phê duyệt
Vui lòng xem xét kế hoạch tích hợp bản đồ trên. Sau khi nhận được sự đồng ý của bạn, tôi sẽ tiến hành điều phối các chuyên gia để thực hiện.
