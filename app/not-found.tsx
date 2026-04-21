import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4 text-rose-500">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page non trouvée</h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link 
          href="/" 
          className="bg-rose-600 hover:bg-rose-500 px-10 py-4 rounded-2xl inline-block font-medium transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
