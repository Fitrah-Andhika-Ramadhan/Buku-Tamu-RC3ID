import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";
import { Head, useForm } from "@inertiajs/react";
import { Database, Play, AlertCircle, Table2 } from "lucide-react";
import { useState } from "react";

interface Props {
  tables: string[];
  initialResults: any[] | null;
  initialError: string | null;
  initialSql: string;
}

export default function DbViewer({ tables, initialResults, initialError, initialSql }: Props) {
  const { data, setData, post, processing } = useForm({
    sql: initialSql || "",
  });

  const runQuery = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.db.viewer'));
  };

  const setTableQuery = (tableName: string) => {
    setData('sql', `SELECT * FROM ${tableName} LIMIT 50`);
    setTimeout(() => {
        post(route('admin.db.viewer'));
    }, 100);
  };

  return (
    <AdminLayoutWrapper>
      <Head title="DB SQL Viewer" />
      
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-[#253656] flex items-center gap-3">
            <Database className="w-8 h-8 text-[#BD272D]" />
            DB SQL Viewer
          </h1>
          <p className="text-gray-500 mt-2">Jalankan query SQL secara langsung untuk menganalisis data (Hanya Read-Only / SELECT).</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tables Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Table2 className="w-4 h-4" /> Daftar Tabel
            </h2>
            <div className="space-y-1 overflow-y-auto max-h-[600px] scrollbar-thin">
              {tables.map(table => (
                <button
                  key={table}
                  onClick={() => setTableQuery(table)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#BD272D] rounded-lg transition-colors truncate"
                >
                  {table}
                </button>
              ))}
            </div>
          </div>

          {/* Main Query Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#1a263d] rounded-2xl shadow-xl overflow-hidden border border-[#253656]">
              <div className="bg-[#253656] px-4 py-3 flex justify-between items-center border-b border-white/10">
                <span className="text-white/80 font-mono text-sm">SQL Query Editor</span>
              </div>
              <form onSubmit={runQuery}>
                <textarea
                  value={data.sql}
                  onChange={e => setData('sql', e.target.value)}
                  className="w-full bg-transparent text-green-400 font-mono p-4 min-h-[150px] border-none focus:ring-0 resize-y"
                  placeholder="SELECT * FROM users LIMIT 10;"
                  spellCheck="false"
                />
                <div className="px-4 py-3 bg-black/20 flex justify-end border-t border-white/5">
                  <button
                    type="submit"
                    disabled={processing || !data.sql}
                    className="bg-[#BD272D] hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" /> {processing ? 'Running...' : 'Jalankan Query'}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Display */}
            {initialError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-mono text-sm break-all">{initialError}</p>
              </div>
            )}

            {/* Results Display */}
            {initialResults && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-700">Hasil Query</h3>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {initialResults.length} Baris
                  </span>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                  {initialResults.length > 0 ? (
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 shadow-sm">
                        <tr>
                          {Object.keys(initialResults[0]).map(key => (
                            <th key={key} className="px-4 py-3 font-bold whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {initialResults.map((row, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="px-4 py-2 text-gray-600 whitespace-nowrap max-w-xs truncate">
                                {val === null ? <span className="text-gray-400 italic">null</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      Tidak ada data yang ditemukan.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
