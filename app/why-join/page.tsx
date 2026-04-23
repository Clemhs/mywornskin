'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Link from 'next/link';

export default function WhyJoin() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-950 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">{t('whyJoin') || "Pourquoi nous rejoindre ?"}</h1>
          <p className="text-xl text-zinc-400">La plateforme la plus intime et authentique pour vendre tes vêtements portés</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Pour les Créatrices */}
          <div className="card p-10">
            <h2 className="text-3xl font-semibold mb-8 text-rose-400">Pour les Créatrices</h2>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="text-4xl">💰</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Gagnez de l’argent avec ce que vous portez tous les jours</h3>
                  <p className="text-zinc-400">10% de commission seulement – l’un des meilleurs taux du marché.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="text-4xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Contrôle total sur votre contenu</h3>
                  <p className="text-zinc-400">Vous décidez ce que vous montrez et à qui.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="text-4xl">🌟</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Visibilité et badges</h3>
                  <p className="text-zinc-400">Badges de volume et longévité qui boostent votre visibilité.</p>
                </div>
              </div>
            </div>

            <Link href="/sell" className="btn-primary w-full py-6 mt-10 block text-center">
              Commencer à vendre maintenant
            </Link>
          </div>

          {/* Pour les Acheteurs */}
          <div className="card p-10">
            <h2 className="text-3xl font-semibold mb-8 text-rose-400">Pour les Acheteurs</h2>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="text-4xl">👃</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Vêtements avec une vraie odeur intime</h3>
                  <p className="text-zinc-400">Pas de produits neufs stériles – uniquement du porté authentique.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="text-4xl">🔍</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Créatrices vérifiées</h3>
                  <p className="text-zinc-400">Chaque profil est contrôlé manuellement avant publication.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="text-4xl">💬</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Discussion privée directe</h3>
                  <p className="text-zinc-400">Demandez des photos, vidéos ou précisions aux créatrices.</p>
                </div>
              </div>
            </div>

            <Link href="/creators" className="btn-primary w-full py-6 mt-10 block text-center">
              Découvrir les créatrices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
