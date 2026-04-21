'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([
    { id: '1', name: 'Emma Laurent', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Tu as reçu mon dernier colis ?' },
    { id: '2', name: 'Sophie Moreau', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'J’ai une nouvelle pièce pour toi ❤️' },
  ]);
  const [activeConvId, setActiveConvId] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Charger l'utilisateur
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Simuler le chargement des messages
  useEffect(() => {
    setMessages([
      { id: 1, sender: 'them', content: 'Salut ! J’ai bien reçu ton message.', time: '14:32' },
      { id: 2, sender: 'me', content: 'Super, tu as aimé ?', time: '14:35' },
      { id: 3, sender: 'them', content: 'Oui, j’adore 😍', time: '14:36' },
    ]);
  }, [activeConvId]);

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !user) return;

    let imageUrl = null;

    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('message-images')
        .upload(fileName, selectedImage);

      if (!error && data) {
        const { data: publicUrl } = supabase.storage
          .from('message-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl.publicUrl;
      }
    }

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      content: newMessage.trim() || null,
      image_url: imageUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋'];

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar Conversations */}
      <div className="w-80 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(index)}
              className={`p-4 border-b border-zinc-800 flex gap-4 cursor-pointer hover:bg-zinc-900 transition ${
                activeConvId === index ? 'bg-zinc-900' : ''
              }`}
            >
              <img src={conv.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{conv.name}</div>
                <div className="text-sm text-zinc-400 truncate">{conv.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header du chat */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900">
          <img 
            src={conversations[activeConvId].avatar} 
            alt="" 
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <div className="font-semibold">{conversations[activeConvId].name}</div>
            <div className="text-xs text-emerald-400">En ligne</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`chat-bubble ${msg.sender === 'me' ? 'chat-bubble-sent' : 'chat-bubble-received'}`}
              >
                {msg.content && <p>{msg.content}</p>}
                {msg.image_url && (
                  <img src={msg.image_url} alt="image" className="rounded-xl mt-2 max-w-xs" />
                )}
                <span className="text-[10px] opacity-70 block mt-1 text-right">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Zone de saisie */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img src={imagePreview} alt="preview" className="max-h-32 rounded-xl" />
              <button
                onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
            >
              📷
            </button>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-11 h-11 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
            >
              😀
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris ton message..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-rose-500"
            />

            <button
              onClick={sendMessage}
              className="bg-rose-600 hover:bg-rose-500 px-8 rounded-2xl font-medium transition"
            >
              Envoyer
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-24 left-20 bg-zinc-900 border border-zinc-700 p-4 rounded-3xl grid grid-cols-7 gap-2 shadow-2xl">
              {commonEmojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => insertEmoji(emoji)}
                  className="text-3xl hover:scale-125 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
