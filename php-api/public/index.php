<?php

declare(strict_types=1);

$allowedOrigins = [
    'http://localhost:3000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}



// Mount this directory as the domain document root, not the parent containing .env.
function envv(string $key, string $default = ''): string
{
    static $env = null;
    if ($env === null) {
        $env = [];
        $file = dirname(__DIR__) . '/.env';
        if (is_file($file))
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                if (str_starts_with(trim($line), '#') || !str_contains($line, '='))
                    continue;
                [$k, $v] = explode('=', $line, 2);
                $env[trim($k)] = trim($v, " \t\n\r\0\x0B\"'");
            }
    }
    return getenv($key) ?: $env[$key] ?? $default;
}


function db(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $host = envv('DB_HOST', '127.0.0.1');
    $port = envv('DB_PORT', '3307');
    $name = envv('DB_NAME');
    $user = envv('DB_USER');
    $pass = envv('DB_PASS');

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


function respond(array $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit();
}

function body(): array
{
    $d = json_decode(file_get_contents('php://input'), true);
    if (!is_array($d))
        respond(['error' => 'Invalid JSON'], 400);
    return $d;
}

function bearer(): ?array
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer (\S+)$/', $auth, $m))
        return null;
    $s = db()->prepare(
        'SELECT u.id,u.name,u.email,u.role FROM api_tokens t JOIN users u ON u.id=t.user_id WHERE t.token_hash=? AND t.expires_at>NOW()',
    );
    $s->execute([hash('sha256', $m[1])]);
    return $s->fetch() ?: null;
}

function requiredUser(bool $admin = false): array
{
    $u = bearer();
    if (!$u)
        respond(['error' => 'Authentication required'], 401);
    if ($admin && $u['role'] !== 'admin')
        respond(['error' => 'Forbidden'], 403);
    return $u;
}

function razorpay(string $method, string $path, ?array $payload = null): array
{
    $ch = curl_init('https://api.razorpay.com/v1' . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_USERPWD => envv('RAZORPAY_KEY_ID') . ':' . envv('RAZORPAY_KEY_SECRET'),
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    ]);
    if ($payload !== null)
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($raw === false || $code < 200 || $code >= 300) {
        error_log('Razorpay request failed, HTTP ' . $code);
        respond(['error' => 'Payment provider unavailable'], 502);
    }
    return json_decode($raw, true) ?? [];
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
$origin = envv('FRONTEND_ORIGIN');
if ($origin !== '' && ($_SERVER['HTTP_ORIGIN'] ?? '') === $origin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET,POST,PATCH,OPTIONS');
    header('Vary: Origin');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
$method = $_SERVER['REQUEST_METHOD'];
$path = '/' . trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$at = strpos($path, '/api/');
if ($at !== false)
    $path = substr($path, $at + 4);
elseif ($path === '/api')
    $path = '/';
try {
    if ($method === 'GET' && $path === '/health')
        respond(['status' => 'ok']);
    if ($method === 'GET' && $path === '/products') {
        $pdo = db();

        $rows = $pdo
            ->query(
                'SELECT id,slug,title,description,category,image_url,price_paise
                 FROM products
                 WHERE active=1
                 ORDER BY created_at DESC',
            )
            ->fetchAll();

        // Include real size/color/GSM/price/stock variants in the product-list response.
        // Fetch all variants in one query rather than querying once per product.
        if ($rows) {
            $productIds = array_column($rows, 'id');
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));

            $variantStmt = $pdo->prepare(
                "SELECT id,product_id,size,color,gsm,price_paise,stock
                 FROM product_variants
                 WHERE product_id IN ($placeholders)
                 ORDER BY id ASC"
            );
            $variantStmt->execute($productIds);

            $variantsByProduct = [];
            foreach ($variantStmt->fetchAll() as $variant) {
                $variantsByProduct[$variant['product_id']][] = $variant;
            }

            foreach ($rows as &$row) {
                $row['variants'] = $variantsByProduct[$row['id']] ?? [];
            }
            unset($row);
        }

        respond(['products' => $rows]);
    }
    if ($method === 'GET' && preg_match('~^/products/([a-zA-Z0-9_-]+)$~', $path, $m)) {
        $s = db()->prepare('SELECT * FROM products WHERE (id=? OR slug=?) AND active=1');
        $s->execute([$m[1], $m[1]]);
        $p = $s->fetch();
        if (!$p)
            respond(['error' => 'Not found'], 404);
        $s = db()->prepare('SELECT * FROM product_variants WHERE product_id=?');
        $s->execute([$p['id']]);
        $p['variants'] = $s->fetchAll();
        respond(['product' => $p]);
    }
    if ($method === 'POST' && $path === '/auth/register') {
        $b = body();
        $name = trim((string) ($b['name'] ?? ''));
        $email = strtolower(trim((string) ($b['email'] ?? '')));
        $pass = (string) ($b['password'] ?? '');
        if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 10)
            respond(['error' => 'Valid name, email and password of at least 10 characters required'], 422);
        try {
            $s = db()->prepare('INSERT INTO users(name,email,password_hash) VALUES(?,?,?)');
            $s->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT)]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000')
                respond(['error' => 'Email already registered'], 409);
            throw $e;
        }
        respond(['registered' => true], 201);
    }
    if ($method === 'POST' && $path === '/auth/login') {
        $b = body();
        $s = db()->prepare('SELECT * FROM users WHERE email=?');
        $s->execute([strtolower(trim((string) ($b['email'] ?? '')))]);
        $u = $s->fetch();
        if (!$u || !password_verify((string) ($b['password'] ?? ''), $u['password_hash']))
            respond(['error' => 'Invalid credentials'], 401);
        $token = bin2hex(random_bytes(32));
        $s = db()->prepare(
            'INSERT INTO api_tokens(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 7 DAY))',
        );
        $s->execute([$u['id'], hash('sha256', $token)]);
        respond([
            'token' => $token,
            'user' => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']],
        ]);
    }
    if ($method === 'GET' && $path === '/auth/me')
        respond(['user' => requiredUser()]);
    if ($method === 'POST' && $path === '/auth/logout') {
        $u = requiredUser();
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
        $token = substr($auth, 7);
        $s = db()->prepare('DELETE FROM api_tokens WHERE token_hash=? AND user_id=?');
        $s->execute([hash('sha256', $token), $u['id']]);
        respond(['ok' => true]);
    }
    if ($method === 'POST' && $path === '/payments/razorpay/create-order') {
        $b = body();
        $items = $b['items'] ?? [];
        $customer = $b['customer'] ?? [];
        if (!is_array($items) || count($items) < 1 || count($items) > 50)
            respond(['error' => 'Invalid cart'], 422);
        foreach (['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'] as $f)
            if (!is_string($customer[$f] ?? null) || trim($customer[$f]) === '')
                respond(['error' => 'Missing customer field: ' . $f], 422);
        if (
            !filter_var($customer['email'], FILTER_VALIDATE_EMAIL)
            || !preg_match('/^[6-9][0-9]{9}$/', $customer['phone'])
            || !preg_match('/^[0-9]{6}$/', $customer['pincode'])
        )
            respond(['error' => 'Invalid contact details'], 422);
        $lines = [];
        $subtotal = 0;
        foreach ($items as $item) {
            $id = (string) ($item['productId'] ?? '');
            $qty = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);
            if (!$qty || $qty < 1 || $qty > 20)
                respond(['error' => 'Invalid quantity'], 422);
            $size = (string) ($item['size'] ?? '');
            $color = (string) ($item['colorName'] ?? '');
            $gsm = (string) ($item['gsm'] ?? '');
            // Custom orders need an approved, server-priced variant; client custom prices are never trusted.
            if (!empty($item['isCustom']))
                respond([
                    'error' => 'Custom designs require a priced variant and artwork approval before online payment',
                ], 422);
            $s = db()->prepare(
                'SELECT p.id,p.title,v.id variant_id,v.price_paise,v.stock,v.gsm FROM products p JOIN product_variants v ON v.product_id=p.id WHERE p.id=? AND p.active=1 AND v.size=? AND v.color=? AND v.gsm=?',
            );
            $s->execute([$id, $size, $color, $gsm]);
            $p = $s->fetch();
            if (!$p || $p['stock'] < $qty)
                respond(['error' => 'Product variant unavailable or insufficient stock'], 422);
            $subtotal += (int) $p['price_paise'] * $qty;
            $lines[] = [$p, $size, $color, $qty];
        }
        $shipping = $subtotal >= 149900 ? 0 : 9900;
        $total = $subtotal + $shipping;
        $publicId = bin2hex(random_bytes(16));
        $user = bearer();
        $pdo = db();
        $pdo->beginTransaction();
        try {
            $s = $pdo->prepare(
                'INSERT INTO orders(user_id,public_id,customer_name,email,phone,shipping_address,subtotal_paise,shipping_paise,total_paise) VALUES(?,?,?,?,?,?,?,?,?)',
            );
            $s->execute([
                $user['id'] ?? null,
                $publicId,
                $customer['fullName'],
                $customer['email'],
                $customer['phone'],
                json_encode($customer),
                $subtotal,
                $shipping,
                $total,
            ]);
            $oid = (int) $pdo->lastInsertId();
            $s = $pdo->prepare(
                'INSERT INTO order_items(order_id,product_id,title,size,color,gsm,quantity,unit_price_paise) VALUES(?,?,?,?,?,?,?,?)',
            );
            foreach ($lines as [$p, $size, $color, $qty])
                $s->execute([$oid, $p['id'], $p['title'], $size, $color, $p['gsm'], $qty, $p['price_paise']]);
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
        $r = razorpay('POST', '/orders', [
            'amount' => $total,
            'currency' => 'INR',
            'receipt' => $publicId,
            'notes' => ['local_order' => $publicId],
        ]);
        if (empty($r['id']))
            respond(['error' => 'Could not initialize payment'], 502);
        $s = $pdo->prepare('UPDATE orders SET razorpay_order_id=? WHERE id=?');
        $s->execute([$r['id'], $oid]);
        respond([
            'order_id' => $publicId,
            'razorpay_order_id' => $r['id'],
            'amount' => $total,
            'currency' => 'INR',
            'key_id' => envv('RAZORPAY_KEY_ID'),
        ], 201);
    }
    if ($method === 'POST' && $path === '/payments/razorpay/verify') {
        $b = body();
        $rOrder = (string) ($b['razorpay_order_id'] ?? '');
        $rPayment = (string) ($b['razorpay_payment_id'] ?? '');
        $signature = (string) ($b['razorpay_signature'] ?? '');
        if (!$rOrder || !$rPayment || !$signature)
            respond(['error' => 'Missing payment fields'], 422);
        $expected = hash_hmac('sha256', $rOrder . '|' . $rPayment, envv('RAZORPAY_KEY_SECRET'));
        if (!hash_equals($expected, $signature))
            respond(['error' => 'Invalid payment signature'], 400);
        $s = db()->prepare('SELECT id,total_paise,status FROM orders WHERE razorpay_order_id=?');
        $s->execute([$rOrder]);
        $o = $s->fetch();
        if (!$o)
            respond(['error' => 'Order not found'], 404);
        $payment = razorpay('GET', '/payments/' . rawurlencode($rPayment));
        if (
            ($payment['order_id'] ?? '') !== $rOrder
            || (int) ($payment['amount'] ?? -1) !== (int) $o['total_paise']
            || ($payment['currency'] ?? '') !== 'INR'
            || ($payment['status'] ?? '') !== 'captured'
        )
            respond(['error' => 'Payment not captured or details mismatch'], 409);
        $s = db()->prepare(
            "UPDATE orders SET status='paid',razorpay_payment_id=? WHERE id=? AND status='pending_payment'",
        );
        $s->execute([$rPayment, $o['id']]);
        respond(['verified' => true, 'order_status' => 'paid']);
    }
    if ($method === 'POST' && $path === '/payments/razorpay/webhook') {
        $raw = file_get_contents('php://input');
        $sig = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';
        if (!$sig || !hash_equals(hash_hmac('sha256', $raw, envv('RAZORPAY_WEBHOOK_SECRET')), $sig))
            respond(['error' => 'Invalid webhook signature'], 401);
        $event = json_decode($raw, true);
        $eventId = $_SERVER['HTTP_X_RAZORPAY_EVENT_ID'] ?? hash('sha256', $raw);
        $s = db()->prepare('INSERT IGNORE INTO payment_events(event_id,event_type) VALUES(?,?)');
        $s->execute([$eventId, $event['event'] ?? 'unknown']);
        if ($s->rowCount() === 0)
            respond(['ok' => true, 'duplicate' => true]);
        if (($event['event'] ?? '') === 'payment.captured') {
            $payment = $event['payload']['payment']['entity'] ?? [];
            $orderId = $payment['order_id'] ?? '';
            $s = db()->prepare('SELECT id,total_paise FROM orders WHERE razorpay_order_id=?');
            $s->execute([$orderId]);
            $o = $s->fetch();
            if (
                $o
                && (int) ($payment['amount'] ?? -1) === (int) $o['total_paise']
                && ($payment['currency'] ?? '') === 'INR'
            ) {
                $s = db()->prepare(
                    "UPDATE orders SET status='paid',razorpay_payment_id=? WHERE id=? AND status='pending_payment'",
                );
                $s->execute([$payment['id'], $o['id']]);
            }
        }
        respond(['ok' => true]);
    }
    if ($method === 'GET' && $path === '/orders') {
        $u = requiredUser();
        $s = db()->prepare(
            'SELECT id,public_id,total_paise,status,created_at FROM orders WHERE user_id=? ORDER BY id DESC',
        );
        $s->execute([$u['id']]);
        respond(['orders' => $s->fetchAll()]);
    }
    if ($method === 'GET' && preg_match('~^/orders/([a-f0-9]{32})$~', $path, $m)) {
        $u = requiredUser();
        $s = db()->prepare('SELECT * FROM orders WHERE public_id=? AND user_id=?');
        $s->execute([$m[1], $u['id']]);
        $o = $s->fetch();
        if (!$o)
            respond(['error' => 'Not found'], 404);
        $s = db()->prepare('SELECT * FROM order_items WHERE order_id=?');
        $s->execute([$o['id']]);
        $o['items'] = $s->fetchAll();
        respond(['order' => $o]);
    }
    if ($method === 'GET' && $path === '/admin/orders') {
        $u = requiredUser(true);
        respond([
            'orders' => db()
                ->query(
                    'SELECT id,public_id,customer_name,total_paise,status,created_at FROM orders ORDER BY id DESC LIMIT 200',
                )
                ->fetchAll(),
        ]);
    }
    respond(['error' => 'Route not found'], 404);
} catch (PDOException $e) {
    error_log($e->getMessage());
    respond(['error' => 'Database operation failed'], 500);
} catch (Throwable $e) {
    error_log($e->getMessage());
    respond(['error' => 'Internal server error'], 500);
}
