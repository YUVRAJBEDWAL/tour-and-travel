<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Session Test</h1>";

// Set a test session variable
$_SESSION['test'] = 'Session is working!';

echo "<p>Session variable set. Current session data:</p>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

echo "<p>PHP Session ID: " . session_id() . "</p>";
echo "<p>Session save path: " . session_save_path() . "</p>";

// Check session configuration
echo "<h2>Session Configuration</h2>";
echo "<pre>";
print_r(ini_get_all('session'));
echo "</pre>";

echo "<p><a href='test_session_check.php'>Check if session persists</a></p>";
?>