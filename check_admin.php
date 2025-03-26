<?php
require_once 'auth.php';

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND is_admin = 1");
    $stmt->execute(['admin@travel.com']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "Admin exists in database:<br>";
        echo "Email: " . $admin['email'] . "<br>";
        echo "Name: " . $admin['name'] . "<br>";
        echo "Is Admin: " . $admin['is_admin'] . "<br>";
    } else {
        echo "Admin user not found. Creating new admin...";
        
        $email = 'admin@travel.com';
        $password = 'admin@123';
        $name = 'Admin Panel';
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, 1, ?)");
        $stmt->execute([$name, $email, $hashed_password, date('Y-m-d H:i:s')]);
        
        echo "<br>Admin user created successfully!";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>