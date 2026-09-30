import React from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';

interface CustomerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerReviewsModal: React.FC<CustomerReviewsModalProps> = ({ isOpen, onClose }) => {
  const { activeProduct } = useVault();

  if (!isOpen) return null;

  const mockReviews = [
    {
      id: 1,
      author: 'Julian D.',
      role: 'Verified Buyer',
      rating: 5,
      date: '3 days ago',
      colorway: 'Bone / Chalk White',
      size: 'EU 42.5',
      title: 'Flawless Italian craftsmanship. Exceeded expectations.',
      content: 'The calfskin leather is exceptionally soft and supple right out of the box with zero break-in period. The Vibram outsole provides substantial grip while remaining understated. Fits true to size.'
    },
    {
      id: 2,
      author: 'Elena R.',
      role: 'Verified Buyer',
      rating: 5,
      date: '1 week ago',
      colorway: 'Obsidian Black',
      size: 'EU 41',
      title: 'Minimalist luxury aesthetic with remarkable comfort.',
      content: 'Understated branding and pristine stitching throughout. The OrthoLite footbed offers noticeable support for all-day city walking. Shipped via DHL in 2 days.'
    }
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#111216] border border-[#232530] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-[#232530] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">CLIENT REVIEWS</span>
            <h3 className="font-bold text-lg">{activeProduct.name}</h3>
          </div>
          <button 
            type="button" 
            onClick={() => {
              onClose();
              soundFx.playClick();
            }} 
            className="text-zinc-400 hover:text-white cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Breakdown Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#171820] p-4 rounded-2xl border border-[#232530]">
          <div className="text-center sm:border-r border-[#232530] sm:pr-4">
            <span className="text-3xl font-bold font-mono text-white">{activeProduct.rating}</span>
            <div className="flex items-center justify-center gap-1 text-amber-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Based on {activeProduct.reviewsCount} reviews</span>
          </div>

          <div className="sm:col-span-2 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-300">
              <span>Fit Accuracy:</span>
              <strong className="text-emerald-400">96% True to Size</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Leather Finishing:</span>
              <strong className="text-white">Full-Grain Tuscan</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Outsole Compound:</span>
              <strong className="text-white">Vibram® Megagrip</strong>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {mockReviews.map(r => (
            <div key={r.id} className="bg-[#171820]/70 p-4 rounded-2xl border border-[#232530] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{r.author}</span>
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                    <CheckCircle className="w-3 h-3" />
                    {r.role}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">{r.date}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span>•</span>
                <span>{r.colorway}</span>
                <span>•</span>
                <span>{r.size}</span>
              </div>

              <h4 className="font-bold text-xs text-white pt-1">{r.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{r.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
