"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Menu, X, Activity, QrCode } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Statistik & Ringkasan" },
  { name: "Data Peserta", href: "/admin/peserta", icon: Users, desc: "Kelola & Validasi Kehadiran" },
];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 z-50 flex flex-col shadow-xl transform transition-transform duration-300 lg:shadow-sm lg:sticky lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <img src="/logo.svg" alt="RC3ID" className="h-9 w-auto" />
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-5 py-3 bg-gradient-to-r from-[#253656]/5 to-transparent border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sistem Aktif</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-[#BD272D] text-white shadow-lg shadow-[#BD272D]/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#253656]"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-[#253656]/10"}`}>
                    <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-[#253656]"}`} size={18} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm leading-none ${isActive ? "text-white" : ""}`}>{item.name}</div>
                    <div className={`text-[10px] mt-0.5 leading-none font-medium ${isActive ? "text-white/70" : "text-slate-400"}`}>{item.desc}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Secondary Tools */}
          <div className="mt-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">Tools</p>
            <Link
              href="/admin/qr"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                pathname === "/admin/qr"
                  ? "bg-slate-100 text-[#253656]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center shrink-0">
                <QrCode size={15} className="text-slate-400" />
              </div>
              <div>
                <div className="font-semibold text-sm leading-none">QR Generator</div>
                <div className="text-[10px] mt-0.5 text-slate-400">Generate QR untuk berbagi</div>
              </div>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-[#253656]/5 to-[#BD272D]/5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#BD272D]" />
              <span className="text-xs font-bold text-[#253656]">B-IDEAs 2026</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">RC3ID UNPAD Exhibition — Digital Guestbook System</p>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Keluar (Logout)</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <img src="/logo.svg" alt="RC3ID" className="h-7 w-auto" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Admin
          </div>
        </header>

        <div className="flex-1 overflow-auto p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
