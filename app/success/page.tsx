// app/success/page.tsx
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-400 mb-4">Thank You !</h1>
        <p className="text-xl text-zinc-400">Votre commande a été confirmée.</p>
      </div>
    </div>
  );
}
