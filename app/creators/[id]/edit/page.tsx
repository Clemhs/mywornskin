'use client';
// TEST ULTRA SIMPLE - Version de diagnostic
export default function CreatorEdit() {
  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">TEST MOBILE</h1>
        <p className="text-white text-xl">Si tu vois ce texte en rouge, le fichier est bien déployé.</p>
        <p className="text-white mt-8">Sinon, il y a un problème de déploiement.</p>
      </div>
    </div>
  );
}
