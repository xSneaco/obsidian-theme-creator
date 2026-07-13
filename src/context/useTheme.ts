import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { state, dispatch } = context;

  const setColor = (sectionId: string, hex: string) => {
    dispatch({ type: 'SET_COLOR', sectionId, hex });
  };

  const setMode = (mode: 'dark' | 'light') => {
    dispatch({ type: 'SET_MODE', mode });
  };

  const setThemeName = (name: string) => {
    dispatch({ type: 'SET_THEME_NAME', name });
  };

  const setActiveSection = (sectionId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', sectionId });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return {
    state,
    dispatch,
    setColor,
    setMode,
    setThemeName,
    setActiveSection,
    undo,
    redo,
    reset,
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
  };
}
