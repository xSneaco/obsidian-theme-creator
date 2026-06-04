import React from 'react';
import { useTheme } from '../../context/useTheme';

export function ClickOverlay() {
  const { state, setActiveSection } = useTheme();

  const handleSelect = (sectionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSection(sectionId);
  };

  return (
    <>
      {/* Titlebar Overlay */}
      <div
        className={`preview-interactive-region absolute top-0 left-0 right-0 h-[36px] z-30 ${
          state.activeSection === 'bg-tertiary' ? 'active-outline' : ''
        }`}
        data-label="Titlebar Background (bg-tertiary)"
        onClick={handleSelect('bg-tertiary')}
      />

      {/* Left Sidebar Overlay */}
      <div
        className={`preview-interactive-region absolute top-[36px] left-0 w-[180px] bottom-0 z-30 ${
          state.activeSection === 'bg-secondary' ? 'active-outline' : ''
        }`}
        data-label="Sidebar Background (bg-secondary)"
        onClick={handleSelect('bg-secondary')}
      />

      {/* Right Sidebar Overlay */}
      <div
        className={`preview-interactive-region absolute top-[36px] right-0 w-[180px] bottom-0 z-30 ${
          state.activeSection === 'bg-secondary' ? 'active-outline' : ''
        }`}
        data-label="Sidebar Background (bg-secondary)"
        onClick={handleSelect('bg-secondary')}
      />

      {/* Editor Background Overlay */}
      {/* Sits at z-10 so that relatively positioned text elements in the editor (z-20) sit on top and remain hoverable/clickable */}
      <div
        className={`preview-interactive-region absolute top-[36px] left-[180px] right-[180px] bottom-0 z-10 ${
          state.activeSection === 'bg-primary' ? 'active-outline' : ''
        }`}
        data-label="Editor Background (bg-primary)"
        onClick={handleSelect('bg-primary')}
      />
    </>
  );
}
