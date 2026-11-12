'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import VerificationGuide from '../components/VerificationGuide';
import SavingsCalculator from '../components/SavingsCalculator';
import PropertyList from '../components/PropertyList';
import PropertyDetailModal from '../components/PropertyDetailModal';
import InspectionModal from '../components/InspectionModal';
import ListPropertyModal from '../components/ListPropertyModal';
import Footer from '../components/Footer';
import { PROPERTIES } from '../data/properties';

// Dynamic import with ssr: false for Leaflet Map to eliminate server-side window errors
const MapExplorer = dynamic(() => import('../components/MapExplorer'), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[#8F8372]">
      <div className="h-[420px] rounded-3xl bg-[#F5EFEB] border border-[#E8DFC8] flex items-center justify-center animate-pulse">
        <p className="text-sm font-bold text-[#2D5A43]">Loading Verified Google Map Explorer...</p>
      </div>
    </div>
  ),
});

function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modals state
  const [activePropertyModal, setActivePropertyModal] = useState(null);
  const [activeInspectionProperty, setActiveInspectionProperty] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Smooth scroll handler
  const handleNavigateToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle URL highlight query param (e.g. from Dashboard "View Live Page")
  useEffect(() => {
    const highlightId = searchParams?.get('highlight');
    if (highlightId) {
      const match = PROPERTIES.find((p) => String(p.id) === String(highlightId));
      if (match) {
        setActivePropertyModal(match);
        handleNavigateToSection('properties');
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#151816]">
      {/* Top Navbar */}
      <Navbar
        onOpenListModal={() => setIsListModalOpen(true)}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSearchings={() => handleNavigateToSection('properties')}
        />

        {/* About RentBridge Section */}
        <AboutSection
          onExploreVacancies={() => handleNavigateToSection('properties')}
        />

        {/* The Verification & Anti-Fraud Process Section */}
        <VerificationGuide />

        {/* Interactive Google Map Discovery */}
        <MapExplorer
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          onSelectProperty={(property) => setActivePropertyModal(property)}
        />

        {/* Savings Calculator (Traditional Agent vs RentBridge) */}
        <SavingsCalculator
          onExploreProperties={() => handleNavigateToSection('properties')}
        />

        {/* Full Property Feed */}
        <PropertyList
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSelectProperty={(property) => setActivePropertyModal(property)}
          onBookInspection={(property) => setActiveInspectionProperty(property)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigateToSection={handleNavigateToSection}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          handleNavigateToSection('properties');
        }}
        onOpenListModal={() => setIsListModalOpen(true)}
      />

      {/* Modals */}
      {activePropertyModal && (
        <PropertyDetailModal
          property={activePropertyModal}
          onClose={() => setActivePropertyModal(null)}
          onBookInspection={(prop) => {
            setActivePropertyModal(null);
            setActiveInspectionProperty(prop);
          }}
        />
      )}

      {activeInspectionProperty && (
        <InspectionModal
          property={activeInspectionProperty}
          onClose={() => setActiveInspectionProperty(null)}
        />
      )}

      {isListModalOpen && (
        <ListPropertyModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2D5A43] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

