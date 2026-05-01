import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import VisionHero from '@/components/vision/VisionHero';
import VisionBackground from '@/components/vision/VisionBackground';
import VisionPhilosophy from '@/components/vision/VisionPhilosophy';
import VisionScale from '@/components/vision/VisionScale';
import FrancisChanChallenge from '@/components/vision/FrancisChanChallenge';
import VisionInPractice from '@/components/vision/VisionInPractice';
import VisionTechnology from '@/components/vision/VisionTechnology';

export default function Vision() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50 bg-accent text-white font-body text-xs px-3 py-1.5 rounded-full shadow-lg">
          ✏️ Edit mode — hover any text to edit
        </div>
      )}
      <VisionHero isAdmin={isAdmin} />
      <VisionBackground isAdmin={isAdmin} />
      <FrancisChanChallenge isAdmin={isAdmin} />
      <VisionScale isAdmin={isAdmin} />
      <VisionPhilosophy isAdmin={isAdmin} />
      <VisionInPractice isAdmin={isAdmin} />
      <VisionTechnology isAdmin={isAdmin} />
    </div>
  );
}