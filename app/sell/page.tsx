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

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [voiceRecording, setVoiceRecording] = useState<string>('');

  // Tarification
  const [price1Day, setPrice1Day] = useState('');
  const [offer2Days, setOffer2Days] = useState(false);
  const [price2Days, setPrice2Days] = useState('');
  const [offerExtraDay, setOfferExtraDay] = useState(false);
  const [extraDayPrice, setExtraDayPrice] = useState('');

  const categories = [
    "Culotte", "String", "Soutien-gorge", "Bas / Collants",
    "Robe", "Chemise / Haut", "Short / Jupe",
    "Chaussures", "Talons", "Semelles", "Autre"
  ];

  // ... (les fonctions handlePhotos, handleVideo, handleVoiceRecording restent identiques)

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

  const handleVoiceRecording = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setVoiceRecording(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => { /* identique à la version précédente */ };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <main className="max-w-4xl mx-auto px-6 pb-12">
        {/* ... Header et progress identiques ... */}

        {step === 1 && (
          <div className="space-y-8">
            {/* Type, Titre, Photos, Description, Histoire, Vocal (identiques) */}

            {/* === TARIFICATION REVOYÉE === */}
            <div className="bg-zinc-900 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">Tarification</h3>
                <p className="text-sm text-zinc-400">(en fonction du nombre de jours portés)</p>
              </div>

              <div className="space-y-4">
                {/* 1 journée - obligatoire */}
                <div className="flex items-center gap-4 bg-zinc-800 rounded-2xl px-5 py-4">
                  <div className="font-medium text-rose-400 w-20">1 journée</div>
                  <input 
                    type="number" 
                    value={price1Day} 
                    onChange={(e) => setPrice1Day(e.target.value)} 
                    className="flex-1 bg-transparent text-2xl font-semibold focus:outline-none" 
                    placeholder="45" 
                  />
                  <span className="text-zinc-400">€</span>
                </div>

                {/* 2 journées */}
                <div className="flex items-center gap-4 bg-zinc-800 rounded-2xl px-5 py-4">
                  <input 
                    type="checkbox" 
                    checked={offer2Days} 
                    onChange={(e) => setOffer2Days(e.target.checked)} 
                    className="w-5 h-5 accent-rose-500" 
                  />
                  <div className="font-medium text-zinc-400 w-20">2 journées</div>
                  <input 
                    type="number" 
                    value={price2Days} 
                    onChange={(e) => setPrice2Days(e.target.value)} 
                    disabled={!offer2Days}
                    className={`flex-1 bg-transparent text-xl transition-all ${offer2Days ? '' : 'opacity-40'}`} 
                    placeholder="75" 
                  />
                  <span className="text-zinc-400">€</span>
                </div>

                {/* Journée supplémentaire */}
                <div className="flex items-center gap-4 bg-zinc-800 rounded-2xl px-5 py-4">
                  <input 
                    type="checkbox" 
                    checked={offerExtraDay} 
                    onChange={(e) => setOfferExtraDay(e.target.checked)} 
                    className="w-5 h-5 accent-rose-500" 
                  />
                  <div className="font-medium text-zinc-400 w-32">Jour supp.</div>
                  <input 
                    type="number" 
                    value={extraDayPrice} 
                    onChange={(e) => setExtraDayPrice(e.target.value)} 
                    disabled={!offerExtraDay}
                    className={`flex-1 bg-transparent text-xl transition-all ${offerExtraDay ? '' : 'opacity-40'}`} 
                    placeholder="25" 
                  />
                  <span className="text-zinc-400">€ par jour</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 et Step 3 identiques */}
      </main>
    </div>
  );
}
