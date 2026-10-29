import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import VerificationGuide from './components/VerificationGuide';
import MapExplorer from './components/MapExplorer';
import SavingsCalculator from './components/SavingsCalculator';
import PropertyList from './components/PropertyList';
import PropertyDetailModal from './components/PropertyDetailModal';
import InspectionModal from './components/InspectionModal';
import ListPropertyModal from './components/ListPropertyModal';
import Footer from './components/Footer';

export default function App() {
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
