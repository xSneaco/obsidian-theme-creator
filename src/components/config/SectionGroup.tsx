import React, { useState } from 'react';

interface SectionGroupProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function SectionGroup({ title, defaultOpen = true, children }: SectionGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Check if any of the child inputs are active
  const hasActiveChild = React.Children.toArray(children).some((child) => {
    if (React.isValidElement<{ isActive?: boolean }>(child)) {
      return child.props.isActive;
    }
    return false;
  });

  // Auto-expand the group if a section inside it becomes active (e.g. from preview click).
  // Adjust state during render rather than in an effect to avoid cascading renders.
  const [prevHasActiveChild, setPrevHasActiveChild] = useState(hasActiveChild);
  if (hasActiveChild !== prevHasActiveChild) {
    setPrevHasActiveChild(hasActiveChild);
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-slate-800/80 rounded-xl bg-slate-900/20 overflow-hidden transition-all duration-200">
      {/* Header */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 hover:bg-slate-900/80 text-left cursor-pointer transition-colors focus:outline-none"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body transition container using CSS grid fraction row transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3 flex flex-col gap-2 border-t border-slate-900/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionGroup;
