'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Camera, Video, ShieldCheck, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SellPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [noFace, setNoFace] = useState(false);

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

  const categories = ["Culotte", "String", "Soutien-gorge", "Bas / Collants", "Robe", "Chemise / Haut", "Short / Jupe", "Chaussures", "Talons", "Semelles", "Autre"];

  // ... (tes fonctions handlePublicPhotos, handleVerificationPhotos, etc. restent identiques)

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <main className="max-w-4xl mx-auto px-6 pb-12">
        {/* En-tête et progression (inchangés) */}

        {step === 1 && (
          <div className="space-y-10">
            {/* Catégorie, Titre, Photos, Description, Histoire, Vocal (inchangés) */}

            {/* === TARIFICATION CORRIGÉE === */}
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl">Tarification</h3>
                <p className="text-sm text-zinc-400">(prix demandés en fonction du nombre de jours portés)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1 journée */}
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <div className="text-rose-400 text-sm mb-3">1 journée</div>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-5">
                    <input
                      type="number"
                      value={price1Day}
                      onChange={(e) => setPrice1Day(e.target.value)}
                      className="bg-transparent text-4xl font-bold w-24 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-4xl font-bold text-zinc-300 ml-1">€</span>
                  </div>
                </div>

                {/* 2 journées */}
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <label className="flex items-center justify-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offer2Days}
                      onChange={(e) => setOffer2Days(e.target.checked)}
                      className="w-5 h-5 accent-rose-500"
                    />
                    <span className={`text-sm ${offer2Days ? 'text-rose-400' : 'text-zinc-400'}`}>2 journées</span>
                  </label>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-5">
                    <input
                      type="number"
                      value={price2Days}
                      onChange={(e) => setPrice2Days(e.target.value)}
                      disabled={!offer2Days}
                      className={`bg-transparent text-4xl font-bold w-24 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offer2Days ? 'opacity-40' : ''}`}
                    />
                    <span className="text-4xl font-bold text-zinc-300 ml-1">€</span>
                  </div>
                </div>

                {/* Jour supp. */}
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <label className="flex items-center justify-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offerExtraDay}
                      onChange={(e) => setOfferExtraDay(e.target.checked)}
                      className="w-5 h-5 accent-rose-500"
                    />
                    <span className={`text-sm ${offerExtraDay ? 'text-rose-400' : 'text-zinc-400'}`}>Jour supp.</span>
                  </label>
                  <div className="flex items-center justify-center bg-zinc-900 rounded-xl py-5">
                    <input
                      type="number"
                      value={extraDayPrice}
                      onChange={(e) => setExtraDayPrice(e.target.value)}
                      disabled={!offerExtraDay}
                      className={`bg-transparent text-4xl font-bold w-24 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offerExtraDay ? 'opacity-40' : ''}`}
                    />
                    <span className="text-4xl font-bold text-zinc-300 ml-1">€</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl text-xl font-semibold"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 et Step 3 restent inchangés */}
      </main>
    </div>
  );
}
