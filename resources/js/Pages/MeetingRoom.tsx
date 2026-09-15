import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ChevronLeft, FileText, Bot, Save, Loader2, Video } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MeetingRoom({ meeting }: any) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    
    // Determine the correct Zoom URL (Host gets start_url, others get join_url)
    const zoomUrl = (user && meeting.host_id === user.id) ? meeting.zoom_start_url : meeting.zoom_join_url;

    // ... (Keep Notulensi states)
    const [rawNotes, setRawNotes] = useState(meeting.notes?.content_html || '');
    const [aiSummary, setAiSummary] = useState(meeting.notes?.ai_summary || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [showNotes, setShowNotes] = useState(false); // Mobile toggle

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveNotes = async (content: string) => {
        setIsSaving(true);
        try {
            await axios.post(`/m/${meeting.id}/notes`, { content_html: content });
        } catch (error) {
            console.error("Failed to save notes:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setRawNotes(val);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            saveNotes(val);
        }, 2000);
    };

    const generateAiSummary = async () => {
        if (!rawNotes.trim()) return;
        setIsGeneratingAi(true);
        try {
            const response = await axios.post(`/m/${meeting.id}/ai-summary`);
            setAiSummary(response.data.summary);
        } catch (error) {
            console.error("Failed to generate AI summary:", error);
            alert("Gagal memproses dengan AI. Pastikan catatan tidak kosong.");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc] font-['Outfit'] overflow-hidden relative">
            <Head title={`Ruang Rapat: ${meeting.title}`} />
            
            {/* Left side: Zoom Lobby */}
            <div className={`flex-1 flex flex-col relative h-full transition-all duration-300`}>
                
                {/* Header */}
                <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-900 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-slate-900 font-bold text-sm md:text-lg leading-tight truncate max-w-[200px] md:max-w-md">{meeting.title}</h1>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-blue-600 font-medium">
                                <Video className="w-3.5 h-3.5" /> Powered by Zoom
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Toggle Notes Button */}
                    <button 
                        onClick={() => setShowNotes(!showNotes)}
                        className="md:hidden bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-lg border border-slate-200 transition-colors shadow-sm"
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Lobby Area */}
                <div className="flex-1 w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>
                    
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center border border-slate-100 relative z-10">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-[#2D8CFF]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 13.918L21.737 17.5V6.438l-4.687 3.582V7.125A2.126 2.126 0 0 0 14.925 5H4.125A2.126 2.126 0 0 0 2 7.125v9.75A2.126 2.126 0 0 0 4.125 19h10.8a2.126 2.126 0 0 0 2.125-2.125v-2.957z" />
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-3">Rapat Siap Dimulai</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 font-['Plus_Jakarta_Sans']">
                            Aplikasi Zoom akan terbuka di perangkat Anda. Anda dapat kembali ke halaman ini sewaktu-waktu untuk melihat atau mencatat Notulensi Rapat.
                        </p>
                        
                        {zoomUrl ? (
                            <a 
                                href={zoomUrl} 
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full bg-[#2D8CFF] hover:bg-[#1f73d9] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
                            >
                                Buka Aplikasi Zoom Sekarang
                            </a>
                        ) : (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                                Link Zoom belum tersedia. Silakan hubungi Admin.
                            </div>
                        )}
                        
                        <p className="text-xs text-slate-400 mt-6 font-medium">
                            Pastikan aplikasi Zoom sudah terinstal di perangkat Anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side: Live Notes */}
            <div className={`
                absolute md:relative top-0 right-0 h-full z-20 
                w-full md:w-[450px] shrink-0 
                bg-white
                border-l border-slate-200 shadow-2xl flex flex-col 
                transition-transform duration-300 ease-in-out
                ${showNotes ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowNotes(false)} className="md:hidden text-slate-400 hover:text-slate-800">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                            <FileText className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-slate-800 font-bold tracking-wide">Notulensi Live</h2>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                                {isSaving ? (
                                    <><Loader2 className="w-3 h-3 animate-spin text-blue-500"/> Menyimpan...</>
                                ) : (
                                    <><Save className="w-3 h-3 text-emerald-500"/> Tersimpan otomatis</>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
                    {/* Raw Notes Editor */}
                    <div className="flex-1 p-5 flex flex-col min-h-[300px]">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between items-center">
                            Catatan Kasar (Draft)
                        </label>
                        <textarea
                            className="flex-1 w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-['Plus_Jakarta_Sans'] text-sm leading-relaxed shadow-sm"
                            placeholder="Ketik catatan rapat di sini... (otomatis tersimpan)"
                            value={rawNotes}
                            onChange={handleNotesChange}
                        ></textarea>
                        
                        <button 
                            onClick={generateAiSummary}
                            disabled={isGeneratingAi || !rawNotes.trim()}
                            className="mt-4 w-full py-3.5 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/20"
                        >
                            {isGeneratingAi ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Sedang merapihkan...</>
                            ) : (
                                <><Bot className="w-5 h-5 text-blue-400" /> Rapihkan dengan AI</>
                            )}
                        </button>
                    </div>

                    {/* AI Summary Result */}
                    {aiSummary && (
                        <div className="border-t border-slate-200 bg-white flex-1 min-h-[400px]">
                            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 border-b border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <h3 className="font-bold text-slate-800 text-sm">Hasil Notulensi Resmi (AI)</h3>
                            </div>
                            <div className="p-5">
                                <div className="prose prose-slate prose-sm max-w-none font-['Plus_Jakarta_Sans'] prose-headings:font-['Outfit'] prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-li:marker:text-slate-400">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {aiSummary}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
