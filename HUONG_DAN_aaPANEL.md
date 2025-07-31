# Hướng Dẫn Cài Đặt File Management System Trên aaPanel

## 📋 Yêu Cầu Hệ Thống

### Phần Cứng Tối Thiểu
- **CPU**: 2 cores trở lên
- **RAM**: 2GB (khuyến nghị 4GB+)
- **Ổ cứng**: 20GB trống
- **Hệ điều hành**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+

### Phần Mềm
- **aaPanel**: Phiên bản mới nhất
- **Nginx**: 1.18+
- **PHP**: 7.4+ (khuyến nghị 8.1+)
- **MySQL**: 5.7+ hoặc MariaDB 10.3+
- **SSL Certificate**: Let's Encrypt

## 🚀 Cài Đặt Nhanh

### Script Tự Động
```bash
# Tải script cài đặt
wget https://raw.githubusercontent.com/AZZ-vopp/file_management/main/install.sh

# Cấp quyền thực thi
chmod +x install.sh

# Chạy cài đặt
sudo bash install.sh
```

### Thông Tin Truy Cập Sau Cài Đặt
- **Website**: `http://your-domain.com`
- **Admin Panel**: `http://your-domain.com/admin.html`
- **Admin Username**: `admin`
- **Admin Password**: `admin123`
- **Database**: `filedownload`
- **Database User**: `filedownload_user`
- **Database Password**: `filedownload_pass123`

## 📖 Cài Đặt Thủ Công

### Bước 1: Cài Đặt aaPanel

#### Ubuntu/Debian
```bash
wget -O install.sh http://www.aapanel.com/script/install-ubuntu_6.0_en.sh && sudo bash install.sh
```

#### CentOS
```bash
wget -O install.sh http://www.aapanel.com/script/install_6.0_en.sh && sudo bash install.sh
```

### Bước 2: Cài Đặt LAMP Stack

1. **Đăng nhập aaPanel**
   - Truy cập: `http://your-server-ip:8888`
   - Username: `admin`
   - Password: (được hiển thị sau khi cài đặt)

2. **Cài đặt Nginx**
   - Vào Software Store
   - Tìm và cài đặt Nginx
   - Chọn phiên bản mới nhất

3. **Cài đặt PHP**
   - Cài đặt PHP 8.1
   - Bật các extension: `mysql`, `curl`, `gd`, `mbstring`, `xml`, `zip`

4. **Cài đặt MySQL**
   - Cài đặt MySQL 8.0 hoặc MariaDB 10.6
   - Tạo database user và password

### Bước 3: Tạo Website

1. **Tạo site mới**
   - Vào Website → Add Site
   - Domain: `your-domain.com`
   - Root directory: `/www/wwwroot/filedownload`
   - PHP version: 8.1

2. **Cấu hình SSL**
   - Vào SSL → Let's Encrypt
   - Chọn domain và cài đặt certificate

### Bước 4: Upload Source Code

#### Phương Pháp 1: Git Clone
```bash
cd /www/wwwroot/
git clone https://github.com/AZZ-vopp/file_management.git filedownload
cd filedownload
chown -R www:www /www/wwwroot/filedownload
chmod -R 755 /www/wwwroot/filedownload
chmod -R 777 uploads/
```

#### Phương Pháp 2: Upload File
1. Tải source code từ: https://github.com/AZZ-vopp/file_management
2. Upload lên `/www/wwwroot/filedownload/`
3. Set permissions:
```bash
chown -R www:www /www/wwwroot/filedownload
chmod -R 755 /www/wwwroot/filedownload
chmod -R 777 uploads/
```

### Bước 5: Cấu Hình Logo

1. **Upload logo files**
   - Copy logo files vào thư mục `images/`
   - Đảm bảo có các file:
     - `logo.png` (200x60px)
     - `logo-white.png` (200x60px)
     - `favicon.ico`
     - `favicon-16x16.png`
     - `favicon-32x32.png`
     - `apple-touch-icon.png`

2. **Set permissions**
```bash
chmod 644 images/*
```

### Bước 6: Cấu Hình Database

1. **Tạo database**
   - Vào Database → Add Database
   - Database name: `filedownload`
   - Username: `filedownload_user`
   - Password: `filedownload_pass123`

2. **Import schema**
   - Vào phpMyAdmin
   - Chọn database `filedownload`
   - Import file `database.sql`

### Bước 7: Cấu Hình Nginx

1. **Tạo Nginx config**
   - Vào Website → Settings → Nginx
   - Thêm configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /www/wwwroot/filedownload;
    index index.html index.php;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Bước 8: Cấu Hình PHP

1. **Tạo PHP config**
   - Vào Software → PHP → Settings
   - Thêm vào `php.ini`:

```ini
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
memory_limit = 256M
```

### Bước 9: Tạo Config File

Tạo file `/www/wwwroot/filedownload/config.php`:

```php
<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'filedownload');
define('DB_USER', 'filedownload_user');
define('DB_PASS', 'filedownload_pass123');

// Site configuration
define('SITE_URL', 'https://your-domain.com');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('ICON_DIR', __DIR__ . '/uploads/icons/');

// Security
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
```

### Bước 10: Tạo .htaccess

Tạo file `/www/wwwroot/filedownload/.htaccess`:

```apache
RewriteEngine On

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "no-referrer-when-downgrade"

# Prevent access to sensitive files
<Files "config.php">
    Order allow,deny
    Deny from all
</Files>

<Files "database.sql">
    Order allow,deny
    Deny from all
</Files>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
</IfModule>
```

## 🔒 Bảo Mật

### 1. Firewall
```bash
# Mở ports cần thiết
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 2. Fail2ban
```bash
# Cài đặt Fail2ban
apt install fail2ban

# Cấu hình cho Nginx
cat > /etc/fail2ban/jail.local << EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban
```

### 3. SSL Certificate
- Sử dụng Let's Encrypt tự động
- Cấu hình redirect HTTP → HTTPS
- Set HSTS headers

## 📊 Tối Ưu Hóa

### 1. Cache
- Enable Nginx cache
- Configure browser caching
- Use CDN cho static files

### 2. Compression
- Enable Gzip compression
- Optimize images
- Minify CSS/JS

### 3. Database
- Optimize MySQL queries
- Set proper indexes
- Regular backups

## 🔧 Khắc Phục Sự Cố

### Lỗi 500 Internal Server Error
1. Kiểm tra PHP error logs
2. Verify file permissions
3. Check database connection

### Lỗi Upload File
1. Kiểm tra PHP upload limits
2. Verify directory permissions
3. Check disk space

### Lỗi Database Connection
1. Verify database credentials
2. Check MySQL service status
3. Test connection manually

### Lỗi SSL Certificate
1. Verify domain DNS
2. Check certificate expiration
3. Renew certificate if needed

## 📞 Thông Tin Liên Hệ

- **Repository**: https://github.com/AZZ-vopp/file_management
- **Issues**: https://github.com/AZZ-vopp/file_management/issues
- **Documentation**: https://github.com/AZZ-vopp/file_management#readme

## 🔄 Cập Nhật

### Cập Nhật Source Code
```bash
cd /www/wwwroot/filedownload
git pull origin main
chown -R www:www /www/wwwroot/filedownload
chmod -R 755 /www/wwwroot/filedownload
chmod -R 777 uploads/
```

### Backup Database
```bash
mysqldump -u filedownload_user -p filedownload > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Backup Files
```bash
tar -czf filedownload_backup_$(date +%Y%m%d_%H%M%S).tar.gz /www/wwwroot/filedownload/
```

---

**Lưu ý**: Thay thế `your-domain.com` bằng domain thực tế của bạn trong tất cả các cấu hình. 