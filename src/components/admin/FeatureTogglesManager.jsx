import React, { useState } from 'react';
import { useFeatures } from '@/lib/FeatureContext';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Loader2, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

  const groups = [...new Set(DEFAULT_FEATURES.map(f => f.group))];

  const getEnabled = (feature) => {
    const rec = getRecord(feature.key);
    return rec ? rec.enabled : feature.enabled;
  };

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
          <p className="font-body text-sm text-muted-foreground">Enable or disable pages and features across the site.</p>
        </div>
      </div>

      {groups.map(group => {
        const groupFeatures = DEFAULT_FEATURES.filter(f => f.group === group);
        return (
          <div key={group} className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-secondary/40 border-b border-border/50">
              <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold">{group}</p>
            </div>
            <div className="divide-y divide-border/40">
              {groupFeatures.map(feature => {
                const enabled = getEnabled(feature);
                const isSaving = saving[feature.key];
                return (
                  <div key={feature.key} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{feature.label}</p>
                      <p className="font-body text-xs text-muted-foreground font-mono mt-0.5">{feature.key}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                      <Switch
                        checked={enabled}
                        onCheckedChange={(val) => handleToggle(feature, val)}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}