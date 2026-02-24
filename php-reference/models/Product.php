<?php
require_once __DIR__ . '/../config/db.php';

class Product {
    public static function getAll(?string $category = null, ?string $search = null): array {
        $db = getDB();
        $sql = 'SELECT * FROM products WHERE 1=1';
        $params = [];

        if ($category) {
            $sql .= ' AND category = :category';
            $params[':category'] = $category;
        }
        if ($search) {
            $sql .= ' AND name LIKE :search';
            $params[':search'] = '%' . $search . '%';
        }
        $sql .= ' ORDER BY created_at DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getByAgeRange(int $minMonths, int $maxMonths, int $limit = 8): array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM products WHERE age_min_months <= :max AND age_max_months >= :min ORDER BY created_at DESC LIMIT :limit');
        $stmt->bindValue(':min', $minMonths, PDO::PARAM_INT);
        $stmt->bindValue(':max', $maxMonths, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): int {
        $db = getDB();
        $stmt = $db->prepare('INSERT INTO products (name, description, price, image_url, category, stock, age_min_months, age_max_months) VALUES (:name, :description, :price, :image_url, :category, :stock, :age_min_months, :age_max_months)');
        $stmt->execute($data);
        return (int)$db->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $db = getDB();
        $data[':id'] = $id;
        $stmt = $db->prepare('UPDATE products SET name=:name, description=:description, price=:price, image_url=:image_url, category=:category, stock=:stock, age_min_months=:age_min_months, age_max_months=:age_max_months WHERE id=:id');
        return $stmt->execute($data);
    }

    public static function delete(int $id): bool {
        $db = getDB();
        $stmt = $db->prepare('DELETE FROM products WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    public static function decreaseStock(int $id, int $qty): bool {
        $db = getDB();
        $stmt = $db->prepare('UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty');
        return $stmt->execute([':id' => $id, ':qty' => $qty]);
    }
}
