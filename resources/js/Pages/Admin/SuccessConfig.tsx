import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";
import { CheckCircle2, FileText, Gift, Save, Ticket, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessConfig({ config }: { config: any }) {
  const [formData, setFormData] = useState({
    success_message: config.success_message || "",
    e_materi_type: config.e_materi_type || "url",
    e_materi_url: config.e_materi_url || "",
    show_merchandise: config.show_merchandise ?? true,
    show_digital_ticket: config.show_digital_ticket ?? true,
    tts_enabled: config.tts_enabled ?? true,
    tts_text: config.tts_text || "Terima kasih sudah mengisi buku tamu kami. Selamat menikmati pameran!",
    show_live_stats: config.show_live_stats ?? false,
    stat_tahun_berdiri: config.stat_tahun_berdiri || "2017",
    stat_kelompok_riset: config.stat_kelompok_riset || "3",
    stat_publikasi: config.stat_publikasi || "100+",
    stat_nama_univ: config.stat_nama_univ || "UNPAD",
    e_materi_file: null as File | null,
    merchandise_display_mode: config.merchandise_display_mode || "carousel",
    merchandise_photo_url: config.merchandise_photo_url || "",
    merchandise_photo: null as File | null,
    merchandise_items: config.merchandise_items || [],
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
    data.append("show_digital_ticket", formData.show_digital_ticket ? "1" : "0");
    data.append("tts_enabled", formData.tts_enabled ? "1" : "0");
    data.append("tts_text", formData.tts_text || "");
    data.append("show_live_stats", formData.show_live_stats ? "1" : "0");
    data.append("stat_tahun_berdiri", formData.stat_tahun_berdiri);
    data.append("stat_kelompok_riset", formData.stat_kelompok_riset);
    data.append("stat_publikasi", formData.stat_publikasi);
    data.append("stat_nama_univ", formData.stat_nama_univ);
    if (formData.e_materi_file) {
      data.append("e_materi_file", formData.e_materi_file);
    }
    
    data.append("merchandise_display_mode", formData.merchandise_display_mode);
    if (formData.merchandise_photo) {
      data.append("merchandise_photo", formData.merchandise_photo);
    }
    if (formData.merchandise_items && formData.merchandise_items.length > 0) {
      formData.merchandise_items.forEach((item: any, index: number) => {
        data.append(`merchandise_items[${index}][id]`, item.id || String(Date.now() + index));
        data.append(`merchandise_items[${index}][name]`, item.name || "");
        data.append(`merchandise_items[${index}][desc]`, item.desc || "");
        data.append(`merchandise_items[${index}][img]`, item.img || "");
        if (item.file) {
          data.append(`merchandise_items[${index}][file]`, item.file);
        }
      });
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
            
            {/* TTS Sound Setting */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="text-sm font-bold text-[#253656] flex items-center gap-2 mb-1">
                    🔊 Suara Ucapan Terima Kasih (Text-to-Speech)
                  </label>
                  <p className="text-xs text-slate-500">Aktifkan suara yang diputar otomatis setelah pengunjung berhasil mendaftar.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.tts_enabled}
                    onChange={(e) => setFormData({ ...formData, tts_enabled: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {formData.tts_enabled && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teks yang akan diucapkan</label>
                  <textarea
                    value={formData.tts_text}
                    onChange={(e) => setFormData({ ...formData, tts_text: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all bg-slate-50 text-sm"
                    placeholder="Terima kasih sudah mengisi buku tamu kami..."
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">Teks ini akan dibacakan oleh browser setelah submit berhasil.</p>
                    <button
                      type="button"
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const u = new SpeechSynthesisUtterance(formData.tts_text);
                          u.lang = 'id-ID';
                          u.rate = 0.95;
                          window.speechSynthesis.speak(u);
                        }
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 border border-amber-300 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      🔊 Test Suara
                    </button>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

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

            {/* Digital Ticket Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="text-sm font-bold text-[#253656] flex items-center gap-2 mb-1">
                    <Ticket className="w-4 h-4 text-blue-500" /> Tampilkan Tiket Digital
                  </label>
                  <p className="text-xs text-slate-500">Tampilkan kartu tiket digital di sebelah kanan halaman sukses yang bisa di-print/download.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.show_digital_ticket}
                    onChange={(e) => setFormData({ ...formData, show_digital_ticket: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
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
                <div className="pl-4 border-l-2 border-[#BD272D]/20 mt-4 space-y-4">
                  <div className="space-y-2 mb-6">
                    <label className="text-sm font-bold text-[#253656]">Pilih Mode Tampilan</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${formData.merchandise_display_mode === 'carousel' ? 'border-[#BD272D] bg-[#BD272D]/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <input 
                            type="radio" 
                            name="merch_mode" 
                            checked={formData.merchandise_display_mode === 'carousel'}
                            onChange={() => setFormData({...formData, merchandise_display_mode: 'carousel'})}
                            className="text-[#BD272D] focus:ring-[#BD272D]"
                          />
                          <span className="font-bold text-sm text-[#253656]">List Dinamis (Carousel)</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">Upload beberapa foto terpisah. Halaman akan menyesuaikan grid otomatis.</p>
                      </label>
                      <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${formData.merchandise_display_mode === 'single' ? 'border-[#BD272D] bg-[#BD272D]/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <input 
                            type="radio" 
                            name="merch_mode" 
                            checked={formData.merchandise_display_mode === 'single'}
                            onChange={() => setFormData({...formData, merchandise_display_mode: 'single'})}
                            className="text-[#BD272D] focus:ring-[#BD272D]"
                          />
                          <span className="font-bold text-sm text-[#253656]">Satu Gambar Klasik</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">Satu gambar besar menyamping dengan desain klasik bawaan.</p>
                      </label>
                    </div>
                  </div>

                  {formData.merchandise_display_mode === 'single' ? (
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <label className="text-sm font-bold text-[#253656]">Upload Foto Merchandise (Satu Gambar)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            setFormData({ ...formData, merchandise_photo: file });
                          }}
                          className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#253656]/5 file:text-[#253656] hover:file:bg-[#253656]/10 cursor-pointer"
                        />
                        {(formData.merchandise_photo || formData.merchandise_photo_url) && (
                          <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center">
                            <img 
                              src={formData.merchandise_photo ? URL.createObjectURL(formData.merchandise_photo) : formData.merchandise_photo_url} 
                              alt="Preview" 
                              className="h-full w-full object-contain" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mt-2">
                        <label className="text-sm font-bold text-[#253656]">Daftar Merchandise</label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              merchandise_items: [
                                ...formData.merchandise_items,
                                { id: String(Date.now()), name: '', desc: '', img: '', file: null }
                              ]
                            });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#BD272D]/10 text-[#BD272D] hover:bg-[#BD272D]/20 transition-colors rounded-lg text-xs font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah Item
                        </button>
                      </div>

                      {formData.merchandise_items.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-sm text-slate-500">Belum ada merchandise yang ditambahkan.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                      {formData.merchandise_items.map((item: any, index: number) => (
                        <div key={item.id || index} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm relative group">
                          
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nama Merchandise</label>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const newItems = [...formData.merchandise_items];
                                    newItems[index].name = e.target.value;
                                    setFormData({ ...formData, merchandise_items: newItems });
                                  }}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] text-sm"
                                  placeholder="Contoh: Tote Bag"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Deskripsi Singkat</label>
                                <input
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const newItems = [...formData.merchandise_items];
                                    newItems[index].desc = e.target.value;
                                    setFormData({ ...formData, merchandise_items: newItems });
                                  }}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] text-sm"
                                  placeholder="Contoh: Tote bag eksklusif..."
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Foto Merchandise</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    const newItems = [...formData.merchandise_items];
                                    newItems[index].file = file;
                                    
                                    if (file) {
                                      // Create a temporary local URL for preview
                                      newItems[index].preview = URL.createObjectURL(file);
                                    } else {
                                      newItems[index].preview = null;
                                    }
                                    
                                    setFormData({ ...formData, merchandise_items: newItems });
                                  }}
                                  className="flex-1 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                                />
                                
                                {(item.preview || item.img) && (
                                  <div className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                                    <img src={item.preview || item.img} alt="Preview" className="h-full w-full object-contain" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-6">
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = formData.merchandise_items.filter((_: any, i: number) => i !== index);
                                setFormData({ ...formData, merchandise_items: newItems });
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* RC3ID Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="text-sm font-bold text-[#253656] flex items-center gap-2 mb-1">
                    📊 Tampilkan Statistik RC3ID (Halaman Sukses)
                  </label>
                  <p className="text-xs text-slate-500">Tampilkan section statistik RC3ID di bagian bawah halaman sukses.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.show_live_stats}
                    onChange={(e) => setFormData({ ...formData, show_live_stats: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BD272D]"></div>
                </label>
              </div>

              {formData.show_live_stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-4 border-l-2 border-[#BD272D]/20 mt-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Berdiri</label>
                    <input
                      type="text"
                      value={formData.stat_tahun_berdiri}
                      onChange={(e) => setFormData({ ...formData, stat_tahun_berdiri: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm font-bold text-center"
                      placeholder="2017"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelompok Riset</label>
                    <input
                      type="text"
                      value={formData.stat_kelompok_riset}
                      onChange={(e) => setFormData({ ...formData, stat_kelompok_riset: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm font-bold text-center"
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publikasi Ilmiah</label>
                    <input
                      type="text"
                      value={formData.stat_publikasi}
                      onChange={(e) => setFormData({ ...formData, stat_publikasi: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm font-bold text-center"
                      placeholder="100+"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Universitas</label>
                    <input
                      type="text"
                      value={formData.stat_nama_univ}
                      onChange={(e) => setFormData({ ...formData, stat_nama_univ: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50 text-sm font-bold text-center"
                      placeholder="UNPAD"
                    />
                  </div>
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
