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
}

export default function FormHeaderConfig({ config }: { config: FormHeaderConfig }) {
  const [formData, setFormData] = useState<FormHeaderConfig>({
    title_line1: config.title_line1 || "Form Buku Tamu",
    title_line2: config.title_line2 || "Booth RC3ID",
    description: config.description || "",
    social_links: config.social_links || [],
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(route("admin.form.header.save"), formData as any, {
      preserveScroll: true,
      onFinish: () => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
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
    <AdminLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#253656]">Pengaturan Header Form</h1>
            <p className="text-slate-500 mt-1">Atur teks judul, deskripsi, dan tautan sosial media yang tampil di bagian atas form buku tamu.</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-bold">Tersimpan!</span>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-r from-[#253656] to-[#1a263d] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          <div className="relative z-10">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-3 font-bold">Preview</p>
            <h2 className="text-2xl font-black text-white leading-tight">
              {formData.title_line1 || "Form Buku Tamu"} <br />
              <span className="text-[#BD272D]">{formData.title_line2 || "Booth RC3ID"}</span>
            </h2>
            <p className="text-blue-200 text-sm mt-3 line-clamp-2 whitespace-pre-line">{formData.description?.split('\n')[0]}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.social_links.slice(0, 3).map((link, i) => (
                <span key={i} className="text-xs text-blue-200">{link.emoji} {link.label}</span>
              ))}
              {formData.social_links.length > 3 && <span className="text-xs text-blue-300">+{formData.social_links.length - 3} lainnya</span>}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
