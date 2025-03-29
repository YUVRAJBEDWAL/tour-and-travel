<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database connection
$db_file = __DIR__ . '/database.sqlite';

try {
    $conn = new PDO("sqlite:$db_file");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table if it doesn't exist
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if email and password are set
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
        
        try {
            // Simple login for test user
            if ($email === 'test@test.com' && $password === 'test123') {
                $_SESSION['user_id'] = 1;
                $_SESSION['user_name'] = 'Test User';
                $_SESSION['is_admin'] = 0;
                
                header('Location: index.html');
                exit();
            }
            
            // Regular database check
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['is_admin'] = $user['is_admin'];
                
                if ($user['is_admin'] == 1) {
                    header('Location: admin/index.php');
                } else {
                    header('Location: index.html');
                }
                exit();
            } else {
                // Redirect back to login page with error
                $_SESSION['login_error'] = "Invalid email or password";
                header('Location: login.html');
                exit();
            }
        } catch (PDOException $e) {
            $_SESSION['login_error'] = "Database error: " . $e->getMessage();
            header('Location: login.html');
            exit();
        }
    } else {
        $_SESSION['login_error'] = "Email and password are required";
        header('Location: login.html');
        exit();
    }
}
?>