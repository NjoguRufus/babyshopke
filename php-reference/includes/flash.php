<?php $f = getFlash('success'); if ($f): ?>
<div style="background:#d4edda;color:#155724;padding:12px 16px;border-radius:8px;margin:8px 0;font-size:14px;"><?= e($f['message']) ?></div>
<?php endif; $f = getFlash('error'); if ($f): ?>
<div style="background:#f8d7da;color:#721c24;padding:12px 16px;border-radius:8px;margin:8px 0;font-size:14px;"><?= e($f['message']) ?></div>
<?php endif; ?>
