<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../models/Product.php';

function handleCartAction(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('cart.php'); return; }

    $action = $_POST['action'] ?? '';
    $productId = (int)($_POST['product_id'] ?? 0);

    if (!isset($_SESSION['cart'])) $_SESSION['cart'] = [];

    switch ($action) {
        case 'add':
            $product = Product::getById($productId);
            if (!$product) { flash('error', 'Product not found.', 'danger'); break; }

            $currentQty = $_SESSION['cart'][$productId]['qty'] ?? 0;
            if ($currentQty + 1 > $product['stock']) {
                flash('error', 'Not enough stock available.', 'danger');
                break;
            }
            $_SESSION['cart'][$productId] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'price' => $product['price'],
                'image_url' => $product['image_url'],
                'qty' => $currentQty + 1,
                'stock' => $product['stock'],
            ];
            flash('success', e($product['name']) . ' added to cart!', 'success');
            break;

        case 'increase':
            if (isset($_SESSION['cart'][$productId])) {
                if ($_SESSION['cart'][$productId]['qty'] + 1 > $_SESSION['cart'][$productId]['stock']) {
                    flash('error', 'Not enough stock.', 'danger'); break;
                }
                $_SESSION['cart'][$productId]['qty']++;
            }
            break;

        case 'decrease':
            if (isset($_SESSION['cart'][$productId])) {
                $_SESSION['cart'][$productId]['qty']--;
                if ($_SESSION['cart'][$productId]['qty'] <= 0) {
                    unset($_SESSION['cart'][$productId]);
                }
            }
            break;

        case 'remove':
            unset($_SESSION['cart'][$productId]);
            flash('success', 'Item removed from cart.', 'success');
            break;

        case 'clear':
            $_SESSION['cart'] = [];
            flash('success', 'Cart cleared.', 'success');
            break;
    }

    $redirectTo = $_POST['redirect'] ?? 'cart.php';
    redirect($redirectTo);
}
