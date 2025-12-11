/**
 * Firestore Service
 * Provides functions to fetch content from Firebase Firestore
 */

import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db, SITE_ID } from './config.js';

/**
 * Get page content from Firestore
 * @param {string} siteId - The site identifier
 * @param {string} pageId - The page identifier (home, about, contact, etc.)
 * @returns {Promise<Object|null>} Page content or null if not found
 */
export async function getPageContent(siteId = SITE_ID, pageId) {
  try {
    const docRef = doc(db, 'sites', siteId, 'pages', pageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    console.warn(`Page not found: ${pageId}`);
    return null;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
}

/**
 * Get navigation structure from Firestore
 * @param {string} siteId - The site identifier
 * @returns {Promise<Object|null>} Navigation data or null
 */
export async function getNavigation(siteId = SITE_ID) {
  try {
    const docRef = doc(db, 'sites', siteId, 'navigation', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    // Fallback to default navigation
    return getDefaultNavigation();
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return getDefaultNavigation();
  }
}

/**
 * Get gallery images from Firestore
 * @param {string} siteId - The site identifier
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of gallery images
 */
export async function getGalleryImages(siteId = SITE_ID, category = null) {
  try {
    const galleryRef = collection(db, 'sites', siteId, 'media', 'gallery', 'images');
    
    let q;
    if (category) {
      q = query(galleryRef, where('category', '==', category), orderBy('order', 'asc'));
    } else {
      q = query(galleryRef, orderBy('order', 'asc'));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

/**
 * Get site settings from Firestore
 * @param {string} siteId - The site identifier
 * @returns {Promise<Object|null>} Site settings or null
 */
export async function getSiteSettings(siteId = SITE_ID) {
  try {
    const docRef = doc(db, 'sites', siteId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    return getDefaultSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return getDefaultSiteSettings();
  }
}

/**
 * Get footer content from Firestore
 * @param {string} siteId - The site identifier
 * @returns {Promise<Object|null>} Footer data or null
 */
export async function getFooter(siteId = SITE_ID) {
  try {
    const docRef = doc(db, 'sites', siteId, 'components', 'footer');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    return getDefaultFooter();
  } catch (error) {
    console.error('Error fetching footer:', error);
    return getDefaultFooter();
  }
}

// ============================================
// DEFAULT FALLBACK DATA
// Used when Firestore data is not available
// ============================================

function getDefaultNavigation() {
  return {
    brand: {
      text: 'Flip The Switch',
      href: '/'
    },
    items: [
      { text: 'Home', href: '/', id: 'home' },
      { text: 'About', href: '/about', id: 'about' },
      { text: 'Programs', href: '/programs', id: 'programs' },
      { text: 'Schedule', href: '/schedule', id: 'schedule' },
      { text: 'Gallery', href: '/gallery', id: 'gallery' },
      { text: 'Contact', href: '/contact', id: 'contact' }
    ]
  };
}

function getDefaultSiteSettings() {
  return {
    name: 'Flip The Switch Performance',
    tagline: 'Elite Performance Coaching',
    email: 'train@fliptheswitch.co',
    phone: '',
    location: 'Los Angeles, CA',
    hours: {
      weekday: 'Mon–Fri: 5AM – 8PM',
      saturday: 'Sat: 7AM – 2PM',
      sunday: 'Sun: Closed'
    },
    social: {
      instagram: '#',
      youtube: '#',
      tiktok: '#',
      twitter: '#'
    }
  };
}

function getDefaultFooter() {
  return {
    brand: 'Flip The Switch Performance',
    email: 'train@fliptheswitch.co',
    copyright: '© 2025 Flip The Switch. All rights reserved.',
    social: [
      { platform: 'instagram', label: 'IG', href: '#' },
      { platform: 'youtube', label: 'YT', href: '#' },
      { platform: 'tiktok', label: 'TT', href: '#' }
    ]
  };
}

export { getDefaultNavigation, getDefaultSiteSettings, getDefaultFooter };

