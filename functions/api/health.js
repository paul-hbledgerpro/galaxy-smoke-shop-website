export function onRequestGet() {
  return Response.json({
    ok: true,
    message: "Galaxy admin API is online",
    source: "functions/api/health.js",
    time: new Date().toISOString()
  });
}