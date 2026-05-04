'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

const ADMIN_ID = 'bc985ee6-d9dc-43e0-8069-b34deeea9e24';
const commonEmojis = ['😍', '❤️', '🔥', '👀', '😘', '💦', '✨', '🙈', '🥵', '😏', '🌹', '💋'];

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const chatRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (user) loadMessages();
  }, [user]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: ADMIN_ID,
      content: newMessage.trim()   // ← Correction ici
    });

    if (!error) {
      setNewMessage('');
      loadMessages();
    } else {
      alert("Erreur: " + error.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${user.id}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('messages')
      .upload(fileName, file);

    if (uploadError) {
      alert("Erreur upload");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('messages').getPublicUrl(fileName);

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: ADMIN_ID,
      content: `[IMAGE]${urlData.publicUrl}`   // ← Correction ici
    });

    setUploading(false);
    e.target.value = '';
    loadMessages();
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-16">
      <div className="max-w-5xl mx-auto h-[78vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 flex flex-col md:flex-row mt-4 shadow-2xl">
        
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-3xl">👨‍💼</div>
            <div>
              <p className="font-semibold">Support Admin</p>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.length === 0 ? (
              <p className="text-center text-zinc-500 mt-20">Aucun message pour le moment.<br />Écris-nous !</p>
            ) : (
              messages.map((msg) => {
                const isImage = msg.content?.startsWith('[IMAGE]');
                const imageUrl = isImage ? msg.content.replace('[IMAGE]', '') : null;

                return (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-6 py-4 rounded-3xl ${msg.sender_id === user?.id ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                      {isImage ? (
                        <img src={imageUrl} alt="Image" className="max-w-full rounded-2xl" />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-900">
            <div className="flex gap-3 items-center">
              <label className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <ImageIcon className="w-6 h-6" />
              </label>

              <button onClick={() => setShowEmoji(!showEmoji)} className="p-4 hover:bg-zinc-800 rounded-2xl cursor-pointer">
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
                disabled={!newMessage.trim() || uploading}
                className="bg-rose-600 hover:bg-rose-500 px-8 py-4 rounded-3xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {showEmoji && (
              <div className="mt-4 bg-zinc-800 border border-zinc-700 rounded-3xl p-4 grid grid-cols-6 gap-3">
                {commonEmojis.map((emoji, i) => (
                  <button key={i} onClick={() => addEmoji(emoji)} className="text-3xl hover:scale-125">
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
