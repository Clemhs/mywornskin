// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-light tracking-[-0.04em] text-white">
              MyWornSkin
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/creators" className="hover:text-white transition-colors">Créatrices</Link>
            <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
            <Link href="/sell" className="hover:text-white transition-colors">Vendre</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6 text-zinc-300">
            <button className="hover:text-rose-400 transition-colors text-xl">🔎</button>
            <button className="hover:text-rose-400 transition-colors text-xl relative">♡</button>
            <button className="hover:text-rose-400 transition-colors text-xl relative">
              🛒
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>

            {/* Bouton Vendre (mobile + desktop) */}
            <Link 
              href="/sell" 
              className="hidden sm:flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-5 py-2 rounded-full text-sm font-medium text-white transition-colors"
            >
              Mettre en vente
            </Link>

            {/* Menu mobile */}
            <button className="md:hidden text-3xl text-zinc-300 hover:text-white transition-colors">
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
