import { db } from "@/lib/db";
import { Users, CheckCircle2, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalRegistrants = await db.participant.count();
  const totalHadir = await db.participant.count({ where: { status_hadir: true } });
  const totalPending = totalRegistrants - totalHadir;

  const statCards = [
    { title: "Total Pendaftar", value: totalRegistrants, icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Sudah Hadir", value: totalHadir, icon: CheckCircle2, color: "bg-green-50 text-green-600 border-green-100" },
    { title: "Belum Hadir", value: totalPending, icon: Clock, color: "bg-orange-50 text-orange-600 border-orange-100" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#253656]">Dashboard</h1>
        <p className="text-slate-500 mt-1">Ringkasan statistik kunjungan booth B-IDEAs 2026.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-[#253656] mb-4">Akses Cepat</h2>
          <div className="space-y-3">
            <Link href="/admin/peserta" className="block p-4 rounded-xl border border-slate-100 hover:border-[#BD272D]/30 hover:bg-red-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-[#BD272D]">Kelola Data Peserta</h3>
                  <p className="text-sm text-slate-500 mt-1">Lihat dan validasi kehadiran peserta.</p>
                </div>
                <Users className="w-6 h-6 text-slate-300 group-hover:text-[#BD272D]" />
              </div>
            </Link>
            <Link href="/admin/qr" className="block p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">QR Generator</h3>
                  <p className="text-sm text-slate-500 mt-1">Buat QR kustom (Mockup).</p>
                </div>
                <Calendar className="w-6 h-6 text-slate-300" />
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-[#253656] p-8 rounded-2xl shadow-lg relative overflow-hidden text-white flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Selamat Datang di RC3ID Admin</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Platform ini digunakan untuk memantau data tamu secara real-time dan memvalidasi penukaran merchandise di booth pameran.
            </p>
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest text-slate-200 border border-white/20">
              STATUS SISTEM: AKTIF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
