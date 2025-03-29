<?php
require_once 'auth.php';

// Create a regular test user
$name = 'Test User';
$email = 'test@example.com';
$password = 'password123';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    // Check if user already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        echo "Test user already exists.<br>";
    } else {
        // Create the user
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, 0, ?)");
        $stmt->execute([$name, $email, $hashed_password, date('Y-m-d H:i:s')]);
        
        echo "Test user created successfully!<br>";
    }
    
    echo "You can now login with:<br>";
    echo "Email: test@example.com<br>";
    echo "Password: password123<br>";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>