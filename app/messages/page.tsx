'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '../context/LanguageContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const { t } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [activeConvId, setActiveConvId] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

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
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `msg-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('message-images')
        .upload(fileName, selectedImage);

      if (!uploadError) {
        const { data } = supabase.storage.from('message-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: conversations[activeConvId].id,
      content: newMessage.trim() || null,
      image_url: imageUrl,
    });

    if (!error) {
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
    } else {
      setErrorMsg("Erreur lors de l'envoi du message");
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
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">{t('loading')}</div>;
  }

  const currentConv = conversations[activeConvId];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 bg-zinc-950 border-b md:border-r border-rose-950/60 flex-col overflow-hidden`}>
        <div className="p-6 border-b border-rose-900/50 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{t('conversations')}</h2>
          <button onClick={() => setShowSidebar(false)} className="md:hidden text-3xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-4">
          {conversations.map((conv, idx) => (
            <div
              key={conv.id}
              onClick={() => {
                setActiveConvId(idx);
                setShowSidebar(false);
              }}
              className={`p-4 rounded-3xl flex gap-4 cursor-pointer transition-all hover:bg-white/5 ${activeConvId === idx ? 'bg-rose-950/30 border-l-2 border-rose-400' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <Image src={conv.avatar} alt="" width={54} height={54} className="rounded-2xl" />
                {conv.online && <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conv.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone discussion */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="md:hidden p-4 border-b border-rose-900/60 flex items-center gap-4 bg-black/80">
          <button onClick={() => setShowSidebar(true)} className="text-3xl">☰</button>
          <div className="flex items-center gap-3">
            <Image src={currentConv.avatar} alt="" width={40} height={40} className="rounded-2xl" />
            <p className="font-semibold">{currentConv.name}</p>
          </div>
        </div>

        <div className="hidden md:flex p-6 border-b border-rose-900/50 items-center gap-5 bg-black/70">
          <Image src={currentConv.avatar} alt="" width={58} height={58} className="rounded-2xl" />
          <div>
            <p className="text-2xl font-bold">{currentConv.name}</p>
            <p className="text-emerald-400 text-sm">En ligne maintenant</p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 bg-black/90">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 mt-20 md:mt-32">{t('no_messages')}</p>
          )}

          {messages.map((msg: any) => (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] md:max-w-[78%]">
                <div className="bg-white text-black rounded-3xl px-6 py-4 rounded-br-none shadow">
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

        <div className="p-4 md:p-6 border-t border-rose-900/50 bg-zinc-950">
          {imagePreview && (
            <div className="mb-4 flex gap-4 items-center">
              <Image src={imagePreview} alt="preview" width={110} height={110} className="rounded-2xl" />
              <button onClick={() => {setSelectedImage(null); setImagePreview(null);}} className="text-rose-400">Supprimer</button>
            </div>
          )}

          <div className="flex gap-3 items-center">
            <label className="cursor-pointer flex-shrink-0">
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
              placeholder={t('write_message')}
              className="flex-1 bg-zinc-900 border border-rose-900/60 focus:border-rose-400 rounded-3xl px-6 py-4 text-[15px]"
              disabled={sending}
            />

            <button
              onClick={sendMessage}
              disabled={sending || uploading}
              className="bg-rose-600 hover:bg-rose-500 px-9 py-4 rounded-3xl font-medium disabled:bg-zinc-700"
            >
              {sending || uploading ? '...' : t('send')}
            </button>
          </div>

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-24 left-6 md:left-20 bg-zinc-900 border border-rose-500/30 rounded-3xl p-5 shadow-2xl grid grid-cols-6 gap-4 z-50">
              {commonEmojis.map((emoji, i) => (
                <button key={i} onClick={() => insertEmoji(emoji)} className="text-4xl hover:scale-125 transition">
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
