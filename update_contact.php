<?php
// Database connection
$db = new SQLite3('database_contact.sql');

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and get form data
    $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);
    $first_name = filter_var($_POST['first_name'], FILTER_SANITIZE_STRING);
    $last_name = filter_var($_POST['last_name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $address = filter_var($_POST['address'], FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format";
        exit();
    }

    try {
        // Update in database
        $stmt = $db->prepare('UPDATE contacts SET first_name = :first_name, last_name = :last_name, email = :email, phone_number = :phone, address = :address WHERE id = :id');
        
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->bindValue(':first_name', $first_name);
        $stmt->bindValue(':last_name', $last_name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':phone', $phone);
        $stmt->bindValue(':address', $address);
        
        $result = $stmt->execute();

        if ($result) {
            echo "Contact information updated successfully!";
        } else {
            echo "Error updating contact information.";
        }

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

// Close database connection
$db->close();
?>
