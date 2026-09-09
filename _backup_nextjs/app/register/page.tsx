import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistrationForm } from "@/components/RegistrationForm";

export const metadata = {
  title: "Registrasi Event RC3ID",
  description: "Dapatkan tiket dan QR Code event Anda sekarang.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#BD272D] selection:text-white">
      {/* Top Accent Bar */}
      <div className="flex h-2 w-full">
        <div className="w-16 bg-[#BD272D]"></div>
        <div className="flex-1 bg-[#253656]"></div>
      </div>

      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-[#6C7C98] hover:text-[#253656] flex items-center tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2" />
            KEMBALI
          </Link>
          <div className="flex items-center">
            <img src="/logo.svg" alt="RC3ID Logo" className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 sm:px-8 pt-12 pb-20 flex flex-col items-center bg-[#f1f3f6]">
        <div className="w-full max-w-4xl relative z-10">
          <RegistrationForm />
        </div>
      </main>
    </div>
  );
}
