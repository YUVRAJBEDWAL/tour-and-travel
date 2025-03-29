<?php
// Admin API endpoints
header('Content-Type: application/json');
session_start();

// Check if user is logged in and is an admin
function checkAdminAuth() {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// Database connection
function getDbConnection() {
    $db_file = __DIR__ . '/../FILE.PHP/database.sqlite';
    $conn = new PDO("sqlite:$db_file");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
}

// Get request method and endpoint
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Handle different endpoints
switch ($endpoint) {
    case 'login':
        handleLogin();
        break;
    case 'dashboard':
        checkAdminAuth();
        getDashboardStats();
        break;
    case 'bookings':
        checkAdminAuth();
        handleBookings();
        break;
    case 'users':
        checkAdminAuth();
        handleUsers();
        break;
    case 'packages':
        checkAdminAuth();
        handlePackages();
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

// Handle login
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $email = isset($data['email']) ? $data['email'] : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND is_admin = 1");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin || !password_verify($password, $admin['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    $_SESSION['user_id'] = $admin['id'];
    $_SESSION['name'] = $admin['name'];
    $_SESSION['email'] = $admin['email'];
    $_SESSION['is_admin'] = 1;

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $admin['id'],
            'name' => $admin['name'],
            'email' => $admin['email']
        ]
    ]);
}

// Get dashboard statistics
function getDashboardStats() {
    $conn = getDbConnection();
    
    // Get total users
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get total bookings (assuming there's a bookings table)
    $stmt = $conn->query("SELECT COUNT(*) as total FROM bookings");
    $totalBookings = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    
    // Get pending bookings
    $stmt = $conn->query("SELECT COUNT(*) as total FROM bookings WHERE status = 'pending'");
    $pendingBookings = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    
    // Get total revenue
    $stmt = $conn->query("SELECT SUM(amount) as total FROM bookings");
    $totalRevenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    
    // Get recent bookings
    $stmt = $conn->query("SELECT b.*, u.name as customer_name FROM bookings b 
                         JOIN users u ON b.user_id = u.id 
                         ORDER BY b.created_at DESC LIMIT 5");
    $recentBookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'totalUsers' => $totalUsers,
        'totalBookings' => $totalBookings,
        'pendingBookings' => $pendingBookings,
        'totalRevenue' => $totalRevenue,
        'recentBookings' => $recentBookings
    ]);
}

// Handle bookings endpoints
function handleBookings() {
    $conn = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // Get all bookings
            $stmt = $conn->query("SELECT b.*, u.name as customer_name FROM bookings b 
                               JOIN users u ON b.user_id = u.id 
                               ORDER BY b.created_at DESC");
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($bookings);
            break;
            
        case 'PUT':
        case 'PATCH':
            // Update booking status
            $data = json_decode(file_get_contents('php://input'), true);
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $status = isset($data['status']) ? $data['status'] : null;
            
            if (!$id || !$status) {
                http_response_code(400);
                echo json_encode(['error' => 'Booking ID and status are required']);
                return;
            }
            
            $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
            $result = $stmt->execute([$status, $id]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Booking updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update booking']);
            }
            break;
            
        case 'DELETE':
            // Delete booking
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Booking ID is required']);
                return;
            }
            
            $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Booking deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete booking']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

// Handle users endpoints
function handleUsers() {
    $conn = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // Get all users
            $stmt = $conn->query("SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
            break;
            
        case 'POST':
            // Create new user
            $data = json_decode(file_get_contents('php://input'), true);
            $name = isset($data['name']) ? $data['name'] : null;
            $email = isset($data['email']) ? $data['email'] : null;
            $password = isset($data['password']) ? $data['password'] : null;
            $isAdmin = isset($data['is_admin']) ? (int)$data['is_admin'] : 0;
            
            if (!$name || !$email || !$password) {
                http_response_code(400);
                echo json_encode(['error' => 'Name, email and password are required']);
                return;
            }
            
            // Check if email already exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->rowCount() > 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Email already exists']);
                return;
            }
            
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, ?, NOW())");
            $result = $stmt->execute([$name, $email, $hashedPassword, $isAdmin]);
            
            if ($result) {
                $userId = $conn->lastInsertId();
                echo json_encode(['success' => true, 'message' => 'User created successfully', 'id' => $userId]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create user']);
            }
            break;
            
        case 'PUT':
        case 'PATCH':
            // Update user
            $data = json_decode(file_get_contents('php://input'), true);
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'User ID is required']);
                return;
            }
            
            $updates = [];
            $params = [];
            
            if (isset($data['name'])) {
                $updates[] = "name = ?";
                $params[] = $data['name'];
            }
            
            if (isset($data['email'])) {
                $updates[] = "email = ?";
                $params[] = $data['email'];
            }
            
            if (isset($data['password'])) {
                $updates[] = "password = ?";
                $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            
            if (isset($data['is_admin'])) {
                $updates[] = "is_admin = ?";
                $params[] = (int)$data['is_admin'];
            }
            
            if (empty($updates)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                return;
            }
            
            $params[] = $id; // Add ID to params
            $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $result = $stmt->execute($params);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'User updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update user']);
            }
            break;
            
        case 'DELETE':
            // Delete user
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'User ID is required']);
                return;
            }
            
            $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete user']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

// Handle packages endpoints
function handlePackages() {
    $conn = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // Get all packages
            $stmt = $conn->query("SELECT * FROM packages ORDER BY created_at DESC");
            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($packages);
            break;
            
        case 'POST':
            // Create new package
            $data = json_decode(file_get_contents('php://input'), true);
            $name = isset($data['name']) ? $data['name'] : null;
            $description = isset($data['description']) ? $data['description'] : null;
            $price = isset($data['price']) ? (float)$data['price'] : null;
            $duration = isset($data['duration']) ? (int)$data['duration'] : null;
            $location = isset($data['location']) ? $data['location'] : null;
            $image = isset($data['image']) ? $data['image'] : null;
            
            if (!$name || !$description || !$price || !$location) {
                http_response_code(400);
                echo json_encode(['error' => 'Name, description, price and location are required']);
                return;
            }
            
            $stmt = $conn->prepare("INSERT INTO packages (name, description, price, duration, location, image, created_at) 
                                VALUES (?, ?, ?, ?, ?, ?, NOW())");
            $result = $stmt->execute([$name, $description, $price, $duration, $location, $image]);
            
            if ($result) {
                $packageId = $conn->lastInsertId();
                echo json_encode(['success' => true, 'message' => 'Package created successfully', 'id' => $packageId]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create package']);
            }
            break;
            
        case 'PUT':
        case 'PATCH':
            // Update package
            $data = json_decode(file_get_contents('php://input'), true);
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Package ID is required']);
                return;
            }
            
            $updates = [];
            $params = [];
            
            if (isset($data['name'])) {
                $updates[] = "name = ?";
                $params[] = $data['name'];
            }
            
            if (isset($data['description'])) {
                $updates[] = "description = ?";
                $params[] = $data['description'];
            }
            
            if (isset($data['price'])) {
                $updates[] = "price = ?";
                $params[] = (float)$data['price'];
            }
            
            if (isset($data['duration'])) {
                $updates[] = "duration = ?";
                $params[] = (int)$data['duration'];
            }
            
            if (isset($data['location'])) {
                $updates[] = "location = ?";
                $params[] = $data['location'];
            }
            
            if (isset($data['image'])) {
                $updates[] = "image = ?";
                $params[] = $data['image'];
            }
            
            if (empty($updates)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                return;
            }
            
            $params[] = $id; // Add ID to params
            $sql = "UPDATE packages SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $result = $stmt->execute($params);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Package updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update package']);
            }
            break;
            
        case 'DELETE':
            // Delete package
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Package ID is required']);
                return;
            }
            
            $stmt = $conn->prepare("DELETE FROM packages WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Package deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete package']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}
?>