// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-16 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <div className="text-3xl font-light tracking-tight mb-4">MyWornSkin</div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              La plateforme intime où l’authenticité et le désir se rencontrent.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Plateforme</h4>
            <div className="space-y-3 text-sm">
              <Link href="/creators" className="block text-zinc-400 hover:text-white">Découvrir les créatrices</Link>
              <Link href="/sell" className="block text-zinc-400 hover:text-white">Vendre mon vêtement</Link>
              <Link href="/messages" className="block text-zinc-400 hover:text-white">Messages</Link>
            </div>
          </div>

          {/* Communauté */}
          <div>
            <h4 className="font-semibold mb-4">Communauté</h4>
            <div className="space-y-3 text-sm">
              <Link href="/why-join" className="block text-zinc-400 hover:text-white">Pourquoi nous rejoindre ?</Link>
              <Link href="/badges" className="block text-zinc-400 hover:text-white">Badges &amp; Récompenses</Link>
              <Link href="/verify" className="block text-zinc-400 hover:text-white">Vérification créateur</Link>
            </div>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <div className="space-y-3 text-sm">
              <Link href="/cgu" className="block text-zinc-400 hover:text-white">Conditions Générales</Link>
              <Link href="#" className="block text-zinc-400 hover:text-white">Confidentialité</Link>
              <Link href="#" className="block text-zinc-400 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} MyWornSkin — Tous droits réservés • Plateforme réservée aux adultes
        </div>
      </div>
    </footer>
  );
}
