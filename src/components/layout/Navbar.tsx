import React, { useState } from 'react';
import { ShoppingBag, Github, Volume2, VolumeX, Globe } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { Currency } from '../../types/vault';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen, currency, setCurrency } = useVault();
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY'];

  return (
    <header className="h-20 bg-[#0c0d10]/90 border-b border-[#232530] backdrop-blur-xl px-4 sm:px-12 flex items-center justify-between fixed top-0 inset-x-0 z-40 select-none">
      {/* Brand & Categories */}
      <div className="flex items-center gap-10">
        <a href="#showcase" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm font-mono tracking-tighter">
            HZ
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-widest font-mono uppercase">
              HORIZON <span className="text-zinc-400 font-normal">ARCHIVE</span>
            </span>
          </div>
        </a>

        {/* Categories */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider text-zinc-400">
          <a href="#showcase" className="text-white hover:text-zinc-200 transition-colors">Studio 3D</a>
          <a href="#catalog" className="hover:text-white transition-colors">Footwear</a>
          <a href="#catalog" className="hover:text-white transition-colors">Outerwear</a>
          <a href="#catalog" className="hover:text-white transition-colors">Tailoring</a>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Currency Selector */}
        <div className="flex items-center gap-1 bg-[#171820] border border-[#232530] rounded-xl px-2 py-1 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value as Currency);
              soundFx.playClick(800);
            }}
            className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer text-xs"
          >
            {currencies.map(curr => (
              <option key={curr} value={curr} className="bg-[#171820] text-white">
                {curr}
              </option>
            ))}
          </select>
        </div>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={handleToggleMute}
          className="p-2 rounded-xl bg-[#171820] hover:bg-[#20222c] border border-[#232530] text-zinc-400 hover:text-white transition-all cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-zinc-200" />
          )}
        </button>

        {/* Bag Trigger */}
        <button
          type="button"
          onClick={() => {
            setIsCartOpen(true);
            soundFx.playClick();
          }}
          className="relative flex items-center gap-2.5 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Bag</span>
          <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
            {totalItems}
          </span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/freshstart2066-create/horizonvault"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-400 hover:text-white transition-colors p-2 rounded-xl bg-[#171820] border border-[#232530]"
          title="View GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
