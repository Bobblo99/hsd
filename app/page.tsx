"use client";

import React from 'react';
import HSDHeroSection from '@/components/sections/HSDHeroSection';
import HandelSection from '@/components/sections/HandelSection';
import ServiceSection from '@/components/sections/ServiceSection';
import DienstleistungSection from '@/components/sections/DienstleistungSection';
import HSDContactSection from '@/components/sections/HSDContactSection';
import Navigation from '@/components/Navigation';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative overflow-x-hidden bg-gray-900">
        <Navigation />
        
        <div className="dark-gradient-mesh">
          <HSDHeroSection />
          <HandelSection />
          <ServiceSection />
          <DienstleistungSection />
          <HSDContactSection />
          <Footer />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}