<?php
require_once __DIR__ . '/../config/db.php';

class User {
    public static function findByEmail(string $email): ?array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        return $stmt->fetch() ?: null;
    }

    public static function findById(int $id): ?array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(string $fullName, string $email, string $password, string $phone = ''): int {
        $db = getDB();
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare('INSERT INTO users (full_name, email, password_hash, phone) VALUES (:name, :email, :hash, :phone)');
        $stmt->execute([':name' => $fullName, ':email' => $email, ':hash' => $hash, ':phone' => $phone]);
        return (int)$db->lastInsertId();
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}
