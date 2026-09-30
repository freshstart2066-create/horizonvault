import React from 'react';
import { useVault } from '../../context/VaultContext';
import { CheckCircle2, X, Package, ShieldCheck, ArrowRight } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { isOrderSuccessModalOpen, setIsOrderSuccessModalOpen, lastOrderDetails } = useVault();

  if (!isOrderSuccessModalOpen || !lastOrderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#111216] border border-[#262833] rounded-3xl p-8 text-white text-center space-y-6 shadow-2xl animate-in zoom-in-95"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] font-mono">
            ORDER CONFIRMED & VERIFIED
          </span>
          <h2 className="text-2xl font-black font-display text-white">
            Thank you for your order!
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Tracking Number: <strong className="text-white">{lastOrderDetails.orderId}</strong>
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-[#17181f] border border-[#262833] rounded-2xl p-4 text-xs font-mono space-y-2 text-left">
          <div className="flex justify-between text-zinc-400">
            <span>Items Ordered</span>
            <strong className="text-white">{lastOrderDetails.itemsCount} luxury items</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Payment Method</span>
            <strong className="text-white">Apple Pay / Verified Card</strong>
          </div>
          <div className="flex justify-between text-zinc-400 pt-2 border-t border-[#262833]">
            <span>Total Paid</span>
            <strong className="text-emerald-400 font-bold">${lastOrderDetails.total.toFixed(2)}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOrderSuccessModalOpen(false)}
          className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider font-display transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
