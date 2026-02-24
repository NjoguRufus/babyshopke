<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../controllers/auth_controller.php';
handleRegister();
$pageTitle = 'Register';
include __DIR__ . '/../includes/header.php';
?>
<section class="auth-section">
    <div class="auth-card">
        <h2>Create Account</h2>
        <form method="POST">
            <?= csrfField() ?>
            <label>Full Name</label>
            <input type="text" name="full_name" required maxlength="100">
            <label>Email</label>
            <input type="email" name="email" required maxlength="255">
            <label>Phone</label>
            <input type="text" name="phone" maxlength="20" placeholder="07XXXXXXXX">
            <label>Password (min 8 chars)</label>
            <input type="password" name="password" required minlength="8">
            <label>Confirm Password</label>
            <input type="password" name="confirm_password" required>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <p>Already have an account? <a href="login.php">Login</a></p>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
