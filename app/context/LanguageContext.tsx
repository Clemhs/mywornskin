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
    'discover': 'Découvrez des vêtements déjà portés, intimes et uniques',
    'subscribe': 'S’abonner',
    'sell': 'Vendre mes articles',

    // Navigation & Général
    'conversations': 'Conversations',
    'online': 'En ligne maintenant',
    'error': 'Une erreur est survenue',
    'loading': 'Chargement...',

    // Messagerie
    'write_message': 'Écris ton message ou envoie une photo...',
    'send': 'Envoyer',
    'translate_messages': 'Traduire automatiquement les messages',
    'no_messages': 'Aucun message pour l’instant...',

    // Abonnement
    'monthly': 'Mensuel',
    'yearly': 'Annuel',
    'per_month': 'par mois',
    'per_year': 'par an',
    'save': 'Économisez',
    'popular': 'LE PLUS POPULAIRE',
    'subscribe_monthly': 'S’abonner mensuellement',
    'subscribe_yearly': 'S’abonner annuellement',

    // Vendre
    'sell_title': 'Vends tes vêtements portés',
    'sell_description': 'Gagne de l’argent en partageant tes articles intimes',
    'title': 'Titre de l’annonce',
    'description': 'Description',
    'price': 'Prix (€)',
    'size': 'Taille',
    'publish': 'Publier l’annonce',

    // Autres
    'mywornskin': 'MyWornSkin',
    'unique_worn_clothes': 'Vêtements portés avec une histoire',
  },

  en: {
    'welcome': 'Welcome to MyWornSkin',
    'discover': 'Discover intimate and unique already-worn clothes',
    'subscribe': 'Subscribe',
    'sell': 'Sell my items',
    'conversations': 'Conversations',
    'online': 'Online now',
    'error': 'An error occurred',
    'loading': 'Loading...',
    'write_message': 'Write your message or send a photo...',
    'send': 'Send',
    'translate_messages': 'Auto-translate messages',
    'no_messages': 'No messages yet...',
    'monthly': 'Monthly',
    'yearly': 'Yearly',
    'per_month': 'per month',
    'per_year': 'per year',
    'save': 'Save',
    'popular': 'MOST POPULAR',
    'subscribe_monthly': 'Subscribe monthly',
    'subscribe_yearly': 'Subscribe yearly',
    'sell_title': 'Sell your worn clothes',
    'sell_description': 'Make money by sharing your intimate items',
    'title': 'Ad title',
    'description': 'Description',
    'price': 'Price (€)',
    'size': 'Size',
    'publish': 'Publish listing',
    'mywornskin': 'MyWornSkin',
    'unique_worn_clothes': 'Worn clothes with a story',
  },

  es: {
    'welcome': 'Bienvenido a MyWornSkin',
    'discover': 'Descubre ropa íntima y única ya usada',
    'subscribe': 'Suscribirse',
    'sell': 'Vender mis artículos',
    'conversations': 'Conversaciones',
    'online': 'En línea ahora',
    'error': 'Ocurrió un error',
    'loading': 'Cargando...',
    'write_message': 'Escribe tu mensaje o envía una foto...',
    'send': 'Enviar',
    'translate_messages': 'Traducir automáticamente los mensajes',
    'no_messages': 'Aún no hay mensajes...',
    'monthly': 'Mensual',
    'yearly': 'Anual',
    'per_month': 'al mes',
    'per_year': 'al año',
    'save': 'Ahorra',
    'popular': 'MÁS POPULAR',
    'subscribe_monthly': 'Suscribirse mensualmente',
    'subscribe_yearly': 'Suscribirse anualmente',
    'sell_title': 'Vende tu ropa usada',
    'sell_description': 'Gana dinero compartiendo tus artículos íntimos',
    'title': 'Título del anuncio',
    'description': 'Descripción',
    'price': 'Precio (€)',
    'size': 'Talla',
    'publish': 'Publicar anuncio',
    'mywornskin': 'MyWornSkin',
    'unique_worn_clothes': 'Ropa usada con historia',
  },

  de: {
    'welcome': 'Willkommen bei MyWornSkin',
    'discover': 'Entdecke intime und einzigartige bereits getragene Kleidung',
    'subscribe': 'Abonnieren',
    'sell': 'Meine Artikel verkaufen',
    'conversations': 'Gespräche',
    'online': 'Jetzt online',
    'error': 'Ein Fehler ist aufgetreten',
    'loading': 'Wird geladen...',
    'write_message': 'Schreibe deine Nachricht oder sende ein Foto...',
    'send': 'Senden',
    'translate_messages': 'Nachrichten automatisch übersetzen',
    'no_messages': 'Noch keine Nachrichten...',
    'monthly': 'Monatlich',
    'yearly': 'Jährlich',
    'per_month': 'pro Monat',
    'per_year': 'pro Jahr',
    'save': 'Sparen',
    'popular': 'AM BELIEBTESTEN',
    'subscribe_monthly': 'Monatlich abonnieren',
    'subscribe_yearly': 'Jährlich abonnieren',
    'sell_title': 'Verkaufe deine getragene Kleidung',
    'sell_description': 'Verdiene Geld, indem du deine intimen Artikel teilst',
    'title': 'Anzeigentitel',
    'description': 'Beschreibung',
    'price': 'Preis (€)',
    'size': 'Größe',
    'publish': 'Anzeige veröffentlichen',
    'mywornskin': 'MyWornSkin',
    'unique_worn_clothes': 'Getragene Kleidung mit Geschichte',
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
