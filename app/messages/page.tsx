'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type Message = {
  id: number;
  text: string;
  isMine: boolean;
  image?: string;
  time: string;
};

type Conversation = {
  id: number;
  username: string;
  avatar: string;
  lastMessage: string;
  unread: number;
};

const initialConversations: Conversation[] = [
  { id: 1, username: "LilaNoir", avatar: "https://picsum.photos/id/64/128/128", lastMessage: "Tu as reçu ma dernière photo ?", unread: 2 },
  { id: 2, username: "VelvetMuse", avatar: "https://picsum.photos/id/65/128/128", lastMessage: "J’ai adoré ce que tu m’as envoyé ❤️", unread: 0 },
  { id: 3, username: "SatinSecret", avatar: "https://picsum.photos/id/66/128/128", lastMessage: "Quand est-ce que tu remets ça ?", unread: 1 },
];

export default function Messages() {
  const [conversations] = useState(initialConversations);
  const [activeConvId, setActiveConvId] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Salut ! J’ai bien reçu ta pièce, elle est magnifique 😍", isMine: false, time: "14:32" },
    { id: 2, text: "Merci ! Elle est encore imprégnée de mon parfum...", isMine: true, time: "14:35" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const sendMessage = () => {
    if (!newMessage.trim() && !selectedImage) return;

    const newMsg: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      isMine: true,
      image: selectedImage || undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    setSelectedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const commonEmojis = ['❤️', '😍', '🔥', '💋', '🌹', '✨', '👀', '🥰', '😘'];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col h-screen pt-20">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Conversations */}
        <div className="w-80 border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-semibold">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`flex gap-4 p-5 hover:bg-zinc-800 cursor-pointer transition ${activeConvId === conv.id ? 'bg-zinc-800' : ''}`}
              >
                <img src={conv.avatar} alt={conv.username} className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium">@{conv.username}</p>
                    {conv.unread > 0 && (
                      <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{conv.unread}</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-zinc-800 p-5 flex items-center gap-4 bg-zinc-900">
            <img src={activeConv?.avatar} alt="" className="w-11 h-11 rounded-2xl" />
            <div>
              <p className="font-semibold">@{activeConv?.username}</p>
              <p className="text-xs text-emerald-400">En ligne</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.isMine ? 'bg-rose-600' : 'bg-zinc-800'} rounded-3xl px-5 py-3`}>
                  {msg.image && (
                    <img src={msg.image} alt="sent" className="rounded-2xl mb-3 max-w-full" />
                  )}
                  {msg.text && <p className="text-[15px] leading-relaxed">{msg.text}</p>}
                  <p className="text-[10px] text-right mt-1 opacity-70">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-900">
            {selectedImage && (
              <div className="mb-3 flex gap-3">
                <img src={selectedImage} alt="preview" className="h-20 rounded-2xl" />
                <button onClick={() => setSelectedImage(null)} className="text-red-400">Supprimer</button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 flex items-center justify-center text-2xl hover:bg-zinc-800 rounded-2xl transition"
              >
                📸
              </button>

              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-11 h-11 flex items-center justify-center text-2xl hover:bg-zinc-800 rounded-2xl transition"
              >
                🙂
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-2xl px-6 py-3 text-base"
              />

              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim() && !selectedImage}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 px-8 py-3 rounded-2xl font-semibold transition"
              >
                Envoyer
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-3xl p-4 grid grid-cols-5 gap-2 shadow-2xl">
                {commonEmojis.map((emoji, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setNewMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-3xl hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
