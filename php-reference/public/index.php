<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Family.php';
require_once __DIR__ . '/../controllers/cart_controller.php';

// Handle add-to-cart from homepage
if ($_SERVER['REQUEST_METHOD'] === 'POST') { handleCartAction(); }

$pageTitle = 'Home';
$category = $_GET['category'] ?? null;
$search = $_GET['q'] ?? null;
$ageTab = $_GET['age'] ?? null;

// Age filter tabs
$ageTabs = [
    '0-3'   => [0, 3],
    '3-6'   => [3, 6],
    '6-12'  => [6, 12],
    '12-18' => [12, 18],
    '2-4yr' => [24, 48],
];

// Determine recommended age range
$childAgeMonths = $_SESSION['active_child_age_months'] ?? null;
$activeChild = null;
if (isset($_SESSION['active_child_id'])) {
    $activeChild = Family::getChild($_SESSION['active_child_id']);
}

// If age tab selected, use that; else use child age; else default 6-12
if ($ageTab && isset($ageTabs[$ageTab])) {
    $ageRange = $ageTabs[$ageTab];
} elseif ($childAgeMonths !== null) {
    $ageRange = [$childAgeMonths, $childAgeMonths];
} else {
    $ageRange = [6, 12];
    $ageTab = '6-12';
}

// Products
if ($category || $search) {
    $products = Product::getAll($category, $search);
} else {
    $products = Product::getByAgeRange($ageRange[0], $ageRange[1], 12);
}

$allProducts = Product::getAll($category, $search);

include __DIR__ . '/../includes/header.php';
?>

<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1>Everything Your <span class="highlight">Baby</span> Needs in One Place</h1>
        <p>Premium quality baby products with fast delivery across Kenya</p>
        <a href="#products" class="btn btn-accent">Shop Now</a>
        <div class="payment-badges">
            <span>💳 Visa</span> <span>💳 Mastercard</span> <span>📱 M-Pesa</span>
            <small>Safe & Secure Payments</small>
        </div>
    </div>
</section>

<!-- Categories -->
<section class="categories">
    <div class="container">
        <div class="category-grid">
            <?php foreach (['Diapers & Wipes'=>'🧷','Feeding'=>'🍼','Toys'=>'🧸','Clothing'=>'👕'] as $cat => $icon): ?>
            <a href="index.php?category=<?= urlencode($cat) ?>" class="category-card <?= $category === $cat ? 'active' : '' ?>">
                <span class="cat-icon"><?= $icon ?></span>
                <span><?= e($cat) ?></span>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Age Filter -->
<section class="age-filter" id="products">
    <div class="container">
        <?php if ($activeChild): ?>
            <h2>Top Picks for <?= e($activeChild['child_name']) ?> (<?= $childAgeMonths ?> months)</h2>
        <?php else: ?>
            <h2>Top Picks by Age</h2>
            <?php if (isLoggedIn()): ?>
                <p class="prompt"><a href="family.php">Add a child profile</a> for personalized recommendations!</p>
            <?php endif; ?>
        <?php endif; ?>

        <div class="age-tabs">
            <?php foreach ($ageTabs as $label => $range): ?>
                <a href="index.php?age=<?= urlencode($label) ?>" class="age-tab <?= $ageTab === $label ? 'active' : '' ?>">
                    <?= e(str_replace('-', '–', $label)) ?> <?= str_contains($label, 'yr') ? '' : 'mo' ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Product Grid -->
<section class="products-section">
    <div class="container">
        <?php if (empty($products)): ?>
            <p class="no-results">No products found. <a href="index.php">View all</a></p>
        <?php endif; ?>
        <div class="product-grid">
            <?php foreach ($products as $p): ?>
            <div class="product-card">
                <img src="<?= e($p['image_url']) ?>" alt="<?= e($p['name']) ?>">
                <h3><?= e($p['name']) ?></h3>
                <div class="price">KSH <?= number_format($p['price'], 0) ?></div>
                <div class="rating">⭐⭐⭐⭐☆</div>
                <form method="POST" action="index.php">
                    <?= csrfField() ?>
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                    <input type="hidden" name="redirect" value="index.php<?= $_SERVER['QUERY_STRING'] ? '?' . e($_SERVER['QUERY_STRING']) : '' ?>">
                    <button type="submit" class="btn btn-accent btn-sm" <?= $p['stock'] <= 0 ? 'disabled' : '' ?>>
                        <?= $p['stock'] > 0 ? 'Add to Cart' : 'Out of Stock' ?>
                    </button>
                </form>
                <?php if ($p['stock'] > 0 && $p['stock'] <= 5): ?>
                    <small class="low-stock">Only <?= $p['stock'] ?> left!</small>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php include __DIR__ . '/../includes/footer.php'; ?>
