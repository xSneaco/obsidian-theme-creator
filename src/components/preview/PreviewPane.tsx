import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/useTheme';
import { SECTIONS } from '../../theme/sections';
import { deriveSection } from '../../theme/derive';
import { MockTitleBar } from './MockTitleBar';
import { MockLeftSidebar } from './MockLeftSidebar';
import { MockEditor } from './MockEditor';
import { MockRightSidebar } from './MockRightSidebar';
import { ClickOverlay } from './ClickOverlay';
import './preview.css';

export function PreviewPane() {
  const { state } = useTheme();
  const { colors } = state;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Measure container width and calculate scale factor to fit within 680px
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const naturalWidth = 680; // natural width of the preview pane
        if (width < naturalWidth) {
          setScale(width / naturalWidth);
        } else {
          setScale(1);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute all derived CSS custom properties whenever the theme colors change
  const previewStyle = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const section of SECTIONS) {
      const hex = colors[section.id];
      if (hex) {
        const derived = deriveSection(section.id, hex);
        Object.assign(vars, derived);
      }
    }
    return vars as React.CSSProperties;
  }, [colors]);

  const wrapperStyle = {
    ...previewStyle,
    height: `${580 * scale}px`,
  };

  const layoutStyle = scale < 1
    ? {
        transform: `scale(${scale})`,
        width: '680px',
        height: '580px',
      }
    : {
        width: '100%',
        height: '105%', // slight buffer to avoid minor rounding gap at the bottom
      };

  return (
    <div ref={containerRef} className="preview-wrapper relative overflow-hidden" style={wrapperStyle}>
      <div 
        className="preview-layout relative origin-top-left absolute top-0 left-0" 
        style={layoutStyle}
      >
        {/* Mock Window title bar */}
        <MockTitleBar />

        {/* Main Work Area */}
        <div className="preview-main-container">
          <MockLeftSidebar />
          <MockEditor />
          <MockRightSidebar />
        </div>

        {/* Transparent Interactive Selection Overlays */}
        <ClickOverlay />
      </div>
    </div>
  );
}

export default PreviewPane;
