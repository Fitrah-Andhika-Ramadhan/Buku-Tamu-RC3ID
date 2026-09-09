"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, User, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login for mockup
    setTimeout(() => {
      setIsLoading(false);
      // We are just simulating a successful login without real auth for now
      // Real implementation would use NextAuth or JWT
      router.push("/admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BD272D]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#253656]/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-2xl shadow-[#253656]/10">
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="RC3ID Logo" className="h-12 w-auto mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[#253656] tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-[#6C7C98] mt-1">Masuk untuk mengelola data buku tamu</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#253656] uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all outline-none"
                  placeholder="admin"
                  defaultValue="admin"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#253656] uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all outline-none"
                  placeholder="••••••••"
                  defaultValue="rc3id2026"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#253656] hover:bg-[#1a263d] text-white rounded-xl font-bold tracking-wide mt-2 shadow-lg shadow-[#253656]/20 transition-all"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memeriksa Kredensial...</>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>
        </div>
        
        <p className="text-center text-xs font-medium text-gray-400 mt-8">
          &copy; 2026 RC3ID Universitas Padjadjaran.<br/>All rights reserved.
        </p>
      </div>
    </div>
  );
}
