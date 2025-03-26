<?php
session_start();
require_once '../../config/db.php';

if (!isset($_SESSION['is_admin'])) {
    http_response_code(403);
    exit('Unauthorized');
}

try {
    $stmt = $conn->query("SELECT 
        b.booking_id,
        b.customer_name,
        b.package_name,
        b.travel_date,
        b.total_amount,
        b.booking_status,
        b.created_at
    FROM bookings b
    ORDER BY b.created_at DESC");
    
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode($bookings);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>