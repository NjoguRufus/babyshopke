<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../models/User.php';

function handleRegister(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('register.php'); return; }

    $name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm_password'] ?? '';

    if (!$name || !$email || !$password) {
        flash('error', 'All fields are required.', 'danger');
        redirect('register.php'); return;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        flash('error', 'Invalid email address.', 'danger');
        redirect('register.php'); return;
    }
    if (strlen($password) < 8) {
        flash('error', 'Password must be at least 8 characters.', 'danger');
        redirect('register.php'); return;
    }
    if ($password !== $confirm) {
        flash('error', 'Passwords do not match.', 'danger');
        redirect('register.php'); return;
    }
    if (User::findByEmail($email)) {
        flash('error', 'Email already registered.', 'danger');
        redirect('register.php'); return;
    }

    User::create($name, $email, $password, $phone);
    flash('success', 'Registration successful! Please log in.', 'success');
    redirect('login.php');
}

function handleLogin(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('login.php'); return; }

    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        flash('error', 'Email and password are required.', 'danger');
        redirect('login.php'); return;
    }

    $user = User::findByEmail($email);
    if (!$user || !User::verifyPassword($password, $user['password_hash'])) {
        flash('error', 'Invalid email or password.', 'danger');
        redirect('login.php'); return;
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_role'] = $user['role'];
    flash('success', 'Welcome back, ' . e($user['full_name']) . '!', 'success');
    redirect($user['role'] === 'admin' ? 'admin/dashboard.php' : 'index.php');
}

function handleLogout(): void {
    session_destroy();
    session_start();
    flash('success', 'You have been logged out.', 'success');
    redirect('login.php');
}
