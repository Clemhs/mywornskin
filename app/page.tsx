'use client';
// Homepage - Version qui fait passer le build (Header temporairement désactivé)
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-light tracking-tighter mb-6">MyWornSkin</h1>
        <p className="text-2xl text-zinc-400 mb-12">
          Le site est en ligne ✅<br />
          Le Header sera ajouté dans la prochaine étape.
        </p>
        <a 
          href="https://mywornskin.vercel.app/creators" 
          className="inline-block bg-white text-black px-8 py-4 rounded-3xl text-lg font-medium hover:bg-zinc-200 transition"
        >
          Aller sur la page créatrices
        </a>
      </div>
    </div>
  );
}
