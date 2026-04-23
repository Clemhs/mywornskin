'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      alert("Veuillez uploader les deux photos.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setStatus('submitted');
      setLoading(false);
      alert("✅ Documents envoyés avec succès ! Votre profil sera vérifié dans les 48h.");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Vérification du profil créateur</h1>
          <p className="text-zinc-400">Cette étape est obligatoire pour apparaître sur le site et gagner la confiance des acheteurs.</p>
        </div>

        <div className="card p-10">
          <div className="mb-10">
            <h3 className="font-semibold mb-3">1. Selfie de vérification</h3>
            <p className="text-sm text-zinc-400 mb-4">Prends une photo de toi tenant une feuille avec écrit « MyWornSkin » + la date du jour.</p>
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleSelfieUpload} className="hidden" />
              {selfie ? (
                <img src={selfie} alt="selfie" className="mx-auto max-h-64 rounded-2xl" />
              ) : (
                <div className="text-6xl mb-4">📸</div>
              )}
            </label>
          </div>

          <div className="mb-12">
            <h3 className="font-semibold mb-3">2. Pièce d’identité</h3>
            <p className="text-sm text-zinc-400 mb-4">Carte d’identité, passeport ou permis (recto uniquement).</p>
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleIdCardUpload} className="hidden" />
              {idCard ? (
                <img src={idCard} alt="id" className="mx-auto max-h-64 rounded-2xl" />
              ) : (
                <div className="text-6xl mb-4">🪪</div>
              )}
            </label>
          </div>

          <button
            onClick={submitVerification}
            disabled={!selfie || !idCard || loading}
            className="btn-primary w-full py-6 text-lg"
          >
            {loading ? "Envoi en cours..." : "Envoyer pour vérification"}
          </button>

          {status === 'submitted' && (
            <div className="mt-8 text-center text-emerald-400">
              Documents envoyés avec succès.<br />
              Vous serez notifié dès validation par l’administrateur.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
