<?php require __DIR__ . '/bootstrap.php';
if (!empty($_SESSION['admin_id']))
    go();
$error = '';
if (requestPost()) {
    try {
        csrf();
        $email = strtolower(trim((string) ($_POST['email'] ?? '')));
        $password = (string) ($_POST['password'] ?? '');
        $s = db()->prepare("SELECT id,password_hash FROM users WHERE email=? AND role='admin'");
        $s->execute([$email]);
        $u = $s->fetch();
        if (!$u || !password_verify($password, $u['password_hash'])) {
            usleep(300000);
            throw new RuntimeException('Invalid email or password.');
        }
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $u['id'];
        go();
    } catch (Throwable $ex) {
        $error = $ex->getMessage();
    }
} ?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Admin login · Shabeena Studio</title><link rel="stylesheet" href="assets/admin.css"></head><body class="loginbody"><form class="loginbox" method="post"><div class="brand">SHABEENA <span>STUDIO</span><small>Administration</small></div><h1>Welcome back</h1><p>Sign in with your admin account.</p><?php if (
    $error
): ?><div class="error"><?= e($error) ?></div><?php endif; ?><input type="hidden" name="csrf" value="<?= e(
    token(),
) ?>"><label>Email<input name="email" type="email" required autocomplete="username"></label><label>Password<input name="password" type="password" required autocomplete="current-password"></label><button class="btn" type="submit">Sign in</button></form></body></html>
