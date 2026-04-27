import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useFeatures } from '@/lib/FeatureContext';
import { isPreviewingAsGuest } from './layout/MemberPreviewBanner';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function FeatureRoute({ children, featureKey }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const { isEnabled, loaded } = useFeatures();
  const navigate = useNavigate();
  const guestPreview = isPreviewingAsGuest();

  useEffect(() => {
    if (guestPreview) {
      setAuthChecked(true);
      return;
    }
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin(window.location.href);
      } else {
        setIsAuthed(true);
      }
      setAuthChecked(true);
    });
  }, [guestPreview]);

  if (!authChecked || !loaded) return null;

  if (!isEnabled(featureKey)) {
    navigate('/');
    return null;
  }

  if (guestPreview) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-sm mx-auto px-4">
          <LogIn className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-primary mb-2">Sign In Required</h2>
          <p className="font-body text-muted-foreground mb-6">This page is only available to members. Please sign in to continue.</p>
          <Button className="font-body bg-primary" disabled>Sign In</Button>
          <p className="font-body text-xs text-muted-foreground mt-3 italic">(Guest preview mode)</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return null;

  return children;
}