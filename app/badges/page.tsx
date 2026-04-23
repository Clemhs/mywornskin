'use client';

import { useState } from 'react';

const volumeBadges = [10, 50, 100, 200, 500, 1000];

const longevityBadges = [
  { years: 1, label: 'Bronze', color: 'bronze' },
  { years: 2, label: 'Argent', color: 'silver' },
  { years: 5, label: 'Or', color: 'gold' },
  { years: 10, label: 'Platine', color: 'platinum' },
];

export default function Badges() {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [selectedLongevity, setSelectedLongevity] = useState<number | null>(null);
  const [showBadge, setShowBadge] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Gestion des Badges</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Badges Volume */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">Badge Volume de Ventes</h2>
            <p className="text-zinc-400 mb-6">Choisissez quel badge afficher sur votre photo de profil :</p>
            
            <div className="grid grid-cols-3 gap-4">
              {volumeBadges.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedVolume(num)}
                  className={`p-6 rounded-2xl border text-center transition-all ${
                    selectedVolume === num 
                      ? 'border-rose-500 bg-rose-500/10' 
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div className="text-3xl font-bold">{num}</div>
                  <div className="text-xs text-zinc-500">ventes</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowBadge(!showBadge)}
              className="mt-8 w-full py-3 rounded-2xl border border-zinc-700 hover:bg-zinc-800"
            >
              {showBadge ? "Masquer le badge" : "Afficher le badge"}
            </button>
          </div>

          {/* Cadres Longévité */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">Cadre de Longévité</h2>
            <p className="text-zinc-400 mb-6">Choisissez le cadre autour de votre photo :</p>
            
            <div className="space-y-4">
              {longevityBadges.map((badge) => (
                <button
                  key={badge.years}
                  onClick={() => setSelectedLongevity(badge.years)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all ${
                    selectedLongevity === badge.years 
                      ? 'border-rose-500 bg-rose-500/10' 
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div className="font-medium">{badge.label} — {badge.years} an{badge.years > 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-zinc-500 text-sm">
          Ces badges seront visibles sur votre photo de profil et sur vos annonces.
        </div>
      </div>
    </div>
  );
}
