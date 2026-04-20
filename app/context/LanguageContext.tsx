'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Page d'accueil
    'welcome': 'Bienvenue sur MyWornSkin',
    'discover': 'Découvrez des vêtements portés uniques',
    'subscribe': 'S\'abonner',
    'sell': 'Vendre',

    // Messagerie
    'conversations': 'Conversations',
    'write_message': 'Écris ton message...',
    'send': 'Envoyer',
    'translate_messages': 'Traduire automatiquement les messages',

    // Autres
    'online': 'En ligne maintenant',
    'error': 'Une erreur est survenue',
  },
  en: {
    'welcome': 'Welcome to MyWornSkin',
    'discover': 'Discover unique worn clothes',
    'subscribe': 'Subscribe',
    'sell': 'Sell',
    'conversations': 'Conversations',
    'write_message': 'Write your message...',
    'send': 'Send',
    'translate_messages': 'Auto translate messages',
    'online': 'Online now',
    'error': 'An error occurred',
  },
  es: {
    'welcome': 'Bienvenido a MyWornSkin',
    'discover': 'Descubre ropa usada única',
    'subscribe': 'Suscribirse',
    'sell': 'Vender',
    'conversations': 'Conversaciones',
    'write_message': 'Escribe tu mensaje...',
    'send': 'Enviar',
    'translate_messages': 'Traducir automáticamente los mensajes',
    'online': 'En línea ahora',
    'error': 'Ocurrió un error',
  },
  de: {
    'welcome': 'Willkommen bei MyWornSkin',
    'discover': 'Entdecke einzigartige getragene Kleidung',
    'subscribe': 'Abonnieren',
    'sell': 'Verkaufen',
    'conversations': 'Gespräche',
    'write_message': 'Schreibe deine Nachricht...',
    'send': 'Senden',
    'translate_messages': 'Nachrichten automatisch übersetzen',
    'online': 'Jetzt online',
    'error': 'Ein Fehler ist aufgetreten',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
