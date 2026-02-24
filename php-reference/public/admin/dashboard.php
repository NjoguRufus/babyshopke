<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../includes/auth_guard.php';
require_once __DIR__ . '/../../includes/admin_guard.php';
require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../models/Order.php';

$pageTitle = 'Admin Dashboard';
$totalProducts = count(Product::getAll());
$totalOrders = count(Order::getAll());
include __DIR__ . '/../../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>⚙️ Admin Dashboard</h2>
    <div class="category-grid" style="max-width:600px;">
        <div class="category-card"><span class="cat-icon">📦</span><span><?= $totalProducts ?> Products</span></div>
        <div class="category-card"><span class="cat-icon">🧾</span><span><?= $totalOrders ?> Orders</span></div>
    </div>
    <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="products.php" class="btn btn-primary">Manage Products</a>
        <a href="orders.php" class="btn btn-outline">Manage Orders</a>
    </div>
</section>
<?php include __DIR__ . '/../../includes/footer.php'; ?>
