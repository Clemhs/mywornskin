'use client';

import Link from 'next/link';
import { Award } from 'lucide-react';

export default function DistinctionsPage() {
  const distinctions = [
    {
      icon: "👃",
      title: "Chasseuse d'Odeurs",
      condition: "10+ pièces vendues avec une histoire olfactive détaillée",
      description: "Vous excellez dans la description sensorielle de l'odeur du vêtement porté.",
      color: "text-amber-400"
    },
    {
      icon: "🎤",
      title: "Voix Sensuelle",
      condition: "5+ enregistrements vocaux publiés",
      description: "Votre voix transmet l'émotion et l'intimité de manière puissante.",
      color: "text-pink-400"
    },
    {
      icon: "🔥",
      title: "Real Worn Expert",
      condition: "90%+ de pièces vérifiées WornByMe",
      description: "Le plus haut niveau d'authenticité sur la plateforme.",
      color: "text-rose-400"
    },
    {
      icon: "📖",
      title: "Conteuse Intime",
      condition: "15+ histoires très détaillées et émotionnelles",
      description: "Vous maîtrisez l'art de raconter une histoire personnelle profonde.",
      color: "text-purple-400"
    },
    {
      icon: "🌹",
      title: "Maîtresse des Sens",
      condition: "Combinaison histoire + vocal + real worn sur 8+ pièces",
      description: "La distinction ultime : maîtrise de tous les sens.",
      color: "text-orange-400"
    },
    {
      icon: "🏆",
      title: "Légende du Worn",
      condition: "50+ pièces vendues au total",
      description: "Statut de légende sur MyWornSkin.",
      color: "text-yellow-400"
    },
    {
      icon: "🌸",
      title: "Cadre Rose",
      condition: "1 an d'inscription",
      description: "Premier cadre d’ancienneté.",
      color: "text-pink-400"
    },
    {
      icon: "🥈",
      title: "Cadre Argent",
      condition: "2 ans d'inscription",
      description: "Ancienneté intermédiaire.",
      color: "text-zinc-300"
    },
    {
      icon: "🥇",
      title: "Cadre Or",
      condition: "5 ans d'inscription",
      description: "Le plus prestigieux des cadres d’ancienneté.",
      color: "text-yellow-400"
    },
    {
      icon: "🔥",
      title: "Passion Extrême",
      condition: "100+ pièces mises en ligne",
      description: "Pour les créatrices les plus actives et engagées.",
      color: "text-red-400"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <Link href="/creators" className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-8">
          ← Retour aux créatrices
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <Award className="w-10 h-10 text-pink-400" />
          <h1 className="text-5xl font-bold">Les Distinctions</h1>
        </div>

        <p className="text-xl text-zinc-400 max-w-2xl mb-16">
          Les distinctions récompensent les créatrices qui excellent dans l'authenticité, la sensualité et la qualité de leur contenu.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {distinctions.map((dist, index) => (
            <div key={index} className="bg-zinc-900 rounded-3xl p-8 hover:ring-2 hover:ring-pink-400/30 transition-all">
              <div className="flex items-start gap-5">
                <div className="text-5xl">{dist.icon}</div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-semibold ${dist.color}`}>{dist.title}</h3>
                  <p className="text-pink-400 text-sm mt-1">{dist.condition}</p>
                  <p className="text-zinc-300 mt-6 leading-relaxed">{dist.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-zinc-400">
          <p className="max-w-md mx-auto">
            Les distinctions apparaissent sur votre profil et valorisent votre travail auprès de la communauté.
          </p>
        </div>
      </div>
    </div>
  );
}
