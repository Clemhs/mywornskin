// app/register/page.tsx
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">Créer un compte</h1>
        <form className="space-y-6">
          <input type="text" placeholder="Pseudo" className="w-full bg-zinc-800 p-4 rounded-2xl" />
          <input type="email" placeholder="Email" className="w-full bg-zinc-800 p-4 rounded-2xl" />
          <input type="password" placeholder="Mot de passe" className="w-full bg-zinc-800 p-4 rounded-2xl" />
          <button type="submit" className="w-full bg-rose-500 py-4 rounded-2xl font-medium">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
