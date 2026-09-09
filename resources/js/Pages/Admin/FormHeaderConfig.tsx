import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";
import { Save, Plus, Trash2, CheckCircle2, FileText, Link } from "lucide-react";

interface SocialLink {
  emoji: string;
  label: string;
  url: string;
}

interface FormHeaderConfig {
  title_line1: string;
  title_line2: string;
  description: string;
  social_links: SocialLink[];
  show_banner?: boolean;
  show_welcome_qr?: boolean;
  banner_image_path?: string | null;
}

export default function FormHeaderConfig({ config }: { config: FormHeaderConfig }) {
  const [formData, setFormData] = useState<FormHeaderConfig>({
    title_line1: config.title_line1 || "Form Buku Tamu",
    title_line2: config.title_line2 || "Booth RC3ID",
    description: config.description || "",
    social_links: config.social_links || [],
    show_banner: config.show_banner ?? true,
    show_welcome_qr: config.show_welcome_qr ?? true,
    banner_image_path: config.banner_image_path || null,
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(config.banner_image_path || null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    router.post(route("admin.form.header.save"), {
      ...formData,
      banner_image: bannerFile,
    } as any, {
      preserveScroll: true,
      forceFormData: true,
      onFinish: () => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      social_links: [...formData.social_links, { emoji: "🌐", label: "", url: "" }],
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = formData.social_links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setFormData({ ...formData, social_links: updated });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      social_links: formData.social_links.filter((_, i) => i !== index),
    });
  };

  return (
    <AdminLayoutWrapper title="Header Form">
      <div className="max-w-3xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#253656] flex items-center gap-2">
            Desain & Header Form
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Sesuaikan tampilan awal form buku tamu dan halaman depan.</p>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-r from-[#253656] to-[#1a263d] rounded-2xl p-6 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-t-xl overflow-hidden shadow-lg border-b-4 border-[#BD272D]">
            {formData.show_banner && bannerPreviewUrl && (
              <img src={bannerPreviewUrl} alt="Banner" className="w-full h-auto object-cover" />
            )}
            <div className="p-8 text-center bg-slate-50">
              <h2 className="text-3xl font-black text-[#253656] leading-tight">
                {formData.title_line1 || "Form Buku Tamu"} <br />
                <span className="text-[#BD272D]">{formData.title_line2 || "Booth RC3ID"}</span>
              </h2>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed whitespace-pre-line px-4">{formData.description?.split('\n')[0]}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Halaman Depan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#253656] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Tampilan Halaman Depan
                </h2>
                <p className="text-xs text-slate-500 mt-1">Atur QR Code akses cepat di halaman awal web.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium text-slate-600">Tampilkan QR Code</span>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#BD272D] rounded border-slate-300 focus:ring-[#BD272D]"
                  checked={formData.show_welcome_qr}
                  onChange={(e) => setFormData({ ...formData, show_welcome_qr: e.target.checked })}
                />
              </label>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#253656] flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" /> Banner Form (Opsional)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium text-slate-600">Tampilkan Banner</span>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#BD272D] rounded border-slate-300 focus:ring-[#BD272D]"
                  checked={formData.show_banner}
                  onChange={(e) => setFormData({ ...formData, show_banner: e.target.checked })}
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Gambar Banner (Lebar direkomendasikan)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all bg-slate-50 text-sm"
              />
              {bannerPreviewUrl && (
                <p className="text-xs text-green-600 font-medium">Banner berhasil dimuat. Cek preview di atas.</p>
              )}
            </div>
          </div>
          {/* Title */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-[#253656] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#BD272D]" /> Judul Form
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Baris Pertama (putih)</label>
                <input
                  type="text"
                  value={formData.title_line1}
                  onChange={(e) => setFormData({ ...formData, title_line1: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm"
                  placeholder="Form Buku Tamu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Baris Kedua (merah)</label>
                <input
                  type="text"
                  value={formData.title_line2}
                  onChange={(e) => setFormData({ ...formData, title_line2: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm"
                  placeholder="Booth RC3ID"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="font-bold text-[#253656] flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Teks Deskripsi / Sambutan
            </h2>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm"
              placeholder="Selamat datang di booth RC3ID..."
            />
            <p className="text-xs text-slate-400">Gunakan baris kosong (Enter 2x) untuk memisahkan paragraf.</p>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#253656] flex items-center gap-2">
                <Link className="w-4 h-4 text-green-500" /> Tautan Sosial Media
              </h2>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#253656] bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Link
              </button>
            </div>

            {formData.social_links.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Belum ada link. Klik "Tambah Link" untuk menambahkan.
              </p>
            )}

            <div className="space-y-3">
              {formData.social_links.map((link, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    value={link.emoji}
                    onChange={(e) => updateSocialLink(index, "emoji", e.target.value)}
                    className="w-14 px-2 py-2 border border-slate-200 rounded-lg text-center text-lg bg-white"
                    placeholder="🌐"
                    maxLength={2}
                  />
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D]"
                    placeholder="Label (contoh: @rc3id.unpad)"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                    className="flex-[2] px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D]"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#253656] hover:bg-[#1a263d] text-white font-bold rounded-xl shadow-md shadow-[#253656]/20 transition-all disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayoutWrapper>
  );
}
