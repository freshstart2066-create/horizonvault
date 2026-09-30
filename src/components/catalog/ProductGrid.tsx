import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { Eye, ShoppingBag, Star } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, setActiveProduct, addToCart, formatPrice } = useVault();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Footwear', 'Outerwear', 'Tailoring'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    soundFx.playClick(750);
  };

  const handleInspect = (product: typeof products[0]) => {
    setActiveProduct(product);
    soundFx.playLaserChirp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: typeof products[0]) => {
    addToCart(product, product.colorways[0], product.sizes[0] || 9);
    soundFx.playAddToCartChime();
  };

  return (
    <section id="catalog" className="py-20 px-4 sm:px-12 max-w-7xl mx-auto select-none border-t border-[#232530]">
      {/* Catalog Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-10 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
            COLLECTION FW26
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Curated Archive & Silhouettes
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#171820] text-zinc-400 hover:text-white border border-[#232530]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const defaultColorway = product.colorways[0];
          const previewImg = defaultColorway.angleImages[0];

          return (
            <div
              key={product.id}
              className="bg-[#111216] border border-[#232530] rounded-2xl overflow-hidden p-5 flex flex-col justify-between group hover:border-zinc-500 transition-all"
            >
              {/* Image Box */}
              <div className="relative aspect-square w-full flex items-center justify-center bg-[#0c0d10] rounded-xl overflow-hidden mb-4">
                {product.badge && (
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold uppercase bg-black/80 text-zinc-300 border border-[#232530] px-2 py-0.5 rounded-full z-10">
                    {product.badge}
                  </span>
                )}

                <img
                  src={previewImg}
                  alt={product.name}
                  className="max-h-48 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />

                {/* Inspect in 3D / Details Button Overlay */}
                <button
                  type="button"
                  onClick={() => handleInspect(product)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono font-bold text-white cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect Studio View</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>{product.brand}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white truncate">
                  {product.name}
                </h3>

                <p className="text-[11px] text-zinc-400 font-mono">
                  {product.specs.provenance}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#232530]">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through font-mono">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="p-2.5 rounded-xl bg-[#171820] hover:bg-white hover:text-black text-zinc-300 border border-[#232530] transition-all cursor-pointer"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
