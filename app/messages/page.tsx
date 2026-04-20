'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, []);

  // Pour l'instant on simule quelques messages (on ajoutera la vraie table plus tard)
  useEffect(() => {
    if (user) {
      setMessages([
        { id: 1, from: "Créatrice", text: "Salut ! Tu aimes mes pièces ?", time: "14:32" },
        { id: 2, from: "Toi", text: "Oui beaucoup, surtout la dernière 😍", time: "14:35" },
      ]);
    }
  }, [user]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      from: "Toi",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setNewMessage('');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messagerie Privée</h1>
          <span className="text-green-400">● En ligne</span>
        </div>

        <div className="bg-zinc-900 rounded-3xl h-[60vh] flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.from === "Toi" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.from === "Toi" ? "bg-white text-black" : "bg-zinc-800"}`}>
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-60 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-zinc-700 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris un message..."
                className="flex-1 bg-zinc-800 text-white rounded-2xl px-6 py-4 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-white text-black px-8 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          Messagerie privée • Les créateurs répondent généralement sous 24h
        </div>
      </div>
    </div>
  );
}'use client';

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
