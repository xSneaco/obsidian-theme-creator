import { lighten, darken, hexToRgbString } from './color-utils';

/**
 * Derives the CSS variables for a specific theme section given its configured color.
 */
export function deriveSection(sectionId: string, hex: string): Record<string, string> {
  switch (sectionId) {
    case 'bg-primary':
      return {
        '--background-primary': hex,
        '--background-primary-alt': lighten(hex, 5),
        '--background-modifier-form-field': darken(hex, 4),
        '--background-modifier-hover': lighten(hex, 8),
      };
    case 'bg-secondary':
      return {
        '--background-secondary': hex,
        '--background-secondary-alt': lighten(hex, 3),
      };
    case 'bg-tertiary':
      return {
        '--titlebar-background': hex,
        '--titlebar-background-focused': lighten(hex, 3),
      };
    case 'bg-codeblock':
      return {
        '--code-background': hex,
      };
    case 'bg-tag':
      return {
        '--tag-background': hex,
      };
    case 'text-normal':
      return {
        '--text-normal': hex,
      };
    case 'text-muted':
      return {
        '--text-muted': hex,
        '--text-faint': darken(hex, 15),
      };
    case 'text-accent':
      return {
        '--text-accent': hex,
        '--text-accent-hover': lighten(hex, 10),
      };
    case 'text-on-accent':
      return {
        '--text-on-accent': hex,
      };
    case 'text-heading':
      return {
        '--h1-color': hex,
        '--h2-color': hex,
        '--h3-color': hex,
        '--h4-color': hex,
        '--h5-color': hex,
        '--h6-color': hex,
      };
    case 'text-inline-code':
      return {
        '--code-normal': hex,
      };
    case 'interactive-accent':
      return {
        '--interactive-accent': hex,
        '--interactive-accent-hover': lighten(hex, 10),
        '--interactive-accent-rgb': hexToRgbString(hex),
      };
    case 'border-color':
      return {
        '--background-modifier-border': hex,
        '--background-modifier-border-hover': lighten(hex, 10),
      };
    case 'scrollbar':
      return {
        '--scrollbar-thumb-bg': hex,
      };
    case 'selection':
      return {
        '--text-selection': hex,
      };
    case 'search-highlight':
      return {
        '--text-highlight-bg': hex,
      };
    case 'bold-color':
      return {
        '--bold-color': hex,
      };
    case 'italic-color':
      return {
        '--italic-color': hex,
      };
    case 'tag-text':
      return {
        '--tag-color': hex,
      };
    case 'list-marker':
      return {
        '--list-marker-color': hex,
      };
    default:
      return {};
  }
}
