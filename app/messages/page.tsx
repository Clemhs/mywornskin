'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeConvId, setActiveConvId] = useState(0);

  const [conversations] = useState([
    { id: '1', name: 'Emma Laurent', avatar: 'https://picsum.photos/id/1011/150/150', lastMessage: 'Tu as reçu mon dernier colis ?' },
    { id: '2', name: 'Sophie Moreau', avatar: 'https://picsum.photos/id/1027/150/150', lastMessage: 'J’ai une nouvelle pièce pour toi ❤️' },
    { id: '3', name: 'Lisa Vert', avatar: 'https://picsum.photos/id/106/150/150', lastMessage: 'Tu vas adorer celle-ci...' },
  ]);

  const [messages, setMessages] = useState<any[]>([
    { id: 1, sender: 'them', content: 'Salut ! J’ai bien reçu ton message.', time: '14:32' },
    { id: 2, sender: 'me', content: 'Super, tu as aimé ?', time: '14:35' },
    { id: 3, sender: 'them', content: 'Oui, j’adore 😍', time: '14:36' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages]);

  const sendMessage = () => {
    if ((!newMessage.trim() && !selectedImage) || !user) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      content: newMessage.trim() || null,
      image_url: selectedImage ? URL.createObjectURL(selectedImage) : null,
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

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋', '🌹'];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md md:max-w-4xl h-[85vh] md:h-[88vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col md:flex-row">

        {/* Sidebar */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-zinc-800 flex-col bg-zinc-950 z-50`}>
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
            <h1 className="text-2xl font-bold">Messages</h1>
            <button onClick={() => setShowSidebar(false)} className="md:hidden text-3xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, index) => (
              <div
                key={conv.id}
                onClick={() => { setActiveConvId(index); setShowSidebar(false); }}
                className={`p-4 border-b border-zinc-800 flex gap-4 cursor-pointer hover:bg-zinc-900 transition-all ${
                  activeConvId === index ? 'bg-zinc-900 border-l-4 border-rose-500' : ''
                }`}
              >
                <img src={conv.avatar} alt="" className="w-11 h-11 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0 pt-1">
                  <div className="font-semibold text-sm">{conv.name}</div>
                  <div className="text-xs text-zinc-400 truncate">{conv.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900 z-40">
            <button onClick={() => setShowSidebar(true)} className="md:hidden text-3xl pr-3">☰</button>
            <img src={conversations[activeConvId].avatar} alt="" className="w-9 h-9 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{conversations[activeConvId].name}</div>
              <div className="text-emerald-400 text-xs">En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-zinc-950" ref={messagesEndRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`chat-bubble max-w-[85%] ${msg.sender === 'me' ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                  {msg.content && <p>{msg.content}</p>}
                  {msg.image_url && <img src={msg.image_url} alt="sent" className="rounded-2xl mt-3 max-w-full" />}
                  <span className="text-[10px] opacity-70 block mt-2 text-right">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-3 z-50">
            {imagePreview && (
              <div className="mb-2 relative inline-block">
                <img src={imagePreview} alt="preview" className="max-h-20 rounded-xl" />
                <button onClick={() => {setImagePreview(null); setSelectedImage(null);}} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xl transition flex-shrink-0">📷</button>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xl transition flex-shrink-0">😀</button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-4 py-3 text-base focus:outline-none focus:border-rose-500"
              />

              <button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() && !selectedImage}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 px-7 py-3 rounded-3xl font-medium transition disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 p-4 rounded-3xl grid grid-cols-7 gap-3 shadow-2xl z-50">
          {commonEmojis.map((emoji, i) => (
            <button key={i} onClick={() => insertEmoji(emoji)} className="text-3xl hover:scale-125 transition">{emoji}</button>
          ))}
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
    </div>
  );
}
