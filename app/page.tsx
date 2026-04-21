export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-28 text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-5 py-2 bg-zinc-900 rounded-full border border-zinc-800 text-sm">
          <span className="text-rose-500">♥</span>
          Plateforme intime en reconstruction
        </div>

        <h1 className="text-6xl md:text-[4.5rem] font-bold tracking-tighter leading-none mb-8">
          Des vêtements<br />
          déjà portés.<br />
          <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
            Avec une histoire.
          </span>
        </h1>

        <p className="text-2xl text-zinc-400 max-w-3xl mx-auto mb-12">
          Découvrez, achetez et discutez en privé avec des créateurs qui partagent 
          leurs vêtements portés avec émotion.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <a 
            href="/creators"
            className="bg-rose-600 hover:bg-rose-500 px-14 py-5 rounded-2xl text-xl font-semibold transition-all active:scale-95 shadow-lg shadow-rose-500/20"
          >
            Explorer les créateurs
          </a>
          
          <a 
            href="/sell"
            className="border-2 border-zinc-700 hover:border-zinc-400 px-14 py-5 rounded-2xl text-xl font-semibold transition-all"
          >
            Commencer à vendre
          </a>
        </div>
      </div>

      {/* Footer teaser */}
      <div className="py-20 border-t border-zinc-800 text-center text-zinc-500">
        <p>Plateforme en cours de reconstruction • Tout est sauvegardé sur GitHub</p>
      </div>
    </div>
  );
}
