# Deploying Word Of Art (shop3)

This app is a Next.js storefront with a full backend: products & inventory,
email/password + Google login, a per-user cart, an order system, and an
admin panel. This guide gets it live on the internet.

---

## 1. What you need before you start

| Thing | Why | Cost |
|---|---|---|
| A [Vercel](https://vercel.com) account | Hosts the Next.js app | Free tier is enough |
| A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account | Hosts the database (Vercel doesn't host databases) | Free tier (M0) is enough |
| A [GitHub](https://github.com) account | Vercel deploys from a Git repo | Free |
| (Optional) A [Google Cloud](https://console.cloud.google.com) project | Only needed for "Sign in with Google" | Free |

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
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | leave blank for now, or fill in from step 6 below |
   | `SEED_ADMIN_EMAIL` | the email you want for your admin login |
   | `SEED_ADMIN_PASSWORD` | a temporary password — change it after first login |
   | `NEXT_PUBLIC_SITE_URL` | your Vercel URL, e.g. `https://your-app.vercel.app` (add after first deploy, then redeploy) |

4. Click **Deploy**. After it finishes, you'll get a live URL like `https://your-app.vercel.app`.

---

## 5. Load sample products & create your admin account

The project ships with a one-time seed endpoint that populates categories,
collections, and products, and creates your first admin account.

Run this once against your deployed URL:

```bash
curl -X POST https://your-app.vercel.app/api/seed
```

This will:
- Create the sample categories/collections/products defined in `pages/api/seed.js`
- Create an admin account using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (or the defaults `admin@wordofart.test` / `ChangeMe123!` if you didn't set them)

Then go to `https://your-app.vercel.app/login`, sign in with that admin
account, and click the account icon in the navbar → **Admin Panel**
(or go directly to `/admin`).

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

> ⚠️ Don't run `/api/seed` again on a live store once you have real
> products/orders — it deletes all existing products/categories/collections
> first. It will NOT touch existing orders or re-create the admin account
> if one already exists.

---

## 6. (Optional) Enable "Sign in with Google"

If you skip this, the app works fine — the Google button just shows a small
"not configured yet" notice instead of a working button.

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a project (or pick an existing one).
3. Click **Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Authorized JavaScript origins: add your Vercel URL, e.g. `https://your-app.vercel.app` (and `http://localhost:3000` for local dev)
   - You do **not** need to set a redirect URI — this app uses Google Identity Services' one-tap/button flow, not the redirect flow.
4. Copy the **Client ID** (looks like `xxxxx.apps.googleusercontent.com`).
5. In Vercel → Project Settings → Environment Variables, set:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   ```
6. Redeploy (Vercel → Deployments → ⋯ → Redeploy) so the new env var takes effect.

The "Continue with Google" button will now appear on `/login` and `/signup`.

---

## 7. Adding Razorpay later

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

## 8. Moving to a different host later

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
