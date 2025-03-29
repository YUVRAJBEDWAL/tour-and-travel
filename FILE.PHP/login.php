<?php
session_start();
require_once 'auth.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    try {
        // Simple login for test user
        if ($email === 'test@test.com' && $password === 'test123') {
            $_SESSION['user_id'] = 1;
            $_SESSION['user_name'] = 'Test User';
            $_SESSION['is_admin'] = 0;
            
            header('Location: index.html');
            exit();
        }
        
        // Regular database check
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['is_admin'] = $user['is_admin'];
            
            if ($user['is_admin'] == 1) {
                header('Location: admin/index.php');
            } else {
                header('Location: index.html');
            }
            exit();
        } else {
            $error = "Invalid email or password";
        }
    } catch (PDOException $e) {
        $error = "Database error: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Tour & Travel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: #1e3c72;
            background-image: 
                linear-gradient(135deg, rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.8)),
                url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cpath d="M50 0l50 50-50 50L0 50z" fill="%23ffffff" fill-opacity="0.05"/%3E%3C/svg%3E');
            animation: animateBg 20s linear infinite;
            position: relative;
            overflow: hidden;
        }

        body::before,
        body::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        body::before {
            top: -100px;
            right: -100px;
            animation: float 6s ease-in-out infinite;
        }

        body::after {
            bottom: -100px;
            left: -100px;
            animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes animateBg {
            0% { background-position: 0 0; }
            100% { background-position: 100% 100%; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.1); }
        }

        .login-container {
            max-width: 400px;
            width: 90%;
            margin: 40px auto;
            padding: 40px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 35px;
        }
        
        .login-header h1 {
            font-size: 28px;
            color: #1e3c72;
            margin-bottom: 10px;
        }
        
        .form-group {
            margin-bottom: 25px;
            position: relative;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 500;
            color: #2a5298;
            font-size: 15px;
        }
        
        .form-group input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5ee;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            background-color: #f8fafc;
        }
        
        .form-group input:focus {
            border-color: #2a5298;
            box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1);
            outline: none;
        }
        
        .password-toggle {
            position: absolute;
            right: 15px;
            top: 45px;
            cursor: pointer;
            color: #64748b;
        }
        
        .btn-login {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(42, 82, 152, 0.3);
        }
        
        .error-message {
            color: #dc2626;
            background-color: #fee2e2;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: center;
            font-size: 14px;
        }
        
        .register-link {
            text-align: center;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #e1e5ee;
        }
        
        .register-link p {
            color: #64748b;
            font-size: 14px;
        }
        
        .register-link a {
            color: #1e3c72;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        .register-link a:hover {
            color: #2a5298;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Login to Tour & Travel</h1>
            <p style="color: #64748b;">Welcome back! Please login to your account</p>
        </div>
        
        <?php if (!empty($error)): ?>
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <form method="post" action="login.php">
            <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email address" required>
            </div>
            
            <div class="form-group">
                <label for="password"><i class="fas fa-lock"></i> Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                <i class="fas fa-eye password-toggle" onclick="togglePassword()"></i>
            </div>
            
            <button type="submit" class="btn-login">
                <i class="fas fa-sign-in-alt"></i> Login
            </button>
        </form>
        
        <div class="register-link">
            <p>Don't have an account? <a href="register.php">Register here</a></p>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordField = document.getElementById('password');
            const icon = document.querySelector('.password-toggle');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    </script>
</body>
</html>