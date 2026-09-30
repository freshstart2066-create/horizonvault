import React from 'react';
import { useVault } from '../../context/VaultContext';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useVault();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarn = toast.type === 'warn';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                : isWarn
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-[#17181f]/95 border-[#262833] text-white'
            }`}
          >
            {isSuccess && <Sparkles className="w-5 h-5 shrink-0" />}
            {isWarn && <AlertCircle className="w-5 h-5 shrink-0" />}
            {!isSuccess && !isWarn && <CheckCircle2 className="w-5 h-5 shrink-0 text-[#00f0ff]" />}

            <p className="text-xs font-mono font-medium leading-snug flex-1">
              {toast.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
