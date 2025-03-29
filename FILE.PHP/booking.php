<?php
session_start();
require_once 'db_connect.php';
require_once 'admin/session_check.php';

// Initialize variables
$error = '';
$success = '';

// Process booking form
if(isset($_POST['submit_booking'])) {
    // Get form data
    $package_name = $conn->real_escape_string($_POST['package_name']);
    $travel_date = $conn->real_escape_string($_POST['travel_date']);
    $num_travelers = (int)$_POST['num_travelers'];
    $total_amount = (float)$_POST['total_amount'];
    
    // Validate inputs
    if(empty($package_name) || empty($travel_date) || $num_travelers <= 0 || $total_amount <= 0) {
        $error = "Please fill all required fields with valid information.";
    } else {
        // If user is logged in, save to database
        if(isset($_SESSION['user_id'])) {
            $user_id = $_SESSION['user_id'];
            $booking_date = date('Y-m-d H:i:s');
            
            $sql = "INSERT INTO bookings (user_id, package_name, travel_date, num_travelers, total_amount, status, booking_date) 
                    VALUES ('$user_id', '$package_name', '$travel_date', '$num_travelers', '$total_amount', 'pending', '$booking_date')";
            
            if($conn->query($sql) === TRUE) {
                $booking_id = $conn->insert_id;
                setBookingSession($booking_id);
                $success = "Your booking has been successfully submitted! Booking ID: #$booking_id";
            } else {
                $error = "Error: " . $conn->error;
            }
        } else {
            // Store booking in session for non-logged in users
            $_SESSION['temp_booking'] = [
                'package_name' => $package_name,
                'travel_date' => $travel_date,
                'num_travelers' => $num_travelers,
                'total_amount' => $total_amount,
                'timestamp' => time()
            ];
            
            // Redirect to login/register
            header("Location: login.php?redirect=booking");
            exit();
        }
    }
}

// Remove the include_once 'index.html' line - this is causing the issue
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Your Trip - Tour & Travel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .booking-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .booking-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .booking-form .form-group {
            margin-bottom: 1.5rem;
        }
        
        .booking-form label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        
        .booking-form input, .booking-form select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .booking-form button {
            width: 100%;
            padding: 1rem;
            background: #219150;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .booking-form button:hover {
            background: #1a7340;
        }
        
        .error-message {
            color: #e74c3c;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .success-message {
            color: #27ae60;
            margin-bottom: 1rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- Add a simple navigation header -->
    <header>
        <div class="header">
            <a href="index.html" class="logo">Tour & Travel</a>
            <nav class="navbar">
                <a href="index.html">Home</a>
                <a href="booking.php" class="active">Book Now</a>
                <a href="contact.php">Contact</a>
                <?php if(isset($_SESSION['user_id'])): ?>
                    <a href="profile.php">My Profile</a>
                    <a href="logout.php">Logout</a>
                <?php else: ?>
                    <a href="login.php">Login</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>
    
    <div class="booking-container">
        <div class="booking-header">
            <h1><i class="fas fa-calendar-check"></i> Book Your Trip</h1>
            <p>Fill out the form below to book your dream vacation</p>
        </div>
        
        <?php if($error): ?>
            <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if($success): ?>
            <div class="success-message"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <form class="booking-form" method="POST" action="">
            <div class="form-group">
                <label for="package_name">Select Package</label>
                <select id="package_name" name="package_name" required>
                    <option value="">-- Select a Package --</option>
                    <option value="Adventure Package">Adventure Package</option>
                    <option value="Beach Vacation">Beach Vacation</option>
                    <option value="Mountain Retreat">Mountain Retreat</option>
                    <option value="City Explorer">City Explorer</option>
                    <option value="Cultural Tour">Cultural Tour</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="travel_date">Travel Date</label>
                <input type="date" id="travel_date" name="travel_date" min="<?php echo date('Y-m-d'); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="num_travelers">Number of Travelers</label>
                <input type="number" id="num_travelers" name="num_travelers" min="1" max="10" value="1" required>
            </div>
            
            <div class="form-group">
                <label for="total_amount">Total Amount (₹)</label>
                <input type="number" id="total_amount" name="total_amount" min="1000" step="100" value="5000" required>
            </div>
            
            <button type="submit" name="submit_booking">Book Now</button>
        </form>
    </div>
    
    <script>
        // Calculate total amount based on package and number of travelers
        document.getElementById('package_name').addEventListener('change', calculateTotal);
        document.getElementById('num_travelers').addEventListener('input', calculateTotal);
        
        function calculateTotal() {
            const packageSelect = document.getElementById('package_name');
            const numTravelers = parseInt(document.getElementById('num_travelers').value) || 1;
            let basePrice = 0;
            
            switch(packageSelect.value) {
                case 'Adventure Package':
                    basePrice = 7500;
                    break;
                case 'Beach Vacation':
                    basePrice = 6000;
                    break;
                case 'Mountain Retreat':
                    basePrice = 8000;
                    break;
                case 'City Explorer':
                    basePrice = 5500;
                    break;
                case 'Cultural Tour':
                    basePrice = 7000;
                    break;
                default:
                    basePrice = 5000;
            }
            
            const total = basePrice * numTravelers;
            document.getElementById('total_amount').value = total;
        }
    </script>
</body>
</html>