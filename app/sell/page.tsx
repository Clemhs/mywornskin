'use client';

import { useLanguage } from '../context/LanguageContext';

export default function SellPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            {t('sell_title')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('sell_description')}
          </p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-10 md:p-14">
          <div className="space-y-8">
            <div>
              <label className="block text-sm text-gray-400 mb-3">{t('title')}</label>
              <input 
                type="text" 
                placeholder="Ex: Ma culotte noire portée pendant 3 jours"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 focus:outline-none focus:border-rose-400 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">{t('description')}</label>
              <textarea 
                rows={6}
                placeholder="Décris l'article en détail : combien de temps il a été porté, ton odeur, l'état..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-5 focus:outline-none focus:border-rose-400 text-lg resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-gray-400 mb-3">{t('price')}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="25"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 focus:outline-none focus:border-rose-400 text-2xl"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">{t('size')}</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 focus:outline-none focus:border-rose-400 text-lg">
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-rose-600 hover:bg-rose-500 py-6 rounded-3xl text-xl font-semibold mt-6 transition">
              {t('publish')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
