export function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function created(res, data) {
  return ok(res, data, 201);
}

export function error(res, message, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

export function unauthorized(res, message = "Unauthorized") {
  return error(res, message, 401);
}

export function forbidden(res, message = "Forbidden") {
  return error(res, message, 403);
}

export function notFound(res, message = "Not found") {
  return error(res, message, 404);
}

export function serverError(res, message = "Internal server error") {
  return error(res, message, 500);
}
