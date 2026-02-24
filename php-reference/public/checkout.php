<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../includes/auth_guard.php';
require_once __DIR__ . '/../controllers/order_controller.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') { handleCheckout(); }

$pageTitle = 'Checkout';
$cart = $_SESSION['cart'] ?? [];
if (empty($cart)) { flash('error', 'Cart is empty.', 'danger'); redirect('cart.php'); }
$total = 0;
foreach ($cart as $item) { $total += $item['price'] * $item['qty']; }

include __DIR__ . '/../includes/header.php';
?>
<section class="container auth-section">
    <div class="auth-card" style="max-width:500px;">
        <h2>Checkout</h2>
        <p>Total: <strong>KSH <?= number_format($total, 0) ?></strong></p>
        <form method="POST">
            <?= csrfField() ?>
            <label>Full Name</label>
            <input type="text" name="full_name" required value="<?= e($_SESSION['user_name'] ?? '') ?>">
            <label>Phone</label>
            <input type="text" name="phone" required placeholder="07XXXXXXXX">
            <label>Delivery Address</label>
            <textarea name="address" required rows="3"></textarea>
            <label>Delivery Option</label>
            <select name="delivery_option">
                <option value="delivery">Home Delivery</option>
                <option value="pickup">Store Pickup</option>
            </select>
            <label>Payment Method</label>
            <select name="payment_method">
                <option value="mpesa">📱 M-Pesa (Simulated)</option>
                <option value="cod">💵 Cash on Delivery</option>
            </select>
            <button type="submit" class="btn btn-accent" style="width:100%;margin-top:16px;">Place Order</button>
        </form>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
