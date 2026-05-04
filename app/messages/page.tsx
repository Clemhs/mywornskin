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
  }, [user]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: ADMIN_ID,
      message: newMessage.trim()
    });

    setNewMessage('');
    setShowEmoji(false);
    loadMessages();
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`📸 Photo sélectionnée : ${file.name}\n\nL'upload réel sera disponible très bientôt.`);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-16">
      <div className="flex items-center justify-center p-4">
        <div className="hidden md:flex w-full max-w-5xl h-[78vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl">

          {/* Sidebar */}
          <div className="w-96 border-r border-zinc-800 flex flex-col">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-3xl font-light tracking-wider">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="p-4 bg-zinc-800 rounded-2xl flex gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-3xl">👨‍💼</div>
                <div>
                  <p className="font-semibold">Support Admin</p>
                  <p className="text-sm text-zinc-400">Équipe MyWornSkin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-4 bg-zinc-950">
              <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-3xl">👨‍💼</div>
              <div>
                <p className="font-semibold">Support Admin</p>
                <p className="text-xs text-green-400">En ligne</p>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
              {messages.length === 0 ? (
                <p className="text-center text-zinc-500 mt-20">Aucun message pour le moment.<br />Écris-nous !</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-6 py-4 rounded-3xl ${msg.sender_id === user?.id ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t border-zinc-800 bg-zinc-900">
              <div className="flex gap-3 items-center">
                <label className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  <ImageIcon className="w-6 h-6" />
                </label>

                <button 
                  onClick={() => setShowEmoji(!showEmoji)} 
                  className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer"
                >
                  <Smile className="w-6 h-6" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Écris ton message..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-rose-500"
                />

                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-rose-600 hover:bg-rose-500 px-8 py-4 rounded-3xl disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {showEmoji && (
                <div className="mt-3 bg-zinc-800 border border-zinc-700 rounded-3xl p-4 grid grid-cols-6 gap-3">
                  {commonEmojis.map((emoji, i) => (
                    <button 
                      key={i} 
                      onClick={() => addEmoji(emoji)} 
                      className="text-3xl hover:scale-125 transition-transform p-2"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
