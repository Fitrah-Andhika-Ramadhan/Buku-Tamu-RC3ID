import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import QRCode from "react-qr-code";
import { CheckCircle2, Gift, Clock, Download, Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kartu Peserta | Event RC3ID",
};

export default async function ParticipantPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const participant = await db.participant.findUnique({
    where: { id },
  });

  if (!participant) {
    notFound();
  }

  // Format date correctly if exists
  const checkinTime = participant.waktu_hadir 
    ? new Date(participant.waktu_hadir).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "-";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BD272D]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#253656]/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.svg" alt="RC3ID Logo" className="h-10 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Tiket Akses Booth</h1>
          <p className="text-slate-500 mt-2">Tunjukkan QR Code ini kepada staf saat kedatangan.</p>
        </div>

        {/* The Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Top header of card */}
          <div className="bg-[#253656] p-6 text-white text-center relative border-t-8 border-[#BD272D]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            
            <p className="text-[#6C7C98] text-sm font-bold mb-1 uppercase tracking-wider">B-IDEAs 2026 Exhibition</p>
            <h2 className="text-2xl font-bold mb-1 truncate">{participant.nama_lengkap}</h2>
            <p className="text-gray-300">{participant.instansi}</p>
            <p className="text-xs text-gray-400 mt-1">{participant.profesi}</p>
          </div>

          {/* QR Code section */}
          <div className="p-8 flex flex-col items-center border-b border-dashed border-slate-200 relative">
            {/* Notch decorations for ticket look */}
            <div className="absolute -left-4 top-0 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2 border-r border-slate-200 shadow-inner"></div>
            <div className="absolute -right-4 top-0 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2 border-l border-slate-200 shadow-inner"></div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
              <QRCode 
                value={participant.qr_code} 
                size={180}
                level="H"
                className="w-48 h-48"
              />
            </div>
            <p className="font-mono text-sm tracking-widest text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-md">
              {participant.qr_code}
            </p>
          </div>

          {/* Status section */}
          <div className="p-6 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Status Anda</h3>
            
            <div className="space-y-4">
              {/* Check-in Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${participant.status_hadir ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                    {participant.status_hadir ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Kehadiran</p>
                    <p className="text-xs text-slate-500">
                      {participant.status_hadir ? `Hadir pukul ${checkinTime}` : 'Belum Berkunjung'}
                    </p>
                  </div>
                </div>
                <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${participant.status_hadir ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                  {participant.status_hadir ? 'HADIR' : 'PENDING'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Screenshot Layar Ini
          </Button>
        </div>
      </div>
    </div>
  );
}
