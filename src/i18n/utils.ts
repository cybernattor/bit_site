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
  const urlLang = url.searchParams.get('lang') || defaultLang;
  const lang = urlLang in ui ? urlLang as keyof typeof ui : defaultLang;

  return function translatePath(path: string, targetLang?: string) {
    const l = targetLang || lang;
    // Return path with query parameter for language
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}lang=${l}`;
  }
}
