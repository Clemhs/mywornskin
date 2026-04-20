'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  // Traduction simulée (français → français pour l'instant, tu pourras l'améliorer plus tard)
  const translateMessage = (text: string) => {
    if (!text) return text;
    const translations: any = {
      "test": "Test réussi",
      "ca marche": "Ça fonctionne",
      "how are you ?": "Comment ça va ?",
      "comment ca va ?": "How are you?"
    };
    return translations[text.toLowerCase()] || text + " (traduit)";
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
      setLoading(false);
    };

    init();
  }, []);

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !user) {
      setErrorMsg("Message vide ou utilisateur non connecté");
      return;
    }

    setSending(true);
    setErrorMsg('');

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: user.id,
        content: newMessage.trim() || null,
      });

    if (error) {
      console.error('Erreur Supabase:', error);
      setErrorMsg(`Erreur : ${error.message}`);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender_id: user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString()
      }]);
      setNewMessage('');
      setSelectedImage(null);
      setImagePreview(null);
    }

    setSending(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-rose-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Messagerie Privée</h1>
          <span className="text-rose-400 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
            En ligne
          </span>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800/50 backdrop-blur-xl rounded-3xl h-[72vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-1 ring-rose-500/30">
              <Image src="https://picsum.photos/id/64/128/128" alt="Avatar" width={44} height={44} className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-lg">Créateur / Utilisateur</p>
              <p className="text-xs text-rose-400">En ligne maintenant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 mt-20">Aucun message pour l'instant...</p>
            )}

            {messages.map((msg: any) => (
              <div key={msg.id} className="flex justify-end group">
                <div className="max-w-[78%]">
                  <div className="bg-white/95 text-black rounded-3xl px-6 py-3.5 rounded-br-none shadow-sm">
                    {msg.content && <p className="text-[15.5px] leading-relaxed">{msg.content}</p>}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 pr-2 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-900/80">
            {errorMsg && <div className="mb-4 text-red-400 text-sm text-center bg-red-950/50 py-2 rounded-2xl">{errorMsg}</div>}

            {imagePreview && (
              <div className="mb-4 flex items-center gap-3">
                <Image src={imagePreview} alt="preview" width={90} height={90} className="rounded-2xl object-cover ring-1 ring-rose-500/20" />
                <button 
                  onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                  className="text-rose-400 hover:text-rose-300 text-sm"
                >
                  Supprimer photo
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <label className="cursor-pointer flex-shrink-0">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-95">
                  📷
                </div>
              </label>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                placeholder="Écris ton message ici..."
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-3xl px-6 py-4 focus:outline-none text-[15px]"
                disabled={sending}
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!newMessage.trim() && !selectedImage)}
                className="bg-white hover:bg-rose-100 disabled:bg-zinc-700 text-black font-semibold px-8 rounded-3xl transition active:scale-95"
              >
                {sending ? '...' : 'Envoyer'}
              </button>
            </div>

            {/* Bouton Traduction globale */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-4 w-full py-2.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/50 rounded-2xl transition"
            >
              {showTranslation ? "Masquer la traduction" : "Traduire tous les messages dans votre langue"}
            </button>

            {showTranslation && (
              <div className="mt-3 text-[13px] text-rose-300/80 italic text-center">
                Traduction automatique activée (simulation)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
