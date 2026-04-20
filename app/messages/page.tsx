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
  const [activeConvId, setActiveConvId] = useState(0);
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
      setErrorMsg("Erreur lors de l'envoi");
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

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement...</div>;
  }

  const currentConv = conversations[activeConvId];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-zinc-950 border-r border-rose-950/60 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-rose-900/50">
          <h2 className="text-2xl font-bold tracking-tight">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-3">
          {conversations.map((conv, idx) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(idx)}
              className={`mx-4 p-4 rounded-3xl flex gap-4 cursor-pointer transition-all hover:bg-white/5 ${activeConvId === idx ? 'bg-rose-950/30 border-l-2 border-rose-400' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <Image src={conv.avatar} alt="" width={54} height={54} className="rounded-2xl" />
                {conv.online && <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conv.name}</p>
                <p className="text-sm text-gray-400 truncate">Clique pour discuter</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone discussion */}
      <div className="flex-1 flex flex-col h-screen p-6">
        <div className="flex-1 bg-zinc-950 border border-rose-900/60 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-rose-900/50 flex items-center gap-5 bg-black/70">
            <Image src={currentConv.avatar} alt="" width={58} height={58} className="rounded-2xl" />
            <div>
              <p className="text-2xl font-bold">{currentConv.name}</p>
              <p className="text-emerald-400 text-sm">En ligne maintenant</p>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-black/90">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-32">Aucun message avec {currentConv.name} pour l'instant...</p>
            )}

            {messages.map((msg: any) => (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[78%]">
                  <div className="bg-white text-black rounded-3xl px-7 py-4 rounded-br-none shadow">
                    {msg.content && <p>{msg.content}</p>}
                    {msg.image_url && <Image src={msg.image_url} alt="photo" width={320} height={240} className="rounded-2xl mt-3" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 pr-4 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

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

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-rose-400/40 rounded-2xl flex items-center justify-center text-3xl transition-all"
              >
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

            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-24 left-20 bg-zinc-900 border border-rose-500/30 rounded-3xl p-5 shadow-2xl grid grid-cols-6 gap-4 z-50">
                {commonEmojis.map((emoji, i) => (
                  <button key={i} onClick={() => insertEmoji(emoji)} className="text-4xl hover:scale-125 transition">
                    {emoji}
                  </button>
                ))}
              </div>
            )}

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
