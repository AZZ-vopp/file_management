-- Database schema for File Download Center
-- Tạo database
CREATE DATABASE IF NOT EXISTS filedownload CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE filedownload;

-- Bảng categories (danh mục)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'folder',
    color VARCHAR(7) DEFAULT '#667eea',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng files (file tải xuống)
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    file_size BIGINT DEFAULT 0,
    category_id INT,
    icon_path VARCHAR(500) NULL,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng users (người dùng)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'moderator') DEFAULT 'moderator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng download_logs (nhật ký tải xuống)
CREATE TABLE download_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

-- Bảng settings (cài đặt hệ thống)
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu cho categories
INSERT INTO categories (name, description, icon, color) VALUES
('Android', 'Ứng dụng và game cho Android', 'mobile', '#4CAF50'),
('Windows', 'Phần mềm cho Windows', 'desktop', '#2196F3'),
('macOS', 'Ứng dụng cho macOS', 'apple', '#FF9800'),
('Tiện Ích', 'Công cụ và tiện ích khác', 'tools', '#9C27B0');

-- Dữ liệu mẫu cho files
INSERT INTO files (name, description, filename, filepath, file_size, category_id, download_count) VALUES
('Chrome Browser', 'Trình duyệt web nhanh và an toàn', 'chrome_120.exe', '/uploads/chrome_120.exe', 52428800, 2, 150),
('Firefox Browser', 'Trình duyệt mã nguồn mở', 'firefox_119.exe', '/uploads/firefox_119.exe', 45678912, 2, 89),
('VLC Media Player', 'Trình phát đa phương tiện', 'vlc_3.0.18.exe', '/uploads/vlc_3.0.18.exe', 23456789, 2, 234),
('Adobe Reader', 'Đọc file PDF', 'adobe_reader_2023.exe', '/uploads/adobe_reader_2023.exe', 67890123, 2, 167),
('WhatsApp', 'Ứng dụng nhắn tin', 'whatsapp_2.23.24.apk', '/uploads/whatsapp_2.23.24.apk', 45678901, 1, 445),
('TikTok', 'Ứng dụng video ngắn', 'tiktok_32.5.3.apk', '/uploads/tiktok_32.5.3.apk', 34567890, 1, 567),
('Instagram', 'Chia sẻ ảnh và video', 'instagram_302.0.0.apk', '/uploads/instagram_302.0.0.apk', 23456789, 1, 234),
('Spotify', 'Nghe nhạc trực tuyến', 'spotify_8.8.22.apk', '/uploads/spotify_8.8.22.apk', 12345678, 1, 189),
('Safari', 'Trình duyệt mặc định macOS', 'safari_17.1.dmg', '/uploads/safari_17.1.dmg', 34567890, 3, 78),
('Xcode', 'IDE phát triển ứng dụng', 'xcode_15.1.dmg', '/uploads/xcode_15.1.dmg', 2345678901, 3, 45),
('7-Zip', 'Nén và giải nén file', '7zip_23.01.exe', '/uploads/7zip_23.01.exe', 1234567, 4, 234),
('CCleaner', 'Dọn dẹp hệ thống', 'ccleaner_6.10.exe', '/uploads/ccleaner_6.10.exe', 2345678, 4, 156);

-- Dữ liệu mẫu cho users
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'admin'),
('moderator', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mod@example.com', 'moderator');

-- Dữ liệu mẫu cho settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'File Download Center', 'Tên website'),
('site_description', 'Trung tâm tải file - Ứng dụng và tiện ích', 'Mô tả website'),
('max_file_size', '100', 'Kích thước file tối đa (MB)'),
('allowed_extensions', 'exe,apk,dmg,zip,rar,7z,pdf,doc,docx,xls,xlsx,ppt,pptx', 'Các định dạng file được phép'),
('download_limit', '1000', 'Giới hạn tải xuống mỗi ngày'),
('maintenance_mode', '0', 'Chế độ bảo trì (0=off, 1=on)');

-- Tạo Views
CREATE VIEW v_file_stats AS
SELECT 
    f.id,
    f.name,
    f.download_count,
    c.name as category_name,
    f.created_at,
    ROUND(f.file_size / 1024 / 1024, 2) as size_mb
FROM files f
LEFT JOIN categories c ON f.category_id = c.id;

CREATE VIEW v_category_stats AS
SELECT 
    c.id,
    c.name,
    COUNT(f.id) as file_count,
    SUM(f.download_count) as total_downloads,
    SUM(f.file_size) as total_size
FROM categories c
LEFT JOIN files f ON c.id = f.category_id
GROUP BY c.id, c.name;

-- Tạo Stored Procedures
DELIMITER //
CREATE PROCEDURE GetFileStats()
BEGIN
    SELECT 
        COUNT(*) as total_files,
        SUM(download_count) as total_downloads,
        SUM(file_size) as total_size,
        AVG(download_count) as avg_downloads
    FROM files;
END //
DELIMITER ;

-- Tạo Triggers
DELIMITER //
CREATE TRIGGER update_download_count
AFTER INSERT ON download_logs
FOR EACH ROW
BEGIN
    UPDATE files 
    SET download_count = download_count + 1 
    WHERE id = NEW.file_id;
END //
DELIMITER ;

-- Tạo Events
DELIMITER //
CREATE EVENT cleanup_old_logs
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM download_logs 
    WHERE downloaded_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
END //
DELIMITER ;

-- Tạo user và cấp quyền
CREATE USER 'filedownload_user'@'localhost' IDENTIFIED BY 'filedownload_pass123';
GRANT SELECT, INSERT, UPDATE, DELETE ON filedownload.* TO 'filedownload_user'@'localhost';
FLUSH PRIVILEGES; 