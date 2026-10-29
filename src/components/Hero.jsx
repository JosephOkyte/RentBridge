import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, MapPin, Building, Search, CheckCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { CITIES, CATEGORIES } from '../data/properties';

// 11 Comprehensive Placement Images across Nigerian Commercial & Residential Hubs
const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero-lagos-duplex.jpg',
    city: 'Lagos',
    neighborhood: 'Lekki Phase 1',
    description: 'Contemporary 4-Bedroom Semi-Detached Duplex'
  },
  {
    id: 2,
    image: '/images/hero_slider_ikoyi_apartment.jpg',
    city: 'Lagos',
    neighborhood: 'Ikoyi Waterfront',
    description: 'Luxury Serviced Apartments with Scenic Terraces'
  },
  {
    id: 3,
    image: '/images/hero_slider_lekki_street_entrance.jpg',
    city: 'Lagos',
    neighborhood: 'Lekki Gated Estate',
    description: 'Secured Street Entrance, Boom Barrier & Paved Access'
  },
  {
    id: 4,
    image: '/images/hero_slider_lagoon_waterfront.jpg',
    city: 'Lagos',
    neighborhood: 'Victoria Island Lagoon',
    description: 'Upscale Waterfront Penthouse & Lounge Terrace'
  },
  {
    id: 5,
    image: '/images/hero_slider_maitama_terrace.jpg',
    city: 'Abuja',
    neighborhood: 'Maitama District',
    description: 'Executive Gated Terrace Residences'
  },
  {
    id: 6,
    image: '/images/hero_slider_abuja_gwarinpa_plaza.jpg',
    city: 'Abuja',
    neighborhood: 'Gwarinpa Commercial Axis',
    description: 'Modern Retail Plaza & High-Footfall Boutique Spaces'
  },
  {
    id: 7,
    image: '/images/hero_slider_ph_commercial.jpg',
    city: 'Port Harcourt',
    neighborhood: 'Peter Odili / Trans-Amadi',
    description: 'Modern Commercial Showrooms & Plaza Suites'
  },
  {
    id: 8,
    image: '/images/hero_slider_ph_gra_duplex.jpg',
    city: 'Port Harcourt',
    neighborhood: 'Old GRA / GRA Phase 2',
    description: 'Executive Semi-Detached Duplex & Carport'
  },
  {
    id: 9,
    image: '/images/hero_slider_enugu_mansion.jpg',
    city: 'Enugu',
    neighborhood: 'Independence Layout',
    description: 'Prime Contemporary Residential Compound'
  }
];

export default function Hero({ 
  selectedCity, 
  setSelectedCity, 
  selectedCategory, 
  setSelectedCategory, 
  onSearchings
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch swipe coordinates for mobile gestures
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 45) {
      nextSlide(); // Swipe left -> Next
    } else if (touchStartX - touchEndX < -45) {
      prevSlide(); // Swipe right -> Previous
    }
  };

  return (
    <section 
      id="hero" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-18 lg:pb-28 bg-[#151816] text-white select-none">
      
      {/* Background Slideshow: Prominent, clear visibility */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-85' : 'opacity-0 pointer-events-none'
            }`}>
            <img
              src={slide.image}
              alt={slide.description}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
            />
          </div>
        ))}

        {/* Balanced cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#151816]/80 via-[#151816]/50 to-[#151816]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#151816]/35 to-[#151816]/85"></div>
      </div>

      {/* Slide Navigation Arrows (Visible on Mobile & Desktop) */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#2D5A43] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-90 cursor-pointer">
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#2D5A43] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-90 cursor-pointer">
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Hero Foreground Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5 sm:space-y-7">
        
        {/* Top Floating Pill: Active Slide Location */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold shadow-sm max-w-full">
          <MapPin className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
          <span className="truncate">
            <strong className="text-[#8AE0B3]">{HERO_SLIDES[currentSlide].city}:</strong> {HERO_SLIDES[currentSlide].neighborhood}
          </span>
          <span className="hidden xs:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/70 text-[11px] truncate">{HERO_SLIDES[currentSlide].description}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono ml-0.5">
            {currentSlide + 1}/{HERO_SLIDES.length}
          </span>
        </div>

        {/* Main Headline (Underline removed from landlords) */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] drop-shadow-md">
            Bridging the gap between <br className="hidden sm:inline" />
            <span className="text-[#8AE0B3]">
              landlords
            </span> and tenants.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#E2D7C8] leading-relaxed max-w-3xl mx-auto font-normal px-2 sm:px-0">
            No street agents. No exorbitant 10% agency cuts. No ₦5,000 inspection fees. Connect with verified property owners, caretakers, and legal custodians across 
            <strong className="text-white font-semibold"> Lagos, Abuja, Port Harcourt,</strong> and <strong className="text-white font-semibold">Enugu</strong>.
          </p>
        </div>

        {/* Annual Rent Direct Transparency Banner */}
        <div className="max-w-xl mx-auto p-3 sm:p-3.5 rounded-2xl bg-[#1E3F2F]/90 backdrop-blur-md border border-[#2D5A43] shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#8AE0B3]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">Standard Annual Rent</h4>
              <p className="text-[11px] text-[#E2D7C8]">Pay directly to verified property custodians with zero agency cut.</p>
            </div>
          </div>
          <span className="hidden xs:inline-block px-3 py-1 rounded-lg bg-[#2D5A43] text-[#8AE0B3] border border-[#8AE0B3]/30 text-xs font-bold whitespace-nowrap">
            100% Direct
          </span>
        </div>

        {/* Search Box (Mobile-optimized touch inputs) */}
        <div className="max-w-4xl mx-auto p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 text-[#151816]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            
            {/* City Selector */}
            <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8F8372]">Location City</label>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-[#2D5A43] shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#151816] focus:outline-none cursor-pointer py-1">
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8F8372]">Space Category</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Building className="w-4 h-4 text-[#2D5A43] shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#151816] focus:outline-none cursor-pointer py-1">
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={onSearchings}
                className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-[#2D5A43] hover:bg-[#1E3F2F] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2D5A43]/40 cursor-pointer">
                <Search className="w-4 h-4" />
                <span>Search Verified Vacancies</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Guarantees (2-column on mobile, row on tablet/desktop) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 text-left">
            <CheckCircle className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white truncate">₦0 Inspection Fee</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 text-left">
            <CheckCircle className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white truncate">0% Middleman Cut</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 text-left">
            <CheckCircle className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white truncate">100% Verified Titles</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 text-left">
            <Sparkles className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white truncate">Annual Direct Rent</span>
          </div>
        </div>

        {/* Slideshow Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
          {HERO_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentSlide(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer p-1 -m-1 ${
                dotIdx === currentSlide
                  ? 'w-6 sm:w-8 bg-[#8AE0B3]'
                  : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
