'use client';

import { useState } from 'react';

export default function Verify() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [idCard, setIdCard] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitted' | 'approved' | 'rejected'>('idle');
  const [loading, setLoading] = useState(false);

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setSelfie(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setIdCard(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitVerification = () => {
    if (!selfie || !idCard) {
      alert("Veuillez uploader les deux photos demandées.");
      return;
    }

    setLoading(true);

    // Simulation de vérification (on reliera à Supabase + admin plus tard)
    setTimeout(() => {
      setStatus('submitted');
      setLoading(false);
      alert("✅ Vos documents ont été envoyés. Votre profil sera vérifié dans les 48 heures par l'administrateur.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Vérification de votre profil</h1>
          <p className="text-zinc-400">Pour garantir la confiance et la sécurité sur MyWornSkin, nous vérifions manuellement chaque créateur.</p>
        </div>

        <div className="card p-10">
          <div className="mb-10">
            <h3 className="font-semibold mb-3">1. Photo Selfie</h3>
            <p className="text-zinc-400 text-sm mb-4">Prenez une photo claire de vous tenant une feuille avec écrit "MyWornSkin" + la date du jour.</p>
            
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer transition">
              <input type="file" accept="image/*" onChange={handleSelfieUpload} className="hidden" />
              {selfie ? (
                <img src={selfie} alt="selfie" className="mx-auto max-h-64 rounded-2xl" />
              ) : (
                <div className="text-6xl mb-4">📸</div>
              )}
            </label>
          </div>

          <div className="mb-12">
            <h3 className="font-semibold mb-3">2. Photo de votre pièce d'identité</h3>
            <p className="text-zinc-400 text-sm mb-4">Carte d'identité, passeport ou permis (recto uniquement, informations lisibles).</p>
            
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer transition">
              <input type="file" accept="image/*" onChange={handleIdCardUpload} className="hidden" />
              {idCard ? (
                <img src={idCard} alt="id card" className="mx-auto max-h-64 rounded-2xl" />
              ) : (
                <div className="text-6xl mb-4">🪪</div>
              )}
            </label>
          </div>

          <button
            onClick={submitVerification}
            disabled={!selfie || !idCard || loading}
            className="btn-primary w-full py-6 text-lg disabled:bg-zinc-700"
          >
            {loading ? "Envoi en cours..." : "Envoyer mes documents pour vérification"}
          </button>

          {status === 'submitted' && (
            <p className="text-center text-emerald-400 mt-8 font-medium">
              Vos documents ont été reçus.<br />Ils seront vérifiés manuellement dans les 48 heures.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
