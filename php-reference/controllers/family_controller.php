<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/csrf.php';
require_once __DIR__ . '/../models/Family.php';

function handleFamilyCreate(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    if (!verifyCsrfToken() || !isLoggedIn()) { redirect('family.php'); return; }

    $action = $_POST['action'] ?? '';

    if ($action === 'create_family') {
        $name = trim($_POST['family_name'] ?? '');
        if (!$name) { flash('error', 'Family name is required.', 'danger'); redirect('family.php'); return; }
        Family::create($name, currentUserId());
        flash('success', 'Family created!', 'success');
    } elseif ($action === 'join_family') {
        $code = trim($_POST['invite_code'] ?? '');
        if (!$code) { flash('error', 'Invite code is required.', 'danger'); redirect('family.php'); return; }
        if (Family::joinByCode($code, currentUserId())) {
            flash('success', 'Joined family successfully!', 'success');
        } else {
            flash('error', 'Invalid invite code.', 'danger');
        }
    } elseif ($action === 'add_child') {
        $childName = trim($_POST['child_name'] ?? '');
        $dob = $_POST['date_of_birth'] ?? '';
        $family = Family::getUserFamily(currentUserId());
        if (!$family || !$childName || !$dob) {
            flash('error', 'All fields are required.', 'danger');
            redirect('family.php'); return;
        }
        Family::addChild($family['id'], $childName, $dob);
        flash('success', 'Child profile added!', 'success');
    } elseif ($action === 'select_child') {
        $childId = (int)($_POST['child_id'] ?? 0);
        $_SESSION['active_child_id'] = $childId;
        $child = Family::getChild($childId);
        if ($child) {
            $_SESSION['active_child_age_months'] = Family::childAgeMonths($child['date_of_birth']);
            flash('success', e($child['child_name']) . ' selected!', 'success');
        }
    }

    redirect('family.php');
}
