<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/csrf.php';
require_once __DIR__ . '/../../includes/auth_guard.php';
require_once __DIR__ . '/../../includes/admin_guard.php';
require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../controllers/product_controller.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? 'create';
    if ($act === 'delete') { handleProductDelete(); }
    else { handleProductCreate(); }
}

$pageTitle = 'Manage Products';
$products = Product::getAll();
include __DIR__ . '/../../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>Manage Products</h2>

    <h3>Add New Product</h3>
    <form method="POST" class="admin-form">
        <?= csrfField() ?>
        <input type="hidden" name="form_action" value="create">
        <div class="form-grid">
            <div><label>Name</label><input type="text" name="name" required></div>
            <div><label>Category</label>
                <select name="category" required>
                    <option value="Diapers & Wipes">Diapers & Wipes</option>
                    <option value="Feeding">Feeding</option>
                    <option value="Toys">Toys</option>
                    <option value="Clothing">Clothing</option>
                </select>
            </div>
            <div><label>Price (KSH)</label><input type="number" name="price" step="0.01" required></div>
            <div><label>Stock</label><input type="number" name="stock" required></div>
            <div><label>Age Min (months)</label><input type="number" name="age_min_months" value="0"></div>
            <div><label>Age Max (months)</label><input type="number" name="age_max_months" value="48"></div>
            <div style="grid-column:1/-1;"><label>Image URL</label><input type="url" name="image_url" placeholder="https://..."></div>
            <div style="grid-column:1/-1;"><label>Description</label><textarea name="description" rows="3"></textarea></div>
        </div>
        <button type="submit" class="btn btn-accent" style="margin-top:12px;">Add Product</button>
    </form>

    <hr style="margin:32px 0;">
    <h3>All Products (<?= count($products) ?>)</h3>
    <table class="cart-table">
        <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Age</th><th>Actions</th></tr></thead>
        <tbody>
        <?php foreach ($products as $p): ?>
            <tr>
                <td><?= $p['id'] ?></td>
                <td><?= e($p['name']) ?></td>
                <td><?= e($p['category']) ?></td>
                <td>KSH <?= number_format($p['price'], 0) ?></td>
                <td><?= $p['stock'] ?></td>
                <td><?= $p['age_min_months'] ?>–<?= $p['age_max_months'] ?>m</td>
                <td>
                    <a href="product_edit.php?id=<?= $p['id'] ?>" class="btn-sm">Edit</a>
                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this product?')">
                        <?= csrfField() ?>
                        <input type="hidden" name="form_action" value="delete">
                        <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                        <button type="submit" class="btn-sm btn-danger">Delete</button>
                    </form>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</section>
<?php include __DIR__ . '/../../includes/footer.php'; ?>
