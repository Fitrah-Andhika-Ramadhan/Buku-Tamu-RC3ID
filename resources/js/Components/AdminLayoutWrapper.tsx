"use client";

import { Link, usePage, router } from "@inertiajs/react";
import { LogOut, LayoutDashboard, FileText, Settings, Users, Monitor, ShieldCheck, CheckCircle2, Ticket, QrCode, Menu, LayoutList, Plus, Star, Database, Edit3, Activity, X, Layout, Video } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Statistik & Ringkasan" },
  { name: "Landing Page", href: "/admin/landing-config", icon: Monitor, desc: "Atur Tampilan Depan" },
  { name: "Data Peserta", href: "/admin/peserta", icon: Users, desc: "Kelola & Validasi Kehadiran" },
  { name: "Form Builder", href: "/admin/form-builder", icon: Activity, desc: "Atur Form Dinamis" },
  { name: "Header Form", href: "/admin/form-header", icon: Layout, desc: "Judul & Sosmed Form" },
  { name: "Halaman Sukses", href: "/admin/success-config", icon: CheckCircle2, desc: "Atur Tampilan Sukses" },
  { name: "QR Generator", href: "/admin/qr-generator", icon: QrCode, desc: "Buat & Ekspor QR Code" },
  { name: "Jadwal & Zoom", href: "/admin/zoom-tracker", icon: Video, desc: "Tracker & Jadwal Meet" },
  { name: "DB Viewer", href: "/admin/db-viewer", icon: Database, desc: "Lihat Data SQL" },
];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { url: pathname } = usePage();
  const { events, currentEvent, frontEventId, auth } = usePage().props as any;
  const isZoomOnlyAccount = auth?.user?.role === "zoom_manager";
  const visibleNavItems = isZoomOnlyAccount ? navItems.filter((item) => item.href === "/admin/zoom-tracker") : navItems;
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
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800 selection:bg-[#BD272D]/15 selection:text-[#253656]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col transition-transform duration-200 lg:sticky lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <aside className="flex h-full w-full flex-col overflow-hidden border-r border-slate-300 bg-white">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <Link href={isZoomOnlyAccount ? "/admin/zoom-tracker" : "/admin"} className="flex items-center gap-3">
              <img src="/logo.svg" alt="RC3ID" className="h-8 w-auto" />
            </Link>
            <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="border-b border-slate-200 px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <span>Sistem aktif</span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 space-y-6 overflow-y-auto p-3">
            <div>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Menu</p>
              <nav className="space-y-1">
                {visibleNavItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 border-l-2 px-3 py-2.5 transition-colors ${
                        isActive
                          ? "border-[#BD272D] bg-slate-100 text-[#253656]"
                          : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#BD272D]" : "text-slate-400"}`} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium leading-5">{item.name}</div>
                        <div className="mt-0.5 truncate text-xs text-slate-400">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {!isZoomOnlyAccount && (
              <div className="border-t border-slate-200 px-2 pt-4">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Activity className="h-4 w-4 text-[#BD272D]" />
                  <span>B-IDEAs 2026</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">RC3ID UNPAD Exhibition — Digital Guestbook System</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-200 p-3">
            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-[#BD272D]"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex min-h-screen flex-1 flex-col overflow-hidden bg-slate-100">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-300 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="rounded border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50">
              <Menu className="w-5 h-5" />
            </button>
            <img src="/logo.svg" alt="RC3ID" className="h-8 w-auto" />
          </div>
          <span className="text-xs font-medium text-slate-600">Admin</span>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          
          {/* Event Switcher */}
          {!isZoomOnlyAccount && <div className="mb-6 flex flex-col justify-between gap-3 border border-slate-300 bg-white p-4 sm:flex-row sm:items-center no-print">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 bg-slate-50">
                <LayoutList className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Mengelola data untuk</p>
                <p className="text-sm font-semibold text-slate-800">{currentEvent?.name || 'Memuat...'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={currentEvent?.id || ''} 
                onChange={(e) => router.post('/admin/events/switch', { event_id: e.target.value })}
                className="w-full border-slate-300 text-sm focus:border-[#BD272D] focus:ring-[#BD272D] sm:w-64"
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
                  className="border border-transparent p-2 text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-blue-700"
                  title="Edit Nama/Link Acara"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
              
              {currentEvent && (
                <>
                  <button 
                    onClick={() => router.post('/admin/events/set-front', { event_id: currentEvent.id })}
                    className={`flex shrink-0 items-center gap-1.5 border px-3 py-2 text-sm font-medium transition-colors ${
                      frontEventId === currentEvent.id 
                        ? 'border-amber-300 bg-amber-50 text-amber-800 cursor-default'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
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
                    className="flex shrink-0 items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                className="flex w-full items-center justify-center gap-1.5 whitespace-nowrap bg-[#253656] px-3 py-2 text-sm font-medium text-white hover:bg-[#1d2a43] sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Buat Baru
              </button>
            </div>
          </div>}

          {children}
        </div>
      </main>

      {/* Custom Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md overflow-hidden border border-slate-300 bg-white shadow-lg">
            <div className="border-b border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-800">Buat Acara / Form Baru</h3>
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
                  className="w-full border-slate-300 text-sm focus:ring-[#BD272D]"
                  autoFocus
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Link Form (Opsional)</label>
                <div className="flex items-center">
                  <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap border border-r-0 border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500 sm:max-w-none">
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
                    className="w-full border-slate-300 text-sm focus:ring-[#BD272D]"
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
            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewEventName('');
                }}
                className="border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
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
                className="px-4 py-2 text-sm font-medium text-white bg-[#BD272D] hover:bg-[#991f24] disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="w-full max-w-md overflow-hidden border border-slate-300 bg-white shadow-lg">
            <div className="border-b border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-800">Edit Acara / Form</h3>
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
                  className="w-full border-slate-300 text-sm focus:ring-[#BD272D]"
                  autoFocus
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Link Form <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap border border-r-0 border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500 sm:max-w-none">
                    /e/
                  </span>
                  <input 
                    type="text" 
                    value={editEventSlug}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase();
                      setEditEventSlug(val);
                    }}
                    className="w-full border-slate-300 text-sm font-mono text-blue-700 focus:ring-[#BD272D]"
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
            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
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
