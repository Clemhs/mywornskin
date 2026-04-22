'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  isMine: boolean;
  image?: string;
  time: string;
};

const initialMessages: Message[] = [
  { id: 1, text: "Salut ! J’ai bien reçu ta pièce 😍", isMine: false, time: "14:32" },
  { id: 2, text: "Merci ! Elle est encore imprégnée de mon parfum...", isMine: true, time: "14:35" },
];

export default function Messages() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-zinc-950 pt-20 flex flex-col h-screen">
      {/* Header Chat */}
      <div className="border-b border-zinc-800 p-4 bg-zinc-900 flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-700 rounded-2xl"></div>
        <div>
          <p className="font-semibold">@LilaNoir</p>
          <p className="text-xs text-emerald-400">En ligne</p>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-5 py-3 rounded-3xl ${msg.isMine ? 'bg-rose-600' : 'bg-zinc-800'}`}>
              {msg.image && <img src={msg.image} alt="" className="rounded-2xl mb-3 max-w-full" />}
              {msg.text && <p className="text-[15.5px]">{msg.text}</p>}
              <p className="text-[10px] text-right mt-1 opacity-70">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        {selectedImage && (
          <div className="mb-3 flex gap-3 items-center">
            <img src={selectedImage} alt="preview" className="h-16 rounded-xl" />
            <button onClick={() => setSelectedImage(null)} className="text-red-400">×</button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 flex items-center justify-center text-3xl bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
          >
            📸
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Écris ton message..."
            className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-3xl px-5 py-4"
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

      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
    </div>
  );
}
