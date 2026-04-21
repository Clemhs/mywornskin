export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
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
          <a 
            href="/creators"
            className="bg-rose-600 hover:bg-rose-500 px-10 py-4 rounded-2xl text-lg font-medium transition-all active:scale-95"
          >
            Explorer les créateurs
          </a>
          
          <a 
            href="/sell"
            className="border border-zinc-700 hover:border-zinc-500 px-10 py-4 rounded-2xl text-lg font-medium transition-all"
          >
            Commencer à vendre
          </a>
        </div>
      </div>

      {/* Teaser */}
      <div className="border-t border-zinc-800 py-16 text-center text-zinc-500 text-sm">
        Plateforme en cours de reconstruction • Tout est sauvegardé dans GitHub
      </div>
    </div>
  );
}
