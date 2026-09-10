import { Link, Head, usePage } from "@inertiajs/react";
import { CheckCircle2, Gift, FileText, Download, ArrowLeft, Volume2, Ticket, Printer, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveStatsBox } from "@/Pages/Welcome";
import { useEffect, useRef, useState } from "react";

const MerchandiseCarousel = () => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-[#253656]/10 animate-fade-in-up mt-4 relative overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#BD272D]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left mb-10 relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-rose-100 rounded-[1.2rem] border border-rose-200 flex items-center justify-center shadow-inner animate-bounce">
            <Gift className="w-7 h-7 text-[#BD272D]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#253656] tracking-tight uppercase">
            HADIAH EKSKLUSIF <span className="text-[#BD272D]">UNTUK ANDA</span>
          </h2>
        </div>
        <p className="text-[#6C7C98] font-medium font-['Plus_Jakarta_Sans'] text-sm md:text-base max-w-2xl">
          Dapatkan salah satu merchandise edisi terbatas khusus pengunjung booth.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        {[
          { name: 'Tote Bag', img: '/merchandise.png', desc: 'Tote bag eksklusif dengan desain minimalis dan logo RC3ID.' },
          { name: 'Mug Keramik', img: '/merch2.png', desc: 'Mug keramik berkualitas dengan logo RC3ID, cocok untuk menemanimu.' },
          { name: 'Lanyard', img: '/merch3.png', desc: 'Lanyard eksklusif dengan desain modern dan logo RC3ID.' }
        ].map((item, i) => (
          <div key={i} className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-[#BD272D]/10 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden">
            {/* Confetti / Sparkles decoration */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-100"></div>
            <div className="absolute top-10 right-6 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-300"></div>
            
            {/* Image Container with floating animation */}
            <div className="w-40 h-40 md:w-48 md:h-48 mb-6 relative flex items-center justify-center animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.5}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full blur-xl scale-75 group-hover:scale-100 transition-transform duration-500"></div>
              <img 
                src={item.img} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f8fafc/64748b?text=${item.name.replace(' ', '+')}`;
                }}
                alt={item.name}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Shine effect on hover */}
              <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] pointer-events-none rounded-full"></div>
            </div>

            {/* Badge & Title */}
            <div className="bg-[#253656] text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4 shadow-md group-hover:bg-[#BD272D] transition-colors duration-300">
              {item.name}
            </div>
            
            <p className="text-slate-500 text-xs font-medium font-['Plus_Jakarta_Sans'] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      
      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default function SuccessPage() {
  const { props } = usePage();
  const config = (props.success_config as any) || {
    success_message: "Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.",
    e_materi_url: "#",
    show_merchandise: true,
    tts_enabled: true,
    tts_text: "Terima kasih sudah mengisi buku tamu kami. Selamat menikmati pameran!",
  };
  const participant = (props.participant as any) || null;

  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fungsi untuk membunyikan suara (Ting-Ting!)
    const playBeep = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        // Nada sukses (C6 lalu E6)
        oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6
        oscillator.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.1); // E6
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch(e) {
        console.log('Audio error:', e);
      }
    };

    // Bunyikan otomatis saat halaman dimuat
    playBeep();

    if (config.tts_enabled && config.tts_text && 'speechSynthesis' in window) {
      const timer = setTimeout(() => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(config.tts_text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.pitch = 1.05;
        utterance.volume = 1;
        utterance.onstart = () => setTtsPlaying(true);
        utterance.onend = () => setTtsPlaying(false);
        utterance.onerror = () => setTtsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const replayTts = () => {
    if ('speechSynthesis' in window && config.tts_text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(config.tts_text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.onstart = () => setTtsPlaying(true);
      utterance.onend = () => setTtsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = () => {
    if (participant?.id) {
      window.open(`/p/${participant.id}`, '_blank');
    }
  };

  // Format date
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-transparent text-[#253656] font-sans selection:bg-[#BD272D] selection:text-white relative flex flex-col">
      <Head title="Pendaftaran Berhasil - RC3ID" />

      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ticket-printable, #ticket-printable * { visibility: visible; }
          #ticket-printable { position: fixed; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      
      {/* Premium Animated Mesh Gradient Background */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#BD272D]/10 to-rose-400/5 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#253656]/10 to-blue-400/5 blur-[150px] animate-[pulse_15s_ease-in-out_infinite_alternate]"></div>
      </div>

      {/* Top Accent Bar */}
      <div className="flex h-2 w-full z-20 relative shrink-0">
        <div className="w-16 bg-[#BD272D]"></div>
        <div className="flex-1 bg-[#253656]"></div>
      </div>

      {/* Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="RC3ID Logo" className="h-8 md:h-10 w-auto" />
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#6C7C98] hover:text-[#253656] transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </header>

      <main className="flex-1 w-full px-4 md:px-8 py-8 flex flex-col items-center font-['Outfit'] relative z-10">

        {/* ===== TOP: Success + Ticket ===== */}
        <div className={`w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] transition-all duration-500 mb-12 ${config.show_digital_ticket !== false ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start' : 'flex flex-col items-center justify-center max-w-3xl mx-auto'}`}>
          
          {/* Left: Success Message */}
          <div className={`flex flex-col items-center h-full justify-center ${config.show_digital_ticket !== false ? 'lg:items-start text-center lg:text-left' : 'text-center'}`}>
            <div className="w-24 h-24 bg-green-50 rounded-full border-[6px] border-green-100 flex items-center justify-center mb-6 shadow-inner relative animate-fade-in-up">
               <div className="absolute inset-0 rounded-full border-4 border-green-400 border-dashed animate-[spin_10s_linear_infinite] opacity-30"></div>
               <CheckCircle2 className="w-12 h-12 text-green-500 relative z-10" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-[#253656] mb-3 tracking-tight drop-shadow-sm">
              Berhasil! 🎉
            </h1>

            {participant && (
              <p className="text-xl font-bold text-[#BD272D] mb-2">
                Halo, {participant.full_name}!
              </p>
            )}

            {/* TTS Indicator (Hidden visually per user request, audio still plays) */}
            {config.tts_enabled && (
              <div className="hidden">
                <Volume2 className="w-4 h-4" />
              </div>
            )}

            <p className="text-base text-[#6C7C98] mb-6 font-medium font-['Plus_Jakarta_Sans'] leading-relaxed max-w-md">
              Data Anda telah tersimpan. {config.success_message}
            </p>

            {/* E-Materi Button */}
            <a 
              href={(config.e_materi_type === 'file' ? config.e_materi_file_url : config.e_materi_url) || '#'} 
              target={(config.e_materi_url || config.e_materi_file_url) ? "_blank" : "_self"} 
              rel="noreferrer" 
              className="w-full sm:w-auto"
              onClick={(e) => {
                if (!config.e_materi_url && !config.e_materi_file_url) {
                  e.preventDefault();
                  setShowComingSoon(true);
                }
              }}
            >
              <Button className="w-full sm:w-auto h-12 px-8 bg-[#253656] hover:bg-[#1a263d] text-white font-bold rounded-xl shadow-xl shadow-[#253656]/20 transition-all duration-300 hover:-translate-y-1">
                <FileText className="w-5 h-5 mr-3 text-blue-300" />
                Unduh E-Materi RC3ID
                <Download className="w-4 h-4 ml-3 opacity-60" />
              </Button>
            </a>

            {/* Games Banner */}
            <div className="mt-6 w-full sm:w-auto bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl animate-bounce">🎮</div>
              <div>
                <p className="text-sm font-black text-amber-800 uppercase tracking-wider mb-0.5">Jangan Lewatkan!</p>
                <p className="text-xs font-bold text-amber-700/80">Ikuti keseruan games lainnya di booth RC3ID.</p>
              </div>
            </div>
          </div>

          {/* Right: Digital Ticket */}
          {config.show_digital_ticket !== false && (
            <div className="flex flex-col gap-4 h-full justify-center w-full max-w-sm mx-auto lg:max-w-none">
              {/* Ticket Card */}
              <div id="ticket-printable" ref={ticketRef} className="relative">
                {/* Glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-[#BD272D]/30 to-[#253656]/30 rounded-[2rem] blur-xl -z-10"></div>
                
                <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-2xl border border-gray-100">
                  {/* Ticket Header */}
                  <div className="bg-gradient-to-r from-[#253656] to-[#1a3566] px-6 py-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#BD272D]/30 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-blue-300 uppercase tracking-[0.25em] font-bold mb-1">TIKET DIGITAL</p>
                        <h3 className="text-white font-black text-lg leading-tight">Booth RC3ID</h3>
                        <p className="text-blue-200 text-xs font-medium">B-IDEAs 2026 Exhibition</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <span className="text-white text-xs font-black tracking-widest">RC3ID</span>
                      </div>
                    </div>
                  </div>

                  {/* Perforated divider */}
                  <div className="relative flex items-center px-4 py-1 bg-slate-50">
                    <div className="w-5 h-5 bg-slate-100 rounded-full absolute -left-3 border border-slate-200"></div>
                    <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-4"></div>
                    <div className="w-5 h-5 bg-slate-100 rounded-full absolute -right-3 border border-slate-200"></div>
                  </div>

                  {/* Ticket Body */}
                  <div className="px-6 py-5 space-y-4">
                    {participant ? (
                      <>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Nama Lengkap</p>
                            <p className="font-black text-[#253656] text-lg leading-tight">{participant.full_name}</p>
                          </div>
                          {participant.institution && (
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Institusi</p>
                              <p className="font-semibold text-[#253656] text-sm">{participant.institution}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Tanggal</p>
                              <p className="font-bold text-[#253656] text-xs">{dateStr}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Pukul</p>
                              <p className="font-bold text-[#253656] text-xs">{timeStr} WIB</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm ${
                          participant.is_attending
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          <span className="relative flex h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${participant.is_attending ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${participant.is_attending ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          </span>
                          {participant.is_attending ? '✓ Kehadiran Terverifikasi' : '⏳ Menunggu Verifikasi Staf'}
                        </div>

                        {/* Ticket ID */}
                        <div className="border-t border-dashed border-slate-200 pt-3 flex items-center justify-between">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID Tiket</p>
                          <p className="font-black text-[#253656] text-sm tracking-widest">#{String(participant.id).padStart(5, '0')}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-slate-400 text-sm">
                        <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>Data tiket tidak tersedia</p>
                      </div>
                    )}
                  </div>

                  {/* Ticket Footer */}
                  <div className="bg-gradient-to-r from-[#BD272D] to-[#991f24] px-6 py-3">
                    <p className="text-white/80 text-[10px] text-center font-bold tracking-widest uppercase">
                      Tunjukkan tiket ini kepada staf booth untuk klaim merchandise
                    </p>
                  </div>
                </div>
              </div>

              {/* Download/Print buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrintTicket}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#253656] text-[#253656] font-bold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Tiket
                </button>
                {participant?.id && (
                  <button
                    onClick={handleDownloadTicket}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#253656] hover:bg-[#1a263d] text-white font-bold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#253656]/20"
                  >
                    <Download className="w-4 h-4" />
                    Lihat Tiket Digital
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Merchandise Section (Full Width Showcase) */}
        {config.show_merchandise && (
          <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] transition-all duration-500 mb-12">
            <MerchandiseCarousel />
          </div>
        )}

        {/* Optional Stats Sections */}
        {/* Live Stats ALWAYS SHOWN */}
        <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] transition-all duration-500 mb-12">
          <LiveStatsBox totalAttending={props.totalAttending as number} totalInstitutions={props.totalInstitutions as number || 0} />
        </div>

        {config.show_live_stats && (
          <>
            {/* RC3ID Info Section */}
            <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] transition-all duration-500 mb-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#253656]/5 to-[#BD272D]/5 rounded-[2.5rem] blur-xl"></div>
                <div className="relative bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-[#253656]/10 overflow-hidden font-['Outfit']">
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#253656_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#BD272D]/10 to-transparent rounded-full blur-3xl"></div>

                  <div className="relative z-10 text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BD272D]/10 text-[#BD272D] text-xs font-black uppercase tracking-[0.2em] mb-4">
                      🔬 Tentang RC3ID UNPAD
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#253656] tracking-tight">
                      Riset Kelas Dunia dari <span className="text-[#BD272D]">Bandung</span>
                    </h2>
                    <p className="text-[#6C7C98] mt-3 font-medium font-['Plus_Jakarta_Sans'] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                      Research Center for Care and Control of Infectious Diseases, Universitas Padjadjaran — garda terdepan dalam penanggulangan penyakit infeksi di Indonesia.
                    </p>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                      { value: config.stat_tahun_berdiri || "2017", label: "Tahun Berdiri", icon: "🏛️", color: "from-blue-50 to-blue-100/50", border: "border-blue-200", text: "text-blue-700" },
                      { value: config.stat_kelompok_riset || "3", label: "Kelompok Riset", icon: "🔬", color: "from-red-50 to-red-100/50", border: "border-red-200", text: "text-[#BD272D]" },
                      { value: config.stat_publikasi || "100+", label: "Publikasi Ilmiah", icon: "📄", color: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200", text: "text-emerald-700" },
                      { value: config.stat_nama_univ || "UNPAD", label: "Universitas Padjadjaran", icon: "🎓", color: "from-amber-50 to-amber-100/50", border: "border-amber-200", text: "text-amber-700" },
                    ].map((stat, i) => (
                      <div key={i} className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-4 md:p-5 text-center hover:scale-105 transition-transform duration-300`}>
                        <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                        <p className={`text-xl md:text-2xl font-black ${stat.text} tracking-tight`}>{stat.value}</p>
                        <p className="text-xs font-bold text-[#6C7C98] uppercase tracking-wider mt-1 leading-tight">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: "🦠", title: "Tuberkulosis (TB)", desc: "Riset diagnostik, terapi, dan pencegahan TB termasuk TB-RO dengan pendekatan One Health.", color: "from-[#253656] to-[#1a263d]" },
                      { icon: "🩸", title: "HIV", desc: "Penelitian tatalaksana HIV, resistansi obat, dan upaya penurunan angka kejadian baru di komunitas.", color: "from-[#BD272D] to-[#991f24]" },
                      { icon: "🦟", title: "DF-ONE (Dengue & Febrile)", desc: "Studi Dengue dan penyakit febril lainnya dengan inovasi uji diagnostik cepat berbasis data.", color: "from-[#1a6b5a] to-[#144d40]" },
                    ].map((focus, i) => (
                      <div key={i} className={`bg-gradient-to-br ${focus.color} rounded-2xl p-5 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                        <div className="text-3xl mb-3">{focus.icon}</div>
                        <h3 className="font-black text-white text-sm uppercase tracking-wider mb-2">{focus.title}</h3>
                        <p className="text-white/75 text-xs font-medium font-['Plus_Jakarta_Sans'] leading-relaxed">{focus.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#6C7C98] font-medium font-['Plus_Jakarta_Sans'] text-center sm:text-left">
                      Ikuti perkembangan riset & inovasi terbaru RC3ID melalui kanal resmi kami.
                    </p>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <a href="https://rc3id.unpad.ac.id" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-[#253656] text-white text-xs font-bold hover:bg-[#1a263d] transition-colors shadow-md">🌐 Website</a>
                      <a href="https://instagram.com/rc3id.unpad" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-[#BD272D] text-white text-xs font-bold hover:bg-[#991f24] transition-colors shadow-md">📸 Instagram</a>
                      <a href="https://youtube.com/@RC3IDUniversitasPadjadjaran" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-[#1a6b5a] text-white text-xs font-bold hover:bg-[#144d40] transition-colors shadow-md">🎥 YouTube</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Coming Soon Modal */}
        {showComingSoon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowComingSoon(false)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up border border-slate-100">
              <button 
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-[6px] border-blue-100 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-300 border-dashed animate-[spin_8s_linear_infinite] opacity-50"></div>
                  <Info className="w-8 h-8 text-blue-500 relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-[#253656] mb-3 tracking-tight">Segera Hadir!</h3>
                <p className="text-[15px] text-[#6C7C98] mb-8 font-medium font-['Plus_Jakarta_Sans'] leading-relaxed">
                  Materi presentasi dan e-book sedang dalam tahap penyelesaian dan akan segera bisa Anda unduh.
                </p>
                <Button 
                  onClick={() => setShowComingSoon(false)}
                  className="w-full h-12 bg-[#253656] hover:bg-[#1a263d] text-white font-bold rounded-xl shadow-xl shadow-[#253656]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  Tutup Notifikasi
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
