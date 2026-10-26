# Shabeena Studio — Next.js + PHP API

This repository is a **migration starter**, not a finished production store. The original Google AI Studio visual components are preserved. It includes a Next.js App Router shell and a PHP/MySQL API for authentication, product reading, order creation and Razorpay payment verification.

## Frontend

Requirements: Node.js 20.9+ (use a current LTS release).

```bash
npm install
cp .env.example .env.local
npm run dev
```

The `/` storefront retains the original screen-based navigation; `/customize`, `/shop`, and `/shop/[slug]` are initial App Router routes. The original components still read catalog data from `src/data/products.ts`; these must be migrated to the PHP product service and seeded into MySQL before real checkout works. The existing customizer is not yet fully persisted to the backend.

## PHP API

Requirements: PHP 8.1+, PDO MySQL, cURL, MySQL 8+. Configure Apache's document root to `php-api/public` and place `php-api/.env` outside the public root.

1. Import `php-api/sql/schema.sql` into a new MySQL database.
2. Copy `php-api/.env.example` to `php-api/.env` and supply credentials and Razorpay **test** keys.
3. Serve `php-api/public` as document root (for local development: `php -S localhost:8000 -t php-api/public php-api/public/index.php`; note the PHP built-in server may need a router script for non-file paths).
4. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api` in `.env.local`.
5. Configure Razorpay webhook endpoint `/api/payments/razorpay/webhook` with the same webhook secret.

### Implemented API routes

`GET /api/health`, `GET /api/products`, `GET /api/products/{id}`, `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `POST /api/payments/razorpay/create-order`, `POST /api/payments/razorpay/verify`, `POST /api/payments/razorpay/webhook`, `GET /api/orders`, `GET /api/orders/{public_id}`, `GET /api/admin/orders`.

### Important limitations before production

- **No products are seeded**: insert products and size/color/GSM variants into MySQL. The backend will correctly reject cart variants it cannot price from MySQL.
- **Custom artwork checkout is deliberately blocked** until design assets, price rules and safe server-side design storage exist. Never trust client-submitted artwork pricing.
- Admin product CRUD, full customer dashboard, design asset uploads, stock reservations, refund flows, and persistent browser authentication are **not implemented**.
- Payment verification requires a captured Razorpay payment. Razorpay webhooks are idempotently recorded, but order fulfillment/inventory adjustment requires additional transactional handling.
- The existing coupon UI is only a client-side demo and **does not affect backend prices**.
- Bearer token auth is implemented on the API but frontend account pages are not yet wired up; use secure storage/session strategy before production.
- Configure HTTPS, rate limits, backups, webhook retries, and operational monitoring before taking live payments.
- Run `npm run build` and end-to-end payment tests before deployment; this package has not been fully tested in a deployed environment.
# shabeenastudio
# shabeenastudio
# shabeenastudio
# shabeenastudio
# shabeenastudio
