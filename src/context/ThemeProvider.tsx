import { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getDefaultColors } from '../theme/defaults';
import { isValidHex } from '../theme/color-utils';
import { ThemeContext } from './ThemeContext';

export interface ThemeState {
  themeName: string;
  mode: 'dark' | 'light';
  colors: Record<string, string>;       // active colors (section.id -> hex value)
  darkColors: Record<string, string>;   // per-mode dark colors
  lightColors: Record<string, string>;  // per-mode light colors
  history: Record<string, string>[];     // past colors snapshots
  future: Record<string, string>[];      // future colors snapshots for redo
  activeSection: string | null;          // selected section id
}

export type ThemeAction =
  | { type: 'SET_COLOR'; sectionId: string; hex: string }
  | { type: 'SET_MODE'; mode: 'dark' | 'light' }
  | { type: 'SET_THEME_NAME'; name: string }
  | { type: 'SET_ACTIVE_SECTION'; sectionId: string | null }
  | { type: 'LOAD_PRESET'; colors: Record<string, string> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

const LOCAL_STORAGE_KEY = 'obsidian-theme-creator-state';

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_COLOR': {
      const { sectionId, hex } = action;
      // Accept color if it's a valid hex code (allowing 3, 4, 6, or 8 digits)
      if (!isValidHex(hex)) {
        return state;
      }

      // If the color isn't actually changing, avoid pushing to history
      if (state.colors[sectionId] === hex) {
        return state;
      }

      // Add current colors map to history
      const newHistory = [...state.history, state.colors];
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      const newColors = { ...state.colors, [sectionId]: hex };
      return {
        ...state,
        colors: newColors,
        darkColors: state.mode === 'dark' ? newColors : state.darkColors,
        lightColors: state.mode === 'light' ? newColors : state.lightColors,
        history: newHistory,
        future: [], // Clear redo history when a new action is performed
      };
    }

    case 'SET_MODE': {
      const { mode: newMode } = action;
      if (newMode === state.mode) {
        return state;
      }

      // Save the current colors map to the current mode
      const darkColors = state.mode === 'dark' ? state.colors : state.darkColors;
      const lightColors = state.mode === 'light' ? state.colors : state.lightColors;

      // Load from per-mode settings, falling back to defaults for any uncustomized sections
      const defaults = getDefaultColors(newMode);
      const targetColors = newMode === 'dark' ? darkColors : lightColors;
      const newColors = { ...defaults, ...targetColors };

      return {
        ...state,
        mode: newMode,
        colors: newColors,
        darkColors,
        lightColors,
        // Clear history and future stacks when switching modes to avoid mixing dark/light color snapshots
        history: [],
        future: [],
      };
    }

    case 'SET_THEME_NAME': {
      return {
        ...state,
        themeName: action.name,
      };
    }

    case 'SET_ACTIVE_SECTION': {
      return {
        ...state,
        activeSection: action.sectionId,
      };
    }

    case 'LOAD_PRESET': {
      const newHistory = [...state.history, state.colors];
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      const newColors = { ...action.colors };
      return {
        ...state,
        colors: newColors,
        darkColors: state.mode === 'dark' ? newColors : state.darkColors,
        lightColors: state.mode === 'light' ? newColors : state.lightColors,
        history: newHistory,
        future: [],
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) {
        return state;
      }

      const newHistory = [...state.history];
      const previousColors = newHistory.pop()!;
      const newFuture = [state.colors, ...state.future];

      return {
        ...state,
        colors: previousColors,
        darkColors: state.mode === 'dark' ? previousColors : state.darkColors,
        lightColors: state.mode === 'light' ? previousColors : state.lightColors,
        history: newHistory,
        future: newFuture,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }

      const newFuture = [...state.future];
      const nextColors = newFuture.shift()!;
      const newHistory = [...state.history, state.colors];

      return {
        ...state,
        colors: nextColors,
        darkColors: state.mode === 'dark' ? nextColors : state.darkColors,
        lightColors: state.mode === 'light' ? nextColors : state.lightColors,
        history: newHistory,
        future: newFuture,
      };
    }

    case 'RESET': {
      // Revert colors to the current mode defaults
      const defaultColors = getDefaultColors(state.mode);

      // Push current colors to history
      const newHistory = [...state.history, state.colors];
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return {
        ...state,
        colors: defaultColors,
        darkColors: state.mode === 'dark' ? defaultColors : state.darkColors,
        lightColors: state.mode === 'light' ? defaultColors : state.lightColors,
        history: newHistory,
        future: [],
      };
    }

    default:
      return state;
  }
}

function getInitialState(): ThemeState {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  
  let mode: 'dark' | 'light' = 'dark';
  let themeName = '';
  let darkColors = getDefaultColors('dark');
  let lightColors = getDefaultColors('light');
  let colors = darkColors;

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.mode === 'dark' || parsed.mode === 'light') {
        mode = parsed.mode;
      }
      if (typeof parsed.themeName === 'string') {
        themeName = parsed.themeName;
      }
      if (parsed.darkColors) {
        darkColors = { ...darkColors, ...parsed.darkColors };
      } else if (parsed.colors && mode === 'dark') {
        darkColors = { ...darkColors, ...parsed.colors };
      }

      if (parsed.lightColors) {
        lightColors = { ...lightColors, ...parsed.lightColors };
      } else if (parsed.colors && mode === 'light') {
        lightColors = { ...lightColors, ...parsed.colors };
      }

      colors = mode === 'dark' ? darkColors : lightColors;
    } catch (e) {
      console.error('Error restoring state from localStorage', e);
    }
  }

  return {
    themeName,
    mode,
    colors,
    darkColors,
    lightColors,
    history: [],
    future: [],
    activeSection: null,
  };
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, null, getInitialState);

  // Debounced save to localStorage
  useEffect(() => {
    const handler = setTimeout(() => {
      const dataToSave = {
        themeName: state.themeName,
        mode: state.mode,
        darkColors: state.darkColors,
        lightColors: state.lightColors,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state.themeName, state.mode, state.darkColors, state.lightColors]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}
