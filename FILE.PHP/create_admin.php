<?php
require_once 'auth.php';

$email = 'admin@travel.com';  // Admin email
$password = 'admin@123';      // Admin password
$name = 'Admin Panel';

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, 1, ?)");
    $stmt->execute([$name, $email, $hashed_password, date('Y-m-d H:i:s')]);
    echo "Admin user created successfully!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>