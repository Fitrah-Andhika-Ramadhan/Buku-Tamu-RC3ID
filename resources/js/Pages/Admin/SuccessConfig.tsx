import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";
import { CheckCircle2, FileText, Gift, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessConfig({ config }: { config: any }) {
  const [formData, setFormData] = useState({
    success_message: config.success_message || "",
    e_materi_type: config.e_materi_type || "url",
    e_materi_url: config.e_materi_url || "",
    show_merchandise: config.show_merchandise ?? true,
    e_materi_file: null as File | null,
    merchandise_photo: null as File | null,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // We must use FormData because we are uploading files
    const data = new FormData();
    data.append("success_message", formData.success_message);
    data.append("e_materi_type", formData.e_materi_type);
    data.append("e_materi_url", formData.e_materi_url || "");
    data.append("show_merchandise", formData.show_merchandise ? "1" : "0");
    if (formData.e_materi_file) {
      data.append("e_materi_file", formData.e_materi_file);
    }
    if (formData.merchandise_photo) {
      data.append("merchandise_photo", formData.merchandise_photo);
    }

    router.post('/admin/success-config', data, {
      preserveScroll: true,
      onFinish: () => setSaving(false),
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#253656]">Pengaturan Halaman Sukses</h1>
          <p className="text-slate-500 mt-1">Atur pesan dan link e-materi yang akan ditampilkan setelah pengunjung mengisi buku tamu.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            
            {/* Success Message */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#253656] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Pesan Sukses / Instruksi
              </label>
              <textarea
                value={formData.success_message}
                onChange={(e) => setFormData({ ...formData, success_message: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm min-h-[100px]"
                placeholder="Masukkan instruksi setelah mendaftar..."
                required
              />
              <p className="text-xs text-slate-400">Pesan ini akan muncul di bawah tanda centang besar pada halaman sukses.</p>
            </div>

            <hr className="border-slate-100" />

            {/* E-Materi Type & Link/File */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-sm font-bold text-[#253656] flex items-center gap-2">
                   <FileText className="w-4 h-4 text-blue-500" /> Pengaturan E-Materi
                 </label>
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                   <button 
                     type="button" 
                     onClick={() => setFormData({...formData, e_materi_type: 'url'})}
                     className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${formData.e_materi_type === 'url' ? 'bg-white shadow text-[#BD272D]' : 'text-slate-500 hover:text-slate-700'}`}
                   >Link Eksternal</button>
                   <button 
                     type="button" 
                     onClick={() => setFormData({...formData, e_materi_type: 'file'})}
                     className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${formData.e_materi_type === 'file' ? 'bg-white shadow text-[#BD272D]' : 'text-slate-500 hover:text-slate-700'}`}
                   >Unggah File</button>
                 </div>
              </div>

              {formData.e_materi_type === 'url' ? (
                <div>
                  <input
                    type="url"
                    value={formData.e_materi_url}
                    onChange={(e) => setFormData({ ...formData, e_materi_url: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm"
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-xs text-slate-400 mt-2">Tautan (URL) menuju Google Drive atau Dropbox yang berisi materi.</p>
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 bg-slate-50 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, e_materi_file: e.target.files ? e.target.files[0] : null })}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {config.e_materi_file_url && !formData.e_materi_file && (
                    <p className="text-xs text-green-600 mt-2">File materi saat ini sudah diunggah. Pilih file baru untuk menggantinya.</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">Unggah file PDF atau presentasi langsung ke server.</p>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Merchandise Toggle & Photo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="text-sm font-bold text-[#253656] flex items-center gap-2 mb-1">
                    <Gift className="w-4 h-4 text-[#BD272D]" /> Tampilkan Info Merchandise
                  </label>
                  <p className="text-xs text-slate-500">Tampilkan foto merchandise dan teks klaim di sebelah kanan halaman sukses.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.show_merchandise}
                    onChange={(e) => setFormData({ ...formData, show_merchandise: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BD272D]"></div>
                </label>
              </div>

              {formData.show_merchandise && (
                <div className="pl-4 border-l-2 border-[#BD272D]/20">
                  <label className="text-sm font-bold text-[#253656] block mb-2">Ganti Foto Merchandise</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, merchandise_photo: e.target.files ? e.target.files[0] : null })}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                  />
                  {config.merchandise_photo_url && !formData.merchandise_photo && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-2">Foto saat ini:</p>
                      <img src={config.merchandise_photo_url} alt="Current Merch" className="h-20 w-20 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#253656] hover:bg-[#1a263d] text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-[#253656]/20"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayoutWrapper>
  );
}
