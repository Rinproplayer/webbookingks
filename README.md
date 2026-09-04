# Hostay – Nền Tảng Đặt Phòng & Quản Trị Khách Sạn & Homestay Đà Nẵng

Hệ thống Web đặt phòng trực tuyến kết hợp Quản trị khách sạn (PMS) chuyên biệt hóa cho thành phố **Đà Nẵng**, được thiết kế và lập trình trọn vẹn 11 Module theo tài liệu đặc tả **`Socpe .docx`** và **`QTDAPM_HoanThien.docx`**.

---

## 🌟 Các Tính Năng & 11 Phân Hệ (Modules)

1. **Module 1: Quản lý tài khoản & Phân quyền RBAC**
   - Đăng ký, đăng nhập bảo mật bằng JWT và Bcrypt.
   - Hỗ trợ 3 vai trò người dùng: Khách hàng (`customer`), Chủ khách sạn/Đối tác (`hotelier`), Quản trị viên (`admin`).
   - Quy trình nộp hồ sơ đối tác và ban quản trị phê duyệt.
   - Khóa/mở khóa tài khoản (Soft delete).
2. **Module 2: Quản lý Điểm du lịch Đà Nẵng (Cẩm nang du lịch)**
   - 5 chủ đề: Bãi biển, Di tích lịch sử, Văn hóa tâm linh, Thiên nhiên sinh thái, Ẩm thực & Chợ đêm.
   - Lọc theo từng quận/huyện tại Đà Nẵng (Hải Châu, Sơn Trà, Ngũ Hành Sơn, Hòa Vang,...).
   - Tích hợp bản đồ số Leaflet/OpenStreetMap.
   - **Tự động gợi ý các khách sạn lân cận cùng địa bàn** và chức năng Lưu điểm yêu thích (Wishlist).
3. **Module 3: Quản lý Khách sạn & Cơ sở lưu trú**
   - Hồ sơ cơ sở: Loại hình (Khách sạn, Resort, Homestay, Căn hộ), tiêu chuẩn sao, tiện ích, chính sách nhận/trả phòng.
   - Bật/tắt mở cửa đón khách.
4. **Module 4: Tìm kiếm & Bộ lọc nâng cao**
   - Tìm theo từ khóa, khu vực Đà Nẵng, khoảng ngày Check-in/Check-out, số khách.
   - Bộ lọc thanh trượt khoảng giá, số sao, tiện ích (hồ bơi, giáp biển, ăn sáng, đưa đón sân bay,...).
   - Sắp xếp: Giá tăng/giảm, đánh giá cao nhất, độ phổ biến.
5. **Module 5: Quản lý Hạng phòng & Tình trạng phòng thời gian thực**
   - Phân loại: Standard, Superior, Deluxe, Suite, Family, Dorm.
   - Quản lý giá đêm thường, giá cuối tuần và giá mùa lễ hội pháo hoa quốc tế DIFF.
   - Tự động trừ buồng phòng khi đặt và hoàn buồng khi hủy.
6. **Module 6: Đặt phòng & Phiếu vé điện tử QR**
   - Tự động tính tiền theo số đêm và trừ chiết khấu mã giảm giá.
   - Sinh mã đặt chỗ duy nhất định dạng chuẩn: `HT-2026-XXXX`.
   - Sinh mã QR chứa token mã hóa trên vé điện tử để Check-in không chạm.
   - Quản lý lịch sử đặt phòng và gửi yêu cầu hủy đơn.
7. **Module 7: Thanh toán trực tuyến**
   - Tích hợp cổng VNPay Sandbox (VNPay-QR, ATM) với chữ ký HMAC-SHA512.
   - Tích hợp Ví MoMo Sandbox.
   - Chế độ Mô phỏng thanh toán Sandbox (Mock Mode) giúp kiểm thử trơn tru 100% luồng mà không phụ thuộc môi trường ngoài.
   - Nhật ký giao dịch (Payment Logs).
8. **Module 8: Đánh giá & Nhận xét xác thực sau lưu trú**
   - Chỉ mở quyền đánh giá cho khách hàng đã thực hiện Check-out thực tế (chống review ảo).
   - Chấm điểm chi tiết 5 tiêu chí: Sạch sẽ, Vị trí, Phục vụ, Tiện nghi, Giá trị tiền bỏ ra.
   - Tải ảnh thực tế và chức năng Ban quản lý khách sạn phản hồi trực tiếp bình luận.
9. **Module 9: Khuyến mãi & Mã giảm giá (Voucher Engine)**
   - Các mã mẫu sẵn có: `CHAODANANG2026` (Giảm 15%), `DIFF50K` (Giảm 50.000đ), `HEVIETNAM`, `HOSTAYNEW`.
   - Kiểm tra hạn mức, ngày bắt đầu/kết thúc, số lượt sử dụng tối đa và trừ tiền tức thì.
10. **Module 10: Quản lý Check-in / Check-out không chạm**
    - Quầy Lễ tân hỗ trợ: Quét camera mã QR trên điện thoại khách hoặc tra cứu nhanh theo mã vé/SĐT.
    - Bấm xác nhận **Check-in**: Đơn chuyển sang `Đang lưu trú`, phòng chuyển sang `Đang có khách`.
    - Bấm xác nhận **Check-out**: Đơn chuyển sang `Hoàn thành`, phòng chuyển sang `Cần dọn dẹp/Còn trống`, tự động mở quyền Đánh giá cho du khách.
    - Xử lý khách vắng mặt (No-show).
11. **Module 11: Quản trị hệ thống & Báo cáo Dashboard Analytics**
    - Biểu đồ cột tổng hợp doanh thu 12 tháng năm 2026 (Chart.js).
    - Thống kê tỷ lệ lấp phòng (Occupancy Rate) thời gian thực.
    - **Nút Xuất báo cáo dữ liệu ra file Excel (.xlsx)** chuẩn kế toán cho danh sách đơn đặt phòng và doanh thu.

---

## 🔑 Tài Khoản Mẫu Để Kiểm Thử (Đã Nạp Sẵn Trong Cơ Sở Dữ Liệu)

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn truy cập |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@hostay.vn` | `Admin@123` | Master Admin: Biểu đồ doanh thu 12 tháng, duyệt đối tác, quản trị voucher, quản lý người dùng, xuất Excel |
| **Chủ khách sạn (Hotelier)** | `hotelier@hostay.vn` | `Hotelier@123` | Quản lý khách sạn Sơn Trà Ocean Resort: Quầy Lễ Tân Check-in/Check-out mã QR, quản lý phòng, bảng giá DIFF |
| **Khách hàng (Customer)** | `customer@hostay.vn` | `Customer@123` | Đặt phòng, áp mã voucher, nhận vé điện tử QR, thanh toán, viết đánh giá sau khi trả phòng |

*(Tại màn hình Đăng nhập có sẵn các nút bấm 1-Click để điền nhanh thông tin tài khoản mẫu mà không cần gõ tay).*

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu môi trường:
- **Node.js**: Phiên bản $\ge$ 18.x (Đã có v22.19.0)
- **Cơ sở dữ liệu**: Đã tích hợp sẵn bộ nhớ đệm `MongoMemoryServer` tự động chạy ngầm, không bắt buộc phải cài đặt MongoDB local hay cấu hình phức tạp.

### Bước 1: Khởi động Backend Server
```bash
cd d:/webbookingks/server
npm start
```
*Server sẽ tự động kết nối và nạp toàn bộ cơ sở dữ liệu mẫu chuẩn Đà Nẵng tại `http://localhost:5000`.*

### Bước 2: Khởi động Frontend Client
```bash
cd d:/webbookingks/client
npm run dev
```
*Giao diện Web sẽ chạy tại `http://localhost:5173`.*
