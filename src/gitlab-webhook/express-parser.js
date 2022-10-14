/**
 * @param {import("express").Request} request
 */
export function expressParser(request) {
  const token = request.headers["x-gitlab-token"];
  const event = request.headers["x-gitlab-event"];
  const payload = Object.assign({}, { event }, request.body);

  return { token, event, payload };
}
