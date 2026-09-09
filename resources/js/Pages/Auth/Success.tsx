import { Link, Head, usePage } from "@inertiajs/react";
import { CheckCircle2, Gift, FileText, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveStatsBox } from "@/Pages/Welcome";

export default function SuccessPage() {
  const { props } = usePage();
  // We'll pass success_config from Controller later, but for now we can provide defaults
  const config = (props.success_config as any) || {
    success_message: "Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.",
    e_materi_url: "#",
    show_merchandise: true,
  };

  return (
    <div className="min-h-screen bg-transparent text-[#253656] font-sans selection:bg-[#BD272D] selection:text-white relative flex flex-col">
      <Head title="Pendaftaran Berhasil - RC3ID" />
      
      {/* Premium Animated Mesh Gradient Background */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        
        {/* Dynamic Glowing Orbs */}
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

      <main className="flex-1 w-full px-4 md:px-8 py-8 flex flex-col items-center justify-center font-['Outfit'] relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Success Message & E-Materi */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 bg-green-50 rounded-full border-[6px] border-green-100 flex items-center justify-center mb-8 shadow-inner relative animate-fade-in-up">
               <div className="absolute inset-0 rounded-full border-4 border-green-400 border-dashed animate-[spin_10s_linear_infinite] opacity-30"></div>
               <CheckCircle2 className="w-12 h-12 text-green-500 relative z-10" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-[#253656] mb-4 tracking-tight drop-shadow-sm">
              Berhasil!
            </h1>
            <p className="text-lg text-[#6C7C98] mb-8 font-medium font-['Plus_Jakarta_Sans'] leading-relaxed max-w-md">
              Data Anda telah tersimpan di sistem kami. {config.success_message}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href={config.e_materi_type === 'file' ? config.e_materi_file_url : config.e_materi_url} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 bg-[#253656] hover:bg-[#1a263d] text-white font-bold rounded-xl shadow-xl shadow-[#253656]/20 transition-all duration-300 hover:-translate-y-1">
                  <FileText className="w-5 h-5 mr-3 text-blue-300" />
                  Unduh E-Materi RC3ID
                  <Download className="w-4 h-4 ml-3 opacity-60" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Merchandise Showcase */}
          {config.show_merchandise && (
            <div className="w-full relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#BD272D]/20 to-purple-500/20 rounded-[2.5rem] blur-2xl transform group-hover:scale-105 transition-transform duration-700 -z-10"></div>
              <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-4 rounded-[2.5rem] shadow-2xl shadow-[#253656]/15 transform transition-all duration-500 group-hover:rotate-y-2 group-hover:rotate-x-2">
                <div className="bg-gradient-to-br from-slate-100 to-white rounded-[2rem] overflow-hidden border border-white relative aspect-square md:aspect-[4/5] flex flex-col">
                  {/* Glowing header badge */}
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#BD272D]"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BD272D]"></span>
                    </span>
                    <span className="text-xs font-black text-[#253656] tracking-widest uppercase">Eksklusif</span>
                  </div>

                  {/* Merchandise Photo Placeholder - Using an actual image file instead of placeholder */}
                  <div className="flex-1 relative w-full overflow-hidden bg-slate-200">
                      <img src="/merchandise.png" alt="Merchandise Eksklusif RC3ID" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Info bar at the bottom */}
                  <div className="bg-white p-6 relative z-10 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <h3 className="font-black text-[#253656] text-xl mb-1 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-[#BD272D]" /> Koleksi Merchandise
                    </h3>
                    <p className="text-[#6C7C98] text-sm font-medium font-['Plus_Jakarta_Sans']">Dapatkan Tote Bag, Mug Keramik, atau Lanyard edisi terbatas khusus pengunjung booth.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Render Live Stats Box below the success content */}
        <div className="w-full max-w-4xl mt-12 mb-8">
          <LiveStatsBox totalParticipants={props.totalParticipants as number} totalAttending={props.totalAttending as number} />
        </div>

        {/* RC3ID UNPAD Stats Section */}
        <div className="w-full max-w-4xl mb-16">
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#253656]/5 to-[#BD272D]/5 rounded-[2.5rem] blur-xl"></div>

            <div className="relative bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-[#253656]/10 overflow-hidden font-['Outfit']">
              {/* Decorative dots pattern */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#253656_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#BD272D]/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-[#253656]/10 to-transparent rounded-full blur-3xl"></div>

              {/* Header */}
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

              {/* Stats Grid */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { value: "2017", label: "Tahun Berdiri", icon: "🏛️", color: "from-blue-50 to-blue-100/50", border: "border-blue-200", text: "text-blue-700" },
                  { value: "3", label: "Kelompok Riset", icon: "🔬", color: "from-red-50 to-red-100/50", border: "border-red-200", text: "text-[#BD272D]" },
                  { value: "100+", label: "Publikasi Ilmiah", icon: "📄", color: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200", text: "text-emerald-700" },
                  { value: "UNPAD", label: "Universitas Padjadjaran", icon: "🎓", color: "from-amber-50 to-amber-100/50", border: "border-amber-200", text: "text-amber-700" },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-4 md:p-5 text-center group hover:scale-105 transition-transform duration-300`}>
                    <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                    <p className={`text-xl md:text-2xl font-black ${stat.text} tracking-tight`}>{stat.value}</p>
                    <p className="text-xs font-bold text-[#6C7C98] uppercase tracking-wider mt-1 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Research Focus */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: "🦠",
                    title: "Tuberkulosis (TB)",
                    desc: "Riset diagnostik, terapi, dan pencegahan TB termasuk TB-RO dengan pendekatan One Health.",
                    color: "from-[#253656] to-[#1a263d]",
                  },
                  {
                    icon: "🩸",
                    title: "HIV",
                    desc: "Penelitian tatalaksana HIV, resistansi obat, dan upaya penurunan angka kejadian baru di komunitas.",
                    color: "from-[#BD272D] to-[#991f24]",
                  },
                  {
                    icon: "🦟",
                    title: "DF-ONE (Dengue & Febrile)",
                    desc: "Studi Dengue dan penyakit febril lainnya dengan inovasi uji diagnostik cepat berbasis data.",
                    color: "from-[#1a6b5a] to-[#144d40]",
                  },
                ].map((focus, i) => (
                  <div key={i} className={`bg-gradient-to-br ${focus.color} rounded-2xl p-5 text-white group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="text-3xl mb-3">{focus.icon}</div>
                    <h3 className="font-black text-white text-sm uppercase tracking-wider mb-2">{focus.title}</h3>
                    <p className="text-white/75 text-xs font-medium font-['Plus_Jakarta_Sans'] leading-relaxed">{focus.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
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
      </main>
    </div>
  );
}
