import { SECTIONS } from './sections';

/**
 * Returns a key-value map of section IDs to their default colors for the chosen mode.
 */
export function getDefaultColors(mode: 'dark' | 'light'): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const section of SECTIONS) {
    colors[section.id] = mode === 'dark' ? section.defaultDark : section.defaultLight;
  }
  return colors;
}
