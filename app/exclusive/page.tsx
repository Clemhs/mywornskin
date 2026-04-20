'use client';

export default function ExclusivePage() {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-4 text-center">Contenu Exclusif 💋</h1>
        <p className="text-center text-gray-400 mb-12">Bienvenue dans la zone réservée aux abonnés</p>

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

        <div className="mt-12 text-center text-sm text-gray-500">
          Cette page est temporairement accessible pour tester.<br />
          La protection sera réactivée une fois le bug corrigé.
        </div>
      </div>
    </div>
  );
}
