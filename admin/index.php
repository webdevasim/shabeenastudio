<?php require __DIR__ . '/bootstrap.php';
admin();
$stats = [
    'products' => db()->query('SELECT COUNT(*) FROM products')->fetchColumn(),
    'orders' => db()->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
    'customers' => db()->query("SELECT COUNT(*) FROM users WHERE role='customer'")->fetchColumn(),
    'revenue' => db()
        ->query(
            "SELECT COALESCE(SUM(total_paise),0) FROM orders WHERE status IN ('paid','processing','shipped','delivered')",
        )
        ->fetchColumn(),
];
$orders = db()
    ->query('SELECT public_id,customer_name,total_paise,status,created_at FROM orders ORDER BY created_at DESC LIMIT 8')
    ->fetchAll();
layout('Dashboard', 'index.php'); ?><div class="stats"><article><small>Products</small><strong><?= e(
    $stats['products'],
) ?></strong></article><article><small>Orders</small><strong><?= e(
    $stats['orders'],
) ?></strong></article><article><small>Customers</small><strong><?= e(
    $stats['customers'],
) ?></strong></article><article><small>Paid order value</small><strong><?= price(
    $stats['revenue'],
) ?></strong></article></div><section class="panel"><div class="panelhead"><h2>Recent orders</h2><a class="btn ghost" href="orders.php">View all</a></div><div class="tablewrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody><?php foreach ($orders as $o): ?><tr><td><?= e(substr(
    $o['public_id'],
    0,
    12,
)) ?></td><td><?= e($o['customer_name']) ?></td><td><?= price($o['total_paise']) ?></td><td><span class="status"><?= e(
    $o['status'],
) ?></span></td><td><?= e(
    $o['created_at'],
) ?></td></tr><?php endforeach; ?></tbody></table></div></section><?php endLayout();
