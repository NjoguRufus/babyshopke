<?php
require_once __DIR__ . '/../config/db.php';

class Order {
    public static function create(int $userId, string $fullName, string $phone, string $address, string $deliveryOption, string $paymentMethod, float $total): int {
        $db = getDB();
        $stmt = $db->prepare('INSERT INTO orders (user_id, full_name, phone, address, delivery_option, payment_method, total) VALUES (:uid, :name, :phone, :addr, :del, :pay, :total)');
        $stmt->execute([
            ':uid' => $userId, ':name' => $fullName, ':phone' => $phone,
            ':addr' => $address, ':del' => $deliveryOption, ':pay' => $paymentMethod, ':total' => $total
        ]);
        return (int)$db->lastInsertId();
    }

    public static function addItem(int $orderId, int $productId, string $productName, float $price, int $qty): void {
        $db = getDB();
        $stmt = $db->prepare('INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (:oid, :pid, :pname, :price, :qty)');
        $stmt->execute([':oid' => $orderId, ':pid' => $productId, ':pname' => $productName, ':price' => $price, ':qty' => $qty]);
    }

    public static function getByUser(int $userId): array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM orders WHERE user_id = :uid ORDER BY created_at DESC');
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetchAll();
    }

    public static function getAll(): array {
        $db = getDB();
        return $db->query('SELECT * FROM orders ORDER BY created_at DESC')->fetchAll();
    }

    public static function getById(int $id): ?array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM orders WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public static function getItems(int $orderId): array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM order_items WHERE order_id = :oid');
        $stmt->execute([':oid' => $orderId]);
        return $stmt->fetchAll();
    }

    public static function updateStatus(int $id, string $status): bool {
        $db = getDB();
        $stmt = $db->prepare('UPDATE orders SET status = :status WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }
}
