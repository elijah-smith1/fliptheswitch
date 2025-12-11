/**
 * ImageDivider Component
 * Full-width image divider between sections
 */

import { h } from '@/utils/dom.js';

/**
 * Create a full-width image divider
 * @param {Object} props - ImageDivider properties
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.placeholder - Placeholder label text
 * @returns {HTMLElement}
 */
export function ImageDivider({ src = '', alt = '', placeholder = 'Full Width Image' }) {
  if (src) {
    return h('div', { className: 'image-divider' },
      h('img', { src, alt })
    );
  }
  
  return h('div', { 
    className: 'image-divider image-divider--placeholder',
    'data-label': placeholder
  });
}

export default ImageDivider;

