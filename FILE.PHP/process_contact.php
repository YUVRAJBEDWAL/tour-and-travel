<?php
// Include database connection
require_once 'db_connect.php';

// Check if form is submitted
if(isset($_POST['submit'])) {
    // Get form data and sanitize inputs
    $fullname = $conn->real_escape_string($_POST['fullname']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $message = $conn->real_escape_string($_POST['message']);
    $created_at = date('Y-m-d H:i:s');
    
    // Prepare SQL statement
    $sql = "INSERT INTO contact_messages (fullname, email, phone, subject, message, created_at) 
            VALUES ('$fullname', '$email', '$phone', '$subject', '$message', '$created_at')";
    
    // Execute query
    if($conn->query($sql) === TRUE) {
        // Success
        echo "<script>
                alert('Thank you for contacting us. We will get back to you soon!');
                window.location.href = 'index.html#contact';
              </script>";
    } else {
        // Error
        echo "<script>
                alert('Sorry, there was an error submitting your message. Please try again later.');
                window.location.href = 'index.html#contact';
              </script>";
    }
}

// Close connection
$conn->close();
?>