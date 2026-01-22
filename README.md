<div align="center">

# 🤖 VerBotX - Tele

<img src="https://cdn.ferdev.my.id/assets/elfar/elfar-1769095327825.jpeg" alt="VerBotX - Tele" width="600"/>

</div>

---

## 📖 Overview

**VerBotX - Tele** adalah Telegram Bot yang dikembangkan menggunakan library **Telegraf**.  
Project ini difokuskan pada kestabilan, struktur kode yang terorganisir, serta kemudahan pengembangan jangka panjang.

---

## 🧰 Technology Stack

- 🟢 **Node.js**
- 🤖 **Telegraf**
- 📦 **ECMAScript Module (ESM)**
- 🌐 **ExpressJS**
- 🧩 **Modular plugin-based architecture**

---

## ✨ Features

- 🧩 Sistem command modular
- 🗂️ Struktur kode rapi dan mudah dipelihara
- 🔗 Integrasi API eksternal
- ⚡ Respons cepat dan ringan
- 🔧 Mudah dikembangkan sesuai kebutuhan

---

## 🛠️ Pre-Installation Requirements

Pastikan environment sudah memenuhi spesifikasi berikut sebelum menjalankan bot:

- 🟢 **Node.js** v20.x atau lebih baru  
- 📦 **npm** v10.x atau lebih baru  
- 🔐 Token Bot Telegram dari **@BotFather**

Cek versi Node.js dan npm:
```bash
node -v
npm -v
```

## ⚙️ Installation

### 📥 Clone Repository
```bash
git clone https://github.com/username/VerBotX-Tele
cd VerBotX-Tele
```
### 📦 Install Dependencies
``` java
npm install
```

### 🔐 Environment Configuration
buka file `config.js` lalu edit bagian 
``` javascript
// Dapetin token bot kalian di @BotFather
global.token = "";
// nama mu bebas
global.ownername = "Feri Pratama";
// ini bisa diisi pas bot nya udah start, pake command /getmyid
global.ownerid = "";
// ini sama
global.premid = "";
```
untuk bagian apikey 
```javascript
// INI JANGAN DIGANTI
global.APIs = {
  ferdev: "https://api.ferdev.my.id",
};

/*
* WAJIB BIAR FITUR BOT BISA NORMAL!
* registrasi di https://api.ferdev.my.id/register
* lalu pergi ke https://api.ferdev.my.id/profile
* Salin Apikey Kalian lalu Tempel dibawah
*/
global.ferr = "TEMPEL_DISINI";
```

### ▶️ Run Application
```bash
npm start
```

### ℹ️ Additional Information
- dokumentasi api [docs](https://api.ferdev.my.id/docs)
- grup komunitas [WhatsApp](https://api.ferdev.my.id/community)

---

## 🌐 API & Web Access
Selain berjalan sebagai Telegram Bot, **VerBotX - Tele** juga telah menggunakan **Express.js**, sehingga bot dapat diakses melalui endpoint HTTP.

Hal ini memungkinkan:
- Monitoring status bot melalui browser atau API client
- Integrasi dengan sistem eksternal
- Deployment yang lebih fleksibel (server, VPS, atau cloud)

### Contoh Response `GET IP:PORT/`

Saat bot berhasil dijalankan, endpoint akan mengembalikan response seperti berikut:

```json
{
  "success": true,
  "status": 200,
  "author": "Feri",
  "message": "Bot Successfully Activated"
}
```

### 📚 Plugin System
semua file plugins ada di dalam folder `/plugins` semua file plugins harus memiliki struktur setidaknya seperti : 
```javascript
const handler = async (m, { conn }) => {
  // Kode Kamu di Sini
}

// ini yang nanti muncul di list kategori
handler.help = ['example']
// ini muncul di sub menu kategori
handler.tags = ['category']
// perintah fitur
handler.command = /^(example)$/i

export default handler
```
### 👨‍💻 Creating a Plugin
1. buat file `.js` baru di dalam folder `/plugins`
2. ikuti struktur dasar di atas

contoh plugins :
```javascript
const handler = async (m, { conn }) => {
  await m.reply('Hallo! ini adalah contoh plugins')
}

handler.help = ['hi']
handler.tags = ['main']
handler.command = /^(hello|hi)$/i

export default handler
```

---

### 🤝 Contributing

Kontribusi untuk **VerBotX - Tele** sangat terbuka.  
Agar kolaborasi berjalan dengan baik, silakan perhatikan poin berikut:

1. Fork repository ini dan buat branch baru untuk setiap perubahan.
2. Pastikan kode mengikuti struktur dan standar yang sudah ada.
3. Tambahkan dokumentasi jika diperlukan.
4. Lakukan pengujian sebelum mengajukan perubahan.
5. Ajukan Pull Request dengan deskripsi singkat dan jelas.

Setiap kontribusi akan ditinjau sebelum digabungkan ke branch utama.

---

### 📄 License

Project ini menggunakan **MIT License**.

Lisensi ini mengizinkan siapa pun untuk menggunakan, menyalin, memodifikasi, dan mendistribusikan project ini, termasuk untuk keperluan komersial, dengan syarat menyertakan pemberitahuan hak cipta dan lisensi asli.

Project ini disediakan apa adanya tanpa jaminan apa pun.

### 🙏 Special Thanks
- [Erlan (Betabotz)](https://github.com/ERLANRAHMAT)
- [ShirokamiRyzen](https://github.com/ShirokamiRyzen)
- dan kalian semua yang memakai dan berkontribusi untuk projek ini
