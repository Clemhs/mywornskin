'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Send, Image as ImageIcon, Smile } from 'lucide-react';

const commonEmojis = ['😍', '❤️', '🔥', '👀', '😘', '💦', '✨', '🙈', '🥵', '😏', '🌹', '💋'];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const conversations = [
    { id: 0, name: "Lila Noir", avatar: "https://picsum.photos/id/64/128/128", lastMsg: "Tu as reçu ma vidéo ?" },
    { id: 1, name: "Velvet Muse", avatar: "https://picsum.photos/id/65/128/128", lastMsg: "J'ai porté ça hier soir..." },
    { id: 2, name: "Sienna Rose", avatar: "https://picsum.photos/id/66/128/128", lastMsg: "Envoie-moi ta demande 😉" },
  ];

  const [allMessages, setAllMessages] = useState({
    0: [
      { id: 1, text: "Salut, j'adore ton dernier set 😍", isMe: false },
      { id: 2, text: "Merci ! Tu veux que je te montre plus ?", isMe: true },
    ],
    1: [{ id: 1, text: "La culotte est arrivée...", isMe: false }],
    2: [{ id: 1, text: "Tu es dispo pour une commande ?", isMe: false }]
  });

  const currentMessages = allMessages[selectedConversation as keyof typeof allMessages] || [];

  const sendMessage = () => {
    if (message.trim()) {
      setAllMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), { id: Date.now(), text: message, isMe: true }]
      }));
      setMessage('');
      setShowEmoji(false);
    }
  };

  const addEmoji = (emoji: string) => setMessage(prev => prev + emoji);

  const sendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAllMessages(prev => ({
          ...prev,
          [selectedConversation]: [...(prev[selectedConversation] || []), { id: Date.now(), text: "📸 Photo envoyée", isMe: true, image: ev.target?.result as string }]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [selectedConversation, currentMessages.length]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-5xl mx-auto px-6 h-[calc(100vh-5rem)] flex flex-col md:flex-row overflow-hidden">

        {/* Sidebar Conversations */}
        <div className="w-full md:w-96 border-r border-zinc-800 flex flex-col bg-zinc-900 md:block">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-light tracking-widest">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, index) => (
              <div
                key={index}
                onClick={() => setSelectedConversation(index)}
                className={`p-5 flex gap-4 cursor-pointer hover:bg-zinc-800 transition-colors border-b border-zinc-800 ${selectedConversation === index ? 'bg-zinc-800' : ''}`}
              >
                <Image src={conv.avatar} alt="" width={52} height={52} className="rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{conv.name}</p>
                  <p className="text-sm text-zinc-400 truncate">{conv.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-5 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900">
            <Image src={conversations[selectedConversation].avatar} alt="" width={48} height={48} className="rounded-full" />
            <div>
              <p className="font-semibold">{conversations[selectedConversation].name}</p>
              <p className="text-xs text-green-400">En ligne maintenant</p>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-6 py-4 rounded-3xl ${msg.isMe ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                  {msg.text}
                  {msg.image && <img src={msg.image} alt="sent" className="mt-3 rounded-2xl max-w-full" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-900 relative">
            {showEmoji && (
              <div className="absolute bottom-20 left-6 bg-zinc-800 border border-zinc-700 rounded-3xl p-5 grid grid-cols-6 gap-4 shadow-2xl z-50">
                {commonEmojis.map((emoji, i) => (
                  <button key={i} onClick={() => addEmoji(emoji)} className="text-4xl hover:scale-125 transition-transform">
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 items-center">
              <label className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={sendImage} />
                <ImageIcon className="w-6 h-6" />
              </label>
              <button onClick={() => setShowEmoji(!showEmoji)} className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer">
                <Smile className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-500"
              />
              <button 
                onClick={sendMessage}
                className="w-14 h-14 bg-rose-600 hover:bg-rose-500 rounded-2xl flex items-center justify-center transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
