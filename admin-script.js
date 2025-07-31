// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all admin features
    initNavigation();
    initFileUpload();
    initFileManagement();
    initCategoryManagement();
    initSettings();
    initMobileMenu();
    initSearchFunctionality();
});

// Navigation Management
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.closest('.nav-item').classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update page title
                const navText = this.querySelector('span').textContent;
                pageTitle.textContent = navText;
            }
        });
    });
}

// File Upload Functionality
function initFileUpload() {
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const uploadForm = document.getElementById('uploadForm');
    const resetBtn = document.getElementById('resetBtn');

    // Drag and drop functionality
    fileDropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    fileDropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    fileDropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        handleFiles(this.files);
    });

    // Click to select files
    fileDropZone.addEventListener('click', function() {
        fileInput.click();
    });

    // Handle selected files
    function handleFiles(files) {
        filePreview.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const fileItem = createFilePreviewItem(file);
            filePreview.appendChild(fileItem);
        });
    }

    // Create file preview item
    function createFilePreviewItem(file) {
        const item = document.createElement('div');
        item.className = 'file-preview-item';
        
        const icon = document.createElement('i');
        icon.className = getFileIcon(file.name);
        
        const name = document.createElement('span');
        name.textContent = file.name;
        
        const size = document.createElement('span');
        size.textContent = `(${formatFileSize(file.size)})`;
        
        item.appendChild(icon);
        item.appendChild(name);
        item.appendChild(size);
        
        return item;
    }

    // Get file icon based on extension
    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'apk': 'fab fa-android',
            'exe': 'fab fa-windows',
            'dmg': 'fab fa-apple',
            'zip': 'fas fa-file-archive',
            'rar': 'fas fa-file-archive',
            'pdf': 'fas fa-file-pdf',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'png': 'fas fa-file-image',
            'gif': 'fas fa-file-image',
            'mp3': 'fas fa-file-audio',
            'mp4': 'fas fa-file-video',
            'avi': 'fas fa-file-video',
            'mov': 'fas fa-file-video'
        };
        
        return iconMap[ext] || 'fas fa-file';
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const uploadBtn = document.getElementById('uploadBtn');
        const originalText = uploadBtn.innerHTML;
        
        // Show loading state
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải lên...';
        uploadBtn.disabled = true;
        
        // Simulate upload process
        setTimeout(() => {
            showUploadSuccess();
            uploadBtn.innerHTML = originalText;
            uploadBtn.disabled = false;
            uploadForm.reset();
            filePreview.innerHTML = '';
        }, 2000);
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        uploadForm.reset();
        filePreview.innerHTML = '';
        fileDropZone.classList.remove('dragover');
    });
}

// Show upload success message
function showUploadSuccess() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Tải lên thành công!</h3>
            <p>File đã được tải lên hệ thống thành công.</p>
            <button class="btn-primary" onclick="this.closest('.success-modal').remove()">Đóng</button>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .success-modal .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
        }
        
        .success-modal h3 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .success-modal p {
            color: #666;
            margin-bottom: 1.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 3000);
}

// File Management
function initFileManagement() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const fileCheckboxes = document.querySelectorAll('#filesTableBody input[type="checkbox"]');
    const searchInput = document.querySelector('#files .search-box input');
    const categoryFilter = document.querySelector('.category-filter');

    // Select all functionality
    selectAllCheckbox.addEventListener('change', function() {
        fileCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Individual checkbox change
    fileCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(fileCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(fileCheckboxes).some(cb => cb.checked);
            
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = anyChecked && !allChecked;
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#filesTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Category filter
    categoryFilter.addEventListener('change', function() {
        const selectedCategory = this.value;
        const rows = document.querySelectorAll('#filesTableBody tr');
        
        rows.forEach(row => {
            const categoryBadge = row.querySelector('.category-badge');
            if (selectedCategory === '' || categoryBadge.classList.contains(selectedCategory)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Action buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            showEditModal(this);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            showDeleteConfirmation(this);
        });
    });

    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function() {
            showDownloadModal(this);
        });
    });
}

// Show edit modal
function showEditModal(button) {
    const row = button.closest('tr');
    const fileName = row.querySelector('h4').textContent;
    const version = row.querySelector('p').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chỉnh Sửa File</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form class="edit-form">
                    <div class="form-group">
                        <label>Tên File</label>
                        <input type="text" value="${fileName}" required>
                    </div>
                    <div class="form-group">
                        <label>Phiên Bản</label>
                        <input type="text" value="${version}" required>
                    </div>
                    <div class="form-group">
                        <label>Danh Mục</label>
                        <select>
                            <option value="android">Android</option>
                            <option value="windows">Windows</option>
                            <option value="macos">macOS</option>
                            <option value="utilities">Utilities</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.edit-modal').remove()">Hủy</button>
                        <button type="submit" class="btn-primary">Lưu Thay Đổi</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .edit-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .edit-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .edit-modal .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .edit-modal .modal-body {
            padding: 1.5rem;
        }
        
        .edit-form .form-group {
            margin-bottom: 1rem;
        }
        
        .edit-form label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .edit-form input,
        .edit-form select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
        
        .edit-form .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Show delete confirmation
function showDeleteConfirmation(button) {
    const row = button.closest('tr');
    const fileName = row.querySelector('h4').textContent;
    
    if (confirm(`Bạn có chắc chắn muốn xóa file "${fileName}"?`)) {
        // Simulate delete
        row.style.opacity = '0.5';
        setTimeout(() => {
            row.remove();
            showNotification('File đã được xóa thành công!', 'success');
        }, 500);
    }
}

// Show download modal
function showDownloadModal(button) {
    const row = button.closest('tr');
    const fileName = row.querySelector('h4').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Tải Xuống File</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>Bạn có muốn tải xuống file "${fileName}"?</p>
                <div class="download-options">
                    <button class="btn-primary">
                        <i class="fas fa-download"></i>
                        Tải Xuống
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.download-modal').remove()">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .download-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .download-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
        }
        
        .download-modal .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .download-modal .modal-body {
            padding: 1.5rem;
        }
        
        .download-options {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Category Management
function initCategoryManagement() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    
    addCategoryBtn.addEventListener('click', function() {
        showAddCategoryModal();
    });
    
    // Category action buttons
    document.querySelectorAll('.category-actions .btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            showEditCategoryModal(this);
        });
    });
    
    document.querySelectorAll('.category-actions .btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            showDeleteCategoryConfirmation(this);
        });
    });
}

// Show add category modal
function showAddCategoryModal() {
    const modal = document.createElement('div');
    modal.className = 'category-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Thêm Danh Mục Mới</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form class="category-form">
                    <div class="form-group">
                        <label>Tên Danh Mục</label>
                        <input type="text" placeholder="Nhập tên danh mục" required>
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select>
                            <option value="fab fa-android">Android</option>
                            <option value="fab fa-windows">Windows</option>
                            <option value="fab fa-apple">Apple</option>
                            <option value="fas fa-tools">Tools</option>
                            <option value="fas fa-mobile-alt">Mobile</option>
                            <option value="fas fa-desktop">Desktop</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.category-modal').remove()">Hủy</button>
                        <button type="submit" class="btn-primary">Thêm Danh Mục</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .category-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .category-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
        }
        
        .category-modal .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .category-modal .modal-body {
            padding: 1.5rem;
        }
        
        .category-form .form-group {
            margin-bottom: 1rem;
        }
        
        .category-form label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .category-form input,
        .category-form select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
        
        .category-form .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Show edit category modal
function showEditCategoryModal(button) {
    const card = button.closest('.category-card');
    const categoryName = card.querySelector('h3').textContent;
    
    // Similar to add modal but with pre-filled data
    showAddCategoryModal();
}

// Show delete category confirmation
function showDeleteCategoryConfirmation(button) {
    const card = button.closest('.category-card');
    const categoryName = card.querySelector('h3').textContent;
    
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`)) {
        // Simulate delete
        card.style.opacity = '0.5';
        setTimeout(() => {
            card.remove();
            showNotification('Danh mục đã được xóa thành công!', 'success');
        }, 500);
    }
}

// Settings Management
function initSettings() {
    const settingsForms = document.querySelectorAll('.settings-form');
    
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Cài đặt đã được lưu thành công!', 'success');
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Search Functionality
function initSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-box input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const section = this.closest('.content-section');
            
            if (section) {
                const items = section.querySelectorAll('.upload-item, .category-card, tr');
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        }
        
        .notification.success {
            border-left: 4px solid #28a745;
        }
        
        .notification.info {
            border-left: 4px solid #667eea;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification i {
            color: #28a745;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 3000);
}

// Logout functionality
document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Redirect to login page or main page
        window.location.href = 'index.html';
    }
});

// Quick action buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.textContent.trim();
        
        switch(action) {
            case 'Tải File Mới':
                document.querySelector('a[href="#upload"]').click();
                break;
            case 'Tạo Danh Mục':
                document.querySelector('a[href="#categories"]').click();
                break;
            case 'Xuất Báo Cáo':
                showNotification('Báo cáo đang được tạo...', 'info');
                break;
            case 'Cài Đặt':
                document.querySelector('a[href="#settings"]').click();
                break;
        }
    });
}); 