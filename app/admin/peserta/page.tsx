import { db } from "@/lib/db";
import { ParticipantTable } from "./ParticipantTable";
import { AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PesertaPage() {
  let participants: Awaited<ReturnType<typeof db.participant.findMany>> = [];
  let isDbError = false;

  try {
    participants = await db.participant.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (err) {
    console.error("DB error on PesertaPage:", err);
    isDbError = true;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#253656]">Data Peserta</h1>
        <p className="text-slate-500 mt-1">Kelola data pendaftar dan validasi klaim merchandise.</p>
      </div>

      {isDbError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-red-700 mb-1">Gagal Memuat Data Peserta</h2>
            <p className="text-sm text-red-600 max-w-md">
              Database Hostinger menolak koneksi. Pastikan <code className="bg-red-100 px-1 rounded font-mono text-xs">DATABASE_URL</code> menggunakan <strong>localhost</strong> dan password tanpa simbol khusus, lalu restart aplikasi.
            </p>
          </div>
        </div>
      ) : (
        <ParticipantTable participants={participants} />
      )}
    </div>
  );
}
