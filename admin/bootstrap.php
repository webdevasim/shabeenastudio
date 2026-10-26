<?php

declare(strict_types=1);

ini_set('display_errors', '0');
$envPath = dirname(__DIR__) . '/php-api/.env';

function config(string $key, string $default = ''): string
{
    global $envPath;
    static $settings = null;
    if ($settings === null) {
        $settings = [];
        if (is_file($envPath))
            foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if (!$line || $line[0] === '#' || !str_contains($line, '='))
                    continue;
                [$k, $v] = explode('=', $line, 2);
                $settings[trim($k)] = trim($v, " \t\n\r\0\x0B\"'");
            }
    }
    return getenv($key) ?: $settings[$key] ?? $default;
}


function db(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $host = config('DB_HOST', '127.0.0.1');
    $port = config('DB_PORT', '3307');
    $name = config('DB_NAME', 'shabeena');
    $user = config('DB_USER', 'root');
    $pass = config('DB_PASS', '');

    return $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}

$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('shabeena_admin');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => $https,
        'samesite' => 'Strict',
        'path' => rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/admin/login.php')), '/') . '/',
    ]);
    session_start();
}
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');
function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function go(string $page = 'index.php'): never
{
    header('Location: ' . $page, true, 303);
    exit();
}

function token(): string
{
    return $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}

function csrf(): void
{
    if (!hash_equals(token(), (string) ($_POST['csrf'] ?? '')))
        throw new RuntimeException('Invalid form token. Refresh and retry.');
}

function admin(): array
{
    if (empty($_SESSION['admin_id']))
        go('login.php');
    $s = db()->prepare("SELECT id,name,email,role FROM users WHERE id=? AND role='admin'");
    $s->execute([$_SESSION['admin_id']]);
    $u = $s->fetch();
    if (!$u) {
        $_SESSION = [];
        go('login.php');
    }
    return $u;
}

function flash(string $message): void
{
    $_SESSION['flash'] = $message;
}

function layout(string $title, string $active = ''): void
{
    $user = admin();
    $flash = $_SESSION['flash'] ?? null;
    unset(
        $_SESSION['flash'],
    ); ?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title><?= e(
        $title,
    ) ?> · Shabeena Admin</title><link rel="stylesheet" href="assets/admin.css"></head><body><div class="shell"><aside class="sidebar"><div class="brand">SHABEENA <span>STUDIO</span><small>Store administration</small></div><nav><?php foreach ([
        'index.php' => 'Dashboard',
        'products.php' => 'Products',
        'orders.php' => 'Orders',
        'users.php' => 'Users',
    ] as $url => $label): ?><a class="<?= $active === $url ? 'active' : '' ?>" href="<?= e($url) ?>"><?= e(
        $label,
    ) ?></a><?php endforeach; ?></nav><form action="logout.php" method="post"><input type="hidden" name="csrf" value="<?= e(
        token(),
    ) ?>"><button class="logout">Sign out</button></form></aside><main class="main"><header class="top"><div><div class="eyebrow">SHABEENA / ADMIN</div><h1><?= e(
        $title,
    ) ?></h1></div><div class="userpill"><?= e($user['name']) ?></div></header><?php if (
        $flash
    ): ?><div class="notice"><?= e($flash) ?></div><?php endif; ?><?php
}

function endLayout(): void
{
    echo '</main></div><script src="assets/admin.js" defer></script></body></html>';
}

function price(mixed $paise): string
{
    return '₹' . number_format((int) $paise / 100, 2);
}

function intPrice(string $value): int
{
    if (!preg_match('/^\d+(\.\d{1,2})?$/', $value))
        throw new RuntimeException('Enter a valid INR price.');
    return (int) round((float) $value * 100);
}

function requestPost(): bool
{
    return $_SERVER['REQUEST_METHOD'] === 'POST';
}

function failSafe(callable $action): void
{
    try {
        csrf();
        $action();
    } catch (Throwable $ex) {
        flash($ex instanceof PDOException ? 'Database update failed. Check for duplicate values.' : $ex->getMessage());
        go(basename($_SERVER['PHP_SELF']));
    }
}
