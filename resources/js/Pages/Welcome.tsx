import { Link } from "@inertiajs/react";
import { ArrowRight, Video, FileText, Users, Activity, QrCode, CalendarDays, BookOpen, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function LandingPage({ event, totalParticipants, totalAttending, totalInstitutions, showWelcomeQr = true }: { event?: any, totalParticipants: number, totalAttending: number, totalInstitutions: number, showWelcomeQr?: boolean }) {
  const lc = event?.landing_config || {};

  // Configurable via Admin > Landing Config, with digital-meet defaults
  const badgeText       = lc.badge_text    || "Platform Digital RC3ID UNPAD";
  const titleLine1      = lc.title_line1   || "DIGITAL";
  const titleGradient   = lc.title_gradient || "MEET";
  const titleLine2      = lc.title_line2   || "WITH RC3ID UNPAD";
  const descriptionHtml = lc.description_html ||
    `Terhubung langsung dengan <strong>Research Center for Care and Control of Infectious Diseases</strong> — Universitas Padjadjaran. Daftarkan diri Anda untuk bergabung dalam pertemuan, seminar, dan kolaborasi riset bersama kami.`;

  return (
    <div className="min-h-screen flex flex-col w-full bg-transparent text-[#253656] font-sans selection:bg-[#BD272D] selection:text-white relative">

      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#BD272D]/10 to-rose-400/5 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#253656]/10 to-blue-400/5 blur-[150px] animate-[pulse_15s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 blur-[100px] animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]"></div>
      </div>

      {/* Top Accent Bar */}
      <div className="flex h-2 w-full z-20 relative">
        <div className="w-16 bg-[#BD272D]"></div>
        <div className="flex-1 bg-[#253656]"></div>
      </div>

      {/* Header */}
      <header className="w-full px-6 md:px-12 lg:px-16 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <img src="/logo.svg" alt="RC3ID Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-black text-green-700 uppercase tracking-widest">Sistem Aktif</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <div className="bg-[#BD272D] text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
              DIGITAL MEET
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              RC3ID UNPAD · 2026
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow relative w-full px-4 md:px-8 lg:px-12 py-12 overflow-hidden font-['Outfit']">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#BD272D] rounded-full blur-[180px] opacity-20 -z-10 animate-pulse mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[#253656] rounded-full blur-[180px] opacity-10 -z-10 mix-blend-multiply"></div>

        {/* ===== Hero Section ===== */}
        <section className="mb-24 mt-8 md:mt-16 flex flex-col xl:flex-row items-center justify-between gap-16 w-full max-w-[1600px] mx-auto relative z-10">

          {/* Left: Hero Content */}
          <div className="flex-[3] flex flex-col items-center xl:items-start text-center xl:text-left w-full min-w-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 border border-white/60 text-[#253656] text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-xl shadow-[#253656]/5 backdrop-blur-xl hover:scale-105 transition-transform cursor-default">
              <Video className="w-3.5 h-3.5 text-[#BD272D]" />
              {badgeText}
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] 2xl:text-[6.5rem] font-black text-[#253656] leading-[1.05] mb-8 tracking-tighter w-full drop-shadow-sm">
              <span className="block 2xl:inline-block 2xl:mr-6 mb-2 2xl:mb-0">{titleLine1}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD272D] via-rose-500 to-[#BD272D] animate-gradient-x drop-shadow-lg inline-block">
                {titleGradient}
              </span>
              <span className="block mt-4 text-2xl sm:text-3xl md:text-[2.5rem] 2xl:text-[3rem] opacity-90 text-[#6C7C98] font-black tracking-tight">{titleLine2}</span>
            </h1>

            {/* Description */}
            <p
              className="text-gray-600 text-lg md:text-xl 2xl:text-2xl font-['Plus_Jakarta_Sans'] leading-relaxed max-w-2xl 2xl:max-w-4xl mb-12"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            ></p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-4 mb-12">
              {[
                { icon: <Video className="w-4 h-4 text-[#BD272D]" />, label: "Pertemuan Virtual" },
                { icon: <BookOpen className="w-4 h-4 text-[#253656]" />, label: "Riset & Edukasi" },
                { icon: <Globe className="w-4 h-4 text-green-600" />, label: "Kolaborasi Terbuka" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-lg shadow-[#253656]/5 hover:shadow-xl hover:-translate-y-1 hover:border-[#BD272D]/40 transition-all duration-300 group cursor-default">
                  <span className="group-hover:scale-110 transition-transform">{badge.icon}</span>
                  <span className="text-xs font-bold text-[#253656] uppercase tracking-widest group-hover:text-[#BD272D] transition-colors">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center xl:justify-start gap-4 w-full sm:w-auto">
              {/* Primary CTA */}
              <div className="w-full sm:w-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#BD272D] to-rose-400 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse pointer-events-none"></div>
                <Link
                  href={event ? `/e/${event.slug}/buku-tamu` : "/buku-tamu"}
                  className="flex items-center justify-center relative w-full sm:w-auto h-16 px-12 md:px-16 bg-gradient-to-r from-[#BD272D] to-[#991f24] text-white font-black tracking-[0.15em] uppercase rounded-full border border-white/20 hover:-translate-y-1 transition-all duration-300 text-sm md:text-base overflow-hidden shadow-2xl shadow-[#BD272D]/40"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <CalendarDays className="w-5 h-5" />
                    Daftar Sekarang
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 h-full w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </Link>
              </div>

              {/* Secondary CTA: About RC3ID */}
              <a
                href="https://rc3id.unpad.ac.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-full sm:w-auto h-16 px-10 bg-white/60 backdrop-blur-xl text-[#253656] font-black tracking-[0.1em] uppercase rounded-full border border-[#253656]/20 hover:border-[#253656]/60 hover:bg-white hover:-translate-y-1 transition-all duration-300 text-sm md:text-base shadow-lg"
              >
                <Globe className="w-5 h-5 mr-3 text-[#253656]" />
                Tentang RC3ID
              </a>
            </div>
          </div>

          {/* Right: QR / Stats Card */}
          <div className="w-full xl:flex-[2] flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#253656]/10 to-[#BD272D]/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="w-full relative group max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#BD272D]/40 to-[#253656]/30 rounded-[2.5rem] blur-lg opacity-60 group-hover:opacity-100 transition duration-700"></div>
              {showWelcomeQr ? (
                <WelcomeQrBox event={event} />
              ) : (
                <LiveStatsBox totalAttending={totalAttending} totalInstitutions={totalInstitutions} />
              )}
            </div>
          </div>

        </section>

        {/* ===== Feature Section ===== */}
        <div className="flex flex-col gap-16 w-full mt-4 relative z-10 font-['Outfit'] max-w-[1600px] mx-auto">
          <div className="flex flex-col">
            <div className="mb-10">
              <h2 className="text-xl font-black text-[#253656] uppercase tracking-[0.15em]">
                {lc.section_title || "Mengapa Digital Meet?"}
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#BD272D] to-rose-400 mt-3 rounded-full"></div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 w-full">
              {[
                {
                  icon: <Video className="w-8 h-8 text-white" />,
                  title: lc.feature1_title || "Pertemuan Virtual",
                  desc: lc.feature1_desc || "Bergabung ke ruang rapat virtual bersama tim RC3ID dari mana saja, tanpa perlu hadir secara fisik.",
                  color: "from-[#253656] to-[#1a263d]",
                  borderColor: "border-white/80",
                  bg: "bg-white/40 backdrop-blur-2xl"
                },
                {
                  icon: <FileText className="w-8 h-8 text-white" />,
                  title: lc.feature2_title || "Notulensi & AI Summary",
                  desc: lc.feature2_desc || "Setiap pertemuan dilengkapi fitur notulensi langsung dan ringkasan otomatis berbasis AI.",
                  color: "from-[#BD272D] to-[#991f24]",
                  borderColor: "border-[#BD272D]/40",
                  bg: "bg-gradient-to-br from-[#fff5f5]/80 to-white backdrop-blur-xl"
                },
                {
                  icon: <Users className="w-8 h-8 text-white" />,
                  title: lc.feature3_title || "Jaringan Kolaborasi",
                  desc: lc.feature3_desc || "Terhubung dengan peneliti, mahasiswa, dan mitra RC3ID dalam satu ekosistem digital yang terorganisir.",
                  color: "from-[#1a6b5a] to-[#0f4d3a]",
                  borderColor: "border-white/80",
                  bg: "bg-white/40 backdrop-blur-2xl"
                }
              ].map((feat, i) => (
                <div key={i} className={`p-8 border ${feat.borderColor} ${feat.bg} relative rounded-[2.5rem] shadow-2xl shadow-[#253656]/5 hover:shadow-3xl hover:shadow-[#253656]/15 hover:-translate-y-2 transition-all duration-500 overflow-hidden group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#BD272D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className={`relative w-16 h-16 flex items-center justify-center mb-8 rounded-[1.5rem] bg-gradient-to-br ${feat.color} shadow-xl`}>
                    {feat.icon}
                  </div>
                  <h3 className="relative font-black text-[#253656] uppercase tracking-widest mb-4 text-lg">
                    {feat.title}
                  </h3>
                  <p className="relative text-[#6C7C98] text-base md:text-lg leading-relaxed font-medium font-['Plus_Jakarta_Sans']">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-b from-[#253656] to-[#1a263d] text-white py-12 w-full font-['Outfit'] border-t border-white/10">
        <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              DIGITAL MEET SYSTEM
            </p>
            <p className="text-base opacity-80 font-['Plus_Jakarta_Sans'] font-medium">© 2026 RC3ID Universitas Padjadjaran.</p>
          </div>
          <div className="md:flex md:justify-end">
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

export function LiveStatsBox({ totalAttending, totalInstitutions }: { totalAttending: number, totalInstitutions: number }) {
  return (
    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-10 shadow-2xl shadow-[#253656]/10 relative overflow-hidden font-['Outfit']">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#BD272D]/20 to-transparent rounded-full blur-2xl"></div>

      <h3 className="font-black text-[#253656] uppercase tracking-[0.15em] mb-8 flex items-center gap-3 text-base border-b border-gray-200/60 pb-5">
        <Activity className="w-6 h-6 text-[#BD272D]" />
        Statistik Live
      </h3>

      <div className="space-y-8">
        <div className="flex items-center gap-6 group cursor-default">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-rose-50 to-rose-100/50 flex items-center justify-center shrink-0 border border-rose-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Users className="w-8 h-8 text-rose-600 drop-shadow-sm" />
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-[#253656] tracking-tighter drop-shadow-sm">{totalAttending}</p>
            <p className="text-sm font-bold text-[#6C7C98] uppercase tracking-[0.15em] mt-2">Peserta Terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-6 group cursor-default">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center shrink-0 border border-blue-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <FileText className="w-8 h-8 text-blue-600 drop-shadow-sm" />
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-[#253656] tracking-tighter drop-shadow-sm">{totalInstitutions}</p>
            <p className="text-sm font-bold text-[#6C7C98] uppercase tracking-[0.15em] mt-2">Instansi Bergabung</p>
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

export function WelcomeQrBox({ event }: { event?: any }) {
  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${event ? `/e/${event.slug}/buku-tamu` : '/buku-tamu'}`
    : 'https://meet.rc3id.id/buku-tamu';

  const [defaultSquareLogo, setDefaultSquareLogo] = useState<string | null>(null);

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

      <h3 className="font-black text-[#253656] uppercase tracking-[0.15em] mb-2 flex items-center gap-3 text-base text-center">
        <QrCode className="w-6 h-6 text-[#BD272D]" />
        Scan untuk Daftar
      </h3>
      <p className="text-xs text-[#6C7C98] font-medium mb-6 text-center">Arahkan kamera HP Anda ke QR di bawah</p>

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

      {/* Live meeting indicator */}
      <div className="w-full bg-gradient-to-r from-[#253656]/5 to-[#BD272D]/5 rounded-2xl px-5 py-3 flex items-center gap-3 border border-[#253656]/10">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <p className="text-xs font-bold text-[#253656] uppercase tracking-wider">Pendaftaran Terbuka</p>
      </div>
    </div>
  );
}
