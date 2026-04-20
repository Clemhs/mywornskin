'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">MyWornSkin</h1>
          <p className="text-2xl text-gray-400">
            Vêtements déjà portés • Vibe intime • Rien que pour toi
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <Link 
            href="/auth"
            className="bg-white text-black font-semibold text-lg px-10 py-4 rounded-2xl hover:bg-gray-200 transition"
          >
            Se connecter / S'inscrire
          </Link>
        </div>

        <div className="text-center text-gray-500">
          <p>Aucun vêtement disponible pour le moment</p>
          <p className="text-sm mt-2">Connecte-toi pour mettre tes vêtements en vente</p>
        </div>
      </div>
    </div>
  );
}
