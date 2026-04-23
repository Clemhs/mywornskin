'use client';

import { useState } from 'react';

export default function Verify() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [idCard, setIdCard] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'submitted' | 'approved' | 'rejected'>('pending');
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

    // Simulation d'envoi
    setTimeout(() => {
      setStatus('submitted');
      setLoading(false);
      alert("✅ Vos documents ont été envoyés. Votre profil sera vérifié dans les 48h.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Vérification de votre profil</h1>
          <p className="text-zinc-400">Pour garantir la confiance sur MyWornSkin, nous vérifions tous les créateurs.</p>
        </div>

        <div className="card p-10">
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">1. Photo selfie</h2>
            <p className="text-zinc-400 mb-4">Prenez une photo de vous tenant une feuille avec écrit "MyWornSkin" + date du jour.</p>
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleSelfieUpload} className="hidden" />
              {selfie ? (
                <img src={selfie} alt="selfie" className="mx-auto max-h-64 rounded-2xl" />
              ) : (
                <div>
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-rose-400">Uploader votre selfie</p>
                </div>
              )}
            </label>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">2. Photo de votre pièce d'identité</h2>
            <p className="text-zinc-400 mb-4">Carte d'identité, passeport ou permis de conduire (recto uniquement).</p>
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleIdCardUpload} className="hidden" />
              {idCard ? (
                <img src={idCard} alt="id card" className="mx-auto max-h-64 rounded-2xl" />
              ) : (
                <div>
                  <div className="text-6xl mb-4">🪪</div>
                  <p className="text-rose-400">Uploader votre pièce d'identité</p>
                </div>
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
            <p className="text-center text-emerald-400 mt-6">
              Vos documents ont été reçus. Nous vous notifierons dès validation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
