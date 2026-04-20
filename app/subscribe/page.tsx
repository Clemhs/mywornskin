'use client';

import { useLanguage } from '../context/LanguageContext';

export default function SubscribePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            {t('subscribe')}
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Accédez à du contenu exclusif, photos intimes et discussions privées avec tes créatrices préférées.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Abonnement Mensuel */}
          <div className="bg-zinc-900 rounded-3xl p-10 border border-zinc-700 hover:border-rose-600/50 transition-all group">
            <h2 className="text-3xl font-semibold mb-2">{t('monthly')}</h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-6xl font-bold">9,99</span>
              <span className="text-gray-400 text-2xl">{t('per_month')}</span>
            </div>

            <ul className="space-y-4 mb-12 text-lg">
              <li className="flex items-center gap-3">✓ Photos exclusives chaque semaine</li>
              <li className="flex items-center gap-3">✓ Messagerie privée illimitée</li>
              <li className="flex items-center gap-3">✓ Accès prioritaire aux nouveautés</li>
              <li className="flex items-center gap-3">✓ Annulation à tout moment</li>
            </ul>

            <button className="w-full bg-rose-600 hover:bg-rose-500 py-5 rounded-2xl text-xl font-semibold transition group-hover:scale-105">
              {t('subscribe_monthly')}
            </button>
          </div>

          {/* Abonnement Annuel */}
          <div className="bg-zinc-900 rounded-3xl p-10 border border-rose-600 relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-rose-600 text-xs font-bold px-5 py-1.5 rounded-full tracking-wider">
              {t('popular')}
            </div>

            <h2 className="text-3xl font-semibold mb-2">{t('yearly')}</h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold">99</span>
              <span className="text-gray-400 text-2xl">{t('per_year')}</span>
            </div>
            <p className="text-emerald-400 mb-8">({t('save')} 17%)</p>

            <ul className="space-y-4 mb-12 text-lg">
              <li className="flex items-center gap-3">✓ Tout du forfait mensuel</li>
              <li className="flex items-center gap-3">✓ Accès anticipé aux nouveautés</li>
              <li className="flex items-center gap-3">✓ Badge "VIP" exclusif</li>
              <li className="flex items-center gap-3">✓ 2 mois offerts</li>
            </ul>

            <button className="w-full bg-white text-black hover:bg-gray-100 py-5 rounded-2xl text-xl font-semibold transition">
              {t('subscribe_yearly')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
