"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  no_wa: z.string().min(10, "Nomor WhatsApp tidak valid"),
  email: z.string().email("Format email tidak valid"),
  instansi: z.string().min(2, "Institusi wajib diisi"),
  profesi: z.string().min(2, "Profesi wajib diisi"),
  peluang_kolaborasi: z.array(z.string()).min(1, "Pilih minimal satu peluang kolaborasi"),
  sosmed_follow: z.string().min(1, "Wajib dipilih"),
});

type RegistrationData = z.infer<typeof registerSchema>;

export function RegistrationForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      peluang_kolaborasi: []
    }
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setErrorMsg("");

    // Convert array of string to comma separated string for DB
    const payload = {
      ...data,
      peluang_kolaborasi: data.peluang_kolaborasi.join(", ")
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal melakukan registrasi");
      }

      // If success, redirect to the participant card page
      router.push(`/p/${result.participantId}`);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const peluangOptions = [
    "Ingin faskes kami menjadi mitra uji teknologi kesehatan baru (TB/Dengue/HIV)",
    "Tertarik informasi program doktoral (S3) / kolaborasi penulisan riset",
    "Tertarik memanfaatkan fasilitas laboratorium dan data science di RC3ID",
    "Tertarik mengadopsi modul/SOP deteksi dini di faskes kami",
    "Hanya ingin mendapatkan pembaruan buletin riset berkala (newsletter/WA community)",
  ];

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 max-w-2xl w-full mx-auto">
      <div className="mb-10 text-[#253656]">
        <h2 className="text-3xl font-extrabold mb-4 uppercase tracking-tight text-[#BD272D]">Form Buku Tamu Booth RC3ID</h2>
        <p className="mb-4 leading-relaxed font-medium">
          Selamat datang di booth Research Center for Care and Control of Infectious Diseases (RC3ID) Universitas Padjadjaran di 11th BIDEAS 2026!
        </p>
        <p className="mb-4 leading-relaxed">
          Kami mengundang Anda untuk terhubung dengan inovasi riset klinis dan inisiatif edukasi publik kami dalam pengendalian penyakit infeksi, yang berfokus pada kelompok kerja Tuberkulosis (TB), HIV, dan DF-ONE (Dengue and other Febrile pathOgen iNfEctions).
        </p>
        <p className="mb-6 leading-relaxed italic text-[#6C7C98]">
          Silakan lengkapi informasi di bawah ini untuk klaim merchandise eksklusif dari booth kami. Data yang Anda berikan akan dijaga kerahasiaannya.
        </p>
        
        <div className="border-t border-b border-gray-100 py-4 mb-6 bg-gray-50 px-4 rounded-lg text-sm">
          <ul className="space-y-1 font-medium">
            <li><span className="text-[#BD272D]">Website:</span> rc3id.unpad.ac.id</li>
            <li><span className="text-[#BD272D]">Instagram:</span> @rc3id.unpad</li>
            <li><span className="text-[#BD272D]">LinkedIn:</span> linkedin.com/company/research-center-for-care-and-control-of-infectious-diseases/</li>
            <li><span className="text-[#BD272D]">YouTube:</span> youtube.com/@RC3IDUniversitasPadjadjaran</li>
            <li><span className="text-[#BD272D]">X (Twitter):</span> x.com/RC3IDUnpad</li>
          </ul>
        </div>
        <p className="text-xs text-[#BD272D] font-bold">* Wajib diisi</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#253656] mb-2">Nama Lengkap (beserta gelar) <span className="text-[#BD272D]">*</span></label>
          <input
            {...register("nama_lengkap")}
            autoFocus
            className="w-full px-4 py-3 rounded-none border border-gray-300 focus:ring-2 focus:ring-[#BD272D] focus:border-[#BD272D] transition-colors outline-none bg-gray-50"
            placeholder="Jawaban Anda"
          />
          {errors.nama_lengkap && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.nama_lengkap.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#253656] mb-2">Nomor WhatsApp Aktif <span className="text-[#BD272D]">*</span></label>
          <input
            {...register("no_wa")}
            type="tel"
            className="w-full px-4 py-3 rounded-none border border-gray-300 focus:ring-2 focus:ring-[#BD272D] focus:border-[#BD272D] transition-colors outline-none bg-gray-50"
            placeholder="Jawaban Anda"
          />
          {errors.no_wa && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.no_wa.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#253656] mb-2">Alamat Email <span className="text-[#BD272D]">*</span></label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-3 rounded-none border border-gray-300 focus:ring-2 focus:ring-[#BD272D] focus:border-[#BD272D] transition-colors outline-none bg-gray-50"
            placeholder="Jawaban Anda"
          />
          {errors.email && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#253656] mb-2">Institusi <span className="text-[#BD272D]">*</span></label>
          <input
            {...register("instansi")}
            className="w-full px-4 py-3 rounded-none border border-gray-300 focus:ring-2 focus:ring-[#BD272D] focus:border-[#BD272D] transition-colors outline-none bg-gray-50"
            placeholder="Jawaban Anda"
          />
          {errors.instansi && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.instansi.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-[#253656] mb-2">Profesi / Bidang Spesialisasi <span className="text-[#BD272D]">*</span></label>
          <input
            {...register("profesi")}
            className="w-full px-4 py-3 rounded-none border border-gray-300 focus:ring-2 focus:ring-[#BD272D] focus:border-[#BD272D] transition-colors outline-none bg-gray-50"
            placeholder="Jawaban Anda"
          />
          {errors.profesi && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.profesi.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#253656] mb-3">Peluang Kolaborasi <span className="text-[#BD272D]">*</span></label>
          <div className="space-y-3">
            {peluangOptions.map((opt, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  value={opt} 
                  {...register("peluang_kolaborasi")} 
                  className="mt-1 w-5 h-5 text-[#BD272D] border-gray-300 rounded focus:ring-[#BD272D]"
                />
                <span className="text-sm text-[#253656] group-hover:text-black leading-snug">{opt}</span>
              </label>
            ))}
          </div>
          {errors.peluang_kolaborasi && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.peluang_kolaborasi.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#253656] mb-3">
            Pastikan anda mengikuti sosial media RC3ID untuk mendapatkan merchandise gratis: <span className="text-[#BD272D]">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                value="Sudah dong!" 
                {...register("sosmed_follow")} 
                className="w-5 h-5 text-[#BD272D] border-gray-300 focus:ring-[#BD272D]"
              />
              <span className="text-sm text-[#253656] font-medium group-hover:text-black">Sudah dong!</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                value="Belum nih" 
                {...register("sosmed_follow")} 
                className="w-5 h-5 text-[#BD272D] border-gray-300 focus:ring-[#BD272D]"
              />
              <span className="text-sm text-[#253656] font-medium group-hover:text-black">Belum nih</span>
            </label>
          </div>
          {errors.sosmed_follow && <p className="text-[#BD272D] text-xs mt-1 font-medium">{errors.sosmed_follow.message}</p>}
        </div>

        <div className="pt-6 border-t border-gray-100">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 rounded-none bg-[#BD272D] hover:bg-[#a01f25] text-white font-bold tracking-wide uppercase text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mengirim Data...
              </>
            ) : (
              "Kirim & Klaim Merchandise"
            )}
          </Button>
        </div>
        
        <p className="text-xs text-center text-slate-500 mt-4">
          Dengan menekan tombol kirim, Anda menyetujui penggunaan data untuk keperluan event ini.
        </p>
      </form>
    </div>
  );
}
