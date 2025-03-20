<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Tour & Travel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
        }
        .dashboard-container {
            display: flex;
            min-height: 100vh;
        }
        .sidebar {
            width: 250px;
            background: #219150;
            color: white;
            padding: 20px;
        }
        .main-content {
            flex: 1;
            padding: 20px;
        }
        .sidebar h2 {
            margin-bottom: 30px;
        }
        .nav-item {
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
        }
        .nav-item:hover {
            background: #1a7340;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
            color: #219150;
            margin-bottom: 10px;
        }
        .logout-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .logout-btn:hover {
            background: #c82333;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="sidebar">
            <h2>Admin Panel</h2>
            <div class="nav-item"><i class="fas fa-home"></i> Dashboard</div>
            <div class="nav-item"><i class="fas fa-users"></i> Users</div>
            <div class="nav-item"><i class="fas fa-box"></i> Packages</div>
            <div class="nav-item"><i class="fas fa-book"></i> Bookings</div>
            <div class="nav-item"><i class="fas fa-cog"></i> Settings</div>
        </div>
        <div class="main-content">
            <button class="logout-btn" onclick="location.href='logout.php'">Logout</button>
            <h1>Welcome, Admin</h1>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Bookings</h3>
                    <p>250</p>
                </div>
                <div class="stat-card">
                    <h3>Active Users</h3>
                    <p>1,234</p>
                </div>
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <p>₹1,23,456</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>