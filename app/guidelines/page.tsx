'use client';

import Link from 'next/link';
import { Camera, CheckCircle, XCircle, Shield, Clock } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 mb-12 transition-colors">
          ← Retour à l’accueil
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tighter mb-4">Règles de validation</h1>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
            Pour une expérience élégante, authentique et respectueuse
          </p>
        </div>

        <div className="space-y-20">
          {/* Photos de profil & couverture */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                <Camera className="w-7 h-7 text-pink-400" />
              </div>
              <h2 className="text-4xl font-semibold">Photos de profil & couverture</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-10">
                <div className="flex items-center gap-3 text-emerald-400 mb-6">
                  <CheckCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-medium">Ce qui est accepté</h3>
                </div>
                <ul className="space-y-4 text-zinc-300">
                  <li className="flex gap-3">• Visage caché ou partiellement visible</li>
                  <li className="flex gap-3">• Photos artistiques, sensuelles et élégantes</li>
                  <li className="flex gap-3">• Bonne qualité et éclairage correct</li>
                  <li className="flex gap-3">• Tenue intime portée</li>
                </ul>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-10">
                <div className="flex items-center gap-3 text-red-400 mb-6">
                  <XCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-medium">Ce qui est refusé</h3>
                </div>
                <ul className="space-y-4 text-zinc-300">
                  <li className="flex gap-3">• Photos floues ou de très mauvaise qualité</li>
                  <li className="flex gap-3">• Contenu sexuel explicite (seins nus, parties génitales)</li>
                  <li className="flex gap-3">• Photos trop sombres ou mal cadrées</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Photos des produits (WornByMe) */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-4xl font-semibold">Photos des produits en vente</h2>
            </div>
            <p className="text-zinc-400 mb-10 text-lg">Ces photos sont plus strictes car elles sont vendues avec une histoire intime.</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-10">
                <div className="flex items-center gap-3 text-emerald-400 mb-6">
                  <CheckCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-medium">Recommandé</h3>
                </div>
                <ul className="space-y-4 text-zinc-300">
                  <li className="flex gap-3">• Vêtement réellement porté sur vous</li>
                  <li className="flex gap-3">• Visage visible de préférence</li>
                  <li className="flex gap-3">• Plusieurs angles et bonne luminosité</li>
                </ul>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-10">
                <div className="flex items-center gap-3 text-red-400 mb-6">
                  <XCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-medium">Interdit</h3>
                </div>
                <ul className="space-y-4 text-zinc-300">
                  <li className="flex gap-3">• Vêtement sur cintre ou mannequin</li>
                  <li className="flex gap-3">• Contenu sexuel explicite</li>
                  <li className="flex gap-3">• Photos de mauvaise qualité</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Option sans visage */}
          <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700 rounded-3xl p-12">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-9 h-9 text-pink-400" />
              <h3 className="text-3xl font-semibold">Option “Sans montrer mon visage”</h3>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
              Vous pouvez cacher votre visage. Dans ce cas, nous demandons des preuves supplémentaires 
              pour confirmer que le vêtement a bien été porté par vous.
            </p>
            <ul className="mt-8 grid md:grid-cols-2 gap-4 text-zinc-300">
              <li className="flex gap-3 items-start">• Plusieurs photos sous différents angles</li>
              <li className="flex gap-3 items-start">• Signes distinctifs (tatouage, piercing, bijou…)</li>
              <li className="flex gap-3 items-start">• Photo avec un papier daté + votre pseudo</li>
              <li className="flex gap-3 items-start">• Vidéo courte (fortement recommandée)</li>
            </ul>
            <p className="text-pink-400 mt-10 text-sm">La validation peut prendre 24 à 48h dans ce cas.</p>
          </section>

          {/* Règle générale */}
          <div className="bg-red-950/30 border border-red-500/30 rounded-3xl p-12 text-center">
            <h3 className="text-2xl font-semibold text-red-400 mb-6">Règle absolue du site</h3>
            <p className="text-xl text-red-300 max-w-2xl mx-auto">
              Aucune photo à caractère sexuel explicite n’est autorisée.<br />
              Pas de tétons, pas de parties intimes visibles, même partiellement.
            </p>
            <p className="text-zinc-400 mt-8">Le site doit rester élégant et accessible à tous.</p>
          </div>
        </div>

        <div className="mt-20 text-center text-zinc-500">
          Toute photo refusée peut être renvoyée après modification.<br />
          L’équipe MyWornSkin valide chaque demande manuellement avec soin.
        </div>
      </div>
    </div>
  );
}
