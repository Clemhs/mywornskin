'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [activeConversation, setActiveConversation] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Conversations de test (on les remplacera plus tard par des données réelles)
  const conversations = [
    { id: 0, name: "Emma Laurent", avatar: "https://picsum.photos/id/64/128/128", online: true },
    { id: 1, name: "Sophie Moreau", avatar: "https://picsum.photos/id/65/128/128", online: false },
    { id: 2, name: "Léa Dubois", avatar: "https://picsum.photos/id/66/128/128", online: true },
  ];

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋', '😈', '✨'];

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Fermer le picker emoji en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);
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

  const currentConv = conversations[activeConversation];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* === COLONNE GAUCHE - LISTE DES CONVERSATIONS === */}
      <div className="w-80 border-r border-rose-900/70 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-rose-900/60">
          <h2 className="text-2xl font-bold tracking-tight">Conversations</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(index)}
              className={`flex items-center gap-4 p-5 hover:bg-zinc-900/80 cursor-pointer transition-all border-b border-rose-900/30 ${activeConversation === index ? 'bg-rose-950/30' : ''}`}
            >
              <div className="relative">
                <Image src={conv.avatar} alt={conv.name} width={52} height={52} className="rounded-2xl object-cover ring-1 ring-rose-500/30" />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-zinc-950 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conv.name}</p>
                <p className="text-xs text-gray-400">Dernier message...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === ZONE PRINCIPALE DE DISCUSSION === */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="relative flex-1 bg-zinc-950 border-2 border-rose-800/80 rounded-3xl m-6 overflow-hidden shadow-2xl shadow-black/80 flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-rose-900/60 flex items-center gap-4 bg-black/70">
            <div className="relative">
              <Image src={currentConv.avatar} alt={currentConv.name} width={52} height={52} className="rounded-2xl object-cover ring-1 ring-rose-500/30" />
              {currentConv.online && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-zinc-950 rounded-full"></div>}
            </div>
            <div>
              <p className="font-semibold text-xl">{currentConv.name}</p>
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                En ligne maintenant
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-black/95">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-20">Aucun message pour l'instant avec {currentConv.name}...</p>
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
              {/* Bouton Photo - icône SVG parfaitement centrée */}
              <label className="cursor-pointer flex-shrink-0">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="w-11 h-11 bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 hover:border-rose-400 rounded-2xl flex items-center justify-center transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2 2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2zM15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v2m0 16v2m9-9H3" />
                  </svg>
                </div>
              </label>

              {/* Bouton Emoji */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-11 h-11 bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 hover:border-rose-400 rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-95"
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
              <div ref={emojiPickerRef} className="absolute bottom-20 left-6 bg-zinc-900 border border-rose-500/30 rounded-2xl p-4 shadow-2xl grid grid-cols-6 gap-3 z-50">
                {commonEmojis.map((emoji, i) => (
                  <button key={i} onClick={() => insertEmoji(emoji)} className="text-3xl hover:scale-125 active:scale-110 transition-transform p-2">
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Bouton Traduction avec drapeaux */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-4 w-full py-3 text-sm text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-400 rounded-2xl transition flex items-center justify-center gap-3"
            >
              🌍 🇫🇷 🇬🇧 🇪🇸 🇩🇪 Traduire automatiquement les messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
