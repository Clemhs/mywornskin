'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Fond subtil avec dégradé rose/noir */}
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_70%)] opacity-40"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-rose-500/20">
            <span className="text-rose-400">✦</span>
            <span className="text-sm tracking-widest uppercase">Vêtements portés • Histoires intimes</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold leading-none mb-6 tracking-tighter">
            Ce qui a touché<br />
            <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ta peau
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12">
            Des pièces déjà portées.<br />
            Avec leur odeur, leur chaleur, leur histoire.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/creators"
              className="bg-rose-600 hover:bg-rose-500 px-10 py-5 rounded-2xl text-lg font-semibold transition-all active:scale-95"
            >
              Découvrir les créateurs
            </Link>
            
            <Link
              href="/sell"
              className="border border-zinc-700 hover:border-rose-500 px-10 py-5 rounded-2xl text-lg font-semibold transition-all active:scale-95"
            >
              Mettre ma pièce en vente
            </Link>
          </div>

          <div className="mt-16 text-zinc-500 text-sm flex items-center justify-center gap-8">
            <div>♥ Confidentialité totale</div>
            <div>♥ Paiement sécurisé</div>
            <div>♥ Messagerie privée</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
          <div className="text-xs tracking-widest">SCROLL</div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-500 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
