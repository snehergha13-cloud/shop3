const buckets = new Map();

function getClientKey(req, scope) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : String(forwardedFor || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  return `${scope}:${ip}`;
}

export function applyRateLimit(req, res, { scope = "default", limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const key = getClientKey(req, scope);
  const current = buckets.get(key);

  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  current.count += 1;
  buckets.set(key, current);

  if (current.count > limit) {
    const retryAfter = Math.ceil((current.expiresAt - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({ success: false, error: "Too many requests. Please try again later." });
    return false;
  }

  return true;
}
