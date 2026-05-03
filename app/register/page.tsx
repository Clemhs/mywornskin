'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <Header />

      <div className="max-w-2xl mx-auto pt-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Créer un compte</h1>
        <p className="text-zinc-400 text-xl mb-16">Que souhaitez-vous faire sur MyWornSkin ?</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-lg mx-auto">
          {/* Client */}
          <Link href="/register" className="group">
            <div className="bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 rounded-3xl p-10 h-full transition-all hover:scale-105">
              <div className="text-6xl mb-6">🛍️</div>
              <h2 className="text-2xl font-semibold mb-3">Je suis un Client</h2>
              <p className="text-zinc-400 mb-8">Je veux découvrir et acheter des pièces uniques portées par mes créatrices préférées.</p>
              <span className="text-pink-400 group-hover:text-pink-500 font-medium text-lg">Créer mon compte client →</span>
            </div>
          </Link>

          {/* Créatrice */}
          <Link href="/become-creator" className="group">
            <div className="bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 rounded-3xl p-10 h-full transition-all hover:scale-105">
              <div className="text-6xl mb-6">👠</div>
              <h2 className="text-2xl font-semibold mb-3">Je suis une Créatrice</h2>
              <p className="text-zinc-400 mb-8">Je veux vendre mes pièces portées et construire ma communauté.</p>
              <span className="text-pink-400 group-hover:text-pink-500 font-medium text-lg">Devenir créatrice →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
