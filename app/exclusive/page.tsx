'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const YOUR_USER_ID = "3490fa53-ba4b-4d04-bb9e-3d97dca910eb"; // Ton User ID

export default function ExclusivePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation temporaire : on force l'accès pour ton User ID
    const checkAccess = async () => {
      // Ici on simule que tu es connecté et abonné
      setUser({ id: YOUR_USER_ID });
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-4 text-center">Contenu Exclusif 💋</h1>
        <p className="text-center text-green-400 mb-12">Accès autorisé (mode debug)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-3xl p-8 text-center">
            <div className="h-64 bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center text-6xl">📸</div>
            <h3 className="text-xl font-semibold">Photos exclusives</h3>
            <p className="text-gray-400 mt-2">Contenu jamais vu ailleurs</p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 text-center">
            <div className="h-64 bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center text-6xl">💬</div>
            <h3 className="text-xl font-semibold">Messagerie prioritaire</h3>
            <p className="text-gray-400 mt-2">Accès direct aux créateurs</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Mode debug activé pour ton User ID<br />
            La protection sera réactivée plus tard.
          </p>
        </div>
      </div>
    </div>
  );
}
