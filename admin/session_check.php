<?php
// Check if user is logged in and is an admin
session_start();

if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    // Redirect to login page if not logged in as admin
    header('Location: login.html');
    exit;
}
?>