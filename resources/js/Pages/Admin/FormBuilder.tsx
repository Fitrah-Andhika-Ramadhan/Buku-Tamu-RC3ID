import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Settings2, Trash2, Eye, Save } from "lucide-react";

export default function FormGeneratorMockup() {
  const mockFields = [
    { id: 1, type: "text", label: "Nama Lengkap (beserta gelar)", required: true },
    { id: 2, type: "text", label: "Nomor WhatsApp Aktif", required: true },
    { id: 3, type: "email", label: "Alamat Email", required: true },
    { id: 4, type: "text", label: "Institusi", required: true },
    { id: 5, type: "text", label: "Profesi / Bidang Spesialisasi", required: true },
    { id: 6, type: "checkbox", label: "Peluang Kolaborasi", required: true },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#253656]">Form Generator</h1>
          <p className="text-slate-500 mt-1 text-sm">Desain formulir registrasi buku tamu Anda (Mockup UI).</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-slate-600">
            <Eye className="w-4 h-4 mr-2" />
            Preview Form
          </Button>
          <Button className="bg-[#253656] hover:bg-[#1a263d] text-white">
            <Save className="w-4 h-4 mr-2" />
            Simpan Form
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Editor */}
        <div className="flex-1 space-y-4">
          <div className="bg-white border-t-[10px] border-[#BD272D] rounded-2xl shadow-sm p-8 border-l border-r border-b border-gray-200">
            <input 
              type="text" 
              className="w-full text-3xl font-bold text-[#253656] border-b border-transparent hover:border-gray-200 focus:border-[#BD272D] focus:outline-none pb-2 transition-colors bg-transparent"
              defaultValue="Form Buku Tamu Booth RC3ID"
            />
            <textarea 
              className="w-full text-slate-500 mt-4 border-b border-transparent hover:border-gray-200 focus:border-[#BD272D] focus:outline-none pb-2 transition-colors resize-none bg-transparent"
              rows={3}
              defaultValue="Selamat datang di booth Research Center for Care and Control of Infectious Diseases (RC3ID) Universitas Padjadjaran di 11th B-IDEAs 2026!"
            />
          </div>

          {mockFields.map((field) => (
            <div key={field.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex gap-4 group hover:border-[#BD272D]/50 transition-colors relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab bg-white p-1 rounded border border-gray-200 shadow-sm">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-[#BD272D] rounded-lg px-4 py-3 font-medium text-[#253656] outline-none transition-colors"
                    defaultValue={field.label}
                  />
                  <select className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-600 outline-none focus:border-[#BD272D]">
                    <option value="text" selected={field.type === "text"}>Jawaban Singkat</option>
                    <option value="email" selected={field.type === "email"}>Email</option>
                    <option value="checkbox" selected={field.type === "checkbox"}>Kotak Centang</option>
                  </select>
                </div>
                <div className="text-sm text-gray-400 border-b border-gray-100 pb-2 border-dashed">
                  {field.type === "checkbox" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-300 rounded-sm"></div> Opsi 1</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-300 rounded-sm"></div> Opsi 2</div>
                    </div>
                  ) : "Teks jawaban pengguna..."}
                </div>
                <div className="flex items-center justify-end gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium">Wajib diisi</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${field.required ? 'bg-[#BD272D]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${field.required ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))}

          <Button className="w-full py-8 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 text-gray-500 rounded-2xl flex flex-col items-center gap-2 shadow-none">
            <Plus className="w-6 h-6" />
            <span className="font-medium">Tambah Pertanyaan Baru</span>
          </Button>
        </div>

        {/* Sidebar Tools */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-[#253656] mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-[#BD272D]" />
              Pengaturan Form
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Tema Warna</label>
                <div className="flex gap-2">
                  {['#BD272D', '#253656', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200" style={{ backgroundColor: color }}></button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Pesan Setelah Submit</label>
                <textarea 
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm text-slate-600 focus:outline-none focus:border-[#BD272D]"
                  rows={3}
                  defaultValue="Terima kasih telah mendaftar. Silakan tunjukkan QR Code Anda ke meja registrasi."
                ></textarea>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800 leading-relaxed">
                <strong>Catatan:</strong> Halaman ini adalah versi Mockup UI (purwarupa). Fitur Drag & Drop dan penyimpanan database dinamis belum diaktifkan pada versi ini.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
