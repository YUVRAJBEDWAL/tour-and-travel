<?php
require_once 'auth.php';

// Email to check
$email = 'admin@travel.com'; // Change this to the email you're trying to login with

// Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "User found:<br>";
    echo "ID: " . $user['id'] . "<br>";
    echo "Name: " . $user['name'] . "<br>";
    echo "Email: " . $user['email'] . "<br>";
    echo "Is Admin: " . ($user['is_admin'] ? 'Yes' : 'No') . "<br>";
    
    // Test a password
    $test_password = 'admin@123'; // Change this to the password you're trying
    if (password_verify($test_password, $user['password'])) {
        echo "Password is correct!";
    } else {
        echo "Password is incorrect!";
    }
} else {
    echo "User not found with email: $email";
}
?>