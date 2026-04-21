'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header simple */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
            <h1 className="text-2xl font-bold tracking-tight">MyWornSkin</h1>
          </div>
          
          <div className="flex items-center gap-8 text-sm">
            <Link href="/creators" className="hover:text-rose-400 transition">Découvrir les créateurs</Link>
            <Link href="/sell" className="hover:text-rose-400 transition">Vendre</Link>
            <Link href="/messages" className="hover:text-rose-400 transition">Messages</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
          Des vêtements<br />déjà portés.<br />
          <span className="text-rose-500">Avec une histoire.</span>
        </h2>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          La plateforme intime où les créateurs vendent leurs vêtements portés, 
          et où les amateurs peuvent découvrir, acheter et discuter en privé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/creators"
            className="bg-rose-600 hover:bg-rose-500 px-10 py-4 rounded-2xl text-lg font-medium transition-all active:scale-95"
          >
            Explorer les créateurs
          </Link>
          
          <Link 
            href="/sell"
            className="border border-zinc-700 hover:border-zinc-500 px-10 py-4 rounded-2xl text-lg font-medium transition-all"
          >
            Commencer à vendre
          </Link>
        </div>
      </div>

      {/* Petit teaser */}
      <div className="border-t border-zinc-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-zinc-500 text-sm">
          Plateforme en cours de reconstruction • Tout est sauvegardé dans GitHub
        </div>
      </div>
    </div>
  );
}
