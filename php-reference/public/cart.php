<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../controllers/cart_controller.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') { handleCartAction(); }

$pageTitle = 'Cart';
$cart = $_SESSION['cart'] ?? [];
$total = 0;
foreach ($cart as $item) { $total += $item['price'] * $item['qty']; }

include __DIR__ . '/../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>Your Cart</h2>
    <?php if (empty($cart)): ?>
        <p>Your cart is empty. <a href="index.php">Start shopping</a></p>
    <?php else: ?>
        <table class="cart-table">
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Actions</th></tr></thead>
            <tbody>
            <?php foreach ($cart as $item): ?>
                <tr>
                    <td><img src="<?= e($item['image_url']) ?>" width="50" style="border-radius:8px;"> <?= e($item['name']) ?></td>
                    <td>KSH <?= number_format($item['price'], 0) ?></td>
                    <td><?= $item['qty'] ?></td>
                    <td>KSH <?= number_format($item['price'] * $item['qty'], 0) ?></td>
                    <td>
                        <form method="POST" style="display:inline;">
                            <?= csrfField() ?>
                            <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
                            <input type="hidden" name="action" value="increase">
                            <button type="submit" class="btn-sm">+</button>
                        </form>
                        <form method="POST" style="display:inline;">
                            <?= csrfField() ?>
                            <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
                            <input type="hidden" name="action" value="decrease">
                            <button type="submit" class="btn-sm">−</button>
                        </form>
                        <form method="POST" style="display:inline;">
                            <?= csrfField() ?>
                            <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
                            <input type="hidden" name="action" value="remove">
                            <button type="submit" class="btn-sm btn-danger">✕</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <div class="cart-summary">
            <p><strong>Total: KSH <?= number_format($total, 0) ?></strong></p>
            <form method="POST" style="display:inline;">
                <?= csrfField() ?>
                <input type="hidden" name="action" value="clear">
                <button type="submit" class="btn btn-outline">Clear Cart</button>
            </form>
            <a href="checkout.php" class="btn btn-accent">Proceed to Checkout</a>
        </div>
    <?php endif; ?>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
