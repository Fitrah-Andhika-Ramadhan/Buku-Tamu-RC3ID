import { Head, Link } from "@inertiajs/react";
import { QRCodeCanvas } from "qrcode.react";
import { Printer, Download, Share2, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

export default function Ticket({ participant }: { participant: any }) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Basic screenshot/download logic if we were using html2canvas.
    // For now, we just suggest them to screenshot or print.
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Tiket RC3ID - ' + participant.nama_lengkap,
        text: 'Ini adalah tiket digital untuk acara RC3ID UNPAD',
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Outfit'] selection:bg-[#BD272D] selection:text-white flex items-center justify-center p-4 sm:p-8">
      <Head title={`Tiket: ${participant.nama_lengkap} - RC3ID`} />
      
      {/* VIBEDESK STYLE: Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed left-[10%] top-[10%] z-0 h-[400px] w-[400px] rounded-full bg-[#BD272D] opacity-[0.10] blur-[100px] pointer-events-none"></div>
      <div className="fixed right-[-5%] bottom-[10%] z-0 h-[500px] w-[500px] rounded-full bg-[#253656] opacity-[0.08] blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Back button */}
        <div className="flex items-center justify-between print:hidden">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#6C7C98] hover:text-[#253656] transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            ← Kembali
          </Link>
        </div>

        {/* Status Badge */}
        {participant.is_attending && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm print:hidden">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">Kehadiran sudah divalidasi!</span>
          </div>
        )}

        {/* The Ticket */}
        <div 
          ref={ticketRef}
          className="bg-white rounded-[2rem] shadow-2xl shadow-[#253656]/10 border border-gray-100 overflow-hidden relative group"
        >
          {/* Header */}
          <div className="w-full bg-gradient-to-r from-[#253656] to-[#1a263d] p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]"></div>
             <img src="/logo.svg" alt="RC3ID" className="h-10 relative z-10 filter drop-shadow-md brightness-0 invert" />
          </div>

          {/* Body */}
          <div className="p-8 flex flex-col items-center relative">
            {/* Cutouts / Ticket notches */}
            <div className="absolute top-0 -left-4 w-8 h-8 bg-[#f8fafc] rounded-full shadow-inner transform -translate-y-1/2"></div>
            <div className="absolute top-0 -right-4 w-8 h-8 bg-[#f8fafc] rounded-full shadow-inner transform -translate-y-1/2"></div>
            <div className="absolute top-0 left-4 right-4 h-px border-b-2 border-dashed border-gray-200 transform -translate-y-1/2"></div>

            {/* QR Code */}
            <div className="relative p-5 rounded-3xl border-2 border-dashed border-slate-200 bg-white mb-6">
              <QRCodeCanvas 
                value={`${window.location.origin}/p/${participant.id}`} 
                size={220}
                fgColor="#253656"
                bgColor="#FFFFFF"
                level="H"
                imageSettings={{
                  src: "/logo.svg",
                  height: 40,
                  width: 110,
                  excavate: true,
                }}
              />
            </div>

            <h2 className="text-2xl font-black text-[#253656] text-center mb-1 leading-tight uppercase tracking-tight">
              {participant.nama_lengkap}
            </h2>
            <p className="text-sm font-bold text-[#BD272D] text-center mb-6 uppercase tracking-widest">
              {participant.instansi || "Tamu Undangan"}
            </p>
            
            <div className="w-full h-px border-b-2 border-dashed border-gray-200 my-2"></div>
            
            <p className="font-mono text-xs tracking-[0.2em] text-slate-400 font-bold bg-slate-50 px-4 py-2.5 rounded-xl text-center w-full mt-4">
              {participant.id.split('-')[0].toUpperCase()}-{participant.id.split('-')[4]?.toUpperCase() || participant.id}
            </p>
          </div>

          {/* Footer */}
          <div className="w-full bg-gradient-to-r from-[#253656]/5 to-[#BD272D]/5 p-4 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RC3ID • Universitas Padjadjaran</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-center print:hidden">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-slate-200 text-[#253656] hover:bg-slate-50 font-bold rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak Tiket
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#BD272D] hover:bg-[#991f24] text-white font-bold rounded-xl shadow-md shadow-[#BD272D]/20 transition-colors"
          >
            <Share2 className="w-4 h-4" /> Bagikan
          </button>
        </div>

        {/* Benefit Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 print:hidden">
          <p className="text-sm font-bold text-[#253656] mb-2 flex items-center gap-2">
            💡 Simpan tiket ini!
          </p>
          <p className="text-xs text-[#6C7C98] leading-relaxed font-medium">
            Tiket digital ini dapat digunakan untuk mengakses kembali seluruh benefit Anda, termasuk <strong>klaim merchandise eksklusif</strong>, <strong>unduh e-materi</strong>, dan <strong>verifikasi kehadiran</strong> di booth RC3ID. Simpan link atau screenshot tiket ini agar tetap bisa digunakan kapan saja.
          </p>
        </div>

      </div>
    </div>
  );
}
