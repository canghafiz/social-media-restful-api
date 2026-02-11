# 🏗 Architecture & Project Structure

```bash
Project ini menggunakan modular layered architecture (Controller → Service → Data/Prisma)
dengan pemisahan setiap fungsi yang ketat untuk menjaga scalability, maintainability,
dan testability dalam pengembangan aplikasi.
```

---

### 📦 High-Level Pattern

```bash
Controller → Service → PrismaService → Database
```

---

### 🎮 Controller Layer

```bash
Bertanggung jawab menangani HTTP request & response.
Tidak mengandung business logic.
Hanya memanggil service dan mengembalikan hasilnya ke client.
```

**Tujuan:**
- Menjaga controller tetap bersih
- Memudahkan unit testing
- Menghindari logic bercampur dengan transport layer (cara data komunikasi)

---

### 🧠 Service Layer

```bash
Berisi business logic utama aplikasi.
Mengelola validasi domain, otorisasi, dan proses data.
Berinteraksi dengan database melalui PrismaService.
```

**Tujuan:**
- Single source of business logic
- Mudah di-refactor tanpa mengubah controller
- Reusable untuk layer lain (GraphQL, microservice, dll)

---

### 🗄 Data Access Layer (PrismaService)

```bash
Mengelola koneksi dan interaksi ke database menggunakan Prisma ORM.
Menjadi abstraction layer antara service dan database.
```

**Tujuan:**
- Centralized database access
- Menghindari duplikasi instance Prisma
- Mudah dimock saat testing

---

### 📁 Modular Structure

```bash
src/
 ├── auth/
 ├── common/
 ├── model/
 ├── post/
 ├── user/
 ├── types/
```

---

### 🔐 auth/

```bash
Berisi JWT Guard, decorator current user, dan payload interface.
Digunakan sebagai authentication layer lintas module.
```

---

### 🧩 common/

```bash
Berisi shared service seperti PrismaService, error filter,
dan validation service yang digunakan seluruh module.
```

---

### 📦 model/

```bash
Berisi API response model dan entity mapping.
Memisahkan database schema dari response contract API.
```

---

### 📝 post/ & user/

```bash
Setiap domain memiliki module, controller, service, dan validation sendiri.
Menjaga isolasi domain dan mempermudah scaling.
```

---

### 🧬 types/

```bash
Digunakan untuk extend typing seperti Express Request
agar mendukung custom property (contoh: req.user).
```

---

## 🎯 Design Principles

```bash
- Separation of Concerns
- Single Responsibility Principle
- Dependency Injection
- Modular Monolith Architecture
- Scalable by Design
```

---

## ⚖ Trade-offs

```bash
Kelebihan:
- Maintainable
- Testable
- Scalable
- Clean structure

Kekurangan:
- Lebih banyak boilerplate
- Overkill untuk project sangat kecil
```
