import React, { useState } from 'react';
import { useFeatures } from '@/lib/FeatureContext';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Loader2, ToggleLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function FeatureRow({ feature, getEnabled, saving, onToggle, children, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const enabled = getEnabled(feature);
  const isSaving = saving[feature.key];
  const hasChildren = children && children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center justify-between py-3 ${depth === 0 ? 'px-5' : 'px-5 pl-12 bg-secondary/20'}`}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button onClick={() => setOpen(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors">
              {open
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
          {!hasChildren && depth > 0 && (
            <span className="w-3.5 h-3.5 inline-block border-l-2 border-b-2 border-border/50 rounded-bl-sm ml-0.5 mb-1.5" />
          )}
          <div>
            <p className={`font-body font-medium text-foreground ${depth === 0 ? 'text-sm' : 'text-xs'}`}>
              {feature.label}
            </p>
            {depth === 0 && (
              <p className="font-body text-xs text-muted-foreground font-mono mt-0.5">{feature.key}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
          <Switch
            checked={enabled}
            onCheckedChange={(val) => onToggle(feature, val)}
            disabled={isSaving}
          />
        </div>
      </div>

      {hasChildren && open && (
        <div className="border-t border-border/30">
          {children.map(child => (
            <div key={child.key} className="border-b border-border/20 last:border-0">
              <FeatureRow
                feature={child}
                getEnabled={getEnabled}
                saving={saving}
                onToggle={onToggle}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeatureTogglesManager() {
  const { DEFAULT_FEATURES, reload } = useFeatures();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState({});

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['featureToggles'],
    queryFn: () => base44.entities.FeatureToggle.list(),
  });

  const getRecord = (key) => records.find(r => r.key === key);

  const handleToggle = async (feature, newValue) => {
    setSaving(prev => ({ ...prev, [feature.key]: true }));
    const existing = getRecord(feature.key);
    if (existing) {
      await base44.entities.FeatureToggle.update(existing.id, { enabled: newValue });
    } else {
      await base44.entities.FeatureToggle.create({
        key: feature.key,
        label: feature.label,
        group: feature.group,
        enabled: newValue,
      });
    }
    queryClient.invalidateQueries({ queryKey: ['featureToggles'] });
    reload();
    setSaving(prev => ({ ...prev, [feature.key]: false }));
    toast.success(`${feature.label} ${newValue ? 'enabled' : 'disabled'}`);
  };

  const getEnabled = (feature) => {
    const rec = getRecord(feature.key);
    return rec ? rec.enabled : feature.enabled;
  };

  // Build hierarchy: top-level pages, home standalone
  const topLevelPages = DEFAULT_FEATURES.filter(f => f.group === 'Pages' && !f.parentKey);
  const homeFeatures = DEFAULT_FEATURES.filter(f => f.group === 'Home');
  const getChildren = (key) => DEFAULT_FEATURES.filter(f => f.parentKey === key);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <ToggleLeft className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-heading text-xl text-primary">Feature Toggles</h3>
          <p className="font-body text-sm text-muted-foreground">Enable or disable pages and their features. Click the arrow to expand sub-features.</p>
        </div>
      </div>

      {/* Pages section */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-secondary/40 border-b border-border/50">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold">Pages</p>
        </div>
        <div className="divide-y divide-border/40">
          {topLevelPages.map(feature => (
            <FeatureRow
              key={feature.key}
              feature={feature}
              getEnabled={getEnabled}
              saving={saving}
              onToggle={handleToggle}
              children={getChildren(feature.key)}
              depth={0}
            />
          ))}
        </div>
      </div>

      {/* Home Features section */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-secondary/40 border-b border-border/50">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold">Home Page Features</p>
        </div>
        <div className="divide-y divide-border/40">
          {homeFeatures.map(feature => (
            <FeatureRow
              key={feature.key}
              feature={feature}
              getEnabled={getEnabled}
              saving={saving}
              onToggle={handleToggle}
              depth={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}