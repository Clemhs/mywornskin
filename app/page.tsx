'use client';
// Homepage - Version améliorée et moderne (V1)
import Link from 'next/link';
import Header from '../../components/Header';   // ← Import corrigé

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-zinc-950 text-white">
        {/* HERO SECTION */}
        <section className="pt-20 pb-16 px-4 md:pt-24">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-none mb-6">
              L&apos;endroit où l&apos;authenticité<br />rencontre le désir
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10">
              Rejoignez une communauté intime de créatrices et de créateurs. 
              Partagez votre univers en toute liberté.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/creators"
                className="bg-white text-black px-10 py-4 rounded-3xl text-lg font-medium hover:bg-zinc-200 transition"
              >
                Découvrir les créatrices
              </Link>
              <Link
                href="/why-join"
                className="border border-white/30 hover:border-white/60 px-10 py-4 rounded-3xl text-lg font-medium transition"
              >
                Pourquoi nous rejoindre ?
              </Link>
            </div>

            <p className="text-xs text-zinc-500 mt-8">Rejoignez +12 400 créateurs et créatrices</p>
          </div>
        </section>

        {/* CRÉATRICES EN VEDETTE */}
        <section className="py-16 bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-8">Créatrices en vedette</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <Link key={i} href={`/creators/${i}`} className="group">
                  <div className="aspect-[4/5] bg-zinc-800 rounded-3xl overflow-hidden relative">
                    <img 
                      src={`https://picsum.photos/id/${90 + i}/400/500`} 
                      alt="Créatrice" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="font-medium">Creator {i}</p>
                      <p className="text-pink-400 text-sm">En ligne maintenant</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* POURQUOI MYWOMSKIN */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-12">Pourquoi MyWomSkin ?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-medium mb-2">Confidentialité totale</h3>
                <p className="text-zinc-400">Votre contenu reste privé et protégé. Vous contrôlez tout.</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-medium mb-2">Gagnez vraiment</h3>
                <p className="text-zinc-400">Gardez jusqu&apos;à 85% de vos revenus.</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-medium mb-2">Communauté authentique</h3>
                <p className="text-zinc-400">Rencontrez des personnes qui apprécient la vraie connexion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-black text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-semibold mb-6">Prêt à partager votre univers ?</h2>
            <Link
              href="/sell"
              className="inline-block bg-pink-600 hover:bg-pink-500 text-white px-12 py-5 rounded-3xl text-xl font-medium transition"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
