import React from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { X, Ruler, Check } from 'lucide-react';

const SIZE_CHART = [
  { us: 7, uk: 6, eu: 40, cm: 25.0 },
  { us: 8, uk: 7, eu: 41, cm: 26.0 },
  { us: 8.5, uk: 7.5, eu: 42, cm: 26.5 },
  { us: 9, uk: 8, eu: 42.5, cm: 27.0 },
  { us: 9.5, uk: 8.5, eu: 43, cm: 27.5 },
  { us: 10, uk: 9, eu: 44, cm: 28.0 },
  { us: 10.5, uk: 9.5, eu: 44.5, cm: 28.5 },
  { us: 11, uk: 10, eu: 45, cm: 29.0 },
  { us: 12, uk: 11, eu: 46, cm: 30.0 },
];

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useVault();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-[#111216] border border-[#232530] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-in zoom-in-95"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#232530]">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-zinc-300" />
            <h3 className="text-base font-bold tracking-tight">Footwear Size Conversion Guide</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSizeGuideOpen(false);
              soundFx.playClick();
            }}
            className="text-zinc-400 hover:text-white cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sizing Recommendation */}
        <div className="bg-[#171820] border border-[#232530] rounded-2xl p-4 text-xs text-zinc-300 space-y-1">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            True to Standard European Sizing (D Width)
          </p>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Our footwear is handcrafted on Italian lasts. If you normally wear a half size or have wider feet, we recommend sizing up to the nearest whole size.
          </p>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-zinc-400 border-b border-[#232530]">
                <th className="pb-2.5 font-bold">EU</th>
                <th className="pb-2.5 font-bold">US MEN</th>
                <th className="pb-2.5 font-bold">UK</th>
                <th className="pb-2.5 font-bold text-right">FOOT (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232530]/50 text-zinc-200">
              {SIZE_CHART.map(row => (
                <tr key={row.eu} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 font-bold text-white">{row.eu}</td>
                  <td className="py-2 text-zinc-300">{row.us}</td>
                  <td className="py-2 text-zinc-400">{row.uk}</td>
                  <td className="py-2 text-right text-zinc-300">{row.cm.toFixed(1)} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSizeGuideOpen(false);
            soundFx.playClick();
          }}
          className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
