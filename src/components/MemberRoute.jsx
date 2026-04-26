import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Wraps a page and redirects unauthenticated visitors to login.
 * Authenticated users see the page normally.
 */
export default function MemberRoute({ children }) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (authed) {
        setAllowed(true);
      } else {
        base44.auth.redirectToLogin(window.location.href);
      }
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  if (!allowed) return null;
  return children;
}