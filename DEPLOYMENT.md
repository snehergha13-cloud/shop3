# Deploying Word Of Art (shop3)

This app is a Next.js storefront with a full backend: products & inventory,
email/password login, a per-user cart, an order system, and an admin panel.
This guide gets it live on the internet.

---

## 1. What you need before you start

| Thing | Why | Cost |
|---|---|---|
| A [Vercel](https://vercel.com) account | Hosts the Next.js app | Free tier is enough |
| A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account | Hosts the database (Vercel doesn't host databases) | Free tier (M0) is enough |
| A [GitHub](https://github.com) account | Vercel deploys from a Git repo | Free |

You do **not** need Razorpay yet — checkout currently supports Cash on
Delivery, and the Razorpay option is shown as "coming soon" in the UI.

---

## 2. Set up the database (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster** — any region close to your users is fine.
3. Under **Database Access**, create a database user with a username and password (save these).
4. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`). This is required because Vercel's servers don't have a fixed IP.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name to the end of it, e.g. `.../wordofart?retryWrites=true...` — this becomes your `MONGODB_URI`.

---

## 3. Push the code to GitHub

```bash
cd shop3
git init                     # skip if this is already a git repo
git add .
git commit -m "Add auth, cart, orders, and admin panel"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

## 4. Deploy to Vercel

1. Go to https://vercel.com/new and import your GitHub repo.
2. Vercel auto-detects Next.js — leave the build settings as default.
3. Before clicking Deploy, open **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | the connection string from step 2 |
   | `JWT_SECRET` | any long random string — generate one with `openssl rand -base64 32` |
   | `SEED_ADMIN_EMAIL` | the email you want for your admin login |
   | `SEED_ADMIN_PASSWORD` | a temporary password — change it after first login |
   | `NEXT_PUBLIC_SITE_URL` | your Vercel URL, e.g. `https://your-app.vercel.app` (add after first deploy, then redeploy) |

4. Click **Deploy**. After it finishes, you'll get a live URL like `https://your-app.vercel.app`.

---

## 5. Load sample products & create your admin account (seeding)

The project ships with a one-time seed endpoint that populates categories,
collections, and products, and creates your first admin account. This is
the **only** way an admin account gets created — there's no signup
checkbox for "make me an admin" (intentionally, for security), so you run
this once after every fresh deploy / fresh database.

### Run the seed

Once your app is deployed (or running locally), call the seed endpoint with
a single POST request and no body:

```bash
curl -X POST https://your-app.vercel.app/api/seed
```

For local development, the same thing, just against localhost:
```bash
curl -X POST http://localhost:3000/api/seed
```

If you don't have `curl` handy, you can also just open
`https://your-app.vercel.app/api/seed` in a tool like Postman/Insomnia and
send a POST request, or run this in your browser's console while on the
site:
```js
fetch("/api/seed", { method: "POST" }).then(r => r.json()).then(console.log);
```

### What seeding does

- Wipes and recreates the sample categories, collections, and products defined in `pages/api/seed.js` (so it's safe to use on a fresh store, but see the warning below).
- Creates one admin account, using the email/password from your `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` environment variables.
  - If you didn't set those variables, it defaults to: `admin@wordofart.test` / `ChangeMe123!`
  - If an admin with that email already exists, seeding leaves it untouched (it will never overwrite an existing admin's password).

You'll see a JSON response confirming what was created, e.g.:
```json
{
  "success": true,
  "data": {
    "message": "Seeded 2 categories, 4 collections and 11 products. Admin account created: admin@wordofart.test / ChangeMe123! — change this password after first login."
  }
}
```

### Log in as admin

Go to `https://your-app.vercel.app/login` (or `/login` locally), sign in
with the admin email/password from above, then click the account icon in
the navbar → **Admin Panel** (or go directly to `/admin`).

**Change the admin password immediately** after your first login. There's
no settings page UI for this yet, but the API supports it — open your
browser console while logged in as admin and run:
```js
fetch("/api/auth-me", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("woa_token")}`,
  },
  body: JSON.stringify({
    currentPassword: "ChangeMe123!", // or whatever SEED_ADMIN_PASSWORD was
    newPassword: "your-new-strong-password",
  }),
}).then(r => r.json()).then(console.log);
```

> ⚠️ **Don't run `/api/seed` again on a live store once you have real
> products or orders.** It deletes and recreates all categories,
> collections, and products from scratch — any edits you made in the admin
> panel (price changes, new products, stock levels) would be wiped. It will
> NOT touch existing orders, and will NOT re-create or reset the admin
> account if one already exists, so it's safe to accidentally re-run from
> an auth standpoint — just not from a catalog standpoint.

---

## 6. Adding Razorpay later

The checkout page already has a disabled "Pay Online (Razorpay)" option and
the `Order` model already has `paymentMethod` / `paymentStatus` / `paymentId`
fields ready to go. When you're ready:

1. `npm install razorpay`
2. Create a `pages/api/payments/create-order.js` that creates a Razorpay
   order for the cart total, and a `pages/api/payments/verify.js` that
   verifies the payment signature Razorpay sends back.
3. In `pages/checkout.js`, enable the disabled radio option and, when
   selected, call Razorpay's Checkout.js widget instead of immediately
   POSTing to `/api/orders` — create the order with `paymentStatus: "unpaid"`
   first, open Razorpay's payment popup, then PATCH the order to
   `paymentStatus: "paid"` (via `/api/orders/[id]`, already supports this)
   once Razorpay confirms.
4. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to your environment variables.

---

## 7. Moving to a different host later

Everything here is standard Next.js + MongoDB, so it isn't locked to Vercel:
- Any Node.js host that supports Next.js (Render, Railway, Fly.io, a VPS with `next start`) works the same way — just set the same environment variables.
- MongoDB Atlas works from anywhere, since it's a separate hosted service — you don't need to move the database when you move the app.
- The only Vercel-specific thing in this project is... nothing! There's no `vercel.json` or Vercel-only API. You can deploy this anywhere Next.js runs.

---

## Quick local development

```bash
cp .env.example .env.local
# fill in MONGODB_URI and JWT_SECRET in .env.local
npm install
npm run dev
# then, once: curl -X POST http://localhost:3000/api/seed
```

Open http://localhost:3000, and http://localhost:3000/admin once logged in
as the seeded admin account.
