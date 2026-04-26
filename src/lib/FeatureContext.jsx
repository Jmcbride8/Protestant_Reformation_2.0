import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const FeatureContext = createContext({});

// All features with their defaults (enabled = true means ON by default)
const DEFAULT_FEATURES = [
  // Pages
  { key: 'page_sermons',          label: 'Sermons Page',             group: 'Pages', enabled: true },
  { key: 'page_vision',           label: 'Vision Page',              group: 'Pages', enabled: true },
  { key: 'page_contact',          label: 'Contact Page',             group: 'Pages', enabled: true },
  { key: 'page_services',         label: 'Care Page',                group: 'Pages', enabled: true },
  { key: 'page_giving',           label: 'Giving Page',              group: 'Pages', enabled: true },
  { key: 'page_volunteer',        label: 'Volunteer Page',           group: 'Pages', enabled: true },
  { key: 'page_community_support',label: 'Community Support Page',   group: 'Pages', enabled: true },
  { key: 'page_groups',           label: 'Groups Page',              group: 'Pages', enabled: true },
  { key: 'page_schedule',         label: 'Schedule Page',            group: 'Pages', enabled: true },
  { key: 'page_milestones',       label: 'Milestones Page',          group: 'Pages', enabled: true },
  { key: 'page_carpool',          label: 'Carpool Page',             group: 'Pages', enabled: true },
  // Community nav links
  { key: 'link_community_groups',     label: 'Groups Nav Link',          group: 'Community Nav', enabled: true },
  { key: 'link_community_care',       label: 'Care Nav Link',            group: 'Community Nav', enabled: true },
  { key: 'link_community_schedule',   label: 'Schedule Nav Link',        group: 'Community Nav', enabled: true },
  { key: 'link_community_milestones', label: 'Milestones Nav Link',      group: 'Community Nav', enabled: true },
  // Give nav links
  { key: 'link_give_time',            label: 'Give Time Nav Link',       group: 'Give Nav', enabled: true },
  { key: 'link_give_financially',     label: 'Give Financially Nav Link',group: 'Give Nav', enabled: true },
  { key: 'link_give_to_each_other',   label: 'Give to Each Other Nav Link', group: 'Give Nav', enabled: true },
  // Giving sub-features
  { key: 'giving_annual_budget',      label: 'Annual Budget & Transparency', group: 'Giving Features', enabled: true },
  { key: 'giving_capital_campaign',   label: 'Capital Campaign',         group: 'Giving Features', enabled: true },
  // Home sub-features
  { key: 'home_member_carousel',      label: 'Member Carousel (Home)',   group: 'Home Features', enabled: true },
  { key: 'home_hero_video',           label: 'Hero Video Button (Home)', group: 'Home Features', enabled: true },
];

export const FeatureProvider = ({ children }) => {
  const [features, setFeatures] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadFeatures();

    // Subscribe to real-time changes
    const unsub = base44.entities.FeatureToggle.subscribe((event) => {
      if (event.type === 'update' || event.type === 'create') {
        setFeatures(prev => ({ ...prev, [event.data.key]: event.data.enabled }));
      }
    });
    return () => unsub();
  }, []);

  const loadFeatures = async () => {
    try {
      const records = await base44.entities.FeatureToggle.list();
      const map = {};
      records.forEach(r => { map[r.key] = r.enabled; });
      setFeatures(map);
    } catch (e) {
      // fallback: all enabled
    }
    setLoaded(true);
  };

  const isEnabled = (key) => {
    // If no record exists yet, default to true
    if (!(key in features)) return true;
    return features[key];
  };

  return (
    <FeatureContext.Provider value={{ isEnabled, features, loaded, DEFAULT_FEATURES, reload: loadFeatures }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => useContext(FeatureContext);