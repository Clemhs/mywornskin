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
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3.5 text-white">
                <option value="">Choisir un type...</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Titre de la pièce *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3.5" placeholder="Culotte en dentelle noire" />
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
                {publicPhotos.map((img, i) => <img key={i} src={img} className="rounded-2xl aspect-square object-cover border border-zinc-700" />)}
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

            {/* TARIFICATION CORRIGÉE */}
            <div className="bg-zinc-900 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Tarification</h3>
                <p className="text-sm text-zinc-400">(prix demandés en fonction du nombre de jours portés)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1 journée */}
                <div className="bg-zinc-800 rounded-2xl p-5">
                  <div className="text-rose-400 text-sm mb-2">1 journée</div>
                  <div className="flex items-center bg-zinc-900 rounded-xl px-5 py-4">
                    <input type="number" value={price1Day} onChange={(e) => setPrice1Day(e.target.value)} className="flex-1 bg-transparent text-2xl font-semibold focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="45" />
                    <span className="text-zinc-400 ml-2 font-medium">€</span>
                  </div>
                </div>

                {/* 2 journées */}
                <div className="bg-zinc-800 rounded-2xl p-5">
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={offer2Days} onChange={(e) => setOffer2Days(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                    <span className={`text-sm ${offer2Days ? 'text-rose-400' : 'text-zinc-400'}`}>2 journées</span>
                  </label>
                  <div className="flex items-center bg-zinc-900 rounded-xl px-5 py-4">
                    <input type="number" value={price2Days} onChange={(e) => setPrice2Days(e.target.value)} disabled={!offer2Days} className={`flex-1 bg-transparent text-2xl font-semibold focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offer2Days ? 'opacity-40' : ''}`} placeholder="75" />
                    <span className="text-zinc-400 ml-2 font-medium">€</span>
                  </div>
                </div>

                {/* Jour supplémentaire */}
                <div className="bg-zinc-800 rounded-2xl p-5">
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={offerExtraDay} onChange={(e) => setOfferExtraDay(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                    <span className={`text-sm ${offerExtraDay ? 'text-rose-400' : 'text-zinc-400'}`}>Jour supp.</span>
                  </label>
                  <div className="flex items-center bg-zinc-900 rounded-xl px-5 py-4">
                    <input type="number" value={extraDayPrice} onChange={(e) => setExtraDayPrice(e.target.value)} disabled={!offerExtraDay} className={`flex-1 bg-transparent text-2xl font-semibold focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!offerExtraDay ? 'opacity-40' : ''}`} placeholder="25" />
                    <span className="text-zinc-400 ml-2 font-medium">€</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 et Step 3 (gardés pour que tu aies tout) */}
        {step === 2 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-semibold">2. Vérification Real Worn (privée)</h2>
            <p className="text-zinc-400">Ces éléments permettent de garantir l’authenticité des pièces.</p>

            <div className="bg-zinc-900 rounded-3xl p-10">
              <label className="flex items-center gap-3 cursor-pointer mb-8 text-lg">
                <input type="checkbox" checked={noFace} onChange={(e) => setNoFace(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                <span>Je ne souhaite pas montrer mon visage</span>
              </label>

              {noFace && (
                <div className="mb-10 p-6 bg-zinc-800 border border-amber-400/30 rounded-2xl">
                  <p className="font-medium mb-4">Pour valider sans visage :</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
                    <li>Plusieurs angles du vêtement porté</li>
                    <li>Une marque distinctive visible</li>
                    <li>Une photo avec la date du jour</li>
                  </ul>
                </div>
              )}

              <div className="border-2 border-dashed border-emerald-500/40 rounded-3xl p-12 text-center hover:border-emerald-400 transition-colors cursor-pointer mb-8">
                <input type="file" multiple accept="image/*" onChange={handleVerificationPhotos} className="hidden" id="verif" />
                <label htmlFor="verif" className="cursor-pointer">
                  <ShieldCheck className="w-14 h-14 mx-auto mb-4 text-emerald-400" />
                  <p className="text-lg font-medium">Ajouter les photos de vérification</p>
                  <p className="text-sm text-zinc-400 mt-2">Vous portant le vêtement visage visible (strictement confidentiel)</p>
                </label>
              </div>

              {verificationPhotos.length > 0 && (
                <div className="mt-6">
                  <p className="text-emerald-400 text-sm mb-3">Photos de vérification ajoutées ({verificationPhotos.length}) :</p>
                  <div className="grid grid-cols-4 gap-4">
                    {verificationPhotos.map((img, i) => <img key={i} src={img} className="rounded-2xl aspect-square object-cover border border-emerald-500/30" />)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 border border-zinc-700 rounded-3xl font-medium">Retour</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl font-semibold disabled:opacity-70">
                {isSubmitting ? "Envoi en cours..." : "Envoyer pour validation"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-20">
            <CheckCircle className="w-28 h-28 text-green-400 mx-auto mb-10" />
            <h2 className="text-4xl font-bold mb-4">Merci ! Votre pièce est en cours de validation</h2>
            <p className="text-zinc-400">Vous serez notifié dès que l’annonce sera publiée.</p>
            <Link href="/creators/me" className="mt-12 inline-block px-12 py-5 bg-white text-black rounded-3xl font-semibold text-lg">
              Retour à mon profil
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
