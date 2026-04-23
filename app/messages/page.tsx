'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';

export default function Messages() {
  const { t } = useLanguage();
  const [showConversations, setShowConversations] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Salut, j'adore ton dernier set 😍", isMe: false },
    { id: 2, text: "Merci ! Tu veux que je te montre plus ?", isMe: true },
  ]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const conversations = [
    { id: 0, name: "Lila Noir", avatar: "https://picsum.photos/id/64/128/128", lastMsg: "Tu as reçu ma vidéo ?" },
    { id: 1, name: "Velvet Muse", avatar: "https://picsum.photos/id/65/128/128", lastMsg: "J'ai porté ça hier soir..." },
    { id: 2, name: "Sienna Rose", avatar: "https://picsum.photos/id/66/128/128", lastMsg: "Envoie-moi ta demande 😉" },
  ];

  const sendMessage = () => {
    if (message.trim() || selectedImage) {
      setMessages([...messages, { 
        id: Date.now(), 
        text: message || "📸 Photo envoyée", 
        isMe: true 
      }]);
      setMessage('');
      setSelectedImage(null);
      
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      <div className="h-16 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900 z-50">
        <button 
          onClick={() => setShowConversations(!showConversations)}
          className="md:hidden p-3 text-lg"
        >
          ←
        </button>
        <h1 className="font-semibold text-lg">{t('messages') || "Messages"}</h1>
        <div className="w-8" />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Liste conversations */}
        <div className={`${showConversations ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 absolute md:relative w-full md:w-96 h-full bg-zinc-900 border-r border-zinc-800 transition-transform z-40 md:z-auto overflow-y-auto`}>
          {conversations.map((conv, i) => (
            <div 
              key={i}
              onClick={() => { setSelectedConversation(i); setShowConversations(false); }}
              className={`p-4 border-b border-zinc-800 flex gap-4 cursor-pointer hover:bg-zinc-800 ${selectedConversation === i ? 'bg-zinc-800' : ''}`}
            >
              <Image src={conv.avatar} alt="" width={52} height={52} className="rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{conv.name}</p>
                <p className="text-sm text-zinc-400 truncate">{conv.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Zone chat */}
        <div className="flex-1 flex flex-col h-full">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-5 py-3.5 rounded-3xl ${msg.isMe ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Zone saisie */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900">
            <div className="flex gap-3 items-center">
              <label className="p-3 hover:bg-zinc-800 rounded-2xl cursor-pointer text-2xl">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                📸
              </label>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t('writeMessage') || "Écris un message..."}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-500"
              />

              <button 
                onClick={sendMessage}
                className="w-12 h-12 bg-rose-600 hover:bg-rose-500 rounded-2xl flex items-center justify-center text-2xl transition"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
