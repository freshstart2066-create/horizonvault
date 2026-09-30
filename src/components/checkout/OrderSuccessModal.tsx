import React, { useEffect } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { CheckCircle2, Package, ShieldCheck, ArrowRight } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { isOrderSuccessModalOpen, setIsOrderSuccessModalOpen, lastOrderDetails } = useVault();

  useEffect(() => {
    if (isOrderSuccessModalOpen) {
      soundFx.playCelebrationFanfare();
    }
  }, [isOrderSuccessModalOpen]);

  if (!isOrderSuccessModalOpen || !lastOrderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#111216] border border-[#232530] rounded-3xl p-8 text-white text-center space-y-6 shadow-2xl animate-in zoom-in-95 relative overflow-hidden"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            ORDER CONFIRMATION
          </span>
          <h2 className="text-xl font-bold tracking-tight">
            Thank you for your order
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Order Reference: <strong className="text-white font-bold">{lastOrderDetails.orderId}</strong>
          </p>
        </div>

        {/* Order Breakdown Box */}
        <div className="bg-[#171820] border border-[#232530] rounded-2xl p-4 text-xs font-mono space-y-2 text-left">
          <div className="flex justify-between text-zinc-400">
            <span>Items Ordered</span>
            <strong className="text-white">{lastOrderDetails.itemsCount} piece(s)</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Shipping Carrier</span>
            <strong className="text-white">DHL Express Worldwide</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Dispatch Timeline</span>
            <strong className="text-emerald-400 font-normal">Within 24 Hours</strong>
          </div>
          <div className="flex justify-between text-zinc-400 pt-2 border-t border-[#232530]">
            <span>Total Paid</span>
            <strong className="text-white font-bold">{lastOrderDetails.totalFormatted}</strong>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
          A confirmation email with your tracking details has been dispatched.
        </p>

        <button
          type="button"
          onClick={() => {
            setIsOrderSuccessModalOpen(false);
            soundFx.playClick();
          }}
          className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider font-mono transition-colors cursor-pointer"
        >
          Return to Archive
        </button>
      </div>
    </div>
  );
};
