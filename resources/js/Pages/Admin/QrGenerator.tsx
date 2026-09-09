import { useState, useRef, useEffect } from "react";
import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";
import { Download, Printer, QrCode as QRIcon, Check, RefreshCw } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const COLORS_FG = [
  { color: "#253656", label: "Navy" },
  { color: "#BD272D", label: "Merah" },
  { color: "#000000", label: "Hitam" },
  { color: "#10b981", label: "Hijau" },
  { color: "#7c3aed", label: "Ungu" },
];

const COLORS_BG = [
  { color: "#FFFFFF", label: "Putih" },
  { color: "#f8fafc", label: "Abu Terang" },
  { color: "#fef2f2", label: "Merah Muda" },
  { color: "#f0fdf4", label: "Hijau Muda" },
  { color: "#1a263d", label: "Gelap" },
];

const PRESETS = [
  { label: "Link Form Buku Tamu", value: () => `${window.location.origin}/buku-tamu` },
  { label: "Website RC3ID", value: () => "https://rc3id.unpad.ac.id" },
  { label: "Instagram @rc3id.unpad", value: () => "https://instagram.com/rc3id.unpad" },
  { label: "YouTube RC3ID", value: () => "https://youtube.com/@RC3IDUniversitasPadjadjaran" },
];

export default function QrGenerator() {
  const [qrValue, setQrValue] = useState(() => `${window.location.origin}/buku-tamu`);
  const [fgColor, setFgColor] = useState("#253656");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [showLogo, setShowLogo] = useState(true);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [defaultSquareLogo, setDefaultSquareLogo] = useState<string | null>(null);
  const [label, setLabel] = useState("Scan untuk Isi Buku Tamu RC3ID");
  const qrRef = useRef<HTMLDivElement>(null);

  // Helper to pad any image into a perfect square
  const padImageToSquare = (src: string, callback: (url: string) => void) => {
    const img = new Image();
    img.onload = () => {
      // Add a little padding so the logo doesn't touch the edges of the QR cutout
      const padding = 20; 
      const max = Math.max(img.width, img.height) + padding * 2;
      const canvas = document.createElement("canvas");
      canvas.width = max;
      canvas.height = max;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill with white background so it always has a white border in the QR code
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
    // Generate a padded square version of the default logo
    padImageToSquare("/logo.svg", setDefaultSquareLogo);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      padImageToSquare(url, (squareUrl) => {
        setCustomLogoUrl(squareUrl);
        setShowLogo(true);
      });
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    // Create a new canvas with padding to act as a white frame
    const padding = 32; // Thick padding for a nice frame
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width + (padding * 2);
    finalCanvas.height = canvas.height + (padding * 2);
    
    const ctx = finalCanvas.getContext("2d");
    if (ctx) {
      // Fill the entire frame with white
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Draw the original QR code in the center
      ctx.drawImage(canvas, padding, padding);
      
      const link = document.createElement("a");
      link.download = "qrcode-rc3id.png";
      link.href = finalCanvas.toDataURL("image/png");
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayoutWrapper>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#253656]">QR Generator</h1>
            <p className="text-slate-500 mt-1 text-sm">Buat dan unduh QR Code untuk form buku tamu atau tautan lainnya.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-[#253656] hover:bg-slate-50 transition-colors shadow-sm">
              <Printer className="w-4 h-4" /> Cetak
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-[#BD272D] hover:bg-[#991f24] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#BD272D]/20">
              <Download className="w-4 h-4" /> Unduh PNG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-5 space-y-4">

            {/* QR Value / URL */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-[#253656] text-sm flex items-center gap-2">
                <QRIcon className="w-4 h-4 text-[#BD272D]" /> Konten QR Code
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setQrValue(preset.value())}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-[#253656] hover:text-white hover:border-[#253656] transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <textarea
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all font-mono"
                placeholder="https://... atau teks apapun"
              />
            </div>

            {/* Label */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-[#253656] text-sm">Label / Keterangan</h3>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all"
                placeholder="Scan untuk Isi Buku Tamu"
              />
            </div>

            {/* Colors */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-[#253656] text-sm">Warna</h3>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Warna QR (Foreground)</p>
                <div className="flex gap-2 flex-wrap">
                  {COLORS_FG.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setFgColor(c.color)}
                      title={c.label}
                      className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.color,
                        borderColor: fgColor === c.color ? "#BD272D" : "transparent",
                      }}
                    >
                      {fgColor === c.color && <Check className="w-4 h-4 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Warna Latar (Background)</p>
                <div className="flex gap-2 flex-wrap">
                  {COLORS_BG.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setBgColor(c.color)}
                      title={c.label}
                      className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.color,
                        borderColor: bgColor === c.color ? "#BD272D" : "#e2e8f0",
                      }}
                    >
                      {bgColor === c.color && (
                        <Check className="w-4 h-4 drop-shadow" style={{ color: c.color === "#FFFFFF" || c.color === "#f8fafc" || c.color === "#fef2f2" || c.color === "#f0fdf4" ? "#253656" : "white" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Logo Upload */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="font-bold text-[#253656] text-sm mb-2">Upload Logo Kustom (Opsional)</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#253656] file:text-white hover:file:bg-[#1a263d] transition-colors"
              />
              {customLogoUrl && (
                <button 
                  onClick={() => { setCustomLogoUrl(null); setShowLogo(true); }}
                  className="mt-3 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
                >
                  Hapus Logo Kustom
                </button>
              )}
            </div>

            {/* Logo Toggle */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#253656] text-sm">{customLogoUrl ? "Tampilkan Logo Kustom" : "Logo RC3ID di Tengah"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tampilkan logo di pusat QR Code</p>
                </div>
                <button
                  onClick={() => setShowLogo(!showLogo)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${showLogo ? "bg-[#BD272D]" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${showLogo ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setFgColor("#253656"); setBgColor("#FFFFFF"); setShowLogo(true); setLabel("Scan untuk Isi Buku Tamu RC3ID"); setQrValue(`${window.location.origin}/buku-tamu`); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset ke Default
            </button>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[560px] border border-slate-300 relative">
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                Live Preview
              </div>

              {/* QR Card */}
              <div
                className="rounded-3xl shadow-2xl w-full max-w-xs flex flex-col items-center border border-gray-100 overflow-hidden print:shadow-none"
                style={{ backgroundColor: bgColor }}
                ref={qrRef}
              >
                {/* Card Header */}
                <div className="w-full bg-gradient-to-r from-[#253656] to-[#1a263d] p-4 flex items-center justify-center gap-3">
                  <img src="/logo.svg" alt="RC3ID" className="h-8" />
                </div>

                <div className="p-6 flex flex-col items-center">
                  {/* QR Code with optional logo overlay */}
                  <div className="relative p-4 rounded-2xl border-2 border-dashed border-slate-200 mb-4" style={{ backgroundColor: bgColor }}>
                    <QRCodeCanvas
                      value={qrValue || "https://rc3id.unpad.ac.id"}
                      size={200}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="H"
                      includeMargin={true}
                      imageSettings={
                        showLogo ? {
                          src: customLogoUrl || defaultSquareLogo || "/logo.svg",
                          height: 64,
                          width: 64,
                          excavate: true,
                        } : undefined
                      }
                    />
                  </div>

                  {label && (
                    <p className="text-center text-sm font-bold mb-2" style={{ color: fgColor }}>
                      {label}
                    </p>
                  )}

                  <p className="font-mono text-[10px] tracking-wide text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg text-center w-full truncate border border-slate-100">
                    {qrValue.replace("https://", "").replace("http://", "").substring(0, 40)}
                    {qrValue.length > 40 ? "..." : ""}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="w-full bg-gradient-to-r from-[#253656]/5 to-[#BD272D]/5 p-3 border-t border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RC3ID • Universitas Padjadjaran</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
