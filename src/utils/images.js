// Centralized image registry ensuring all real estate placement assets
// are bundled directly by Vite and resolve properly in any hosting environment
// (root domains, subdirectories like GitHub Pages /RentBridge/, Vercel, Netlify, etc.)

import heroLagosDuplex from '../assets/images/hero-lagos-duplex.jpg';
import heroIkoyiApartment from '../assets/images/hero_slider_ikoyi_apartment.jpg';
import heroLekkiEntrance from '../assets/images/hero_slider_lekki_street_entrance.jpg';
import heroLagoonWaterfront from '../assets/images/hero_slider_lagoon_waterfront.jpg';
import heroMaitamaTerrace from '../assets/images/hero_slider_maitama_terrace.jpg';
import heroAbujaPlaza from '../assets/images/hero_slider_abuja_gwarinpa_plaza.jpg';
import heroPhCommercial from '../assets/images/hero_slider_ph_commercial.jpg';
import heroPhGraDuplex from '../assets/images/hero_slider_ph_gra_duplex.jpg';
import heroEnuguMansion from '../assets/images/hero_slider_enugu_mansion.jpg';
import commercialAbujaBoutique from '../assets/images/commercial-abuja-boutique.jpg';
import industrialWarehouse from '../assets/images/industrial-warehouse.jpg';
import interiorLivingRoom from '../assets/images/interior-living-room.jpg';

export const IMAGES = {
  heroLagosDuplex,
  heroIkoyiApartment,
  heroLekkiEntrance,
  heroLagoonWaterfront,
  heroMaitamaTerrace,
  heroAbujaPlaza,
  heroPhCommercial,
  heroPhGraDuplex,
  heroEnuguMansion,
  commercialAbujaBoutique,
  industrialWarehouse,
  interiorLivingRoom,
};

const FILENAME_MAP = {
  'hero-lagos-duplex.jpg': heroLagosDuplex,
  'hero_slider_ikoyi_apartment.jpg': heroIkoyiApartment,
  'hero_slider_lekki_street_entrance.jpg': heroLekkiEntrance,
  'hero_slider_lagoon_waterfront.jpg': heroLagoonWaterfront,
  'hero_slider_maitama_terrace.jpg': heroMaitamaTerrace,
  'hero_slider_abuja_gwarinpa_plaza.jpg': heroAbujaPlaza,
  'hero_slider_ph_commercial.jpg': heroPhCommercial,
  'hero_slider_ph_gra_duplex.jpg': heroPhGraDuplex,
  'hero_slider_enugu_mansion.jpg': heroEnuguMansion,
  'commercial-abuja-boutique.jpg': commercialAbujaBoutique,
  'industrial-warehouse.jpg': industrialWarehouse,
  'interior-living-room.jpg': interiorLivingRoom,
};

/**
 * Resolves any image path or filename to a guaranteed bundled URL.
 */
export function resolveImageUrl(path) {
  if (!path) return heroLagosDuplex;
  if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const filename = path.split('/').pop();
  if (FILENAME_MAP[filename]) {
    return FILENAME_MAP[filename];
  }

  // Fallback using Vite base URL
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanBase + cleanPath;
}
