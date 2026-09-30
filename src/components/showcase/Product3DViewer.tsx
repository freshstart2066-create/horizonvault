import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { 
  RotateCw, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Box,
  Image as ImageIcon,
  Check,
  Ruler,
  ChevronDown,
  ChevronUp,
  Truck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CustomerReviewsModal } from '../reviews/CustomerReviewsModal';
import { WebGL3DStudio } from './WebGL3DStudio';
import { SizeGuideModal } from '../ui/SizeGuideModal';

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
    formatPrice,
    setIsSizeGuideOpen
  } = useVault();

  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [selectedSize, setSelectedSize] = useState<number>(activeProduct.sizes[0] || 9);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState<'details' | 'materials' | 'shipping' | null>('details');

  const anglesCount = activeColorway.angleImages.length;
  const currentImage = activeColorway.angleImages[activeAngleIndex] || activeColorway.angleImages[0];

  const handleAddToCart = () => {
    addToCart(activeProduct, activeColorway, selectedSize);
    soundFx.playAddToCartChime();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleNextAngle = () => {
    setActiveAngleIndex((activeAngleIndex + 1) % anglesCount);
    soundFx.playOrbitTick();
  };

  const handlePrevAngle = () => {
    setActiveAngleIndex((activeAngleIndex - 1 + anglesCount) % anglesCount);
    soundFx.playOrbitTick();
  };

  return (
    <section id="showcase" className="pt-24 pb-16 px-4 sm:px-12 max-w-7xl mx-auto select-none">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-xs font-mono text-zinc-400 border-b border-[#232530] pb-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">{activeProduct.brand}</span>
          <span>/</span>
          <span>{activeProduct.category}</span>
          <span>/</span>
          <span className="text-zinc-500">{activeProduct.styleCode}</span>
        </div>

        {/* Viewport Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111216] border border-[#232530] rounded-xl">
          <button
            type="button"
            onClick={() => {
              setViewMode('3d');
              soundFx.playLaserChirp();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Studio View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('photo');
              soundFx.playLaserChirp();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              viewMode === 'photo'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Editorial Photography</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 3D Studio & Photography Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === '3d' ? (
            <WebGL3DStudio />
          ) : (
            <div className="bg-[#111216] border border-[#232530] rounded-3xl p-6 sm:p-10 relative flex flex-col justify-between overflow-hidden group min-h-[460px]">
              <div className="relative my-6 aspect-[4/3] w-full flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={`${activeProduct.name} - ${activeColorway.name}`}
                  className="max-h-[360px] w-auto object-contain drop-shadow-2xl transition-all duration-300"
                />

                <button
                  type="button"
                  onClick={handlePrevAngle}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#171820]/80 hover:bg-[#20222c] border border-[#232530] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNextAngle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#171820]/80 hover:bg-[#20222c] border border-[#232530] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Angle thumbnails */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-[#232530]">
                {activeColorway.angleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveAngleIndex(idx);
                      soundFx.playOrbitTick();
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#0c0d10] ${
                      activeAngleIndex === idx
                        ? 'border-white scale-105'
                        : 'border-[#232530] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Angle preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Value Propositions */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#111216] border border-[#232530] rounded-2xl p-3.5 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Made in Italy</p>
                <p className="text-[10px] text-zinc-400">Authenticity Guaranteed</p>
              </div>
            </div>
            <div className="bg-[#111216] border border-[#232530] rounded-2xl p-3.5 flex items-center gap-3">
              <Truck className="w-4 h-4 text-zinc-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Express Delivery</p>
                <p className="text-[10px] text-zinc-400">Complimentary Worldwide</p>
              </div>
            </div>
            <div className="bg-[#111216] border border-[#232530] rounded-2xl p-3.5 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-zinc-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">14-Day Returns</p>
                <p className="text-[10px] text-zinc-400">Prepaid Return Label</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PDP Product Info & Purchasing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Pricing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                {activeProduct.brand}
              </span>
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

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeProduct.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xl font-bold text-white font-mono">
                {formatPrice(activeProduct.price)}
              </span>
              {activeProduct.originalPrice && (
                <span className="text-sm text-zinc-500 line-through font-mono">
                  {formatPrice(activeProduct.originalPrice)}
                </span>
              )}
              {activeProduct.badge && (
                <span className="text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                  {activeProduct.badge}
                </span>
              )}
            </div>

            {/* Klarna Installments */}
            <p className="text-xs text-zinc-400 font-mono pt-1">
              Or 4 interest-free payments of <strong className="text-white">{formatPrice(activeProduct.price / 4)}</strong> with <strong>Klarna</strong>.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            {activeProduct.description}
          </p>

          {/* Colorway Selection */}
          <div className="space-y-3 pt-1 border-t border-[#232530]">
            <div className="flex justify-between text-xs pt-3">
              <span className="text-zinc-400">Colorway:</span>
              <span className="font-bold text-white">{activeColorway.name}</span>
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
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                    activeColorway.id === cw.id
                      ? 'border-white scale-110 ring-2 ring-white/30'
                      : 'border-[#232530] opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: cw.hex }}
                  title={cw.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-3 pt-1 border-t border-[#232530]">
            <div className="flex justify-between text-xs pt-3">
              <span className="text-zinc-400">Select European Size:</span>
              <button
                type="button"
                onClick={() => {
                  setIsSizeGuideOpen(true);
                  soundFx.playClick();
                }}
                className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white underline cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
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
                  className={`py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-[#171820] text-zinc-300 hover:bg-[#20222c] border border-[#232530]'
                  }`}
                >
                  EU {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer font-mono ${
                isAdded
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white hover:bg-zinc-200 text-black shadow-lg hover:scale-101 active:scale-99'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag • {formatPrice(activeProduct.price)}</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible Accordions for Luxury PDP Experience */}
          <div className="border-t border-[#232530] divide-y divide-[#232530] text-xs">
            {/* Details & Fit */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                className="w-full flex items-center justify-between text-zinc-200 font-bold uppercase tracking-wider py-1 cursor-pointer"
              >
                <span>Details & Craftsmanship</span>
                {openSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'details' && (
                <ul className="mt-2.5 space-y-1.5 text-zinc-400 pl-4 list-disc font-sans leading-relaxed">
                  {activeProduct.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Materials & Provenance */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'materials' ? null : 'materials')}
                className="w-full flex items-center justify-between text-zinc-200 font-bold uppercase tracking-wider py-1 cursor-pointer"
              >
                <span>Materials & Sourcing</span>
                {openSection === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'materials' && (
                <div className="mt-2.5 space-y-2 text-zinc-400 font-mono">
                  <div className="flex justify-between">
                    <span>Upper Materials</span>
                    <span className="text-white">{activeProduct.specs.materials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin / Workshop</span>
                    <span className="text-white">{activeProduct.specs.provenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cushioning Unit</span>
                    <span className="text-white">{activeProduct.specs.cushioning}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full flex items-center justify-between text-zinc-200 font-bold uppercase tracking-wider py-1 cursor-pointer"
              >
                <span>Shipping & Complimentary Returns</span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'shipping' && (
                <div className="mt-2.5 space-y-2 text-zinc-400 font-sans leading-relaxed">
                  <p>
                    Complimentary worldwide express shipping via DHL Express on all orders over $250. Orders are dispatched within 24 hours with end-to-end tracking.
                  </p>
                  <p>
                    We offer hassle-free 14-day returns and exchanges. Items must be returned in their original, unworn condition with all packaging intact.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Modal */}
      <CustomerReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal />
    </section>
  );
};
