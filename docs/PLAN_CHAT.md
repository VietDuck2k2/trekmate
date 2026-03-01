# Kế hoạch điều phối: Tính năng Live Chat cho Nhóm Trekking
**Version:** 1.0 | **Ngày tạo:** 2026-02-23

## Tổng quan

Tính năng Live Chat cho phép thành viên trong cùng nhóm trekking nhắn tin thời gian thực, giao diện tương tự Zalo. Mỗi nhóm có:
- **Group Chat:** Đoạn chat chung cho tất cả thành viên trong chuyến đi.
- **Private Chat (DM):** Nhắn tin riêng (1-1) giữa 2 thành viên trong cùng nhóm.

---

## Giai đoạn 1: Lập kế hoạch ✅

### Phân tích Công nghệ

**Quyết định kỹ thuật: Socket.IO**

| Yêu cầu | Lý do chọn Socket.IO |
|---------|----------------------|
| Real-time | WebSocket qua Socket.IO |
| Tương thích BE | Node.js/Express có thư viện `socket.io` |
| Tương thích FE | React có `socket.io-client` |
| Dễ mở rộng | Rooms, Namespaces sẵn có |
| Fallback | Tự động fallback về polling nếu WS bị chặn |

---

## Giai đoạn 2: Triển khai (Chờ phê duyệt)

### A. Database Schema (`database-architect`)

#### Mô hình Tin nhắn: `be/src/models/message.model.js` [NEW]
```js
{
  trip:        ObjectId (ref: Trip),       // Cuộc trò chuyện thuộc chuyến đi nào
  type:        String ("group" | "direct"),// Nhóm hay riêng tư
  sender:      ObjectId (ref: User),       // Người gửi
  receiver:    ObjectId (ref: User),       // Người nhận (chỉ cho DM)
  content:     String,                     // Nội dung tin nhắn
  readBy:     [ObjectId (ref: User)],      // Người đã đọc
  createdAt:   Date                        // Thời gian gửi
}
```

### B. Backend API & Socket Server (`backend-specialist`)

#### Thay đổi `be/src/index.js` [MODIFY]
- Nâng cấp từ `app.listen` lên `http.createServer(app)`.
- Gắn `socket.io` vào HTTP server.
- Cấu hình CORS cho WebSocket.

#### Socket Events
| Event (Client → Server) | Mô tả |
|--------------------------|-------|
| `join_trip` | Vào phòng chat của chuyến đi |
| `send_message` | Gửi tin nhắn (group hoặc DM) |
| `mark_as_read` | Đánh dấu đã đọc |

| Event (Server → Client) | Mô tả |
|--------------------------|-------|
| `new_message` | Nhận được tin nhắn mới |
| `message_read` | Cập nhật trạng thái đã đọc |

#### Thêm REST API: `be/src/routes/chat.routes.js` [NEW]
- `GET /api/trips/:id/messages/group` - Lấy lịch sử chat nhóm
- `GET /api/trips/:id/messages/direct/:userId` - Lấy lịch sử DM
- `GET /api/trips/:id/conversations` - Danh sách DM trong nhóm

### C. Frontend (`frontend-specialist`)

#### Cấu trúc Components mới
```
fe/src/
├── pages/
│   └── ChatPage.js         [NEW] - Trang chat chính (route: /trips/:id/chat)
├── components/
│   ├── ChatSidebar.js      [NEW] - Sidebar: Group + danh sách DM
│   ├── ChatWindow.js       [NEW] - Khung chat hiển thị tin nhắn
│   ├── ChatInput.js        [NEW] - Ô nhập text + nút gửi
│   └── MessageBubble.js    [NEW] - Bubble tin nhắn (giống Zalo)
├── contexts/
│   └── ChatContext.js      [NEW] - Quản lý Socket.IO connection
└── services/
    └── chatAPI.js          [NEW] - Gọi REST API lấy lịch sử
```

#### UI/UX (Phong cách Zalo)
- **Sidebar trái:** Danh sách cuộc trò chuyện (Group + DM)
- **Khung chat:** Bubble xanh (mình gửi), xám (người khác gửi)
- **Thời gian:** Hiển thị timestamp
- **Badge:** Số tin nhắn chưa đọc
- **Avatar:** Thumbnail thành viên trong DM

#### Tích hợp vào `TripDetailPage.js` [MODIFY]
- Thêm nút "Chat nhóm" dẫn đến `/trips/:id/chat`

---

## Giai đoạn 3: Bảo mật (`security-auditor`)
- Xác thực Socket.IO bằng JWT token.
- Chỉ thành viên trong chuyến đi mới được join room.
- Sanitize nội dung tin nhắn trước khi lưu.

---

## Giai đoạn 4: Kiểm thử (`test-engineer`)
- Test socket connection/disconnection.
- Test gửi/nhận tin nhắn group và DM.
- Test không cho phép người ngoài join room.

---

## Yêu cầu phê duyệt

Bạn có đồng ý với kế hoạch Live Chat này không?
- **Đồng ý:** Tôi sẽ bắt đầu triển khai ngay.
- **Cần sửa đổi:** Vui lòng cho biết điểm cần thay đổi.
