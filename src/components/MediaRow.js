/**
 * MediaRow Component
 * Triple-column media row with images and captions
 */

import { h } from '@/utils/dom.js';

/**
 * Create a media row with three items
 * @param {Object} props - MediaRow properties
 * @param {Array} props.items - Array of media items { src, alt, caption, placeholder }
 * @returns {HTMLElement}
 */
export function MediaRow({ items = [] }) {
  const mediaItems = items.map(item => {
    if (item.src) {
      // Real image
      return h('div', { className: 'media-row__item' },
        h('img', { src: item.src, alt: item.alt || '' }),
        item.caption ? h('span', { className: 'media-row__caption' }, item.caption) : null
      );
    } else {
      // Placeholder
      return h('div', { 
        className: 'media-row__item media-row__item--placeholder',
        'data-label': item.placeholder || 'Image'
      });
    }
  });
  
  // Ensure we have exactly 3 items (pad with placeholders if needed)
  while (mediaItems.length < 3) {
    mediaItems.push(
      h('div', { 
        className: 'media-row__item media-row__item--placeholder',
        'data-label': 'Image'
      })
    );
  }
  
  return h('div', { className: 'media-row' }, ...mediaItems.slice(0, 3));
}

export default MediaRow;

