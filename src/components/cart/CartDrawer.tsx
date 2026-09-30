import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

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

  const handleCheckout = () => {
    checkout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#111216] border-l border-[#262833] h-full flex flex-col justify-between shadow-2xl p-6 animate-in slide-in-from-right duration-300 text-white"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262833]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00f0ff]" />
            <h3 className="font-bold text-base font-display">Your Vault Bag</h3>
            <span className="text-xs bg-[#17181f] text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {cart.length > 0 ? (
            cart.map(item => (
              <div
                key={item.id}
                className="bg-[#17181f] border border-[#262833] rounded-2xl p-4 flex gap-4 items-center"
              >
                <img
                  src={item.selectedColorway.angleImages[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain bg-[#0a0a0c] rounded-xl p-1"
                />

                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-xs text-white font-display truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {item.selectedColorway.name} • US {item.selectedSize}
                  </p>
                  <p className="text-xs font-black text-white font-display">
                    ${item.product.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center bg-[#0a0a0c] border border-[#262833] rounded-lg">
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
              <ShoppingBag className="w-12 h-12 stroke-1 opacity-40" />
              <p className="text-sm font-bold text-zinc-400 font-display">Your bag is empty</p>
              <p className="text-xs text-zinc-500">Explore the 3D showcase to add limited drops!</p>
            </div>
          )}
        </div>

        {/* Promo Code & Accounting Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-[#262833] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Promo (use APEX2026 for 20% off)"
                  className="w-full bg-[#17181f] border border-[#262833] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00f0ff] font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#262833] hover:bg-[#00f0ff] hover:text-black rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Express Insured Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#262833] font-display">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a8ff] hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-102 cursor-pointer font-display"
            >
              <span>Instant Checkout • ${total.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
