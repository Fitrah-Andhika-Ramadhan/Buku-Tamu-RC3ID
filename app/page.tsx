import Link from "next/link";
import { ArrowRight, Ticket, Gift, Clock, FileText, CheckCircle2, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

import { Suspense } from "react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LandingPage() {
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
            DIGITAL GUESTBOOK
          </div>
          <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
            VERSION 1.0 - AUGUST 2026
          </p>
        </div>
      </header>

      <main className="relative w-full px-6 md:px-12 lg:px-16 py-12 overflow-hidden">
        {/* Decorative Background Blobs for Eye Catching Effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BD272D] rounded-full blur-[150px] opacity-20 -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#253656] rounded-full blur-[150px] opacity-10 -z-10"></div>

        {/* Hero Section */}
        <section className="mb-24 mt-8 flex flex-col xl:flex-row gap-8 lg:gap-16 w-full relative z-10">
          
          <div className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#253656]/5 border border-[#253656]/10 text-[#253656] text-xs font-bold uppercase tracking-wider mb-8 shadow-sm backdrop-blur-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BD272D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BD272D]"></span>
              </span>
              RC3ID pada B-IDEAs 2026 Exhibition
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#253656] leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 tracking-tight w-full max-w-5xl drop-shadow-sm">
              <span className="block mb-2">ADVANCING</span> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD272D] via-red-500 to-[#BD272D] animate-gradient-x drop-shadow-md">
                EARLY DETECTION
              </span> 
              <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl opacity-90">FOR BETTER INFECTIOUS DISEASE CONTROL</span>
            </h2>
            
            {/* Glassmorphism Exec Summary Box */}
            <div className="w-full max-w-4xl text-left border border-white/40 p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-white/60 backdrop-blur-xl shadow-2xl shadow-[#253656]/5 mb-10 md:mb-12 relative overflow-hidden group hover:border-[#BD272D]/30 transition-all duration-500">
              <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-gradient-to-b from-[#BD272D] to-[#253656]"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#253656]/10 rounded-lg text-[#253656]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#253656] uppercase text-sm tracking-widest">EXECUTIVE SUMMARY</h3>
              </div>
              <p className="text-[#6C7C98] leading-relaxed text-sm md:text-lg">
                <strong>RC3ID UNPAD</strong> berpartisipasi penuh dalam <strong>B-IDEAs 2026 Exhibition</strong>. Event ini berfokus pada inovasi dan percepatan deteksi dini untuk pengendalian penyakit menular yang lebih baik.
                <br/><br/>
                Selamat datang di <strong className="text-[#BD272D]">Buku Tamu Digital</strong> booth RC3ID. Silakan isi data kunjungan Anda untuk mendapatkan QR Code eksklusif sebagai tiket akses interaktif dan klaim merchandise riset kami.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto relative group">
                {/* Glowing animated shadow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#BD272D] to-rose-400 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500 group-hover:duration-200 animate-pulse"></div>
                <Button className="relative w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 bg-gradient-to-r from-[#BD272D] to-[#991f24] text-white font-black tracking-widest uppercase rounded-full border border-white/20 hover:-translate-y-1 transition-all duration-300 text-sm md:text-lg overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Isi Buku Tamu
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  {/* Shiny sweep effect */}
                  <div className="absolute inset-0 h-full w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full xl:w-[400px] shrink-0 flex flex-col justify-center">
             <Suspense fallback={
               <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl shadow-[#253656]/5 relative overflow-hidden min-h-[250px] flex items-center justify-center">
                 <div className="animate-pulse flex flex-col items-center gap-4">
                   <Activity className="w-8 h-8 text-[#BD272D]/50" />
                   <p className="text-sm font-bold text-[#253656]/50 uppercase tracking-widest">Memuat Live Stats...</p>
                 </div>
               </div>
             }>
               <LiveStatsBox />
             </Suspense>
          </div>

        </section>

        {/* Lower Content Grid to eliminate white space */}
        <div className="flex flex-col xl:flex-row gap-16 w-full mt-12 relative z-10">
          
          {/* Left Column: Alur Kunjungan */}
          <div className="flex-1 flex flex-col">
            <div className="mb-10">
              <h2 className="text-base font-bold text-[#253656] uppercase tracking-widest">
                Alur Kunjungan Booth
              </h2>
              <div className="w-12 h-1 bg-[#BD272D] mt-2"></div>
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
              desc: "Akses halaman khusus dan tunjukkan <strong>QR Code</strong> Anda ke staf untuk klaim hadiah.",
              priority: true
            }
          ].map((step, i) => (
            <div key={i} className={`p-8 border ${step.priority ? 'border-[#BD272D]/30 bg-gradient-to-br from-[#fff5f5] to-white' : 'border-white/60 bg-white/60 backdrop-blur-xl'} relative rounded-3xl shadow-xl shadow-[#253656]/5 hover:shadow-2xl hover:shadow-[#253656]/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden group`}>
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#BD272D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`relative w-14 h-14 flex items-center justify-center font-extrabold text-2xl mb-6 rounded-2xl ${step.priority ? 'bg-gradient-to-br from-[#BD272D] to-[#991f24] text-white shadow-lg shadow-[#BD272D]/30' : 'bg-gradient-to-br from-[#253656] to-[#1a263d] text-white shadow-lg shadow-[#253656]/20'}`}>
                {step.num}
              </div>
              <h3 className="relative font-black text-[#253656] uppercase tracking-wider mb-4 text-base">
                {step.title}
              </h3>
              <p className="relative text-[#6C7C98] text-base leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: step.desc}}></p>
            </div>
          ))}
        </section>
      </div>
          {/* Right Column: Syarat Merchandise */}
          <div className="w-full xl:w-[450px] shrink-0 flex flex-col items-center xl:items-start mb-20 relative">
          {/* Background glow for this section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-gradient-to-r from-[#BD272D]/5 to-purple-500/5 blur-3xl -z-10 rounded-full"></div>
          
          <div className="mb-8 w-full text-center xl:text-left flex flex-col items-center xl:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BD272D]/10 text-[#BD272D] text-xs font-extrabold uppercase tracking-widest mb-3">
              <Gift className="w-4 h-4" /> Bonus Eksklusif
            </div>
            <h2 className="text-2xl font-black text-[#253656] uppercase tracking-tight">
              Syarat Merchandise
            </h2>
          </div>

          {/* Premium Glassmorphism Box for Info */}
          <div className="relative group w-full max-w-md">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#BD272D] to-[#253656] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-white p-1 rounded-[2rem] shadow-2xl shadow-[#253656]/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#253656] to-[#1a263d] p-5 rounded-t-[1.75rem] text-center relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <h3 className="relative text-sm font-black text-white uppercase tracking-widest flex items-center justify-center gap-2">
                  Info Ketentuan Klaim
                </h3>
              </div>
              <div className="p-8">
                <ul className="space-y-5 relative z-10">
                  {[
                    "Telah mengisi buku tamu digital",
                    "Status Hadir diverifikasi staf",
                    "Menyelesaikan Kuis / Survey Booth"
                  ].map((req, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-50 border border-red-100 shrink-0 group-hover/item:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4 text-[#BD272D]" />
                      </div>
                      <span className="text-sm text-[#253656] font-bold">{req}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-200/60 text-center relative z-10">
                  <p className="text-xs text-[#6C7C98] font-medium leading-relaxed">
                    "Merchandise eksklusif diberikan bagi pengunjung booth yang memenuhi kriteria di atas, <strong className="text-[#BD272D]">selama persediaan masih ada</strong>."
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
      {/* Footer Area */}
      <footer className="bg-[#253656] text-white mt-12 py-10 w-full">
        <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              DIGITAL GUESTBOOK SYSTEM
            </p>
            <p className="text-sm opacity-80">© 2026 Tech Conference RC3ID.</p>
          </div>
          
          <div className="md:flex md:justify-end">
            {/* Contact Box Style */}
            <div className="bg-[#1c2942] p-6 border-l-2 border-[#BD272D] min-w-[250px]">
              <h4 className="text-xs font-bold text-[#BD272D] uppercase tracking-widest mb-3">
                CONTACT US
              </h4>
              <p className="text-sm mb-1">event@rc3id.org</p>
              <p className="text-sm">www.rc3id.org</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

async function LiveStatsBox() {
  let totalRegistered = 0;
  let totalHadir = 0;
  let error = false;

  try {
    totalRegistered = await db.participant.count();
    totalHadir = await db.participant.count({ where: { status_hadir: true } });
  } catch (err) {
    error = true;
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl shadow-[#253656]/5 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#BD272D]/10 rounded-full blur-2xl"></div>
      
      <h3 className="font-bold text-[#253656] uppercase tracking-widest mb-6 flex items-center gap-2 text-sm border-b border-gray-100 pb-4">
        <Activity className="w-5 h-5 text-[#BD272D]" />
        Live Booth Stats
      </h3>

      {error ? (
        <div className="py-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 border border-amber-200 shadow-inner">
             <Activity className="w-8 h-8 text-amber-500" />
          </div>
          <h4 className="font-bold text-[#253656] text-lg mb-2">Sinkronisasi Tertunda</h4>
          <p className="text-sm text-[#6C7C98] max-w-[200px]">Menunggu koneksi database berhasil dipulihkan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
               <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-[#253656]">{totalRegistered}</p>
              <p className="text-sm font-medium text-[#6C7C98] uppercase tracking-wider mt-1">Total Pendaftar</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
               <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-[#253656]">{totalHadir}</p>
              <p className="text-sm font-medium text-[#6C7C98] uppercase tracking-wider mt-1">Pengunjung Hadir</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${error ? 'bg-amber-400' : 'bg-green-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${error ? 'bg-amber-500' : 'bg-green-500'}`}></span>
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{error ? "Offline Mode" : "Real-time Data"}</span>
        </div>
        {!error && (
           <span className="text-[10px] font-bold text-[#253656] bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">Live</span>
        )}
      </div>
    </div>
  );
}
