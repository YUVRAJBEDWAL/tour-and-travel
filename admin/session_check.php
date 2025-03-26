<?php
// This file checks if a session exists and validates it
// If no session exists, it will be handled by the login page

function isLoggedIn() {
    return isset($_SESSION['admin_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit();
    }
}

// Add booking-specific session functions
function hasActiveBooking() {
    return isset($_SESSION['booking_id']);
}

function setBookingSession($bookingId) {
    $_SESSION['booking_id'] = $bookingId;
    $_SESSION['booking_timestamp'] = time();
}

function clearBookingSession() {
    unset($_SESSION['booking_id']);
    unset($_SESSION['booking_timestamp']);
}

// You can add more session-related functions here
?>