import React from 'react';
import { Head } from '@inertiajs/react';
import { Video, CalendarDays, Lock } from 'lucide-react';

export default function MeetingGuestJoin({ meeting }: any) {
    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#253656] font-['Outfit'] selection:bg-[#BD272D] selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
            <Head title={`Ruang Rapat: ${meeting.title}`} />
            
            {/* HD Background */}
            <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#BD272D]/10 blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#253656]/10 blur-[150px] animate-[pulse_15s_ease-in-out_infinite_alternate]"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-white/70 backdrop-blur-3xl border border-white shadow-2xl shadow-[#253656]/10 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 md:p-12 text-center">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#253656] to-[#1a263d] rounded-[2rem] flex items-center justify-center shadow-xl shadow-[#253656]/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white_1px,transparent_1px)] bg-[size:10px_10px] opacity-10"></div>
                                <Video className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <div className="mb-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                            <CalendarDays className="w-3.5 h-3.5" /> Undangan Rapat Virtual
                        </div>

                        <h2 className="text-3xl font-black text-[#253656] tracking-tight mt-4 mb-2">
                            {meeting.title}
                        </h2>
                        
                        <p className="text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium mb-10">
                            Untuk bergabung ke dalam ruang meeting, silakan verifikasi identitas Anda menggunakan Akun Google.
                        </p>

                        <a 
                            href="/auth/google" 
                            className="relative group w-full flex items-center justify-center gap-3 h-14 rounded-full border-2 border-gray-200 bg-white text-[#253656] font-black tracking-[0.1em] uppercase hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                <path fill="none" d="M1 1h22v22H1z" />
                            </svg>
                            Masuk dengan Google
                        </a>
                        
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                            <Lock className="w-3.5 h-3.5" /> Rapat Terenkripsi secara end-to-end
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        RC3ID DIGITAL MEETING SYSTEM
                    </p>
                </div>
            </div>
        </div>
    );
}
