<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/csrf.php';
require_once __DIR__ . '/../../includes/auth_guard.php';
require_once __DIR__ . '/../../includes/admin_guard.php';
require_once __DIR__ . '/../../models/Order.php';

$id = (int)($_GET['id'] ?? 0);
$order = Order::getById($id);
if (!$order) { flash('error', 'Order not found.', 'danger'); redirect('orders.php'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verifyCsrfToken()) {
    $status = $_POST['status'] ?? '';
    if (in_array($status, ['pending','paid','shipped','delivered','cancelled'])) {
        Order::updateStatus($id, $status);
        flash('success', 'Order status updated.', 'success');
        redirect('order_update.php?id=' . $id);
    }
}

$items = Order::getItems($id);
$pageTitle = 'Order #' . $id;
include __DIR__ . '/../../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>Order #<?= $id ?></h2>
    <p><strong>Customer:</strong> <?= e($order['full_name']) ?> | <?= e($order['phone']) ?></p>
    <p><strong>Address:</strong> <?= e($order['address']) ?></p>
    <p><strong>Total:</strong> KSH <?= number_format($order['total'], 0) ?></p>

    <form method="POST" style="margin:16px 0;">
        <?= csrfField() ?>
        <label><strong>Update Status:</strong></label>
        <select name="status">
            <?php foreach (['pending','paid','shipped','delivered','cancelled'] as $s): ?>
                <option <?= $order['status'] === $s ? 'selected' : '' ?>><?= $s ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit" class="btn btn-primary btn-sm">Update</button>
    </form>

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
    <a href="orders.php" class="btn btn-outline">← Back</a>
</section>
<?php include __DIR__ . '/../../includes/footer.php'; ?>
