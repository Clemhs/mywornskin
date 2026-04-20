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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋'];

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
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
      setErrorMsg("Le message est vide");
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Messagerie Privée</h1>
          <span className="text-rose-400 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
            En ligne
          </span>
        </div>

        {/* Fenêtre avec cadre rose/noir élégant */}
        <div className="relative bg-zinc-950 border-2 border-rose-800/80 rounded-3xl h-[74vh] flex flex-col overflow-hidden shadow-2xl shadow-black/80">
          
          {/* Header */}
          <div className="p-5 border-b border-rose-900/60 flex items-center gap-4 bg-black/70">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-1 ring-rose-500/30">
              <Image src="https://picsum.photos/id/64/128/128" alt="Avatar" width={44} height={44} className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-lg">Créateur / Utilisateur</p>
              <p className="text-xs text-rose-400">En ligne maintenant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-black/95">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-20">Aucun message pour l'instant...</p>
            )}

            {messages.map((msg: any) => (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[78%]">
                  <div className="bg-zinc-100 text-zinc-900 rounded-3xl px-6 py-3.5 rounded-br-none shadow">
                    {msg.content && <p className="text-[15.5px] leading-relaxed">{msg.content}</p>}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 pr-3 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Zone d'écriture */}
          <div className="p-5 border-t border-rose-900/60 bg-zinc-950 relative">
            {errorMsg && <div className="mb-4 text-red-400 text-sm text-center">{errorMsg}</div>}

            {imagePreview && (
              <div className="mb-4 flex items-center gap-3">
                <Image src={imagePreview} alt="preview" width={90} height={90} className="rounded-2xl object-cover ring-1 ring-rose-500/30" />
                <button onClick={() => {setSelectedImage(null); setImagePreview(null);}} className="text-rose-400 hover:text-rose-300 text-sm">Supprimer</button>
              </div>
            )}

            <div className="flex gap-3 items-center">
              {/* Bouton photo moderne (inspiré WhatsApp / Telegram) */}
              <label className="cursor-pointer flex-shrink-0">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="w-11 h-11 bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 hover:border-rose-400 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-95 shadow-inner">
                  📸
                </div>
              </label>

              {/* Bouton emoji */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-11 h-11 bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 hover:border-rose-400 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-95"
              >
                😀
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                placeholder="Message ou emoji..."
                className="flex-1 bg-zinc-900 border border-rose-900/60 focus:border-rose-400 rounded-3xl px-6 py-4 focus:outline-none text-[15px]"
                disabled={sending}
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!newMessage.trim() && !selectedImage)}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white font-semibold px-8 rounded-3xl transition active:scale-95"
              >
                {sending ? '...' : 'Envoyer'}
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-6 bg-zinc-900 border border-rose-500/30 rounded-2xl p-4 shadow-2xl grid grid-cols-6 gap-3 z-50">
                {commonEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => insertEmoji(emoji)}
                    className="text-3xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Bouton traduction */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-4 w-full py-3 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-400 rounded-2xl transition"
            >
              {showTranslation ? "Masquer la traduction" : "🌐 Traduire tous les messages dans votre langue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
