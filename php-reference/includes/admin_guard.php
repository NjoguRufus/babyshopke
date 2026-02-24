<?php if (!isAdmin()) { flash('error', 'Admin access required.', 'danger'); redirect('../login.php'); } ?>
