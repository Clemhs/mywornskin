'use client';

import { useState } from 'react';

export default function Messages() {
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

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[82vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col md:flex-row">

        {/* Sidebar Conversations */}
        <div className="hidden md:flex w-80 border-r border-zinc-800 flex-col bg-zinc-950">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="p-4 bg-zinc-900 rounded-2xl mb-2 cursor-pointer">
              <div className="font-semibold">Emma Laurent</div>
              <div className="text-sm text-zinc-400">Tu as reçu mon dernier colis ?</div>
            </div>
            <div className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer">
              <div className="font-semibold">Sophie Moreau</div>
              <div className="text-sm text-zinc-400">J’ai une nouvelle pièce pour toi ❤️</div>
            </div>
          </div>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900">
            <div className="w-9 h-9 bg-rose-600 rounded-2xl"></div>
            <div>
              <div className="font-semibold">Emma Laurent</div>
              <div className="text-emerald-400 text-xs">En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-5 py-3 rounded-3xl max-w-[75%] ${msg.sender === 'me' ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-500"
              />
              <button 
                onClick={sendMessage}
                className="bg-rose-600 hover:bg-rose-500 px-8 py-4 rounded-2xl font-medium"
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
