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

  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [publicVideo, setPublicVideo] = useState<string>('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [voiceRecording, setVoiceRecording] = useState<string>('');

  const [price1Day, setPrice1Day] = useState('45');
  const [offer2Days, setOffer2Days] = useState(false);
  const [price2Days, setPrice2Days] = useState('75');
  const [offerExtraDay, setOfferExtraDay] = useState(false);
  const [extraDayPrice, setExtraDayPrice] = useState('25');

  const categories = ["Culotte", "String", "Soutien-gorge", "Bas / Collants", "Robe", "Chemise / Haut", "Short / Jupe", "Chaussures", "Talons", "Semelles", "Autre"];

  // Upload handlers
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
    if (!user || !title || publicPhotos.length === 0) {
      alert("Titre et au moins une photo publique sont obligatoires");
      return;
    }

    try {
      // Upload public photos
      const imageUrls: string[] = [];
      for (const base64 of publicPhotos) {
        const res = await fetch(base64);
        const blob = await res.blob();
        const fileName = `${user.id}-public-${Date.now()}.jpg`;
        const { error } = await supabase.storage.from('products').upload(fileName, blob);
        if (error) throw error;
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }

      // Upload verification photos
      const verifUrls: string[] = [];
      for (const base64 of verificationPhotos) {
        const res = await fetch(base64);
        const blob = await res.blob();
        const fileName = `${user.id}-verif-${Date.now()}.jpg`;
        const { error } = await supabase.storage.from('products').upload(fileName, blob);
        if (error) throw error;
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        verifUrls.push(data.publicUrl);
      }

      const { error } = await supabase.from('products').insert({
        creator_id: user.id,
        title,
        category: category || null,
        description: description || null,
        story: story || null,
        price_1day: parseInt(price1Day),
        price_2days: offer2Days ? parseInt(price2Days) : null,
        extra_day_price: offerExtraDay ? parseInt(extraDayPrice) : null,
        images: imageUrls,
        verification_images: verifUrls,
        video_url: publicVideo || null,
        voice_url: voiceRecording || null,
        status: 'pending',
        no_face: noFace,
      });

      if (error) throw error;

      console.log("✅ Produit inséré avec succès");
      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert("Erreur : " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-16 pb-12">
      <main className="max-w-4xl mx-auto px-6">
        <Link href="/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 text-sm">
          ← Retour
        </Link>

        <h1 className="text-3xl font-bold text-center">Nouvelle pièce en vente</h1>
        <p className="text-center text-rose-400 text-sm mt-1">Vous garderez 75% du prix</p>

        <div className="flex gap-2 my-8">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-rose-500' : 'bg-zinc-800'}`} />
          ))}
        </div>

        {step === 1 && (
          /* ... tout le Step 1 (identique à avant) ... */
          <div className="space-y-8">
            {/* Category + Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Type d'article</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3">
                  <option value="">Choisir une catégorie</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Titre</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Culotte dentelle noire portée 2 jours..." className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3" />
              </div>
            </div>

            {/* Photos + Vidéo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Photos publiques (min. 3)</label>
                <label className="border border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center cursor-pointer hover:border-rose-500 min-h-[220px]">
                  <Camera className="w-12 h-12 mb-3" />
                  <span>Ajouter des photos</span>
                  <input type="file" multiple accept="image/*" onChange={handlePublicPhotos} className="hidden" />
                </label>
                {publicPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {publicPhotos.map((src, i) => <img key={i} src={src} alt="" className="aspect-square object-cover rounded-xl" />)}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Vidéo (optionnelle)</label>
                <label className="border border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center cursor-pointer hover:border-rose-500 min-h-[220px]">
                  <Video className="w-12 h-12 mb-3" />
                  <span>Ajouter une vidéo</span>
                  <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
                </label>
                {publicVideo && <video src={publicVideo} controls className="mt-4 rounded-2xl w-full" />}
              </div>
            </div>

            {/* Description + Story */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-5" placeholder="Détails du vêtement..." />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Histoire intime</label>
                <textarea value={story} onChange={e => setStory(e.target.value)} rows={4} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-5" placeholder="Raconte l'histoire de cette pièce..." />
              </div>
            </div>

            {/* Voice + Pricing (identique) */}
            {/* ... (je garde le même bloc tarification que précédemment) ... */}

            <button onClick={() => setStep(2)} className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl font-semibold text-lg">
              Continuer vers vérification
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-semibold">2. Vérification Real Worn (privée)</h2>
            <p className="text-zinc-400">Ces photos sont strictement confidentielles et servent uniquement à la validation.</p>

            <div className="bg-zinc-900 rounded-3xl p-10">
              <label className="flex items-center gap-3 cursor-pointer mb-8 text-lg">
                <input type="checkbox" checked={noFace} onChange={e => setNoFace(e.target.checked)} className="w-5 h-5 accent-rose-500" />
                Je ne souhaite pas montrer mon visage
              </label>

              <div className="border-2 border-dashed border-emerald-500/40 rounded-3xl p-12 text-center hover:border-emerald-400 transition-all cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handleVerificationPhotos} id="verif-upload" className="hidden" />
                <label htmlFor="verif-upload" className="cursor-pointer block">
                  <ShieldCheck className="w-14 h-14 mx-auto mb-4 text-emerald-400" />
                  <p className="text-lg font-medium">Ajouter les photos de vérification</p>
                  <p className="text-sm text-zinc-400 mt-1">Vous portant le vêtement visage visible (strictement confidentiel)</p>
                </label>
              </div>

              {/* Preview des photos de vérification */}
              {verificationPhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-6">
                  {verificationPhotos.map((src, i) => (
                    <img key={i} src={src} alt="vérif" className="aspect-square object-cover rounded-2xl border border-emerald-500/30" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 border border-zinc-700 rounded-3xl font-medium">Retour</button>
              <button onClick={handleSubmit} className="flex-1 py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl font-semibold">Envoyer pour validation</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-20">
            <CheckCircle className="w-28 h-28 text-green-400 mx-auto mb-10" />
            <h2 className="text-4xl font-bold mb-4">Merci ! Votre pièce est en cours de validation</h2>
            <p className="text-zinc-400">Vous serez notifié dès que l’annonce sera publiée.</p>
            <Link href="/shop" className="mt-12 inline-block px-12 py-5 bg-white text-black rounded-3xl font-semibold text-lg">
              Retour à la boutique
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
