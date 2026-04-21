export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-1.5 mb-8 text-sm border border-zinc-800">
          <span className="text-rose-400">●</span>
          Plateforme en reconstruction
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
          Des vêtements<br />
          déjà portés.<br />
          <span className="text-rose-500">Avec une histoire.</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          La plateforme intime où les créateurs vendent leurs vêtements portés avec émotion, 
          et où les amateurs peuvent découvrir, acheter et discuter en privé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/creators"
            className="bg-rose-600 hover:bg-rose-500 px-12 py-4 rounded-2xl text-lg font-medium transition-all active:scale-[0.98]"
          >
            Explorer les créateurs
          </a>
          
          <a 
            href="/sell"
            className="border border-zinc-700 hover:border-zinc-500 px-12 py-4 rounded-2xl text-lg font-medium transition-all"
          >
            Commencer à vendre
          </a>
        </div>
      </div>

      {/* Status */}
      <div className="border-t border-zinc-800 py-12 text-center">
        <p className="text-zinc-500 text-sm">
          Tout est sauvegardé sur GitHub • On continue la reconstruction
        </p>
      </div>
    </div>
  );
}
