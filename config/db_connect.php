<?php
$servername = "localhost";
$username = "root";
$password = ""; // Update this if you have set a password
$dbname = "travel_admin";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>