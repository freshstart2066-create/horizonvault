import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Lock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    promoCode, 
    discountPercent, 
    applyPromoCode, 
    subtotal, 
    discountAmount, 
    total, 
    formatPrice,
    checkout 
  } = useVault();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromoCode(inputCode);
    if (ok) {
      soundFx.playCelebrationFanfare();
    } else {
      soundFx.playClick(400);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    soundFx.playClick();
  };

  const handleUpdateQty = (id: string, delta: number) => {
    updateQuantity(id, delta);
    soundFx.playClick(delta > 0 ? 800 : 600);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    soundFx.playClick(450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#111216] border-l border-[#232530] h-full flex flex-col justify-between shadow-2xl p-6 animate-in slide-in-from-right duration-300 text-white"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232530]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-zinc-300" />
            <h3 className="font-bold text-base tracking-tight">Shopping Bag</h3>
            <span className="text-xs bg-[#171820] text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-zinc-400 hover:text-white cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {cart.length > 0 ? (
            cart.map(item => (
              <div
                key={item.id}
                className="bg-[#171820] border border-[#232530] rounded-2xl p-4 flex gap-4 items-center"
              >
                <img
                  src={item.selectedColorway.angleImages[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain bg-[#0c0d10] rounded-xl p-1"
                />

                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-xs text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {item.selectedColorway.name} • EU {item.selectedSize}
                  </p>
                  <p className="text-xs font-bold text-white font-mono">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center bg-[#0c0d10] border border-[#232530] rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="px-2 py-1 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="px-2 py-1 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16 text-zinc-500">
              <ShoppingBag className="w-12 h-12 stroke-1 opacity-30" />
              <p className="text-sm font-bold text-zinc-400">Your shopping bag is empty</p>
              <p className="text-xs text-zinc-500">Discover hand-finished pieces in the archive collection.</p>
            </div>
          )}
        </div>

        {/* Promo Code & Checkout Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-[#232530] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Voucher code (try HORIZON15)"
                  className="w-full bg-[#171820] border border-[#232530] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#232530] hover:bg-white hover:text-black rounded-xl text-xs font-mono transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>DHL Express Shipping</span>
                <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#232530]">
                <span>Total Due</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Express Checkout Button */}
            <button
              type="button"
              onClick={checkout}
              className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-mono"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Checkout • {formatPrice(total)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-zinc-500 text-center font-mono">
              🔒 256-bit Encrypted SSL Checkout • Free 14-day Worldwide Returns
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
