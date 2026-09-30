import React, { useEffect } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { isOrderSuccessModalOpen, setIsOrderSuccessModalOpen, lastOrderDetails } = useVault();

  useEffect(() => {
    if (isOrderSuccessModalOpen) {
      soundFx.playCelebrationFanfare();

      // Multi-cannon Confetti Explosion
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#00f0ff', '#ff007f', '#ffffff']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#a855f7', '#f59e0b', '#10b981']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    }
  }, [isOrderSuccessModalOpen]);

  if (!isOrderSuccessModalOpen || !lastOrderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#111216] border border-[#262833] rounded-3xl p-8 text-white text-center space-y-6 shadow-2xl animate-in zoom-in-95 relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            ORDER CONFIRMED & CRYPTOGRAPHICALLY SIGNED
          </span>
          <h2 className="text-2xl font-black font-display text-white">
            Welcome to the Horizon Vault
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Vault Ledger ID: <strong className="text-white font-bold">{lastOrderDetails.orderId}</strong>
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-[#17181f] border border-[#262833] rounded-2xl p-4 text-xs font-mono space-y-2 text-left">
          <div className="flex justify-between text-zinc-400">
            <span>Items Authenticated</span>
            <strong className="text-white">{lastOrderDetails.itemsCount} luxury items</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Payment Method</span>
            <strong className="text-white">Apple Pay / Instant Settlement</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>NFC Provenance Token</span>
            <strong className="text-cyan-400">Minted & Verified</strong>
          </div>
          <div className="flex justify-between text-zinc-400 pt-2 border-t border-[#262833]">
            <span>Total Settled</span>
            <strong className="text-emerald-400 font-bold">${lastOrderDetails.total.toFixed(2)}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOrderSuccessModalOpen(false);
            soundFx.playClick();
          }}
          className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider font-display transition-all hover:scale-102 cursor-pointer shadow-xl shadow-white/10"
        >
          Explore More Drops
        </button>
      </div>
    </div>
  );
};
