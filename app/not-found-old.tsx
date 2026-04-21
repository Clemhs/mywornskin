import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-black text-rose-600 mb-4">404</div>
        <h2 className="text-4xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-zinc-400 mb-8">
          Désolé, la page que vous cherchez n'existe pas.
        </p>
        <Link 
          href="/"
          className="inline-block bg-rose-600 hover:bg-rose-500 px-8 py-3.5 rounded-2xl font-medium transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
