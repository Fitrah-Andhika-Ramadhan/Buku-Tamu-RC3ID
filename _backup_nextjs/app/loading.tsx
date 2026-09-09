import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 animate-fade-in-up">
        <div className="relative flex items-center justify-center">
          {/* Outer glowing rings */}
          <div className="absolute w-24 h-24 rounded-full border-4 border-[#BD272D]/30 border-t-[#BD272D] animate-spin"></div>
          <div className="absolute w-16 h-16 rounded-full border-4 border-[#253656]/30 border-b-[#253656] animate-[spin_2s_linear_infinite_reverse]"></div>
          {/* Center Logo/Icon */}
          <div className="w-10 h-10 bg-[#253656] rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs tracking-wider">RC3</span>
          </div>
        </div>
        <p className="text-[#253656] font-bold tracking-widest uppercase text-sm mt-4 animate-pulse">
          Memuat Sistem...
        </p>
      </div>
    </div>
  );
}
