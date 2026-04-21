import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import PillarsSection from '../components/home/PillarsSection';
import LifeMilestonesSection from '../components/home/LifeMilestonesSection';
import ServicesPreview from '../components/home/ServicesPreview';
import CTASection from '../components/home/CTASection';
import MemberCarousel from '../components/home/MemberCarousel';
import { base44 } from '@/api/base44Client';

const HERO_IMAGE = "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/bf1e22f72_generated_8701a21c.png";
const PILLAR_IMAGES = [
  "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/a7e7786e8_generated_38046063.png",
  "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/10840d224_generated_f2d5f6fa.png",
  "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/9590d7441_generated_eec6b9de.png",
];
const WEDDING_IMAGE = "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/f8ec93d73_generated_88529c19.png";
const MEAL_IMAGE = "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/c5ea470bd_generated_d498e9e2.png";
const KIDS_IMAGE = "https://images.unsplash.com/photo-1564516287928-4259ef38c4cb?w=600&q=80";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection heroImage={HERO_IMAGE} isAdmin={isAdmin} />
      <PillarsSection images={PILLAR_IMAGES} isAdmin={isAdmin} />
      <LifeMilestonesSection weddingImage={WEDDING_IMAGE} mealImage={MEAL_IMAGE} kidsImage={KIDS_IMAGE} isAdmin={isAdmin} />
      <ServicesPreview />
      <MemberCarousel isAdmin={isAdmin} />
      <CTASection />
    </div>
  );
}