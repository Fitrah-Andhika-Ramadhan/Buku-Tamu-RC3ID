"use client";

import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, Users, LogOut, Menu, X, Activity, QrCode, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Statistik & Ringkasan" },
  { name: "Data Peserta", href: "/admin/peserta", icon: Users, desc: "Kelola & Validasi Kehadiran" },
  { name: "Form Builder", href: "/admin/form-builder", icon: Activity, desc: "Atur Form Dinamis" },
  { name: "Halaman Sukses", href: "/admin/success-config", icon: CheckCircle2, desc: "Atur Tampilan Sukses" },
];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { url: pathname } = usePage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-['Outfit'] selection:bg-[#BD272D] selection:text-white relative overflow-hidden">
      {/* VIBEDESK STYLE: Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed left-[10%] top-[10%] z-0 h-[400px] w-[400px] rounded-full bg-[#BD272D] opacity-[0.10] blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="fixed right-[-5%] bottom-[10%] z-0 h-[500px] w-[500px] rounded-full bg-[#253656] opacity-[0.08] blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }}></div>
      <div className="fixed bottom-1/2 left-[20%] z-0 h-[300px] w-[300px] rounded-full bg-cyan-500 opacity-[0.03] blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "4s" }}></div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Floating Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-72 p-4 z-50 flex flex-col transform transition-transform duration-500 ease-out lg:sticky lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <aside className="w-full h-full bg-white/70 backdrop-blur-3xl border border-white rounded-[2rem] shadow-2xl shadow-[#253656]/5 flex flex-col overflow-hidden relative group">
          {/* Decorative Sidebar Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#BD272D]/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-[#BD272D]/30 transition-colors duration-1000"></div>

          {/* Logo */}
          <div className="p-6 border-b border-gray-200/50 flex items-center justify-between relative z-10">
            <Link href="/admin" className="flex items-center gap-3">
              <img src="/logo.svg" alt="RC3ID" className="h-10 w-auto hover:scale-105 transition-transform" />
            </Link>
            <button className="lg:hidden text-gray-400 hover:text-[#BD272D] p-1.5 rounded-xl hover:bg-red-50 transition-colors" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#253656]/5 to-transparent border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-sm shadow-green-500"></span>
              </span>
              <span className="text-xs font-black text-[#253656] uppercase tracking-[0.2em]">Sistem Aktif</span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 p-5 overflow-y-auto space-y-8 scrollbar-hide relative z-10">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? "bg-gradient-to-r from-[#253656] to-[#1a263d] text-white shadow-xl shadow-[#253656]/20 scale-[1.02]"
                          : "text-[#6C7C98] hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center shrink-0 transition-colors shadow-inner ${isActive ? "bg-white/10" : "bg-gray-50 border border-gray-100 group-hover:bg-[#253656]/5 group-hover:border-[#253656]/10"}`}>
                        <item.icon className={`w-5 h-5 ${isActive ? "text-white drop-shadow-sm" : "text-gray-400 group-hover:text-[#BD272D]"}`} />
                      </div>
                      <div>
                        <div className={`font-bold text-sm tracking-wide leading-none ${isActive ? "text-white" : "group-hover:text-[#253656]"}`}>{item.name}</div>
                        <div className={`text-xs mt-1 font-['Plus_Jakarta_Sans'] font-medium ${isActive ? "text-white/70" : "text-gray-400"}`}>{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Event Info */}
            <div className="p-5 bg-gradient-to-br from-[#BD272D]/5 to-transparent rounded-[1.5rem] border border-[#BD272D]/10 group hover:border-[#BD272D]/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-[#BD272D] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-[#253656] tracking-tight">B-IDEAs 2026</span>
              </div>
              <p className="text-xs font-['Plus_Jakarta_Sans'] font-medium text-[#6C7C98] leading-relaxed">RC3ID UNPAD Exhibition — Digital Guestbook System</p>
            </div>
          </div>

          {/* Logout */}
          <div className="p-5 border-t border-gray-200/50 bg-white/50 relative z-10">
            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-red-50 hover:text-[#BD272D] hover:shadow-md hover:border-red-100 border border-transparent transition-all duration-300 w-full group active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-[1rem] bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors shadow-inner border border-gray-100">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="tracking-wide">Keluar (Logout)</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#BD272D] transition-colors border border-gray-200/50 active:scale-[0.98]">
              <Menu className="w-5 h-5" />
            </button>
            <img src="/logo.svg" alt="RC3ID" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-[#253656] bg-[#253656]/5 border border-[#253656]/10 px-4 py-2 rounded-xl tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500"></span>
            Admin
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 lg:p-10 relative z-10 animate-fade-in slide-in-from-bottom-4 duration-700 ease-out">
          {children}
        </div>
      </main>
    </div>
  );
}
