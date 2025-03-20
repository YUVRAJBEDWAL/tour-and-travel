<?php
// Database connection
$db = new SQLite3('/Users/yuvrajbedwal/Desktop/TRAVEL 106866/database_contact.sql');

if (!$db) {
    echo "Database connection failed: " . SQLite3::lastErrorMsg();
} else {
    echo "Database connection successful.";

    // Test retrieving contacts
    $result = $db->query('SELECT * FROM contacts');
    $contacts = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $contacts[] = $row;
    }
    
    // Output contacts
    header('Content-Type: application/json');
    echo json_encode($contacts);
}

// Close database connection
$db->close();
?>
