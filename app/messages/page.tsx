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
  const [activeConvId, setActiveConvId] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Conversations de test (on pourra les connecter à la vraie base plus tard)
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

  // Fermeture du picker emoji en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
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
      await loadMessages();
      setLoading(false);
    };
    init();
  }, [activeConvId]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !user) return;

    setSending(true);
    setErrorMsg('');

    let imageUrl: string | null = null;

    // Upload image si présente
    if (selectedImage) {
      setUploading(true);
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `msg-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('message-images')
        .upload(fileName, selectedImage);

      if (!uploadError) {
        const { data } = supabase.storage.from('message-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      } else {
        setErrorMsg("Erreur lors de l'upload de l'image");
      }
      setUploading(false);
    }

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: conversations[activeConvId].id,
      content: newMessage.trim() || null,
      image_url: imageUrl,
    });

    if (error) {
      setErrorMsg("Erreur lors de l'envoi du message");
      console.error(error);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender_id: user.id,
        content: newMessage.trim() || null,
        image_url: imageUrl,
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement de la messagerie...</div>;

  const currentConv = conversations[activeConvId];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Conversations */}
      <div className="w-80 bg-zinc-950 border-r border-rose-950/60 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-rose-900/50">
          <h2 className="text-2xl font-bold tracking-tight">Conversations</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {conversations.map((conv, idx) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(idx)}
              className={`mx-4 p-4 rounded-3xl flex gap-4 cursor-pointer transition-all hover:bg-white/5 ${activeConvId === idx ? 'bg-rose-950/30 border-l-2 border-rose-400' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <Image src={conv.avatar} alt="" width={54} height={54} className="rounded-2xl object-cover" />
                {conv.online && <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-zinc-950" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conv.name}</p>
                <p className="text-sm text-gray-400 truncate">Clique pour discuter</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de discussion */}
      <div className="flex-1 flex flex-col h-screen p-6">
        <div className="flex-1 bg-zinc-950 border border-rose-900/60 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-rose-900/50 flex items-center gap-5 bg-black/70">
            <Image src={currentConv.avatar} alt="" width={58} height={58} className="rounded-2xl" />
            <div>
              <p className="text-2xl font-bold">{currentConv.name}</p>
              <p className="text-emerald-400 text-sm">En ligne maintenant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-black/90">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-32">Aucun message avec {currentConv.name} pour l'instant...</p>
            )}

            {messages.map((msg: any) => (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[78%]">
                  <div className="bg-white text-black rounded-3xl px-7 py-4 rounded-br-none shadow">
                    {msg.content && <p className="text-[15.5px]">{msg.content}</p>}
                    {msg.image_url && (
                      <Image src={msg.image_url} alt="photo" width={320} height={240} className="rounded-2xl mt-3" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 pr-4 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Zone d'écriture */}
          <div className="p-6 border-t border-rose-900/50 bg-zinc-950">
            {imagePreview && (
              <div className="mb-4 flex gap-4 items-center">
                <Image src={imagePreview} alt="preview" width={110} height={110} className="rounded-2xl" />
                <button onClick={() => {setSelectedImage(null); setImagePreview(null);}} className="text-rose-400">Supprimer</button>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-rose-400/40 rounded-2xl flex items-center justify-center text-2xl transition-all">
                  📷
                </div>
              </label>

              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-rose-400/40 rounded-2xl flex items-center justify-center text-3xl transition-all">
                😀
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-900 border border-rose-900/60 focus:border-rose-400 rounded-3xl px-6 py-4"
                disabled={sending}
              />

              <button
                onClick={sendMessage}
                disabled={sending || uploading}
                className="bg-rose-600 hover:bg-rose-500 px-9 py-4 rounded-3xl font-medium disabled:bg-zinc-700"
              >
                {sending || uploading ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-24 left-20 bg-zinc-900 border border-rose-500/30 rounded-3xl p-5 shadow-2xl grid grid-cols-6 gap-4 z-50">
                {commonEmojis.map((emoji, i) => (
                  <button key={i} onClick={() => insertEmoji(emoji)} className="text-4xl hover:scale-125 transition">
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Traduction */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-5 w-full py-3.5 text-sm border border-rose-500/30 hover:border-rose-400 rounded-2xl text-rose-400 hover:text-rose-300 transition flex items-center justify-center gap-3"
            >
              🌍 🇫🇷 🇬🇧 🇪🇸 🇩🇪 Traduire automatiquement les messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [activeConversation, setActiveConversation] = useState(0);
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

  const conversations = [
    { id: 0, name: "Emma Laurent", avatar: "https://picsum.photos/id/64/128/128", online: true, lastMsg: "Tu as reçu mon dernier colis ?" },
    { id: 1, name: "Sophie Moreau", avatar: "https://picsum.photos/id/65/128/128", online: false, lastMsg: "J'adore ce que tu portes..." },
    { id: 2, name: "Léa Dubois", avatar: "https://picsum.photos/id/66/128/128", online: true, lastMsg: "Quand est-ce qu'on se voit ?" },
  ];

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋', '😈', '✨'];

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

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
      .insert({ sender_id: user.id, receiver_id: user.id, content: newMessage.trim() || null });

    if (error) {
      console.error('Erreur Supabase:', error);
      setErrorMsg(`Erreur : ${error.message}`);
    } else {
      setMessages(prev => [...prev, { id: Date.now(), sender_id: user.id, content: newMessage.trim(), created_at: new Date().toISOString() }]);
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
      {/* === COLONNE GAUCHE - CONVERSATIONS === */}
      <div className="w-80 bg-zinc-950 border-r border-rose-950/70 flex flex-col overflow-hidden relative">
        {/* Dégradé artistique subtil en bas */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-rose-950/30 to-transparent pointer-events-none" />

        <div className="p-7 border-b border-rose-950/50">
          <h2 className="text-2xl font-bold tracking-tighter">Conversations</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(index)}
              className={`mx-4 rounded-3xl flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 group
                ${activeConversation === index 
                  ? 'bg-gradient-to-r from-rose-950/40 to-transparent border-l-2 border-rose-400' 
                  : 'hover:border-l-2 hover:border-rose-900/50'
                }`}
            >
              <div className="relative flex-shrink-0">
                <Image 
                  src={conv.avatar} 
                  alt={conv.name} 
                  width={54} 
                  height={54} 
                  className="rounded-2xl object-cover ring-1 ring-rose-400/10 group-hover:ring-rose-400/30 transition-all" 
                />
                {conv.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-zinc-950 rounded-full animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{conv.name}</p>
                <p className="text-sm text-gray-400 truncate mt-0.5">{conv.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === ZONE DE DISCUSSION PRINCIPALE === */}
      <div className="flex-1 flex flex-col h-screen p-6">
        <div className="flex-1 bg-zinc-950 border border-rose-900/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-rose-900/50 flex items-center gap-5 bg-black/60">
            <div className="relative">
              <Image src={currentConv.avatar} alt={currentConv.name} width={58} height={58} className="rounded-2xl object-cover ring-1 ring-rose-400/20" />
              {currentConv.online && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-[3px] border-zinc-950 rounded-full" />}
            </div>
            <div>
              <p className="font-bold text-2xl tracking-tight">{currentConv.name}</p>
              <p className="text-rose-400/90 text-sm flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                En ligne maintenant
              </p>
            </div>
          </div>

          {/* Messages avec animation d'entrée */}
          <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-black/90">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p className="text-xl">Commence une conversation avec {currentConv.name}</p>
              </div>
            )}

            {messages.map((msg: any, index) => (
              <div 
                key={msg.id} 
                className="flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="max-w-[75%]">
                  <div className="bg-white text-black rounded-3xl px-7 py-4 rounded-br-none shadow-md">
                    <p className="text-[15.5px] leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 pr-4 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Zone d'écriture */}
          <div className="p-6 border-t border-rose-900/50 bg-zinc-950 relative">
            {errorMsg && <div className="mb-4 text-red-400 text-center text-sm">{errorMsg}</div>}

            {imagePreview && (
              <div className="mb-4 flex gap-4 items-center">
                <Image src={imagePreview} alt="preview" width={100} height={100} className="rounded-2xl object-cover ring-1 ring-rose-400/30" />
                <button onClick={() => {setSelectedImage(null); setImagePreview(null);}} className="text-rose-400 hover:text-rose-300">Supprimer</button>
              </div>
            )}

            <div className="flex gap-4 items-center">
              {/* Bouton Photo */}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-rose-400/30 hover:border-rose-400 rounded-2xl flex items-center justify-center transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2 2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2zM15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v2m0 16v2m9-9H3" />
                  </svg>
                </div>
              </label>

              {/* Bouton Emoji */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-rose-400/30 hover:border-rose-400 rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-95"
              >
                😀
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-900 border border-rose-900/50 focus:border-rose-400 rounded-3xl px-7 py-4 text-[15.5px] focus:outline-none"
                disabled={sending}
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!newMessage.trim() && !selectedImage)}
                className="bg-rose-600 hover:bg-rose-500 px-10 py-4 rounded-3xl font-semibold transition active:scale-95 disabled:bg-zinc-800"
              >
                {sending ? '...' : 'Envoyer'}
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-24 left-6 bg-zinc-900 border border-rose-500/30 rounded-3xl p-5 shadow-2xl grid grid-cols-6 gap-4 z-50">
                {commonEmojis.map((emoji, i) => (
                  <button key={i} onClick={() => insertEmoji(emoji)} className="text-4xl hover:scale-125 transition-transform">
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Bouton Traduction */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-5 w-full py-3.5 text-sm border border-rose-500/30 hover:border-rose-400 rounded-2xl text-rose-400 hover:text-rose-300 transition flex items-center justify-center gap-3"
            >
              🌍 🇫🇷 🇬🇧 🇪🇸 🇩🇪 Traduire automatiquement les messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
