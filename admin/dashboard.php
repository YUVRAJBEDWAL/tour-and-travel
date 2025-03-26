<?php
session_start();
require_once '../db_connect.php';

// Check if user is logged in
if(!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}

// Get statistics
$stats = [
    'total_bookings' => 0,
    'total_users' => 0,
    'total_messages' => 0,
    'pending_bookings' => 0
];

// Get total bookings
$bookingsQuery = "SELECT COUNT(*) as count FROM bookings";
$result = $conn->query($bookingsQuery);
if($result && $row = $result->fetch_assoc()) {
    $stats['total_bookings'] = $row['count'];
}

// Get pending bookings
$pendingQuery = "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'";
$result = $conn->query($pendingQuery);
if($result && $row = $result->fetch_assoc()) {
    $stats['pending_bookings'] = $row['count'];
}

// Get total users
$usersQuery = "SELECT COUNT(*) as count FROM users WHERE username != 'admin'";
$result = $conn->query($usersQuery);
if($result && $row = $result->fetch_assoc()) {
    $stats['total_users'] = $row['count'];
}

// Get total messages
$messagesQuery = "SELECT COUNT(*) as count FROM contact_messages";
$result = $conn->query($messagesQuery);
if($result && $row = $result->fetch_assoc()) {
    $stats['total_messages'] = $row['count'];
}

// Get recent bookings
$recentBookingsQuery = "SELECT b.id, b.package_name, b.travel_date, b.num_travelers, b.total_amount, b.status, u.full_name as user_name 
                        FROM bookings b 
                        JOIN users u ON b.user_id = u.id 
                        ORDER BY b.booking_date DESC 
                        LIMIT 5";
$recentBookings = $conn->query($recentBookingsQuery);

// Get recent messages
$recentMessagesQuery = "SELECT id, fullname, subject, created_at, is_read 
                        FROM contact_messages 
                        ORDER BY created_at DESC 
                        LIMIT 5";
$recentMessages = $conn->query($recentMessagesQuery);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Tour & Travel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #219150;
            --dark: #333;
            --light: #f4f4f4;
        }
        
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }

        .sidebar {
            background: var(--dark);
            color: white;
            padding: 1rem;
        }

        .main-content {
            padding: 2rem;
            background: var(--light);
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-card i {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .stat-card h3 {
            margin: 0;
            font-size: 1rem;
            color: #666;
        }
        
        .stat-card p {
            margin: 0.5rem 0 0;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--dark);
        }

        .content-section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .section-header {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .section-header h2 {
            margin: 0;
            font-size: 1.2rem;
        }
        
        .view-all {
            color: var(--primary);
            text-decoration: none;
            font-size: 0.9rem;
        }

        .nav-links {
            list-style: none;
            padding: 0;
            margin-top: 2rem;
        }

        .nav-links li {
            margin-bottom: 1rem;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background 0.3s;
        }

        .nav-links a:hover, .nav-links a.active {
            background: rgba(255,255,255,0.1);
        }

        .nav-links i {
            margin-right: 0.5rem;
            width: 20px;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        th {
            background: #f9f9f9;
            font-weight: 600;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-confirmed {
            background: #d4edda;
            color: #155724;
        }
        
        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-completed {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .unread {
            font-weight: bold;
        }

        .user-info {
            display: flex;
            align-items: center;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.5rem;
            font-weight: bold;
        }
        
        .logout-btn {
            background: transparent;
            color: white;
            border: 1px solid white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logout-btn:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .logout-btn i {
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2><i class="fas fa-hiking"></i> Tour & Travel</h2>
        
        <ul class="nav-links">
            <li><a href="#" class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="bookings.php"><i class="fas fa-calendar-check"></i> Bookings</a></li>
            <li><a href="users.php"><i class="fas fa-users"></i> Users</a></li>
            <li><a href="messages.php"><i class="fas fa-envelope"></i> Messages</a></li>
            <li><a href="packages.php"><i class="fas fa-box"></i> Packages</a></li>
            <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
        </ul>
        
        <form action="logout.php" method="POST">
            <button type="submit" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </form>
    </div>

    <div class="main-content">
        <div class="dashboard-header">
            <h1>Dashboard</h1>
            <div class="user-info">
                <div class="user-avatar"><?php echo strtoupper(substr($_SESSION['admin_username'], 0, 1)); ?></div>
                <div>
                    <div><?php echo $_SESSION['admin_username']; ?></div>
                    <small>Administrator</small>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <i class="fas fa-calendar-check"></i>
                <h3>Total Bookings</h3>
                <p><?php echo $stats['total_bookings']; ?></p>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <h3>Total Users</h3>
                <p><?php echo $stats['total_users']; ?></p>
            </div>
            <div class="stat-card">
                <i class="fas fa-envelope"></i>
                <h3>Total Messages</h3>
                <p><?php echo $stats['total_messages']; ?></p>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <h3>Pending Bookings</h3>
                <p><?php echo $stats['pending_bookings']; ?></p>
            </div>
        </div>

        <div class="content-section">
            <div class="section-header">
                <h2>Recent Bookings</h2>
                <a href="bookings.php" class="view-all">View All <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Package</th>
                        <th>Travel Date</th>
                        <th>Travelers</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($recentBookings && $recentBookings->num_rows > 0): ?>
                        <?php while($booking = $recentBookings->fetch_assoc()): ?>
                            <tr>
                                <td>#<?php echo $booking['id']; ?></td>
                                <td><?php echo htmlspecialchars($booking['user_name']); ?></td>
                                <td><?php echo htmlspecialchars($booking['package_name']); ?></td>
                                <td><?php echo date('M d, Y', strtotime($booking['travel_date'])); ?></td>
                                <td><?php echo $booking['num_travelers']; ?></td>
                                <td>₹<?php echo number_format($booking['total_amount'], 2); ?></td>
                                <td>
                                    <span class="status-badge status-<?php echo $booking['status']; ?>">
                                        <?php echo ucfirst($booking['status']); ?>
                                    </span>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="7" style="text-align: center;">No bookings found</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <div class="content-section">
            <div class="section-header">
                <h2>Recent Messages</h2>
                <a href="messages.php" class="view-all">View All <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($recentMessages && $recentMessages->num_rows > 0): ?>
                        <?php while($message = $recentMessages->fetch_assoc()): ?>
                            <tr class="<?php echo $message['is_read'] ? '' : 'unread'; ?>">
                                <td>#<?php echo $message['id']; ?></td>
                                <td><?php echo htmlspecialchars($message['fullname']); ?></td>
                                <td><?php echo htmlspecialchars($message['subject']); ?></td>
                                <td><?php echo date('M d, Y', strtotime($message['created_at'])); ?></td>
                                <td>
                                    <?php if($message['is_read']): ?>
                                        <span class="status-badge status-completed">Read</span>
                                    <?php else: ?>
                                        <span class="status-badge status-pending">Unread</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="5" style="text-align: center;">No messages found</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>