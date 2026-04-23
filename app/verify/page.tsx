'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Verify() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    selfie: null as string | null,
    idCard: null as string | null,
  });

  const handleFile = (type: 'selfie' | 'idCard', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({
          ...prev,
          [type]: ev.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-center mb-3">Vérification du compte</h1>
        <p className="text-zinc-400 text-center mb-12">Pour garantir la confiance et la sécurité de la communauté</p>

        <div className="card p-10">
          {/* Étape 1 */}
          {step === 1 && (
            <div>
              <div className="text-rose-400 text-sm font-medium tracking-widest mb-4">ÉTAPE 1/2</div>
              <h2 className="text-2xl font-medium mb-8">Photo selfie avec pièce d’identité</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm text-zinc-400 mb-3">Selfie tenant votre pièce d’identité</label>
                  <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile('selfie', e)} />
                    <span className="text-5xl mb-4">📸</span>
                    <span className="text-rose-400">Choisir une photo</span>
                  </label>
                  {formData.selfie && (
                    <img src={formData.selfie} alt="selfie" className="mt-4 w-full rounded-3xl" />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-3">Pièce d’identité (recto)</label>
                  <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile('idCard', e)} />
                    <span className="text-5xl mb-4">🪪</span>
                    <span className="text-rose-400">Choisir une photo</span>
                  </label>
                  {formData.idCard && (
                    <img src={formData.idCard} alt="id" className="mt-4 w-full rounded-3xl" />
                  )}
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.selfie || !formData.idCard}
                className="btn-primary w-full py-7 text-xl mt-12 disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center text-5xl mb-8">✓</div>
              <h2 className="text-3xl font-medium mb-4">Merci !</h2>
              <p className="text-zinc-400 mb-12">Votre demande de vérification a été envoyée.<br />Nous vous répondrons sous 24h.</p>
              
              <Link href="/creators" className="btn-primary px-16 py-7 text-xl inline-block">
                Retour aux créatrices
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
