"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock, Search, ExternalLink } from "lucide-react";
import { toggleAttendanceStatus } from "./actions";
import Link from "next/link";

type Participant = {
  id: string;
  nama_lengkap: string;
  instansi: string | null;
  profesi: string | null;
  status_hadir: boolean;
  waktu_hadir: Date | null;
  created_at: Date;
};

export function ParticipantTable({ participants }: { participants: Participant[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = participants.filter(p => 
    p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.instansi && p.instansi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleAttendanceStatus(id, currentStatus);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-bold text-[#253656] text-lg">Daftar Pendaftar</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama / instansi..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Peserta</th>
              <th className="px-6 py-4">Waktu Daftar</th>
              <th className="px-6 py-4 text-center">Status Kehadiran</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  Tidak ada data peserta yang ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#253656]">{p.nama_lengkap}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.instansi} • {p.profesi}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(p.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {p.status_hadir ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hadir
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                        <Clock className="w-3.5 h-3.5" />
                        Belum
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleToggle(p.id, p.status_hadir)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          p.status_hadir 
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-600" 
                            : "bg-[#253656] hover:bg-[#1a263d] text-white"
                        }`}
                      >
                        {p.status_hadir ? "Batal Hadir" : "Validasi Kehadiran"}
                      </button>
                      <Link 
                        href={`/p/${p.id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-[#BD272D] transition-colors"
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
    </div>
  );
}
