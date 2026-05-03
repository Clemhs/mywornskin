'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es' | 'de';

const translations = {
  fr: {
    home: "Accueil",
    creators: "Créatrices",
    sell: "Vendre",
    messages: "Messages",
    discover: "Découvrir les créatrices",
    sellItem: "Vendre mon vêtement",
    whyJoin: "Pourquoi nous rejoindre ?",
    verified: "Vérifiée",
    subscribe: "S'abonner",
    perMonth: "€/mois",
  },
  en: {
    home: "Home",
    creators: "Creators",
    sell: "Sell",
    messages: "Messages",
    discover: "Discover Creators",
    sellItem: "Sell My Item",
    whyJoin: "Why Join Us?",
    verified: "Verified",
    subscribe: "Subscribe",
    perMonth: "/month",
  },
  es: {
    home: "Inicio",
    creators: "Creadoras",
    sell: "Vender",
    messages: "Mensajes",
    discover: "Descubrir Creadoras",
    sellItem: "Vender Mi Prenda",
    whyJoin: "¿Por qué unirte?",
    verified: "Verificada",
    subscribe: "Suscribirse",
    perMonth: "€/mes",
  },
  de: {
    home: "Start",
    creators: "Creatorinnen",
    sell: "Verkaufen",
    messages: "Nachrichten",
    discover: "Entdecke Creatorinnen",
    sellItem: "Mein Kleidungsstück verkaufen",
    whyJoin: "Warum mitmachen?",
    verified: "Verifiziert",
    subscribe: "Abonnieren",
    perMonth: "€/Monat",
  },
};

interface LanguageContextType {
  lang: Language;
  changeLanguage: (newLang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) setLang(saved);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key: string) => translations[lang][key as keyof typeof translations['fr']] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
