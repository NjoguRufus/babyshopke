<?php
/**
 * Site-wide configuration constants
 */

define('SITE_NAME', 'Baby Shop KE');
define('SITE_URL', 'http://localhost/babyshopke');
define('CURRENCY', 'KSH');

// Brand colors (for inline/email use)
define('COLOR_PRIMARY', '#2EC4B6');
define('COLOR_ACCENT', '#FF6B8A');
define('COLOR_BG', '#FFF7F2');
define('COLOR_TEXT', '#1F2933');

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Flash message helpers
function flash(string $key, string $message, string $type = 'info'): void {
    $_SESSION['flash'][$key] = ['message' => $message, 'type' => $type];
}

function getFlash(string $key): ?array {
    if (isset($_SESSION['flash'][$key])) {
        $flash = $_SESSION['flash'][$key];
        unset($_SESSION['flash'][$key]);
        return $flash;
    }
    return null;
}

function isLoggedIn(): bool {
    return isset($_SESSION['user_id']);
}

function isAdmin(): bool {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function currentUserId(): ?int {
    return $_SESSION['user_id'] ?? null;
}

function e(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function redirect(string $url): void {
    header('Location: ' . $url);
    exit;
}

function cartCount(): int {
    if (!isset($_SESSION['cart'])) return 0;
    return array_sum(array_column($_SESSION['cart'], 'qty'));
}
