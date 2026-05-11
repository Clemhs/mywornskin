'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Camera, Video, ShieldCheck, CheckCircle, Mic } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SellPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [noFace, setNoFace] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [publicVideo, setPublicVideo] = useState<string>('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [voiceRecording, setVoiceRecording] = useState<string>('');

  // Tarification
  const [price1Day, setPrice1Day] = useState('45');
  const [offer2Days, setOffer2Days] = useState(false);
  const [price2Days, setPrice2Days] = useState('75');
  const [offerExtraDay, setOfferExtraDay] = useState(false);
  const [extraDayPrice, setExtraDayPrice] = useState('25');

  const categories = [
    "Culotte", "String", "Soutien-gorge", "Bas / Collants",
    "Robe", "Chemise / Haut", "Short / Jupe",
    "Chaussures", "Talons", "Semelles", "Autre"
  ];

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

  const handleVoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setVoiceRecording(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // ... (logique d'envoi Supabase inchangée, tu peux la remettre si besoin)
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <main className="max-w-4xl mx-auto px-6 pb-12">
        <Link href="/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5" /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-center mb-1">Nouvelle pièce en vente</h1>
        <p className="text-center text-zinc-400 mb-10">Vous garderez <span className="font-semibold text-rose-400">75%</span> du prix</p>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-rose-500' : 'bg-zinc-800'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-10">
            {/* Catégorie */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Type d'article</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-lg">
                <option value="">Choisir une catégorie</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Titre de la pièce</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Culotte en dentelle noire portée 2 jours..." 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-lg" />
            </div>

            {/* Photos publiques */}
            <div>
              <label className="block text-sm text-zinc-400 mb-3">Photos publiques (minimum 3 recommandées)</label>
              <div className="grid grid-cols-5 gap-3">
                {publicPhotos.map((photo, i) => (
                  <img key={i} src={photo} className="aspect-square object-cover rounded-2xl" />
                ))}
                <label className="aspect-square border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 transition">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-xs">Ajouter</span>
                  <input type="file" multiple accept="image/*" onChange={handlePublicPhotos} className="hidden" />
                </label>
              </div>
            </div>

            {/* Vidéo optionnelle */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Vidéo (optionnelle)</label>
              <label className="block border border-dashed border-zinc-700 rounded-2xl p-8 text-center cursor-pointer hover:border-rose-500">
                <Video className="w-10 h-10 mx-auto mb-3" />
                <span>Ajouter une vidéo</span>
                <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Portée 2 jours..." rows={3}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4" />
            </div>

            {/* Histoire intime */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Histoire intime</label>
              <textarea value={story} onChange={(e) => setStory(e.target.value)}
                placeholder="Raconte l'histoire de cette pièce..." rows={4}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4" />
            </div>

            {/* Message vocal */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Message vocal (optionnel)</label>
              <label className="border border-dashed border-zinc-700 rounded-2xl p-8 flex flex-col items-center cursor-pointer hover:border-rose-500">
                <Mic className="w-10 h-10 mb-3" />
                <span>Ajouter un message vocal</span>
                <input type="file" accept="audio/*" onChange={handleVoice} className="hidden" />
              </label>
            </div>

            {/* TARIFICATION */}
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl">Tarification</h3>
                <p className="text-sm text-zinc-400">(prix demandés en fonction du nombre de jours portés)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1 journée */}
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <div className="text-rose-400 text-sm mb-3">1 journée</div>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-6">
                    <input
                      type="number"
                      value={price1Day}
                      onChange={(e) => setPrice1Day(e.target.value)}
                      className="bg-transparent text-5xl font-bold w-28 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-5xl font-bold text-zinc-300 ml-2">€</span>
                  </div>
                </div>

                {/* 2 journées */}
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <label className="flex items-center justify-center gap-2 mb-3 cursor-pointer">
                    <input type="checkbox" checked={offer2Days} onChange={e => setOffer2Days(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                    <span className={`text-sm ${offer2Days ? 'text-rose-400' : 'text-zinc-400'}`}>2 journées</span>
                  </label>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-6">
                    <input
                      type="number"
                      value={price2Days}
                      onChange={(e) => setPrice2Days(e.target.value)}
                      disabled={!offer2Days}
                      className={`bg-transparent text-5xl font-bold w-28 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offer2Days ? 'opacity-40' : ''}`}
                    />
                    <span className="text-5xl font-bold text-zinc-300 ml-2">€</span>
                  </div>
                </div>

                {/* Jour supp. */}
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <label className="flex items-center justify-center gap-2 mb-3 cursor-pointer">
                    <input type="checkbox" checked={offerExtraDay} onChange={e => setOfferExtraDay(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                    <span className={`text-sm ${offerExtraDay ? 'text-rose-400' : 'text-zinc-400'}`}>Jour supp.</span>
                  </label>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-6">
                    <input
                      type="number"
                      value={extraDayPrice}
                      onChange={(e) => setExtraDayPrice(e.target.value)}
                      disabled={!offerExtraDay}
                      className={`bg-transparent text-5xl font-bold w-28 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offerExtraDay ? 'opacity-40' : ''}`}
                    />
                    <span className="text-5xl font-bold text-zinc-300 ml-2">€</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl text-xl font-semibold">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 et Step 3 à remettre si besoin (dis-le moi) */}
      </main>
    </div>
  );
}
