import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <Link href="/why-join" className="hover:text-white transition">Pourquoi MyWornSkin ?</Link>
          <Link href="/cgu" className="hover:text-white transition">Conditions Générales</Link>
          <Link href="/admin" className="hover:text-white transition">Admin</Link>
        </div>
        
        <p>© 2026 MyWornSkin - Tous droits réservés</p>
        <p className="mt-2">Tous les créateurs sont vérifiés manuellement.</p>
      </div>
    </footer>
  );
}
