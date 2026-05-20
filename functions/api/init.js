export async function onRequestPost(context) {
  const { env } = context;
  try {
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nik TEXT,
        rw TEXT NOT NULL,
        rt TEXT,
        gem_id TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'Aktif',
        nik_valid INTEGER DEFAULT 1,
        keterangan TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_rw ON members(rw);
      CREATE INDEX IF NOT EXISTS idx_gem_id ON members(gem_id);
      CREATE INDEX IF NOT EXISTS idx_nik ON members(nik);
      CREATE INDEX IF NOT EXISTS idx_status ON members(status);
    `);

    const samples = [
      { nama: "Farah Aulia", nik: "3175091405870014", rw: "01", rt: "01", status: "Aktif", nik_valid: 1 },
      { nama: "Siti Jumantik", nik: "3175091405870018", rw: "02", rt: "03", status: "Aktif", nik_valid: 1 },
      { nama: "Budi Santoso", nik: "3175091405870020", rw: "01", rt: "02", status: "Aktif", nik_valid: 1 },
      { nama: "Iis Nurjanahh", nik: "31750914058700XX", rw: "03", rt: "01", status: "Nonaktif", nik_valid: 0, keterangan: "NIK invalid - tidak terdaftar" },
      { nama: "Hety Nurhaety", nik: "31750914058700YY", rw: "03", rt: "02", status: "Nonaktif", nik_valid: 0, keterangan: "NIK invalid - tidak terdaftar" },
    ];

    for (const s of samples) {
      const gemId = await generateUniqueGemId(env.DB, s.nama, s.nik);
      await env.DB.prepare(`INSERT OR IGNORE INTO members (nama, nik, rw, rt, gem_id, status, nik_valid, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(s.nama, s.nik, s.rw, s.rt, gemId, s.status, s.nik_valid, s.keterangan || "").run();
    }

    return jsonResponse({ success: true, message: "Database initialized + 5 sample records inserted" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestGet(context) {
  return jsonResponse({ message: "POST ke endpoint ini untuk inisialisasi database", note: "Hanya jalankan sekali saat setup awal" });
}

async function generateUniqueGemId(db, nama, nik) {
  const namaDepan = nama.trim().split(/\s+/)[0].toUpperCase();
  const nikLast4 = nik.replace(/\D/g, "").slice(-4).padStart(4, "0") || "0000";
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