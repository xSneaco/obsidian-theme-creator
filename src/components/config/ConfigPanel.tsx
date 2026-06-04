import { useState, useEffect } from 'react';
import { useTheme } from '../../context/useTheme';
import { SECTIONS } from '../../theme/sections';
import SectionGroup from './SectionGroup';
import ColorInput from './ColorInput';

export function ConfigPanel() {
  const { state, setColor, setActiveSection } = useTheme();
  const { activeSection, colors, mode } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'backgrounds' | 'text' | 'ui-elements' | 'syntax'>('all');

  // Smoothly scroll active section into view when it changes
  useEffect(() => {
    if (activeSection) {
      const element = document.querySelector(`[data-section="${activeSection}"]`);
      if (element) {
        // Wait a short time for the collapsible group to finish expanding/rendering
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSection]);

  const groups = [
    { id: 'backgrounds' as const, name: 'Backgrounds', defaultOpen: true },
    { id: 'text' as const, name: 'Text', defaultOpen: true },
    { id: 'ui-elements' as const, name: 'UI Elements', defaultOpen: true },
    { id: 'syntax' as const, name: 'Syntax', defaultOpen: false },
  ];

  const hasAnyMatches = SECTIONS.some((section) => {
    const matchesSearch =
      section.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || section.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 overflow-hidden">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-300">Theme Color Editor</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Customize variables & colors</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Dropdown Selector */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Groups</option>
            <option value="backgrounds">Backgrounds</option>
            <option value="text">Text</option>
            <option value="ui-elements">UI Elements</option>
            <option value="syntax">Syntax</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-full sm:w-44"
          />
        </div>
      </div>

      {/* Scrollable Groups Container */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
        {hasAnyMatches ? (
          groups.map((group) => {
            // Apply group filter
            if (selectedGroup !== 'all' && selectedGroup !== group.id) {
              return null;
            }

            // Filter sections inside this group by search query
            const groupSections = SECTIONS.filter(
              (section) =>
                section.group === group.id &&
                (section.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  section.id.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            // Hide the group if no items match
            if (groupSections.length === 0) {
              return null;
            }

            return (
              <SectionGroup key={group.id} title={group.name} defaultOpen={group.defaultOpen}>
                {groupSections.map((section) => {
                  const currentColor = colors[section.id] || '';
                  const defaultColor = mode === 'dark' ? section.defaultDark : section.defaultLight;
                  const isActive = activeSection === section.id;

                  return (
                    <ColorInput
                      key={section.id}
                      section={section}
                      currentColor={currentColor}
                      defaultColor={defaultColor}
                      isActive={isActive}
                      onSelect={() => setActiveSection(section.id)}
                      setColor={setColor}
                    />
                  );
                })}
              </SectionGroup>
            );
          })
        ) : (
          <div className="py-16 text-center text-slate-500">
            <svg
              className="w-10 h-10 mx-auto opacity-30 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-xs">No variables match your search filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfigPanel;
