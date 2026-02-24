<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../models/Product.php';

function handleProductCreate(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('admin/products.php'); return; }

    $data = [
        ':name' => trim($_POST['name'] ?? ''),
        ':description' => trim($_POST['description'] ?? ''),
        ':price' => (float)($_POST['price'] ?? 0),
        ':image_url' => trim($_POST['image_url'] ?? '') ?: 'https://placehold.co/300x300/FFF7F2/1F2933?text=Product',
        ':category' => trim($_POST['category'] ?? ''),
        ':stock' => (int)($_POST['stock'] ?? 0),
        ':age_min_months' => (int)($_POST['age_min_months'] ?? 0),
        ':age_max_months' => (int)($_POST['age_max_months'] ?? 48),
    ];

    if (!$data[':name'] || !$data[':category'] || $data[':price'] <= 0) {
        flash('error', 'Name, category, and valid price are required.', 'danger');
        redirect('admin/products.php'); return;
    }

    Product::create($data);
    flash('success', 'Product created successfully!', 'success');
    redirect('admin/products.php');
}

function handleProductUpdate(int $id): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('admin/product_edit.php?id=' . $id); return; }

    $data = [
        ':name' => trim($_POST['name'] ?? ''),
        ':description' => trim($_POST['description'] ?? ''),
        ':price' => (float)($_POST['price'] ?? 0),
        ':image_url' => trim($_POST['image_url'] ?? ''),
        ':category' => trim($_POST['category'] ?? ''),
        ':stock' => (int)($_POST['stock'] ?? 0),
        ':age_min_months' => (int)($_POST['age_min_months'] ?? 0),
        ':age_max_months' => (int)($_POST['age_max_months'] ?? 48),
    ];

    Product::update($id, $data);
    flash('success', 'Product updated successfully!', 'success');
    redirect('admin/products.php');
}

function handleProductDelete(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken()) { redirect('admin/products.php'); return; }
    $id = (int)($_POST['product_id'] ?? 0);
    Product::delete($id);
    flash('success', 'Product deleted.', 'success');
    redirect('admin/products.php');
}
