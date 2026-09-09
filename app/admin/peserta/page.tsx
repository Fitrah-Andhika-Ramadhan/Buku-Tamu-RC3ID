import { db } from "@/lib/db";
import { ParticipantTable } from "./ParticipantTable";

export const dynamic = 'force-dynamic';

export default async function PesertaPage() {
  const participants = await db.participant.findMany({
    orderBy: { created_at: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#253656]">Data Peserta</h1>
        <p className="text-slate-500 mt-1">Kelola data pendaftar dan validasi klaim merchandise.</p>
      </div>

      <ParticipantTable participants={participants} />
    </div>
  );
}
