import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, X } from 'lucide-react';

export const PREVIEW_KEY = 'previewAsMember';

export function isPreviewingAsMember() {
  return sessionStorage.getItem(PREVIEW_KEY) === 'true';
}

export function startMemberPreview() {
  sessionStorage.setItem(PREVIEW_KEY, 'true');
}

export function stopMemberPreview() {
  sessionStorage.removeItem(PREVIEW_KEY);
}

export default function MemberPreviewBanner() {
  const [active, setActive] = React.useState(isPreviewingAsMember());

  if (!active) return null;

  const handleExit = () => {
    stopMemberPreview();
    setActive(false);
    window.location.href = '/admin';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-accent text-accent-foreground px-4 py-2.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 font-body text-sm font-medium">
        <Eye className="w-4 h-4" />
        Previewing as Member
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