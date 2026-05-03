// app/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold mb-8">Mon Profil</h1>
      
      <div className="bg-zinc-900 rounded-3xl p-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-zinc-700 rounded-full" />
          <div>
            <h2 className="text-2xl font-medium">Utilisateur</h2>
            <p className="text-zinc-400">client@exemple.com</p>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/50 p-6 rounded-2xl">Mes commandes</div>
          <div className="bg-black/50 p-6 rounded-2xl">Favoris</div>
          <div className="bg-black/50 p-6 rounded-2xl">Paramètres</div>
        </div>
      </div>
    </div>
  );
}
