<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Product.php';

function handleCheckout(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('checkout.php'); return; }
    if (!isLoggedIn()) { redirect('login.php'); return; }

    $cart = $_SESSION['cart'] ?? [];
    if (empty($cart)) {
        flash('error', 'Your cart is empty.', 'danger');
        redirect('cart.php'); return;
    }

    $fullName = trim($_POST['full_name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $delivery = $_POST['delivery_option'] ?? 'delivery';
    $payment = $_POST['payment_method'] ?? 'mpesa';

    if (!$fullName || !$phone || !$address) {
        flash('error', 'All checkout fields are required.', 'danger');
        redirect('checkout.php'); return;
    }

    $total = 0;
    foreach ($cart as $item) {
        $total += $item['price'] * $item['qty'];
    }

    $orderId = Order::create(currentUserId(), $fullName, $phone, $address, $delivery, $payment, $total);

    foreach ($cart as $item) {
        Order::addItem($orderId, $item['id'], $item['name'], $item['price'], $item['qty']);
        Product::decreaseStock($item['id'], $item['qty']);
    }

    $_SESSION['cart'] = [];
    flash('success', 'Order #' . $orderId . ' placed successfully!', 'success');
    redirect('order_view.php?id=' . $orderId);
}
