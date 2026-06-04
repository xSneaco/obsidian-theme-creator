import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeProvider';
import { useTheme } from './context/useTheme';
import { SECTIONS } from './theme/sections';
import PreviewPane from './components/preview/PreviewPane';
import ConfigPanel from './components/config/ConfigPanel';
import Header from './components/Header';
import ExportModal from './components/ExportModal';

const PRESETS = [
  {
    name: 'Obsidian Classic (Dark)',
    mode: 'dark' as const,
    colors: {
      'bg-primary': '#1e1e1e',
      'bg-secondary': '#202020',
      'bg-tertiary': '#191919',
      'bg-codeblock': '#2b2b2b',
      'bg-tag': '#ffffff1a',
      'text-normal': '#dcddde',
      'text-muted': '#999999',
      'text-accent': '#7f6df2',
      'text-on-accent': '#ffffff',
      'text-heading': '#dcddde',
      'text-inline-code': '#e06c75',
      'interactive-accent': '#7f6df2',
      'border-color': '#333333',
      'scrollbar': '#ffffff33',
      'selection': '#7f6df233',
      'search-highlight': '#ffd40080',
      'bold-color': '#dcddde',
      'italic-color': '#dcddde',
      'tag-text': '#7f6df2',
      'list-marker': '#7f6df2',
    }
  },
  {
    name: 'Obsidian Classic (Light)',
    mode: 'light' as const,
    colors: {
      'bg-primary': '#ffffff',
      'bg-secondary': '#f2f3f5',
      'bg-tertiary': '#e9e9e9',
      'bg-codeblock': '#f4f4f4',
      'bg-tag': '#0000000d',
      'text-normal': '#2e3338',
      'text-muted': '#888888',
      'text-accent': '#705dcf',
      'text-on-accent': '#ffffff',
      'text-heading': '#2e3338',
      'text-inline-code': '#c7254e',
      'interactive-accent': '#705dcf',
      'border-color': '#dcdcdc',
      'scrollbar': '#00000033',
      'selection': '#705dcf33',
      'search-highlight': '#ffd40080',
      'bold-color': '#2e3338',
      'italic-color': '#2e3338',
      'tag-text': '#705dcf',
      'list-marker': '#705dcf',
    }
  },
  {
    name: 'Cyberpunk Neon (Dark)',
    mode: 'dark' as const,
    colors: {
      'bg-primary': '#0d0221',
      'bg-secondary': '#0f084b',
      'bg-tertiary': '#261447',
      'bg-codeblock': '#3d1e6d',
      'bg-tag': '#ff2a7a33',
      'text-normal': '#e2f3f5',
      'text-muted': '#a3b8cc',
      'text-accent': '#00f0ff',
      'text-on-accent': '#0d0221',
      'text-heading': '#39ff14',
      'text-inline-code': '#ff007f',
      'interactive-accent': '#ff0055',
      'border-color': '#3d1e6d',
      'scrollbar': '#ff005566',
      'selection': '#00f0ff33',
      'search-highlight': '#ffe700aa',
      'bold-color': '#ffffff',
      'italic-color': '#00f0ff',
      'tag-text': '#ff0055',
      'list-marker': '#ff0055',
    }
  }
];

function AppContent() {
  const {
    state,
    setMode,
    setActiveSection,
    undo,
    redo,
    canUndo,
    canRedo,
    dispatch
  } = useTheme();

  const [splitPercent, setSplitPercent] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Global Keyboard Listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === 'Escape') {
        setActiveSection(null);
        if (isInput) {
          (target as HTMLInputElement).blur();
        }
        if (isExportModalOpen) {
          setIsExportModalOpen(false);
        }
        return;
      }

      if (isInput) return;

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [undo, redo, canUndo, canRedo, setActiveSection, isExportModalOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      newPercent = Math.max(35, Math.min(75, newPercent));
      setSplitPercent(newPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setMode(preset.mode);
    dispatch({ type: 'LOAD_PRESET', colors: preset.colors });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Premium Header Component */}
      <Header onExportClick={() => setIsExportModalOpen(true)} />

      {/* Main Split Layout Content */}
      <main
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row gap-6 p-6 min-h-0 overflow-y-auto lg:overflow-hidden relative"
        style={isDragging ? { userSelect: 'none' } : undefined}
      >
        {/* Left Column: Live Obsidian Preview + Presets */}
        <div
          className="flex flex-col gap-6 lg:overflow-y-auto lg:h-full w-full lg:flex-shrink-0 lg:pr-2"
          style={isDesktop ? { width: `calc(${splitPercent}% - 12px)` } : undefined}
        >
          {/* Mock Obsidian Preview Pane */}
          <PreviewPane />

          {/* Sub-panels container (Presets & Inspector) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {/* Preset Card */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 flex flex-col gap-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Presets</h2>
              <div className="flex flex-col gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(preset)}
                    className="w-full text-left px-3 py-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all flex items-center justify-between"
                  >
                    <span>{preset.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      preset.mode === 'dark' ? 'bg-indigo-950 text-indigo-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {preset.mode.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active section detailed status */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 flex flex-col gap-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Section Detail</h2>
              {state.activeSection ? (
                (() => {
                  const section = SECTIONS.find(s => s.id === state.activeSection);
                  if (!section) return null;
                  const currentVal = state.colors[section.id] || '';
                  const defaultVal = state.mode === 'dark' ? section.defaultDark : section.defaultLight;
                  return (
                    <div className="flex flex-col gap-3 bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg flex-1 justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-medium">Selected ID:</span>
                          <span className="inline-block px-1.5 py-0.5 text-[9px] bg-slate-800 rounded text-slate-300 font-mono">
                            {section.group}
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-slate-200">{section.id}</div>
                        <div className="text-sm text-slate-300">{section.label}</div>
                        <div className="text-xs text-slate-500">{section.description}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                        <div>
                          <div className="text-[10px] text-slate-500 font-medium">Current Color</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-4 h-4 rounded border border-slate-800" style={{ backgroundColor: currentVal }}></div>
                            <span className="text-xs font-mono font-semibold text-slate-300">{currentVal}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 font-medium">Mode Default</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-4 h-4 rounded border border-slate-800" style={{ backgroundColor: defaultVal }}></div>
                            <span className="text-xs font-mono font-semibold text-slate-400">{defaultVal}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setActiveSection(null)}
                        className="w-full mt-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors font-medium"
                      >
                        Clear Selection
                      </button>
                    </div>
                  );
                })()
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center border border-dashed border-slate-800 rounded-lg p-4">
                  <svg className="w-6 h-6 opacity-40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="text-xs">No section selected</span>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-[150px] mx-auto">
                    Click on any visual region of the preview or a variable to edit it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drag Handle Resizer */}
        {isDesktop && (
          <div
            onMouseDown={handleMouseDown}
            className={`hidden lg:flex items-center justify-center w-2 cursor-col-resize self-stretch hover:bg-indigo-500/50 group select-none transition-colors duration-150 rounded ${
              isDragging ? 'bg-indigo-500/80' : 'bg-slate-900/50'
            }`}
          >
            <div className={`w-[2px] h-8 rounded bg-slate-700 group-hover:bg-indigo-200 transition-colors ${
              isDragging ? 'bg-indigo-200' : ''
            }`} />
          </div>
        )}

        {/* Right Column: Config Panel */}
        <div
          className="flex flex-col lg:h-full w-full lg:flex-shrink-0"
          style={isDesktop ? { width: `calc(${100 - splitPercent}% - 12px)` } : undefined}
        >
          <ConfigPanel />
        </div>
      </main>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
