"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock, Search, ExternalLink, Filter, Download } from "lucide-react";
import { toggleAttendanceStatus } from "./actions";
import Link from "next/link";

type Participant = {
  id: string;
  nama_lengkap: string;
  instansi: string | null;
  profesi: string | null;
  status_hadir: boolean;
  waktu_hadir: Date | null;
  createdAt: Date;
};

export function ParticipantTable({ participants }: { participants: Participant[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "hadir" | "pending">("all");
  const [isPending, startTransition] = useTransition();

  const filtered = participants.filter((p) => {
    const matchSearch =
      p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.instansi && p.instansi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFilter =
      filter === "all" || (filter === "hadir" && p.status_hadir) || (filter === "pending" && !p.status_hadir);
    return matchSearch && matchFilter;
  });

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleAttendanceStatus(id, currentStatus);
    });
  };

  const totalHadir = participants.filter((p) => p.status_hadir).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-black text-[#253656] text-lg">Daftar Pendaftar</h2>
            <p className="text-xs text-slate-400 mt-0.5">{participants.length} total • {totalHadir} hadir</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Ekspor
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau instansi..."
              className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            {(["all", "hadir", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? "bg-[#253656] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === "all" ? "Semua" : f === "hadir" ? "✓ Hadir" : "○ Pending"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Peserta</th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Waktu Daftar</th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Search className="w-10 h-10 opacity-30" />
                    <p className="font-medium">Tidak ada peserta ditemukan</p>
                    <p className="text-xs">Coba ubah kata kunci atau filter pencarian</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-50/80 transition-colors ${isPending ? "opacity-60" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#253656]/10 flex items-center justify-center text-sm font-black text-[#253656] shrink-0 uppercase">
                        {p.nama_lengkap.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{p.nama_lengkap}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{p.instansi} {p.profesi ? `• ${p.profesi}` : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-sm hidden md:table-cell">
                    <div>{new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {p.status_hadir ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggle(p.id, p.status_hadir)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                          p.status_hadir
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            : "bg-[#253656] hover:bg-[#1a263d] text-white shadow-sm shadow-[#253656]/20"
                        }`}
                      >
                        {p.status_hadir ? "Batal" : "✓ Validasi"}
                      </button>
                      <Link
                        href={`/p/${p.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-[#BD272D] hover:bg-red-50 transition-colors"
                        title="Lihat Tiket"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400">Menampilkan <strong className="text-slate-600">{filtered.length}</strong> dari <strong className="text-slate-600">{participants.length}</strong> peserta</p>
          <p className="text-xs font-bold text-[#BD272D]">{totalHadir} sudah hadir</p>
        </div>
      )}
    </div>
  );
}
