import React from 'react';

const TABS = [
  { key: 'budget', label: 'Annual Budget' },
  { key: 'funds', label: 'Special Funds' },
  { key: 'group', label: 'Group Fund' },
];

export default function GivingTabs({ active, onChange, showGroup }) {
  const visibleTabs = showGroup ? TABS : TABS.filter(t => t.key !== 'group');

  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-secondary/50 rounded-xl p-1 gap-1">
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`font-body text-sm px-5 py-2.5 rounded-lg transition-all font-medium ${
              active === tab.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}