'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

const commonEmojis = ['😍', '❤️', '🔥', '👀', '😘', '💦', '✨', '🙈', '🥵', '😏', '🌹', '💋'];

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const chatRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_ID = 'bc985ee6-d9dc-43e0-8069-b34deeea9e24';

  const loadMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    loadMessages();

    const channel = supabase.channel('messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, loadMessages).subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: ADMIN_ID, message: newMessage.trim() });
    setNewMessage('');
    setShowEmoji(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-zinc-900 rounded-3xl overflow-hidden h-[75vh] flex flex-col border border-zinc-700">
          {/* Header chat */}
          <div className="p-5 border-b border-zinc-800 flex items-center gap-4 bg-zinc-950">
            <div className="w-11 h-11 bg-zinc-700 rounded-full flex items-center justify-center text-2xl">👨‍💼</div>
            <div>
              <p className="font-semibold">Support Admin</p>
              <p className="text-xs text-green-400">En ligne</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-950">
            {messages.length === 0 ? (
              <p className="text-center text-zinc-500 mt-20">Aucun message pour le moment.<br />Écris-nous !</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-6 py-4 rounded-3xl ${msg.sender_id === user?.id ? 'bg-rose-600' : 'bg-zinc-800'}`}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-900">
            <div className="flex gap-3">
              <button onClick={() => setShowEmoji(!showEmoji)} className="p-3 hover:bg-zinc-800 rounded-2xl">
                <Smile className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-500"
              />
              <button onClick={sendMessage} className="bg-rose-600 hover:bg-rose-500 px-8 rounded-3xl">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
