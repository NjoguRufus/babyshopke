<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth_guard.php';
require_once __DIR__ . '/../models/Order.php';

$pageTitle = 'My Orders';
$orders = Order::getByUser(currentUserId());
include __DIR__ . '/../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>My Orders</h2>
    <?php if (empty($orders)): ?>
        <p>No orders yet. <a href="index.php">Start shopping</a></p>
    <?php else: ?>
        <table class="cart-table">
            <thead><tr><th>Order #</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
            <?php foreach ($orders as $o): ?>
                <tr>
                    <td>#<?= $o['id'] ?></td>
                    <td><?= date('d M Y', strtotime($o['created_at'])) ?></td>
                    <td>KSH <?= number_format($o['total'], 0) ?></td>
                    <td><span class="status-badge status-<?= $o['status'] ?>"><?= ucfirst($o['status']) ?></span></td>
                    <td><a href="order_view.php?id=<?= $o['id'] ?>">View</a></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
