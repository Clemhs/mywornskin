'use client';

import { useState, useRef } from 'react';

export default function Messages() {
  const [activeConvId, setActiveConvId] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [conversations] = useState([
    { id: 0, name: 'Emma Laurent', avatar: 'https://picsum.photos/id/1011/150/150', lastMessage: 'Tu as reçu mon dernier colis ?' },
    { id: 1, name: 'Sophie Moreau', avatar: 'https://picsum.photos/id/1027/150/150', lastMessage: 'J’ai une nouvelle pièce pour toi ❤️' },
    { id: 2, name: 'Lisa Vert', avatar: 'https://picsum.photos/id/106/150/150', lastMessage: 'Tu vas adorer celle-ci...' },
  ]);

  const [allMessages, setAllMessages] = useState({
    0: [
      { id: 1, sender: 'them', content: 'Salut ! J’ai bien reçu ton message.' },
      { id: 2, sender: 'me', content: 'Super, tu as aimé ?' },
      { id: 3, sender: 'them', content: 'Oui, j’adore 😍' },
    ],
    1: [{ id: 1, sender: 'them', content: 'Coucou, j’ai une nouvelle pièce pour toi !' }],
    2: [{ id: 1, sender: 'them', content: 'Tu vas adorer celle-ci...' }],
  });

  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMessages = allMessages[activeConvId] || [];
  const currentConv = conversations[activeConvId];

  const sendMessage = () => {
    if ((!newMessage.trim() && !selectedImage)) return;

    let imageUrl = null;
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      content: newMessage.trim() || null,
      image_url: imageUrl,
    };

    setAllMessages(prev => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));

    setNewMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😀', '😂', '❤️', '😍', '🥰', '🔥', '👀', '💦', '😘', '🙈', '👍', '😏', '🥵', '💋', '🌹'];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-5xl h-[82vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col md:flex-row">

        {/* Sidebar Conversations */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-zinc-800 flex-col bg-zinc-950 z-50`}>
          <div className="p-6 border-b border-zinc-800 bg-zinc-900">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, index) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConvId(index);
                  setShowSidebar(false);
                }}
                className={`p-5 border-b border-zinc-800 flex gap-4 cursor-pointer hover:bg-zinc-900 transition-all ${
                  activeConvId === index ? 'bg-zinc-900 border-l-4 border-rose-500' : ''
                }`}
              >
                <img src={conv.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0 pt-1">
                  <div className="font-semibold">{conv.name}</div>
                  <div className="text-sm text-zinc-400 truncate">{conv.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900">
            <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden text-3xl pr-4">☰</button>
            <img src={currentConv.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{currentConv.name}</div>
              <div className="text-emerald-400 text-xs">En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-5 py-3 rounded-3xl max-w-[78%] ${msg.sender === 'me' ? 'bg-rose-600 text-white' : 'bg-zinc-800'}`}>
                  {msg.content}
                  {msg.image_url && <img src={msg.image_url} alt="image" className="rounded-2xl mt-3 max-w-full" />}
                </div>
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-4">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="preview" className="max-h-28 rounded-xl" />
                <button 
                  onClick={() => {setImagePreview(null); setSelectedImage(null);}} 
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-3 items-end">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="w-11 h-11 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-2xl transition"
              >
                📷
              </button>

              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                className="w-11 h-11 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-2xl transition"
              >
                😀
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écris ton message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-500"
              />

              <button 
                onClick={sendMessage}
                className="bg-rose-600 hover:bg-rose-500 px-8 py-4 rounded-2xl font-medium whitespace-nowrap"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 p-4 rounded-3xl grid grid-cols-7 gap-3 shadow-2xl z-50">
          {commonEmojis.map((emoji, i) => (
            <button key={i} onClick={() => insertEmoji(emoji)} className="text-3xl hover:scale-125 transition">{emoji}</button>
          ))}
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
    </div>
  );
}
