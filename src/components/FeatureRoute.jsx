import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useFeatures } from '@/lib/FeatureContext';

export default function FeatureRoute({ children, featureKey }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const { isEnabled, loaded } = useFeatures();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin(window.location.href);
      } else {
        setIsAuthed(true);
      }
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked || !loaded) return null;

  if (!isAuthed) return null;

  if (!isEnabled(featureKey)) {
    navigate('/');
    return null;
  }

  return children;
}