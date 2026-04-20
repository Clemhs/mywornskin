'use client';

import { useLanguage } from '../context/LanguageContext';

export default function SellPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {t('sell')}
          </h1>
          <p className="text-xl text-gray-400">
            Vends tes vêtements portés et gagne de l'argent facilement
          </p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <div className="space-y-8">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Titre de l'annonce</label>
              <input 
                type="text" 
                placeholder="Ex: Culotte noire portée 2 jours"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea 
                rows={5}
                placeholder="Décris l'article, combien de temps il a été porté, etc."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Prix (€)</label>
                <input 
                  type="number" 
                  placeholder="25"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Taille</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400">
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-rose-600 hover:bg-rose-500 py-5 rounded-3xl text-xl font-semibold transition mt-6">
              Publier l'annonce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
