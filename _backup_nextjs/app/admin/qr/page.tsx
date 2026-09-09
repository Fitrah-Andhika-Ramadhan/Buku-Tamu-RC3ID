import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, Palette, QrCode as QRIcon, Check } from "lucide-react";
import QRCode from "react-qr-code";

export default function QRGeneratorMockup() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#253656]">QR Generator</h1>
          <p className="text-slate-500 mt-1 text-sm">Kustomisasi tampilan QR Code untuk tiket dan ID Card peserta.</p>
        </div>
        <Button className="bg-[#253656] hover:bg-[#1a263d] text-white">
          <Download className="w-4 h-4 mr-2" />
          Ekspor Semua QR
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-[#253656] mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#BD272D]" />
              Kustomisasi Visual
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Warna Foreground</label>
                <div className="flex flex-wrap gap-3">
                  {['#000000', '#253656', '#BD272D', '#10b981', '#6C7C98'].map((color, i) => (
                    <div key={color} className="flex flex-col items-center gap-1 cursor-pointer">
                      <div className="w-10 h-10 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center relative" style={{ backgroundColor: color }}>
                        {i === 1 && <Check className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400">
                    +
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Warna Background</label>
                <div className="flex flex-wrap gap-3">
                  {['#FFFFFF', '#f8f9fc', '#fef2f2', '#f0fdf4'].map((color, i) => (
                    <div key={color} className="flex flex-col items-center gap-1 cursor-pointer">
                      <div className="w-10 h-10 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center relative" style={{ backgroundColor: color }}>
                        {i === 0 && <Check className="w-5 h-5 text-[#253656]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Logo di Tengah (Opsional)</label>
                <div className="flex gap-4">
                  <div className="w-20 h-20 border-2 border-[#BD272D] rounded-xl flex items-center justify-center p-2 cursor-pointer bg-red-50 relative overflow-hidden">
                    <img src="/logo.svg" alt="RC3ID Logo" className="w-full object-contain" />
                    <div className="absolute top-1 right-1 bg-[#BD272D] rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-50 text-gray-400 text-xs text-center">
                    <span className="text-xl mb-1">+</span>
                    Upload
                  </div>
                </div>
              </div>

              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Bentuk Pola (Style)</label>
                 <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-600 outline-none focus:border-[#BD272D]">
                    <option>Standard (Kotak)</option>
                    <option>Dots (Bulat)</option>
                    <option>Fluid (Membulat)</option>
                  </select>
              </div>

            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800 leading-relaxed flex items-start gap-3">
            <QRIcon className="w-5 h-5 shrink-0" />
            <div>
              <strong>Mockup Preview:</strong> Pengaturan di atas adalah tampilan simulasi. Saat diekspor, gaya ini akan diterapkan ke semua data peserta secara otomatis.
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-7">
          <div className="bg-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] border border-slate-200 relative">
            <div className="absolute top-4 left-4 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm">
              Live Preview
            </div>

            {/* The Ticket Preview Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center border border-gray-100 relative group">
              <img src="/logo.svg" alt="RC3ID" className="h-8 mb-6" />
              
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white mb-6">
                <QRCode 
                  value="RC3ID-MOCKUP-12345" 
                  size={200}
                  fgColor="#253656"
                  bgColor="#FFFFFF"
                  level="H"
                />
              </div>

              <h2 className="text-xl font-bold text-[#253656] text-center mb-1">Dr. Budi Santoso</h2>
              <p className="text-sm text-slate-500 text-center">Fakultas Kedokteran UNPAD</p>
              
              <div className="w-full h-px border-b-2 border-dashed border-gray-200 my-6"></div>
              
              <p className="font-mono text-xs tracking-widest text-slate-400 font-bold bg-slate-50 px-4 py-2 rounded-lg text-center w-full">
                RC3ID-MOCKUP-12345
              </p>

              {/* Hover Actions overlay on ticket */}
              <div className="absolute inset-0 bg-[#253656]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#253656] hover:bg-[#BD272D] hover:text-white transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#253656] hover:bg-[#BD272D] hover:text-white transition-colors" title="Print">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#253656] hover:bg-[#BD272D] hover:text-white transition-colors" title="Share">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
