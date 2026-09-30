import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { Product } from '../../types/vault';
import { Eye, ShoppingBag, Sparkles, Star } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, setActiveProduct, addToCart } = useVault();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Sneakers', 'Outerwear', 'Techwear'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="catalog" className="py-16 px-4 sm:px-12 max-w-7xl mx-auto select-none border-t border-[#262833]/60">
      {/* Catalog Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Explore Curated Vault Drops
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Handcrafted luxury silhouettes with verified provenance
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white text-black shadow-lg scale-105 font-display'
                  : 'bg-[#17181f] text-zinc-400 hover:text-white border border-[#262833]'
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
              className="bg-[#111216] border border-[#262833] rounded-2xl overflow-hidden p-5 flex flex-col justify-between group hover:border-[#00f0ff]/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-square w-full flex items-center justify-center bg-[#0a0a0c] rounded-xl overflow-hidden mb-4 group-hover:scale-102 transition-transform">
                {product.badge && (
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/30 px-2 py-0.5 rounded-full font-mono z-10">
                    {product.badge}
                  </span>
                )}

                <img
                  src={previewImg}
                  alt={product.name}
                  className="max-h-48 w-auto object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                />

                {/* Quick 3D View Button Overlay */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveProduct(product);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-white cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#00f0ff]" />
                  <span>Inspect in 3D</span>
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

                <h3 className="font-bold text-sm text-white font-display truncate">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-[#262833]/50">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white font-display">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through font-mono">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product, defaultColorway, product.sizes[0] || 9)}
                    className="p-2.5 rounded-xl bg-[#17181f] hover:bg-[#00f0ff] hover:text-black text-zinc-300 border border-[#262833] transition-all cursor-pointer"
                    title="Quick Add to Cart"
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
