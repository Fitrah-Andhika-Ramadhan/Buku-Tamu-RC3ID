"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-black text-[#253656] mb-4 uppercase tracking-tight">
        Koneksi Terputus
      </h1>
      
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Maaf, sistem tidak dapat memuat halaman ini. Kemungkinan besar disebabkan oleh <strong className="text-red-500">koneksi database yang ditolak</strong> atau masalah server Hostinger.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          className="bg-[#253656] hover:bg-[#1a263d] text-white px-8 rounded-full font-bold shadow-lg shadow-[#253656]/20"
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> Coba Muat Ulang
        </Button>
        <Link href="/">
          <Button variant="outline" className="border-gray-300 text-slate-700 px-8 rounded-full font-bold w-full sm:w-auto">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-slate-400 font-mono text-left max-w-lg overflow-auto p-4 bg-white rounded-xl shadow-sm">
        <strong>Detail Error (Untuk Developer):</strong><br/>
        {error.message || "Unknown database connection error."}
      </div>
    </div>
  );
}
