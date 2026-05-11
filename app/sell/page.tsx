'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Camera, Video, Mic } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SellPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [noFace, setNoFace] = useState(false);

  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-16 pb-12">
      <main className="max-w-4xl mx-auto px-6">
        <Link href="/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 text-sm">
          ← Retour
        </Link>

        <h1 className="text-3xl font-bold text-center">Nouvelle pièce en vente</h1>
        <p className="text-center text-zinc-400 text-sm mt-1 mb-8">Vous garderez <span className="text-rose-400 font-semibold">75%</span> du prix</p>

        <div className="flex gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-rose-500' : 'bg-zinc-800'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8">
            {/* Catégorie + Titre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Type d'article</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-base">
                  <option value="">Choisir une catégorie</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Titre de la pièce</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Culotte en dentelle noire portée 2 jours..." 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-base" />
              </div>
            </div>

            {/* Photos + Vidéo - Même taille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photos publiques */}
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Photos publiques (min. 3)</label>
                <label className="border border-dashed border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 min-h-[200px]">
                  <Camera className="w-10 h-10 mb-3" />
                  <span className="text-sm">Ajouter des photos</span>
                  <input type="file" multiple accept="image/*" onChange={handlePublicPhotos} className="hidden" />
                </label>

                {publicPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {publicPhotos.map((p, i) => (
                      <img key={i} src={p} className="aspect-square object-cover rounded-xl" />
                    ))}
                  </div>
                )}
              </div>

              {/* Vidéo */}
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Vidéo (optionnelle)</label>
                <label className="border border-dashed border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 min-h-[200px]">
                  <Video className="w-10 h-10 mb-3" />
                  <span className="text-sm">Ajouter une vidéo</span>
                  <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
                </label>
                {publicVideo && <video src={publicVideo} controls className="mt-3 rounded-2xl w-full" />}
              </div>
            </div>

            {/* Description + Histoire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  placeholder="Portée 2 jours..." className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Histoire intime</label>
                <textarea value={story} onChange={e => setStory(e.target.value)} rows={3}
                  placeholder="Raconte l'histoire de cette pièce..." className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm" />
              </div>
            </div>

            {/* Message vocal */}
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Message vocal (optionnel)</label>
              <label className="border border-dashed border-zinc-700 rounded-3xl p-6 flex flex-col items-center cursor-pointer hover:border-rose-500">
                <Mic className="w-8 h-8 mb-2" />
                <span className="text-sm">Ajouter un message vocal</span>
                <input type="file" accept="audio/*" onChange={handleVoice} className="hidden" />
              </label>
            </div>

            {/* Tarification */}
            <div className="bg-zinc-900 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold">Tarification</h3>
                <p className="text-xs text-zinc-400">(en fonction du nombre de jours portés)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-800 rounded-2xl p-5 text-center">
                  <div className="text-rose-400 text-xs mb-2">1 journée</div>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-4">
                    <input type="number" value={price1Day} onChange={e => setPrice1Day(e.target.value)}
                      className="bg-transparent text-4xl font-bold w-20 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-4xl font-bold text-zinc-300 ml-1">€</span>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-5 text-center">
                  <label className="flex justify-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={offer2Days} onChange={e => setOffer2Days(e.target.checked)} className="accent-rose-500" />
                    <span className={`text-xs ${offer2Days ? 'text-rose-400' : 'text-zinc-400'}`}>2 journées</span>
                  </label>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-4">
                    <input type="number" value={price2Days} onChange={e => setPrice2Days(e.target.value)} disabled={!offer2Days}
                      className={`bg-transparent text-4xl font-bold w-20 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offer2Days ? 'opacity-40' : ''}`} />
                    <span className="text-4xl font-bold text-zinc-300 ml-1">€</span>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-5 text-center">
                  <label className="flex justify-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={offerExtraDay} onChange={e => setOfferExtraDay(e.target.checked)} className="accent-rose-500" />
                    <span className={`text-xs ${offerExtraDay ? 'text-rose-400' : 'text-zinc-400'}`}>Jour supp.</span>
                  </label>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-4">
                    <input type="number" value={extraDayPrice} onChange={e => setExtraDayPrice(e.target.value)} disabled={!offerExtraDay}
                      className={`bg-transparent text-4xl font-bold w-20 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offerExtraDay ? 'opacity-40' : ''}`} />
                    <span className="text-4xl font-bold text-zinc-300 ml-1">€</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold">
              Continuer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
