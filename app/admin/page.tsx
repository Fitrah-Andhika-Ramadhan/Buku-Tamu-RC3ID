import { db } from "@/lib/db";
import { Users, CheckCircle2, Clock, ArrowRight, Activity, AlertTriangle, UserCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let totalRegistrants = 0;
  let totalHadir = 0;
  let totalPending = 0;
  let recentParticipants: { id: string; nama_lengkap: string; instansi: string; createdAt: Date; status_hadir: boolean }[] = [];
  let isDbError = false;

  try {
    totalRegistrants = await db.participant.count();
    totalHadir = await db.participant.count({ where: { status_hadir: true } });
    totalPending = totalRegistrants - totalHadir;
    recentParticipants = await db.participant.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, nama_lengkap: true, instansi: true, createdAt: true, status_hadir: true },
    });
  } catch (err) {
    console.error("Database connection failed in Admin Dashboard:", err);
    isDbError = true;
  }

  const hadirRate = totalRegistrants > 0 ? Math.round((totalHadir / totalRegistrants) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#253656]">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau statistik kunjungan booth B-IDEAs 2026 secara real-time.</p>
        </div>
        <Link
          href="/admin/peserta"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#BD272D] text-white rounded-xl font-bold text-sm hover:bg-[#991f24] transition-colors shadow-lg shadow-[#BD272D]/20"
        >
          <Users className="w-4 h-4" />
          Kelola Peserta
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* DB Error Banner */}
      {isDbError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="font-bold mb-1">Database Menolak Koneksi</h2>
            <p className="text-sm">Pastikan <code className="bg-red-100 px-1 rounded font-mono text-xs">DATABASE_URL</code> menggunakan <strong>localhost</strong> dan password tanpa simbol khusus (<code className="bg-red-100 px-1 rounded font-mono text-xs">@:/?#</code>), lalu Deploy ulang.</p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800">{isDbError ? "–" : totalRegistrants}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Pendaftar</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800">{isDbError ? "–" : totalHadir}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sudah Hadir</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800">{isDbError ? "–" : totalPending}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Belum Hadir</p>
          </div>
        </div>

        <div className="bg-[#253656] p-6 rounded-2xl shadow-sm flex items-center gap-4 relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-white">{isDbError ? "–" : `${hadirRate}%`}</p>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-0.5">Tingkat Hadir</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!isDbError && totalRegistrants > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#253656]" />
              <span className="font-bold text-[#253656] text-sm">Tingkat Kehadiran Booth</span>
            </div>
            <span className="text-sm font-bold text-[#BD272D]">{hadirRate}% ({totalHadir}/{totalRegistrants})</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#BD272D] to-rose-400 transition-all duration-700"
              style={{ width: `${hadirRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Grafik Peserta */}
      {!isDbError && totalRegistrants > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-[#253656]">Grafik Kehadiran</h2>
              <p className="text-xs text-slate-400 mt-0.5">Komposisi peserta hadir vs belum hadir</p>
            </div>
          </div>
          <div className="flex items-end justify-center gap-10">
            {/* Bar: Total */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-2xl font-black text-[#253656]">{totalRegistrants}</span>
              <div className="w-16 rounded-t-xl bg-gradient-to-t from-[#253656] to-[#3a5080]" style={{ height: "120px" }}></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
            </div>
            {/* Bar: Hadir */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-2xl font-black text-green-600">{totalHadir}</span>
              <div
                className="w-16 rounded-t-xl bg-gradient-to-t from-green-500 to-green-400 transition-all duration-700"
                style={{ height: `${Math.max(8, (totalHadir / totalRegistrants) * 120)}px` }}
              ></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hadir</span>
            </div>
            {/* Bar: Pending */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-2xl font-black text-orange-500">{totalPending}</span>
              <div
                className="w-16 rounded-t-xl bg-gradient-to-t from-orange-400 to-orange-300 transition-all duration-700"
                style={{ height: `${Math.max(8, (totalPending / totalRegistrants) * 120)}px` }}
              ></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#253656]"></span><span className="text-xs text-slate-500 font-medium">Total Pendaftar</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-xs text-slate-500 font-medium">Sudah Hadir</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400"></span><span className="text-xs text-slate-500 font-medium">Belum Hadir</span></div>
          </div>
        </div>
      )}


      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Registrants */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-[#253656]">Pendaftar Terbaru</h2>
            <Link href="/admin/peserta" className="text-xs font-bold text-[#BD272D] hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {isDbError ? (
              <div className="p-8 text-center text-slate-400 text-sm">Data tidak tersedia — koneksi database gagal.</div>
            ) : recentParticipants.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Belum ada pendaftar.</div>
            ) : (
              recentParticipants.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#253656]/10 flex items-center justify-center text-sm font-black text-[#253656] shrink-0">
                      {p.nama_lengkap.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{p.nama_lengkap}</p>
                      <p className="text-xs text-slate-400">{p.instansi || "–"}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${p.status_hadir ? "bg-green-50 text-green-700 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}>
                    {p.status_hadir ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {p.status_hadir ? "Hadir" : "Pending"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex flex-col gap-5">
          <div className="bg-gradient-to-br from-[#253656] to-[#1a263d] p-6 rounded-2xl shadow-sm relative overflow-hidden text-white flex-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#BD272D]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-2">RC3ID Admin Panel</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                Platform pemantauan data tamu dan validasi kehadiran peserta booth B-IDEAs 2026 secara real-time.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-200 border border-white/20">
                  ● SISTEM AKTIF
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-200 border border-white/20">
                  B-IDEAs 2026
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/peserta"
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-[#BD272D]/30 hover:shadow-md hover:bg-red-50/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#BD272D]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#BD272D]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-[#BD272D] transition-colors">Kelola Data Peserta</h3>
                <p className="text-xs text-slate-500 mt-0.5">Lihat daftar, cari, dan validasi kehadiran</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#BD272D] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
