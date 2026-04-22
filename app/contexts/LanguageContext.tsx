'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'FR' | 'EN' | 'ES' | 'DE';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  FR: {
    home: "Accueil",
    creators: "Créateurs",
    sell: "Vendre",
    messages: "Messages",
    discoverCreators: "Découvrir les créateurs",
    sellItem: "Mettre ma pièce en vente",
    wornClothes: "Vêtements portés",
    intimateStories: "Histoires intimes",
    tracesOfPleasure: "Des traces invisibles de plaisir",
    alreadyWorn: "Des pièces déjà portées.",
    withTheirScent: "Avec leur odeur, leur chaleur, leur histoire.",
  },
  EN: {
    home: "Home",
    creators: "Creators",
    sell: "Sell",
    messages: "Messages",
    discoverCreators: "Discover creators",
    sellItem: "Sell my item",
    wornClothes: "Worn clothes",
    intimateStories: "Intimate stories",
    tracesOfPleasure: "Invisible traces of pleasure",
    alreadyWorn: "Already worn pieces.",
    withTheirScent: "With their scent, their warmth, their story.",
  },
  ES: {
    home: "Inicio",
    creators: "Creadores",
    sell: "Vender",
    messages: "Mensajes",
    discoverCreators: "Descubrir creadores",
    sellItem: "Vender mi artículo",
    wornClothes: "Ropa usada",
    intimateStories: "Historias íntimas",
    tracesOfPleasure: "Huellas invisibles de placer",
    alreadyWorn: "Piezas ya usadas.",
    withTheirScent: "Con su aroma, su calor, su historia.",
  },
  DE: {
    home: "Start",
    creators: "Ersteller",
    sell: "Verkaufen",
    messages: "Nachrichten",
    discoverCreators: "Entdecke Ersteller",
    sellItem: "Mein Item verkaufen",
    wornClothes: "Getragene Kleidung",
    intimateStories: "Intime Geschichten",
    tracesOfPleasure: "Unsichtbare Spuren von Vergnügen",
    alreadyWorn: "Bereits getragene Stücke.",
    withTheirScent: "Mit ihrem Duft, ihrer Wärme, ihrer Geschichte.",
  },
};

type LanguageContextType = {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('FR');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
