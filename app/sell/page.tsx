'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Camera, Video, ShieldCheck, CheckCircle, Loader2, Mic } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SellPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [noFace, setNoFace] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [publicVideo, setPublicVideo] = useState<string>('');

  // Champs texte
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [voiceRecording, setVoiceRecording] = useState<string>('');

  // Tarification avec activation
  const [price1Day, setPrice1Day] = useState('');
  const [offer2Days, setOffer2Days] = useState(false);
  const [price2Days, setPrice2Days] = useState('');
  const [offer3Days, setOffer3Days] = useState(false);
  const [price3Days, setPrice3Days] = useState('');
  const [offerExtraDay, setOfferExtraDay] = useState(false);
  const [extraDayPrice, setExtraDayPrice] = useState('');

  const handlePublicPhotos = (e: React.ChangeEvent<HTMLInputElement>) => { /* même code */ };
  const handleVerificationPhotos = (e: React.ChangeEvent<HTMLInputElement>) => { /* même code */ };
  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => { /* même code */ };
  const handleVoiceRecording = (e: React.ChangeEvent<HTMLInputElement>) => { /* même code */ };

  const handleSubmit = async () => { /* même code que précédemment, avec les nouveaux champs */ };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <main className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" /> Retour
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-1">Nouvelle pièce en vente</h1>
        <p className="text-center text-zinc-400 mb-8">Vous garderez <span className="font-semibold text-rose-400">75%</span> du prix</p>

        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full mx-1 ${step >= s ? 'bg-rose-500' : 'bg-zinc-800'}`} />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Titre de la pièce *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="Culotte en dentelle noire" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-6 text-center cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handlePublicPhotos} className="hidden" id="public" />
                <label htmlFor="public" className="cursor-pointer">
                  <Camera className="w-10 h-10 mx-auto mb-2 text-zinc-400" />
                  <p className="text-base">Photos</p>
                </label>
              </div>
              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-6 text-center cursor-pointer">
                <input type="file" accept="video/*" onChange={handleVideo} className="hidden" id="video" />
                <label htmlFor="video" className="cursor-pointer">
                  <Video className="w-10 h-10 mx-auto mb-2 text-zinc-400" />
                  <p className="text-base">Vidéo</p>
                </label>
              </div>
            </div>

            {publicPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {publicPhotos.map((img, i) => <img key={i} src={img} className="rounded-2xl aspect-square object-cover" />)}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="Portée 2 jours..." />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Histoire intime</label>
              <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={4} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="Raconte l'histoire de cette pièce..." />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Message vocal (optionnel)</label>
              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-6 text-center">
                <input type="file" accept="audio/*" onChange={handleVoiceRecording} className="hidden" id="voice" />
                <label htmlFor="voice" className="cursor-pointer">
                  <Mic className="w-9 h-9 mx-auto mb-2 text-zinc-400" />
                  <p className="text-sm">Ajouter un message vocal</p>
                </label>
              </div>
              {voiceRecording && <p className="text-emerald-400 text-center text-sm mt-2">✅ Vocal ajouté</p>}
            </div>

            {/* Tarification compacte */}
            <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
              <h3 className="font-semibold">Tarification</h3>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <input type="number" value={price1Day} onChange={(e) => setPrice1Day(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-2xl" placeholder="45" />
                  <span className="text-xl text-zinc-400">€ pour 1 journée</span>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={offer2Days} onChange={(e) => setOffer2Days(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                  <input type="number" value={price2Days} onChange={(e) => setPrice2Days(e.target.value)} disabled={!offer2Days} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3" placeholder="75" />
                  <span className="text-zinc-400">€ pour 2 journées</span>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={offer3Days} onChange={(e) => setOffer3Days(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                  <input type="number" value={price3Days} onChange={(e) => setPrice3Days(e.target.value)} disabled={!offer3Days} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3" placeholder="100" />
                  <span className="text-zinc-400">€ pour 3 journées</span>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={offerExtraDay} onChange={(e) => setOfferExtraDay(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                  <input type="number" value={extraDayPrice} onChange={(e) => setExtraDayPrice(e.target.value)} disabled={!offerExtraDay} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3" placeholder="25" />
                  <span className="text-zinc-400">€ par journée supplémentaire</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 et Step 3 restent identiques à la version précédente (je peux te les remettre si besoin) */}
      </main>
    </div>
  );
}
