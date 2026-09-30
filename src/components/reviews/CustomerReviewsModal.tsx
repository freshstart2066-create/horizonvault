import React from 'react';
import { X, Star, CheckCircle, ThumbsUp, Sparkles } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

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
      author: 'Kaelen Vance',
      role: 'Verified Purchaser',
      rating: 5,
      date: '2 days ago',
      colorway: 'Cyberpunk Neon Cyan',
      size: 'US 10.5',
      title: 'Best silhouette drop of 2026. Futuristic and ridiculously comfortable.',
      content: 'The carbon fiber spring plate gives an incredible energy return on every stride. The materials are tier-1 quality, stitching is flawless, and the 360 viewer preview was 100% true to real life.'
    },
    {
      id: 2,
      author: 'Marcus Sterling',
      role: 'Verified Collector',
      rating: 5,
      date: '1 week ago',
      colorway: 'Obsidian Stealth Black',
      size: 'US 10',
      title: 'Stealth aesthetic with true high-fashion build.',
      content: 'Gore-Tex shell kept my feet completely dry in pouring rain. Sizing is spot on true-to-size. Worth every penny.'
    }
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#111216] border border-[#262833] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-[#262833] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff] font-bold">VERIFIED REVIEWS</span>
            <h3 className="font-bold text-xl font-display">{activeProduct.name}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Rating Breakdown Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#17181f] p-4 rounded-2xl border border-[#262833]">
          <div className="text-center sm:border-r border-[#262833] sm:pr-4">
            <span className="text-3xl font-black font-display text-white">{activeProduct.rating}</span>
            <div className="flex items-center justify-center gap-1 text-amber-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
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
              <span>Comfort Rating:</span>
              <strong className="text-[#00f0ff]">4.9 / 5.0 (Ultra-Plush)</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Material Quality:</span>
              <strong className="text-purple-400">100% Premium Grade</strong>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {mockReviews.map(r => (
            <div key={r.id} className="bg-[#17181f]/60 p-4 rounded-2xl border border-[#262833]/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm font-display text-white">{r.author}</span>
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.2 rounded-full font-mono">
                    <CheckCircle className="w-3 h-3" />
                    {r.role}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">{r.date}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
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

              <h4 className="font-bold text-xs sm:text-sm text-white font-display pt-1">{r.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
