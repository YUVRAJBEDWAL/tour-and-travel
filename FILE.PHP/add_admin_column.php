<?php
require_once 'auth.php';

try {
    $sql = "ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0";
    $conn->exec($sql);
    echo "Successfully added is_admin column to users table!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>