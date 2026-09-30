import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Layers,
  Box,
  Scan,
  Activity,
  Flame,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { MaterialSelector } from './MaterialSelector';
import { CustomerReviewsModal } from '../reviews/CustomerReviewsModal';
import { WebGL3DStudio } from './WebGL3DStudio';

export type ViewportMode = 'webgl' | 'photo360' | 'ar_holo';

export const Product3DViewer: React.FC = () => {
  const { 
    activeProduct, 
    activeColorway, 
    setActiveColorway, 
    activeAngleIndex, 
    setActiveAngleIndex,
    isAutoRotating,
    setIsAutoRotating,
    addToCart,
    showToast
  } = useVault();

  const [viewportMode, setViewportMode] = useState<ViewportMode>('webgl');
  const [selectedSize, setSelectedSize] = useState<number>(activeProduct.sizes[0] || 9);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isQuickAdded, setIsQuickAdded] = useState(false);

  const anglesCount = activeColorway.angleImages.length;
  const currentImage = activeColorway.angleImages[activeAngleIndex] || activeColorway.angleImages[0];

  const handleNextAngle = () => {
    setActiveAngleIndex((activeAngleIndex + 1) % anglesCount);
    soundFx.playOrbitTick();
  };

  const handlePrevAngle = () => {
    setActiveAngleIndex((activeAngleIndex - 1 + anglesCount) % anglesCount);
    soundFx.playOrbitTick();
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, activeColorway, selectedSize);
    soundFx.playAddToCartChime();
    setIsQuickAdded(true);
    setTimeout(() => setIsQuickAdded(false), 2000);
  };

  const handleShare = () => {
    soundFx.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Product link copied to clipboard!', 'success');
    }
  };

  return (
    <section id="showcase" className="pt-24 pb-12 px-4 sm:px-12 max-w-7xl mx-auto select-none">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2.5 py-0.5 rounded-full">
              AWWWARDS 3D EXPERIENTIAL SHOWROOM
            </span>
            <span className="text-[10px] font-mono text-zinc-500">• 60 FPS REAL-TIME SHADERS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Interactive 3D Product Laboratory
          </h2>
        </div>

        {/* Viewport Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111216] border border-[#262833] rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setViewportMode('webgl');
              soundFx.playLaserChirp();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              viewportMode === 'webgl'
                ? 'bg-gradient-to-r from-[#00f0ff] to-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>WebGL 3D Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewportMode('photo360');
              soundFx.playLaserChirp();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              viewportMode === 'photo360'
                ? 'bg-white text-black font-extrabold shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>360° Photorealistic</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewportMode('ar_holo');
              soundFx.playHoloEngage();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              viewportMode === 'ar_holo'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold shadow-lg shadow-purple-500/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>AR Hologram</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Interactive Viewport Canvas (7 Cols) */}
        <div className="lg:col-span-7 relative flex flex-col justify-between">
          {/* Ambient Glow Lighting synchronized to colorway palette */}
          <div 
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[140px] opacity-35 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeColorway.hex }}
          />
          <div 
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-[140px] opacity-35 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeColorway.accentHex }}
          />

          {/* VIEWPORT MODE 1: WebGL Real-Time Three.js Studio */}
          {viewportMode === 'webgl' && (
            <WebGL3DStudio />
          )}

          {/* VIEWPORT MODE 2: Photorealistic 360 Turntable */}
          {viewportMode === 'photo360' && (
            <div className="bg-[#111216] border border-[#262833] rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col justify-between overflow-hidden group">
              {/* Top Canvas Bar */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-[#17181f] text-zinc-300 border border-[#262833] px-2.5 py-1 rounded-full font-mono">
                    360° PHOTOREALISTIC TURNTABLE
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
                  onClick={() => {
                    setIsAutoRotating(!isAutoRotating);
                    soundFx.playClick();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                    isAutoRotating
                      ? 'bg-[#00f0ff] text-black shadow-lg shadow-cyan-500/30 font-extrabold'
                      : 'bg-[#17181f] text-zinc-400 hover:text-white border border-[#262833]'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                  <span>{isAutoRotating ? 'Turntable: ON' : 'Turntable: OFF'}</span>
                </button>
              </div>

              {/* 3D Product Image Angle Renderer */}
              <div className="relative my-8 aspect-[4/3] w-full flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={`${activeProduct.name} - ${activeColorway.name}`}
                  className="max-h-[380px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300 transform hover:scale-105"
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
                    onClick={() => {
                      setActiveAngleIndex(idx);
                      soundFx.playOrbitTick();
                    }}
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
          )}

          {/* VIEWPORT MODE 3: AR Holographic Diagnostic HUD */}
          {viewportMode === 'ar_holo' && (
            <div className="bg-[#0b0c10] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between overflow-hidden font-mono min-h-[450px]">
              {/* Animated Laser Scanning Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_15px_#00f0ff] animate-pulse pointer-events-none top-1/3" />

              <div className="flex items-center justify-between text-xs border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="font-bold text-cyan-400">AR SPATIAL DIAGNOSTICS HUD v4.2</span>
                </div>
                <span className="text-zinc-500">TARGET: {activeProduct.name.toUpperCase()}</span>
              </div>

              {/* Central Hologram Wire Projection */}
              <div className="my-6 relative flex items-center justify-center">
                <img
                  src={currentImage}
                  alt="Hologram Preview"
                  className="max-h-[260px] object-contain opacity-75 filter hue-rotate-180 brightness-125"
                />

                {/* Spatial Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border border-dashed border-cyan-500/40 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                </div>
              </div>

              {/* Real-time Telemetry Stats Grid */}
              <div className="grid grid-cols-3 gap-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-[11px]">
                <div>
                  <span className="text-zinc-500 block">DIMENSIONS</span>
                  <span className="font-bold text-white">302 × 112 × 135 mm</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">WEIGHT PER SHOE</span>
                  <span className="font-bold text-emerald-400">{activeProduct.specs.weight}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">ENERGY RETURN</span>
                  <span className="font-bold text-[#00f0ff]">89.4% (Class 1)</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Features Row below canvas */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-[#111216] border border-[#262833] rounded-2xl p-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white font-mono">100% Provenance</p>
                <p className="text-[10px] text-zinc-400">Verified by NFC Chip</p>
              </div>
            </div>
            <div className="bg-[#111216] border border-[#262833] rounded-2xl p-3 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white font-mono">Express Delivery</p>
                <p className="text-[10px] text-zinc-400">Next-Day Worldwide</p>
              </div>
            </div>
            <div className="bg-[#111216] border border-[#262833] rounded-2xl p-3 flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#ff0055] shrink-0" />
              <div>
                <p className="text-xs font-bold text-white font-mono">Limited Vault Drop</p>
                <p className="text-[10px] text-zinc-400">Only 250 Produced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Colorway Customizer & Cart Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand, Title & Reviews trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-[#00f0ff] uppercase">
                {activeProduct.brand} • {activeProduct.category}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReviewsModalOpen(true);
                    soundFx.playClick();
                  }}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{activeProduct.rating} ({activeProduct.reviewsCount} reviews)</span>
                </button>
              </div>
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
                  onClick={() => {
                    setActiveColorway(cw);
                    soundFx.playLaserChirp();
                  }}
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
              <span className="text-zinc-400 font-mono">True to size fit (96% accuracy)</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {activeProduct.sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    soundFx.playClick(650);
                  }}
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
              onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-2xl text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer font-display ${
                isQuickAdded
                  ? 'bg-emerald-400 shadow-xl shadow-emerald-500/25 scale-102'
                  : 'bg-gradient-to-r from-[#00f0ff] to-[#00a8ff] hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:scale-102 active:scale-98'
              }`}
            >
              {isQuickAdded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>Added to Vault Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 fill-black" />
                  <span>Add to Vault Cart</span>
                </>
              )}
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
