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
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const commonEmojis = ['❤️', '😍', '🔥', '💋', '🌹', '✨', '👀', '🥰', '😘'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-zinc-950 flex h-screen pt-20">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-zinc-800 bg-zinc-900 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-5 hover:bg-zinc-800 cursor-pointer flex gap-4 transition ${activeConvId === conv.id ? 'bg-zinc-800' : ''}`}
              >
                <img src={conv.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">@{conv.username}</p>
                    {conv.unread > 0 && <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{conv.unread}</span>}
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header Chat */}
          <div className="p-5 border-b border-zinc-800 bg-zinc-900 flex items-center gap-4">
            <img src={activeConv?.avatar} alt="" className="w-11 h-11 rounded-2xl" />
            <div>
              <p className="font-semibold">@{activeConv?.username}</p>
              <p className="text-xs text-emerald-400">En ligne maintenant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7 bg-zinc-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-5 py-3.5 rounded-3xl ${msg.isMine ? 'bg-rose-600' : 'bg-zinc-800'}`}>
                  {msg.image && <img src={msg.image} alt="image" className="rounded-2xl mb-3 max-w-full" />}
                  {msg.text && <p className="text-[15.5px] leading-relaxed">{msg.text}</p>}
                  <p className={`text-[10px] mt-1 text-right opacity-75 ${msg.isMine ? 'text-white/70' : 'text-zinc-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 bg-zinc-900 border-t border-zinc-800">
            {selectedImage && (
              <div className="mb-4 flex items-center gap-3 bg-zinc-800 p-3 rounded-2xl">
                <img src={selectedImage} alt="preview" className="h-20 rounded-xl" />
                <button onClick={() => setSelectedImage(null)} className="text-red-400 hover:text-red-500">Supprimer</button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 flex items-center justify-center text-3xl hover:bg-zinc-800 rounded-2xl transition"
              >
                📸
              </button>

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-12 flex items-center justify-center text-3xl hover:bg-zinc-800 rounded-2xl transition"
              >
                🙂
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-3xl px-6 py-4"
              />

              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() && !selectedImage}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 px-8 py-4 rounded-3xl font-semibold transition"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
    </div>
  );
}
