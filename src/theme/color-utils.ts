/**
 * Normalizes a hex string to #rrggbb format.
 * Handles #rgb, rgb, #rgba, rgba, #rrggbb, rrggbb, #rrggbbaa, rrggbbaa.
 */
function normalizeHex(hex: string): string {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3 || clean.length === 4) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length === 8) {
    clean = clean.slice(0, 6);
  }
  return `#${clean.toLowerCase()}`;
}

/**
 * Converts a hex color string to HSL object.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL components to hex color string.
 */
export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hexStr = Math.round(x * 255).toString(16);
    return hexStr.padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

/**
 * Lightens a hex color by a specified percentage points amount.
 */
export function lighten(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  const newL = Math.max(0, Math.min(100, l + amount));
  return hslToHex(h, s, newL);
}

/**
 * Darkens a hex color by a specified percentage points amount.
 */
export function darken(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  const newL = Math.max(0, Math.min(100, l - amount));
  return hslToHex(h, s, newL);
}

/**
 * Appends alpha channel to hex, returning a 8-digit hex string (#rrggbbaa).
 */
export function withAlpha(hex: string, alpha: number): string {
  const normalized = normalizeHex(hex);
  const clamped = Math.max(0, Math.min(1, alpha));
  const alphaHex = Math.round(clamped * 255).toString(16).padStart(2, '0');
  return `${normalized}${alphaHex}`.toLowerCase();
}

/**
 * Converts a hex color to "r, g, b" string format.
 */
export function hexToRgbString(hex: string): string {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

/**
 * Validates whether a value is a valid hex color string.
 */
export function isValidHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{3}$/.test(value) || 
         /^#?[0-9a-fA-F]{4}$/.test(value) || 
         /^#?[0-9a-fA-F]{6}$/.test(value) || 
         /^#?[0-9a-fA-F]{8}$/.test(value);
}

/**
 * Calculates relative luminance of a hex color.
 */
function getLuminance(hex: string): number {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
