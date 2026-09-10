import { Link } from "@inertiajs/react";
import { ArrowRight, Ticket, Gift, Clock, FileText, CheckCircle2, Users, Activity, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function LandingPage({ totalParticipants, totalAttending, showWelcomeQr = true }: { totalParticipants: number, totalAttending: number, showWelcomeQr?: boolean }) {
  return (
    <div className="min-h-screen bg-transparent text-[#253656] font-sans selection:bg-[#BD272D] selection:text-white relative">
      {/* Premium Animated Mesh Gradient Background */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        
        {/* Dynamic Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#BD272D]/10 to-rose-400/5 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#253656]/10 to-blue-400/5 blur-[150px] animate-[pulse_15s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 blur-[100px] animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]"></div>
      </div>

      {/* Top Accent Bar */}
      <div className="flex h-2 w-full z-20 relative">
        <div className="w-16 bg-[#BD272D]"></div>
        <div className="flex-1 bg-[#253656]"></div>
      </div>

      {/* Header Dokumen Style */}
      <header className="w-full px-6 md:px-12 lg:px-16 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <img src="/logo.svg" alt="RC3ID Logo" className="h-10 w-auto" />
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="bg-[#BD272D] text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
            DIGITAL MEET
          </div>
          <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
            VERSION 1.0 - AUGUST 2026
          </p>
        </div>
      </header>

      <main className="relative w-full px-4 md:px-8 lg:px-12 py-12 overflow-hidden font-['Outfit']">
        {/* Decorative Background Blobs for Eye Catching Effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#BD272D] rounded-full blur-[180px] opacity-25 -z-10 animate-pulse mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[#253656] rounded-full blur-[180px] opacity-15 -z-10 mix-blend-multiply"></div>

        {/* Hero Section */}
        <section className="mb-24 mt-8 md:mt-16 flex flex-col xl:flex-row items-center justify-between gap-16 w-full max-w-[1600px] mx-auto relative z-10">
          
          {/* Main Hero Content (Left Side) */}
          <div className="flex-[3] flex flex-col items-center xl:items-start text-center xl:text-left w-full min-w-0">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 border border-white/60 text-[#253656] text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-xl shadow-[#253656]/5 backdrop-blur-xl animate-fade-in-up hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BD272D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#BD272D]"></span>
              </span>
              RC3ID pada B-IDEAs 2026 Exhibition
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] 2xl:text-[6.5rem] font-black text-[#253656] leading-[1.05] mb-8 tracking-tighter w-full drop-shadow-sm">
              <span className="block 2xl:inline-block 2xl:mr-6 mb-2 2xl:mb-0">ADVANCING</span> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD272D] via-rose-500 to-[#BD272D] animate-gradient-x drop-shadow-lg inline-block">
                EARLY DETECTION
              </span> 
              <span className="block mt-4 text-2xl sm:text-3xl md:text-[2.5rem] 2xl:text-[3rem] opacity-90 text-[#6C7C98] font-black tracking-tight">FOR BETTER INFECTIOUS DISEASE CONTROL</span>
            </h2>

            {/* Description */}
              <p className="text-gray-600 text-lg md:text-xl 2xl:text-2xl font-['Plus_Jakarta_Sans'] leading-relaxed max-w-2xl 2xl:max-w-4xl mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <strong className="text-[#253656] font-black">RC3ID UNPAD</strong> hadir di <strong className="text-[#253656] font-black">B-IDEAs 2026 Exhibition</strong> membawa inovasi riset deteksi dini penyakit infeksi — Tuberkulosis, HIV, dan Dengue.<br/>
                Daftarkan diri Anda dan langsung <strong className="text-[#BD272D]">klaim merchandise</strong> riset kami!
              </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-4 mb-12">
              {[
                { icon: "🔬", label: "Riset Kelas Dunia" },
                { icon: "🎁", label: "Merchandise Gratis" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-lg shadow-[#253656]/5 hover:shadow-xl hover:-translate-y-1 hover:border-[#BD272D]/40 transition-all duration-300 group cursor-default">
                  <span className="text-xl group-hover:scale-110 transition-transform">{badge.icon}</span>
                  <span className="text-xs font-bold text-[#253656] uppercase tracking-widest group-hover:text-[#BD272D] transition-colors">{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center xl:justify-start gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-auto relative group">
                {/* Glowing animated shadow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#BD272D] to-rose-400 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse pointer-events-none"></div>
                <Link href="/buku-tamu" className="flex items-center justify-center relative w-full sm:w-auto h-16 md:h-18 px-12 md:px-16 bg-gradient-to-r from-[#BD272D] to-[#991f24] text-white font-black tracking-[0.15em] uppercase rounded-full border border-white/20 hover:-translate-y-1 transition-all duration-300 text-sm md:text-lg overflow-hidden shadow-2xl shadow-[#BD272D]/40">
                  <span className="relative z-10 flex items-center">
                    Isi Buku Tamu Sekarang
                    <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  {/* Shiny sweep effect */}
                  <div className="absolute inset-0 h-full w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </Link>
              </div>
            </div>
          </div>



          {/* Live Stats (Center-Right) */}
          <div className="w-full xl:flex-[2] flex justify-center relative">
             {/* Premium Decorative Background behind Stats */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#253656]/10 to-[#BD272D]/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
             
             <div className="w-full relative group max-w-md">
               {/* Animated border glow */}
               <div className="absolute -inset-1 bg-gradient-to-br from-[#BD272D]/40 to-[#253656]/30 rounded-[2.5rem] blur-lg opacity-60 group-hover:opacity-100 transition duration-700"></div>
               {showWelcomeQr ? (
                 <WelcomeQrBox />
               ) : (
                 <LiveStatsBox totalParticipants={totalParticipants} totalAttending={totalAttending} />
               )}
             </div>
          </div>

        </section>


        {/* Lower Content Grid to eliminate white space */}
        <div className="flex flex-col xl:flex-row gap-16 w-full mt-12 relative z-10 font-['Outfit']">
          
          {/* Left Column: Alur Kunjungan */}
          <div className="flex-1 flex flex-col">
            <div className="mb-10">
              <h2 className="text-xl font-black text-[#253656] uppercase tracking-[0.15em]">
                Alur Kunjungan Booth
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#BD272D] to-rose-400 mt-3 rounded-full"></div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 w-full">
          {[
            {
              num: "01",
              title: "ISI BUKU TAMU",
              desc: "Isi data diri di form buku tamu digital kami dengan lengkap.",
              priority: false
            },
            {
              num: "02",
              title: "KLAIM MERCHANDISE",
              desc: "Klaim hadiah merchandise eksklusif langsung dari staf kami di booth.",
              priority: true
            }
          ].map((step, i) => (
            <div key={i} className={`p-8 border ${step.priority ? 'border-[#BD272D]/40 bg-gradient-to-br from-[#fff5f5]/80 to-white backdrop-blur-xl' : 'border-white/80 bg-white/40 backdrop-blur-2xl'} relative rounded-[2.5rem] shadow-2xl shadow-[#253656]/5 hover:shadow-3xl hover:shadow-[#253656]/15 hover:-translate-y-2 transition-all duration-500 overflow-hidden group`}>
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#BD272D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className={`relative w-16 h-16 flex items-center justify-center font-black text-3xl mb-8 rounded-[1.5rem] ${step.priority ? 'bg-gradient-to-br from-[#BD272D] to-[#991f24] text-white shadow-xl shadow-[#BD272D]/40' : 'bg-gradient-to-br from-[#253656] to-[#1a263d] text-white shadow-xl shadow-[#253656]/30'}`}>
                {step.num}
              </div>
              <h3 className="relative font-black text-[#253656] uppercase tracking-widest mb-4 text-lg">
                {step.title}
              </h3>
              <p className="relative text-[#6C7C98] text-base md:text-lg leading-relaxed font-medium font-['Plus_Jakarta_Sans']" dangerouslySetInnerHTML={{__html: step.desc}}></p>
            </div>
          ))}
        </section>
      </div>
        </div>
      </main>
      {/* Footer Area */}
      <footer className="bg-gradient-to-b from-[#253656] to-[#1a263d] text-white mt-12 py-12 w-full font-['Outfit'] border-t border-white/10">
        <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              DIGITAL GUESTBOOK SYSTEM
            </p>
            <p className="text-base opacity-80 font-['Plus_Jakarta_Sans'] font-medium">© 2026 RC3ID Universitas Padjadjaran.</p>
          </div>
          
          <div className="md:flex md:justify-end">
            {/* Contact Box Style */}
            <div className="bg-[#1c2942]/50 backdrop-blur-md p-8 border-l-4 border-[#BD272D] rounded-r-2xl min-w-[280px]">
              <h4 className="text-sm font-black text-[#BD272D] uppercase tracking-[0.2em] mb-4">
                CONTACT US
              </h4>
              <p className="text-base mb-2 font-['Plus_Jakarta_Sans'] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer">cl.rc3id@unpad.ac.id</p>
              <p className="text-base font-['Plus_Jakarta_Sans'] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer">rc3id.unpad.ac.id</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LiveStatsBox({ totalParticipants, totalAttending }: { totalParticipants: number, totalAttending: number }) {
  return (
    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-10 shadow-2xl shadow-[#253656]/10 relative overflow-hidden font-['Outfit']">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#BD272D]/20 to-transparent rounded-full blur-2xl"></div>
      
      <h3 className="font-black text-[#253656] uppercase tracking-[0.15em] mb-8 flex items-center gap-3 text-base border-b border-gray-200/60 pb-5">
        <Activity className="w-6 h-6 text-[#BD272D]" />
        Live Booth Stats
      </h3>

        <div className="space-y-8">
          <div className="flex items-center gap-6 group cursor-default">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center shrink-0 border border-blue-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
               <Users className="w-8 h-8 text-blue-600 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#253656] tracking-tighter drop-shadow-sm">{totalParticipants}</p>
              <p className="text-sm font-bold text-[#6C7C98] uppercase tracking-[0.15em] mt-2">Total Pendaftar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 group cursor-default">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-green-50 to-green-100/50 flex items-center justify-center shrink-0 border border-green-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
               <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#253656] tracking-tighter drop-shadow-sm">{totalAttending}</p>
              <p className="text-sm font-bold text-[#6C7C98] uppercase tracking-[0.15em] mt-2">Pengunjung Hadir</p>
            </div>
          </div>
        </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 shadow-lg shadow-green-500/50"></span>
          </span>
          <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Real-time Data</span>
        </div>
           <span className="text-xs font-black text-white bg-gradient-to-r from-[#253656] to-[#1a263d] px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-md">Live</span>
      </div>
    </div>
  );
}

export function WelcomeQrBox() {
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/buku-tamu` : 'https://rc3id.unpad.ac.id/buku-tamu';
  const [defaultSquareLogo, setDefaultSquareLogo] = useState<string | null>(null);

  // Helper to pad any image into a perfect square
  const padImageToSquare = (src: string, callback: (url: string) => void) => {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.onload = () => {
      const padding = 20; 
      const max = Math.max(img.width, img.height) + padding * 2;
      const canvas = document.createElement("canvas");
      canvas.width = max;
      canvas.height = max;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, max, max);
        const x = (max - img.width) / 2;
        const y = (max - img.height) / 2;
        ctx.drawImage(img, x, y);
        callback(canvas.toDataURL("image/png"));
      }
    };
    img.src = src;
  };

  useEffect(() => {
    padImageToSquare("/logo.svg", setDefaultSquareLogo);
  }, []);
  
  return (
    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-10 shadow-2xl shadow-[#253656]/10 relative overflow-hidden font-['Outfit'] flex flex-col items-center">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#BD272D]/20 to-transparent rounded-full blur-2xl"></div>
      
      <h3 className="font-black text-[#253656] uppercase tracking-[0.15em] mb-6 flex items-center gap-3 text-base text-center">
        <QrCode className="w-6 h-6 text-[#BD272D]" />
        Scan Buku Tamu
      </h3>

      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 mb-6 group cursor-pointer hover:scale-105 transition-transform duration-300">
        <QRCodeCanvas
          value={qrUrl}
          size={220}
          fgColor="#253656"
          bgColor="#FFFFFF"
          level="H"
          includeMargin={false}
          imageSettings={{
            src: defaultSquareLogo || "/logo.svg",
            height: 52,
            width: 52,
            excavate: true,
          }}
        />
      </div>
      
      <p className="text-sm font-bold text-[#6C7C98] text-center max-w-[250px] leading-relaxed">
        Gunakan kamera HP Anda untuk memindai QR Code di atas.
      </p>
    </div>
  );
}
