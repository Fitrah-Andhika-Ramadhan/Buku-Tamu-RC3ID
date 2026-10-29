# Integrasi Zoom dan Google Calendar

## Alur

- Zoom mengirim `meeting.created`, `meeting.updated`, dan event penghapusan ke `POST /webhooks/zoom`.
- Webhook diverifikasi memakai secret token Zoom dan tanda tangan `x-zm-signature`, lalu data di-upsert ke `zoom_schedules`.
- Meeting yang dihapus ditandai dibatalkan di tracker.
- Job antrean membuat atau memperbarui event pada kalender Google yang dipilih. Jadwal mingguan di tracker menjadi event mingguan di Google Calendar.
- Meeting Zoom mingguan satu hari tanpa batas akhir dapat dicatat sebagai rutin mingguan. Seri berulang dengan beberapa hari, interval lebih dari satu minggu, atau batas akhir dicatat sebagai kejadian berikutnya; tracker saat ini hanya mendukung satu hari rutin tanpa batas akhir per jadwal.

Sinkronisasi kalender ini berjalan satu arah dari tracker ke Google Calendar. Event yang dibuat langsung di Google Calendar belum diimpor ke tracker.

Edit atau hapus jadwal di tracker hanya memperbarui kalender, bukan meeting di Zoom. Meeting yang diedit atau dihapus di Zoom akan memperbarui status jadwal dan kalender.

## Zoom Marketplace

1. Buat atau pilih OAuth Server-to-Server app pada akun Zoom yang menyelenggarakan meeting.
2. Aktifkan Event Subscriptions, isi endpoint `https://<domain-publik>/webhooks/zoom`, dan validasi endpoint.
3. Aktifkan event `meeting.created`, `meeting.updated`, `meeting.deleted`, dan `meeting.permanently_deleted`.
4. Pilih cakupan akun agar meeting dari seluruh host dalam akun tersebut masuk, atau pilih host tertentu.
5. Salin Secret Token webhook ke environment server. Endpoint harus HTTPS dan dapat diakses Zoom.

Webhook tidak dapat dikirim langsung ke `127.0.0.1`. Pengujian lokal perlu tunnel HTTPS yang aman atau environment staging.

## Google Calendar

1. Aktifkan Google Calendar API di Google Cloud project.
2. Buat service account dan bagikan kalender tujuan kepadanya dengan izin membuat dan mengedit event.
3. Atur environment berikut di server, jangan commit nilai credential ke Git:

```env
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_WEBHOOK_SECRET_TOKEN=

GOOGLE_CALENDAR_ENABLED=true
GOOGLE_CALENDAR_ID=
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_TIMEZONE=Asia/Jakarta
```

`GOOGLE_CALENDAR_PRIVATE_KEY` menerima newline literal `\n`. Setelah mengubah environment, bersihkan cache konfigurasi Laravel.

## Deploy

1. Jalankan `php artisan migrate --force`.
2. Pastikan worker antrean aktif, misalnya `php artisan queue:work --queue=default`.
3. Pastikan domain HTTPS menerima `POST /webhooks/zoom` dan Zoom berhasil memvalidasi endpoint.
4. Aktifkan Google Calendar sync setelah kalender dan service account sudah disiapkan.

## Kredensial Zoom

Kode lama pernah memuat fallback OAuth Zoom di source. Setelah memasang integrasi ini, rotasi Client ID/Secret pada Zoom Marketplace dan isi nilai baru hanya pada environment server. Menghapus nilai lama dari source sekarang tidak menghapusnya dari commit Git terdahulu.

Jadwal lokal tetap dapat dipakai ketika Google Calendar dinonaktifkan. Jika konfigurasi kalender belum tersedia, job sync akan menyimpan kegagalan pada jadwal dan mencoba ulang.
