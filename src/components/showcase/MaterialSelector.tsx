import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { Layers, Sparkles, ShieldCheck } from 'lucide-react';

export interface MaterialOption {
  id: string;
  name: string;
  type: string;
  finish: string;
  durability: string;
}

export const MATERIALS: MaterialOption[] = [
  {
    id: 'mat-aerospace',
    name: 'Aerospace Ballistic Mesh',
    type: 'Breathable Synthetic',
    finish: 'Matte Ultra-Light',
    durability: 'High (Mil-Spec)'
  },
  {
    id: 'mat-carbon',
    name: '3K Forged Carbon Weave',
    type: 'Rigid Composite',
    finish: 'Gloss High-Torsion',
    durability: 'Extreme'
  },
  {
    id: 'mat-leather',
    name: 'Tuscan Full-Grain Calfskin',
    type: 'Luxury Organic Leather',
    finish: 'Supple Semi-Aniline',
    durability: 'Premium Luxury'
  },
  {
    id: 'mat-3m',
    name: '3M Reflective Luminescent Foil',
    type: 'Micro-Prismatic Film',
    finish: 'High-Visibility Glow',
    durability: 'Weatherproof'
  }
];

export const MaterialSelector: React.FC = () => {
  const { showToast } = useVault();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIALS[0]);

  const handleSelect = (mat: MaterialOption) => {
    setSelectedMaterial(mat);
    showToast(`🎨 Upper Material updated to: ${mat.name}`, 'success');
  };

  return (
    <div className="bg-[#111216] border border-[#262833] rounded-2xl p-4 space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs font-bold text-white font-display">Material Texture Customizer</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">{selectedMaterial.finish}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MATERIALS.map(mat => {
          const isSelected = selectedMaterial.id === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => handleSelect(mat)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#17181f] border-[#00f0ff] shadow-lg shadow-cyan-500/15 ring-1 ring-[#00f0ff]'
                  : 'bg-[#0a0a0c] border-[#262833] opacity-70 hover:opacity-100 hover:border-zinc-500'
              }`}
            >
              <span className="text-[11px] font-bold text-white block truncate">{mat.name}</span>
              <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">{mat.type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
