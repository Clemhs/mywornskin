'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([
    { id: '1', name: 'Emma Laurent', avatar: 'https://picsum.photos/id/1011/150/150', lastMessage: 'Tu as reçu mon dernier colis ?' },
    { id: '2', name: 'Sophie Moreau', avatar: 'https://picsum.photos/id/1027/150/150', lastMessage: 'J’ai une nouvelle pièce pour toi ❤️' },
    { id: '3', name: 'Lisa Vert', avatar: 'https://picsum.photos/id/106/150/150', lastMessage: 'Tu vas adorer celle-ci...' },
  ]);
  const [activeConvId, setActiveConvId] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger l'utilisateur
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Simulation de messages
  useEffect(() => {
    setMessages([
      { id: 1, sender: 'them', content: 'Salut ! J’ai bien reçu ton message.', time: '14:32' },
      { id: 2, sender: 'me', content: 'Super, tu as aimé ?', time: '14:35' },
      { id: 3, sender: 'them', content: 'Oui, j’adore 😍', time: '14:36' },
      { id: 4, sender: 'me', content: 'Je t’envoie bientôt une nouvelle pièce', time: '14:40' },
    ]);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋', '🌹'];

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar Conversations */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(index)}
              className={`p-5 border-b border-zinc-800 flex gap-4 cursor-pointer hover:bg-zinc-900 transition-all ${
                activeConvId === index ? 'bg-zinc-900 border-l-4 border-rose-500' : ''
              }`}
            >
              <img src={conv.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover" />
              <div className="flex-1 min-w-0 pt-1">
                <div className="font-semibold text-white">{conv.name}</div>
                <div className="text-sm text-zinc-400 truncate">{conv.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {/* Header du chat */}
        <div className="p-5 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900">
          <img 
            src={conversations[activeConvId].avatar} 
            alt="" 
            className="w-11 h-11 rounded-2xl object-cover" 
          />
          <div>
            <div className="font-semibold text-lg">{conversations[activeConvId].name}</div>
            <div className="text-emerald-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              En ligne
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-7 bg-zinc-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`chat-bubble max-w-[70%] ${msg.sender === 'me' ? 'chat-bubble-sent' : 'chat-bubble-received'}`}
              >
                {msg.content && <p className="text-[15px] leading-relaxed">{msg.content}</p>}
                {msg.image_url && (
                  <img src={msg.image_url} alt="image" className="rounded-2xl mt-3 max-w-full" />
                )}
                <span className="text-[10px] opacity-70 block mt-2 text-right">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900">
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img src={imagePreview} alt="preview" className="max-h-32 rounded-2xl border border-zinc-700" />
              <button
                onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-3 items-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition text-2xl"
            >
              📷
            </button>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-12 h-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition text-2xl"
            >
              😀
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris ton message..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-500 text-base"
            />

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() && !selectedImage}
              className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 px-8 py-4 rounded-3xl font-medium transition disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-28 left-28 bg-zinc-900 border border-zinc-700 p-5 rounded-3xl grid grid-cols-7 gap-3 shadow-2xl z-50">
              {commonEmojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => insertEmoji(emoji)}
                  className="text-3xl hover:scale-125 active:scale-110 transition"
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
