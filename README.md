# Phiên Dịch Văn Hoá Số (Digital Cultural Interpreter)

> **Dự án tham gia Cuộc thi AISC'26 - Lĩnh vực Data-Driven Business**  
> **Đơn vị thực hiện:** Đội Asteria - Khoa Hệ thống Thông tin, Trường Đại học Công nghệ Thông tin (ĐHQG-HCM)

---

## 🌟 Giới thiệu Đề án

**Phiên Dịch Văn Hoá Số** là giải pháp công nghệ xã hội (Social Tech) ứng dụng mô hình **RAG (Retrieval-Augmented Generation)** nhằm giải quyết các rào cản thích nghi văn hóa, pháp lý và đời sống cho cộng đồng người Việt sinh sống, học tập và làm việc tại **Nhật Bản (JP)**, **Hàn Quốc (KR)** và **Australia (AU)**.

Dự án chuẩn hóa dữ liệu trên **9 lĩnh vực đời sống trọng yếu**, kết hợp với kho dữ liệu kiểm chuẩn chính thống (**Evidence Cards Hub**) giúp ngăn chặn triệt để hiện tượng suy diễn sai lệch (AI Hallucination) trong các hướng dẫn pháp lý và ứng xử văn hóa.

---

## 🚀 Các tính năng chính

1. **Trợ Lý Văn Hoá AI (Cultural AI Copilot):**
   - Phân tích câu hỏi theo từng bối cảnh người dùng (*Quốc gia, Mục đích: Du học/Lao động/Định cư, Giai đoạn hành trình*).
   - Câu trả lời có cấu trúc chuẩn 4 phần:
     1. Bối cảnh văn hóa & nguyên tắc cốt lõi
     2. Hành vi ứng xử an toàn (Safe Action)
     3. Những điều tối kỵ cần tránh (Don'ts)
     4. Thẻ bằng chứng trích dẫn kèm độ tin cậy (%) & ngày kiểm chứng
   - Tích hợp gửi phản hồi hữu ích (Feedback) và tạo Ticket báo lỗi.

2. **Thẻ Bằng Chứng (Evidence Cards Hub):**
   - Kho lưu trữ các tình huống thực tế và quy định chuẩn hóa theo 9 lĩnh vực: *Thủ tục hành chính & Pháp lý, Lao động & Việc làm thêm, Thuê nhà & Sinh hoạt, Giao tiếp & Kính ngữ, Y tế & Bảo hiểm, Tài chính & Tín dụng, Ứng xử công cộng, Học tập & Trường sở, Xử lý khẩn cấp*.
   - Bộ lọc linh hoạt theo quốc gia và lĩnh vực kèm modal xem chi tiết.

3. **Khảo Sát & Đóng Góp Trải Nghiệm:**
   - Thu thập dữ liệu thực tế từ cộng đồng qua bảng hỏi và thang đo Likert.
   - Tích hợp bộ lọc tự động khử định danh cá nhân (**100% PII Anonymization**) trước khi chuyển về hàng đợi kiểm duyệt.

4. **Thống Kê Dữ Liệu (Analytics Dashboard):**
   - Báo cáo trực quan hóa các chỉ số thực chứng bám sát nghiên cứu: tỷ lệ khó khăn theo lĩnh vực, thời gian thích nghi trung bình theo quốc gia, mức độ chuẩn bị văn hóa trước khi khởi hành.

5. **Cổng Quản Trị (Admin Queue & Master Data):**
   - Hàng đợi kiểm duyệt khảo sát và ticket phản hồi với thao tác Duyệt (Approve) hoặc Từ chối (Reject) theo thời gian thực.
   - Quản trị nạp nguồn dữ liệu kiểm chuẩn mới (Master Data Ingestion).

---

## 💻 Hướng dẫn chạy thử nghiệm

Dự án được xây dựng với cấu trúc thuần (Pure HTML5, CSS3, Vanilla JavaScript), tương thích ngay trên mọi trình duyệt:

1. **Cách 1 - Mở trực tiếp:**
   - Nhấp đúp vào file `index.html` để mở trong trình duyệt Chrome, Edge, Safari hoặc Firefox.

2. **Cách 2 - Khởi chạy qua Local Web Server:**
   ```bash
   # Sử dụng Python
   python -m http.server 8080
   ```
   Sau đó mở trình duyệt và truy cập: `http://localhost:8080`.

---

## 👥 Thành viên Đội Asteria (UIT - ĐHQG TP.HCM)

- **Trần Đình Phúc** (Trưởng nhóm - MSSV: 24521397)
- **Huỳnh Đăng Khoa** (MSSV: 24522074)
- **Nguyễn Hoài Nam** (MSSV: 24521109)
- **Nguyễn Triệu Hoàng** (MSSV: 23520534)
- **Đặng Trúc Mai** (MSSV: 24521037)
