import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VisionHero from '@/components/vision/VisionHero';
import VisionPhilosophy from '@/components/vision/VisionPhilosophy';
import VisionScale from '@/components/vision/VisionScale';
import VisionInPractice from '@/components/vision/VisionInPractice';
import VisionTechnology from '@/components/vision/VisionTechnology';

export default function Vision() {
  return (
    <div className="min-h-screen bg-background">
      <VisionHero />
      <VisionPhilosophy />
      <VisionScale />
      <VisionInPractice />
      <VisionTechnology />
    </div>
  );
}