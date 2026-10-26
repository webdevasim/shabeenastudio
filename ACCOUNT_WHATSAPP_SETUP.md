# Customer account + WhatsApp update

## Configure

In `.env.local` set:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost/shabeena_work/php-api/public/api
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

Replace the WhatsApp number with **your** business number. Restart `npm run dev` after editing environment variables. PHP API must be running with the schema imported. Register at `/account`; log in with the account credentials. The backend already provides `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout`.

WhatsApp buttons appear on product cards, product quick-view (selected size/color/quantity), and the cart. WhatsApp messages are **inquiries only**, not persisted or paid orders. The product card button uses size L by default; choose a different size in the quick-view. Custom artwork is not attached automatically; customers must share it separately.

## Security and limitations

The frontend currently stores API bearer tokens in `sessionStorage` for this development build. Before live deployment, move to secure HttpOnly cookie sessions, CSRF protection, rate limiting, and appropriate origin controls. The account page does not yet show real order history. Existing checkout and product catalog still need full PHP API integration. The Next.js frontend and PHP API need compatible CORS configuration (`FRONTEND_ORIGIN`).
