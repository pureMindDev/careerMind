/** Thin helpers so every controller shapes success responses the same way. */

export function ok(res, data, status = 200) {
  return res.status(status).json(data);
}

export function created(res, data) {
  return ok(res, data, 201);
}

export function noContent(res) {
  return res.status(204).end();
}
