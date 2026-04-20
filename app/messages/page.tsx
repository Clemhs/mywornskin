'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
        loadMessages(user.id);
      }
    };
    checkUser();
  }, [router]);

  const loadMessages = async (userId: string) => {
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        items(title),
        sender:profiles!sender_id(username),
        receiver:profiles!receiver_id(username)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    // Pour simplifier, on envoie un message à tous les créateurs pour le moment
    // On améliorera plus tard pour choisir un destinataire précis

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: user.id, // temporaire - à remplacer par vrai destinataire
      content: newMessage,
      item_id: null
    });

    if (!error) {
      setNewMessage('');
      loadMessages(user.id);
    }
  };

  if (!user) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Messagerie</h1>

        <div className="bg-zinc-900 rounded-3xl p-6 min-h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Aucun message pour le moment</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-2xl ${msg.sender_id === user.id ? 'bg-blue-600 ml-auto' : 'bg-zinc-800'}`}>
                  <p>{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3"
              placeholder="Tape ton message..."
            />
            <button 
              onClick={sendMessage}
              className="bg-white text-black px-8 rounded-2xl font-semibold"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
