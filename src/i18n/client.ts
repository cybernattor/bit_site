// Client-side i18n utilities for dynamic translation
import { ui, defaultLang, languages } from './ui';

export type Language = keyof typeof ui;
export type TranslationKey = keyof typeof ui[typeof defaultLang];

class I18nClient {
  private currentLang: Language = defaultLang;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Initialize language from localStorage or browser settings
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('user-lang') as Language;
      if (storedLang && storedLang in ui) {
        this.currentLang = storedLang;
      } else {
        // Detect browser language
        const browserLang = navigator.language;
        const preferredLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'ru';
        this.currentLang = preferredLang in ui ? preferredLang : defaultLang;
        localStorage.setItem('user-lang', this.currentLang);
      }
    }
  }

  getCurrentLang(): Language {
    return this.currentLang;
  }

  setLanguage(lang: Language) {
    if (lang in ui && lang !== this.currentLang) {
      this.currentLang = lang;
      localStorage.setItem('user-lang', lang);
      this.notifyListeners();
      this.updateDocumentLanguage();
    }
  }

  translate(key: TranslationKey): string {
    return ui[this.currentLang]?.[key] || ui[defaultLang][key] || key;
  }

  // Subscribe to language changes
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private updateDocumentLanguage() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.currentLang;

      // Update meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        // This would need to be handled per page
      }

      // Update hreflang links
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        const currentPath = window.location.pathname;
        const cleanPath = this.getCleanPath(currentPath);
        canonicalLink.setAttribute('href', `${window.location.origin}${cleanPath}`);
      }
    }
  }

  getCleanPath(pathname: string): string {
    // Remove language prefix from path
    const langPrefixes = Object.keys(ui).join('|');
    const regex = new RegExp(`^\\/(${langPrefixes})(\\/|$)`);
    return pathname.replace(regex, '/') || '/';
  }

  getAlternatePaths(): Record<Language, string> {
    const currentPath = window.location.pathname;
    const cleanPath = this.getCleanPath(currentPath);

    const paths: Record<Language, string> = {} as Record<Language, string>;

    Object.keys(ui).forEach((lang) => {
      const language = lang as Language;
      if (language === defaultLang) {
        paths[language] = cleanPath;
      } else {
        paths[language] = `/${language}${cleanPath}`;
      }
    });

    return paths;
  }

  // Get all available languages
  getLanguages(): typeof languages {
    return languages;
  }
}

// Global instance
export const i18nClient = new I18nClient();

// React-like hook for components
export function useTranslation() {
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    const unsubscribe = i18nClient.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return {
    t: (key: TranslationKey) => i18nClient.translate(key),
    lang: i18nClient.getCurrentLang(),
    setLanguage: (lang: Language) => i18nClient.setLanguage(lang),
    languages: i18nClient.getLanguages()
  };
}

// Helper function for vanilla JS
export function translateText(key: TranslationKey): string {
  return i18nClient.translate(key);
}

// Helper to update all elements with data-i18n attribute
export function updatePageTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n') as TranslationKey;
    if (key) {
      const translatedText = translateText(key);

      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        (element as HTMLInputElement).placeholder = translatedText;
      } else if (element.tagName === 'A' && element.hasAttribute('data-i18n-title')) {
        element.setAttribute('title', translatedText);
      } else {
        element.textContent = translatedText;
      }
    }
  });
}

// Initialize on page load
if (typeof window !== 'undefined') {
  // Update translations on initial load
  document.addEventListener('DOMContentLoaded', updatePageTranslations);

  // Update after Astro view transitions
  document.addEventListener('astro:after-swap', updatePageTranslations);
}

// React namespace declaration for TypeScript
declare namespace React {
  function useState<T>(initialValue: T): [T, (value: T) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
}
