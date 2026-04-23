'use client';

import { useState } from 'react';

const volumeLevels = [10, 50, 100, 200, 500, 1000];

const longevityLevels = [
  { months: 6, label: '6 mois', color: 'bronze' },
  { months: 12, label: '1 an', color: 'argent' },
  { months: 36, label: '3 ans', color: 'or' },
  { months: 60, label: '5 ans', color: 'platine' },
];

export default function Badges() {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [selectedLongevity, setSelectedLongevity] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Vos Badges MyWornSkin</h1>
          <p className="text-zinc-400 text-lg">Montrez votre expérience et votre fidélité</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Volume Badge */}
          <div className="card p-10">
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <span className="text-3xl">🔥</span> Badge Volume
            </h2>
            <p className="text-zinc-400 mb-8">Nombre de vêtements vendus</p>

            <div className="grid grid-cols-3 gap-4">
              {volumeLevels.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedVolume(num)}
                  className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${
                    selectedVolume === num 
                      ? 'border-rose-500 bg-rose-950/50' 
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <span className="text-3xl font-bold text-white">{num}</span>
                  <span className="text-xs text-zinc-400">ventes</span>
                </button>
              ))}
            </div>
            {selectedVolume && (
              <p className="mt-6 text-center text-emerald-400 text-sm">
                Badge {selectedVolume} ventes activé ✓
              </p>
            )}
          </div>

          {/* Longevity Frame */}
          <div className="card p-10">
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <span className="text-3xl">🏆</span> Cadre de Longévité
            </h2>
            <p className="text-zinc-400 mb-8">Ancienneté sur la plateforme</p>

            <div className="space-y-4">
              {longevityLevels.map((lvl) => (
                <button
                  key={lvl.months}
                  onClick={() => setSelectedLongevity(lvl.months)}
                  className={`w-full p-5 rounded-3xl border-2 flex justify-between items-center transition-all hover:scale-[1.02] ${
                    selectedLongevity === lvl.months 
                      ? 'border-yellow-400 bg-yellow-950/30' 
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <span className="font-medium">{lvl.label}</span>
                  <span className="text-sm px-4 py-1 rounded-full bg-yellow-400/10 text-yellow-400">
                    {lvl.color.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-sm">
            Les badges apparaissent automatiquement sur votre photo de profil.<br />
            Plus vous vendez et restez longtemps, plus vous gagnez en visibilité.
          </p>
        </div>
      </div>
    </div>
  );
}
