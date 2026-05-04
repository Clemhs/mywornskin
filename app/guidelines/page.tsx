'use client';

import Link from 'next/link';
import { Camera, Shield, Clock } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 mb-12 transition-colors">
          ← Retour à l’accueil
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-light tracking-tight mb-4">Règles de validation</h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Pour une expérience élégante, authentique et respectueuse
          </p>
        </div>

        <div className="space-y-16">
          {/* Profil & Couverture */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <Camera className="w-6 h-6 text-pink-400" />
              <h2 className="text-3xl font-light">Photos de profil & couverture</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Ces photos sont moins strictes. Vous pouvez choisir de ne pas montrer votre visage.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                <p className="text-emerald-400 font-medium mb-4">✓ Autorisé</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li>• Visage caché ou partiellement visible</li>
                  <li>• Photos artistiques et sensuelles</li>
                  <li>• Bonne qualité et éclairage correct</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                <p className="text-red-400 font-medium mb-4">✕ Interdit</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li>• Photos floues ou de très mauvaise qualité</li>
                  <li>• Contenu sexuel explicite</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Photos Produits */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-6 h-6 text-pink-400" />
              <h2 className="text-3xl font-light">Photos des produits en vente</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Ces photos doivent refléter l’authenticité du vêtement porté.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                <p className="text-emerald-400 font-medium mb-4">✓ Recommandé</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li>• Vêtement réellement porté sur vous</li>
                  <li>• Visage visible de préférence</li>
                  <li>• Bonne luminosité et plusieurs angles</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                <p className="text-red-400 font-medium mb-4">✕ Interdit</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li>• Vêtement sur cintre ou mannequin</li>
                  <li>• Contenu sexuel explicite</li>
                  <li>• Photos de mauvaise qualité</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sans visage */}
          <section className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-10">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-6 h-6 text-pink-400" />
              <h3 className="text-2xl font-light">Option “Sans montrer mon visage”</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Vous pouvez cacher votre visage. Dans ce cas, nous demandons des preuves supplémentaires 
              pour confirmer l’authenticité du port du vêtement.
            </p>
            <ul className="mt-8 grid md:grid-cols-2 gap-y-3 text-sm text-zinc-400">
              <li>• Plusieurs photos sous différents angles</li>
              <li>• Signes distinctifs visibles (tatouage, piercing, bijou...)</li>
              <li>• Photo avec un papier daté + votre pseudo</li>
              <li>• Vidéo courte (fortement appréciée)</li>
            </ul>
            <p className="text-pink-400 text-sm mt-8">La validation peut prendre un peu plus de temps dans ce cas.</p>
          </section>

          {/* Règle absolue */}
          <div className="border border-red-500/30 bg-red-950/20 rounded-3xl p-10 text-center">
            <p className="text-red-400 font-medium text-lg">
              Aucune photo à caractère sexuel explicite n’est autorisée sur le site.
            </p>
            <p className="text-zinc-400 mt-3">Pas de tétons, pas de parties intimes visibles. L’élégance reste notre priorité.</p>
          </div>
        </div>

        <div className="mt-20 text-center text-sm text-zinc-500">
          Toute photo refusée peut être renvoyée après correction.<br />
          L’équipe MyWornSkin valide chaque demande avec soin.
        </div>
      </div>
    </div>
  );
}
