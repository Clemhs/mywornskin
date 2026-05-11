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

  // Nouveaux champs
  const [category, setCategory] = useState('');
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

  const categories = [
    "Culotte", "String", "Soutien-gorge", "Bas / Collants",
    "Bodystocking", "Robe", "Chemise / Haut", "Short / Jupe",
    "Autre"
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

  const handleVoiceRecording = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setVoiceRecording(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) return alert("Vous devez être connecté");
    if (!title) return alert("Le titre est obligatoire");
    if (publicPhotos.length === 0) return alert("Ajoutez au moins une photo publique");
    if (!price1Day) return alert("Veuillez indiquer le prix pour 1 journée");

    setIsSubmitting(true);

    try {
      // Uploads + insert (identique à la version précédente)
      const publicImageUrls: string[] = [];
      for (let i = 0; i < publicPhotos.length; i++) {
        const response = await fetch(publicPhotos[i]);
        const blob = await response.blob();
        const fileName = `${user.id}-public-${Date.now()}-${i}.jpg`;
        await supabase.storage.from('products').upload(fileName, blob);
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        publicImageUrls.push(publicUrl);
      }

      const verifImageUrls: string[] = [];
      for (let i = 0; i < verificationPhotos.length; i++) {
        const response = await fetch(verificationPhotos[i]);
        const blob = await response.blob();
        const fileName = `${user.id}-verif-${Date.now()}-${i}.jpg`;
        await supabase.storage.from('products').upload(fileName, blob);
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        verifImageUrls.push(publicUrl);
      }

      const { error } = await supabase.from('products').insert({
        creator_id: user.id,
        category: category || null,
        title,
        description: description || null,
        story: story || null,
        price_1day: parseInt(price1Day),
        price_2days: offer2Days && price2Days ? parseInt(price2Days) : null,
        price_3days: offer3Days && price3Days ? parseInt(price3Days) : null,
        extra_day_price: offerExtraDay && extraDayPrice ? parseInt(extraDayPrice) : null,
        images: publicImageUrls,
        verification_images: verifImageUrls,
        video_url: publicVideo || null,
        voice_url: voiceRecording || null,
        status: 'pending',
        no_face: noFace,
      });

      if (error) throw error;
      setStep(3);
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {step === 1 && (
          <div className="space-y-8">
            {/* Type d'article */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Type d'article</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white"
              >
                <option value="">Choisir un type...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Titre de la pièce *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="Culotte en dentelle noire" />
            </div>

            {/* Photos + Vidéo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-8 text-center cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handlePublicPhotos} className="hidden" id="public" />
                <label htmlFor="public" className="cursor-pointer">
                  <Camera className="w-10 h-10 mx-auto mb-2 text-zinc-400" />
                  <p className="text-base font-medium">Photos</p>
                </label>
              </div>
              <div className="border-2 border-dashed border-zinc-700 hover:border-rose-400 rounded-3xl p-8 text-center cursor-pointer">
                <input type="file" accept="video/*" onChange={handleVideo} className="hidden" id="video" />
                <label htmlFor="video" className="cursor-pointer">
                  <Video className="w-10 h-10 mx-auto mb-2 text-zinc-400" />
                  <p className="text-base font-medium">Vidéo</p>
                </label>
              </div>
            </div>

            {publicPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {publicPhotos.map((img, i) => (
                  <img key={i} src={img} className="rounded-2xl aspect-square object-cover border border-zinc-700" />
                ))}
              </div>
            )}

            {/* Description + Histoire + Vocal */}
            <div className="space-y-6">
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
            </div>

            {/* Tarification compacte */}
            <div className="bg-zinc-900 rounded-3xl p-6">
              <h3 className="font-semibold mb-5">Tarification</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input type="number" value={price1Day} onChange={(e) => setPrice1Day(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-xl" placeholder="45" />
                  <span className="text-zinc-400 whitespace-nowrap">€ pour 1 journée</span>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={offer2Days} onChange={(e) => setOffer2Days(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                  <input type="number" value={price2Days} onChange={(e) => setPrice2Days(e.target.value)} disabled={!offer2Days} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-xl" placeholder="75" />
                  <span className="text-zinc-400 whitespace-nowrap">€ pour 2 journées</span>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={offer3Days} onChange={(e) => setOffer3Days(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                  <input type="number" value={price3Days} onChange={(e) => setPrice3Days(e.target.value)} disabled={!offer3Days} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-xl" placeholder="100" />
                  <span className="text-zinc-400 whitespace-nowrap">€ pour 3 journées</span>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={offerExtraDay} onChange={(e) => setOfferExtraDay(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                  <input type="number" value={extraDayPrice} onChange={(e) => setExtraDayPrice(e.target.value)} disabled={!offerExtraDay} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-xl" placeholder="25" />
                  <span className="text-zinc-400 whitespace-nowrap">€ par journée supp.</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 et Step 3 restent identiques à la version précédente (je te les remets si besoin) */}
      </main>
    </div>
  );
}
