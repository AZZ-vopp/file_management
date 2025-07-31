<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class FileDownloadAPI {
    private $db;
    private $uploadDir = '../uploads/';
    private $iconDir = '../uploads/icons/';

    public function __construct() {
        $this->connectDB();
        $this->createDirectories();
    }

    private function connectDB() {
        try {
            $this->db = new PDO(
                'mysql:host=localhost;dbname=filedownload;charset=utf8mb4',
                'filedownload_user',
                'filedownload_pass123',
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {
            $this->sendError('Database connection failed: ' . $e->getMessage());
        }
    }

    private function createDirectories() {
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
        if (!file_exists($this->iconDir)) {
            mkdir($this->iconDir, 0777, true);
        }
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['REQUEST_URI'];
        $path = parse_url($path, PHP_URL_PATH);
        $path = trim($path, '/');
        $segments = explode('/', $path);
        
        // Remove 'api' from segments if present
        if ($segments[0] === 'api') {
            array_shift($segments);
        }

        $endpoint = $segments[0] ?? '';

        switch ($method) {
            case 'GET':
                switch ($endpoint) {
                    case 'files':
                        $this->getFiles();
                        break;
                    case 'categories':
                        $this->getCategories();
                        break;
                    case 'stats':
                        $this->getStats();
                        break;
                    default:
                        $this->sendError('Endpoint not found', 404);
                }
                break;
            case 'POST':
                switch ($endpoint) {
                    case 'upload':
                        $this->uploadFile();
                        break;
                    case 'login':
                        $this->login();
                        break;
                    default:
                        $this->sendError('Endpoint not found', 404);
                }
                break;
            case 'PUT':
                if ($endpoint === 'files' && isset($segments[1])) {
                    $this->updateFile($segments[1]);
                } else {
                    $this->sendError('Endpoint not found', 404);
                }
                break;
            case 'DELETE':
                if ($endpoint === 'files' && isset($segments[1])) {
                    $this->deleteFile($segments[1]);
                } else {
                    $this->sendError('Endpoint not found', 404);
                }
                break;
            default:
                $this->sendError('Method not allowed', 405);
        }
    }

    private function getFiles() {
        try {
            $stmt = $this->db->query("
                SELECT f.*, c.name as category_name 
                FROM files f 
                LEFT JOIN categories c ON f.category_id = c.id 
                ORDER BY f.created_at DESC
            ");
            $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse($files);
        } catch (PDOException $e) {
            $this->sendError('Failed to fetch files: ' . $e->getMessage());
        }
    }

    private function getCategories() {
        try {
            $stmt = $this->db->query("SELECT * FROM categories ORDER BY name");
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse($categories);
        } catch (PDOException $e) {
            $this->sendError('Failed to fetch categories: ' . $e->getMessage());
        }
    }

    private function getStats() {
        try {
            $stats = [];
            
            // Total files
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM files");
            $stats['total_files'] = $stmt->fetchColumn();
            
            // Total downloads
            $stmt = $this->db->query("SELECT SUM(download_count) as total FROM files");
            $stats['total_downloads'] = $stmt->fetchColumn() ?: 0;
            
            // Files by category
            $stmt = $this->db->query("
                SELECT c.name, COUNT(f.id) as count 
                FROM categories c 
                LEFT JOIN files f ON c.id = f.category_id 
                GROUP BY c.id, c.name
            ");
            $stats['by_category'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $this->sendResponse($stats);
        } catch (PDOException $e) {
            $this->sendError('Failed to fetch stats: ' . $e->getMessage());
        }
    }

    private function uploadFile() {
        try {
            if (!isset($_FILES['file'])) {
                $this->sendError('No file uploaded');
                return;
            }

            $file = $_FILES['file'];
            $name = $_POST['name'] ?? '';
            $description = $_POST['description'] ?? '';
            $category_id = $_POST['category_id'] ?? 1;
            $icon = $_FILES['icon'] ?? null;

            // Validate file
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $this->sendError('File upload failed');
                return;
            }

            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $extension;
            $filepath = $this->uploadDir . $filename;

            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                $this->sendError('Failed to save file');
                return;
            }

            // Handle icon upload
            $icon_path = null;
            if ($icon && $icon['error'] === UPLOAD_ERR_OK) {
                $icon_extension = pathinfo($icon['name'], PATHINFO_EXTENSION);
                $icon_filename = uniqid() . '_icon.' . $icon_extension;
                $icon_filepath = $this->iconDir . $icon_filename;
                
                if (move_uploaded_file($icon['tmp_name'], $icon_filepath)) {
                    $icon_path = 'uploads/icons/' . $icon_filename;
                }
            }

            // Save to database
            $stmt = $this->db->prepare("
                INSERT INTO files (name, description, filename, filepath, category_id, icon_path, download_count, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
            ");
            $stmt->execute([$name, $description, $filename, $filepath, $category_id, $icon_path]);

            $this->sendResponse(['message' => 'File uploaded successfully', 'id' => $this->db->lastInsertId()]);
        } catch (PDOException $e) {
            $this->sendError('Failed to save file: ' . $e->getMessage());
        }
    }

    private function updateFile($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $name = $input['name'] ?? '';
            $description = $input['description'] ?? '';
            $category_id = $input['category_id'] ?? 1;
            $icon_path = $input['icon_path'] ?? null;

            $stmt = $this->db->prepare("
                UPDATE files 
                SET name = ?, description = ?, category_id = ?, icon_path = ?, updated_at = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([$name, $description, $category_id, $icon_path, $id]);

            $this->sendResponse(['message' => 'File updated successfully']);
        } catch (PDOException $e) {
            $this->sendError('Failed to update file: ' . $e->getMessage());
        }
    }

    private function deleteFile($id) {
        try {
            // Get file info before deletion
            $stmt = $this->db->prepare("SELECT filepath, icon_path FROM files WHERE id = ?");
            $stmt->execute([$id]);
            $file = $stmt->fetch(PDO::FETCH_ASSOC);

            // Delete from database
            $stmt = $this->db->prepare("DELETE FROM files WHERE id = ?");
            $stmt->execute([$id]);

            // Delete physical files
            if ($file) {
                if (file_exists($file['filepath'])) {
                    unlink($file['filepath']);
                }
                if ($file['icon_path'] && file_exists('../' . $file['icon_path'])) {
                    unlink('../' . $file['icon_path']);
                }
            }

            $this->sendResponse(['message' => 'File deleted successfully']);
        } catch (PDOException $e) {
            $this->sendError('Failed to delete file: ' . $e->getMessage());
        }
    }

    private function login() {
        // Simple authentication - in production, use proper authentication
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        if ($username === 'admin' && $password === 'admin123') {
            $this->sendResponse(['message' => 'Login successful', 'token' => 'dummy_token']);
        } else {
            $this->sendError('Invalid credentials', 401);
        }
    }

    private function sendResponse($data) {
        echo json_encode(['success' => true, 'data' => $data]);
    }

    private function sendError($message, $code = 400) {
        http_response_code($code);
        echo json_encode(['success' => false, 'error' => $message]);
    }
}

$api = new FileDownloadAPI();
$api->handleRequest();
?> 