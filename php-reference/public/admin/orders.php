<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/csrf.php';
require_once __DIR__ . '/../../includes/auth_guard.php';
require_once __DIR__ . '/../../includes/admin_guard.php';
require_once __DIR__ . '/../../models/Order.php';

$pageTitle = 'Manage Orders';
$orders = Order::getAll();
include __DIR__ . '/../../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>All Orders</h2>
    <table class="cart-table">
        <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($orders as $o): ?>
            <tr>
                <td><?= $o['id'] ?></td>
                <td><?= e($o['full_name']) ?></td>
                <td>KSH <?= number_format($o['total'], 0) ?></td>
                <td><span class="status-badge status-<?= $o['status'] ?>"><?= ucfirst($o['status']) ?></span></td>
                <td><?= date('d M Y', strtotime($o['created_at'])) ?></td>
                <td><a href="order_update.php?id=<?= $o['id'] ?>">Manage</a></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</section>
<?php include __DIR__ . '/../../includes/footer.php'; ?>
