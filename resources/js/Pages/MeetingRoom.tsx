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

    const [showNotes, setShowNotes] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 font-['Outfit'] overflow-hidden relative">
            <Head title={`Ruang Rapat: ${meeting.title}`} />
            
            {/* Left side: Video Conference (100% on mobile, 70% on PC) */}
            <div className={`flex-1 flex flex-col relative h-full transition-all duration-300`}>
                {/* Custom Header Overlay */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-6 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="text-white hover:text-slate-300 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-white font-bold text-sm md:text-lg leading-tight truncate max-w-[200px] md:max-w-md">{meeting.title}</h1>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300 font-medium">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Live Room
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Toggle Notes Button */}
                    <button 
                        onClick={() => setShowNotes(!showNotes)}
                        className="pointer-events-auto md:hidden bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-lg backdrop-blur-md border border-slate-600 transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                </div>

                {/* Jitsi Meeting */}
                <div className="flex-1 w-full bg-slate-900">
                    <JitsiMeeting
                        domain="meet.jit.si"
                        roomName={`RC3ID-${meeting.room_slug}`}
                        configOverwrite={{
                            startWithAudioMuted: true,
                            startWithVideoMuted: false,
                            disableModeratorIndicator: true,
                            startScreenSharing: true,
                            enableEmailInStats: false,
                            prejoinPageEnabled: true, // Enable Pre-join screen
                            fileRecordingsEnabled: true, // Enable recording
                            localRecording: {
                                enabled: true,
                                format: 'flac'
                            },
                            toolbarButtons: [
                                'camera', 'chat', 'closedcaptions', 'desktop',
                                'download', 'embedmeeting', 'etherpad', 'feedback',
                                'filmstrip', 'fullscreen', 'hangup', 'help',
                                'highlight', 'invite', 'linktosalesforce',
                                'livestreaming', 'microphone', 'mute-everyone',
                                'mute-video-everyone', 'participants-pane',
                                'profile', 'raisehand', 'recording',
                                'security', 'select-background', 'settings',
                                'shareaudio', 'sharedvideo', 'shortcuts',
                                'stats', 'tileview', 'toggle-camera',
                                'videoquality', 'whiteboard'
                            ],
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

            {/* Right side: Live Notes (Mobile: Overlay, PC: 400px side panel) */}
            <div className={`
                absolute md:relative top-0 right-0 h-full z-20 
                w-full md:w-[400px] shrink-0 
                bg-slate-900/95 md:bg-slate-900 backdrop-blur-3xl md:backdrop-blur-none
                border-l border-slate-800 shadow-2xl flex flex-col 
                transition-transform duration-300 ease-in-out
                ${showNotes ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowNotes(false)} className="md:hidden text-slate-400 hover:text-white">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
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
