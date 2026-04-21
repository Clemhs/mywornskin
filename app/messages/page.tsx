'use client';

import { useState } from 'react';

export default function Messages() {
  const [activeConvId, setActiveConvId] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const [conversations] = useState([
    { id: 0, name: 'Emma Laurent', avatar: 'https://picsum.photos/id/1011/150/150', lastMessage: 'Tu as reçu mon dernier colis ?' },
    { id: 1, name: 'Sophie Moreau', avatar: 'https://picsum.photos/id/1027/150/150', lastMessage: 'J’ai une nouvelle pièce pour toi ❤️' },
    { id: 2, name: 'Lisa Vert', avatar: 'https://picsum.photos/id/106/150/150', lastMessage: 'Tu vas adorer celle-ci...' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', content: 'Salut ! J’ai bien reçu ton message.' },
    { id: 2, sender: 'me', content: 'Super, tu as aimé ?' },
    { id: 3, sender: 'them', content: 'Oui, j’adore 😍' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', content: newMessage }]);
    setNewMessage('');
  };

  const currentConv = conversations[activeConvId];

  return (
    <div className="min-h-screen bg-zinc-950 p-2 md:p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl h-[82vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col md:flex-row">

        {/* Sidebar (visible seulement sur PC) */}
        <div className="hidden md:flex w-80 border-r border-zinc-800 flex-col bg-zinc-950">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900">
            <h1 className="text-2xl font-bold">Messages</h1>
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
                  <div className="font-semibold">{conv.name}</div>
                  <div className="text-sm text-zinc-400 truncate">{conv.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900">
            <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden text-3xl pr-4">☰</button>
            <img src={currentConv.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{currentConv.name}</div>
              <div className="text-emerald-400 text-xs">En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-5 py-3 rounded-3xl max-w-[78%] ${msg.sender === 'me' ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Zone de saisie - optimisée pour mobile */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-rose-500"
              />
              <button 
                onClick={sendMessage}
                className="bg-rose-600 hover:bg-rose-500 px-7 py-3.5 rounded-2xl font-medium whitespace-nowrap"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
