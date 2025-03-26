<?php
require_once 'auth.php';

// Create a simple test user
$name = 'Simple User';
$email = 'simple@example.com';
$password = 'simple123';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    // Insert the user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, 0, ?)");
    $stmt->execute([$name, $email, $hashed_password, date('Y-m-d H:i:s')]);
    
    echo "Simple user created successfully!<br>";
    echo "Email: simple@example.com<br>";
    echo "Password: simple123<br>";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>