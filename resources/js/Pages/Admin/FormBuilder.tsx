import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AdminLayoutWrapper } from '@/Components/AdminLayoutWrapper';
import { Save, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';

interface FormField {
    id: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'radio' | 'checkbox';
    label: string;
    name: string;
    required: boolean;
    options?: string[];
}

export default function FormBuilder({ formFields }: { formFields: FormField[] }) {
    const [fields, setFields] = useState<FormField[]>(formFields || []);

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        fields: formFields || [],
    });

    const addField = () => {
        const newField: FormField = {
            id: Date.now().toString(),
            type: 'text',
            label: 'New Field',
            name: 'new_field_' + Date.now(),
            required: false,
        };
        const updated = [...fields, newField];
        setFields(updated);
        setData('fields', updated);
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        const updated = fields.map(f => (f.id === id ? { ...f, ...updates } : f));
        setFields(updated);
        setData('fields', updated);
    };

    const removeField = (id: string) => {
        const updated = fields.filter(f => f.id !== id);
        setFields(updated);
        setData('fields', updated);
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === fields.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...fields];
        const temp = updated[index];
        updated[index] = updated[newIndex];
        updated[newIndex] = temp;
        
        setFields(updated);
        setData('fields', updated);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.form.builder.save'));
    };

    return (
        <AdminLayoutWrapper>
            <Head title="Form Builder" />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-black text-[#253656] tracking-tight mb-2">Form Builder</h1>
                    <p className="text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium">Buat dan atur form pertanyaan dinamis untuk peserta buku tamu.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {recentlySuccessful && (
                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            <span className="text-sm font-bold">Tersimpan!</span>
                        </div>
                    )}
                    <button
                        onClick={addField}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#253656] font-bold rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Field
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#BD272D] to-[#991f24] text-white font-bold rounded-xl shadow-md hover:shadow-lg border border-transparent hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        <Save className="w-4 h-4" />
                        Simpan Form
                    </button>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-[#253656]/5 border border-white relative z-10">
                {fields.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                            <Plus className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-[#253656] mb-2">Belum ada field khusus</h3>
                        <p className="text-[#6C7C98] text-sm max-w-md mx-auto">Klik "Tambah Field" di atas untuk mulai membuat pertanyaan dinamis untuk buku tamu Anda.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative group transition-all hover:shadow-md hover:border-blue-100">
                                
                                {/* Drag Handles & Actions */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                        <button 
                                            type="button"
                                            onClick={() => moveField(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1.5 text-gray-400 hover:text-[#253656] disabled:opacity-30 disabled:hover:text-gray-400 rounded-md hover:bg-white"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => moveField(index, 'down')}
                                            disabled={index === fields.length - 1}
                                            className="p-1.5 text-gray-400 hover:text-[#253656] disabled:opacity-30 disabled:hover:text-gray-400 rounded-md hover:bg-white"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeField(field.id)}
                                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <div className="pt-2 cursor-move text-gray-300 hover:text-[#253656] transition-colors">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                                        
                                        {/* Label */}
                                        <div className="lg:col-span-4 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Label Pertanyaan</label>
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#253656] focus:ring-2 focus:ring-[#253656]/10 rounded-xl px-4 py-2.5 font-medium transition-all"
                                                placeholder="Contoh: Darimana Anda mengetahui acara ini?"
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className="lg:col-span-3 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Variable Name</label>
                                            <input
                                                type="text"
                                                value={field.name}
                                                onChange={(e) => updateField(field.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() })}
                                                className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#253656] focus:ring-2 focus:ring-[#253656]/10 rounded-xl px-4 py-2.5 font-mono text-sm transition-all"
                                                placeholder="contoh_field"
                                            />
                                        </div>

                                        {/* Type */}
                                        <div className="lg:col-span-3 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tipe Input</label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#253656] focus:ring-2 focus:ring-[#253656]/10 rounded-xl px-4 py-2.5 font-medium transition-all"
                                            >
                                                <option value="text">Teks Pendek</option>
                                                <option value="textarea">Teks Panjang (Textarea)</option>
                                                <option value="email">Email</option>
                                                <option value="tel">Telepon / Angka</option>
                                                <option value="radio">Pilihan Tunggal (Radio)</option>
                                                <option value="checkbox">Pilihan Ganda (Checkbox)</option>
                                            </select>
                                        </div>

                                        {/* Required Checkbox */}
                                        <div className="lg:col-span-2 space-y-2 flex flex-col justify-end pb-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                    className="w-5 h-5 rounded-md border-gray-300 text-[#BD272D] focus:ring-[#BD272D]"
                                                />
                                                <span className="text-sm font-bold text-[#253656]">Wajib Diisi</span>
                                            </label>
                                        </div>

                                        {/* Options for Radio/Checkbox */}
                                        {(field.type === 'radio' || field.type === 'checkbox') && (
                                            <div className="lg:col-span-12 mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">Pilihan Jawaban (Pisahkan dengan koma)</label>
                                                <input
                                                    type="text"
                                                    value={field.options?.join(', ') || ''}
                                                    onChange={(e) => updateField(field.id, { 
                                                        options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                    })}
                                                    className="w-full bg-white border border-gray-200 focus:border-[#253656] focus:ring-2 focus:ring-[#253656]/10 rounded-xl px-4 py-2.5 transition-all"
                                                    placeholder="Pilihan 1, Pilihan 2, Pilihan 3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayoutWrapper>
    );
}
