<?php
session_start();
require_once 'auth.php';

// Create a test user if it doesn't exist
try {
    $email = 'test@example.com';
    $password = 'password123';
    $name = 'Test User';
    
    // Check if user already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // Create the user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hashed_password, date('Y-m-d H:i:s')]);
        
        echo "Test user created:<br>";
        echo "Email: $email<br>";
        echo "Password: $password<br><br>";
    } else {
        echo "Test user already exists:<br>";
        echo "Email: $email<br>";
        echo "Password: $password<br><br>";
    }
    
    // Set session variables directly
    $_SESSION['user_id'] = $user['id'] ?? $conn->lastInsertId();
    $_SESSION['user_name'] = $name;
    $_SESSION['is_admin'] = 0;
    
    echo "You are now logged in as $name.<br>";
    echo "<a href='index.html'>Go to homepage</a>";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>