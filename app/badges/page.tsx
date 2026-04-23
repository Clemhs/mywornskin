'use client';

import { useState } from 'react';

const volumeLevels = [10, 50, 100, 200, 500, 1000];

const longevityLevels = [
  { years: 1, label: 'Bronze', color: '#CD7F32' },
  { years: 2, label: 'Argent', color: '#C0C0C0' },
  { years: 5, label: 'Or', color: '#FFD700' },
  { years: 10, label: 'Platine', color: '#E5E4E2' },
];

export default function Badges() {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [selectedLongevity, setSelectedLongevity] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Vos Badges</h1>
          <p className="text-zinc-400">Ils apparaîtront sur votre photo de profil</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Volume Badges */}
          <div className="card p-10">
            <h2 className="text-2xl font-semibold mb-8">Badge Volume de Ventes</h2>
            <p className="text-zinc-400 mb-8">Choisissez quel niveau afficher (un seul à la fois) :</p>
            
            <div className="grid grid-cols-3 gap-4">
              {volumeLevels.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedVolume(num)}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all hover:border-rose-500 ${
                    selectedVolume === num ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-700'
                  }`}
                >
                  <span className="text-4xl font-bold text-white">{num}</span>
                  <span className="text-xs text-zinc-500 mt-1">ventes</span>
                </button>
              ))}
            </div>

            <button className="mt-8 w-full py-3.5 rounded-2xl border border-zinc-700 hover:bg-zinc-800">
              Afficher sur mon profil
            </button>
          </div>

          {/* Longevity Frames */}
          <div className="card p-10">
            <h2 className="text-2xl font-semibold mb-8">Cadre de Longévité</h2>
            <p className="text-zinc-400 mb-8">Choisissez le cadre autour de votre photo :</p>
            
            <div className="space-y-6">
              {longevityLevels.map((level) => (
                <button
                  key={level.years}
                  onClick={() => setSelectedLongevity(level.years)}
                  className={`w-full p-6 rounded-2xl border text-left transition-all flex justify-between items-center ${
                    selectedLongevity === level.years ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div>
                    <span className="text-xl font-semibold">{level.label}</span>
                    <span className="text-zinc-400 ml-3">— {level.years} an{level.years > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-3xl">🖼️</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
