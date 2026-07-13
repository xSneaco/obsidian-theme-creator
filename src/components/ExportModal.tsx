import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/useTheme';
import { SECTIONS } from '../theme/sections';
import { getDefaultColors } from '../theme/defaults';
import { generateThemeCSS } from '../theme/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { state } = useTheme();
  const [exportMode, setExportMode] = useState<'dark' | 'light' | 'both'>(state.mode);
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Determine if each mode has been customized
  const defaultDark = useMemo(() => getDefaultColors('dark'), []);
  const defaultLight = useMemo(() => getDefaultColors('light'), []);

  const isDarkCustomized = useMemo(() => {
    return Object.keys(state.darkColors).some(
      (key) => state.darkColors[key] !== defaultDark[key]
    );
  }, [state.darkColors, defaultDark]);

  const isLightCustomized = useMemo(() => {
    return Object.keys(state.lightColors).some(
      (key) => state.lightColors[key] !== defaultLight[key]
    );
  }, [state.lightColors, defaultLight]);

  // Warning text if exporting Both, but only one is customized
  const warningText = useMemo(() => {
    if (exportMode !== 'both') return null;
    if (isDarkCustomized && !isLightCustomized) {
      return "You've only customized dark mode. The other mode will use default colors.";
    }
    if (!isDarkCustomized && isLightCustomized) {
      return "You've only customized light mode. The other mode will use default colors.";
    }
    return null;
  }, [exportMode, isDarkCustomized, isLightCustomized]);

  // Generate CSS content
  const cssContent = useMemo(() => {
    return generateThemeCSS(
      SECTIONS,
      state.darkColors,
      state.lightColors,
      exportMode,
      state.themeName
    );
  }, [state.darkColors, state.lightColors, exportMode, state.themeName]);

  // Token-based CSS Syntax Highlighting using Regex
  const highlightedCodeHtml = useMemo(() => {
    // Escape HTML to prevent injection
    const html = cssContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Match comments, variables, and hex values
    // Group 1: comment /* ... */
    // Group 2: CSS variable --name
    // Group 3: Hex color #rrggbb / #rgb / #rrggbbaa
    const regex = /(\/\*[\s\S]*?\*\/)|(--[a-zA-Z0-9-_]+)|(#[0-9a-fA-F]{3,8})/g;

    return html.replace(regex, (match, p1, p2, p3) => {
      if (p1) return `<span class="text-slate-500 italic">${p1}</span>`;
      if (p2) return `<span class="text-indigo-400 font-semibold">${p2}</span>`;
      if (p3) return `<span class="text-emerald-400 font-mono font-medium">${p3}</span>`;
      return match;
    });
  }, [cssContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.css'; // Always name the file theme.css as per specifications
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl shadow-indigo-950/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">Export Theme CSS</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Generate and install your obsidian stylesheet</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {/* Mode Selector */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Export Mode
            </span>
            <div className="flex gap-4">
              {['dark', 'light', 'both'].map((mode) => (
                <label 
                  key={mode} 
                  className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="export-mode"
                    value={mode}
                    checked={exportMode === mode}
                    onChange={() => setExportMode(mode as 'dark' | 'light' | 'both')}
                    className="accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-300 capitalize">
                    {mode === 'both' ? 'Both Modes' : `${mode} Mode Only`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Warning Banner */}
          {warningText && (
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-950/20 border border-amber-900/60 rounded-xl text-amber-300/90 text-xs">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{warningText}</span>
            </div>
          )}

          {/* CSS Preview Section */}
          <div className="flex-1 flex flex-col min-h-[250px] overflow-hidden">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              CSS Code Preview
            </span>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col font-mono text-xs text-slate-300">
              {/* Preview Bar */}
              <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-semibold select-none">
                <span>theme.css</span>
                <span>CSS</span>
              </div>
              {/* Code scrollable block */}
              <pre className="flex-1 overflow-auto p-4 select-text max-h-[30vh]">
                <code dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }} />
              </pre>
            </div>
          </div>

          {/* Install Instructions */}
          <details className="group border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden transition-all">
            <summary className="flex items-center justify-between p-3.5 text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer select-none">
              <span>View Installation Instructions</span>
              <svg 
                className="w-4 h-4 transform group-open:rotate-180 transition-transform text-slate-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-4 pt-0 border-t border-slate-850/60 text-xs text-slate-400 leading-relaxed">
              Place the downloaded file at <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-indigo-400">.obsidian/themes/{state.themeName.trim() || 'Untitled Theme'}/theme.css</code> inside your vault folder. 
              Then open Obsidian, go to <strong className="text-slate-300">Settings → Appearance → Themes</strong>, and select your custom theme from the list.
            </div>
          </details>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900/50 border-t border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-lg text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Download theme.css
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
