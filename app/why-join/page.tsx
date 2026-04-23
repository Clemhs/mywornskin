'use client';

import Link from 'next/link';

export default function WhyJoin() {
  return (
    <div className="min-h-screen bg-zinc-950 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Pourquoi rejoindre MyWornSkin ?</h1>
          <p className="text-xl text-zinc-400">Le premier site spécialisé dans les vêtements déjà portés.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Version Créatrice */}
          <div className="card p-10">
            <h2 className="text-3xl font-semibold mb-8 text-rose-400">Pour les Créatrices</h2>
            <p className="text-zinc-300 text-lg mb-8">
              Vous vendez vos vêtements portés ? MyWornSkin vous permet de centraliser toutes vos ventes au même endroit.
            </p>
            <ul className="space-y-4 text-zinc-400 mb-10">
              <li>✓ Un seul espace au lieu de multiples messageries</li>
              <li>✓ Commission à seulement 10% (8% pour les premières créatrices)</li>
              <li>✓ Mise en avant automatique pendant vos 3 premières semaines</li>
              <li>✓ Audience ciblée : les acheteurs viennent pour ce type de contenu</li>
              <li>✓ Contrôle total sur vos annonces et vos messages</li>
            </ul>
            <Link href="/sell" className="btn-primary w-full text-center block">
              Créer mon compte créatrice
            </Link>
          </div>

          {/* Version Acheteur */}
          <div className="card p-10">
            <h2 className="text-3xl font-semibold mb-8 text-rose-400">Pour les Acheteurs</h2>
            <p className="text-zinc-300 text-lg mb-8">
              Vous cherchez des pièces authentiques et chargées d’histoire ?
            </p>
            <ul className="space-y-4 text-zinc-400 mb-10">
              <li>✓ Large choix de vêtements réellement portés</li>
              <li>✓ Interaction directe avec les créatrices</li>
              <li>✓ Authenticité garantie par vérification des profils</li>
              <li>✓ Paiement sécurisé et anonymat respecté</li>
              <li>✓ Expérience intime et fetish-friendly</li>
            </ul>
            <Link href="/creators" className="btn-primary w-full text-center block">
              Découvrir les créatrices
            </Link>
          </div>

        </div>

        {/* Texte de confiance */}
        <div className="mt-16 text-center">
          <p className="text-emerald-400 font-medium">Tous les créateurs sont vérifiés manuellement par notre équipe.</p>
          <p className="text-zinc-500 mt-2">Vous achetez en toute confiance sur MyWornSkin.</p>
        </div>
      </div>
    </div>
  );
}
