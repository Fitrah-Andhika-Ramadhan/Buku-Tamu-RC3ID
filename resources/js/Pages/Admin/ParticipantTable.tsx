"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Search, ExternalLink, Filter, Download, ChevronDown, ChevronUp, Table, LayoutList, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link, router } from "@inertiajs/react";

type Participant = {
  id: string;
  nama_lengkap: string;
  instansi: string | null;
  profesi: string | null;
  status_hadir: boolean;
  waktu_hadir: Date | null;
  email: string;
  wa_number: string;
  createdAt: Date;
  custom_responses?: Record<string, any>;
};

export function ParticipantTable({ participants }: { participants: Participant[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "hadir" | "pending">("all");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"list" | "spreadsheet" | "chart">("list");

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = participants.filter((p) => {
    const matchSearch =
      p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.instansi && p.instansi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFilter =
      filter === "all" || (filter === "hadir" && p.status_hadir) || (filter === "pending" && !p.status_hadir);
    return matchSearch && matchFilter;
  });

  const handleToggle = (id: string, currentStatus: boolean) => {
    router.put(`/admin/peserta/${id}/toggle`, {
      status_hadir: !currentStatus
    }, {
      preserveScroll: true
    });
  };

  const totalHadir = participants.filter((p) => p.status_hadir).length;

  const customHeaders = React.useMemo(() => {
    const keys = new Set<string>();
    participants.forEach((p) => {
      if (p.custom_responses) {
        Object.keys(p.custom_responses).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [participants]);

  const attendanceData = [
    { name: 'Hadir', value: totalHadir, fill: '#10b981' },
    { name: 'Pending', value: participants.length - totalHadir, fill: '#f59e0b' }
  ];

  const professionData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      const prof = p.profesi || 'Lainnya';
      counts[prof] = (counts[prof] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
  }, [participants]);

  const instansiData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      const inst = p.instansi || 'Lainnya';
      counts[inst] = (counts[inst] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 10);
  }, [participants]);

  const customChartsData = React.useMemo(() => {
    const charts: { question: string; data: { name: string; count: number }[] }[] = [];
    customHeaders.forEach(header => {
      const counts: Record<string, number> = {};
      participants.forEach(p => {
        if (p.custom_responses && p.custom_responses[header]) {
          let val = p.custom_responses[header];
          if (Array.isArray(val)) {
            val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
          } else {
            counts[String(val)] = (counts[String(val)] || 0) + 1;
          }
        }
      });
      const uniqueKeys = Object.keys(counts);
      if (uniqueKeys.length > 0 && uniqueKeys.length <= 15) {
        charts.push({
          question: header,
          data: Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count)
        });
      }
    });
    return charts;
  }, [participants, customHeaders]);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    
    const baseHeaders = ['ID', 'Nama Lengkap', 'Instansi', 'Profesi', 'Email', 'No Whatsapp', 'Status Kehadiran', 'Waktu Daftar'];
    const headers = [...baseHeaders, ...customHeaders];
    
    const rows = filtered.map(p => {
      const baseRow = [
        p.id,
        `"${p.nama_lengkap}"`,
        `"${p.instansi || '-'}"`,
        `"${p.profesi || '-'}"`,
        `"${p.email || '-'}"`,
        `"${p.wa_number}"`,
        p.status_hadir ? 'Hadir' : 'Pending',
        `"${new Date(p.createdAt).toLocaleString('id-ID')}"`
      ];
      
      const customRow = customHeaders.map(header => {
        const val = p.custom_responses ? p.custom_responses[header] : "";
        if (Array.isArray(val)) return `"${val.join(', ')}"`;
        return `"${val || ""}"`;
      });

      return [...baseRow, ...customRow];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Peserta_RC3ID_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-black text-[#253656] text-lg">Daftar Pendaftar</h2>
            <p className="text-xs text-slate-400 mt-0.5">{participants.length} total • {totalHadir} hadir</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#253656]" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan List"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("spreadsheet")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "spreadsheet" ? "bg-white shadow-sm text-[#253656]" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan Spreadsheet"
              >
                <Table className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("chart")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "chart" ? "bg-white shadow-sm text-[#253656]" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan Grafik"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor CSV
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau instansi..."
              className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#BD272D]/20 focus:border-[#BD272D] transition-all bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 overflow-x-auto whitespace-nowrap">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            {(["all", "hadir", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? "bg-[#253656] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === "all" ? "Semua" : f === "hadir" ? "✓ Hadir" : "○ Pending"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Area */}
      {viewMode === "list" ? (
        // --- LIST VIEW ---
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Peserta</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Waktu Daftar</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Search className="w-10 h-10 opacity-30" />
                      <p className="font-medium">Tidak ada peserta ditemukan</p>
                      <p className="text-xs">Coba ubah kata kunci atau filter pencarian</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <React.Fragment key={p.id}>
                    <tr className={`hover:bg-slate-50/80 transition-colors cursor-pointer group`} onClick={() => toggleRow(p.id)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#253656]/10 flex items-center justify-center text-sm font-black text-[#253656] shrink-0 uppercase">
                            {p.nama_lengkap.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{p.nama_lengkap}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{p.instansi} {p.profesi ? `• ${p.profesi}` : ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-sm hidden md:table-cell">
                        <div>{new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                        <div className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {p.status_hadir ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Hadir
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(p.id, p.status_hadir);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                              p.status_hadir
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                : "bg-[#253656] hover:bg-[#1a263d] text-white shadow-sm shadow-[#253656]/20"
                            }`}
                          >
                            {p.status_hadir ? "Batal" : "✓ Validasi"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(p.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              expandedRows[p.id] 
                                ? "bg-[#253656] text-white" 
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                            title="Lihat Data Lengkap"
                          >
                            {expandedRows[p.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/p/${p.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-[#BD272D] hover:bg-red-50 transition-colors"
                            title="Lihat Tiket"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[p.id] && (
                      <tr id={`details-${p.id}`} className="bg-slate-50 border-b border-slate-100">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-bold text-slate-700">Kontak & Info Utama</p>
                              <p className="text-slate-600"><span className="text-slate-400">Email:</span> {p.email}</p>
                              <p className="text-slate-600"><span className="text-slate-400">WA:</span> {p.wa_number}</p>
                            </div>
                            {p.custom_responses && Object.keys(p.custom_responses).length > 0 && (
                              <div className="space-y-2">
                                <p className="font-bold text-slate-700">Jawaban Form Tambahan</p>
                                {Object.entries(p.custom_responses).map(([key, value]) => (
                                  <div key={key} className="bg-white p-2 rounded border border-slate-200">
                                    <p className="text-xs text-slate-400 font-semibold uppercase">{key}</p>
                                    <p className="text-slate-700 text-sm mt-0.5">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : viewMode === "spreadsheet" ? (
        // --- SPREADSHEET VIEW ---
        <div className="overflow-x-auto w-full max-h-[600px] bg-white">
          <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
              <tr>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Aksi</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Nama Lengkap</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Instansi</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Profesi</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Email</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">No. WhatsApp</th>
                <th className="p-3 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase">Waktu Daftar</th>
                {customHeaders.map(h => (
                  <th key={h} className="p-3 border-r border-slate-200 text-xs font-bold text-[#BD272D] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8 + customHeaders.length} className="p-8 text-center text-slate-400">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-2 border-r border-slate-100">
                       <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(p.id, p.status_hadir);
                          }}
                          className={`px-3 py-1.5 w-full rounded-md text-xs font-bold transition-all ${
                            p.status_hadir
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                              : "bg-[#253656] hover:bg-[#1a263d] text-white"
                          }`}
                        >
                          {p.status_hadir ? "Batal" : "Validasi"}
                        </button>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center font-bold">
                       {p.status_hadir ? <span className="text-green-600">Hadir</span> : <span className="text-orange-500">Pending</span>}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-bold text-[#253656]">{p.nama_lengkap}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{p.instansi || '-'}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{p.profesi || '-'}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{p.email || '-'}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{p.wa_number}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{new Date(p.createdAt).toLocaleString("id-ID")}</td>
                    {customHeaders.map(h => {
                      const val = p.custom_responses ? p.custom_responses[h] : "";
                      return (
                        <td key={h} className="p-3 border-r border-slate-100 text-slate-600">
                          {Array.isArray(val) ? val.join(', ') : String(val || "")}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // --- CHART VIEW ---
        <div className="p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kehadiran Pie Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
              <h3 className="font-bold text-[#253656] mb-4 w-full">Status Kehadiran</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div><span className="text-sm font-bold text-slate-600">Hadir ({totalHadir})</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div><span className="text-sm font-bold text-slate-600">Pending ({participants.length - totalHadir})</span></div>
              </div>
            </div>

            {/* Profesi Bar Chart */}
            {professionData.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#253656] mb-4">Profesi Peserta</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={professionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill="#253656" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Instansi Bar Chart */}
            {instansiData.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#253656] mb-4">Instansi (Top 10)</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={instansiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill="#BD272D" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Custom Questions Charts */}
            {customChartsData.map((chart, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#253656] mb-4 truncate" title={chart.question}>{chart.question}</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill={['#253656', '#BD272D', '#10b981', '#f59e0b', '#8b5cf6'][idx % 5]} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400">Menampilkan <strong className="text-slate-600">{filtered.length}</strong> dari <strong className="text-slate-600">{participants.length}</strong> peserta</p>
          <p className="text-xs font-bold text-[#BD272D]">{totalHadir} sudah hadir</p>
        </div>
      )}
    </div>
  );
}
