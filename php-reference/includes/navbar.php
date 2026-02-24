<header>
    <nav class="navbar">
        <div class="nav-container">
            <a href="<?= SITE_URL ?>/index.php" class="logo">
                <span class="logo-baby">Baby Shop</span><span class="logo-shop"> KE</span>
            </a>
            <form class="search-bar" action="<?= SITE_URL ?>/index.php" method="GET">
                <input type="text" name="q" placeholder="Search for products..." value="<?= e($_GET['q'] ?? '') ?>">
                <button type="submit">🔍</button>
            </form>
            <div class="nav-icons">
                <a href="<?= SITE_URL ?>/cart.php" class="cart-link">
                    🛒 <span class="badge"><?= cartCount() ?></span>
                </a>
                <?php if (isLoggedIn()): ?>
                    <a href="<?= SITE_URL ?>/family.php">👨‍👩‍👧</a>
                    <a href="<?= SITE_URL ?>/orders.php">📦</a>
                    <?php if (isAdmin()): ?>
                        <a href="<?= SITE_URL ?>/admin/dashboard.php">⚙️</a>
                    <?php endif; ?>
                    <a href="<?= SITE_URL ?>/logout.php">Logout</a>
                <?php else: ?>
                    <a href="<?= SITE_URL ?>/login.php">Login</a>
                    <a href="<?= SITE_URL ?>/register.php">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
    <div class="announcement-bar">🚚 Free Shipping on orders over KSH 5,000 🇰🇪</div>
</header>
