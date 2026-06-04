import React, { useState, useEffect, useRef } from 'react';
import type { ThemeSection } from '../../theme/sections';

const HEX_VALIDATION_REGEX = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

interface ColorInputProps {
  section: ThemeSection;
  currentColor: string;
  defaultColor: string;
  isActive: boolean;
  onSelect: () => void;
  setColor: (sectionId: string, hex: string) => void;
}

export function ColorInput({
  section,
  currentColor,
  defaultColor,
  isActive,
  onSelect,
  setColor,
}: ColorInputProps) {
  const [localHex, setLocalHex] = useState(currentColor);
  const [isValid, setIsValid] = useState(true);
  const debounceTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local text in sync with global color state changes (e.g. undo/redo or preset loads)
  useEffect(() => {
    setLocalHex(currentColor);
    setIsValid(true);
  }, [currentColor]);

  // Focus and select the text input when the section becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      // Use select to make it easy to overwrite the hex value
      inputRef.current.select();
    }
  }, [isActive]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalHex(val);

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    const valid = HEX_VALIDATION_REGEX.test(val);
    setIsValid(valid);

    if (valid) {
      debounceTimer.current = window.setTimeout(() => {
        let normalized = val.trim();
        if (!normalized.startsWith('#')) {
          normalized = '#' + normalized;
        }
        setColor(section.id, normalized.toLowerCase());
      }, 300);
    }
  };

  const handleSwatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalHex(val);
    setIsValid(true);
    setColor(section.id, val.toLowerCase());
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setColor(section.id, defaultColor);
  };

  // Normalizes the value for the native color picker (must be exact 7-char lowercase hex: #rrggbb)
  const getSwatchValue = (hex: string) => {
    let normalized = hex.trim();
    if (!normalized.startsWith('#')) {
      normalized = '#' + normalized;
    }
    // If it's a 9-character hex (with alpha), slice it down to 7 characters
    if (normalized.length === 9) {
      normalized = normalized.slice(0, 7);
    }
    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      return normalized.toLowerCase();
    }
    return '#000000';
  };

  const isResetDisabled = currentColor.toLowerCase() === defaultColor.toLowerCase();
  const swatchColor = getSwatchValue(localHex);

  return (
    <div
      data-section={section.id}
      onClick={onSelect}
      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isActive
          ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-950/20 border-l-4 border-l-indigo-500'
          : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 text-sm truncate">{section.label}</span>
          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
            {section.id}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{section.description}</p>
      </div>

      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Color Swatch wrapper - hides native picker styled behind it */}
        <div 
          className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0 shadow-inner"
          style={{ backgroundColor: swatchColor }}
        >
          <input
            type="color"
            value={swatchColor}
            onChange={handleSwatchChange}
            className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150 opacity-0"
          />
        </div>

        {/* Hex text input */}
        <input
          ref={inputRef}
          type="text"
          value={localHex}
          onChange={handleTextChange}
          className={`w-24 px-2 py-1.5 bg-slate-950 border text-slate-200 rounded text-xs font-mono focus:outline-none focus:ring-1 ${
            isValid
              ? 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              : 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
          }`}
          placeholder="#ffffff"
        />

        {/* Reset button */}
        <button
          onClick={handleReset}
          disabled={isResetDisabled}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Reset to mode default"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ColorInput;
