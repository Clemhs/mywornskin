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
      <div className="w-full max-w-lg h-[85vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-600 rounded-2xl"></div>
          <div>
            <div className="font-semibold">Emma Laurent</div>
            <div className="text-emerald-400 text-xs">En ligne</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-3 rounded-3xl max-w-[80%] ${msg.sender === 'me' ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Zone de saisie */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris ton message..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-rose-500"
            />
            <button 
              onClick={sendMessage}
              className="bg-rose-600 hover:bg-rose-500 px-8 rounded-2xl font-medium"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
