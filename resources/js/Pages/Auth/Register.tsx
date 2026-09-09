import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Send } from 'lucide-react';

interface SocialLink { emoji: string; label: string; url: string; }
interface FormHeader {
  title_line1: string;
  title_line2: string;
  description: string;
  social_links: SocialLink[];
  show_banner?: boolean;
  banner_image_path?: string | null;
}

export default function Register({ formFields = [], formHeader }: { formFields?: any[], formHeader?: FormHeader }) {
  const header: FormHeader = formHeader || {
    title_line1: 'Form Buku Tamu',
    title_line2: 'Booth RC3ID',
    description: 'Selamat datang di booth RC3ID.',
    social_links: [],
  };
    // Generate initial dynamic data state
    const initialDynamicData: Record<string, string> = {};
    formFields.forEach(field => {
        initialDynamicData[field.name] = '';
    });

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        full_name: '',
        wa_number: '',
        email: '',
        institution: '',
        ...initialDynamicData
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#253656] font-['Outfit'] selection:bg-[#BD272D] selection:text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* HD Background - VibeDesk Style */}
            <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                <div className="absolute left-[10%] top-[10%] z-0 h-[400px] w-[400px] rounded-full bg-[#BD272D] opacity-[0.10] blur-[100px] animate-pulse pointer-events-none"></div>
                <div className="absolute right-[-5%] bottom-[10%] z-0 h-[500px] w-[500px] rounded-full bg-[#253656] opacity-[0.08] blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }}></div>
                <div className="absolute bottom-1/2 left-[20%] z-0 h-[300px] w-[300px] rounded-full bg-cyan-500 opacity-[0.03] blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "4s" }}></div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <header className="w-full flex items-center justify-between mb-8">
                    <img src="/logo.svg" alt="RC3ID Logo" className="h-8 md:h-10 w-auto" />
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-[#6C7C98] hover:text-[#BD272D] transition-colors uppercase tracking-[0.15em]">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                    </Link>
                </header>

                <div className="bg-white/70 backdrop-blur-3xl border border-white shadow-2xl shadow-[#253656]/10 rounded-[2.5rem] overflow-hidden">
                    {/* Banner Image */}
                    {header.show_banner && header.banner_image_path && (
                        <div className="w-full">
                            <img src={header.banner_image_path} alt="Banner" className="w-full h-auto object-cover" />
                        </div>
                    )}
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#253656] to-[#1a263d] p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#BD272D]/30 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                                {header.title_line1} <br/> <span className="text-[#BD272D] drop-shadow-md">{header.title_line2}</span>
                            </h1>
                            <div className="text-blue-100 font-['Plus_Jakarta_Sans'] text-sm md:text-base leading-relaxed max-w-3xl font-medium space-y-4">
                                {header.description.split('\n\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))}
                                
                                {header.social_links.length > 0 && (
                                    <>
                                        <hr className="border-white/20 my-4" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-blue-200">
                                            {header.social_links.map((link: SocialLink, i: number) => (
                                                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">{link.emoji} {link.label}</a>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="p-8 md:p-12 space-y-8">
                        {/* Nama & WA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-[#253656] uppercase tracking-[0.1em]">Nama Lengkap (beserta gelar) <span className="text-[#BD272D]">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={data.full_name}
                                    onChange={e => setData('full_name', e.target.value)}
                                    className="w-full bg-white/50 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl px-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                    placeholder="Prof. Dr. Nama Lengkap, Sp.PD"
                                />
                                {errors.full_name && <p className="text-sm text-red-500 font-bold">{errors.full_name}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-[#253656] uppercase tracking-[0.1em]">Nomor WhatsApp Aktif <span className="text-[#BD272D]">*</span></label>
                                <input
                                    type="tel"
                                    required
                                    value={data.wa_number}
                                    onChange={e => setData('wa_number', e.target.value)}
                                    className="w-full bg-white/50 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl px-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                    placeholder="081234567890"
                                />
                                {errors.wa_number && <p className="text-sm text-red-500 font-bold">{errors.wa_number}</p>}
                            </div>
                        </div>

                        {/* Email & Institusi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-[#253656] uppercase tracking-[0.1em]">Alamat Email <span className="text-[#BD272D]">*</span></label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full bg-white/50 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl px-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                    placeholder="email@instansi.com"
                                />
                                {errors.email && <p className="text-sm text-red-500 font-bold">{errors.email}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-[#253656] uppercase tracking-[0.1em]">Institusi <span className="text-[#BD272D]">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={data.institution}
                                    onChange={e => setData('institution', e.target.value)}
                                    className="w-full bg-white/50 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl px-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                    placeholder="Nama Rumah Sakit / Universitas / Dinas"
                                />
                                {errors.institution && <p className="text-sm text-red-500 font-bold">{errors.institution}</p>}
                            </div>
                        </div>

                        {/* Dynamic Fields */}
                        {formFields.map((field, index) => (
                            <div key={index} className="space-y-3">
                                <label className="block text-sm font-black text-[#253656] uppercase tracking-[0.1em]">
                                    {field.label} {field.required && <span className="text-[#BD272D]">*</span>}
                                </label>
                                
                                {field.name === 'sosmed' && (
                                    <div className="text-sm text-[#6C7C98] font-['Plus_Jakarta_Sans'] -mt-1 mb-2 leading-relaxed px-1">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="w-24 shrink-0 font-medium">Website:</span> 
                                                <a href="https://rc3id.unpad.ac.id" className="text-[#BD272D] font-bold hover:underline" target="_blank" rel="noreferrer">rc3id.unpad.ac.id</a>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="w-24 shrink-0 font-medium">Instagram:</span> 
                                                <a href="https://instagram.com/rc3id.unpad" className="text-[#BD272D] font-bold hover:underline" target="_blank" rel="noreferrer">@rc3id.unpad</a>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="w-24 shrink-0 font-medium">LinkedIn:</span> 
                                                <a href="https://linkedin.com/company/research-center-for-care-and-control-of-infectious-diseases/" className="text-[#BD272D] font-bold hover:underline break-words" target="_blank" rel="noreferrer">linkedin.com/company/research-center-for-care-and-control-of-infectious-diseases/</a>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="w-24 shrink-0 font-medium">YouTube:</span> 
                                                <a href="https://youtube.com/@RC3IDUniversitasPadjadjaran" className="text-[#BD272D] font-bold hover:underline break-words" target="_blank" rel="noreferrer">youtube.com/@RC3IDUniversitasPadjadjaran</a>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="w-24 shrink-0 font-medium">X (Twitter):</span> 
                                                <a href="https://x.com/RC3IDUnpad" className="text-[#BD272D] font-bold hover:underline" target="_blank" rel="noreferrer">x.com/RC3IDUnpad</a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {field.type === 'textarea' ? (
                                    <textarea
                                        required={field.required}
                                        value={(data as any)[field.name] || ''}
                                        onChange={e => setData(field.name as any, e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl px-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm min-h-[120px]"
                                        placeholder={`Masukkan ${field.label}`}
                                    />
                                ) : field.type === 'radio' ? (
                                    <div className="space-y-4 bg-white/40 p-6 rounded-2xl border border-gray-100">
                                        {field.options?.map((option: string, idx: number) => (
                                            <label key={idx} className="flex items-start gap-4 cursor-pointer group">
                                                <div className="relative flex items-center justify-center mt-1">
                                                    <input 
                                                        type="radio" 
                                                        name={field.name} 
                                                        value={option} 
                                                        checked={(data as any)[field.name] === option}
                                                        onChange={e => setData(field.name as any, e.target.value)}
                                                        className="w-6 h-6 border-2 border-gray-300 text-[#BD272D] focus:ring-[#BD272D] transition-colors cursor-pointer" 
                                                        required={field.required}
                                                    />
                                                </div>
                                                <span className="text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium leading-relaxed group-hover:text-[#253656] transition-colors">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : field.type === 'checkbox' ? (
                                    <div className="space-y-4 bg-white/40 p-6 rounded-2xl border border-gray-100">
                                        {field.options?.map((option: string, idx: number) => {
                                            const currentValues = (data as any)[field.name] ? (data as any)[field.name].split(', ') : [];
                                            const isChecked = currentValues.includes(option);
                                            return (
                                                <label key={idx} className="flex items-start gap-4 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center mt-1">
                                                        <input 
                                                            type="checkbox" 
                                                            name={field.name} 
                                                            value={option}
                                                            checked={isChecked}
                                                            onChange={e => {
                                                                if (e.target.checked) {
                                                                    setData(field.name as any, [...currentValues, option].join(', '));
                                                                } else {
                                                                    setData(field.name as any, currentValues.filter((v: string) => v !== option).join(', '));
                                                                }
                                                            }}
                                                            className="w-6 h-6 rounded border-2 border-gray-300 text-[#BD272D] focus:ring-[#BD272D] transition-colors cursor-pointer" 
                                                        />
                                                    </div>
                                                    <span className="text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium leading-relaxed group-hover:text-[#253656] transition-colors">{option}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        value={(data as any)[field.name] || ''}
                                        onChange={e => setData(field.name as any, e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl px-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                        placeholder={`Masukkan ${field.label}`}
                                    />
                                )}
                                {errors[field.name as keyof typeof errors] && <p className="text-sm text-red-500 font-bold">{errors[field.name as keyof typeof errors]}</p>}
                            </div>
                        ))}

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="relative group w-full md:w-auto overflow-hidden rounded-full"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#BD272D] to-rose-400 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative h-16 px-12 bg-gradient-to-r from-[#BD272D] to-[#991f24] text-white font-black tracking-[0.15em] uppercase rounded-full border border-white/20 flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 shadow-xl disabled:opacity-70 disabled:hover:translate-y-0">
                                    {processing ? 'Menyimpan...' : 'Kirim Form & Klaim'}
                                    <Send className="w-5 h-5" />
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
