export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const { members } = body;
    if (!Array.isArray(members) || members.length === 0) return jsonResponse({ success: false, error: "Data members harus berupa array" }, 400);

    const inserted = [];
    const errors = [];
    for (const m of members) {
      try {
        const { nama, nik, rw, rt, status, keterangan } = m;
        if (!nama || !rw) { errors.push({ nama: nama || "?", error: "Nama/RW kosong" }); continue; }
        let cleanNik = (nik || "").replace(/\D/g, "");
        let nikValid = 1;
        if (cleanNik && cleanNik.length !== 16) nikValid = 0;
        const gemId = await generateUniqueGemId(env.DB, nama, cleanNik);
        const result = await env.DB.prepare(`INSERT INTO members (nama, nik, rw, rt, gem_id, status, nik_valid, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
          .bind(nama, cleanNik || null, rw, rt || null, gemId, status || "Aktif", nikValid, keterangan || "").first();
        inserted.push({ id: result.id, nama, gemId });
      } catch (err) {
        errors.push({ nama: m.nama || "?", error: err.message });
      }
    }
    return jsonResponse({ success: true, message: `Berhasil import ${inserted.length} dari ${members.length} data`, inserted, errors });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

async function generateUniqueGemId(db, nama, nik) {
  const namaDepan = nama.trim().split(/\s+/)[0].toUpperCase();
  const nikLast4 = nik.slice(-4).padStart(4, "0") || "0000";
  let gemId = `${namaDepan}-${nikLast4}`;
  const existing = await db.prepare("SELECT gem_id FROM members WHERE gem_id = ?").bind(gemId).first();
  if (!existing) return gemId;
  let suffix = 1;
  while (true) {
    const newId = `${namaDepan}-${String.fromCharCode(64 + suffix)}-${nikLast4}`;
    const check = await db.prepare("SELECT gem_id FROM members WHERE gem_id = ?").bind(newId).first();
    if (!check) return newId;
    suffix++;
    if (suffix > 26) return `${namaDepan}-${Date.now()}-${nikLast4}`;
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}