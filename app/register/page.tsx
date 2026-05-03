'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterChoicePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la connexion
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Créer un compte</h1>
          <p className="text-zinc-400 text-xl">
            Que souhaitez-vous faire sur MyWornSkin ?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-lg mx-auto">
          {/* Client */}
          <Link href="/register/client" className="group">
            <div className="bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 rounded-3xl p-10 h-full transition-all hover:scale-[1.03] duration-300">
              <div className="text-6xl mb-6">🛍️</div>
              <h2 className="text-2xl font-semibold mb-3">Je suis un Client</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Je veux découvrir et acheter des pièces uniques portées par mes créatrices préférées.
              </p>
              <span className="text-pink-400 group-hover:text-pink-500 font-medium text-lg">
                Créer mon compte client →
              </span>
            </div>
          </Link>

          {/* Créatrice */}
          <Link href="/register/creator" className="group">
            <div className="bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 rounded-3xl p-10 h-full transition-all hover:scale-[1.03] duration-300">
              <div className="text-6xl mb-6">👠</div>
              <h2 className="text-2xl font-semibold mb-3">Je suis une Créatrice</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Je veux vendre mes pièces portées et construire ma communauté.
              </p>
              <span className="text-pink-400 group-hover:text-pink-500 font-medium text-lg">
                Devenir créatrice →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
