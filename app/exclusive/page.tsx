'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const MY_USER_ID = "3490fa53-ba4b-4d04-bb9e-3d97dca910eb";

export default function ExclusivePage() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation très simple : on force l'accès pour ton User ID
    const timer = setTimeout(() => {
      setIsAllowed(true);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Vérification...</div>;
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-black text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Accès refusé</h1>
        <p className="text-gray-400 mb-10">Cette zone est réservée aux abonnés actifs.</p>
        <Link href="/subscribe" className="bg-white text-black px-10 py-4 rounded-2xl text-lg">
          S'abonner maintenant
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-8 text-center">Contenu Exclusif 💋</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-3xl p-10 text-center">
            <div className="text-7xl mb-6">📸</div>
            <h3 className="text-2xl font-semibold mb-3">Photos exclusives</h3>
            <p className="text-gray-400">Contenu intime et jamais publié ailleurs</p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-10 text-center">
            <div className="text-7xl mb-6">💬</div>
            <h3 className="text-2xl font-semibold mb-3">Messagerie prioritaire</h3>
            <p className="text-gray-400">Discussion directe avec les créateurs</p>
          </div>
        </div>

        <div className="text-center mt-16 text-sm text-gray-500">
          Tu es bien identifié comme abonné actif.<br />
          (User ID : {MY_USER_ID.slice(0, 8)}...)
        </div>
      </div>
    </div>
  );
}
