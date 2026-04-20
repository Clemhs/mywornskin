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

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) console.error('Erreur chargement messages:', error);
      else if (data) setMessages(data);

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
      console.error('Erreur Supabase insert:', error);
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
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement de la messagerie...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messagerie Privée</h1>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            En ligne
          </span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl h-[70vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-700 overflow-hidden">
              <Image src="https://picsum.photos/id/64/128/128" alt="Avatar" width={40} height={40} />
            </div>
            <div>
              <p className="font-medium">Créateur / Utilisateur</p>
              <p className="text-xs text-emerald-400">En ligne maintenant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-950">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-20">Aucun message encore...</p>
            )}
            
            {messages.map((msg: any) => (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] bg-white text-black rounded-3xl px-5 py-3 rounded-br-none">
                  {msg.content && <p className="text-[15px]">{msg.content}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Zone d'input */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900">
            {errorMsg && <div className="mb-3 text-red-400 text-sm text-center">{errorMsg}</div>}

            {imagePreview && (
              <div className="mb-3 flex items-center gap-3">
                <Image src={imagePreview} alt="preview" width={80} height={80} className="rounded-2xl object-cover" />
                <button 
                  onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                  className="text-red-400 text-sm underline"
                >
                  Supprimer
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <label className="cursor-pointer flex-shrink-0">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center text-2xl transition-colors">
                  📷
                </div>
              </label>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                placeholder="Écris ton message ici..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-white/30 text-[15px]"
                disabled={sending}
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!newMessage.trim() && !selectedImage)}
                className="bg-white hover:bg-gray-100 disabled:bg-zinc-700 disabled:text-gray-400 text-black font-semibold px-8 rounded-3xl transition"
              >
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
