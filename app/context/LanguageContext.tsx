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
    // Navigation & Header
    'mywornskin': 'MyWornSkin',
    'home': 'Accueil',
    'subscribe': 'S’abonner',
    'sell': 'Vendre',
    'messages': 'Messages',
    'logout': 'Se déconnecter',
    'profile': 'Profil',

    // Page d'accueil
    'welcome': 'Bienvenue sur MyWornSkin',
    'discover': 'Découvrez des vêtements déjà portés, intimes et uniques',
    'unique_worn_clothes': 'Vêtements portés avec une histoire',
    'start_journey': 'Commencer l’aventure',

    // Abonnement
    'monthly': 'Mensuel',
    'yearly': 'Annuel',
    'per_month': 'par mois',
    'per_year': 'par an',
    'save': 'Économisez',
    'popular': 'LE PLUS POPULAIRE',
    'subscribe_monthly': 'S’abonner mensuellement',
    'subscribe_yearly': 'S’abonner annuellement',
    'access_exclusive': 'Accédez à du contenu exclusif',

    // Vendre
    'sell_title': 'Vends tes vêtements portés',
    'sell_description': 'Gagne de l’argent en partageant tes articles intimes',
    'title': 'Titre de l’annonce',
    'description': 'Description',
    'price': 'Prix (€)',
    'size': 'Taille',
    'publish': 'Publier l’annonce',
    'add_photos': 'Ajouter des photos',

    // Messagerie
    'conversations': 'Conversations',
    'online': 'En ligne maintenant',
    'write_message': 'Écris ton message ou envoie une photo...',
    'send': 'Envoyer',
    'translate_messages': 'Traduire automatiquement les messages',
    'no_messages': 'Aucun message pour l’instant...',
    'type_message': 'Tape ton message ici',

    // Erreurs & Statuts
    'error': 'Une erreur est survenue',
    'loading': 'Chargement...',
    'success': 'Opération réussie',
    'cancel': 'Annuler',
    'close': 'Fermer',
    'uploading': 'Upload en cours...',

    // Auth
    'login': 'Se connecter',
    'signup': 'S’inscrire',
    'email': 'Email',
    'password': 'Mot de passe',

    // Footer
    'footer_text': 'MyWornSkin © 2026 — Vêtements portés avec passion',

    // Autres utiles
    'back': 'Retour',
    'delete': 'Supprimer',
    'edit': 'Modifier',
    'save': 'Enregistrer',
    'confirm': 'Confirmer',
    'yes': 'Oui',
    'no': 'Non',
  },

  en: {
    'mywornskin': 'MyWornSkin',
    'home': 'Home',
    'subscribe': 'Subscribe',
    'sell': 'Sell',
    'messages': 'Messages',
    'logout': 'Logout',
    'profile': 'Profile',
    'welcome': 'Welcome to MyWornSkin',
    'discover': 'Discover intimate and unique already-worn clothes',
    'unique_worn_clothes': 'Worn clothes with a story',
    'start_journey': 'Start the journey',
    'monthly': 'Monthly',
    'yearly': 'Yearly',
    'per_month': 'per month',
    'per_year': 'per year',
    'save': 'Save',
    'popular': 'MOST POPULAR',
    'subscribe_monthly': 'Subscribe monthly',
    'subscribe_yearly': 'Subscribe yearly',
    'access_exclusive': 'Access exclusive content',
    'sell_title': 'Sell your worn clothes',
    'sell_description': 'Make money by sharing your intimate items',
    'title': 'Ad title',
    'description': 'Description',
    'price': 'Price (€)',
    'size': 'Size',
    'publish': 'Publish listing',
    'add_photos': 'Add photos',
    'conversations': 'Conversations',
    'online': 'Online now',
    'write_message': 'Write your message or send a photo...',
    'send': 'Send',
    'translate_messages': 'Auto-translate messages',
    'no_messages': 'No messages yet...',
    'type_message': 'Type your message here',
    'error': 'An error occurred',
    'loading': 'Loading...',
    'success': 'Success',
    'cancel': 'Cancel',
    'close': 'Close',
    'uploading': 'Uploading...',
    'login': 'Login',
    'signup': 'Sign up',
    'email': 'Email',
    'password': 'Password',
    'footer_text': 'MyWornSkin © 2026 — Worn clothes with passion',
    'back': 'Back',
    'delete': 'Delete',
    'edit': 'Edit',
    'save': 'Save',
    'confirm': 'Confirm',
    'yes': 'Yes',
    'no': 'No',
  },

  es: {
    'mywornskin': 'MyWornSkin',
    'home': 'Inicio',
    'subscribe': 'Suscribirse',
    'sell': 'Vender',
    'messages': 'Mensajes',
    'logout': 'Cerrar sesión',
    'profile': 'Perfil',
    'welcome': 'Bienvenido a MyWornSkin',
    'discover': 'Descubre ropa íntima y única ya usada',
    'unique_worn_clothes': 'Ropa usada con historia',
    'start_journey': 'Comenzar la aventura',
    'monthly': 'Mensual',
    'yearly': 'Anual',
    'per_month': 'al mes',
    'per_year': 'al año',
    'save': 'Ahorra',
    'popular': 'MÁS POPULAR',
    'subscribe_monthly': 'Suscribirse mensualmente',
    'subscribe_yearly': 'Suscribirse anualmente',
    'access_exclusive': 'Accede a contenido exclusivo',
    'sell_title': 'Vende tu ropa usada',
    'sell_description': 'Gana dinero compartiendo tus artículos íntimos',
    'title': 'Título del anuncio',
    'description': 'Descripción',
    'price': 'Precio (€)',
    'size': 'Talla',
    'publish': 'Publicar anuncio',
    'add_photos': 'Añadir fotos',
    'conversations': 'Conversaciones',
    'online': 'En línea ahora',
    'write_message': 'Escribe tu mensaje o envía una foto...',
    'send': 'Enviar',
    'translate_messages': 'Traducir automáticamente los mensajes',
    'no_messages': 'Aún no hay mensajes...',
    'type_message': 'Escribe tu mensaje aquí',
    'error': 'Ocurrió un error',
    'loading': 'Cargando...',
    'success': 'Éxito',
    'cancel': 'Cancelar',
    'close': 'Cerrar',
    'uploading': 'Subiendo...',
    'login': 'Iniciar sesión',
    'signup': 'Registrarse',
    'email': 'Correo electrónico',
    'password': 'Contraseña',
    'footer_text': 'MyWornSkin © 2026 — Ropa usada con pasión',
    'back': 'Volver',
    'delete': 'Eliminar',
    'edit': 'Editar',
    'save': 'Guardar',
    'confirm': 'Confirmar',
    'yes': 'Sí',
    'no': 'No',
  },

  de: {
    'mywornskin': 'MyWornSkin',
    'home': 'Start',
    'subscribe': 'Abonnieren',
    'sell': 'Verkaufen',
    'messages': 'Nachrichten',
    'logout': 'Abmelden',
    'profile': 'Profil',
    'welcome': 'Willkommen bei MyWornSkin',
    'discover': 'Entdecke intime und einzigartige bereits getragene Kleidung',
    'unique_worn_clothes': 'Getragene Kleidung mit Geschichte',
    'start_journey': 'Die Reise beginnen',
    'monthly': 'Monatlich',
    'yearly': 'Jährlich',
    'per_month': 'pro Monat',
    'per_year': 'pro Jahr',
    'save': 'Sparen',
    'popular': 'AM BELIEBTESTEN',
    'subscribe_monthly': 'Monatlich abonnieren',
    'subscribe_yearly': 'Jährlich abonnieren',
    'access_exclusive': 'Zu exklusiven Inhalten',
    'sell_title': 'Verkaufe deine getragene Kleidung',
    'sell_description': 'Verdiene Geld, indem du deine intimen Artikel teilst',
    'title': 'Anzeigentitel',
    'description': 'Beschreibung',
    'price': 'Preis (€)',
    'size': 'Größe',
    'publish': 'Anzeige veröffentlichen',
    'add_photos': 'Fotos hinzufügen',
    'conversations': 'Gespräche',
    'online': 'Jetzt online',
    'write_message': 'Schreibe deine Nachricht oder sende ein Foto...',
    'send': 'Senden',
    'translate_messages': 'Nachrichten automatisch übersetzen',
    'no_messages': 'Noch keine Nachrichten...',
    'type_message': 'Schreibe deine Nachricht hier',
    'error': 'Ein Fehler ist aufgetreten',
    'loading': 'Wird geladen...',
    'success': 'Erfolg',
    'cancel': 'Abbrechen',
    'close': 'Schließen',
    'uploading': 'Hochladen...',
    'login': 'Anmelden',
    'signup': 'Registrieren',
    'email': 'E-Mail',
    'password': 'Passwort',
    'footer_text': 'MyWornSkin © 2026 — Getragene Kleidung mit Leidenschaft',
    'back': 'Zurück',
    'delete': 'Löschen',
    'edit': 'Bearbeiten',
    'save': 'Speichern',
    'confirm': 'Bestätigen',
    'yes': 'Ja',
    'no': 'Nein',
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
