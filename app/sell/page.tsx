'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Camera, Video, ShieldCheck, CheckCircle } from 'lucide-react';

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [noFace, setNoFace] = useState(false);

  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [publicVideo, setPublicVideo] = useState<string>('');

  const handlePublicPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPublicPhotos(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleVerificationPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setVerificationPhotos(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPublicVideo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" /> Retour
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-center mb-2">Mettre une nouvelle pièce en vente</h1>
        <p className="text-center text-zinc-400 mb-12">Vous garderez <span className="font-semibold text-rose-400">75%</span> du prix de vente</p>

        {/* Progress */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full mx-2 ${step >= s ? 'bg-rose-500' : 'bg-zinc-800'}`} />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-semibold">1. Contenu Public (visible par les acheteurs)</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-12 text-center transition-colors cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handlePublicPhotos} className="hidden" id="public" />
                <label htmlFor="public" className="cursor-pointer">
                  <Camera className="w-14 h-14 mx-auto mb-4 text-zinc-400" />
                  <p className="text-lg font-medium">Photos du vêtement</p>
                  <p className="text-sm text-zinc-500 mt-1">Minimum 3 photos recommandées</p>
                </label>
              </div>

              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-12 text-center transition-colors cursor-pointer">
                <input type="file" accept="video/*" onChange={handleVideo} className="hidden" id="video" />
                <label htmlFor="video" className="cursor-pointer">
                  <Video className="w-14 h-14 mx-auto mb-4 text-zinc-400" />
                  <p className="text-lg font-medium">Vidéo (optionnelle)</p>
                </label>
              </div>
            </div>

            {publicPhotos.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {publicPhotos.map((img, i) => <img key={i} src={img} className="rounded-2xl aspect-square object-cover" />)}
              </div>
            )}

            <button onClick={() => setStep(2)} className="w-full py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 - Vérification Real Worn */}
        {step === 2 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-semibold">2. Vérification Real Worn (privée)</h2>
            <p className="text-zinc-400">Ces éléments permettent de garantir l’authenticité des pièces et de maintenir la confiance de nos acheteurs.</p>

            <div className="bg-zinc-900 rounded-3xl p-10">
              <label className="flex items-center gap-3 cursor-pointer mb-8 text-lg">
                <input 
                  type="checkbox" 
                  checked={noFace} 
                  onChange={(e) => setNoFace(e.target.checked)}
                  className="w-5 h-5 accent-rose-500"
                />
                <span>Je ne souhaite pas montrer mon visage</span>
              </label>

              {noFace && (
                <div className="mb-10 p-6 bg-zinc-800 border border-amber-400/30 rounded-2xl">
                  <p className="font-medium mb-4">Pour valider votre pièce sans visage, merci de fournir :</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
                    <li>Plusieurs angles du vêtement porté (face, dos, côtés, détails)</li>
                    <li>Une marque distinctive visible (tatouage, bijou, vernis à ongles, piercing, cicatrice…)</li>
                    <li>Une photo avec un papier indiquant clairement la date du jour</li>
                  </ul>
                  <p className="mt-6 text-amber-400 text-sm">
                    La vérification pourra prendre un peu plus de temps sans photo du visage, mais reste tout à fait possible.
                  </p>
                </div>
              )}

              <div className="border-2 border-dashed border-emerald-500/40 rounded-3xl p-12 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handleVerificationPhotos} className="hidden" id="verif" />
                <label htmlFor="verif" className="cursor-pointer">
                  <ShieldCheck className="w-14 h-14 mx-auto mb-4 text-emerald-400" />
                  <p className="text-lg font-medium">Ajouter les photos de vérification</p>
                  <p className="text-sm text-zinc-400 mt-2">Vous portant le vêtement (strictement confidentiel)</p>
                </label>
              </div>

              <div className="mt-8 text-sm text-zinc-400 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                <strong className="text-rose-400">Pourquoi cette vérification Real Worn est importante ?</strong><br />
                Elle permet à nos acheteurs d’avoir une confiance totale dans l’authenticité des pièces. C’est notre principal gage de qualité et ce qui différencie MyWornSkin.
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 border border-zinc-700 rounded-3xl font-medium">Retour</button>
              <button onClick={() => setStep(3)} className="flex-1 py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl font-semibold">Envoyer pour validation</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="text-center py-20">
            <CheckCircle className="w-28 h-28 text-green-400 mx-auto mb-10" />
            <h2 className="text-4xl font-bold mb-4">Merci ! Votre pièce est en cours de validation</h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Notre équipe vérifie les photos Real Worn pour garantir la qualité et l’authenticité.<br /><br />
              Vous serez notifié dès que l’annonce sera publiée.
            </p>
            <Link href="/shop" className="mt-12 inline-block px-12 py-5 bg-white text-black rounded-3xl font-semibold text-lg">
              Retour à la boutique
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
