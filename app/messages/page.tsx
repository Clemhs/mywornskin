'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showConversations, setShowConversations] = useState(false);

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
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 flex flex-col h-screen overflow-hidden">
      {/* Header Chat */}
      <div className="border-b border-zinc-800 p-4 bg-zinc-900 flex items-center gap-3">
        <button 
          onClick={() => setShowConversations(!showConversations)}
          className="md:hidden text-3xl pr-4"
        >
          ☰
        </button>
        <img src={activeConv?.avatar} alt="" className="w-10 h-10 rounded-2xl" />
        <div className="flex-1">
          <p className="font-semibold">@{activeConv?.username}</p>
          <p className="text-xs text-emerald-400">En ligne</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Conversations */}
        <div className={`w-80 border-r border-zinc-800 bg-zinc-900 flex flex-col absolute md:relative inset-y-0 left-0 z-40 transition-transform duration-300 ${showConversations ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setShowConversations(false);
                }}
                className={`p-5 hover:bg-zinc-800 cursor-pointer flex gap-4 transition ${activeConvId === conv.id ? 'bg-zinc-800' : ''}`}
              >
                <img src={conv.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">@{conv.username}</p>
                    {conv.unread > 0 && <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{conv.unread}</span>}
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-3.5 rounded-3xl ${msg.isMine ? 'bg-rose-600' : 'bg-zinc-800'}`}>
                  {msg.image && <img src={msg.image} alt="" className="rounded-2xl mb-3 max-w-full" />}
                  {msg.text && <p className="text-[15.5px] leading-relaxed">{msg.text}</p>}
                  <p className="text-[10px] text-right mt-1 opacity-70">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            {selectedImage && (
              <div className="mb-3 flex gap-3 items-center bg-zinc-800 p-3 rounded-2xl">
                <img src={selectedImage} alt="preview" className="h-16 rounded-xl" />
                <button onClick={() => setSelectedImage(null)} className="text-red-400">Supprimer</button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 flex items-center justify-center text-2xl hover:bg-zinc-800 rounded-2xl transition flex-shrink-0"
              >
                📸
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-3xl px-5 py-3.5 text-base"
              />

              {/* Flèche design sur mobile */}
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() && !selectedImage}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 w-11 h-11 flex items-center justify-center rounded-2xl text-2xl transition flex-shrink-0 shadow-md"
              >
                <span className="text-white">➤</span>
              </button>
            </div>
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
