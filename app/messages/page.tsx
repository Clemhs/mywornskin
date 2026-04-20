'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
      setLoading(false);
    };
    init();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: user.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender_id: user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString()
      }]);
      setNewMessage('');
    } else {
      alert("Erreur lors de l'envoi du message");
    }

    setSending(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messagerie Privée</h1>

        <div className="bg-zinc-900 rounded-3xl h-[70vh] flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-20">Aucun message pour l'instant...</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%] bg-white text-black rounded-3xl px-5 py-3 rounded-br-none">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-700 bg-zinc-950">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-rose-600 hover:bg-rose-500 px-8 rounded-3xl font-medium disabled:bg-zinc-700"
              >
                {sending ? '...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
