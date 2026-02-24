<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/csrf.php';
require_once __DIR__ . '/../../includes/auth_guard.php';
require_once __DIR__ . '/../../includes/admin_guard.php';
require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../controllers/product_controller.php';

$id = (int)($_GET['id'] ?? 0);
$product = Product::getById($id);
if (!$product) { flash('error', 'Product not found.', 'danger'); redirect('products.php'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') { handleProductUpdate($id); }

$pageTitle = 'Edit: ' . $product['name'];
include __DIR__ . '/../../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <h2>Edit Product</h2>
    <form method="POST" class="admin-form">
        <?= csrfField() ?>
        <div class="form-grid">
            <div><label>Name</label><input type="text" name="name" value="<?= e($product['name']) ?>" required></div>
            <div><label>Category</label>
                <select name="category" required>
                    <?php foreach (['Diapers & Wipes','Feeding','Toys','Clothing'] as $c): ?>
                        <option <?= $product['category'] === $c ? 'selected' : '' ?>><?= $c ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div><label>Price (KSH)</label><input type="number" name="price" step="0.01" value="<?= $product['price'] ?>" required></div>
            <div><label>Stock</label><input type="number" name="stock" value="<?= $product['stock'] ?>" required></div>
            <div><label>Age Min</label><input type="number" name="age_min_months" value="<?= $product['age_min_months'] ?>"></div>
            <div><label>Age Max</label><input type="number" name="age_max_months" value="<?= $product['age_max_months'] ?>"></div>
            <div style="grid-column:1/-1;"><label>Image URL</label><input type="url" name="image_url" value="<?= e($product['image_url']) ?>"></div>
            <div style="grid-column:1/-1;"><label>Description</label><textarea name="description" rows="3"><?= e($product['description']) ?></textarea></div>
        </div>
        <button type="submit" class="btn btn-accent" style="margin-top:12px;">Update Product</button>
    </form>
    <a href="products.php" class="btn btn-outline" style="margin-top:12px;">← Back</a>
</section>
<?php include __DIR__ . '/../../includes/footer.php'; ?>
