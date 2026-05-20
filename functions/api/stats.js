export async function onRequestGet(context) {
  const { env } = context;
  try {
    const totalResult = await env.DB.prepare("SELECT COUNT(*) as total FROM members").first();
    const total = totalResult?.total || 0;
    const rwResult = await env.DB.prepare("SELECT rw, COUNT(*) as count FROM members GROUP BY rw ORDER BY rw").all();
    const nikResult = await env.DB.prepare("SELECT nik_valid, COUNT(*) as count FROM members GROUP BY nik_valid").all();
    const statusResult = await env.DB.prepare("SELECT status, COUNT(*) as count FROM members GROUP BY status").all();
    const rtResult = await env.DB.prepare("SELECT rt, COUNT(*) as count FROM members WHERE rt IS NOT NULL GROUP BY rt ORDER BY count DESC LIMIT 5").all();

    return jsonResponse({
      success: true,
      stats: {
        total,
        perRW: rwResult.results || [],
        nikValidity: nikResult.results || [],
        perStatus: statusResult.results || [],
        topRT: rtResult.results || []
      }
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}export async function onRequestGet(context) {
  const { env } = context;
  try {
    const totalResult = await env.DB.prepare("SELECT COUNT(*) as total FROM members").first();
    const total = totalResult?.total || 0;
    const rwResult = await env.DB.prepare("SELECT rw, COUNT(*) as count FROM members GROUP BY rw ORDER BY rw").all();
    const nikResult = await env.DB.prepare("SELECT nik_valid, COUNT(*) as count FROM members GROUP BY nik_valid").all();
    const statusResult = await env.DB.prepare("SELECT status, COUNT(*) as count FROM members GROUP BY status").all();
    const rtResult = await env.DB.prepare("SELECT rt, COUNT(*) as count FROM members WHERE rt IS NOT NULL GROUP BY rt ORDER BY count DESC LIMIT 5").all();

    return jsonResponse({
      success: true,
      stats: {
        total,
        perRW: rwResult.results || [],
        nikValidity: nikResult.results || [],
        perStatus: statusResult.results || [],
        topRT: rtResult.results || []
      }
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}