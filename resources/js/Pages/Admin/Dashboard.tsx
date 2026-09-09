import { Users, CheckCircle2, Clock, ArrowRight, Activity, AlertTriangle, UserCheck } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function AdminDashboard({
  totalRegistrants = 0,
  totalHadir = 0,
  totalPending = 0,
  recentParticipants = [],
  isDbError = false
}: {
  totalRegistrants: number;
  totalHadir: number;
  totalPending: number;
  recentParticipants: any[];
  isDbError: boolean;
}) {

  const hadirRate = totalRegistrants > 0 ? Math.round((totalHadir / totalRegistrants) * 100) : 0;

  return (
    <div className="space-y-10 font-['Outfit']">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#BD272D]/10 rounded-full blur-3xl -z-10"></div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#253656] tracking-tight">Dashboard Overview</h1>
          <p className="text-[#6C7C98] mt-2 text-sm md:text-base font-['Plus_Jakarta_Sans'] font-medium">Pantau statistik kunjungan booth B-IDEAs 2026 secara real-time.</p>
        </div>
        <Link
          href="/admin/peserta"
          className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#BD272D] to-[#991f24] text-white rounded-[1.25rem] font-bold text-sm hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#BD272D]/30 group"
        >
          <Users className="w-4 h-4" />
          <span className="tracking-wide">Kelola Peserta</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* DB Error Banner */}
      {isDbError && (
        <div className="bg-red-50/80 backdrop-blur-md border border-red-200 text-red-700 p-6 rounded-[2rem] flex items-start gap-5 shadow-sm">
          <div className="bg-white p-3 rounded-2xl shadow-sm shrink-0 border border-red-100">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="font-black text-lg mb-1 tracking-tight">Database Menolak Koneksi</h2>
            <p className="text-sm font-['Plus_Jakarta_Sans'] font-medium leading-relaxed">Pastikan <code className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-red-100 font-mono text-xs">DATABASE_URL</code> menggunakan <strong>localhost</strong> dan password tanpa simbol khusus (<code className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-red-100 font-mono text-xs">@:/?#</code>), lalu Deploy ulang.</p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-xl shadow-[#253656]/5 flex items-center gap-5 hover:shadow-2xl hover:shadow-[#253656]/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-4xl font-black text-[#253656] tracking-tighter">{isDbError ? "–" : totalRegistrants}</p>
            <p className="text-[10px] font-black text-[#6C7C98] uppercase tracking-[0.2em] mt-1">Total Pendaftar</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-xl shadow-[#253656]/5 flex items-center gap-5 hover:shadow-2xl hover:shadow-[#253656]/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-4xl font-black text-[#253656] tracking-tighter">{isDbError ? "–" : totalHadir}</p>
            <p className="text-[10px] font-black text-[#6C7C98] uppercase tracking-[0.2em] mt-1">Sudah Hadir</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-xl shadow-[#253656]/5 flex items-center gap-5 hover:shadow-2xl hover:shadow-[#253656]/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-4xl font-black text-[#253656] tracking-tighter">{isDbError ? "–" : totalPending}</p>
            <p className="text-[10px] font-black text-[#6C7C98] uppercase tracking-[0.2em] mt-1">Belum Hadir</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#253656] to-[#1a263d] p-8 rounded-[2rem] shadow-xl shadow-[#253656]/20 flex items-center gap-5 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
          <div className="w-14 h-14 rounded-[1.25rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-white tracking-tighter">{isDbError ? "–" : `${hadirRate}%`}</p>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">Tingkat Hadir</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Progress Bar */}
            {!isDbError && totalRegistrants > 0 && (
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-[#253656]/5">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg"><UserCheck className="w-5 h-5 text-blue-600" /></div>
                    <span className="font-black text-[#253656] text-lg tracking-tight">Tingkat Kehadiran Booth</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-[#BD272D] tracking-tighter">{hadirRate}%</span>
                        <span className="text-xs font-bold text-[#6C7C98] tracking-widest uppercase">{totalHadir} dari {totalRegistrants}</span>
                    </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner border border-gray-200/50">
                    <div
                    className="h-full rounded-full bg-gradient-to-r from-[#BD272D] to-rose-400 transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${hadirRate}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] translate-x-[-100%]"></div>
                    </div>
                </div>
                </div>
            )}

            {/* Grafik Peserta */}
            {!isDbError && totalRegistrants > 0 && (
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-[#253656]/5">
                <div className="flex items-center justify-between mb-10">
                    <div>
                    <h2 className="font-black text-[#253656] text-xl tracking-tight">Grafik Kehadiran</h2>
                    <p className="text-sm text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium mt-1">Komposisi peserta hadir vs belum hadir</p>
                    </div>
                </div>
                <div className="flex items-end justify-center gap-12 sm:gap-16">
                    {/* Bar: Total */}
                    <div className="flex flex-col items-center gap-4 group">
                    <span className="text-3xl font-black text-[#253656] tracking-tighter">{totalRegistrants}</span>
                    <div className="w-16 sm:w-20 rounded-t-[1.5rem] bg-gradient-to-t from-[#253656] to-[#3a5080] shadow-lg group-hover:scale-y-105 transition-transform origin-bottom" style={{ height: "140px" }}></div>
                    <span className="text-[10px] font-black text-[#6C7C98] uppercase tracking-[0.2em]">Total</span>
                    </div>
                    {/* Bar: Hadir */}
                    <div className="flex flex-col items-center gap-4 group">
                    <span className="text-3xl font-black text-green-600 tracking-tighter">{totalHadir}</span>
                    <div
                        className="w-16 sm:w-20 rounded-t-[1.5rem] bg-gradient-to-t from-green-500 to-green-400 shadow-lg group-hover:scale-y-105 transition-all duration-1000 origin-bottom"
                        style={{ height: `${Math.max(16, (totalHadir / totalRegistrants) * 140)}px` }}
                    ></div>
                    <span className="text-[10px] font-black text-[#6C7C98] uppercase tracking-[0.2em]">Hadir</span>
                    </div>
                    {/* Bar: Pending */}
                    <div className="flex flex-col items-center gap-4 group">
                    <span className="text-3xl font-black text-orange-500 tracking-tighter">{totalPending}</span>
                    <div
                        className="w-16 sm:w-20 rounded-t-[1.5rem] bg-gradient-to-t from-orange-400 to-orange-300 shadow-lg group-hover:scale-y-105 transition-all duration-1000 origin-bottom"
                        style={{ height: `${Math.max(16, (totalPending / totalRegistrants) * 140)}px` }}
                    ></div>
                    <span className="text-[10px] font-black text-[#6C7C98] uppercase tracking-[0.2em]">Pending</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-8 mt-10 pt-6 border-t border-gray-200/50">
                    <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#253656] to-[#3a5080] shadow-sm"></span><span className="text-xs text-[#6C7C98] font-bold tracking-wide uppercase">Total Pendaftar</span></div>
                    <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm"></span><span className="text-xs text-[#6C7C98] font-bold tracking-wide uppercase">Sudah Hadir</span></div>
                    <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 shadow-sm"></span><span className="text-xs text-[#6C7C98] font-bold tracking-wide uppercase">Belum Hadir</span></div>
                </div>
                </div>
            )}
        </div>

        {/* Right Column Grid */}
        <div className="flex flex-col gap-8">
            {/* Recent Registrants */}
            <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-xl shadow-[#253656]/5 overflow-hidden flex-1 flex flex-col">
            <div className="p-8 border-b border-gray-200/50 flex items-center justify-between bg-white/50">
                <h2 className="font-black text-[#253656] text-lg tracking-tight">Pendaftar Terbaru</h2>
                <Link href="/admin/peserta" className="text-xs font-black text-[#BD272D] uppercase tracking-widest hover:text-[#991f24] flex items-center gap-2 group">
                Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            <div className="divide-y divide-gray-100 flex-1 overflow-auto">
                {isDbError ? (
                <div className="p-10 text-center text-[#6C7C98] text-sm font-['Plus_Jakarta_Sans'] font-medium">Data tidak tersedia — koneksi database gagal.</div>
                ) : recentParticipants.length === 0 ? (
                <div className="p-10 text-center text-[#6C7C98] text-sm font-['Plus_Jakarta_Sans'] font-medium">Belum ada pendaftar.</div>
                ) : (
                recentParticipants.map((p) => (
                    <div key={p.id} className="px-6 py-5 flex items-center justify-between hover:bg-white/80 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#253656]/5 to-[#253656]/10 border border-[#253656]/10 flex items-center justify-center text-lg font-black text-[#253656] shrink-0 shadow-sm">
                        {p.full_name ? p.full_name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                        <p className="font-bold text-sm text-[#253656] group-hover:text-[#BD272D] transition-colors">{p.full_name}</p>
                        <p className="text-xs text-[#6C7C98] font-['Plus_Jakarta_Sans'] mt-0.5">{p.institution || "–"}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${p.is_attending ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-600 border border-orange-200"}`}>
                        {p.is_attending ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {p.is_attending ? "Hadir" : "Pending"}
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>

            {/* Info Panel */}
            <div className="bg-gradient-to-br from-[#253656] to-[#1a263d] p-8 rounded-[2.5rem] shadow-2xl shadow-[#253656]/20 relative overflow-hidden text-white shrink-0">
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#BD272D]/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-[1.25rem] flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md shadow-inner">
                    <Activity className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black mb-3 tracking-tight">RC3ID Admin Panel</h2>
                <p className="text-blue-100 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-8 font-medium">
                    Platform pemantauan data tamu dan validasi kehadiran peserta booth B-IDEAs 2026 secara real-time.
                </p>
                <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-black text-white border border-white/20 tracking-[0.1em] shadow-sm">
                    ● SISTEM AKTIF
                    </span>
                    <span className="px-4 py-2 bg-[#BD272D]/20 backdrop-blur-md rounded-xl text-xs font-black text-white border border-[#BD272D]/30 tracking-[0.1em] shadow-sm">
                    B-IDEAs 2026
                    </span>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
