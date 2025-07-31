// Main Website JavaScript
class FileDownloadCenter {
    constructor() {
        this.files = [];
        this.categories = [];
        this.currentDownloadFile = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFiles();
        this.setupSearch();
        this.setupScrollToTop();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeDownloadModal();
            });
        });

        // Close modal when clicking outside
        document.getElementById('download-modal').addEventListener('click', (e) => {
            if (e.target.id === 'download-modal') {
                this.closeDownloadModal();
            }
        });

        // Confirm download button
        document.getElementById('confirm-download-btn').addEventListener('click', () => {
            this.confirmDownload();
        });
    }

    async loadFiles() {
        try {
            const response = await fetch('api/files');
            const data = await response.json();
            
            if (data.success) {
                this.files = data.data;
                this.renderFiles();
            }
        } catch (error) {
            console.error('Error loading files:', error);
            // Fallback to static data if API fails
            this.loadStaticData();
        }
    }

    loadStaticData() {
        // Fallback static data
        this.files = [
            {
                id: 1,
                name: 'Chrome Browser',
                description: 'Trình duyệt web nhanh và an toàn',
                category_name: 'Windows',
                file_size: 52428800,
                download_count: 150,
                icon_path: null
            },
            {
                id: 2,
                name: 'WhatsApp',
                description: 'Ứng dụng nhắn tin',
                category_name: 'Android',
                file_size: 45678901,
                download_count: 445,
                icon_path: null
            },
            {
                id: 3,
                name: 'Safari',
                description: 'Trình duyệt mặc định macOS',
                category_name: 'macOS',
                file_size: 34567890,
                download_count: 78,
                icon_path: null
            },
            {
                id: 4,
                name: '7-Zip',
                description: 'Nén và giải nén file',
                category_name: 'Tiện Ích',
                file_size: 1234567,
                download_count: 234,
                icon_path: null
            }
        ];
        this.renderFiles();
    }

    renderFiles() {
        const categoryGrids = {
            'Android': document.getElementById('android-grid'),
            'Windows': document.getElementById('windows-grid'),
            'macOS': document.getElementById('macos-grid'),
            'Tiện Ích': document.getElementById('utilities-grid')
        };

        // Clear all grids
        Object.values(categoryGrids).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });

        // Render files by category
        this.files.forEach(file => {
            const grid = categoryGrids[file.category_name];
            if (grid) {
                const card = this.createFileCard(file);
                grid.appendChild(card);
            }
        });
    }

    createFileCard(file) {
        const card = document.createElement('div');
        card.className = 'download-card';
        card.innerHTML = `
            <div class="card-icon">
                ${this.getFileIcon(file)}
            </div>
            <div class="card-content">
                <h4>${file.name}</h4>
                <p>${file.description || ''}</p>
                <div class="card-meta">
                    <span class="size">${this.formatFileSize(file.file_size)}</span>
                    <span class="downloads">${file.download_count} lượt tải</span>
                </div>
            </div>
            <button class="download-btn" onclick="fileDownloadCenter.downloadFile(${file.id})">
                <i class="fas fa-download"></i>
                Tải Xuống
            </button>
        `;
        return card;
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

    downloadFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        this.currentDownloadFile = file;
        this.showDownloadModal(file);
    }

    showDownloadModal(file) {
        const modal = document.getElementById('download-modal');
        const iconContainer = document.getElementById('modal-file-icon');
        const nameElement = document.getElementById('modal-file-name');
        const descriptionElement = document.getElementById('modal-file-description');
        const sizeElement = document.getElementById('modal-file-size');
        const downloadsElement = document.getElementById('modal-file-downloads');

        // Set modal content
        iconContainer.innerHTML = this.getFileIcon(file);
        nameElement.textContent = file.name;
        descriptionElement.textContent = file.description || '';
        sizeElement.textContent = this.formatFileSize(file.file_size);
        downloadsElement.textContent = `${file.download_count} lượt tải`;

        // Show modal
        modal.style.display = 'flex';
    }

    closeDownloadModal() {
        document.getElementById('download-modal').style.display = 'none';
        this.currentDownloadFile = null;
    }

    confirmDownload() {
        if (!this.currentDownloadFile) return;

        // Simulate download
        const link = document.createElement('a');
        link.href = this.currentDownloadFile.filepath || '#';
        link.download = this.currentDownloadFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close modal
        this.closeDownloadModal();

        // Show success message
        this.showNotification('Bắt đầu tải xuống file!', 'success');
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterFiles(query);
        });
    }

    filterFiles(query) {
        const cards = document.querySelectorAll('.download-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;

        // Show/hide scroll button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.style.display = 'block';
            } else {
                scrollBtn.style.display = 'none';
            }
        });

        // Scroll to top when clicked
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global function for modal close
function closeDownloadModal() {
    fileDownloadCenter.closeDownloadModal();
}

// Initialize the application
const fileDownloadCenter = new FileDownloadCenter();

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 