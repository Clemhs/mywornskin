'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

const ADMIN_ID = 'bc985ee6-d9dc-43e0-8069-b34deeea9e24';

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const chatRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (error) console.error("Load error:", error);
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadMessages();
  }, [user]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setErrorMsg('');

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: ADMIN_ID,
      message: newMessage.trim()
    });

    if (error) {
      console.error("Insert Error:", error);
      setErrorMsg(error.message);
      alert("Erreur: " + error.message);
    } else {
      setNewMessage('');
      loadMessages();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-16">
      <div className="max-w-5xl mx-auto h-[78vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 flex flex-col md:flex-row mt-4">

        {/* Sidebar */}
        <div className="w-full md:w-96 border-b md:border-r border-zinc-800 p-6">
          <h2 className="text-3xl font-light mb-6">Messages</h2>
          <div className="bg-zinc-800 rounded-2xl p-5 flex gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-4xl">👨‍💼</div>
            <div>
              <p className="font-semibold text-lg">Support Admin</p>
              <p className="text-green-400 text-sm">En ligne</p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-4 bg-zinc-950">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-3xl">👨‍💼</div>
            <div>
              <p className="font-semibold">Support Admin</p>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.length === 0 ? (
              <p className="text-center text-zinc-500 mt-20">Aucun message pour le moment.<br />Écris-nous !</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-6 py-4 rounded-3xl ${msg.sender_id === user?.id ? 'bg-rose-600' : 'bg-zinc-800'}`}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-zinc-800 bg-zinc-900">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris un message..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={sendMessage}
              className="mt-3 w-full bg-rose-600 py-3 rounded-2xl font-medium"
            >
              Envoyer
            </button>

            {errorMsg && <p className="text-red-400 text-center mt-3 text-sm">{errorMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
