import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function translatePath(url: URL) {
  const lang = getLangFromUrl(url);
  return function translatePath(path: string, l: string = lang) {
    // Prevent adding prefix for default language unless explicitly wanted
    if (l === defaultLang) {
      // Remove any existing language prefix if switching to default
      const currentPrefix = `/${lang}/`;
      const cleanPath = path.startsWith(currentPrefix) ? path.substring(currentPrefix.length - 1) : path;
      return cleanPath;
    }
    
    // Add prefix for specific language
    // e.g. path='/about', l='en' => '/en/about'
    // but handle paths that already have a language prefix
    if (Object.keys(ui).some((k) => path.startsWith(`/${k}/`) || path === `/${k}`)) {
       return path.replace(new RegExp(`^\\/(${Object.keys(ui).join('|')})`), `/${l}`);
    }
    
    return `/${l}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
