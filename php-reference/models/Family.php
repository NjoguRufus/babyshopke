<?php
require_once __DIR__ . '/../config/db.php';

class Family {
    public static function create(string $name, int $ownerId): int {
        $db = getDB();
        $code = strtoupper(substr(md5(uniqid()), 0, 8));
        $stmt = $db->prepare('INSERT INTO families (name, owner_id, invite_code) VALUES (:name, :owner, :code)');
        $stmt->execute([':name' => $name, ':owner' => $ownerId, ':code' => $code]);
        $familyId = (int)$db->lastInsertId();

        // Add owner as member
        $stmt2 = $db->prepare('INSERT INTO family_members (family_id, user_id, role) VALUES (:fid, :uid, "owner")');
        $stmt2->execute([':fid' => $familyId, ':uid' => $ownerId]);
        return $familyId;
    }

    public static function joinByCode(string $code, int $userId): bool {
        $db = getDB();
        $stmt = $db->prepare('SELECT id FROM families WHERE invite_code = :code');
        $stmt->execute([':code' => $code]);
        $family = $stmt->fetch();
        if (!$family) return false;

        $stmt2 = $db->prepare('INSERT IGNORE INTO family_members (family_id, user_id) VALUES (:fid, :uid)');
        return $stmt2->execute([':fid' => $family['id'], ':uid' => $userId]);
    }

    public static function getUserFamily(int $userId): ?array {
        $db = getDB();
        $stmt = $db->prepare('SELECT f.* FROM families f JOIN family_members fm ON f.id = fm.family_id WHERE fm.user_id = :uid LIMIT 1');
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetch() ?: null;
    }

    public static function addChild(int $familyId, string $name, string $dob): int {
        $db = getDB();
        $stmt = $db->prepare('INSERT INTO children (family_id, child_name, date_of_birth) VALUES (:fid, :name, :dob)');
        $stmt->execute([':fid' => $familyId, ':name' => $name, ':dob' => $dob]);
        return (int)$db->lastInsertId();
    }

    public static function getChildren(int $familyId): array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM children WHERE family_id = :fid ORDER BY date_of_birth DESC');
        $stmt->execute([':fid' => $familyId]);
        return $stmt->fetchAll();
    }

    public static function getChild(int $id): ?array {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM children WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public static function childAgeMonths(string $dob): int {
        $birth = new DateTime($dob);
        $now = new DateTime();
        $diff = $now->diff($birth);
        return ($diff->y * 12) + $diff->m;
    }
}
