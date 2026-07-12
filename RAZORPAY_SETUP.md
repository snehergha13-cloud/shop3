# Razorpay setup

The checkout now supports both Cash on Delivery and Razorpay Standard Checkout.

## 1. Get your Razorpay keys

1. Sign in to the Razorpay Dashboard.
2. Switch to **Test Mode** while testing.
3. Open **Account & Settings → API Keys** and generate a key pair.
4. Copy the **Key ID** and **Key Secret** immediately. Razorpay only shows the secret when it is generated.

## 2. Add the environment variables

Create or update `.env.local` in the project root:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

Keep `RAZORPAY_KEY_SECRET` server-side. Do not rename it with `NEXT_PUBLIC_` and do not commit `.env.local`.

For Vercel, open **Project → Settings → Environment Variables**, add the same two names and values, select the environments you use, then redeploy.

## 3. Test the checkout

1. Run `npm run dev`.
2. Add a product to the cart and sign in.
3. At checkout, choose **Pay Online (Razorpay)**.
4. Complete a Test Mode payment and confirm the order appears under **My Account → Orders** with payment status `paid`.

## 4. Go live

1. Complete Razorpay account activation/KYC.
2. In the Razorpay Dashboard, switch to **Live Mode** and generate Live Mode API keys.
3. Replace both environment-variable values with the live keys and redeploy.
4. Make one small real payment and confirm the payment and local order appear correctly.

The server creates the Razorpay order, verifies the returned HMAC signature, checks the Razorpay amount against the current cart, and only then creates the website order and reduces stock.
