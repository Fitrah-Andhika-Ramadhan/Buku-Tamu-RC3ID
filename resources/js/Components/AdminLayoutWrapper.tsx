"use client";

import { Link, usePage, router } from "@inertiajs/react";
import { LogOut, LayoutDashboard, FileText, Settings, Users, Monitor, ShieldCheck, CheckCircle2, Ticket, QrCode, Menu, LayoutList, Plus, Star, Database, Edit3, Activity, X, Layout } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Statistik & Ringkasan" },
  { name: "Landing Page", href: "/admin/landing-config", icon: Monitor, desc: "Atur Tampilan Depan" },
  { name: "Data Peserta", href: "/admin/peserta", icon: Users, desc: "Kelola & Validasi Kehadiran" },
  { name: "Form Builder", href: "/admin/form-builder", icon: Activity, desc: "Atur Form Dinamis" },
  { name: "Header Form", href: "/admin/form-header", icon: Layout, desc: "Judul & Sosmed Form" },
  { name: "Halaman Sukses", href: "/admin/success-config", icon: CheckCircle2, desc: "Atur Tampilan Sukses" },
  { name: "QR Generator", href: "/admin/qr-generator", icon: QrCode, desc: "Buat & Ekspor QR Code" },
  { name: "DB Viewer", href: "/admin/db-viewer", icon: Database, desc: "Lihat Data SQL" },
];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { url: pathname } = usePage();
  const { events, currentEvent, frontEventId } = usePage().props as any;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventSlug, setNewEventSlug] = useState('');
  const [editEventName, setEditEventName] = useState('');
  const [editEventSlug, setEditEventSlug] = useState('');

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
          
          {/* Event Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <LayoutList className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Mengelola Data Untuk:</p>
                <p className="text-sm font-bold text-slate-700">{currentEvent?.name || 'Memuat...'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={currentEvent?.id || ''} 
                onChange={(e) => router.post('/admin/events/switch', { event_id: e.target.value })}
                className="w-full sm:w-64 border-slate-200 rounded-xl focus:ring-[#BD272D] focus:border-[#BD272D] text-sm py-2"
              >
                {(events || []).map((e: any) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              
              {currentEvent && (
                <button
                  onClick={() => {
                    setEditEventName(currentEvent.name);
                    setEditEventSlug(currentEvent.slug || '');
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                  title="Edit Nama/Link Acara"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
              
              {currentEvent && (
                <>
                  <button 
                    onClick={() => router.post('/admin/events/set-front', { event_id: currentEvent.id })}
                    className={`shrink-0 py-2 px-3 rounded-xl transition-colors text-sm font-bold shadow-sm flex items-center gap-1.5 border ${
                      frontEventId === currentEvent.id 
                        ? 'bg-amber-100 border-amber-200 text-amber-800 cursor-default' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${frontEventId === currentEvent.id ? 'fill-amber-500 text-amber-500' : ''}`} />
                    {frontEventId === currentEvent.id ? 'Event Utama' : 'Jadikan Utama'}
                  </button>

                  <a 
                    href={`/admin/events/${currentEvent.id}/meeting`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.post(`/admin/events/${currentEvent.id}/meeting`);
                    }}
                    className="shrink-0 py-2 px-4 rounded-xl transition-colors text-sm font-bold shadow-sm flex items-center gap-2 border bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    title="Buka Ruang Meeting Video untuk Acara ini"
                  >
                    <Monitor className="w-4 h-4" />
                    Ruang Meeting
                  </a>
                </>
              )}

              <button 
                onClick={() => {
                  setNewEventName('');
                  setNewEventSlug('');
                  setIsCreateModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Buat Baru
              </button>
            </div>
          </div>

          {children}
        </div>
      </main>

      {/* Custom Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Buat Acara / Form Baru</h3>
              <p className="text-sm text-slate-500 mt-1">Masukkan nama acara baru. Pengaturan form & sukses akan disalin dari form saat ini.</p>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Acara <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder='contoh: "Seminar Nasional 2026"'
                  className="w-full border-slate-200 rounded-xl focus:ring-[#BD272D] focus:border-[#BD272D] text-sm"
                  autoFocus
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Link Form (Opsional)</label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2 text-sm text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                    /e/
                  </span>
                  <input 
                    type="text" 
                    value={newEventSlug}
                    onChange={(e) => {
                      // Allow only alphanumeric and hyphens
                      const val = e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase();
                      setNewEventSlug(val);
                    }}
                    placeholder='otomatis-dibuat'
                    className="w-full border-slate-200 rounded-r-xl focus:ring-[#BD272D] focus:border-[#BD272D] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newEventName.trim()) {
                        router.post('/admin/events', { name: newEventName.trim(), slug: newEventSlug.trim() });
                        setIsCreateModalOpen(false);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Biarkan kosong untuk link acak. Hanya huruf, angka, dan strip (-).</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewEventName('');
                }}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (newEventName.trim()) {
                    router.post('/admin/events', { name: newEventName.trim(), slug: newEventSlug.trim() });
                    setIsCreateModalOpen(false);
                  }
                }}
                disabled={!newEventName.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-[#BD272D] hover:bg-[#991f24] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#BD272D]/20"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit Event Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Edit Acara / Form</h3>
              <p className="text-sm text-slate-500 mt-1">Ubah nama dan link form untuk acara ini.</p>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Acara <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={editEventName}
                  onChange={(e) => setEditEventName(e.target.value)}
                  placeholder='contoh: "Seminar Nasional 2026"'
                  className="w-full border-slate-200 rounded-xl focus:ring-[#BD272D] focus:border-[#BD272D] text-sm"
                  autoFocus
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Link Form <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2 text-sm text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                    /e/
                  </span>
                  <input 
                    type="text" 
                    value={editEventSlug}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase();
                      setEditEventSlug(val);
                    }}
                    className="w-full border-slate-200 rounded-r-xl focus:ring-[#BD272D] focus:border-[#BD272D] text-sm font-mono text-blue-700"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editEventName.trim() && editEventSlug.trim()) {
                        router.put(`/admin/events/${currentEvent?.id}`, { name: editEventName.trim(), slug: editEventSlug.trim() });
                        setIsEditModalOpen(false);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                  💡 <span className="italic">URL: {window.location.origin}/e/{editEventSlug || '...'}</span>
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (editEventName.trim() && editEventSlug.trim()) {
                    router.put(`/admin/events/${currentEvent?.id}`, { name: editEventName.trim(), slug: editEventSlug.trim() });
                    setIsEditModalOpen(false);
                  }
                }}
                disabled={!editEventName.trim() || !editEventSlug.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
