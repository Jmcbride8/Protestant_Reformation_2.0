import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const FeatureContext = createContext({});

// All features with their defaults (enabled = true means ON by default)
// Children have a `parentKey` pointing to their parent page key.
const DEFAULT_FEATURES = [
  // Pages (top-level)
  { key: 'page_sermons',           label: 'Sermons',              group: 'Pages', enabled: true },
  { key: 'page_vision',            label: 'Vision',               group: 'Pages', enabled: true },
  { key: 'page_contact',           label: 'Contact',              group: 'Pages', enabled: true },
  { key: 'page_services',          label: 'Care',                 group: 'Pages', enabled: true },
  { key: 'page_giving',            label: 'Giving',               group: 'Pages', enabled: true },
  { key: 'page_volunteer',         label: 'Volunteer',            group: 'Pages', enabled: true },
  { key: 'page_community_support', label: 'Community Support',    group: 'Pages', enabled: true },
  { key: 'page_groups',            label: 'Groups',               group: 'Pages', enabled: true },
  { key: 'page_schedule',          label: 'Schedule',             group: 'Pages', enabled: true },
  { key: 'page_milestones',        label: 'Milestones',           group: 'Pages', enabled: true },
  { key: 'page_carpool',           label: 'Carpool',              group: 'Pages', enabled: true },

  // Children of Giving
  { key: 'giving_annual_budget',      label: 'Annual Budget & Transparency', group: 'Pages', enabled: true, parentKey: 'page_giving' },
  { key: 'giving_capital_campaign',   label: 'Capital Campaign',             group: 'Pages', enabled: true, parentKey: 'page_giving' },

  // Children of Groups
  { key: 'link_community_groups',     label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_groups' },

  // Children of Care
  { key: 'link_community_care',       label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_services' },

  // Children of Schedule
  { key: 'link_community_schedule',   label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_schedule' },

  // Children of Milestones
  { key: 'link_community_milestones', label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_milestones' },

  // Children of Volunteer
  { key: 'link_give_time',            label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_volunteer' },

  // Children of Giving (nav)
  { key: 'link_give_financially',     label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_giving' },

  // Children of Community Support
  { key: 'link_give_to_each_other',   label: 'Nav Link',   group: 'Pages', enabled: true, parentKey: 'page_community_support' },

  // Home page (non-toggleable parent for home sub-features)
  { key: 'page_home', label: 'Home', group: 'Pages', enabled: true, nonToggleable: true },

  // Home sub-features
  { key: 'home_member_carousel',      label: 'Member Carousel',    group: 'Home', enabled: true, parentKey: 'page_home' },
  { key: 'home_hero_video',           label: 'Hero Video Button',  group: 'Home', enabled: true, parentKey: 'page_home' },
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