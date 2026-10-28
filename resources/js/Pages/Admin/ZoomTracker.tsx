import { useEffect, useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Filter,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/Components/AdminLayoutWrapper";

type ScheduleStatus = "confirmed" | "tentative" | "cancelled";
type Schedule = {
  id: number;
  title: string;
  division: string;
  pic_name: string;
  pic_contact: string | null;
  is_recurring: boolean;
  meeting_date: string | null;
  day_of_week: string | null;
  start_time: string;
  end_time: string;
  zoom_link: string | null;
  zoom_id: string | null;
  zoom_passcode: string | null;
  status: ScheduleStatus;
  notes: string | null;
};
type Stats = {
  total: number;
  confirmed: number;
  tentative: number;
  busySlots: number;
  availableSlots: number;
};
type ConflictResult = {
  has_conflict: boolean;
  day_name: string;
  conflicts: Schedule[];
};
type ScheduleForm = Omit<Schedule, "id"> & { id: number | null };

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DIVISIONS = ["CnL", "WP1", "WP2", "WP3", "WP4", "WP5", "HR", "Manajemen", "Umum"];
const fieldClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#253656] focus:ring-2 focus:ring-[#253656]/10";
const emptyForm = (date: string): ScheduleForm => ({
  id: null,
  title: "",
  division: "CnL",
  pic_name: "",
  pic_contact: "",
  is_recurring: false,
  meeting_date: date,
  day_of_week: "Senin",
  start_time: "09:00",
  end_time: "10:00",
  zoom_link: "",
  zoom_id: "",
  zoom_passcode: "",
  status: "confirmed",
  notes: "",
});

function toMinutes(time: string) {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number) {
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function StatusBadge({ status }: { status: ScheduleStatus }) {
  const styles = {
    confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    tentative: "bg-amber-50 text-amber-700 ring-amber-600/15",
    cancelled: "bg-slate-100 text-slate-500 ring-slate-500/10",
  };
  const labels = { confirmed: "Terkonfirmasi", tentative: "Tentatif", cancelled: "Dibatalkan" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${styles[status]}`}>{labels[status]}</span>;
}

function ConflictSummary({ result }: { result: ConflictResult }) {
  if (result.has_conflict) {
    return (
      <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-rose-800">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Slot ini bentrok</p>
          <ul className="mt-1 space-y-1 text-xs text-rose-700">
            {result.conflicts.map((schedule) => <li key={schedule.id}>{schedule.start_time}–{schedule.end_time} · {schedule.title} ({schedule.division})</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-800">
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <div><p className="text-sm font-bold">Slot tersedia</p><p className="mt-0.5 text-xs text-emerald-700">Tidak ada jadwal lain yang tumpang tindih.</p></div>
    </div>
  );
}

export default function ZoomTracker({ date, dayName, schedules, daySchedules, stats }: { date: string; dayName: string; schedules: Schedule[]; daySchedules: Schedule[]; stats: Stats }) {
  const [quickDate, setQuickDate] = useState(date);
  const [quickStart, setQuickStart] = useState("09:00");
  const [quickEnd, setQuickEnd] = useState("10:00");
  const [quickResult, setQuickResult] = useState<ConflictResult | null>(null);
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formConflict, setFormConflict] = useState<ConflictResult | null>(null);
  const [formConflictError, setFormConflictError] = useState("");
  const [formConflictLoading, setFormConflictLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const form = useForm<ScheduleForm>(emptyForm(date));

  useEffect(() => {
    setQuickDate(date);
  }, [date]);

  useEffect(() => {
    if (!quickDate || !quickStart || !quickEnd || quickEnd <= quickStart) {
      setQuickResult(null);
      setQuickError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setQuickLoading(true);
      setQuickError("");
      try {
        const response = await axios.get<ConflictResult>("/admin/zoom-tracker/conflict", {
          params: { date: quickDate, start_time: quickStart, end_time: quickEnd },
          signal: controller.signal,
        });
        setQuickResult(response.data);
      } catch (error: any) {
        if (!controller.signal.aborted) {
          setQuickResult(null);
          setQuickError(error.response?.data?.message || "Gagal memeriksa ketersediaan slot.");
        }
      } finally {
        if (!controller.signal.aborted) setQuickLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [quickDate, quickStart, quickEnd]);

  const formData = form.data;
  const scheduleError = (form.errors as Record<string, string>).schedule;
  useEffect(() => {
    if (!isModalOpen || formData.status === "cancelled" || !formData.start_time || !formData.end_time || formData.end_time <= formData.start_time) {
      setFormConflict(null);
      setFormConflictError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setFormConflictLoading(true);
      setFormConflictError("");
      try {
        const response = await axios.get<ConflictResult>("/admin/zoom-tracker/conflict", {
          params: {
            date: formData.meeting_date || date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            exclude_id: formData.id || undefined,
            is_recurring: formData.is_recurring ? 1 : 0,
            day_of_week: formData.is_recurring ? formData.day_of_week : undefined,
          },
          signal: controller.signal,
        });
        setFormConflict(response.data);
      } catch (error: any) {
        if (!controller.signal.aborted) {
          setFormConflict(null);
          setFormConflictError(error.response?.data?.message || "Gagal memeriksa bentrok jadwal.");
        }
      } finally {
        if (!controller.signal.aborted) setFormConflictLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isModalOpen, formData.meeting_date, formData.start_time, formData.end_time, formData.is_recurring, formData.day_of_week, formData.id, formData.status, date]);

  const filteredSchedules = useMemo(() => schedules.filter((schedule) => {
    const matchesFilter = filter === "all" || (filter === "recurring" ? schedule.is_recurring : !schedule.is_recurring);
    const query = search.trim().toLocaleLowerCase("id-ID");
    const matchesSearch = !query || [schedule.title, schedule.division, schedule.pic_name, schedule.day_of_week || ""].some((value) => value.toLocaleLowerCase("id-ID").includes(query));
    return matchesFilter && matchesSearch;
  }), [schedules, filter, search]);

  const openCreate = () => {
    form.clearErrors();
    form.setData(emptyForm(date));
    setFormConflict(null);
    setIsModalOpen(true);
  };

  const openEdit = (schedule: Schedule) => {
    form.clearErrors();
    form.setData({ ...schedule, pic_contact: schedule.pic_contact || "", zoom_link: schedule.zoom_link || "", zoom_id: schedule.zoom_id || "", zoom_passcode: schedule.zoom_passcode || "", notes: schedule.notes || "" });
    setFormConflict(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.clearErrors();
  };

  const submitSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    const options = { preserveScroll: true, onSuccess: closeModal };
    if (form.data.id) form.put(`/admin/zoom-tracker/${form.data.id}`, options);
    else form.post("/admin/zoom-tracker", options);
  };

  const deleteSchedule = (schedule: Schedule) => {
    if (window.confirm(`Hapus jadwal “${schedule.title}”?`)) {
      router.delete(`/admin/zoom-tracker/${schedule.id}`, { preserveScroll: true });
    }
  };

  const copyZoomLink = async (schedule: Schedule) => {
    if (!schedule.zoom_link) return;
    try {
      await navigator.clipboard.writeText(schedule.zoom_link);
      setCopiedId(schedule.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      window.prompt("Salin link Zoom:", schedule.zoom_link);
    }
  };

  const changeDate = (nextDate: string) => {
    setQuickDate(nextDate);
    router.get("/admin/zoom-tracker", { date: nextDate }, { preserveState: true, preserveScroll: true, replace: true });
  };

  const timeRangeValid = quickStart && quickEnd && quickEnd > quickStart;
  const formTimeRangeValid = formData.start_time && formData.end_time && formData.end_time > formData.start_time;

  return (
    <AdminLayoutWrapper>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#BD272D]">Operasional · Meeting Room</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[#253656]">Jadwal & Zoom</h1>
            <p className="mt-1 text-sm text-slate-500">Atur jadwal meeting dan pastikan tidak ada bentrok.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BD272D] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#BD272D]/15 transition hover:bg-[#a71f25]">
            <Plus className="h-4 w-4" /> Tambah Jadwal
          </button>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Jadwal {dayName}</span><CalendarDays className="h-5 w-5 text-indigo-500" /></div>
            <p className="mt-3 text-3xl font-black text-[#253656]">{stats.total}</p><p className="mt-1 text-xs text-slate-400">{dateLabel(date)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Terkonfirmasi</span><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
            <p className="mt-3 text-3xl font-black text-emerald-700">{stats.confirmed}</p><p className="mt-1 text-xs text-slate-400">siap untuk meeting</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Menunggu kepastian</span><Clock3 className="h-5 w-5 text-amber-500" /></div>
            <p className="mt-3 text-3xl font-black text-amber-600">{stats.tentative}</p><p className="mt-1 text-xs text-slate-400">jadwal tentatif</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Slot tersedia</span><Video className="h-5 w-5 text-sky-500" /></div>
            <p className="mt-3 text-3xl font-black text-sky-700">{stats.availableSlots}<span className="ml-1 text-sm font-bold">/ 24</span></p><p className="mt-1 text-xs text-slate-400">slot 30 menit · 08.00–20.00</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-lg font-black text-[#253656]">Timeline Ketersediaan</h2><p className="mt-1 text-sm text-slate-500">Status ruang meeting per 30 menit.</p></div>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <input aria-label="Pilih tanggal timeline" type="date" value={date} onChange={(event) => changeDate(event.target.value)} className="border-0 bg-transparent p-0 text-sm font-semibold text-slate-700 outline-none focus:ring-0" />
              </label>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
              {Array.from({ length: 24 }, (_, index) => {
                const start = 8 * 60 + index * 30;
                const end = start + 30;
                const booking = daySchedules.find((schedule) => toMinutes(schedule.start_time) < end && toMinutes(schedule.end_time) > start);
                return (
                  <div key={start} title={booking ? `${booking.title} · ${booking.start_time}–${booking.end_time}` : "Slot tersedia"} className={`min-h-[76px] rounded-xl border p-2.5 ${booking ? booking.status === "tentative" ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50" : "border-emerald-100 bg-emerald-50/60"}`}>
                    <div className="text-[11px] font-black tabular-nums text-slate-600">{formatTime(start)}</div>
                    <div className={`mt-2 truncate text-[10px] font-bold ${booking ? booking.status === "tentative" ? "text-amber-700" : "text-rose-700" : "text-emerald-700"}`}>{booking ? booking.title : "Tersedia"}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Tersedia</span>
              <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-rose-400" /> Terisi</span>
              <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Tentatif</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-black text-[#253656]">⚡ Cek Slot Cepat</h2><p className="mt-1 text-sm text-slate-500">Periksa sebelum mengajukan jadwal.</p></div>{quickLoading && <RefreshCw className="mt-1 h-4 w-4 animate-spin text-slate-400" />}</div>
            <div className="mt-5 space-y-3">
              <label className="block text-xs font-bold text-slate-600">Tanggal<input type="date" value={quickDate} onChange={(event) => setQuickDate(event.target.value)} className={fieldClass} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-600">Mulai<input type="time" value={quickStart} onChange={(event) => setQuickStart(event.target.value)} className={fieldClass} /></label>
                <label className="block text-xs font-bold text-slate-600">Selesai<input type="time" value={quickEnd} onChange={(event) => setQuickEnd(event.target.value)} className={fieldClass} /></label>
              </div>
              {!timeRangeValid && <p className="text-xs font-semibold text-rose-600">Jam selesai harus setelah jam mulai.</p>}
              {quickError && <p className="text-xs font-semibold text-rose-600">{quickError}</p>}
              {quickResult && <ConflictSummary result={quickResult} />}
              {!quickResult && !quickLoading && timeRangeValid && !quickError && <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-500">Memeriksa jadwal untuk tanggal dan waktu yang dipilih…</div>}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><h2 className="text-lg font-black text-[#253656]">Kelola Jadwal</h2><p className="mt-1 text-sm text-slate-500">{schedules.length} jadwal tercatat di tracker.</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input aria-label="Cari jadwal" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari jadwal…" className="w-full border-0 p-0 text-sm outline-none focus:ring-0 sm:w-40" /></label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><Filter className="h-4 w-4 text-slate-400" /><select aria-label="Filter jenis jadwal" value={filter} onChange={(event) => setFilter(event.target.value)} className="border-0 p-0 pr-7 text-sm font-semibold text-slate-600 outline-none focus:ring-0"><option value="all">Semua jadwal</option><option value="recurring">Rutin mingguan</option><option value="single">Tanggal tertentu</option></select></label>
            </div>
          </div>
          {filteredSchedules.length === 0 ? (
            <div className="px-6 py-14 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400"><Video className="h-7 w-7" /></div><p className="mt-4 font-bold text-slate-700">{schedules.length ? "Tidak ada jadwal yang cocok" : "Belum ada jadwal Zoom"}</p><p className="mt-1 text-sm text-slate-500">{schedules.length ? "Ubah filter atau kata kunci pencarian." : "Tambahkan jadwal pertama untuk mulai memakai tracker."}</p>{!schedules.length && <button onClick={openCreate} className="mt-4 text-sm font-bold text-[#BD272D] hover:underline">Tambah jadwal</button>}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3.5">Meeting</th><th className="px-5 py-3.5">Jadwal</th><th className="px-5 py-3.5">PIC</th><th className="px-5 py-3.5">Zoom</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="align-top transition hover:bg-slate-50/70">
                      <td className="px-5 py-4"><p className="font-bold text-slate-800">{schedule.title}</p><p className="mt-1 text-xs text-slate-500">{schedule.division}{schedule.notes ? ` · ${schedule.notes}` : ""}</p></td>
                      <td className="px-5 py-4"><p className="font-semibold text-slate-700">{schedule.start_time}–{schedule.end_time}</p><p className="mt-1 text-xs text-slate-500">{schedule.is_recurring ? `Setiap ${schedule.day_of_week}` : schedule.meeting_date ? dateLabel(schedule.meeting_date) : "—"}</p></td>
                      <td className="px-5 py-4"><p className="inline-flex items-center gap-1.5 font-semibold text-slate-700"><Users className="h-3.5 w-3.5 text-slate-400" />{schedule.pic_name}</p>{schedule.pic_contact && <p className="mt-1 text-xs text-slate-500">{schedule.pic_contact}</p>}</td>
                      <td className="px-5 py-4">{schedule.zoom_link ? <a href={schedule.zoom_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"><Link2 className="h-3.5 w-3.5" />Buka meeting<ExternalLink className="h-3 w-3" /></a> : <span className="text-xs text-slate-400">Belum ada link</span>}{schedule.zoom_id && <p className="mt-1 text-[11px] text-slate-400">ID: {schedule.zoom_id}</p>}</td>
                      <td className="px-5 py-4"><StatusBadge status={schedule.status} /></td>
                      <td className="px-5 py-4"><div className="flex justify-end gap-1.5">{schedule.zoom_link && <button onClick={() => copyZoomLink(schedule)} title="Salin link Zoom" className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">{copiedId === schedule.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>}<button onClick={() => openEdit(schedule)} title="Edit jadwal" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100">Edit</button><button onClick={() => deleteSchedule(schedule)} title="Hapus jadwal" className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title" className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 p-5 backdrop-blur sm:p-6"><div><h2 id="schedule-modal-title" className="text-xl font-black text-[#253656]">{form.data.id ? "Edit Jadwal" : "Tambah Jadwal Zoom"}</h2><p className="mt-1 text-sm text-slate-500">Detail jadwal dan informasi meeting.</p></div><button type="button" onClick={closeModal} aria-label="Tutup dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></div>
            <form onSubmit={submitSchedule} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold text-slate-600 sm:col-span-2">Nama kegiatan / meeting *<input autoFocus required value={form.data.title} onChange={(event) => form.setData("title", event.target.value)} placeholder="Contoh: Rapat koordinasi mingguan" className={fieldClass} />{form.errors.title && <span className="mt-1 block text-xs text-rose-600">{form.errors.title}</span>}</label>
                <label className="block text-xs font-bold text-slate-600">Divisi *<input list="zoom-divisions" required value={form.data.division} onChange={(event) => form.setData("division", event.target.value)} className={fieldClass} /><datalist id="zoom-divisions">{DIVISIONS.map((division) => <option key={division} value={division} />)}</datalist>{form.errors.division && <span className="mt-1 block text-xs text-rose-600">{form.errors.division}</span>}</label>
                <label className="block text-xs font-bold text-slate-600">Nama PIC *<input required value={form.data.pic_name} onChange={(event) => form.setData("pic_name", event.target.value)} className={fieldClass} />{form.errors.pic_name && <span className="mt-1 block text-xs text-rose-600">{form.errors.pic_name}</span>}</label>
                <label className="block text-xs font-bold text-slate-600">No. HP / WhatsApp<input value={form.data.pic_contact || ""} onChange={(event) => form.setData("pic_contact", event.target.value)} placeholder="Opsional" className={fieldClass} />{form.errors.pic_contact && <span className="mt-1 block text-xs text-rose-600">{form.errors.pic_contact}</span>}</label>
                <label className="block text-xs font-bold text-slate-600">Jenis jadwal<select value={form.data.is_recurring ? "recurring" : "single"} onChange={(event) => form.setData("is_recurring", event.target.value === "recurring")} className={fieldClass}><option value="single">Tanggal tertentu</option><option value="recurring">Rutin mingguan</option></select></label>
                {form.data.is_recurring ? (
                  <label className="block text-xs font-bold text-slate-600">Hari rutin *<select value={form.data.day_of_week || "Senin"} onChange={(event) => form.setData("day_of_week", event.target.value)} className={fieldClass}>{DAYS.map((day) => <option key={day} value={day}>{day}</option>)}</select>{form.errors.day_of_week && <span className="mt-1 block text-xs text-rose-600">{form.errors.day_of_week}</span>}</label>
                ) : (
                  <label className="block text-xs font-bold text-slate-600">Tanggal meeting *<input type="date" required value={form.data.meeting_date || ""} onChange={(event) => form.setData("meeting_date", event.target.value)} className={fieldClass} />{form.errors.meeting_date && <span className="mt-1 block text-xs text-rose-600">{form.errors.meeting_date}</span>}</label>
                )}
                <label className="block text-xs font-bold text-slate-600">Jam mulai *<input type="time" required value={form.data.start_time} onChange={(event) => form.setData("start_time", event.target.value)} className={fieldClass} />{form.errors.start_time && <span className="mt-1 block text-xs text-rose-600">{form.errors.start_time}</span>}</label>
                <label className="block text-xs font-bold text-slate-600">Jam selesai *<input type="time" required value={form.data.end_time} onChange={(event) => form.setData("end_time", event.target.value)} className={fieldClass} />{form.errors.end_time && <span className="mt-1 block text-xs text-rose-600">{form.errors.end_time}</span>}</label>
                <label className="block text-xs font-bold text-slate-600 sm:col-span-2">Link Zoom<input type="url" value={form.data.zoom_link || ""} onChange={(event) => form.setData("zoom_link", event.target.value)} placeholder="https://zoom.us/j/..." className={fieldClass} />{form.errors.zoom_link && <span className="mt-1 block text-xs text-rose-600">{form.errors.zoom_link}</span>}</label>
                <label className="block text-xs font-bold text-slate-600">Meeting ID<input value={form.data.zoom_id || ""} onChange={(event) => form.setData("zoom_id", event.target.value)} className={fieldClass} /></label>
                <label className="block text-xs font-bold text-slate-600">Passcode<input value={form.data.zoom_passcode || ""} onChange={(event) => form.setData("zoom_passcode", event.target.value)} className={fieldClass} /></label>
                <label className="block text-xs font-bold text-slate-600">Status<select value={form.data.status} onChange={(event) => form.setData("status", event.target.value as ScheduleStatus)} className={fieldClass}><option value="confirmed">Terkonfirmasi</option><option value="tentative">Tentatif</option><option value="cancelled">Dibatalkan</option></select></label>
                <label className="block text-xs font-bold text-slate-600 sm:col-span-2">Catatan<textarea rows={3} value={form.data.notes || ""} onChange={(event) => form.setData("notes", event.target.value)} placeholder="Catatan tambahan (opsional)" className={fieldClass} /></label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><RefreshCw className={`h-3.5 w-3.5 ${formConflictLoading ? "animate-spin" : ""}`} />Pemeriksaan bentrok langsung</div>
                {!formTimeRangeValid && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">Masukkan jam selesai setelah jam mulai.</p>}
                {formConflict && <ConflictSummary result={formConflict} />}
                {formConflictError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{formConflictError}</p>}
                {scheduleError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{scheduleError}</p>}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={form.processing || !formTimeRangeValid || formConflictLoading || Boolean(formConflict?.has_conflict)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#253656] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1b2942] disabled:cursor-not-allowed disabled:opacity-50"><Check className="h-4 w-4" />{form.processing ? "Menyimpan…" : form.data.id ? "Simpan Perubahan" : "Simpan Jadwal"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
