import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { isPreviewingAsGuest } from './layout/MemberPreviewBanner';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

/**
 * Wraps a page and redirects unauthenticated visitors to login.
 * Authenticated users see the page normally.
 */
export default function MemberRoute({ children }) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const guestPreview = isPreviewingAsGuest();

  useEffect(() => {
    if (guestPreview) {
      setChecked(true);
      return;
    }
    base44.auth.isAuthenticated().then((authed) => {
      if (authed) {
        setAllowed(true);
      } else {
        base44.auth.redirectToLogin(window.location.href);
      }
      setChecked(true);
    });
  }, [guestPreview]);

  if (!checked) return null;

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

  if (!allowed) return null;
  return children;
}