-- GEMPAR Database Schema
-- Deploy ke Cloudflare D1, lalu jalankan endpoint /api/init

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