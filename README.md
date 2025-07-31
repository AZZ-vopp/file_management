# File Management System

Một trang web tải file với giao diện đẹp, hiện đại và hỗ trợ SEO được thiết kế để cung cấp các ứng dụng và tiện ích cho nhiều nền tảng khác nhau.

## 🌟 Tính Năng

- **Giao diện đẹp và hiện đại** với thiết kế responsive
- **Hỗ trợ SEO** với meta tags và semantic HTML
- **Admin Panel** để quản lý file và danh mục
- **Hệ thống upload file** với drag & drop
- **Icon tùy chỉnh** cho từng file (Font Awesome hoặc upload)
- **Phân loại file** theo danh mục (Android, Windows, macOS, Tiện ích)
- **Thống kê download** và báo cáo
- **Tìm kiếm và lọc** file nhanh chóng
- **Modal xác nhận** download an toàn

## 🚀 Cài Đặt Nhanh

### Yêu cầu hệ thống
- PHP 7.4+
- MySQL 5.7+ hoặc MariaDB 10.3+
- Nginx hoặc Apache
- Node.js 14+ (cho development)

### Cài đặt trên aaPanel

```bash
# Tải script cài đặt
wget https://raw.githubusercontent.com/AZZ-vopp/file_management/main/install.sh

# Cấp quyền thực thi
chmod +x install.sh

# Chạy cài đặt
./install.sh
```

### Cài đặt thủ công

1. **Clone repository**
```bash
git clone https://github.com/AZZ-vopp/file_management.git
cd file_management
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình database**
```bash
# Import database schema
mysql -u root -p < database.sql
```

4. **Cấu hình web server**
- Copy files vào thư mục web
- Cấu hình Nginx/Apache
- Set permissions: `chmod -R 755 uploads/`

## 📁 Cấu Trúc Dự Án

```
file_management/
├── index.html              # Trang chủ
├── admin.html              # Admin panel
├── style.css               # CSS cho trang chủ
├── admin-style.css         # CSS cho admin
├── script.js               # JavaScript trang chủ
├── admin.js                # JavaScript admin
├── api/
│   └── index.php           # Backend API
├── uploads/                # Thư mục upload file
│   └── icons/              # Thư mục upload icon
├── images/                 # Logo và favicon
├── database.sql            # Schema database
├── install.sh              # Script cài đặt tự động
├── package.json            # Node.js dependencies
├── HUONG_DAN_aaPANEL.md   # Hướng dẫn chi tiết
└── README.md              # File này
```

## 🛠 Công Nghệ Sử Dụng

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling với Flexbox/Grid
- **JavaScript ES6+**: Class-based architecture
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

### Backend
- **PHP 7.4+**: RESTful API
- **MySQL/MariaDB**: Database
- **PDO**: Database connection

### Deployment
- **aaPanel**: Hosting control panel
- **Nginx**: Web server
- **Let's Encrypt**: SSL certificates

## 🎨 Tùy Chỉnh Giao Diện

### Thay đổi Logo
1. Thay thế file trong thư mục `images/`:
   - `logo.png` - Logo chính
   - `logo-white.png` - Logo admin panel
   - `favicon.ico` - Favicon

2. Cập nhật alt text trong HTML nếu cần

### Tùy chỉnh màu sắc
Chỉnh sửa CSS variables trong `style.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
}
```

## 📊 Admin Panel

### Truy cập
- URL: `your-domain.com/admin.html`
- Username: `admin`
- Password: `admin123`

### Tính năng
- **Dashboard**: Thống kê tổng quan
- **Quản lý File**: Upload, edit, delete files
- **Quản lý Danh mục**: Tạo/sửa danh mục
- **Cài đặt**: Cấu hình hệ thống

## 🔧 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/files` | Lấy danh sách file |
| POST | `/api/upload` | Upload file mới |
| PUT | `/api/files/{id}` | Cập nhật file |
| DELETE | `/api/files/{id}` | Xóa file |
| GET | `/api/categories` | Lấy danh mục |
| GET | `/api/stats` | Thống kê |

## 🚀 Deployment

### Cài Đặt Nhanh Trên aaPanel

1. **Yêu cầu hệ thống**
   - Ubuntu 18.04+ / CentOS 7+
   - RAM: 1GB+
   - Disk: 10GB+

2. **Script tự động**
```bash
wget https://raw.githubusercontent.com/AZZ-vopp/file_management/main/install.sh && chmod +x install.sh && ./install.sh
```

3. **Thông tin truy cập**
   - Website: `http://your-domain.com`
   - Admin: `http://your-domain.com/admin.html`
   - Database: MySQL với user `filedownload_user`

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên Hệ

- **Repository**: [https://github.com/AZZ-vopp/file_management](https://github.com/AZZ-vopp/file_management)
- **Issues**: [https://github.com/AZZ-vopp/file_management/issues](https://github.com/AZZ-vopp/file_management/issues)
- **Author**: AZZ-vopp

## 🙏 Cảm Ơn

Cảm ơn bạn đã sử dụng File Management System! Nếu dự án này hữu ích, hãy cho chúng tôi một ⭐ star trên GitHub.

---

**Made with ❤️ by AZZ-vopp** 