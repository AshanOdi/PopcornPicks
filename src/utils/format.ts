// Small display helpers shared across pages.

/** Formats minutes as "2h 15m". */
export function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

/** Turns a language code from TMDb into a name, e.g. "ko" -> "Korean". */
export function formatLanguage(code: string) {
  try {
    return languageNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase(); // unknown or invalid code
  }
}
