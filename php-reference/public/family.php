<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../includes/auth_guard.php';
require_once __DIR__ . '/../models/Family.php';
require_once __DIR__ . '/../controllers/family_controller.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') { handleFamilyCreate(); }

$pageTitle = 'Family & Children';
$family = Family::getUserFamily(currentUserId());
$children = $family ? Family::getChildren($family['id']) : [];
include __DIR__ . '/../includes/header.php';
?>
<section class="container auth-section">
    <div class="auth-card" style="max-width:550px;">
        <h2>Family Account</h2>
        <?php if (!$family): ?>
            <h3>Create a Family</h3>
            <form method="POST">
                <?= csrfField() ?>
                <input type="hidden" name="action" value="create_family">
                <label>Family Name</label>
                <input type="text" name="family_name" required placeholder="e.g. The Wanjikus">
                <button type="submit" class="btn btn-primary">Create Family</button>
            </form>
            <hr style="margin:24px 0;">
            <h3>Or Join a Family</h3>
            <form method="POST">
                <?= csrfField() ?>
                <input type="hidden" name="action" value="join_family">
                <label>Invite Code</label>
                <input type="text" name="invite_code" required placeholder="e.g. A1B2C3D4">
                <button type="submit" class="btn btn-outline">Join</button>
            </form>
        <?php else: ?>
            <p><strong>Family:</strong> <?= e($family['name']) ?></p>
            <p><strong>Invite Code:</strong> <code><?= e($family['invite_code']) ?></code> (share with family members)</p>

            <hr style="margin:24px 0;">
            <h3>Children</h3>
            <?php if (empty($children)): ?>
                <p>No children added yet.</p>
            <?php else: ?>
                <?php foreach ($children as $child): ?>
                    <div class="child-card">
                        <strong><?= e($child['child_name']) ?></strong>
                        <span>DOB: <?= date('d M Y', strtotime($child['date_of_birth'])) ?></span>
                        <span>Age: <?= Family::childAgeMonths($child['date_of_birth']) ?> months</span>
                        <form method="POST" style="display:inline;">
                            <?= csrfField() ?>
                            <input type="hidden" name="action" value="select_child">
                            <input type="hidden" name="child_id" value="<?= $child['id'] ?>">
                            <button type="submit" class="btn-sm <?= ($_SESSION['active_child_id'] ?? 0) == $child['id'] ? 'active' : '' ?>">
                                <?= ($_SESSION['active_child_id'] ?? 0) == $child['id'] ? '✓ Active' : 'Select' ?>
                            </button>
                        </form>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>

            <hr style="margin:24px 0;">
            <h3>Add Child</h3>
            <form method="POST">
                <?= csrfField() ?>
                <input type="hidden" name="action" value="add_child">
                <label>Child Name</label>
                <input type="text" name="child_name" required>
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" required>
                <button type="submit" class="btn btn-accent">Add Child</button>
            </form>
        <?php endif; ?>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
