#!/bin/bash

# File Management System - Auto Install Script
# Repository: https://github.com/AZZ-vopp/file_management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

print_status "Starting File Management System installation..."
print_status "Repository: https://github.com/AZZ-vopp/file_management"

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y nginx php-fpm php-mysql php-curl php-gd php-mbstring php-xml php-zip mysql-server unzip wget curl certbot python3-certbot-nginx

# Start and enable services
print_status "Starting and enabling services..."
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start mysql
sudo systemctl enable mysql
sudo systemctl start php8.1-fpm
sudo systemctl enable php8.1-fpm

# Create web directory
print_status "Creating web directory..."
sudo mkdir -p /www/wwwroot/filedownload
sudo chown -R $USER:$USER /www/wwwroot/filedownload

# Download and extract source code
print_status "Downloading source code from GitHub..."
cd /tmp
wget https://github.com/AZZ-vopp/file_management/archive/refs/heads/main.zip -O file_management.zip
unzip file_management.zip
sudo cp -r file_management-main/* /www/wwwroot/filedownload/
sudo chown -R www-data:www-data /www/wwwroot/filedownload
sudo chmod -R 755 /www/wwwroot/filedownload
sudo chmod -R 777 /www/wwwroot/filedownload/uploads

# Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/filedownload << EOF
server {
    listen 80;
    server_name _;
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
        try_files \$uri \$uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
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
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/filedownload /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Configure PHP
print_status "Configuring PHP..."
sudo tee /etc/php/8.1/fpm/conf.d/99-custom.ini << EOF
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
memory_limit = 256M
EOF

sudo systemctl reload php8.1-fpm

# Configure MySQL
print_status "Configuring MySQL..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS filedownload CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'filedownload_user'@'localhost' IDENTIFIED BY 'filedownload_pass123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON filedownload.* TO 'filedownload_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Import database schema
print_status "Importing database schema..."
sudo mysql filedownload < /www/wwwroot/filedownload/database.sql

# Create config file
print_status "Creating configuration file..."
sudo tee /www/wwwroot/filedownload/config.php << EOF
<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'filedownload');
define('DB_USER', 'filedownload_user');
define('DB_PASS', 'filedownload_pass123');

// Site configuration
define('SITE_URL', 'http://' . \$_SERVER['HTTP_HOST']);
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('ICON_DIR', __DIR__ . '/uploads/icons/');

// Security
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
EOF

# Create .htaccess file
print_status "Creating .htaccess file..."
sudo tee /www/wwwroot/filedownload/.htaccess << EOF
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
EOF

# Set proper permissions
print_status "Setting file permissions..."
sudo chown -R www-data:www-data /www/wwwroot/filedownload
sudo chmod -R 755 /www/wwwroot/filedownload
sudo chmod -R 777 /www/wwwroot/filedownload/uploads
sudo chmod 644 /www/wwwroot/filedownload/config.php

# Restart services
print_status "Restarting services..."
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm
sudo systemctl restart mysql

# Try to get SSL certificate
print_status "Attempting to get SSL certificate..."
if command -v certbot &> /dev/null; then
    DOMAIN=$(hostname -f)
    if [[ $DOMAIN != "localhost" ]]; then
        sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || print_warning "SSL certificate generation failed. You can configure it manually later."
    else
        print_warning "Could not determine domain name. SSL certificate not configured."
    fi
else
    print_warning "Certbot not found. SSL certificate not configured."
fi

# Clean up
print_status "Cleaning up temporary files..."
rm -rf /tmp/file_management.zip /tmp/file_management-main

print_success "Installation completed successfully!"
echo ""
print_status "=== Installation Summary ==="
print_status "Website URL: http://$(hostname -f)"
print_status "Admin Panel: http://$(hostname -f)/admin.html"
print_status "Admin Username: admin"
print_status "Admin Password: admin123"
print_status "Database: filedownload"
print_status "Database User: filedownload_user"
print_status "Database Password: filedownload_pass123"
echo ""
print_status "=== Next Steps ==="
print_status "1. Configure your domain name in Nginx"
print_status "2. Set up SSL certificate with Certbot"
print_status "3. Change default admin password"
print_status "4. Upload your files through admin panel"
print_status "5. Customize the website design"
echo ""
print_status "For detailed instructions, visit:"
print_status "https://github.com/AZZ-vopp/file_management"
echo ""
print_success "File Management System is ready to use!" 