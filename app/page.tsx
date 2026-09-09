import Link from "next/link";
import { ArrowRight, Ticket, Gift, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#253656] font-sans selection:bg-[#BD272D] selection:text-white relative">
      
      {/* Modern Animated Background */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-white bg-[linear-gradient(to_right,#f1f3f6_1px,transparent_1px),linear-gradient(to_bottom,#f1f3f6_1px,transparent_1px)] bg-[size:4rem_4rem]">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#BD272D]/5 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#253656]/5 blur-[150px] animate-[pulse_12s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-purple-500/5 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>
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
        <section className="mb-24 mt-8 flex flex-col items-center text-center max-w-6xl mx-auto relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#253656]/5 border border-[#253656]/10 text-[#253656] text-xs font-bold uppercase tracking-wider mb-8 shadow-sm backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BD272D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BD272D]"></span>
            </span>
            RC3ID pada B-IDEAs 2026 Exhibition
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold text-[#253656] leading-[1.05] mb-10 uppercase tracking-tight w-full">
            ADVANCING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD272D] to-[#e63940]">EARLY DETECTION</span><br className="hidden lg:block" /> FOR BETTER INFECTIOUS DISEASE CONTROL
          </h2>
          
          {/* Glassmorphism Exec Summary Box */}
          <div className="w-full max-w-5xl mx-auto text-left border border-white/40 p-8 md:p-10 rounded-3xl bg-white/60 backdrop-blur-xl shadow-2xl shadow-[#253656]/5 mb-12 relative overflow-hidden group hover:border-[#BD272D]/30 transition-all duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#BD272D] to-[#253656]"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#253656]/10 rounded-lg text-[#253656]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#253656] uppercase text-sm tracking-widest">EXECUTIVE SUMMARY</h3>
            </div>
            <p className="text-[#6C7C98] leading-relaxed text-lg">
              <strong>RC3ID UNPAD</strong> berpartisipasi penuh dalam <strong>B-IDEAs 2026 Exhibition</strong>. Event ini berfokus pada inovasi dan percepatan deteksi dini untuk pengendalian penyakit menular yang lebih baik.
              <br/><br/>
              Selamat datang di <strong className="text-[#BD272D]">Buku Tamu Digital</strong> booth RC3ID. Silakan isi data kunjungan Anda untuk mendapatkan QR Code eksklusif sebagai tiket akses interaktif dan klaim merchandise riset kami.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-10 bg-gradient-to-r from-[#BD272D] to-[#991f24] hover:from-[#a01f25] hover:to-[#7a181c] text-white font-black tracking-widest uppercase rounded-full shadow-lg shadow-[#BD272D]/40 hover:shadow-xl hover:shadow-[#BD272D]/50 hover:-translate-y-1 transition-all duration-300 text-lg group">
                Isi Buku Tamu Sekarang
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Section Heading Style Component */}
        <div className="mb-10">
          <h2 className="text-base font-bold text-[#253656] uppercase tracking-widest">
            Alur Kunjungan Booth
          </h2>
          <div className="w-12 h-1 bg-[#BD272D] mt-2"></div>
        </div>

        {/* Key Recommendations / Steps Cards - Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              num: "01",
              title: "ISI BUKU TAMU",
              desc: "Isi data diri di form buku tamu digital untuk mendapatkan <strong>ID unik</strong> dan tiket akses.",
              priority: false
            },
            {
              num: "02",
              title: "SIMPAN QR CODE",
              desc: "Simpan <strong>Kartu Akses</strong> yang berisi QR Code pribadi Anda di ponsel.",
              priority: true
            },
            {
              num: "03",
              title: "KLAIM MERCHANDISE",
              desc: "Tunjukkan QR untuk validasi kunjungan dan tukarkan dengan <strong>Merchandise eksklusif</strong>.",
              priority: false
            }
          ].map((step, i) => (
            <div key={i} className={`p-6 border ${step.priority ? 'border-[#BD272D] bg-[#fff5f5]' : 'border-gray-200 bg-white'} relative`}>
              <div className={`w-12 h-12 flex items-center justify-center font-extrabold text-xl mb-4 ${step.priority ? 'bg-[#BD272D] text-white' : 'bg-[#253656] text-white'}`}>
                {step.num}
              </div>
              <h3 className="font-bold text-[#253656] uppercase tracking-wider mb-3 text-sm">
                {step.title}
              </h3>
              <p className="text-[#6C7C98] text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: step.desc}}></p>
            </div>
          ))}
        </section>

        {/* Merchandise Info Section (Centered) */}
        <div className="flex flex-col items-center mb-20">
          <div className="mb-8 w-full max-w-md text-center flex flex-col items-center">
            <h2 className="text-base font-bold text-[#253656] uppercase tracking-widest">
              Syarat Merchandise
            </h2>
            <div className="w-12 h-1 bg-[#BD272D] mt-2"></div>
          </div>

          {/* Figure/Chart Box Style for Info */}
          <div className="border border-gray-200 rounded-sm w-full max-w-md shadow-lg shadow-[#253656]/5">
            <div className="bg-[#253656] p-4 border-b border-gray-200 text-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-[#BD272D]" /> INFO KETENTUAN KLAIM
              </h3>
            </div>
            <div className="p-6 bg-white">
              <ul className="space-y-4">
                {[
                  "Telah mengisi buku tamu",
                  "Status Hadir (di-scan panitia)",
                  "Menyelesaikan Kuis / Survey Booth"
                ].map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#253656] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#BD272D] shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-[#6C7C98] italic">
                  "Merchandise eksklusif diberikan bagi pengunjung booth yang memenuhi kriteria di atas, selama persediaan masih ada."
                </p>
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
