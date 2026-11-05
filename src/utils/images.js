// Centralized image registry ensuring all real estate placement assets
// resolve properly across Next.js and Vite environments

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

const getImageSrc = (img) => (typeof img === 'object' && img?.src ? img.src : img);

export const IMAGES = {
  heroLagosDuplex: getImageSrc(heroLagosDuplex),
  heroIkoyiApartment: getImageSrc(heroIkoyiApartment),
  heroLekkiEntrance: getImageSrc(heroLekkiEntrance),
  heroLagoonWaterfront: getImageSrc(heroLagoonWaterfront),
  heroMaitamaTerrace: getImageSrc(heroMaitamaTerrace),
  heroAbujaPlaza: getImageSrc(heroAbujaPlaza),
  heroPhCommercial: getImageSrc(heroPhCommercial),
  heroPhGraDuplex: getImageSrc(heroPhGraDuplex),
  heroEnuguMansion: getImageSrc(heroEnuguMansion),
  commercialAbujaBoutique: getImageSrc(commercialAbujaBoutique),
  industrialWarehouse: getImageSrc(industrialWarehouse),
  interiorLivingRoom: getImageSrc(interiorLivingRoom),
};

const FILENAME_MAP = {
  'hero-lagos-duplex.jpg': IMAGES.heroLagosDuplex,
  'hero_slider_ikoyi_apartment.jpg': IMAGES.heroIkoyiApartment,
  'hero_slider_lekki_street_entrance.jpg': IMAGES.heroLekkiEntrance,
  'hero_slider_lagoon_waterfront.jpg': IMAGES.heroLagoonWaterfront,
  'hero_slider_maitama_terrace.jpg': IMAGES.heroMaitamaTerrace,
  'hero_slider_abuja_gwarinpa_plaza.jpg': IMAGES.heroAbujaPlaza,
  'hero_slider_ph_commercial.jpg': IMAGES.heroPhCommercial,
  'hero_slider_ph_gra_duplex.jpg': IMAGES.heroPhGraDuplex,
  'hero_slider_enugu_mansion.jpg': IMAGES.heroEnuguMansion,
  'commercial-abuja-boutique.jpg': IMAGES.commercialAbujaBoutique,
  'industrial-warehouse.jpg': IMAGES.industrialWarehouse,
  'interior-living-room.jpg': IMAGES.interiorLivingRoom,
};

/**
 * Resolves any image path or filename to a guaranteed valid URL string.
 */
export function resolveImageUrl(path) {
  if (!path) return IMAGES.heroLagosDuplex;
  if (typeof path === 'object' && path?.src) return path.src;
  if (typeof path !== 'string') return '';
  if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const filename = path.split('/').pop();
  if (FILENAME_MAP[filename]) {
    return FILENAME_MAP[filename];
  }

  return path.startsWith('/') ? path : `/${path}`;
}
