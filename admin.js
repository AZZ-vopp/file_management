// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.files = [];
        this.categories = [];
        this.stats = {};
        this.currentFileId = null;
        this.selectedIcon = null;
        this.popularIcons = [
            'fas fa-mobile-alt', 'fas fa-desktop', 'fab fa-apple', 'fas fa-tools',
            'fas fa-file', 'fas fa-folder', 'fas fa-download', 'fas fa-upload',
            'fas fa-image', 'fas fa-video', 'fas fa-music', 'fas fa-camera',
            'fas fa-gamepad', 'fas fa-palette', 'fas fa-code', 'fas fa-database',
            'fas fa-chart-bar', 'fas fa-calculator', 'fas fa-calendar', 'fas fa-clock',
            'fas fa-map', 'fas fa-globe', 'fas fa-envelope', 'fas fa-phone',
            'fas fa-user', 'fas fa-users', 'fas fa-cog', 'fas fa-wrench',
            'fas fa-shield-alt', 'fas fa-lock', 'fas fa-key', 'fas fa-eye',
            'fas fa-heart', 'fas fa-star', 'fas fa-thumbs-up', 'fas fa-comment',
            'fas fa-share', 'fas fa-link', 'fas fa-external-link-alt', 'fas fa-save',
            'fas fa-edit', 'fas fa-trash', 'fas fa-copy', 'fas fa-paste',
            'fas fa-cut', 'fas fa-undo', 'fas fa-redo', 'fas fa-search',
            'fas fa-filter', 'fas fa-sort', 'fas fa-list', 'fas fa-th-large'
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.loadCategories();
        this.setupIconSelection();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Menu toggle
        document.querySelector('.menu-toggle').addEventListener('click', () => {
            document.querySelector('.admin-container').classList.toggle('sidebar-collapsed');
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // File upload form
        document.getElementById('upload-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFileUpload();
        });

        // Modal upload form
        document.getElementById('modal-upload-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleModalFileUpload();
        });

        // Edit form
        document.getElementById('edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFileEdit();
        });

        // File upload areas
        this.setupFileUploadAreas();
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    setupIconSelection() {
        // Setup icon type radio buttons
        this.setupIconTypeRadios('icon_type', 'default-icon-preview', 'custom-icon-upload', 'fontawesome-icon-selector');
        this.setupIconTypeRadios('modal_icon_type', 'modal-default-icon-preview', 'modal-custom-icon-upload', 'modal-fontawesome-icon-selector');
        this.setupIconTypeRadios('edit_icon_type', 'edit-default-icon-preview', 'edit-custom-icon-upload', 'edit-fontawesome-icon-selector');

        // Setup Font Awesome icon grids
        this.setupIconGrid('icon-grid', 'icon-search');
        this.setupIconGrid('modal-icon-grid', 'modal-icon-search');
        this.setupIconGrid('edit-icon-grid', 'edit-icon-search');
    }

    setupIconTypeRadios(name, defaultPreviewId, customUploadId, fontawesomeSelectorId) {
        const radios = document.querySelectorAll(`input[name="${name}"]`);
        const defaultPreview = document.getElementById(defaultPreviewId);
        const customUpload = document.getElementById(customUploadId);
        const fontawesomeSelector = document.getElementById(fontawesomeSelectorId);

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                // Hide all sections
                if (defaultPreview) defaultPreview.style.display = 'none';
                if (customUpload) customUpload.style.display = 'none';
                if (fontawesomeSelector) fontawesomeSelector.style.display = 'none';

                // Show selected section
                switch (radio.value) {
                    case 'default':
                        if (defaultPreview) defaultPreview.style.display = 'block';
                        break;
                    case 'custom':
                        if (customUpload) customUpload.style.display = 'block';
                        break;
                    case 'fontawesome':
                        if (fontawesomeSelector) fontawesomeSelector.style.display = 'block';
                        break;
                }
            });
        });
    }

    setupIconGrid(gridId, searchId) {
        const grid = document.getElementById(gridId);
        const search = document.getElementById(searchId);
        
        if (!grid) return;

        // Populate icon grid
        this.popularIcons.forEach(iconClass => {
            const iconItem = document.createElement('div');
            iconItem.className = 'icon-item';
            iconItem.innerHTML = `<i class="${iconClass}"></i>`;
            iconItem.setAttribute('data-icon', iconClass);
            
            iconItem.addEventListener('click', () => {
                // Remove selected class from all items
                grid.querySelectorAll('.icon-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Add selected class to clicked item
                iconItem.classList.add('selected');
                this.selectedIcon = iconClass;
                
                // Update preview
                this.updateIconPreview(iconClass);
            });
            
            grid.appendChild(iconItem);
        });

        // Setup search functionality
        if (search) {
            search.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                grid.querySelectorAll('.icon-item').forEach(item => {
                    const iconClass = item.getAttribute('data-icon');
                    if (iconClass.toLowerCase().includes(query)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }

    updateIconPreview(iconClass) {
        // Update preview in all forms
        const previews = document.querySelectorAll('.icon-preview-item i');
        previews.forEach(preview => {
            preview.className = iconClass;
        });
    }

    setupFileUploadAreas() {
        const uploadAreas = [
            { area: 'file-upload-area', input: 'file-upload' },
            { area: 'icon-upload-area', input: 'file-icon' },
            { area: 'modal-file-upload-area', input: 'modal-file-upload' },
            { area: 'modal-icon-upload-area', input: 'modal-file-icon' },
            { area: 'edit-icon-upload-area', input: 'edit-file-icon' }
        ];

        uploadAreas.forEach(({ area, input }) => {
            const areaElement = document.getElementById(area);
            const inputElement = document.getElementById(input);

            if (areaElement && inputElement) {
                // Click to select file
                areaElement.addEventListener('click', () => {
                    inputElement.click();
                });

                // Drag and drop
                areaElement.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    areaElement.classList.add('drag-over');
                });

                areaElement.addEventListener('dragleave', () => {
                    areaElement.classList.remove('drag-over');
                });

                areaElement.addEventListener('drop', (e) => {
                    e.preventDefault();
                    areaElement.classList.remove('drag-over');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        inputElement.files = files;
                        this.updateFileUploadPreview(area, files[0]);
                    }
                });

                // File selected
                inputElement.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        this.updateFileUploadPreview(area, e.target.files[0]);
                    }
                });
            }
        });
    }

    updateFileUploadPreview(areaId, file) {
        const area = document.getElementById(areaId);
        const icon = area.querySelector('i');
        const text = area.querySelector('p');

        if (file.type.startsWith('image/')) {
            // For image files, show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                icon.style.display = 'none';
                text.textContent = file.name;
                text.style.fontSize = '12px';
                
                // Add preview image if it doesn't exist
                let preview = area.querySelector('.file-preview');
                if (!preview) {
                    preview = document.createElement('img');
                    preview.className = 'file-preview';
                    preview.style.maxWidth = '50px';
                    preview.style.maxHeight = '50px';
                    preview.style.objectFit = 'contain';
                    area.appendChild(preview);
                }
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            // For other files, just show name
            icon.style.display = 'none';
            text.textContent = file.name;
            text.style.fontSize = '12px';
        }
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update page title
        document.getElementById('page-title').textContent = this.getSectionTitle(section);

        // Hide all sections
        document.querySelectorAll('.section').forEach(s => {
            s.classList.remove('active');
        });

        // Show selected section
        document.getElementById(section).classList.add('active');
        this.currentSection = section;

        // Load section data
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'files':
                this.loadFiles();
                break;
            case 'categories':
                this.loadCategories();
                break;
        }
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'files': 'Quản Lý File',
            'upload': 'Tải File Lên',
            'categories': 'Danh Mục',
            'settings': 'Cài Đặt'
        };
        return titles[section] || 'Dashboard';
    }

    async loadDashboard() {
        try {
            const response = await fetch('api/stats');
            const data = await response.json();
            
            if (data.success) {
                this.stats = data.data;
                this.updateDashboardStats();
                this.loadRecentFiles();
                this.loadCategoryStats();
            }
        } catch (error) {
            this.showNotification('Lỗi khi tải dữ liệu dashboard', 'error');
        }
    }

    updateDashboardStats() {
        document.getElementById('total-files').textContent = this.stats.total_files || 0;
        document.getElementById('total-downloads').textContent = this.stats.total_downloads || 0;
        document.getElementById('total-categories').textContent = this.stats.by_category?.length || 0;
        document.getElementById('avg-downloads').textContent = 
            this.stats.total_files > 0 ? Math.round(this.stats.total_downloads / this.stats.total_files) : 0;
    }

    async loadRecentFiles() {
        try {
            const response = await fetch('api/files');
            const data = await response.json();
            
            if (data.success) {
                const recentFiles = data.data.slice(0, 5);
                this.renderRecentFiles(recentFiles);
            }
        } catch (error) {
            console.error('Error loading recent files:', error);
        }
    }

    renderRecentFiles(files) {
        const container = document.getElementById('recent-files');
        container.innerHTML = '';

        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            fileElement.innerHTML = `
                <div class="file-icon">
                    ${this.getFileIcon(file)}
                </div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${file.category_name} • ${this.formatFileSize(file.file_size)}</p>
                    <span class="upload-time">${this.formatDate(file.created_at)}</span>
                </div>
                <div class="file-actions">
                    <button class="btn-edit" onclick="adminPanel.editFile(${file.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteFile(${file.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(fileElement);
        });
    }

    async loadCategoryStats() {
        const container = document.getElementById('category-stats');
        container.innerHTML = '';

        if (this.stats.by_category) {
            this.stats.by_category.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category-stat-item';
                categoryElement.innerHTML = `
                    <div class="category-info">
                        <h4>${category.name}</h4>
                        <p>${category.count} files</p>
                    </div>
                    <div class="category-downloads">
                        <span>${category.total_downloads || 0} downloads</span>
                    </div>
                `;
                container.appendChild(categoryElement);
            });
        }
    }

    async loadFiles() {
        try {
            const response = await fetch('api/files');
            const data = await response.json();
            
            if (data.success) {
                this.files = data.data;
                this.renderFilesTable();
            }
        } catch (error) {
            this.showNotification('Lỗi khi tải danh sách file', 'error');
        }
    }

    renderFilesTable() {
        const tbody = document.getElementById('files-table-body');
        tbody.innerHTML = '';

        this.files.forEach(file => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="file-icon-cell">
                        ${this.getFileIcon(file)}
                    </div>
                </td>
                <td>
                    <div class="file-info-cell">
                        <h4>${file.name}</h4>
                        <p>${file.description || ''}</p>
                    </div>
                </td>
                <td>
                    <span class="category-badge">${file.category_name}</span>
                </td>
                <td>${this.formatFileSize(file.file_size)}</td>
                <td>${file.download_count}</td>
                <td>${this.formatDate(file.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="adminPanel.editFile(${file.id})" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="adminPanel.deleteFile(${file.id})" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-download" onclick="adminPanel.downloadFile(${file.id})" title="Tải xuống">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getFileIcon(file) {
        if (file.icon_path) {
            return `<img src="${file.icon_path}" alt="${file.name}" class="file-custom-icon">`;
        } else {
            // Default icons based on category
            const categoryIcons = {
                'Android': 'fas fa-mobile-alt',
                'Windows': 'fas fa-desktop',
                'macOS': 'fab fa-apple',
                'Tiện Ích': 'fas fa-tools'
            };
            const iconClass = categoryIcons[file.category_name] || 'fas fa-file';
            return `<i class="${iconClass}"></i>`;
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('api/categories');
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
                this.populateCategorySelects();
                this.renderCategoriesGrid();
            }
        } catch (error) {
            this.showNotification('Lỗi khi tải danh mục', 'error');
        }
    }

    populateCategorySelects() {
        const selects = [
            'file-category',
            'modal-file-category',
            'edit-file-category',
            'category-filter'
        ];

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Chọn danh mục</option>';
                this.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            }
        });
    }

    renderCategoriesGrid() {
        const container = document.getElementById('categories-grid');
        if (!container) return;

        container.innerHTML = '';
        this.categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-card';
            categoryElement.innerHTML = `
                <div class="category-icon">
                    <i class="fas fa-${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description || ''}</p>
                </div>
            `;
            container.appendChild(categoryElement);
        });
    }

    async handleFileUpload() {
        const formData = new FormData();
        const form = document.getElementById('upload-form');
        
        formData.append('name', form.name.value);
        formData.append('description', form.description.value);
        formData.append('category_id', form.category_id.value);
        
        const fileInput = document.getElementById('file-upload');
        const iconInput = document.getElementById('file-icon');
        
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }
        
        // Handle icon based on selection
        const iconType = document.querySelector('input[name="icon_type"]:checked').value;
        
        if (iconType === 'custom' && iconInput.files.length > 0) {
            formData.append('icon', iconInput.files[0]);
        } else if (iconType === 'fontawesome' && this.selectedIcon) {
            formData.append('icon_class', this.selectedIcon);
        }

        try {
            const response = await fetch('api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                this.showNotification('File tải lên thành công!', 'success');
                form.reset();
                this.resetFileUploadAreas();
                this.resetIconSelection();
                this.loadFiles();
            } else {
                this.showNotification(data.error || 'Lỗi khi tải file lên', 'error');
            }
        } catch (error) {
            this.showNotification('Lỗi kết nối', 'error');
        }
    }

    async handleModalFileUpload() {
        const formData = new FormData();
        const form = document.getElementById('modal-upload-form');
        
        formData.append('name', form.name.value);
        formData.append('description', form.description.value);
        formData.append('category_id', form.category_id.value);
        
        const fileInput = document.getElementById('modal-file-upload');
        const iconInput = document.getElementById('modal-file-icon');
        
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }
        
        // Handle icon based on selection
        const iconType = document.querySelector('input[name="modal_icon_type"]:checked').value;
        
        if (iconType === 'custom' && iconInput.files.length > 0) {
            formData.append('icon', iconInput.files[0]);
        } else if (iconType === 'fontawesome' && this.selectedIcon) {
            formData.append('icon_class', this.selectedIcon);
        }

        try {
            const response = await fetch('api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                this.showNotification('File tải lên thành công!', 'success');
                this.closeAllModals();
                this.resetIconSelection();
                this.loadFiles();
            } else {
                this.showNotification(data.error || 'Lỗi khi tải file lên', 'error');
            }
        } catch (error) {
            this.showNotification('Lỗi kết nối', 'error');
        }
    }

    resetFileUploadAreas() {
        const areas = ['file-upload-area', 'icon-upload-area'];
        areas.forEach(areaId => {
            const area = document.getElementById(areaId);
            const icon = area.querySelector('i');
            const text = area.querySelector('p');
            const preview = area.querySelector('.file-preview');
            
            icon.style.display = 'block';
            text.textContent = areaId.includes('icon') ? 'Kéo thả icon vào đây hoặc click để chọn' : 'Kéo thả file vào đây hoặc click để chọn';
            text.style.fontSize = '14px';
            
            if (preview) {
                preview.remove();
            }
        });
    }

    resetIconSelection() {
        // Reset radio buttons to default
        document.querySelectorAll('input[name="icon_type"]').forEach(radio => {
            radio.checked = radio.value === 'default';
        });
        
        // Reset Font Awesome selection
        document.querySelectorAll('.icon-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        this.selectedIcon = null;
        
        // Show default preview
        document.querySelectorAll('.icon-preview').forEach(preview => {
            preview.style.display = 'block';
        });
        
        document.querySelectorAll('.icon-upload-section, .icon-selector').forEach(section => {
            section.style.display = 'none';
        });
    }

    editFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        document.getElementById('edit-file-id').value = file.id;
        document.getElementById('edit-file-name').value = file.name;
        document.getElementById('edit-file-description').value = file.description || '';
        document.getElementById('edit-file-category').value = file.category_id;

        this.showModal('edit-modal');
    }

    async handleFileEdit() {
        const form = document.getElementById('edit-form');
        const fileId = document.getElementById('edit-file-id').value;

        const data = {
            name: form.name.value,
            description: form.description.value,
            category_id: form.category_id.value
        };

        // Handle icon based on selection
        const iconType = document.querySelector('input[name="edit_icon_type"]:checked').value;
        
        if (iconType === 'custom') {
            const iconInput = document.getElementById('edit-file-icon');
            if (iconInput.files.length > 0) {
                // Handle file upload in edit
                const formData = new FormData();
                formData.append('icon', iconInput.files[0]);
                // You might need to handle this differently depending on your API
            }
        } else if (iconType === 'fontawesome' && this.selectedIcon) {
            data.icon_class = this.selectedIcon;
        }

        try {
            const response = await fetch(`api/files/${fileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('File đã được cập nhật!', 'success');
                this.closeAllModals();
                this.loadFiles();
            } else {
                this.showNotification(result.error || 'Lỗi khi cập nhật file', 'error');
            }
        } catch (error) {
            this.showNotification('Lỗi kết nối', 'error');
        }
    }

    deleteFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        document.getElementById('delete-file-name').textContent = file.name;
        this.currentFileId = fileId;
        this.showModal('delete-modal');
    }

    async confirmDelete() {
        if (!this.currentFileId) return;

        try {
            const response = await fetch(`api/files/${this.currentFileId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                this.showNotification('File đã được xóa!', 'success');
                this.closeAllModals();
                this.loadFiles();
            } else {
                this.showNotification(data.error || 'Lỗi khi xóa file', 'error');
            }
        } catch (error) {
            this.showNotification('Lỗi kết nối', 'error');
        }
    }

    downloadFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
            window.open(file.filepath, '_blank');
        }
    }

    showUploadModal() {
        this.showModal('upload-modal');
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    closeUploadModal() {
        document.getElementById('upload-modal').style.display = 'none';
    }

    closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').style.display = 'none';
    }

    handleSearch(query) {
        // Implement search functionality
        console.log('Searching for:', query);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Global functions for modal actions
function showUploadModal() {
    adminPanel.showUploadModal();
}

function closeUploadModal() {
    adminPanel.closeUploadModal();
}

function closeEditModal() {
    adminPanel.closeEditModal();
}

function closeDeleteModal() {
    adminPanel.closeDeleteModal();
}

function confirmDelete() {
    adminPanel.confirmDelete();
}

// Initialize admin panel
const adminPanel = new AdminPanel(); 