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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [publicPhotos, setPublicPhotos] = useState<string[]>([]);
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [publicVideo, setPublicVideo] = useState<string>('');

  // Tarification
  const [price1Day, setPrice1Day] = useState('');
  const [price2Days, setPrice2Days] = useState('');
  const [price3Days, setPrice3Days] = useState('');
  const [extraDayPrice, setExtraDayPrice] = useState('');

  // ... (handlePublicPhotos, handleVerificationPhotos, handleVideo restent identiques)

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

  // === SOUMISSION VERS SUPABASE ===
  const handleSubmit = async () => {
    if (!user) return alert("Vous devez être connecté");
    if (publicPhotos.length === 0) return alert("Ajoutez au moins une photo publique");

    setIsSubmitting(true);

    try {
      // Upload des photos publiques
      const publicUrls: string[] = [];
      for (let i = 0; i < publicPhotos.length; i++) {
        const file = await fetch(publicPhotos[i]).then(r => r.blob());
        const fileExt = 'jpg';
        const fileName = `${user.id}-public-${Date.now()}-${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        publicUrls.push(publicUrl);
      }

      // Upload des photos de vérification
      const verifUrls: string[] = [];
      for (let i = 0; i < verificationPhotos.length; i++) {
        const file = await fetch(verificationPhotos[i]).then(r => r.blob());
        const fileName = `${user.id}-verif-${Date.now()}-${i}.jpg`;

        const { error } = await supabase.storage.from('products').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        verifUrls.push(publicUrl);
      }

      // Création du produit
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          creator_id: user.id,
          title: "Nouvelle pièce", // à améliorer plus tard
          price_1day: parseFloat(price1Day) || 0,
          price_2days: parseFloat(price2Days) || null,
          price_3days: parseFloat(price3Days) || null,
          extra_day_price: parseFloat(extraDayPrice) || null,
          images: publicUrls,
          verification_images: verifUrls,
          video_url: publicVideo || null,
          status: 'pending',
          no_face: noFace
        });

      if (insertError) throw insertError;

      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de l'envoi : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... tout le reste du JSX est identique jusqu'à l'étape 2 ...

    {/* Step 2 */}
    {step === 2 && (
      <div className="space-y-10">
        {/* ... tout le contenu existant ... */}

        <div className="flex gap-4">
          <button onClick={() => setStep(1)} className="flex-1 py-5 border border-zinc-700 rounded-3xl font-medium">Retour</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-1 py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl font-semibold disabled:opacity-70"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer pour validation"}
          </button>
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
        <Link href="/creators/me" className="mt-12 inline-block px-12 py-5 bg-white text-black rounded-3xl font-semibold text-lg">
          Retour à mon profil
        </Link>
      </div>
    )}
  );
}
