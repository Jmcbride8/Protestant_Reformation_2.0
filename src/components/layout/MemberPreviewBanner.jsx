import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye, X } from 'lucide-react';

export const PREVIEW_KEY = 'previewAsMember';
export const GUEST_PREVIEW_KEY = 'previewAsGuest';

export function isPreviewingAsMember() {
  return sessionStorage.getItem(PREVIEW_KEY) === 'true';
}

export function isPreviewingAsGuest() {
  return sessionStorage.getItem(GUEST_PREVIEW_KEY) === 'true';
}

export function startMemberPreview() {
  sessionStorage.setItem(PREVIEW_KEY, 'true');
  sessionStorage.removeItem(GUEST_PREVIEW_KEY);
}

export function startGuestPreview() {
  sessionStorage.setItem(GUEST_PREVIEW_KEY, 'true');
  sessionStorage.removeItem(PREVIEW_KEY);
}

export function stopMemberPreview() {
  sessionStorage.removeItem(PREVIEW_KEY);
}

export function stopGuestPreview() {
  sessionStorage.removeItem(GUEST_PREVIEW_KEY);
}

export default function MemberPreviewBanner() {
  const location = useLocation();
  const [isMember, setIsMember] = useState(isPreviewingAsMember());
  const [isGuest, setIsGuest] = useState(isPreviewingAsGuest());

  useEffect(() => {
    setIsMember(isPreviewingAsMember());
    setIsGuest(isPreviewingAsGuest());
  }, [location.pathname]);

  if (!isMember && !isGuest) return null;

  const handleExit = () => {
    stopMemberPreview();
    stopGuestPreview();
    window.location.href = '/admin';
  };

  return (
    <div className="bg-accent text-accent-foreground px-4 py-2.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 font-body text-sm font-medium">
        <Eye className="w-4 h-4" />
        {isMember ? 'Previewing as Member' : 'Previewing as Guest (not signed in)'}
      </div>
      <button
        onClick={handleExit}
        className="flex items-center gap-1.5 font-body text-sm underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        <X className="w-4 h-4" />
        Exit Preview
      </button>
    </div>
  );
}