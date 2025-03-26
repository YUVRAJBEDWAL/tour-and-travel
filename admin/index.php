<?php
// Start session for login tracking
session_start();

// Include database connection
require_once '../db_connect.php';

// Redirect to login page if not already logged in
if(!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
} else {
    header("Location: dashboard.php");
    exit();
}
?>