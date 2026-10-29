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
const fieldClass = "mt-1.5 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#253656] focus:ring-1 focus:ring-[#253656]";
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
  return <span className={`inline-flex border px-2 py-0.5 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}

function ConflictSummary({ result }: { result: ConflictResult }) {
  if (result.has_conflict) {
    return (
      <div className="flex gap-3 border border-rose-200 bg-rose-50 p-3 text-rose-800">
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
      <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
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
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-3 border-b border-slate-300 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Operasional</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#253656]">Jadwal & Zoom</h1>
            <p className="mt-1 text-sm text-slate-600">Daftar jadwal meeting dan pemeriksaan bentrok.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded border border-[#253656] bg-[#253656] px-3 py-2 text-sm font-medium text-white hover:bg-[#1d2a43]">
            <Plus className="h-4 w-4" /> Tambah Jadwal
          </button>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-slate-300 bg-white p-4">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Jadwal {dayName}</span><CalendarDays className="h-4 w-4 text-slate-500" /></div>
            <p className="mt-2 text-2xl font-semibold text-[#253656]">{stats.total}</p><p className="mt-1 text-xs text-slate-500">{dateLabel(date)}</p>
          </div>
          <div className="border border-slate-300 bg-white p-4">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Terkonfirmasi</span><CheckCircle2 className="h-4 w-4 text-emerald-700" /></div>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{stats.confirmed}</p><p className="mt-1 text-xs text-slate-500">siap untuk meeting</p>
          </div>
          <div className="border border-slate-300 bg-white p-4">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Menunggu kepastian</span><Clock3 className="h-4 w-4 text-amber-700" /></div>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{stats.tentative}</p><p className="mt-1 text-xs text-slate-500">jadwal tentatif</p>
          </div>
          <div className="border border-slate-300 bg-white p-4">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Slot tersedia</span><Video className="h-4 w-4 text-slate-500" /></div>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{stats.availableSlots}<span className="ml-1 text-sm font-normal text-slate-500">/ 24</span></p><p className="mt-1 text-xs text-slate-500">slot 30 menit · 08.00–20.00</p>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <div className="border border-slate-300 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-base font-semibold text-slate-800">Ketersediaan per 30 menit</h2><p className="mt-1 text-xs text-slate-500">{dateLabel(date)} · pukul 08.00–20.00</p></div>
              <label className="flex items-center gap-2 border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <input aria-label="Pilih tanggal timeline" type="date" value={date} onChange={(event) => changeDate(event.target.value)} className="border-0 bg-transparent p-0 text-sm text-slate-700 outline-none focus:ring-0" />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
              {Array.from({ length: 24 }, (_, index) => {
                const start = 8 * 60 + index * 30;
                const end = start + 30;
                const booking = daySchedules.find((schedule) => toMinutes(schedule.start_time) < end && toMinutes(schedule.end_time) > start);
                return (
                  <div key={start} title={booking ? `${booking.title} · ${booking.start_time}–${booking.end_time}` : "Slot tersedia"} className={`min-h-14 border px-2 py-1.5 ${booking ? booking.status === "tentative" ? "border-amber-300 bg-amber-50" : "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
                    <div className="text-xs font-medium tabular-nums text-slate-700">{formatTime(start)}</div>
                    <div className={`mt-1 truncate text-[11px] ${booking ? booking.status === "tentative" ? "text-amber-800" : "text-rose-800" : "text-slate-500"}`}>{booking ? booking.title : "Kosong"}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 border border-slate-300 bg-slate-50" /> Tersedia</span>
              <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 border border-rose-300 bg-rose-50" /> Terisi</span>
              <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 border border-amber-300 bg-amber-50" /> Tentatif</span>
            </div>
          </div>

          <div className="border border-slate-300 bg-white p-4">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-800">Pemeriksa bentrok</h2><p className="mt-1 text-xs text-slate-500">Periksa tanggal dan jam sebelum menyimpan.</p></div>{quickLoading && <RefreshCw className="mt-1 h-4 w-4 animate-spin text-slate-500" />}</div>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-600">Tanggal<input type="date" value={quickDate} onChange={(event) => setQuickDate(event.target.value)} className={fieldClass} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-600">Mulai<input type="time" value={quickStart} onChange={(event) => setQuickStart(event.target.value)} className={fieldClass} /></label>
                <label className="block text-xs font-bold text-slate-600">Selesai<input type="time" value={quickEnd} onChange={(event) => setQuickEnd(event.target.value)} className={fieldClass} /></label>
              </div>
              {!timeRangeValid && <p className="text-xs font-semibold text-rose-600">Jam selesai harus setelah jam mulai.</p>}
              {quickError && <p className="text-xs font-semibold text-rose-600">{quickError}</p>}
              {quickResult && <ConflictSummary result={quickResult} />}
              {!quickResult && !quickLoading && timeRangeValid && !quickError && <div className="border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">Memeriksa jadwal untuk tanggal dan waktu yang dipilih…</div>}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border border-slate-300 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-base font-semibold text-slate-800">Daftar jadwal</h2><p className="mt-1 text-xs text-slate-500">{schedules.length} jadwal tercatat.</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 border border-slate-300 px-2 py-1.5"><Search className="h-4 w-4 text-slate-500" /><input aria-label="Cari jadwal" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari jadwal…" className="w-full border-0 p-0 text-sm outline-none focus:ring-0 sm:w-40" /></label>
              <label className="flex items-center gap-2 border border-slate-300 px-2 py-1.5"><Filter className="h-4 w-4 text-slate-500" /><select aria-label="Filter jenis jadwal" value={filter} onChange={(event) => setFilter(event.target.value)} className="border-0 p-0 pr-7 text-sm text-slate-700 outline-none focus:ring-0"><option value="all">Semua jadwal</option><option value="recurring">Rutin mingguan</option><option value="single">Tanggal tertentu</option></select></label>
            </div>
          </div>
          {filteredSchedules.length === 0 ? (
            <div className="px-4 py-8 text-center"><p className="text-sm font-medium text-slate-700">{schedules.length ? "Tidak ada jadwal yang cocok" : "Belum ada jadwal Zoom"}</p><p className="mt-1 text-xs text-slate-500">{schedules.length ? "Ubah filter atau kata kunci pencarian." : "Tambahkan jadwal untuk mulai memakai tracker."}</p>{!schedules.length && <button onClick={openCreate} className="mt-3 border border-[#253656] px-3 py-1.5 text-sm text-[#253656] hover:bg-slate-50">Tambah jadwal</button>}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="border-b border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700"><tr><th className="px-4 py-2.5">Meeting</th><th className="px-4 py-2.5">Jadwal</th><th className="px-4 py-2.5">PIC</th><th className="px-4 py-2.5">Zoom</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5 text-right">Aksi</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="align-top hover:bg-slate-50">
                      <td className="px-4 py-3"><p className="font-medium text-slate-800">{schedule.title}</p><p className="mt-0.5 text-xs text-slate-500">{schedule.division}{schedule.notes ? ` · ${schedule.notes}` : ""}</p></td>
                      <td className="px-4 py-3"><p className="text-slate-700">{schedule.start_time}–{schedule.end_time}</p><p className="mt-0.5 text-xs text-slate-500">{schedule.is_recurring ? `Setiap ${schedule.day_of_week}` : schedule.meeting_date ? dateLabel(schedule.meeting_date) : "—"}</p></td>
                      <td className="px-4 py-3"><p className="inline-flex items-center gap-1.5 text-slate-700"><Users className="h-3.5 w-3.5 text-slate-500" />{schedule.pic_name}</p>{schedule.pic_contact && <p className="mt-0.5 text-xs text-slate-500">{schedule.pic_contact}</p>}</td>
                      <td className="px-4 py-3">{schedule.zoom_link ? <a href={schedule.zoom_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"><Link2 className="h-3.5 w-3.5" />Buka meeting<ExternalLink className="h-3 w-3" /></a> : <span className="text-xs text-slate-500">Belum ada link</span>}{schedule.zoom_id && <p className="mt-0.5 text-xs text-slate-500">ID: {schedule.zoom_id}</p>}</td>
                      <td className="px-4 py-3"><StatusBadge status={schedule.status} /></td>
                      <td className="px-4 py-3"><div className="flex justify-end gap-1">{schedule.zoom_link && <button onClick={() => copyZoomLink(schedule)} title="Salin link Zoom" className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800">{copiedId === schedule.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>}<button onClick={() => openEdit(schedule)} title="Edit jadwal" className="rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100">Edit</button><button onClick={() => deleteSchedule(schedule)} title="Hapus jadwal" className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title" className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto border border-slate-300 bg-white">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-4 sm:p-5"><div><h2 id="schedule-modal-title" className="text-lg font-semibold text-[#253656]">{form.data.id ? "Edit Jadwal" : "Tambah Jadwal Zoom"}</h2><p className="mt-1 text-sm text-slate-500">Detail jadwal dan informasi meeting.</p></div><button type="button" onClick={closeModal} aria-label="Tutup dialog" className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"><X className="h-5 w-5" /></button></div>
            <form onSubmit={submitSchedule} className="space-y-5 p-4 sm:p-5">
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
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><RefreshCw className={`h-3.5 w-3.5 ${formConflictLoading ? "animate-spin" : ""}`} />Pemeriksaan bentrok langsung</div>
                {!formTimeRangeValid && <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">Masukkan jam selesai setelah jam mulai.</p>}
                {formConflict && <ConflictSummary result={formConflict} />}
                {formConflictError && <p className="border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formConflictError}</p>}
                {scheduleError && <p className="border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{scheduleError}</p>}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={form.processing || !formTimeRangeValid || formConflictLoading || Boolean(formConflict?.has_conflict)} className="inline-flex items-center justify-center gap-2 border border-[#253656] bg-[#253656] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b2942] disabled:cursor-not-allowed disabled:opacity-50"><Check className="h-4 w-4" />{form.processing ? "Menyimpan…" : form.data.id ? "Simpan Perubahan" : "Simpan Jadwal"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
