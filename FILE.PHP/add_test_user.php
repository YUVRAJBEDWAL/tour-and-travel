<?php
require_once 'auth.php';

// Create a test user with simple credentials
$name = 'Test User';
$email = 'test@test.com';
$password = 'test123';

// Create a simple hash that will work reliably
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    // Check if user already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Update existing user's password
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hashed_password, $email]);
        echo "Test user updated successfully!<br>";
    } else {
        // Create new user
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hashed_password, date('Y-m-d H:i:s')]);
        echo "Test user created successfully!<br>";
    }
    
    echo "Login with:<br>";
    echo "Email: test@test.com<br>";
    echo "Password: test123";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>