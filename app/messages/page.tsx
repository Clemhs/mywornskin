'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const defaultAvatar = "https://picsum.photos/id/64/128/128";

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
    if ((!newMessage.trim() && !selectedImage) || !user) return;

    setSending(true);

    let imageUrl = null;
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: user.id,
        content: newMessage.trim() || null,
        image_url: imageUrl
      });

    if (!error) {
      setMessages([...messages, {
        id: Date.now(),
        sender_id: user.id,
        content: newMessage.trim() || null,
        image_url: imageUrl,
        created_at: new Date().toISOString()
      }]);
      setNewMessage('');
      setSelectedImage(null);
      setImagePreview(null);
    } else {
      alert("Erreur lors de l'envoi du message");
    }

    setSending(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
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

        <div className="bg-zinc-900 rounded-3xl h-[70vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Header avec avatar */}
          <div className="border-b border-zinc-700 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20">
              <Image src={defaultAvatar} alt="Avatar" width={48} height={48} className="object-cover" />
            </div>
            <div>
              <p className="font-semibold">Créateur / Utilisateur</p>
              <p className="text-xs text-green-400">En ligne maintenant</p>
            </div>
          </div>

          {/* Zone des messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-950">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-20">Aucun message pour l'instant...</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex justify-end group">
                  <div className="max-w-[75%]">
                    <div className="bg-white text-black rounded-3xl px-5 py-3 rounded-br-none">
                      {msg.content && <p className="text-[15px]">{msg.content}</p>}
                      {msg.image_url && (
                        <div className="mt-3 rounded-2xl overflow-hidden">
                          <Image src={msg.image_url} alt="Image envoyée" width={300} height={200} className="object-cover" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 text-right pr-2">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Zone d'écriture */}
          <div className="border-t border-zinc-700 p-4 bg-zinc-900">
            {imagePreview && (
              <div className="mb-3 flex gap-3 items-center">
                <div className="relative">
                  <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded-2xl object-cover" />
                  <button 
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center text-2xl transition">
                  📷
                </div>
              </label>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message ici..."
                className="flex-1 bg-zinc-800 text-white rounded-3xl px-6 py-4 focus:outline-none text-[15px]"
                disabled={sending}
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!newMessage.trim() && !selectedImage)}
                className="bg-white text-black px-8 rounded-3xl font-bold hover:bg-gray-200 disabled:opacity-50 transition"
              >
                {sending ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
