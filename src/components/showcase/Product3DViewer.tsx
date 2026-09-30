import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Star,
  MessageSquare
} from 'lucide-react';
import { MaterialSelector } from './MaterialSelector';
import { CustomerReviewsModal } from '../reviews/CustomerReviewsModal';

export const Product3DViewer: React.FC = () => {
  const { 
    activeProduct, 
    activeColorway, 
    setActiveColorway, 
    activeAngleIndex, 
    setActiveAngleIndex,
    isAutoRotating,
    setIsAutoRotating,
    addToCart
  } = useVault();

  const [selectedSize, setSelectedSize] = useState<number>(activeProduct.sizes[0] || 9);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  const anglesCount = activeColorway.angleImages.length;
  const currentImage = activeColorway.angleImages[activeAngleIndex] || activeColorway.angleImages[0];

  const handleNextAngle = () => {
    setActiveAngleIndex((activeAngleIndex + 1) % anglesCount);
  };

  const handlePrevAngle = () => {
    setActiveAngleIndex((activeAngleIndex - 1 + anglesCount) % anglesCount);
  };

  return (
    <section id="showcase" className="pt-28 pb-12 px-4 sm:px-12 max-w-7xl mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Interactive Viewer Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111216] border border-[#262833] rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col justify-between overflow-hidden group">
          {/* Ambient Glow Lighting based on selected colorway */}
          <div 
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] opacity-30 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeColorway.hex }}
          />
          <div 
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-30 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeColorway.accentHex }}
          />

          {/* Top Canvas Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase bg-[#17181f] text-zinc-300 border border-[#262833] px-2.5 py-1 rounded-full font-mono">
                360° 3D VIEWPORT
              </span>
              {activeProduct.badge && (
                <span className="text-[10px] font-bold uppercase bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/40 px-2 py-0.5 rounded-full font-mono">
                  {activeProduct.badge}
                </span>
              )}
            </div>

            {/* Auto-Spin 360 Trigger */}
            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                isAutoRotating
                  ? 'bg-[#00f0ff] text-black shadow-lg shadow-cyan-500/30 font-extrabold'
                  : 'bg-[#17181f] text-zinc-400 hover:text-white border border-[#262833]'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
              <span>{isAutoRotating ? 'Auto-Spin: ON' : 'Auto-Spin 360°'}</span>
            </button>
          </div>

          {/* 3D Product Image Angle Renderer */}
          <div className="relative my-8 aspect-[4/3] w-full flex items-center justify-center">
            <img
              src={currentImage}
              alt={`${activeProduct.name} - ${activeColorway.name}`}
              className="max-h-[380px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-500 transform hover:scale-105"
            />

            {/* Manual Angle Arrows */}
            <button
              type="button"
              onClick={handlePrevAngle}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#17181f]/80 hover:bg-[#20222c] border border-[#262833] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xl backdrop-blur-md"
              title="Rotate Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNextAngle}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#17181f]/80 hover:bg-[#20222c] border border-[#262833] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xl backdrop-blur-md"
              title="Rotate Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Angle Thumbnail Carousel Scrubber */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            {activeColorway.angleImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveAngleIndex(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#0a0a0c] ${
                  activeAngleIndex === idx
                    ? 'border-[#00f0ff] scale-110 shadow-lg shadow-cyan-500/20'
                    : 'border-[#262833] opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Angle preview" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details, Colorway Customizer & Cart Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand, Title & Reviews trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                {activeProduct.brand} • {activeProduct.category}
              </span>
              <button
                type="button"
                onClick={() => setIsReviewsModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{activeProduct.rating} ({activeProduct.reviewsCount} reviews)</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              {activeProduct.name}
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-3xl font-black text-white font-display">
                ${activeProduct.price}
              </span>
              {activeProduct.originalPrice && (
                <span className="text-lg text-zinc-500 line-through font-mono">
                  ${activeProduct.originalPrice}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                In Stock & Verified
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {activeProduct.description}
          </p>

          {/* Material Texture Customizer */}
          <MaterialSelector />

          {/* Colorway Switcher */}
          <div className="space-y-3 pt-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-zinc-300">Selected Colorway:</span>
              <span className="font-mono text-[#00f0ff] font-bold">{activeColorway.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {activeProduct.colorways.map(cw => (
                <button
                  key={cw.id}
                  type="button"
                  onClick={() => setActiveColorway(cw)}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-md ${
                    activeColorway.id === cw.id
                      ? 'border-[#00f0ff] scale-115 ring-4 ring-[#00f0ff]/20'
                      : 'border-[#262833] hover:scale-105'
                  }`}
                  style={{ backgroundColor: cw.hex }}
                  title={cw.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-3 pt-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-zinc-300">Select US Size:</span>
              <span className="text-zinc-400 font-mono">True to size fit</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {activeProduct.sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-white text-black font-black shadow-lg scale-105'
                      : 'bg-[#17181f] text-zinc-300 hover:bg-[#20222c] border border-[#262833]'
                  }`}
                >
                  US {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => addToCart(activeProduct, activeColorway, selectedSize)}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a8ff] hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 hover:scale-102 active:scale-98 transition-all cursor-pointer font-display"
            >
              <ShoppingBag className="w-5 h-5 fill-black" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      <CustomerReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
      />
    </section>
  );
};
