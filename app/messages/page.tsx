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
  const [sending, setSending] = useState(false);
  const [translations, setTranslations] = useState<Record<number, string>>({});

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

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: user.id,
        content: newMessage.trim()
      });

    if (!error) {
      setMessages([...messages, {
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

  // Traduction avec une API plus stable (MyMemory)
  const translateMessage = async (text: string, messageId: number) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|fr`
      );
      const data = await response.json();

      if (data.responseData && data.responseData.translatedText) {
        setTranslations(prev => ({
          ...prev,
          [messageId]: data.responseData.translatedText
        }));
      } else {
        alert("Impossible de traduire pour le moment.");
      }
    } catch (err) {
      alert("Erreur de traduction. Vérifie ta connexion internet.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement de la messagerie...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messagerie Privée</h1>
          <span className="text-green-400">● En ligne</span>
        </div>

        <div className="bg-zinc-900 rounded-3xl h-[65vh] flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-20">Aucun message pour l'instant...</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[80%] bg-white text-black rounded-2xl px-5 py-3">
                    <p>{msg.content}</p>

                    {/* Bouton Traduire */}
                    {!translations[msg.id] && (
                      <button 
                        onClick={() => translateMessage(msg.content, msg.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-2 underline block"
                      >
                        Traduire en français
                      </button>
                    )}

                    {translations[msg.id] && (
                      <p className="text-sm text-gray-600 mt-3 border-l-2 border-blue-500 pl-3">
                        Traduction : {translations[msg.id]}
                      </p>
                    )}

                    <p className="text-xs opacity-60 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-zinc-700 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message ici..."
                className="flex-1 bg-zinc-800 text-white rounded-2xl px-6 py-4 focus:outline-none"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-white text-black px-8 rounded-2xl font-bold hover:bg-gray-200 disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
