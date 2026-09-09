import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import QRCode from "react-qr-code";
import { CheckCircle2, Gift, Clock, Download, Ticket, ShoppingBag, Coffee, Book, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Klaim Merchandise | Event RC3ID",
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

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BD272D]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#253656]/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.svg" alt="RC3ID Logo" className="h-10 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#253656] uppercase tracking-tight">Klaim Merchandise</h1>
          <p className="text-[#6C7C98] mt-2 font-medium">Tunjukkan halaman ini kepada staf booth kami.</p>
        </div>

        {/* The Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Top header of card */}
          <div className="bg-[#253656] p-6 text-white text-center relative border-t-[10px] border-[#BD272D]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-2xl font-bold mb-1 truncate">{participant.nama_lengkap}</h2>
            <p className="text-gray-300 font-medium">{participant.instansi}</p>
          </div>

          {/* QR Code section */}
          <div className="p-8 flex flex-col items-center border-b border-dashed border-gray-200 relative bg-white">
            {/* Notch decorations for ticket look */}
            <div className="absolute -left-4 top-0 w-8 h-8 bg-[#f8f9fc] rounded-full -translate-y-1/2 border-r border-gray-200 shadow-inner"></div>
            <div className="absolute -right-4 top-0 w-8 h-8 bg-[#f8f9fc] rounded-full -translate-y-1/2 border-l border-gray-200 shadow-inner"></div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow">
              <QRCode 
                value={participant.qr_code} 
                size={180}
                level="H"
                className="w-48 h-48"
              />
            </div>
            
            <div className={`mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${participant.status_hadir ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {participant.status_hadir ? (
                <><CheckCircle2 className="w-4 h-4" /> SUDAH DIVALIDASI</>
              ) : (
                <><Clock className="w-4 h-4" /> MENUNGGU VALIDASI</>
              )}
            </div>
          </div>

          {/* Merchandise Showcase Section */}
          <div className="p-6 bg-slate-50">
            <h3 className="text-xs font-bold text-[#6C7C98] mb-4 uppercase tracking-widest text-center">Pilihan Merchandise Spesial</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: ShoppingBag, name: "Tote Bag Eksklusif", color: "bg-blue-100 text-blue-600" },
                { icon: Coffee, name: "Mug RC3ID", color: "bg-orange-100 text-orange-600" },
                { icon: Book, name: "Buku Catatan Riset", color: "bg-green-100 text-green-600" },
                { icon: Tag, name: "Lanyard & ID Card", color: "bg-purple-100 text-purple-600" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#BD272D]/30 transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#253656] leading-tight">{item.name}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#BD272D]/5 p-4 rounded-xl border border-[#BD272D]/20 text-center">
              <Gift className="w-6 h-6 text-[#BD272D] mx-auto mb-2" />
              <p className="text-xs text-[#253656] font-medium leading-relaxed">
                Tukarkan layar ini di meja registrasi. Anda bisa memilih salah satu merchandise di atas selama persediaan masih ada!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full shadow-sm bg-white hover:bg-gray-50 border-gray-200 text-[#253656] font-bold">
            <Download className="w-4 h-4 mr-2" />
            Simpan Screenshot Layar Ini
          </Button>
        </div>
      </div>
    </div>
  );
}
