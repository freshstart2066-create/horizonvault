import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { Layers, Sparkles, ShieldCheck, Check } from 'lucide-react';

export interface MaterialOption {
  id: string;
  name: string;
  type: string;
  finish: string;
  durability: string;
  iconColor: string;
}

export const MATERIALS: MaterialOption[] = [
  {
    id: 'mat-aerospace',
    name: 'Aerospace Ballistic Mesh',
    type: 'Breathable Synthetic',
    finish: 'Matte Ultra-Light',
    durability: 'High (Mil-Spec)',
    iconColor: '#00f0ff'
  },
  {
    id: 'mat-carbon',
    name: '3K Forged Carbon Weave',
    type: 'Rigid Composite',
    finish: 'Gloss High-Torsion',
    durability: 'Extreme (9.5/10)',
    iconColor: '#a855f7'
  },
  {
    id: 'mat-leather',
    name: 'Tuscan Calfskin Nappa',
    type: 'Luxury Organic Leather',
    finish: 'Supple Semi-Aniline',
    durability: 'Premium Luxury',
    iconColor: '#f59e0b'
  },
  {
    id: 'mat-3m',
    name: '3M Reflective Foil',
    type: 'Micro-Prismatic Film',
    finish: 'Luminescent Glow',
    durability: 'Weatherproof',
    iconColor: '#10b981'
  }
];

export const MaterialSelector: React.FC = () => {
  const { showToast } = useVault();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIALS[0]);

  const handleSelect = (mat: MaterialOption) => {
    setSelectedMaterial(mat);
    soundFx.playMaterialSwitch(mat.name);
    showToast(`🎨 Upper Material updated to: ${mat.name}`, 'info');
  };

  return (
    <div className="bg-[#111216] border border-[#262833] rounded-2xl p-4 space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs font-bold text-white font-display">Upper Material Texture Customizer</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono bg-[#17181f] px-2 py-0.5 rounded-full border border-white/5">
          {selectedMaterial.finish}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MATERIALS.map(mat => {
          const isSelected = selectedMaterial.id === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => handleSelect(mat)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#17181f] border-[#00f0ff] shadow-lg shadow-cyan-500/15 ring-1 ring-[#00f0ff]'
                  : 'bg-[#0a0a0c] border-[#262833] opacity-70 hover:opacity-100 hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: mat.iconColor }} 
                />
                {isSelected && <Check className="w-3 h-3 text-[#00f0ff]" />}
              </div>
              <span className="text-[11px] font-bold text-white block truncate">{mat.name}</span>
              <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">{mat.type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
