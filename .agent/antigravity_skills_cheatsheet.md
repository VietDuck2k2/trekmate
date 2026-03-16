# Antigravity Skills Cheat Sheet

## 1. Các skill thường dùng nhất

### `@brainstorming`
Dùng để:
- nghĩ ý tưởng
- đề xuất feature
- phân tích bài toán trước khi code

Hợp khi:
- mới bắt đầu dự án
- bí hướng làm
- muốn xác định MVP

### `@architecture`
Dùng để:
- đọc tổng quan dự án
- phân tích module
- thiết kế hoặc refactor kiến trúc
- tối ưu luồng nghiệp vụ

Hợp khi:
- dự án đã có sẵn
- muốn hiểu flow tổng thể
- muốn sửa một phần mà không phá phần khác

### `@test-driven-development`
Dùng để:
- phân tích test case
- viết unit test / integration test
- tạo regression test
- test một luồng nghiệp vụ

Hợp khi:
- cần coverage cao
- muốn fix bug có test đi kèm
- muốn test flow nghiệp vụ rõ ràng

### `@debugging-strategies`
Dùng để:
- tìm nguyên nhân lỗi
- khoanh vùng bug
- lên chiến lược debug

Hợp khi:
- tính năng đang lỗi
- không rõ lỗi nằm ở FE, BE hay DB
- flow chạy sai nhưng chưa biết vì sao

### `@api-design-principles`
Dùng để:
- thiết kế API REST
- chuẩn hóa endpoint
- request/response rõ ràng
- status code nhất quán

Hợp khi:
- chuẩn bị viết backend
- API đang lộn xộn
- muốn review lại design API

### `@security-auditor`
Dùng để:
- rà auth
- rà phân quyền
- check input validation
- check risk bảo mật

Hợp khi:
- có login/JWT
- có wallet/payment
- có admin/staff/teacher/student roles
- sắp deploy

### `@lint-and-validate`
Dùng để:
- rà nhanh chất lượng code
- check cấu trúc, style, vấn đề hiển nhiên
- check consistency

Hợp khi:
- muốn review nhẹ trước commit
- muốn clean code nhanh
- chưa cần review quá sâu

### `@create-pr`
Dùng để:
- viết PR description
- tóm tắt thay đổi
- liệt kê test steps
- đóng gói công việc sạch sẽ

Hợp khi:
- chuẩn bị merge
- làm teamwork
- cần mô tả thay đổi rõ cho reviewer

### `@doc-coauthoring`
Dùng để:
- viết README
- viết tài liệu kỹ thuật
- viết mô tả module
- viết hướng dẫn bàn giao

Hợp khi:
- làm đồ án nhóm
- cần tài liệu cho team
- cần ghi lại business flow hoặc API

### `@frontend-design`
Dùng để:
- phân tích UI
- đề xuất layout
- tối ưu trải nghiệm người dùng
- thiết kế màn hình

Hợp khi:
- làm React/Next/Flutter FE
- màn hình đang rối
- cần định hướng UI trước khi code

## 2. Combo skill hữu ích nhất theo tình huống

### 2.1 Đọc hiểu một dự án có sẵn
**Combo:**
- `@architecture`
- `@lint-and-validate`

**Dùng khi:**
- mới nhận dự án
- cần hiểu tổng quan nhanh
- muốn biết dự án đang ổn hay rối

**Prompt mẫu:**
```text
Use @architecture and @lint-and-validate to analyze this existing project.
Explain the architecture, main modules, request flow, and major structural issues.
Trả lời bằng tiếng Việt.
```

### 2.2 Một tính năng đang bị lỗi
**Combo:**
- `@debugging-strategies`
- `@architecture`

**Dùng khi:**
- feature bị lỗi
- chưa rõ root cause
- muốn sửa đúng chỗ

**Prompt mẫu:**
```text
Use @debugging-strategies and @architecture to analyze this broken feature.
Please identify root cause, affected business flow, and propose a safe fix.
Trả lời bằng tiếng Việt.
```

### 2.3 Sửa bug + chống lỗi quay lại
**Combo:**
- `@debugging-strategies`
- `@test-driven-development`

**Dùng khi:**
- vừa muốn sửa bug
- vừa muốn viết test để tránh tái diễn

**Prompt mẫu:**
```text
Use @debugging-strategies and @test-driven-development to analyze this bug, propose a fix, and generate regression tests.
Trả lời bằng tiếng Việt.
```

### 2.4 Sửa code + tối ưu luồng nghiệp vụ
**Combo:**
- `@architecture`
- `@debugging-strategies`
- `@test-driven-development`

**Dùng khi:**
- code chạy nhưng flow chưa hợp lý
- muốn refactor an toàn
- muốn test lại flow sau khi sửa

### 2.5 Thiết kế backend cho tính năng mới
**Combo:**
- `@architecture`
- `@api-design-principles`

**Dùng khi:**
- chuẩn bị viết backend
- muốn endpoint và module rõ ngay từ đầu

**Prompt mẫu:**
```text
Use @architecture and @api-design-principles to design this backend feature.
Include modules, service flow, endpoints, request/response, and validations.
Trả lời bằng tiếng Việt.
```

### 2.6 Review phần auth / role / phân quyền
**Combo:**
- `@security-auditor`
- `@architecture`

**Dùng khi:**
- có JWT
- có teacher/admin/student
- có phân quyền theo role

### 2.7 Test một luồng nghiệp vụ
**Combo:**
- `@architecture`
- `@test-driven-development`

**Dùng khi:**
- test flow như giáo viên điểm danh
- đăng nhập → chọn buổi học → submit dữ liệu → kiểm tra kết quả

**Prompt mẫu:**
```text
Use @architecture and @test-driven-development to analyze and automate tests for this business flow.
Trả lời bằng tiếng Việt.
```

### 2.8 Review code trước khi merge
**Combo:**
- `@lint-and-validate`
- `@security-auditor`
- `@create-pr`

**Dùng khi:**
- đã code xong
- muốn rà nhanh trước PR
- muốn gói công việc gọn

### 2.9 Viết tài liệu dự án / handoff cho team
**Combo:**
- `@architecture`
- `@doc-coauthoring`

**Dùng khi:**
- cần README
- cần mô tả hệ thống
- cần tài liệu giao lại cho teammate

### 2.10 Thiết kế giao diện + flow màn hình
**Combo:**
- `@frontend-design`
- `@architecture`

**Dùng khi:**
- cần vừa UI đẹp vừa đúng business flow
- muốn tránh màn hình đẹp nhưng logic dở

## 3. Bộ combo mạnh nhất nên nhớ

### Combo A — mới nhận dự án
- `@architecture`
- `@lint-and-validate`

### Combo B — feature bị lỗi
- `@debugging-strategies`
- `@architecture`

### Combo C — sửa bug chuẩn chỉnh
- `@debugging-strategies`
- `@test-driven-development`

### Combo D — tối ưu flow nghiệp vụ
- `@architecture`
- `@test-driven-development`

### Combo E — có auth / role / dữ liệu nhạy cảm
- `@architecture`
- `@security-auditor`

### Combo F — chuẩn bị merge
- `@lint-and-validate`
- `@create-pr`

## 4. Bộ skill thực dụng nhất

Với kiểu dự án backend + frontend có auth, role, business flow rõ như bạn đang làm, nên dùng thường xuyên nhất 6 skill này:
- `@architecture`
- `@debugging-strategies`
- `@test-driven-development`
- `@security-auditor`
- `@api-design-principles`
- `@create-pr`

Chỉ cần dùng tốt 6 cái này là đủ mạnh cho:
- đọc dự án
- sửa bug
- tối ưu flow
- test
- review bảo mật
- merge code

## 5. Cách chọn skill nhanh theo câu hỏi

- **“Tôi chưa hiểu dự án này”** → `@architecture`
- **“Tính năng này đang lỗi”** → `@debugging-strategies`
- **“Tôi muốn test flow này”** → `@test-driven-development`
- **“Tôi muốn tối ưu nghiệp vụ”** → `@architecture`
- **“Tôi muốn rà quyền truy cập / JWT”** → `@security-auditor`
- **“Tôi sắp merge”** → `@create-pr`
- **“Tôi muốn chuẩn hóa API”** → `@api-design-principles`

## 6. Một combo mẫu rất mạnh cho quy trình thật

Nếu bạn đang xử lý một feature từ đầu đến cuối:

```text
@architecture
→ @debugging-strategies
→ @test-driven-development
→ @security-auditor
→ @create-pr
```

Ý nghĩa:
1. hiểu flow
2. tìm lỗi
3. viết test
4. rà bảo mật
5. đóng gói PR

Đây là combo gần giống workflow team dev thật nhất.

