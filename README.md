# GEMPAR App - Cloudflare Pages + D1

## Gerakan Pilah Sampah Warakas
Aplikasi manajemen anggota Jumantik dengan 14 RW.

## Quick Deploy

### 1. Buat D1 Database
- Cloudflare Dashboard → Workers & Pages → D1 → Create Database
- Nama: `gempar-db`

### 2. Connect GitHub
- Workers & Pages → Create Project → Pages → Connect GitHub
- Pilih repo `gempar-app`

### 3. Bind D1
- Project Settings → Functions → D1 Database Bindings
- Variable name: `DB`, pilih database `gempar-db`

### 4. Init Database
- Buka URL project → klik "⚙️ Init DB" sekali

## API Endpoints
- POST `/api/init` - Setup DB
- GET `/api/members` - List anggota
- POST `/api/members` - Tambah anggota
- GET/PUT/DELETE `/api/member/:id` - Detail/Update/Hapus
- GET `/api/stats` - Statistik
- POST `/api/import` - Import CSV

## Format GEM-ID
`NamaDepan-4digitNIK` (contoh: FARAH-0014)