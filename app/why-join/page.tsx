'use client';

import Link from 'next/link';

export default function WhyJoin() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-semibold text-center mb-4">Pourquoi rejoindre MyWornSkin ?</h1>
        <p className="text-xl text-zinc-400 text-center max-w-2xl mx-auto mb-16">
          Une communauté intime, authentique et respectueuse.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Pour les Créatrices */}
          <div className="card p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center text-2xl">👠</div>
              <h2 className="text-3xl font-medium">Pour les Créatrices</h2>
            </div>
            
            <ul className="space-y-8">
              <li className="flex gap-4">
                <span className="text-rose-400 text-2xl">01</span>
                <div>
                  <p className="font-medium">Vendez directement vos pièces intimes</p>
                  <p className="text-zinc-400 text-sm">Sans intermédiaire, au prix que vous décidez.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-rose-400 text-2xl">02</span>
                <div>
                  <p className="font-medium">Gagnez plus que sur OnlyFans ou MyM</p>
                  <p className="text-zinc-400 text-sm">Commission unique de 10 % seulement.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-rose-400 text-2xl">03</span>
                <div>
                  <p className="font-medium">Communauté ultra-ciblée</p>
                  <p className="text-zinc-400 text-sm">Des passionnés qui recherchent exactement ce que vous proposez.</p>
                </div>
              </li>
            </ul>

            <Link href="/sell" className="btn-primary mt-12 block text-center py-7 text-xl font-medium">
              Commencer à vendre maintenant
            </Link>
          </div>

          {/* Pour les Acheteurs */}
          <div className="card p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center text-2xl">🖤</div>
              <h2 className="text-3xl font-medium">Pour les Acheteurs</h2>
            </div>
            
            <ul className="space-y-8">
              <li className="flex gap-4">
                <span className="text-rose-400 text-2xl">01</span>
                <div>
                  <p className="font-medium">Des pièces uniques et chargées d’histoire</p>
                  <p className="text-zinc-400 text-sm">Chaque vêtement porte l’odeur, la chaleur et le désir de sa créatrice.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-rose-400 text-2xl">02</span>
                <div>
                  <p className="font-medium">Créatrices vérifiées</p>
                  <p className="text-zinc-400 text-sm">Chaque profil est contrôlé manuellement.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-rose-400 text-2xl">03</span>
                <div>
                  <p className="font-medium">Confidentialité totale</p>
                  <p className="text-zinc-400 text-sm">Envoi discret et messagerie privée sécurisée.</p>
                </div>
              </li>
            </ul>

            <Link href="/creators" className="btn-primary mt-12 block text-center py-7 text-xl font-medium">
              Découvrir les créatrices
            </Link>
          </div>
        </div>

        <div className="text-center mt-16 text-zinc-500 text-sm tracking-widest">
          MyWornSkin • L’intimité que l’on peut toucher.
        </div>
      </div>
    </div>
  );
}
