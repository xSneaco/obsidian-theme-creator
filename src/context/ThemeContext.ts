import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { ThemeState, ThemeAction } from './ThemeProvider';

export interface ThemeContextProps {
  state: ThemeState;
  dispatch: Dispatch<ThemeAction>;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);