import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login({
    status,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#253656] font-['Outfit'] selection:bg-[#BD272D] selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* HD Background */}
            <div className="fixed inset-0 -z-20 h-full w-full bg-[#f8fafc]">
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#BD272D]/10 blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#253656]/10 blur-[150px] animate-[pulse_15s_ease-in-out_infinite_alternate]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-[#6C7C98] hover:text-[#BD272D] transition-colors uppercase tracking-[0.15em] mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Beranda
                </Link>

                <div className="bg-white/70 backdrop-blur-3xl border border-white shadow-2xl shadow-[#253656]/10 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#253656] to-[#1a263d] rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-[#253656]/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white_1px,transparent_1px)] bg-[size:10px_10px] opacity-10"></div>
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-[#253656] tracking-tight mb-2">Admin Portal</h2>
                            <p className="text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium">Masuk untuk mengelola data buku tamu RC3ID.</p>
                        </div>

                        {status && (
                            <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl text-sm font-medium text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-[#253656] uppercase tracking-[0.1em] ml-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        autoFocus
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-white/60 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl pl-12 pr-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                        placeholder="admin@rc3id.org"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black text-[#253656] uppercase tracking-[0.1em] ml-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full bg-white/60 border border-gray-200 focus:border-[#BD272D] focus:ring-4 focus:ring-[#BD272D]/10 rounded-2xl pl-12 pr-5 py-4 font-['Plus_Jakarta_Sans'] font-medium transition-all shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-[#BD272D] focus:ring-[#BD272D] transition-colors cursor-pointer" 
                                        />
                                    </div>
                                    <span className="text-[#6C7C98] font-['Plus_Jakarta_Sans'] font-medium text-sm group-hover:text-[#253656] transition-colors">Remember me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="relative group w-full overflow-hidden rounded-full mt-8"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#253656] to-[#1a263d] rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative h-14 w-full bg-gradient-to-r from-[#253656] to-[#1a263d] text-white font-black tracking-[0.15em] uppercase rounded-full border border-white/20 flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 shadow-xl disabled:opacity-70 disabled:hover:translate-y-0">
                                    {processing ? 'Authenticating...' : 'Secure Login'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="text-center mt-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        RC3ID DIGITAL GUESTBOOK SYSTEM V1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
