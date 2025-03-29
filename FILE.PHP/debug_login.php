<?php
require_once 'auth.php';

// Test credentials
$test_email = 'test@example.com';
$test_password = 'password123';

echo "<h2>Login Debugging</h2>";

try {
    // Check if the user exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$test_email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "<p>User found in database:</p>";
        echo "<ul>";
        echo "<li>ID: " . $user['id'] . "</li>";
        echo "<li>Name: " . $user['name'] . "</li>";
        echo "<li>Email: " . $user['email'] . "</li>";
        echo "<li>Password hash: " . substr($user['password'], 0, 10) . "...</li>";
        echo "</ul>";
        
        // Test password verification
        if (password_verify($test_password, $user['password'])) {
            echo "<p style='color:green'>Password verification SUCCESSFUL</p>";
        } else {
            echo "<p style='color:red'>Password verification FAILED</p>";
            
            // Create a new hash for comparison
            $new_hash = password_hash($test_password, PASSWORD_DEFAULT);
            echo "<p>New hash for '$test_password': " . $new_hash . "</p>";
        }
    } else {
        echo "<p style='color:red'>User with email '$test_email' NOT FOUND in database</p>";
        
        // Show all users in the database
        $stmt = $conn->query("SELECT id, name, email FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($users) > 0) {
            echo "<p>Users in database:</p>";
            echo "<ul>";
            foreach ($users as $u) {
                echo "<li>" . $u['name'] . " (" . $u['email'] . ")</li>";
            }
            echo "</ul>";
        } else {
            echo "<p>No users found in database.</p>";
        }
    }
} catch (PDOException $e) {
    echo "<p style='color:red'>Database error: " . $e->getMessage() . "</p>";
}
?>