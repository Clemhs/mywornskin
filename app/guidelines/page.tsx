'use client';

import Link from 'next/link';
import { Camera, Check, X } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <Link href="/" className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-8">
          ← Retour à l’accueil
        </Link>

        <h1 className="text-5xl font-bold mb-4">Conditions de validation des photos</h1>
        <p className="text-xl text-zinc-400 mb-12">
          Pour garantir la qualité, l’authenticité et le respect de tous sur MyWornSkin
        </p>

        <div className="space-y-16">
          {/* Photos de profil & couverture */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Camera className="w-8 h-8 text-pink-400" />
              <h2 className="text-3xl font-semibold">Photos de profil et de couverture</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Ces photos sont moins strictes. Vous pouvez choisir de ne pas montrer votre visage.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 rounded-3xl p-8">
                <p className="text-emerald-400 font-medium mb-3">✓ Autorisé</p>
                <ul className="text-zinc-400 space-y-2">
                  <li>• Visage caché ou partiellement visible</li>
                  <li>• Photos artistiques ou sensuelles</li>
                  <li>• Bonne qualité et éclairage correct</li>
                </ul>
              </div>
              <div className="bg-zinc-900 rounded-3xl p-8">
                <p className="text-red-400 font-medium mb-3">✕ Interdit</p>
                <ul className="text-zinc-400 space-y-2">
                  <li>• Photos floues ou de très mauvaise qualité</li>
                  <li>• Contenu sexuel explicite (seins nus, parties intimes, etc.)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Photos des produits en vente */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-emerald-600 text-white p-3 rounded-2xl">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-semibold">Photos des produits en vente (WornByMe)</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Ces photos doivent être plus authentiques car elles sont vendues avec l’histoire intime du vêtement.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 rounded-3xl p-8">
                <p className="text-emerald-400 font-medium mb-3">✓ Recommandé / Obligatoire</p>
                <ul className="text-zinc-400 space-y-2">
                  <li>• Le vêtement porté sur vous (vraiment porté)</li>
                  <li>• Visage visible de préférence</li>
                  <li>• Bonne qualité, éclairage naturel</li>
                </ul>
              </div>
              <div className="bg-zinc-900 rounded-3xl p-8">
                <p className="text-red-400 font-medium mb-3">✕ Interdit</p>
                <ul className="text-zinc-400 space-y-2">
                  <li>• Vêtement sur cintre ou mannequin</li>
                  <li>• Contenu sexuel explicite (tétons, parties intimes visibles)</li>
                  <li>• Photos trop floues ou de mauvaise qualité</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Option sans visage */}
          <div className="bg-zinc-900 rounded-3xl p-10">
            <h3 className="text-2xl font-semibold mb-6">Option "Sans montrer mon visage"</h3>
            <p className="text-zinc-400 leading-relaxed">
              Vous pouvez cocher cette option pour les photos de profil, de couverture ou de produits.<br /><br />
              Dans ce cas, nous demandons des preuves supplémentaires pour valider que le vêtement a bien été porté par vous :
            </p>
            <ul className="mt-6 space-y-3 text-zinc-300">
              <li className="flex gap-3">• Plusieurs photos sous différents angles</li>
              <li className="flex gap-3">• Signes distinctifs reconnaissables (tatouage, piercing, bijou, grain de beauté, cicatrice…)</li>
              <li className="flex gap-3">• Une photo avec un papier portant la date du jour et votre pseudo</li>
              <li className="flex gap-3">• Optionnellement une courte vidéo (très appréciée)</li>
            </ul>
            <p className="text-pink-400 mt-8">La validation peut prendre un peu plus de temps dans ce cas.</p>
          </div>

          {/* Règle générale */}
          <div className="bg-red-900/30 border border-red-500 rounded-3xl p-8">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Règle importante pour tout le site</h3>
            <p className="text-zinc-300">
              Aucune photo à caractère sexuel affirmé n’est autorisée.<br />
              Pas de tétons, pas de parties intimes visibles, même partiellement. 
              Le site doit rester élégant et accessible à tous.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-zinc-500">
          Toute photo refusée peut être renvoyée après correction.<br />
          L’équipe MyWornSkin valide chaque demande manuellement.
        </div>
      </div>
    </div>
  );
}
