import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { JaaSMeeting, JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2, Save, Sparkles, FileText, Download, Users, ChevronLeft } from 'lucide-react';

export default function MeetingRoom({ meeting, user }: any) {
    const [notes, setNotes] = useState(meeting.notes?.content_html || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [aiSummary, setAiSummary] = useState(meeting.notes?.ai_summary || '');
    const saveTimeoutRef = useRef<any>(null);

    // Auto-save notes
    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        saveTimeoutRef.current = setTimeout(() => {
            if (notes !== meeting.notes?.content_html) {
                saveNotes(notes);
            }
        }, 2000);

        return () => clearTimeout(saveTimeoutRef.current);
    }, [notes]);

    const saveNotes = async (content: string) => {
        setIsSaving(true);
        try {
            await window.axios.post(`/m/${meeting.id}/notes`, { content_html: content });
        } catch (error) {
            console.error('Error saving notes', error);
        } finally {
            setIsSaving(false);
        }
    };

    const generateAiSummary = async () => {
        if (!notes.trim()) return;
        setIsGeneratingAi(true);
        try {
            const response = await window.axios.post(`/m/${meeting.id}/ai-summary`, { 
                content_html: notes 
            });
            if (response.data.success) {
                setAiSummary(response.data.summary);
            } else {
                setAiSummary("Gagal membuat kesimpulan: " + response.data.message);
            }
        } catch (error: any) {
            console.error(error);
            setAiSummary("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setIsGeneratingAi(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 font-['Outfit'] overflow-hidden">
            <Head title={`Ruang Rapat: ${meeting.title}`} />
            
            {/* Left side: Video Conference (70%) */}
            <div className="flex-1 flex flex-col relative h-full">
                {/* Custom Header Overlay */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center px-6 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="text-white hover:text-slate-300 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">{meeting.title}</h1>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300 font-medium">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Live Room
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jitsi Meeting */}
                <div className="flex-1 w-full bg-slate-900">
                    <JitsiMeeting
                        domain="meet.jit.si"
                        roomName={`RC3ID-${meeting.room_slug}`}
                        configOverwrite={{
                            startWithAudioMuted: true,
                            disableModeratorIndicator: true,
                            startScreenSharing: true,
                            enableEmailInStats: false
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            SHOW_JITSI_WATERMARK: false,
                        }}
                        userInfo={{
                            displayName: user.name,
                            email: user.email
                        }}
                        onApiReady={(externalApi) => {
                            // Can attach event listeners here
                        }}
                        getIFrameRef={(iframeRef) => {
                            iframeRef.style.height = '100%';
                            iframeRef.style.width = '100%';
                        }}
                    />
                </div>
            </div>

            {/* Right side: Live Notes (30%) */}
            <div className="w-[400px] border-l border-slate-800 bg-slate-900 flex flex-col h-full shrink-0 shadow-2xl z-20">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold tracking-wide">Notulensi Live</h2>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">Disimpan otomatis</p>
                        </div>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Menyimpan...
                        </div>
                    )}
                </div>

                {/* Notes Input */}
                <div className="flex-1 p-5 overflow-auto custom-scrollbar flex flex-col gap-4">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ketik poin-poin rapat di sini secara kasar. Anda bisa merapihkannya nanti menggunakan AI..."
                        className="w-full flex-1 bg-transparent text-slate-300 resize-none border-none focus:ring-0 text-sm leading-relaxed placeholder:text-slate-600 font-['Plus_Jakarta_Sans']"
                        spellCheck={false}
                    ></textarea>

                    {aiSummary && (
                        <div className="mt-4 border-t border-slate-800 pt-4">
                            <h3 className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Hasil Notulensi AI
                            </h3>
                            <div className="bg-slate-800/50 rounded-xl p-4 text-sm text-slate-300 font-['Plus_Jakarta_Sans'] whitespace-pre-wrap">
                                {aiSummary}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Summary Section */}
                <div className="p-5 border-t border-slate-800 bg-slate-900/80">
                    <button
                        onClick={generateAiSummary}
                        disabled={isGeneratingAi || !notes.trim()}
                        className="w-full relative group overflow-hidden rounded-xl"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center justify-center gap-2 w-full bg-slate-900 border border-slate-700 hover:border-slate-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                            {isGeneratingAi ? (
                                <><Loader2 className="w-4 h-4 animate-spin text-purple-400" /> Sedang merumuskan...</>
                            ) : (
                                <><Sparkles className="w-4 h-4 text-purple-400" /> Rapihkan Notulensi (AI)</>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
