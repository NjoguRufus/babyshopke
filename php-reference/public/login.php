<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../controllers/auth_controller.php';
handleLogin();
$pageTitle = 'Login';
include __DIR__ . '/../includes/header.php';
?>
<section class="auth-section">
    <div class="auth-card">
        <h2>Login to Baby Shop KE</h2>
        <form method="POST">
            <?= csrfField() ?>
            <label>Email</label>
            <input type="email" name="email" required>
            <label>Password</label>
            <input type="password" name="password" required>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p>Don't have an account? <a href="register.php">Register</a></p>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
