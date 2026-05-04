'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

const ADMIN_ID = 'bc985ee6-d9dc-43e0-8069-b34deeea9e24';
const commonEmojis = ['😍', '❤️', '🔥', '👀', '😘', '💦', '✨', '🙈', '🥵', '😏', '🌹', '💋'];

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const chatRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Charger les conversations simplement
  const loadConversations = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, content, created_at')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    const convMap = new Map();

    data?.forEach(msg => {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          id: otherId,
          username: otherId === ADMIN_ID ? "Support Admin" : `Utilisateur ${otherId.slice(0,8)}...`,
          avatar_url: null,
          lastMessage: msg.content?.length > 45 ? msg.content.substring(0, 42) + '...' : msg.content,
        });
      }
    });

    setConversations(Array.from(convMap.values()));
  };

  const loadMessagesWith = async (otherId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const openConversation = (conv: any) => {
    setSelectedConv(conv);
    loadMessagesWith(conv.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedConv) return;

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedConv.id,
      content: newMessage.trim()
    });

    setNewMessage('');
    loadMessagesWith(selectedConv.id);
    loadConversations();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedConv) return;

    setUploading(true);
    const fileName = `${Date.now()}-${user.id}.${file.name.split('.').pop()}`;

    const { error } = await supabase.storage.from('messages').upload(fileName, file);
    if (error) {
      alert("Erreur upload");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('messages').getPublicUrl(fileName);

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedConv.id,
      content: `[IMAGE]${urlData.publicUrl}`
    });

    setUploading(false);
    e.target.value = '';
    loadMessagesWith(selectedConv.id);
  };

  const addEmoji = (emoji: string) => setNewMessage(prev => prev + emoji);

  return (
    <div className="min-h-screen bg-zinc-950 pt-16">
      <div className="max-w-6xl mx-auto h-[80vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 flex mt-4 shadow-2xl">
        
        {/* Sidebar */}
        <div className="w-96 border-r border-zinc-800 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-3xl font-light">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {conversations.length === 0 ? (
              <p className="text-center text-zinc-500 mt-10">Aucune conversation pour le moment</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`flex gap-4 p-4 rounded-2xl mb-2 cursor-pointer hover:bg-zinc-800 transition-all ${selectedConv?.id === conv.id ? 'bg-zinc-800' : ''}`}
                >
                  <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-2xl">
                    {conv.id === ADMIN_ID ? '👨‍💼' : '👤'}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="font-semibold truncate">{conv.username}</p>
                    <p className="text-sm text-zinc-400 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-3xl">
                  {selectedConv.id === ADMIN_ID ? '👨‍💼' : '👤'}
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedConv.username}</p>
                </div>
              </div>

              <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
                {messages.length === 0 ? (
                  <p className="text-center text-zinc-500 mt-20">Aucun message</p>
                ) : (
                  messages.map((msg) => {
                    const isImage = msg.content?.startsWith('[IMAGE]');
                    const imageUrl = isImage ? msg.content.replace('[IMAGE]', '') : null;

                    return (
                      <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-6 py-4 rounded-3xl ${msg.sender_id === user?.id ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                          {isImage ? <img src={imageUrl} className="max-w-full rounded-2xl" /> : <p>{msg.content}</p>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

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

                  <button onClick={sendMessage} disabled={!newMessage.trim() || uploading} className="bg-rose-600 hover:bg-rose-500 px-8 py-4 rounded-3xl disabled:opacity-50">
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {showEmoji && (
                  <div className="mt-4 bg-zinc-800 border border-zinc-700 rounded-3xl p-4 grid grid-cols-6 gap-3">
                    {commonEmojis.map((emoji, i) => (
                      <button key={i} onClick={() => addEmoji(emoji)} className="text-3xl hover:scale-125 transition">
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              Sélectionne une conversation à gauche
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
