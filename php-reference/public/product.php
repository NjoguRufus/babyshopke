<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/Product.php';

$id = (int)($_GET['id'] ?? 0);
$product = Product::getById($id);
if (!$product) { flash('error', 'Product not found.', 'danger'); redirect('index.php'); }

$pageTitle = $product['name'];
include __DIR__ . '/../includes/header.php';
?>
<section class="container" style="padding:24px 16px;">
    <div style="display:flex;gap:32px;flex-wrap:wrap;">
        <img src="<?= e($product['image_url']) ?>" alt="<?= e($product['name']) ?>" style="width:300px;height:300px;object-fit:cover;border-radius:16px;">
        <div>
            <h1><?= e($product['name']) ?></h1>
            <p class="price" style="font-size:24px;">KSH <?= number_format($product['price'], 0) ?></p>
            <p><?= e($product['description']) ?></p>
            <p><strong>Category:</strong> <?= e($product['category']) ?></p>
            <p><strong>Age Range:</strong> <?= $product['age_min_months'] ?>–<?= $product['age_max_months'] ?> months</p>
            <p><strong>Stock:</strong> <?= $product['stock'] ?> available</p>
            <form method="POST" action="index.php">
                <?= csrfField() ?>
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                <input type="hidden" name="redirect" value="product.php?id=<?= $product['id'] ?>">
                <button type="submit" class="btn btn-accent" <?= $product['stock'] <= 0 ? 'disabled' : '' ?>>
                    <?= $product['stock'] > 0 ? 'Add to Cart' : 'Out of Stock' ?>
                </button>
            </form>
        </div>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
