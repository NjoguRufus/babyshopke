<?php if (!isLoggedIn()) { flash('error', 'Please log in.', 'danger'); redirect('login.php'); } ?>
