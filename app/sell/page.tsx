'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Camera, Video, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SellPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [noFace, setNoFace] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);     // URLs temporaires (preview)
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [publicVideo, setPublicVideo] = useState<string>('');

  // Tarification
  const [price1Day, setPrice1Day] = useState('');
  const [price2Days, setPrice2Days] = useState('');
  const [price3Days, setPrice3Days] = useState('');
  const [extraDayPrice, setExtraDayPrice] = useState('');

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

  const handleSubmit = async () => {
    if (!user) return alert("Vous devez être connecté");
    if (publicPhotos.length === 0) return alert("Ajoutez au moins une photo publique");
    if (!price1Day) return alert("Veuillez indiquer le prix pour 1 journée");

    setIsSubmitting(true);

    try {
      // 1. Upload photos publiques
      const publicImageUrls: string[] = [];
      for (let i = 0; i < publicPhotos.length; i++) {
        const response = await fetch(publicPhotos[i]);
        const blob = await response.blob();
        const fileName = `${user.id}-public-${Date.now()}-${i}.jpg`;

        const { error } = await supabase.storage.from('products').upload(fileName, blob);
        if (error) throw error;

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
        publicImageUrls.push(urlData.publicUrl);
      }

      // 2. Upload photos vérification
      const verifImageUrls: string[] = [];
      for (let i = 0; i < verificationPhotos.length; i++) {
        const response = await fetch(verificationPhotos[i]);
        const blob = await response.blob();
        const fileName = `${user.id}-verif-${Date.now()}-${i}.jpg`;

        const { error } = await supabase.storage.from('products').upload(fileName, blob);
        if (error) throw error;

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
        verifImageUrls.push(urlData.publicUrl);
      }

      // 3. Création du produit
      const { error: insertError } = await supabase.from('products').insert({
        creator_id: user.id,
        title: "Nouvelle pièce en vente", // À améliorer plus tard avec un champ titre
        price_1day: parseInt(price1Day),
        price_2days: price2Days ? parseInt(price2Days) : null,
        price_3days: price3Days ? parseInt(price3Days) : null,
        extra_day_price: extraDayPrice ? parseInt(extraDayPrice) : null,
        images: publicImageUrls,
        verification_images: verifImageUrls,
        video_url: publicVideo || null,
        status: 'pending',
        no_face: noFace,
        description: null,
      });

      if (insertError) throw insertError;

      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de l'envoi : " + (err.message || "Veuillez réessayer"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" /> Retour
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-center mb-2">Mettre une nouvelle pièce en vente</h1>
        <p className="text-center text-zinc-400 mb-12">Vous garderez <span className="font-semibold text-rose-400">75%</span> du prix de vente</p>

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

            {/* Tarification */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Tarification de la pièce</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Prix pour <span className="text-rose-400">1 journée</span></label>
                  <div className="relative">
                    <input type="number" value={price1Day} onChange={(e) => setPrice1Day(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-5 text-3xl font-semibold focus:border-rose-500" placeholder="45" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl text-zinc-400">€</span>
                  </div>
                </div>
                {/* Les autres champs prix restent identiques */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Prix pour <span className="text-rose-400">2 journées</span></label>
                  <div className="relative">
                    <input type="number" value={price2Days} onChange={(e) => setPrice2Days(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-5 text-3xl font-semibold focus:border-rose-500" placeholder="75" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl text-zinc-400">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Prix pour <span className="text-rose-400">3 journées</span></label>
                  <div className="relative">
                    <input type="number" value={price3Days} onChange={(e) => setPrice3Days(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-5 text-3xl font-semibold focus:border-rose-500" placeholder="100" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl text-zinc-400">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Majoration par journée supplémentaire</label>
                  <div className="relative">
                    <input type="number" value={extraDayPrice} onChange={(e) => setExtraDayPrice(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-5 text-3xl font-semibold focus:border-rose-500" placeholder="25" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl text-zinc-400">€</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-semibold mt-8">
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-semibold">2. Vérification Real Worn (privée)</h2>
            <p className="text-zinc-400">Ces éléments permettent de garantir l’authenticité des pièces et de maintenir la confiance de nos acheteurs.</p>

            <div className="bg-zinc-900 rounded-3xl p-10">
              <label className="flex items-center gap-3 cursor-pointer mb-8 text-lg">
                <input type="checkbox" checked={noFace} onChange={(e) => setNoFace(e.target.checked)} className="w-5 h-5 accent-rose-500" />
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
                    {verificationPhotos.map((img, i) => (
                      <img key={i} src={img} className="rounded-2xl aspect-square object-cover border border-emerald-500/30" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 border border-zinc-700 rounded-3xl font-medium">Retour</button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1 py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isSubmitting ? "Envoi en cours..." : "Envoyer pour validation"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Succès */}
        {step === 3 && (
          <div className="text-center py-20">
            <CheckCircle className="w-28 h-28 text-green-400 mx-auto mb-10" />
            <h2 className="text-4xl font-bold mb-4">Merci ! Votre pièce est en cours de validation</h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Notre équipe vérifie les photos Real Worn pour garantir la qualité et l’authenticité.<br /><br />
              Vous serez notifié dès que l’annonce sera publiée.
            </p>
            <Link href="/creators/me" className="mt-12 inline-block px-12 py-5 bg-white text-black rounded-3xl font-semibold text-lg">
              Retour à mon profil
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
