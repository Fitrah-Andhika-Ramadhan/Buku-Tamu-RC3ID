import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";
import { Head, useForm } from "@inertiajs/react";
import { Save, Monitor } from "lucide-react";
import { useEffect } from "react";

export default function LandingConfig({ config }: { config: any }) {
  const { data, setData, post, processing, errors } = useForm({
    badge_text: config?.badge_text || '',
    title_line1: config?.title_line1 || '',
    title_gradient: config?.title_gradient || '',
    title_line2: config?.title_line2 || '',
    description_html: config?.description_html || '',
  });

  useEffect(() => {
    setData({
      badge_text: config?.badge_text || '',
      title_line1: config?.title_line1 || '',
      title_gradient: config?.title_gradient || '',
      title_line2: config?.title_line2 || '',
      description_html: config?.description_html || '',
    });
  }, [config]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.landing.config.save'));
  };

  return (
    <AdminLayoutWrapper>
      <Head title="Landing Page Config" />

      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Landing Page Manager</h1>
          <p className="text-slate-500 mt-1">Atur teks dan konten untuk halaman utama (Welcome Page).</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Teks Utama (Hero Section)</h2>
              <p className="text-sm text-slate-500">Konfigurasi teks pada bagian hero halaman depan.</p>
            </div>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Badge Text</label>
              <input
                type="text"
                value={data.badge_text}
                onChange={e => setData('badge_text', e.target.value)}
                className="w-full rounded-xl border-slate-200 focus:ring-[#BD272D] focus:border-[#BD272D]"
                placeholder="Misal: RC3ID pada B-IDEAs 2026 Exhibition"
              />
              <p className="text-xs text-slate-500 mt-1">Teks dalam kotak kecil di atas judul utama.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Baris Judul 1 (Teks Biasa)</label>
                <input
                  type="text"
                  value={data.title_line1}
                  onChange={e => setData('title_line1', e.target.value)}
                  className="w-full rounded-xl border-slate-200 focus:ring-[#BD272D] focus:border-[#BD272D]"
                  placeholder="Misal: ADVANCING"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Baris Judul Gradient (Berwarna)</label>
                <input
                  type="text"
                  value={data.title_gradient}
                  onChange={e => setData('title_gradient', e.target.value)}
                  className="w-full rounded-xl border-slate-200 focus:ring-[#BD272D] focus:border-[#BD272D]"
                  placeholder="Misal: EARLY DETECTION"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Baris Judul 2 (Subtitle Besar)</label>
              <input
                type="text"
                value={data.title_line2}
                onChange={e => setData('title_line2', e.target.value)}
                className="w-full rounded-xl border-slate-200 focus:ring-[#BD272D] focus:border-[#BD272D]"
                placeholder="Misal: FOR BETTER INFECTIOUS DISEASE CONTROL"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi (Mendukung HTML)</label>
              <textarea
                value={data.description_html}
                onChange={e => setData('description_html', e.target.value)}
                rows={4}
                className="w-full rounded-xl border-slate-200 focus:ring-[#BD272D] focus:border-[#BD272D] font-mono text-sm"
                placeholder="Gunakan tag HTML seperti <strong> untuk teks tebal..."
              />
              <p className="text-xs text-slate-500 mt-1">Gunakan &lt;br/&gt; untuk garis baru, &lt;strong&gt; untuk tebal.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 bg-[#BD272D] hover:bg-[#991f24] text-white px-6 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 shadow-sm shadow-[#BD272D]/20"
              >
                <Save className="w-5 h-5" />
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
