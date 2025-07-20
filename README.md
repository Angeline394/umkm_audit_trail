# 🧾 Sistem Audit Trail Otomatis untuk UMKM

Sistem ini dirancang khusus untuk **Usaha Mikro, Kecil, dan Menengah (UMKM)** guna:
- 🔐 Meningkatkan **integritas data keuangan**
- 📋 Mempermudah **proses audit**
- 👁️ Meningkatkan **transparansi operasional**

Audit trail dilakukan secara **otomatis** untuk setiap perubahan transaksi (📥 penambahan, ✏️ pengeditan, ❌ penghapusan), dan disimpan secara detail dalam sistem log audit.

---

## ⚙️ Teknologi yang Digunakan

### 🗄️ Database
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white) **PostgreSQL** — Database relasional kuat dan andal.
- ![pgAdmin](https://img.shields.io/badge/pgAdmin4-008bb9?logo=postgresql&logoColor=white) **pgAdmin 4** — GUI untuk mengelola PostgreSQL.

### 🧠 Backend
- ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) **Python** — Bahasa utama backend.
- ![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white) **Flask** — Micro-framework REST API.
- ![psycopg2](https://img.shields.io/badge/psycopg2-2f5d62?logo=postgresql&logoColor=white) **psycopg2** — PostgreSQL adapter for Python.
- ![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white) **Pandas** — Analisis dan manipulasi log data.
- **python-dotenv** — Mengelola environment variables.
- **Flask-CORS** — Mengaktifkan komunikasi antar domain frontend-backend.

### 🌐 Frontend
- ![React](https://img.shields.io/badge/React.js-61DAFB?logo=react&logoColor=black) **React.js** — Library antarmuka modern.
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white) **Axios** — Client HTTP untuk komunikasi API.

### 🛠️ Tools Pendukung
- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) **Node.js** & 
  ![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white) **npm** — Runtime & package manager frontend.

---

## 🚀 Fitur Utama

- ✅ **Pencatatan Otomatis**  
  Audit trail berbasis trigger PostgreSQL untuk mencatat setiap operasi `INSERT`, `UPDATE`, dan `DELETE`.

- 🔍 **Log Audit Detail**  
  Menyimpan data lengkap: data sebelum & sesudah perubahan, waktu, aksi, dan pengguna.

- 💼 **Manajemen Transaksi**  
  CRUD transaksi melalui antarmuka yang intuitif dan responsif.

- 📊 **Laporan Audit Real-time**  
  Visualisasi histori perubahan secara langsung melalui antarmuka pengguna.

- 🔧 **Teknologi Modern & Terintegrasi**  
  Menggabungkan kekuatan PostgreSQL, Python Flask, React.js, dan Pandas untuk sistem yang efisien dan scalable.

---

📁 *Untuk dokumentasi teknis dan struktur folder, silakan lihat bagian selanjutnya di README lengkap.*
