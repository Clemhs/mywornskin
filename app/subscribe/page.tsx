'use client';

import { useLanguage } from '../context/LanguageContext';

export default function SubscribePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          {t('subscribe')}
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Accédez à du contenu exclusif, photos intimes et discussions privées.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Abonnement Mensuel */}
          <div className="bg-zinc-900 rounded-3xl p-10 border border-rose-900/30 hover:border-rose-600 transition-all">
            <h2 className="text-3xl font-semibold mb-4">Mensuel</h2>
            <p className="text-6xl font-bold mb-2">9,99 €</p>
            <p className="text-gray-400 mb-8">par mois</p>
            
            <ul className="space-y-4 text-left mb-10">
              <li className="flex items-center gap-3">✓ Photos exclusives</li>
              <li className="flex items-center gap-3">✓ Messagerie prioritaire</li>
              <li className="flex items-center gap-3">✓ Accès aux lives</li>
            </ul>

            <button className="w-full bg-rose-600 hover:bg-rose-500 py-4 rounded-2xl font-semibold text-lg transition">
              S'abonner mensuellement
            </button>
          </div>

          {/* Abonnement Annuel */}
          <div className="bg-zinc-900 rounded-3xl p-10 border border-rose-600 relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-rose-600 text-xs font-bold px-4 py-1 rounded-full">POPULAIRE</div>
            
            <h2 className="text-3xl font-semibold mb-4">Annuel</h2>
            <p className="text-6xl font-bold mb-2">99 €</p>
            <p className="text-gray-400 mb-2">par an</p>
            <p className="text-emerald-400 text-sm mb-8">Économisez 17 %</p>

            <ul className="space-y-4 text-left mb-10">
              <li className="flex items-center gap-3">✓ Tout du mensuel</li>
              <li className="flex items-center gap-3">✓ Accès anticipé aux nouveautés</li>
              <li className="flex items-center gap-3">✓ Badge exclusif</li>
            </ul>

            <button className="w-full bg-white text-black hover:bg-gray-100 py-4 rounded-2xl font-semibold text-lg transition">
              S'abonner annuellement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
