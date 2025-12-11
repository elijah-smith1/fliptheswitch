/**
 * DOM Utility Functions
 * Helper functions for creating and manipulating DOM elements
 */

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes to set
 * @param {...(string|Node)} children - Child elements or text
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (value !== null && value !== undefined) {
      el.setAttribute(key, value);
    }
  }
  
  for (const child of children) {
    if (child === null || child === undefined) continue;
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(c => {
        if (c instanceof Node) el.appendChild(c);
      });
    }
  }
  
  return el;
}

/**
 * Shorthand for createElement
 */
export const h = createElement;

/**
 * Create element from HTML string
 * @param {string} html - HTML string
 * @returns {HTMLElement}
 */
export function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

/**
 * Clear all children from an element
 * @param {HTMLElement} el - Element to clear
 */
export function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Get placeholder image URL from Unsplash
 * @param {string} category - Image category
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Unsplash URL
 */
export function getPlaceholderImage(category = 'fitness', width = 800, height = 600) {
  const categories = {
    fitness: 'gym,workout,fitness',
    athlete: 'athlete,sports,training',
    strength: 'weightlifting,gym,muscle',
    speed: 'running,sprint,track',
    coach: 'coach,training,mentor',
    gym: 'gym,equipment,weights',
    action: 'sports,action,athlete',
    hero: 'gym,dark,fitness'
  };
  
  const query = categories[category] || category;
  return `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=${width}&h=${height}&auto=format&fit=crop`;
}

/**
 * Unsplash image URLs for different contexts
 */
export const unsplashImages = {
  hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop',
  training1: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  training2: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?q=80&w=800&auto=format&fit=crop',
  training3: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  athlete1: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop',
  athlete2: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
  athlete3: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
  gym1: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
  gym2: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800&auto=format&fit=crop',
  coach: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  transformation: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop',
  divider: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop'
};

