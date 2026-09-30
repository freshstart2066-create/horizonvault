import React from 'react';
import { ShoppingBag, Sparkles, Compass, Shield, Search, Github } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen } = useVault();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="h-20 bg-[#0a0a0c]/90 border-b border-[#262833]/70 backdrop-blur-md px-4 sm:px-12 flex items-center justify-between fixed top-0 inset-x-0 z-40 select-none">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#ff0055] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-white text-lg tracking-widest font-display uppercase">
              HORIZON<span className="text-[#00f0ff]">VAULT</span>
            </span>
            <span className="text-[9px] text-zinc-400 tracking-widest block font-mono">
              3D LUXURY STREETWEAR
            </span>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <a href="#showcase" className="text-white hover:text-[#00f0ff] transition-colors">3D Showcase</a>
          <a href="#catalog" className="hover:text-white transition-colors">Footwear</a>
          <a href="#catalog" className="hover:text-white transition-colors">Outerwear</a>
          <a href="#catalog" className="hover:text-white transition-colors">Techwear</a>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Cart Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2.5 bg-[#17181f] hover:bg-[#20222c] border border-[#262833] px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4 text-[#00f0ff]" />
          <span className="hidden sm:inline font-mono">Cart</span>
          <span className="w-5 h-5 rounded-full bg-[#ff0055] text-white text-[11px] font-black flex items-center justify-center font-mono">
            {totalItems}
          </span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/freshstart2066-create/horizonvault"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-400 hover:text-white transition-colors p-1"
          title="View GitHub Repository"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
};
