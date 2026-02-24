<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth_guard.php';
require_once __DIR__ . '/../models/Order.php';

$id = (int)($_GET['id'] ?? 0);
$order = Order::getById($id);
if (!$order || ($order['user_id'] !== currentUserId() && !isAdmin())) {
    flash('error', 'Order not found.', 'danger'); redirect('orders.php');
}
$items = Order::getItems($id);
$pageTitle = 'Order #' . $id;
include __DIR__ . '/../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>Order #<?= $id ?></h2>
    <p><strong>Status:</strong> <span class="status-badge status-<?= $order['status'] ?>"><?= ucfirst($order['status']) ?></span></p>
    <p><strong>Name:</strong> <?= e($order['full_name']) ?></p>
    <p><strong>Phone:</strong> <?= e($order['phone']) ?></p>
    <p><strong>Address:</strong> <?= e($order['address']) ?></p>
    <p><strong>Delivery:</strong> <?= ucfirst($order['delivery_option']) ?></p>
    <p><strong>Payment:</strong> <?= $order['payment_method'] === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery' ?></p>
    <table class="cart-table">
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
        <tbody>
        <?php foreach ($items as $item): ?>
            <tr>
                <td><?= e($item['product_name']) ?></td>
                <td>KSH <?= number_format($item['price'], 0) ?></td>
                <td><?= $item['quantity'] ?></td>
                <td>KSH <?= number_format($item['price'] * $item['quantity'], 0) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <p><strong>Total: KSH <?= number_format($order['total'], 0) ?></strong></p>
    <a href="orders.php" class="btn btn-outline">← Back to Orders</a>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
