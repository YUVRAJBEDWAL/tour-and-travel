<?php
// Database connection
$db = new SQLite3('database_contact.sql');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Retrieve contacts
    $result = $db->query('SELECT * FROM contacts');
    $contacts = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $contacts[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($contacts);
    exit();
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and get form data
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
        // Insert into database
        $stmt = $db->prepare('INSERT INTO contacts (first_name, last_name, email, phone_number, address) 
                            VALUES (:first_name, :last_name, :email, :phone, :address)');
        
        $stmt->bindValue(':first_name', $first_name);
        $stmt->bindValue(':last_name', $last_name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':phone', $phone);
        $stmt->bindValue(':address', $address);
        
        $result = $stmt->execute();

        if ($result) {
            // Send confirmation email
            $to = $email;
            $subject = "Contact Information Received";
            $message = "Thank you for submitting your contact information, $first_name!";
            $headers = "From: your-email@domain.com";

            mail($to, $subject, $message, $headers);
            
            echo "Contact information saved successfully!";
        } else {
            echo "Error saving contact information.";
        }

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

} 
// Close database connection
$db->close();

?>
